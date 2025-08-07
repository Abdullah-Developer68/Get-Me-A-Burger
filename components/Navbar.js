import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="bg-orange-500 flex justify-between items-center px-4 h-12">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-10 rounded-full" />
          <div className="logo  font-bold">Get me a Burger</div>
        </div>

        {/* <ul className="flex justify-between gap-4">
          <li>Home</li>
          <li>About</li>
          <li>Projects</li>
          <li>Sign Up</li>
          <li>Login</li>
        </ul> */}
        <Link href="/login">
          <button className="bg-green-500 px-4 py-2 rounded-md cursor-pointer">
            Login
          </button>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
