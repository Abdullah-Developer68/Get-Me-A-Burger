"use client";
import React, { useEffect, useCallback } from "react";
import ProfilePicturePicker from "@/components/ProfilePicturePicker";
import CoverPicturePicker from "@/components/CoverPicturePicker";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setProfileUrl,
  setCoverUrl,
  loadFromStorage,
} from "@/redux/slices/dashboardSlice";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const potentialProfile = useSelector(
    (state) => state.dashboard.potentialProfile
  );
  const potentialCover = useSelector((state) => state.dashboard.potentialCover);

  // when the page is loaded every time it takes time for next auth to fetch the data during that time is {} is not given then in that case name and username will be undefined will not destructure and an error will come
  const { name, username } = session?.user || {};

  const getUserData = useCallback(async () => {
    if (!username) return; // Don't fetch if username is not available yet

    try {
      const res = await fetch(
        `/api/user/data?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      dispatch(setProfileUrl(data.profilePic || "/profilePic.png"));
      dispatch(setCoverUrl(data.coverPic || "/coverImage.PNG"));
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set default values on error
      dispatch(setCoverUrl("/coverImage.PNG"));
      dispatch(setProfileUrl("/profilePic.png"));
    }
  }, [username, dispatch]);

  // Load from localStorage on component mount (client-side only). This can not be done in slice because it will be called during server side rendering also where local storage is not available
  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (username) {
      console.log("Fetching user data for:", username);
      getUserData();
    }
  }, [username, getUserData]);

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
