import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import mongoose, { type Model } from "mongoose";
import { ConfigurationError } from "./errors";
import { connectDatabase } from "./database.server";

const scrypt = promisify(nodeScrypt);
const cookieName = "trivon_admin";
const sessionDuration = 8 * 60 * 60;

type AdminUser = {
  email: string;
  passwordHash: string;
  failedAttempts: number;
  lockedUntil?: Date | undefined;
};

const adminSchema = new mongoose.Schema<AdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    failedAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true },
);

const Admin =
  (mongoose.models["AdminUser"] as Model<AdminUser> | undefined) ??
  mongoose.model<AdminUser>("AdminUser", adminSchema);

function signingKey(): Uint8Array {
  const secret = process.env["SESSION_SECRET"];
  if (!secret || secret.length < 32) {
    throw new ConfigurationError(
      "SESSION_SECRET must contain at least 32 characters. See .env.example.",
    );
  }
  return new TextEncoder().encode(secret);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scrypt(password, Buffer.from(saltHex, "hex"), expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function bootstrapAdmin(): Promise<void> {
  signingKey();
  await connectDatabase();
  if (await Admin.exists({})) return;
  const email = process.env["ADMIN_EMAIL"]?.trim().toLowerCase();
  const password = process.env["ADMIN_PASSWORD"];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ConfigurationError(
      "Set ADMIN_EMAIL to a valid email address before creating the first admin.",
    );
  }
  if (!password || password.length < 12) {
    throw new ConfigurationError(
      "Set ADMIN_PASSWORD to at least 12 characters before creating the first admin.",
    );
  }
  await Admin.create({ email, passwordHash: await hashPassword(password) });
}

export async function authenticateAdmin(email: string, password: string): Promise<string | null> {
  await connectDatabase();
  const user = await Admin.findOne({ email: email.trim().toLowerCase() });
  if (!user || (user.lockedUntil && user.lockedUntil.getTime() > Date.now())) return null;
  if (!(await verifyPassword(password, user.passwordHash))) {
    user.failedAttempts += 1;
    if (user.failedAttempts >= 5) {
      user.failedAttempts = 0;
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await user.save();
    return null;
  }
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  await user.save();
  return new SignJWT({ email: user.email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("trivon")
    .setAudience("trivon-admin")
    .setIssuedAt()
    .setExpirationTime(`${sessionDuration}s`)
    .sign(signingKey());
}

export async function getAdminFromRequest(request: Request): Promise<{ email: string } | null> {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(decodeURIComponent(token), signingKey(), {
      issuer: "trivon",
      audience: "trivon-admin",
    });
    if (payload["role"] !== "admin" || typeof payload["email"] !== "string") return null;
    return { email: payload["email"] };
  } catch (error) {
    if (error instanceof ConfigurationError) throw error;
    return null;
  }
}

export function sessionCookie(token: string): string {
  const secure = process.env["NODE_ENV"] === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionDuration}${secure}`;
}

export function clearedSessionCookie(): string {
  const secure = process.env["NODE_ENV"] === "production" ? "; Secure" : "";
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function hasSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
