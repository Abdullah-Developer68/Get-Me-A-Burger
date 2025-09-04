"use client";
import React, { use, useEffect } from "react";
import ProfilePicturePicker from "@/components/ProfilePicturePicker";
import CoverPicturePicker from "@/components/CoverPicturePicker";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";
import { useDispatch } from "react-redux";
import { setProfileUrl, setCoverUrl } from "@/redux/slices/dashboardSlice";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  // when the page is loaded every time it takes time for next auth to fetch the data during that time is {} is not given then in that case name and username will be undefined will not destructure and an error will come
  const { name, username } = session?.user || {};

  const getUserData = async () => {
    const res = await fetch("/api/user/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // send data to redux store for the values of profile and cover pics
    dispatch(setCoverUrl(data.coverPic));
    dispatch(setProfileUrl(data.profilePic));
  };

  useEffect(() => {
    getUserData();
  }, []);

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

        <form action={uploadUserInfoAction} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder={name || "Enter name"}
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Username
            </label>
            <p className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500">
              {username}
            </p>
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
