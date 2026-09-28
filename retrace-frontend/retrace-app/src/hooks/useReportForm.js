import { useMemo, useState } from "react";
import { getSubcategory } from "../data/categories";

// Drives the entire multi-step report flow: report type -> category ->
// subcategory -> dynamic fields -> photos -> review -> submit.
export function useReportForm() {
  const [step, setStep] = useState("report-type"); // report-type | category | subcategory | fields | photos | review
  const [reportType, setReportType] = useState(null); // "lost" | "found"
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [values, setValues] = useState({});
  const [photos, setPhotos] = useState([]);

  const subcategory = useMemo(
    () => (categoryId && subcategoryId ? getSubcategory(categoryId, subcategoryId) : null),
    [categoryId, subcategoryId]
  );

  const setValue = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const reset = () => {
    setStep("report-type");
    setReportType(null);
    setCategoryId(null);
    setSubcategoryId(null);
    setValues({});
    setPhotos([]);
  };

  return {
    step, setStep,
    reportType, setReportType,
    categoryId, setCategoryId,
    subcategoryId, setSubcategoryId,
    subcategory,
    values, setValue, setValues,
    photos, setPhotos,
    reset,
  };
}
