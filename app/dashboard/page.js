"use client";

import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Dashboard() {
  // Auth context
  const { userInfo, isLoading } = useAuth();

  // to track unsaved changes
  const [edits, setEdits] = useState(
    typeof window !== "undefined" && localStorage.getItem("edits")
      ? JSON.parse(localStorage.getItem("edits"))
      : undefined
  );

  // states for form fields and previews
  const [name, setName] = useState("");
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");

  // Files preview handler
  const filePreview = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (e.target.id === "profile") {
        setProfilePreviewUrl(reader.result);
        // store the unsaved changes
        setEdits((prev) => ({ ...prev, profilePic: reader.result }));
        localStorage.setItem(
          "edits",
          JSON.stringify({ ...edits, profilePic: reader.result })
        );
      } else if (e.target.id === "cover") {
        setCoverPreviewUrl(reader.result);
        // store the unsaved changes
        setEdits((prev) => ({ ...prev, coverPic: reader.result }));
        localStorage.setItem(
          "edits",
          JSON.stringify({ ...edits, coverPic: reader.result })
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type) => {
    if (type === "profile") {
      setProfilePreviewUrl("/profilePic.png");
      document.getElementById("profile").value = "";
      // update edits
      setEdits((prev) => ({ ...prev, profilePic: "" }));
      localStorage.setItem(
        "edits",
        JSON.stringify({ ...edits, profilePic: "/profilePic.png" })
      );
    } else if (type === "cover") {
      setCoverPreviewUrl("/coverImage.png");
      document.getElementById("cover").value = "";
      // update edits
      setEdits((prev) => ({ ...prev, coverPic: "" }));
      localStorage.setItem(
        "edits",
        JSON.stringify({ ...edits, coverPic: "/coverImage.png" })
      );
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    // store the unsaved changes
    setEdits((prev) => ({ ...prev, name: e.target.value }));
    localStorage.setItem(
      "edits",
      JSON.stringify({ ...edits, name: e.target.value })
    );
  };

  const removeEdits = () => {
    if (
      edits.name !== userInfo.name ||
      edits.profilePic !== userInfo.profilePic ||
      edits.coverPic !== userInfo.coverPic
    ) {
      setEdits(undefined);
      localStorage.removeItem("edits");
    }
  };

  // On refresh, the userInfo from context may take some time to load
  // So, we use useEffect to update the states when userInfo changes
  useEffect(() => {
    if (userInfo) {
      // set default edits if not already set
      if (edits === undefined) {
        const newEdits = {
          name: userInfo.name || "",
          profilePic: userInfo.profilePic || "",
          coverPic: userInfo.coverPic || "",
        };
        setEdits(newEdits);
        localStorage.setItem("edits", JSON.stringify(newEdits));
      }
      // Form Fields -> last edits > userInfo > placeholders
      setName(edits?.name || userInfo.name || "Enter your name");
      setProfilePreviewUrl(
        edits?.profilePic || userInfo.profilePic || "/profilePic.png"
      );
      setCoverPreviewUrl(
        edits?.coverPic || userInfo.coverPic || "/coverImage.png"
      );
    }
  }, [userInfo]); // Run when userInfo changes

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-400 text-lg">
              Customize your profile and make it yours
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Main Form Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <form action={uploadUserInfoAction} className="space-y-8">
                {/* Profile Information Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Profile Information
                  </h2>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-300"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={name}
                      className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      onChange={handleNameChange}
                    />
                  </div>

                  {/* Profile Picture Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-300">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="profile"
                        name="profile"
                        type="file"
                        accept="image/*"
                        className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white file:mr-3 file:rounded file:border-0 file:bg-gray-500 file:px-3 file:py-1 file:text-white hover:file:bg-black hover:cursor-pointer hover:file:cursor-pointer transition-colors"
                        onChange={filePreview}
                      />
                      {profilePreviewUrl && (
                        <button
                          type="button"
                          onClick={() => removeFile("profile")}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {/* Profile Preview (circular) */}
                    <div className="mt-2">
                      <div className="h-28 w-28 rounded-full overflow-hidden border border-gray-800 bg-gray-800/30 flex items-center justify-center relative">
                        {profilePreviewUrl ? (
                          <Image
                            src={profilePreviewUrl}
                            alt="Profile preview"
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs px-2 text-center">
                            No profile image selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover Picture Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-300">
                      Cover Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="cover"
                        name="cover"
                        type="file"
                        accept="image/*"
                        className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white file:mr-3 file:rounded file:border-0 file:bg-gray-500 file:px-3 file:py-1 file:text-white hover:file:bg-black hover:cursor-pointer hover:file:cursor-pointer transition-colors"
                        onChange={filePreview}
                      />
                      {coverPreviewUrl && (
                        <button
                          type="button"
                          onClick={() => removeFile("cover")}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {/* Cover Preview */}
                    <div className="mt-2 w-full h-40 rounded-md border border-gray-800 bg-gray-800/30 flex items-center justify-center overflow-hidden relative">
                      {coverPreviewUrl ? (
                        <Image
                          src={coverPreviewUrl}
                          alt="Cover preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">
                          No cover image selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-md bg-green-500 px-8 py-3 text-lg font-semibold text-black transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                    onClick={removeEdits}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
