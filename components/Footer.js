import React from "react";

const Footer = () => {
  return (
    <footer className="bg-orange-500 flex items-center justify-center px-4 h-16 gap-10">
      <div className="logo font-bold">Get-ME-A-Burger</div>
      <p className="text-center">
        Copyright &copy; {new Date().getFullYear()} Get me a Burger - All rights
        reserved!
      </p>
    </footer>
  );
};

export default Footer;
