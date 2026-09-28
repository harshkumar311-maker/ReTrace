import DynamicField from "./DynamicField";

export default function DynamicForm({
  category,
  subcategoryId,
  values,
  onChange,
}) {
  const subcategory = category?.subcategories?.find(
    (item) => item.id === subcategoryId
  );

  const fields = subcategory?.fields || [];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={
            field.type === "textarea"
              ? "sm:col-span-2"
              : ""
          }
        >
          <DynamicField
            field={field}
            value={values?.[field.name] || ""}
            onChange={(value) =>
              onChange(field.name, value)
            }
          />
        </div>
      ))}
    </div>
  );
}