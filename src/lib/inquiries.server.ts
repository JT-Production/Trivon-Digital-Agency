import mongoose, { type Model } from "mongoose";
import { z } from "zod";
import { connectDatabase } from "./database.server";

const inquiryInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10).max(4000),
  plan: z.string().trim().max(100).optional().default(""),
  website: z.string().max(200).optional().default(""),
});
export type InquiryInput = Omit<z.infer<typeof inquiryInput>, "website">;

type InquiryRecord = {
  name: string;
  email: string;
  company: string;
  message: string;
  plan: string;
  type: "contact" | "newsletter";
  read: boolean;
  createdAt: Date;
};

const inquirySchema = new mongoose.Schema(
  {
    ...Object.fromEntries(
      ["name", "email", "company", "message", "plan"].map((key) => [
        key,
        { type: String, required: key === "name" || key === "email" || key === "message" },
      ]),
    ),
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["contact", "newsletter"], default: "contact" },
  },
  { timestamps: true },
);
const Inquiry =
  (mongoose.models["Inquiry"] as Model<InquiryRecord> | undefined) ??
  mongoose.model<InquiryRecord>("Inquiry", inquirySchema);

export function parseInquiry(value: unknown): InquiryInput {
  const parsed = inquiryInput.parse(value);
  if (parsed.website) throw new Error("Spam submission rejected.");
  const { website: _website, ...inquiry } = parsed;
  void _website;
  return inquiry;
}

export async function createInquiry(value: unknown) {
  await connectDatabase();
  return Inquiry.create(parseInquiry(value));
}

export async function listInquiries() {
  await connectDatabase();
  return Inquiry.find().sort({ createdAt: -1 }).lean();
}

export async function markInquiryRead(id: string, read: boolean) {
  await connectDatabase();
  return Inquiry.findByIdAndUpdate(id, { read }, { new: true }).lean();
}

export async function removeInquiry(id: string): Promise<boolean> {
  await connectDatabase();
  return (await Inquiry.findByIdAndDelete(id)) !== null;
}

export async function createNewsletterSignup(value: unknown) {
  const email = z.object({ email: z.string().trim().email().max(254) }).parse(value).email;
  await connectDatabase();
  return Inquiry.create({
    name: "Newsletter subscriber",
    email,
    company: "",
    message: "Newsletter subscription request.",
    plan: "Newsletter",
    type: "newsletter",
    read: false,
  });
}
