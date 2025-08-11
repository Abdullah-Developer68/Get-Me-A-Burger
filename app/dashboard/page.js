"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
      <div className="w-full max-w-2xl px-4 sm:px-6 py-10 sm:py-12">
        <h1 className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">
          Welcome to your Dashboard
        </h1>

        <form className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Profile Picture
            </label>
            <input
              type="text"
              placeholder="Profile picture URL"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Cover Picture
            </label>
            <input
              type="text"
              placeholder="Cover picture URL"
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Stripe Publishable Key
            </label>
            <input
              type="text"
              placeholder="pk_live_... or pk_test_..."
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Stripe Secret Key
            </label>
            <input
              type="password"
              placeholder="sk_live_... or sk_test_..."
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2">
              Stripe Webhook Secret (optional)
            </label>
            <input
              type="password"
              placeholder="whsec_..."
              className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <button
              type="button"
              className="w-full rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 text-sm font-medium hover:opacity-95"
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
