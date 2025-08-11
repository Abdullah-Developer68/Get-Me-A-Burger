"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

const Username = () => {
  const routeParams = useParams();
  const username =
    typeof routeParams?.username === "string"
      ? routeParams.username
      : Array.isArray(routeParams?.username)
      ? routeParams.username[0]
      : "creator";

  const [supporterName, setSupporterName] = useState("");
  const [supporterMessage, setSupporterMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = async (amt) => {
    if (!amt) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amt),
          name: supporterName,
          message: supporterMessage,
          username,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create session");

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full mt-0 pt-0">
        <div className="flex flex-col items-center relative w-full mt-0 pt-0">
          <div className="cover w-full">
            <img
              src="/coverPage.jpg"
              alt="cover page"
              className="w-full object-cover block"
            />
          </div>
          <div className="profilePic absolute bottom-[-140] flex flex-col text-white justify-center items-center gap-2">
            <img
              src="/profilePic.jpg"
              alt="profile pic"
              className="w-24 rounded-full"
            />
            <span className="flex flex-col gap-2 items-center justify-center text-center">
              <p>@codewithharry.com</p>
              <p>Created animated Web novels!</p>
              <span className="flex gap-2 justify-center items-center">
                <p>9000 Memebers .</p>
                <p> 82 posts .</p>
                <p> $15,424/release</p>
              </span>
            </span>
          </div>
        </div>

        {/*  supporters and make payments */}

        <div className="flex justify-center items-start gap-6 mt-44 mb-10 w-4/5 text-white">
          {/* Left: Top supporters */}
          <div className="w-full rounded-lg bg-gray-900/70 border border-gray-700 p-5">
            <h3 className="text-lg font-semibold mb-4">Top 10 Supporters</h3>
            <ul className="space-y-3 text-gray-200 text-sm">
              {[
                { name: "Vijay", amount: 46666, message: "Loan ke paise hain" },
                { name: "Harry", amount: 45500, message: "Le lo bhai" },
                { name: "Kriti", amount: 566, message: "Rakh lo bhaiya" },
                { name: "Harry", amount: 200, message: "200 rs le lo" },
                {
                  name: "Shubh",
                  amount: 122,
                  message: "bhai rakh lena toffee kha lena",
                },
                { name: "Rohan", amount: 46, message: "nahi dunga" },
                { name: "Harry", amount: 45, message: "testing" },
                { name: "Harry", amount: 45, message: "sdsfds" },
                {
                  name: "Priya",
                  amount: 4,
                  message: "Thanks for providing this option",
                },
              ].map((s, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-xs">
                    🥤
                  </span>
                  <span>
                    <span className="font-medium">{s.name}</span> donated
                    <span className="font-semibold"> ₹{s.amount}</span> with a
                    message &quot;{s.message}&quot;
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Make a Payment */}
          <div className="w-full rounded-lg bg-gray-900/70 border border-gray-700 p-5">
            <h3 className="text-lg font-semibold mb-4">Make a Payment</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Name"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="text"
                placeholder="Enter Message"
                value={supporterMessage}
                onChange={(e) => setSupporterMessage(e.target.value)}
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button
                disabled={isLoading || !amount}
                onClick={() => startCheckout(Number(amount))}
                className="w-full rounded-md bg-gradient-to-r from-gray-400 to-gray-600 text-black py-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Pay"}
              </button>
              <div className="flex gap-2">
                {[10, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => startCheckout(amt)}
                    disabled={isLoading}
                    className="rounded-md bg-gray-800 border border-gray-700 px-3 py-1 text-xs text-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Pay ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Username;
