"use client";
import React, { useEffect } from "react";
import ProfilePicturePicker from "@/components/ProfilePicturePicker";
import CoverPicturePicker from "@/components/CoverPicturePicker";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";

const Dashboard = () => {
  const { status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users after commit to avoid render-phase updates
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  return (
    <div className="text-white flex justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
        <h1 className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">
          Welcome to your Dashboard
        </h1>

        <form
          action={uploadUserInfoAction}
          className="space-y-4 sm:space-y-5"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <ProfilePicturePicker name="profile" />
          <CoverPicturePicker name="cover" />

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-white text-black py-2 text-sm font-medium cursor-pointer border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
