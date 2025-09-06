"use client";
import { useState, useEffect, useRef } from "react";
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

  //states
  const [preview, setPreview] = useState(coverUrl || defaultUrl);
  const [fileName, setFileName] = useState("");
  const [removedCover, setRemovedCover] = useState(false); // this is used to tell the server that the cover has been removed as when the cover file is "" the server gets null
  // Ref for the file input element
  const fileInputRef = useRef(null);

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
    setRemovedCover(false);
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
    setRemovedCover(true);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
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
            ref={fileInputRef}
            accept="image/*"
            name={name}
            onChange={onFileChange}
            className="hidden"
          />
          <span>Select Image</span>
        </label>
        {/* true and false can be sent but the server will interpret them as strings so it is better to send them as that data type from the start */}
        <input
          type="hidden"
          name="coverRemoved"
          value={removedCover ? "true" : "false"}
        />

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
