"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProfileUrl } from "@/redux/slices/dashboardSlice";

export default function ProfilePicturePicker({
  name = "profile", // name used by the enclosing form to include this file in FormData
}) {
  const dispatch = useDispatch();
  const defaultUrl = "/profilePic.png";
  // get the profileUrl from Redux store
  const profileUrl = useSelector((state) => state.dashboard.profileUrl);
  const [preview, setPreview] = useState(profileUrl || defaultUrl);
  const [fileName, setFileName] = useState("");

  // Update preview when profileUrl from Redux changes. This handles cases where the URL is set from outside this component (e.g., loading from localStorage or API)
  useEffect(() => {
    if (profileUrl) {
      setPreview(profileUrl);
    }
  }, [profileUrl]);

  /**
   * Handles file selection from input field
   * Generates a preview URL
   */
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    // Create FileReader to convert file to data URL for preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = typeof ev.target?.result === "string" ? ev.target.result : "";
      // Update preview with the generated data URL
      setPreview(url);
      // Update Redux store with the data URL
      dispatch(setProfileUrl(url));
    };
    // Convert file to base64 data URL
    reader.readAsDataURL(file);
  };

  // Clears the current selection and resets to default state
  const clearSelection = () => {
    setPreview(defaultUrl);
    dispatch(setProfileUrl(defaultUrl));
    setFileName("");
  };

  return (
    <div>
      {/* Label for the profile picture section */}
      <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
        Profile Picture
      </label>

      {/* Controls section: file input, filename display, and remove button */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Hidden file input with styled label acting as button */}
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800">
          <input
            type="file"
            accept="image/*" // Only allow image files
            name={name}
            onChange={onFileChange}
            className="hidden" // Hide default file input, use label as button
          />
          <span>Select Image</span>
        </label>

        {/* Display selected filename if a file is chosen */}
        {fileName && (
          <span className="text-xs text-gray-400 truncate max-w-[200px]">
            {fileName}
          </span>
        )}

        {/* Remove button - only show if a file is selected (preview != default) */}
        {preview && preview !== "/profilePic.jpg" && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs rounded-md border border-gray-700 px-2 py-1 hover:bg-gray-800"
          >
            Remove
          </button>
        )}
      </div>

      {/* Preview section showing the selected or default image */}
      <div className="mt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview || "/profilePic.jpg"} // Show preview or fallback to default
          alt="Profile preview"
          className="h-24 w-24 rounded-full object-cover border border-gray-700"
        />
      </div>
    </div>
  );
}
