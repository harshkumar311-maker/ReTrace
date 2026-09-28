import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMatch } from "../services/matchService";
import { submitClaim } from "../services/claimService";

const QUESTION_BANK = {
  electronics: [
    "Describe a hidden identifying feature (scratch, sticker, engraving).",
    "What was the approximate storage or model detail?",
  ],
  bags: [
    "What was inside the bag when you lost it?",
    "Describe a distinctive mark or sticker on the bag.",
  ],
  documents: [
    "What sticker or mark was present on the document?",
    "Provide the document or serial number if applicable.",
  ],
  keys: [
    "Describe the keychain attached to your keys.",
    "How many keys were on the ring?",
  ],
  jewelry: [
    "Describe any engraving or distinctive mark.",
    "What is the approximate size or fit?",
  ],
  default: [
    "Describe a hidden identifying feature only you would know.",
    "What sticker, mark, or detail was present on the item?",
  ],
};

export default function ClaimVerificationPage() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatch() {
      try {
        setError("");

        const data = await fetchMatch(id);

        setMatch(data);
      } catch (err) {
        console.error("Failed to load match:", err);
        setError("Unable to load this match.");
      }
    }

    loadMatch();
  }, [id]);

  const found = match?.foundItem || null;

  const questions = useMemo(() => {
    const category = found?.category?.toLowerCase();

    return QUESTION_BANK[category] || QUESTION_BANK.default;
  }, [found]);

  const answeredCount = Object.values(answers).filter(
    (value) => value && value.trim().length > 0
  ).length;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const payload = questions.map((question, index) => ({
        question,
        value: answers[index] || "",
      }));

      const res = await submitClaim(id, payload);

      setResult(res);
    } catch (err) {
      console.error("Claim submission failed:", err);

      setError(
        err.message || "Unable to submit claim. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link
          to={`/matches/${id}`}
          className="text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          ← Back to match
        </Link>

        <div className="mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!match || !found) {
    return (
      <div className="mx-auto max-w-lg px-6 py-12 text-ink-300">
        Loading…
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <span className="text-4xl">✅</span>

        <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">
          Claim submitted
        </h1>

        <p className="mt-2 text-ink-500">
          Your ownership claim has been submitted successfully.
          ReTrace will review it and notify you once it's checked.
        </p>

        <div className="mt-4 rounded-md bg-ink-50 px-4 py-3 text-sm text-ink-600">
          Claim status:{" "}
          <span className="font-semibold">
            {result.status || "PENDING"}
          </span>
        </div>

        <Link
          to="/dashboard"
          className="btn-primary mt-8 inline-flex"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link
        to={`/matches/${id}`}
        className="text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        ← Back to match
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">
        Verify ownership
      </h1>

      <p className="mt-1.5 text-sm text-ink-500">
        Answer a few private questions about your lost item. We never reveal
        details from the found report — your answers are compared against
        them directly.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full bg-signal-teal transition-all"
            style={{
              width: `${(answeredCount / questions.length) * 100}%`,
            }}
          />
        </div>

        <span className="shrink-0 text-xs font-medium text-ink-500">
          Verification progress: {answeredCount} / {questions.length}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question}>
            <label className="label">{question}</label>

            <textarea
              rows={2}
              className="input resize-none"
              value={answers[index] || ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [index]: event.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>

      <button
        className="btn-primary mt-8 w-full"
        disabled={answeredCount < questions.length || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Submitting…" : "Submit claim"}
      </button>
    </div>
  );
}