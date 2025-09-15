"use client";
import { useState, useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";

const ProfilePicturePicker = ({
  name = "profile", // name used by the enclosing form to include this file in FormData
}) => {
  const [userInfo, status] = useAuth();
  const defaultUrl = "/profilePic.png";

  // Ref for the file input element
  const fileInputRef = useRef(null);

  //states
  const [preview, setPreview] = useState(defaultUrl);
  const [fileName, setFileName] = useState("");
  const [removedProfile, setRemovedProfile] = useState(false); // this is used to tell the server that the profile has been removed as when the profile file is "" the server gets null

  // Update preview when profileUrl from Redux changes. This handles cases where the URL is set from outside this component (e.g., loading from localStorage or API)
  useEffect(() => {
    const savedProfilePic = userInfo?.profilePic;
    const profileUrl =
      savedProfilePic && savedProfilePic !== "null"
        ? savedProfilePic
        : defaultUrl;
    if (profileUrl) {
      setPreview(profileUrl);
    }
  }, [userInfo]);

  /**
   * Handles file selection from input field
   * Generates a preview URL
   */
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setRemovedProfile(false);

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
    setRemovedProfile(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value. This will send null to the server
    }
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
            ref={fileInputRef}
            accept="image/*" // Only allow image files
            name={name}
            onChange={onFileChange}
            className="hidden" // Hide default file input, use label as button
          />
          <span>Select Image</span>
        </label>
        {/* true and false can be sent but the server will interpret them as strings so it is better to send them as that data type from the start */}
        <input
          type="hidden"
          name="profileRemoved"
          value={removedProfile ? "true" : "false"}
        />
        {/* Display selected filename if a file is chosen */}
        {fileName && (
          <span className="text-xs text-gray-400 truncate max-w-[200px]">
            {fileName}
          </span>
        )}

        {/* Remove button - only show if a file is selected (preview != default) */}
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

      {/* Preview section showing the selected or default image */}
      <div className="mt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview || defaultUrl} // Show preview or fallback to default
          alt="Profile preview"
          className="h-24 w-24 rounded-full object-cover border border-gray-700"
        />
      </div>
    </div>
  );
};

export default ProfilePicturePicker;
