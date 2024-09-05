import React from "react";

const Navbar = () => {
  return (
    <div className="w-full border-b flex items-center justify-center">
      <div className="lg:max-w-7xl w-full py-5 flex justify-between items-center">
        <h1 className="text-primary font-bold text-xl">Crowdfunding</h1>
        <div>
          <ul className="flex gap-2">
            <li>Home</li>
            <li>Projects</li>
            <li>About</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
