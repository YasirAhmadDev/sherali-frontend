import { useState } from "react";

import AuthImage from "@/components/accidents/AuthImage";
import Modal from "@/components/common/Modal";

// Read-only photo grid. Click a photo to see it large.
export default function PhotoGallery({ photos = [] }) {
  const [active, setActive] = useState(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((filename) => (
          <button
            key={filename}
            onClick={() => setActive(filename)}
            className="aspect-square overflow-hidden rounded-lg border border-line"
          >
            <AuthImage filename={filename} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title="Photo" size="xl">
        {active && (
          <AuthImage filename={active} className="mx-auto max-h-[70vh] w-full rounded-lg object-contain" />
        )}
      </Modal>
    </>
  );
}