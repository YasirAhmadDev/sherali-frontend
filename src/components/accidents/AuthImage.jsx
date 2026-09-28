import { useEffect, useState } from "react";

import { fetchPhotoBlob } from "@/api/accidents.api";

// An <img> for private photos: downloads the file with the login token first.
export default function AuthImage({ filename, alt = "Accident photo", className = "" }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let url;
    let cancelled = false;
    setSrc(null);
    setFailed(false);

    fetchPhotoBlob(filename)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [filename]);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-line text-xs text-muted ${className}`}>
        Unavailable
      </div>
    );
  }
  if (!src) return <div className={`animate-pulse bg-line ${className}`} />;

  return <img src={src} alt={alt} className={className} />;
}