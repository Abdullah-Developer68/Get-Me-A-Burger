import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 flex items-center justify-center px-4 h-16 gap-10">
      <div className="logo font-bold">Get-ME-A-Coke</div>
      <p className="text-center">
        Copyright &copy; {new Date().getFullYear()} Get me a Coke - All rights
        reserved!
      </p>
    </footer>
  );
};

export default Footer;
