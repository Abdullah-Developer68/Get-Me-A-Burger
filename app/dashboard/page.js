"use client";
import useAuth from "@/hooks/useAuth"; // Changed from { useAuth } to useAuth
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if no user is authenticated
    if (userInfo === null) {
      router.push("/login");
    }
  }, [userInfo, router]);

  // Show loading state while userInfo is being fetched
  if (userInfo === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome, {userInfo.username}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Profile Info
          </h2>
          <p className="text-gray-300">Username: {userInfo.username}</p>
          <p className="text-gray-300">Email: {userInfo.email}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Projects</h2>
          <p className="text-gray-300">Manage your projects here</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
          <p className="text-gray-300">Update your preferences</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
