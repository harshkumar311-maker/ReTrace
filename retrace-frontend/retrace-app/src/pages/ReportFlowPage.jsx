import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CATEGORIES, getCategory } from "../data/categories";
import { useReportForm } from "../hooks/useReportForm";
import ReportTypeSelector from "../components/ReportTypeSelector";
import CategoryCard from "../components/CategoryCard";
import DynamicForm from "../components/DynamicForm";
import PhotoUpload from "../components/PhotoUpload";
import ReviewSummary from "../components/ReviewSummary";
import ProgressSteps from "../components/ProgressSteps";
import { submitReport } from "../services/itemService";

export default function ReportFlowPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const form = useReportForm();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useState(() => {
    const t = params.get("type");

    if (t === "lost" || t === "found") {
      form.setReportType(t);
      form.setStep("category");
    }
  });

  const category = form.categoryId
    ? getCategory(form.categoryId)
    : null;

  const whereQuestion =
    form.reportType === "found"
      ? "Where did you find it?"
      : "Where did you lose it?";

  const goNext = () => {
    const order = [
      "report-type",
      "category",
      "subcategory",
      "fields",
      "photos",
      "review",
    ];

    const idx = order.indexOf(form.step);

    form.setStep(
      order[Math.min(idx + 1, order.length - 1)]
    );
  };

  const goBack = () => {
    const order = [
      "report-type",
      "category",
      "subcategory",
      "fields",
      "photos",
      "review",
    ];

    const idx = order.indexOf(form.step);

    form.setStep(
      order[Math.max(idx - 1, 0)]
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      await submitReport(
        form.reportType,
        {
          category: form.categoryId,
          subcategory: form.subcategoryId,
          ...form.values,
        },
        form.photos
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert(error.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="card p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 font-display text-2xl font-semibold text-ink-900">
            Report submitted
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            Your {form.reportType} item report has been
            submitted successfully.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-ink-800"
            >
              Go to dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              Browse items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ProgressSteps currentStep={form.step} />

      <div className="mt-8">

        {/* REPORT TYPE */}
        {form.step === "report-type" && (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">
              What would you like to report?
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Tell us whether you lost something or found something.
            </p>

            <div className="mt-8">
              <ReportTypeSelector
                value={form.reportType}
                onSelect={(value) => {
                  form.setReportType(value);
                  form.setStep("category");
                }}
              />
            </div>
          </div>
        )}

        {/* CATEGORY */}
        {form.step === "category" && (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">
              What kind of item is it?
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Choose the category that best matches your item.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORIES.map((item) => (
                <CategoryCard
                  key={item.id}
                  category={item}
                  selected={form.categoryId === item.id}
                  onClick={() => {
                    form.setCategoryId(item.id);
                    form.setSubcategoryId("");
                    form.setStep("subcategory");
                  }}
                />
              ))}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* SUBCATEGORY */}
        {form.step === "subcategory" && category && (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">
              What exactly is it?
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Select the closest subcategory.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {category.subcategories?.map((subcategory) => (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => {
                    form.setSubcategoryId(subcategory.id);
                    form.setStep("fields");
                  }}
                  className={`rounded-2xl border p-5 text-left transition ${
                    form.subcategoryId === subcategory.id
                      ? "border-ink-900 bg-ink-50"
                      : "border-ink-200 bg-white hover:border-ink-400"
                  }`}
                >
                  <div className="text-3xl">
                    {subcategory.icon}
                  </div>

                  <p className="mt-2 font-medium text-ink-900">
                    {subcategory.label}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* DETAILS */}
        {form.step === "fields" && category && (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">
              Tell us about the item
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Add as much information as you can. It helps us
              match your report with other items.
            </p>

            <div className="mt-8">
              <DynamicForm
                category={category}
                subcategoryId={form.subcategoryId}
                values={form.values}
                onChange={form.setValue}
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-white hover:bg-ink-800"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* PHOTOS */}
        {form.step === "photos" && (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">
              Add photos
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Upload photos that can help identify the item.
            </p>

            <div className="mt-8">
              <PhotoUpload
                photos={form.photos}
                onChange={form.setPhotos}
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-white hover:bg-ink-800"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {form.step === "review" && (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">
              Review your report
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Check everything once before submitting.
            </p>

            <div className="mt-8">
              <ReviewSummary
                reportType={form.reportType}
                category={category}
                subcategoryId={form.subcategoryId}
                values={form.values}
                photos={form.photos}
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={submitting}
                className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-white hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit report"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}