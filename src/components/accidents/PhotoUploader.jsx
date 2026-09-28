import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";

import AuthImage from "@/components/accidents/AuthImage";
import { MAX_PHOTOS } from "@/utils/constants";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB, same as the backend

// The parent form owns the state:
//   existing  -> photo file names already saved on the server
//   newFiles  -> File objects chosen now (uploaded after the form is saved)
export default function PhotoUploader({
  existing = [],
  newFiles = [],
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const used = existing.length + newFiles.length;

  // Temporary preview URLs for the new files
  useEffect(() => {
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newFiles]);

  const handleChange = (e) => {
    const chosen = Array.from(e.target.files || []);
    e.target.value = ""; // allows choosing the same file again

    const valid = [];
    for (const file of chosen) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG or WEBP images are allowed`);
      } else if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: file is larger than 5MB`);
      } else {
        valid.push(file);
      }
    }

    const room = MAX_PHOTOS - used;
    if (valid.length > room) toast.error(`You can add at most ${MAX_PHOTOS} photos in total`);
    if (room > 0 && valid.length > 0) onAddFiles(valid.slice(0, room));
  };

  const removeButton = (onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"
    >
      <X size={14} />
    </button>
  );

  return (
    <div>
      {used > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {existing.map((filename) => (
            <div key={filename} className="relative aspect-square overflow-hidden rounded-lg border border-line">
              <AuthImage filename={filename} className="h-full w-full object-cover" />
              {removeButton(() => onRemoveExisting(filename), "Remove photo")}
            </div>
          ))}
          {previews.map((url, index) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-brand">
              <img src={url} alt="New photo" className="h-full w-full object-cover" />
              <span className="absolute bottom-1 start-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-medium text-white">
                New
              </span>
              {removeButton(() => onRemoveNew(index), "Remove new photo")}
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={used >= MAX_PHOTOS}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted transition-colors hover:border-brand hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ImagePlus size={20} />
        Add photos ({used}/{MAX_PHOTOS})
      </button>
      <p className="mt-2 text-xs text-subtle">JPG, PNG or WEBP, up to 5MB each.</p>
    </div>
  );
}