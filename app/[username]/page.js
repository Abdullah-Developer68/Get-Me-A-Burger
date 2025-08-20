"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const Username = () => {
  // this is used to extract the URL parameters and a route/page can accept url paramters if the file is made using [filename]
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
  const [payData, setPayData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [averageAmount, setAverageAmount] = useState(0);
  const [uniqueSupporters, setUniqueSupporters] = useState(0);
  const [topSupporters, setTopSupporters] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  // this sends a req to the checkout api route for donating money via stripe
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
        // stripe returns a url for its checkout page and we are redirecting to it.
        // For performance we often use useNavigate hook but this is an external page and not a part of the application so for this full browser navigation is required.
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentPaymentInfo = async () => {
    // GET requests shouldn't have a body. Send username as a query param instead.
    const res = await fetch(
      `/api/payment?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setPayData(Array.isArray(data) ? data : []);
    // Ensure we always store an array to avoid runtime errors when using .map
    setPayData(Array.isArray(data) ? data : []);
    // log the response data (not the state variable immediately after setState)
    console.log("Recent payment info:", data);
  };

  const getStats = async () => {
    const res = await fetch(
      `/api/payment/stats?username=${encodeURIComponent(username)}`
    );
    const data = await res.json();
    console.log("Payment stats:", data);

    setTotalAmount(data?.totalAmount || 0);
    setAverageAmount(data?.averageAmount || 0);
    setUniqueSupporters(data?.uniqueSupporters || 0);
    setTopSupporters(data?.topSupporters || []);
    setTotalDonations(data?.count || 0);
  };

  useEffect(() => {
    getRecentPaymentInfo();
    getStats();
  }, [username]);

  return (
    <>
      <div className="flex flex-col items-center w-full mt-0 pt-0">
        <div className="flex flex-col items-center relative w-full mt-0 pt-0">
          <div className="cover w-full">
            <Image
              src="/coverPage.jpg"
              alt="cover page"
              width={1920}
              height={480}
              priority
              className="w-full object-cover block"
            />
          </div>
          <div className="profilePic absolute bottom-[-140] flex flex-col text-white justify-center items-center gap-2">
            <Image
              src="/profilePic.jpg"
              alt="profile pic"
              width={96}
              height={96}
              className="w-24 rounded-full"
            />
            <span className="flex flex-col gap-2 items-center justify-center text-center">
              <p>{username}</p>
              <p>Created animated Web novels!</p>
              <span className="flex gap-2 justify-center items-center">
                <p>{totalDonations} Donations .</p>
                <p> {uniqueSupporters} supporters .</p>
                <p> ${totalAmount / 100}/release</p>
              </span>
            </span>
          </div>
        </div>

        {/*  supporters and make payments */}
        <div className="flex justify-center items-start gap-6 mt-44 mb-10 w-4/5 text-white">
          <div className="flex flex-col gap-2">
            <div className="w-full rounded-lg bg-gray-900/70 border border-gray-700 p-5">
              <h3 className="text-lg font-semibold mb-4">Top 3 Supporters</h3>
              <ul className="space-y-3 text-gray-200 text-sm">
                {/* Loop over to display the Top supporters */}
                {topSupporters.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-ful text-xs">
                      {idx === 0 ? (
                        <Image
                          src="/medal-1.png"
                          alt="1st place medal"
                          width={24}
                          height={24}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      ) : idx === 1 ? (
                        <Image
                          src="/medal-2.png"
                          alt="2nd place medal"
                          width={24}
                          height={24}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      ) : (
                        <Image
                          src="/medal-3.png"
                          alt="3rd place medal"
                          width={24}
                          height={24}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      )}
                    </span>

                    <span>
                      {s.name} with {s.totalAmount / 100}$ donations!
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Left: Top supporters */}
            <div className="w-full rounded-lg bg-gray-900/70 border border-gray-700 p-5">
              <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
              <ul className="space-y-3 text-gray-200 text-sm">
                {/* Loop over to display the most recent supporters */}
                {payData.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-base leading-none pointer-events-none select-none"
                      aria-hidden="true"
                    >
                      🥤
                    </span>
                    <span>
                      <span className="font-medium">{s.name}</span> donated
                      <span className="font-semibold">
                        {" "}
                        {/* amount is in cents so convert it to dollars */}
                        {s.amount / 100} $
                      </span>{" "}
                      with a message &quot;{s.message}&quot;
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
                    Pay {amt}$
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
