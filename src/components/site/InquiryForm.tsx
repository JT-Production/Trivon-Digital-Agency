import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Modal } from "./Modal";

type Props = {
  initialPlan?: string;
  onSubmitted?: () => void;
  showConfirmationModal?: boolean;
};

export function InquiryForm({
  initialPlan = "",
  onSubmitted,
  showConfirmationModal = false,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Your message could not be sent. Please try again.");
      setSuccess(true);
      setMessage("Thanks — your message is on its way. We’ll be in touch soon.");
      if (showConfirmationModal) setConfirmationOpen(true);
      formElement.reset();
      onSubmitted?.();
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again.",
      );
      if (showConfirmationModal) setConfirmationOpen(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium">
        Your name
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          className="mt-1.5 h-12 w-full rounded-xl border border-input bg-background px-4"
        />
      </label>
      <label className="block text-sm font-medium">
        Work email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="mt-1.5 h-12 w-full rounded-xl border border-input bg-background px-4"
        />
      </label>
      <label className="block text-sm font-medium">
        Company <span className="text-muted-foreground">(optional)</span>
        <input
          name="company"
          autoComplete="organization"
          maxLength={120}
          className="mt-1.5 h-12 w-full rounded-xl border border-input bg-background px-4"
        />
      </label>
      <label className="block text-sm font-medium">
        What would you like to work on?
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-input bg-background p-4"
        />
      </label>
      <input type="hidden" name="plan" value={initialPlan} />
      <label
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        Leave this empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        disabled={busy}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime px-6 font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <>
            Send inquiry <ArrowRight className="size-4" />
          </>
        )}
      </button>
      <p aria-live="polite" className={`text-sm ${success ? "text-forest" : "text-destructive"}`}>
        {message}
      </p>
      {showConfirmationModal && (
        <Modal
          open={confirmationOpen}
          onOpenChange={setConfirmationOpen}
          title={success ? "Thanks for getting in touch" : "We couldn’t send your message"}
          description={message}
        >
          <button
            type="button"
            onClick={() => setConfirmationOpen(false)}
            className="min-h-11 rounded-full bg-ink px-5 font-semibold text-ivory"
          >
            {success ? "Close" : "Close and try again"}
          </button>
        </Modal>
      )}
    </form>
  );
}
