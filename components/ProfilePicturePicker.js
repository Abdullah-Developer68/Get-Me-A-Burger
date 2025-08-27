"use client";
import { useState } from "react";

export default function ProfilePicturePicker({
  initialUrl = "/profilePic.jpg",
  onChange,
}) {
  const [preview, setPreview] = useState(initialUrl || "");
  const [fileName, setFileName] = useState("");

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = typeof ev.target?.result === "string" ? ev.target.result : "";
      setPreview(url);
      onChange?.({ file, previewUrl: url });
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setPreview(initialUrl || "");
    setFileName("");
    onChange?.(null);
  };

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
        Profile Picture
      </label>
      <div className="flex items-center gap-4 flex-wrap">
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <span>Select Image</span>
        </label>
        {fileName && (
          <span className="text-xs text-gray-400 truncate max-w-[200px]">
            {fileName}
          </span>
        )}
        {preview && preview !== initialUrl && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs rounded-md border border-gray-700 px-2 py-1 hover:bg-gray-800"
          >
            Remove
          </button>
        )}
      </div>
      <div className="mt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview || initialUrl}
          alt="Profile preview"
          className="h-24 w-24 rounded-full object-cover border border-gray-700"
        />
      </div>
    </div>
  );
}
