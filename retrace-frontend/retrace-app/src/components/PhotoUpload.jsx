import { useRef, useState } from "react";

export default function PhotoUpload({ photos, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (fileList) => {
    const remaining = 6 - photos.length;

    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remaining);

    const next = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      name: file.name,
      file: file,
      url: URL.createObjectURL(file),
      progress: 100,
    }));

    onChange([...photos, ...next]);
  };

  const removePhoto = (id) => {
    const photo = photos.find((p) => p.id === id);

    if (photo?.url) {
      URL.revokeObjectURL(photo.url);
    }

    onChange(
      photos.filter((p) => p.id !== id)
    );
  };

  return (
    <div>
      <p className="label">Photos</p>

      <p className="mb-3 text-sm text-ink-500">
        Add photos to help ReTrace find better matches.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          if (e.dataTransfer.files?.length) {
            addFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-ink-100 hover:border-indigo-300"
        }`}
      >
        <span className="text-2xl">📷</span>

        <p className="text-sm font-medium text-ink-700">
          Drag & drop photos, or click to upload
        </p>

        <p className="text-xs text-ink-300">
          Up to 6 images · JPG, PNG or WEBP
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              addFiles(e.target.files);
            }

            e.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-sm border border-ink-100"
            >
              <img
                src={p.url}
                alt={p.name}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(p.id);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${p.name}`}
              >
                ✕
              </button>

              <div
                className="absolute inset-x-0 bottom-0 h-1 bg-signal-teal"
                style={{
                  width: `${p.progress}%`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-signal-amber">
        Avoid uploading sensitive personal information such as
        passwords, card numbers or private documents.
      </p>
    </div>
  );
}