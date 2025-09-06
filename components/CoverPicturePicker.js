"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCoverUrl } from "@/redux/slices/dashboardSlice";

const defaultUrl = "/coverImage.PNG";

export default function CoverPicturePicker({
  name = "cover", // name used by the enclosing form to include this file in FormData
}) {
  const dispatch = useDispatch();
  // Get the coverUrl from Redux store
  const coverUrl = useSelector((state) => state.dashboard.coverUrl);

  const [preview, setPreview] = useState(coverUrl || defaultUrl);
  const [fileName, setFileName] = useState("");

  // Update preview when coverUrl from Redux changes
  useEffect(() => {
    if (coverUrl) {
      setPreview(coverUrl);
    }
  }, [coverUrl]);

  const onFileChange = (e) => {
    // get the first file from the input
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Create FileReader to convert file to data URL for preview
    const reader = new FileReader();
    // defines what happens when the file is read
    reader.onload = (ev) => {
      const url = typeof ev.target?.result === "string" ? ev.target.result : "";
      setPreview(url);
      // Update Redux store with the data URL
      dispatch(setCoverUrl(url));
    };
    // Write the way to which the file should be read
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setPreview(defaultUrl);
    dispatch(setCoverUrl(defaultUrl));
    setFileName("");
  };

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
        Cover Picture
      </label>
      <div className="flex items-center gap-4 flex-wrap">
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800">
          <input
            type="file"
            accept="image/*"
            name={name}
            onChange={onFileChange}
            className="hidden"
          />
          <span>Select Image</span>
        </label>
        {fileName && (
          <span className="text-xs text-gray-400 truncate max-w-[300px]">
            {fileName}
          </span>
        )}
        {preview && preview !== defaultUrl && (
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
          src={preview || defaultUrl}
          alt="Cover preview"
          className="w-full h-40 sm:h-48 md:h-56 rounded-md object-cover border border-gray-700"
        />
      </div>
    </div>
  );
}
