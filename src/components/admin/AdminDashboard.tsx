import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  collectionNames,
  type CollectionName,
  type CmsItem,
  type JsonValue,
} from "@/lib/cms-types";

type Stats = {
  services: number;
  projects: number;
  articles: number;
  inquiries: number;
  unread: number;
  recent: Inquiry[];
};
type Inquiry = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  plan?: string;
  read: boolean;
  createdAt: string;
};
type EditorState = {
  id?: string | undefined;
  title: string;
  slug: string;
  status: "draft" | "published";
  order: number;
  data: Record<string, JsonValue>;
};
type Session = { authenticated: boolean; email: string | null };
type Collection = CollectionName | "inquiries";

const collectionLabels: Record<Collection, string> = {
  services: "Services",
  projects: "Work",
  pricing: "Pricing",
  articles: "Insights",
  faqs: "FAQs",
  inquiries: "Inquiries",
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init });
  if (response.status === 204) return undefined as T;
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? `Request failed (${response.status}).`);
  return payload;
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collection, setCollection] = useState<Collection>("services");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [dataText, setDataText] = useState("{}");
  const [articleText, setArticleText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    requestJson<Session>("/api/auth/session")
      .then((value) => {
        if (active) setSession(value);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(reason instanceof Error ? reason.message : "Could not check the admin session.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!session?.authenticated) return;
    if (collection === "inquiries") {
      requestJson<Inquiry[]>("/api/inquiries")
        .then(setInquiries)
        .catch((reason: unknown) =>
          setError(reason instanceof Error ? reason.message : "Could not load inquiries."),
        );
    } else {
      requestJson<CmsItem[]>(`/api/content/${collection}?admin=1`)
        .then(setItems)
        .catch((reason: unknown) =>
          setError(reason instanceof Error ? reason.message : "Could not load content."),
        );
    }
    requestJson<Stats>("/api/admin/stats")
      .then(setStats)
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : "Could not load dashboard statistics."),
      );
  }, [collection, session?.authenticated]);

  const unreadCount = useMemo(
    () => inquiries.filter((inquiry) => !inquiry.read).length,
    [inquiries],
  );

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await requestJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setSession({ authenticated: true, email });
      setPassword("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await requestJson("/api/auth/logout", { method: "POST" });
      setSession({ authenticated: false, email: null });
      setItems([]);
      setInquiries([]);
      setStats(null);
      setNotice("");
      await router.invalidate();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign out failed.");
    } finally {
      setBusy(false);
    }
  }

  function newRecord() {
    setArticleText("");
    setDataText("{}");
    setEditor({ title: "", slug: "", status: "draft", order: items.length, data: {} });
  }

  function editRecord(item: CmsItem) {
    setArticleText(typeof item.data["content"] === "string" ? item.data["content"] : "");
    setDataText(JSON.stringify(item.data, null, 2));
    setEditor({
      id: item._id,
      title: item.title,
      slug: item.slug,
      status: item.status,
      order: item.order,
      data: item.data,
    });
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || collection === "inquiries") return;
    let data: Record<string, JsonValue> = editor.data;
    if (collection !== "articles") {
      try {
        const parsed: unknown = JSON.parse(dataText);
        if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Content fields must be a JSON object.");
        }
        data = {
          ...(parsed as Record<string, JsonValue>),
          seoTitle: typeof editor.data["seoTitle"] === "string" ? editor.data["seoTitle"] : "",
          seoDescription:
            typeof editor.data["seoDescription"] === "string" ? editor.data["seoDescription"] : "",
        };
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Content fields must be valid JSON.");
        return;
      }
    }
    setBusy(true);
    setError("");
    try {
      data = { ...data };
      if (collection === "articles") data["content"] = articleText;
      const url = editor.id
        ? `/api/content/${collection}/${encodeURIComponent(editor.id)}`
        : `/api/content/${collection}`;
      const saved = await requestJson<CmsItem>(url, {
        method: editor.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editor.title,
          slug: editor.slug,
          status: editor.status,
          order: editor.order,
          data,
        }),
      });
      setItems((current) =>
        editor.id
          ? current.map((item) => (item._id === editor.id ? saved : item))
          : [...current, saved].sort((a, b) => a.order - b.order),
      );
      setEditor(null);
      setNotice(`${saved.title} saved.`);
      await refreshStats();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this item.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(item: CmsItem) {
    if (!item._id || !window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await requestJson(`/api/content/${collection}/${encodeURIComponent(item._id)}`, {
        method: "DELETE",
      });
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setNotice(`${item.title} deleted.`);
      await refreshStats();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete this item.");
    } finally {
      setBusy(false);
    }
  }

  async function moveItem(item: CmsItem, delta: number) {
    const index = items.findIndex((entry) => entry._id === item._id);
    const target = index + delta;
    if (index < 0 || target < 0 || target >= items.length || !item._id) return;
    const reordered = [...items];
    const sourceItem = reordered[index];
    const targetItem = reordered[target];
    if (!sourceItem || !targetItem) return;
    reordered[index] = targetItem;
    reordered[target] = sourceItem;
    const ordered = reordered.map((entry, order) => ({ ...entry, order }));
    setItems(ordered);
    try {
      await Promise.all(
        ordered.map((entry) =>
          requestJson(`/api/content/${collection}/${encodeURIComponent(entry._id ?? "")}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          }),
        ),
      );
      setNotice("Display order updated.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update display order.");
    }
  }

  async function uploadImage(file: File) {
    setBusy(true);
    setError("");
    try {
      const payload = new FormData();
      payload.set("file", file);
      const result = await requestJson<{ url: string }>("/api/upload", {
        method: "POST",
        body: payload,
      });
      setEditor((current) => {
        if (!current) return current;
        const nextData = { ...current.data, imageUrl: result.url };
        setDataText(JSON.stringify(nextData, null, 2));
        return { ...current, data: nextData };
      });
      setNotice("Image uploaded. Save the item to keep the image URL.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Image upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function updateInquiry(inquiry: Inquiry, read: boolean) {
    try {
      const updated = await requestJson<Inquiry>(
        `/api/inquiries/${encodeURIComponent(inquiry._id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read }),
        },
      );
      setInquiries((current) => current.map((item) => (item._id === inquiry._id ? updated : item)));
      await refreshStats();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update the inquiry.");
    }
  }

  async function deleteInquiry(inquiry: Inquiry) {
    if (!window.confirm(`Delete the inquiry from ${inquiry.name}? This cannot be undone.`)) return;
    try {
      await requestJson(`/api/inquiries/${encodeURIComponent(inquiry._id)}`, { method: "DELETE" });
      setInquiries((current) => current.filter((item) => item._id !== inquiry._id));
      await refreshStats();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete the inquiry.");
    }
  }

  async function refreshStats() {
    const updated = await requestJson<Stats>("/api/admin/stats");
    setStats(updated);
  }

  if (!session) {
    return <AdminMessage text={error || "Checking admin session…"} />;
  }
  if (!session.authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-hero px-5 py-20 text-on-dark">
        <form
          onSubmit={signIn}
          className="w-full max-w-md rounded-2xl border border-line-dark bg-ink/80 p-8 shadow-card backdrop-blur"
        >
          <a href="/" className="label-mono text-lime">
            Trivon / Admin
          </a>
          <h1 className="mt-6 font-display text-3xl font-semibold">Sign in to your dashboard</h1>
          <p className="mt-2 text-sm text-on-dark-muted">
            Use the admin account configured for this site.
          </p>
          <label className="mt-7 block text-sm font-medium">
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 h-12 w-full rounded-xl border border-line-dark bg-ivory/5 px-4 text-on-dark"
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 h-12 w-full rounded-xl border border-line-dark bg-ivory/5 px-4 text-on-dark"
            />
          </label>
          {error && (
            <p role="alert" className="mt-4 text-sm text-lime">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime font-semibold text-ink disabled:opacity-60"
          >
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-border bg-ink p-5 text-on-dark lg:border-b-0 lg:border-r">
          <a href="/" className="label-mono text-lime">
            Trivon / Admin
          </a>
          <p className="mt-3 truncate text-xs text-on-dark-muted">{session.email}</p>
          <nav aria-label="Admin sections" className="mt-6 flex gap-2 overflow-x-auto lg:flex-col">
            {[...collectionNames, "inquiries" as const].map((name) => (
              <button
                key={name}
                onClick={() => {
                  setCollection(name);
                  setEditor(null);
                  setError("");
                  setNotice("");
                }}
                aria-current={collection === name ? "page" : undefined}
                className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm transition-colors ${collection === name ? "bg-lime font-semibold text-ink" : "text-on-dark-muted hover:bg-ivory/10 hover:text-on-dark"}`}
              >
                {collectionLabels[name]}
                {name === "inquiries" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            ))}
          </nav>
          <button
            disabled={busy}
            onClick={signOut}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-dark px-4 text-sm text-on-dark-muted hover:bg-ivory/10"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </aside>
        <main className="min-w-0 px-5 py-8 md:px-10 md:py-12">
          <header className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="label-mono text-forest">Content management</p>
              <h1 className="mt-3 font-display text-4xl font-semibold">
                {collectionLabels[collection]}
              </h1>
            </div>
            {collection !== "inquiries" && (
              <button
                onClick={newRecord}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-ivory transition-colors hover:bg-forest"
              >
                <Plus className="size-4" /> Add {collectionLabels[collection].replace(/s$/, "")}
              </button>
            )}
          </header>

          {stats && collection === "services" && (
            <section
              aria-label="Dashboard overview"
              className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {[
                ["Services", stats.services],
                ["Projects", stats.projects],
                ["Articles", stats.articles],
                ["Inquiries", stats.inquiries],
              ].map(([label, count]) => (
                <article key={label} className="rounded-2xl bg-card p-5">
                  <p className="label-mono text-muted-foreground">{label}</p>
                  <p className="mt-3 font-display text-3xl font-semibold">{count}</p>
                </article>
              ))}
            </section>
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}
          {notice && (
            <p role="status" className="mt-5 flex items-center gap-2 text-sm text-forest">
              <Check className="size-4" />
              {notice}
            </p>
          )}

          {collection === "inquiries" ? (
            <section className="mt-8 space-y-3">
              {inquiries.length === 0 ? (
                <p className="rounded-2xl bg-card p-8 text-muted-foreground">
                  No inquiries yet. New contact form submissions will appear here.
                </p>
              ) : (
                inquiries.map((inquiry) => (
                  <article
                    key={inquiry._id}
                    className={`rounded-2xl border p-5 ${inquiry.read ? "border-border bg-card" : "border-trivon/50 bg-sage"}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {inquiry.name}{" "}
                          <span className="font-normal text-muted-foreground">
                            ·{" "}
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="underline underline-offset-2"
                            >
                              {inquiry.email}
                            </a>
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {inquiry.company || "No company"} · {inquiry.plan || "General inquiry"} ·{" "}
                          {new Date(inquiry.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateInquiry(inquiry, !inquiry.read)}
                          className="rounded-full border border-border px-3 py-2 text-xs font-medium"
                        >
                          {inquiry.read ? "Mark unread" : "Mark read"}
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry)}
                          aria-label={`Delete inquiry from ${inquiry.name}`}
                          className="rounded-full border border-border p-2 text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
                      {inquiry.message}
                    </p>
                  </article>
                ))
              )}
            </section>
          ) : (
            <section className="mt-8 space-y-3">
              {items.length === 0 ? (
                <p className="rounded-2xl bg-card p-8 text-muted-foreground">
                  No content here yet. Add the first item to get started.
                </p>
              ) : (
                items.map((item, index) => (
                  <article
                    key={item._id ?? item.slug}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveItem(item, -1)}
                        aria-label={`Move ${item.title} up`}
                        className="rounded p-1 disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => moveItem(item, 1)}
                        aria-label={`Move ${item.title} down`}
                        className="rounded p-1 disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-display text-lg font-semibold">
                          {item.title}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${item.status === "published" ? "bg-trivon/20 text-forest" : "bg-ink/10 text-muted-foreground"}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">/{item.slug}</p>
                    </div>
                    <button
                      onClick={() => editRecord(item)}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-sage-strong"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRecord(item)}
                      aria-label={`Delete ${item.title}`}
                      className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </article>
                ))
              )}
            </section>
          )}

          {collection === "services" && stats?.recent?.length ? (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Recent inquiries</h2>
              <ul className="mt-3 space-y-2">
                {stats.recent.map((inquiry) => (
                  <li key={inquiry._id} className="rounded-xl bg-card px-4 py-3 text-sm">
                    <span className="font-semibold">{inquiry.name}</span>
                    <span className="text-muted-foreground"> · {inquiry.email}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </main>
      </div>

      {editor && collection !== "inquiries" && (
        <div
          role="presentation"
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditor(null);
          }}
        >
          <form
            onSubmit={saveRecord}
            aria-labelledby="record-editor-heading"
            className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-ivory p-6 shadow-card sm:rounded-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-mono text-forest">{editor.id ? "Edit item" : "New item"}</p>
                <h2 id="record-editor-heading" className="mt-2 font-display text-2xl font-semibold">
                  {editor.id
                    ? editor.title || "Edit content"
                    : `Add ${collectionLabels[collection].replace(/s$/, "")}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-full border border-border px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium sm:col-span-2">
                Title
                <input
                  required
                  maxLength={180}
                  value={editor.title}
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      title: event.target.value,
                      slug: editor.id ? editor.slug : makeSlug(event.target.value),
                    })
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4"
                />
              </label>
              <label className="block text-sm font-medium">
                Slug
                <input
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  maxLength={180}
                  value={editor.slug}
                  onChange={(event) => setEditor({ ...editor, slug: makeSlug(event.target.value) })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4"
                />
              </label>
              <label className="block text-sm font-medium">
                Status
                <select
                  value={editor.status}
                  onChange={(event) =>
                    setEditor({ ...editor, status: event.target.value as EditorState["status"] })
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Display order
                <input
                  type="number"
                  min={0}
                  max={100000}
                  value={editor.order}
                  onChange={(event) => setEditor({ ...editor, order: Number(event.target.value) })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4"
                />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                SEO title
                <input
                  maxLength={70}
                  value={typeof editor.data["seoTitle"] === "string" ? editor.data["seoTitle"] : ""}
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      data: { ...editor.data, seoTitle: event.target.value },
                    })
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4"
                />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                SEO description
                <textarea
                  maxLength={180}
                  rows={2}
                  value={
                    typeof editor.data["seoDescription"] === "string"
                      ? editor.data["seoDescription"]
                      : ""
                  }
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      data: { ...editor.data, seoDescription: event.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-input bg-background p-3"
                />
              </label>
              {collection === "articles" ? (
                <>
                  {(["category", "author", "date", "readTime", "excerpt"] as const).map((field) => (
                    <label key={field} className="block text-sm font-medium sm:col-span-2">
                      {field === "readTime"
                        ? "Read time"
                        : `${field.charAt(0).toUpperCase()}${field.slice(1)}`}
                      <input
                        value={typeof editor.data[field] === "string" ? editor.data[field] : ""}
                        onChange={(event) =>
                          setEditor({
                            ...editor,
                            data: { ...editor.data, [field]: event.target.value },
                          })
                        }
                        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4"
                      />
                    </label>
                  ))}
                  <label className="block text-sm font-medium sm:col-span-2">
                    Article body (Markdown)
                    <MarkdownEditor value={articleText} onChange={setArticleText} />
                  </label>
                </>
              ) : (
                <label className="block text-sm font-medium sm:col-span-2">
                  Content fields (JSON)
                  <textarea
                    required
                    rows={10}
                    value={dataText}
                    onChange={(event) => setDataText(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background p-4 font-mono text-xs leading-relaxed"
                  />
                  <span className="text-xs text-muted-foreground">
                    Enter an object such as {'{ "body": "...", "imageUrl": "..." }'}.
                  </span>
                </label>
              )}
              <div className="sm:col-span-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-sage">
                  <ImagePlus className="size-4" /> Upload image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(file);
                    }}
                  />
                </label>
                {typeof editor.data["imageUrl"] === "string" && (
                  <div className="mt-3">
                    <img
                      src={editor.data["imageUrl"]}
                      alt="Content image preview"
                      className="max-h-48 rounded-xl object-contain"
                    />
                    <p className="mt-2 break-all text-xs text-muted-foreground">
                      {editor.data["imageUrl"]}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-ivory disabled:opacity-50"
              >
                {busy ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save content
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-1.5 overflow-hidden rounded-xl border border-input bg-background">
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {[
          ["Bold", "**text**"],
          ["Italic", "_text_"],
          ["Heading", "## Heading"],
          ["List", "- item"],
        ].map(([label, token]) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(`${value}${value ? "\n\n" : ""}${token}`)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-sage"
          >
            {label}
          </button>
        ))}
      </div>
      <textarea
        required
        minLength={10}
        rows={12}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed"
      />
      <p className="px-4 pb-3 text-xs text-muted-foreground">
        Markdown is supported for headings, bold, italics, and lists.
      </p>
    </div>
  );
}

function AdminMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-hero px-6 text-center text-on-dark">
      <p role="status" className="max-w-lg">
        {text}
      </p>
    </main>
  );
}
