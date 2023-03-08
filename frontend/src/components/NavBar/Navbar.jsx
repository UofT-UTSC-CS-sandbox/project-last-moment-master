import { Link } from "react-router-dom";
import React from "react";
import "./NavBar.css";

function Navbar() {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-green-300 font-bold text-xl">
              Skillvitrine
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/" className="text-green-300 hover:text-white mr-4">
              Login
            </Link>
            <Link to="/signup" className="text-green-300 hover:text-white">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
