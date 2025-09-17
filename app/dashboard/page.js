"use client";

import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";
import useAuth from "@/hooks/useAuth";
import { useRef } from "react";

export default function Dashboard() {
  const { userInfo, isLoading, status } = useAuth();
  // Access to input tags
  const profilePreview = useRef(null);
  const coverPreview = useRef(null);

  const filePreview = (e) => {
    // gives a File object, which is a type of Blob (it inherits from Blob and contains binary data).
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // set src of the corresponding image preview
        if (e.target.id === "profile") {
          profilePreview.current.src = reader.result;
        } else if (e.target.id === "cover") {
          coverPreview.current.src = reader.result;
        }
        console.log(reader.result);
      };
      // reads file as data URL (base64 encoded string)
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-400 text-lg">
              Customize your profile and make it yours
            </p>
          </div>

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
                    Display Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your display name"
                    className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    required
                  />
                </div>

                {/* Profile Picture Section */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300">
                    Profile Picture
                  </label>

                  <div className="flex items-center gap-4">
                    <input
                      ref={profilePreview}
                      id="profile"
                      name="profile"
                      type="file"
                      accept="image/*"
                      className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white file:mr-3 file:rounded file:border-0 file:bg-red-500 file:px-3 file:py-1 file:text-white hover:file:bg-red-600 transition-colors"
                      onChange={(e) => filePreview(e)}
                    />
                  </div>
                </div>

                {/* Cover Picture Section */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300">
                    Cover Picture
                  </label>

                  <div className="flex items-center gap-4">
                    <input
                      ref={coverPreview}
                      id="cover"
                      name="cover"
                      type="file"
                      accept="image/*"
                      className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white file:mr-3 file:rounded file:border-0 file:bg-red-500 file:px-3 file:py-1 file:text-white hover:file:bg-red-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="rounded-md bg-red-500 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
