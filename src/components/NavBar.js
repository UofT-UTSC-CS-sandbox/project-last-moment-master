import React from "react";
import logo from "../assets/logo.svg";
import { NavLink as RouterNavLink } from "react-router-dom";

import { NavLink } from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  return (
    <nav className="bg-[#2e3e29] fixed border-[#2e3e29] px-2 sm:px-4 py-2.5 w-full rounded z-20 top-0 left-0 border-b font-mono">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <NavLink tag={RouterNavLink} to="/" className="flex items-center">
          <img src={logo} className="h-6 mr-3 sm:h-9" alt="Skillvitrine Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-[#c8dabc]">
            Skillvitrine
          </span>
        </NavLink>
        {!isAuthenticated && (
          <div className="flex items-center md:order-2">
            <button
              type="button"
              className="text-white bg-[#668f53] hover:bg-[#527642] focus:ring-4 focus:outline-none focus:ring-[#a4c393] rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-[#527642] dark:hover:bg-[#3e5833] dark:focus:ring-[#35472d] font-bold font-mono"
              onClick={() => loginWithRedirect({})}
            >
              Login / Sign Up
            </button>
          </div>
        )}
        {isAuthenticated && (
          <div className="flex items-center md:order-2">
            <button
              type="button"
              className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={user.picture}
                alt="user"
              />
            </button>
            <div
              className="absolute top-16 right-5 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    activeClassName="bg-gray"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white font-mono"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    activeClassName="bg-gray"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white font-mono"
                  >
                    Settings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    activeClassName="bg-gray"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white font-mono"
                  >
                    Earnings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    activeClassName="bg-gray"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white font-mono"
                    onClick={() => logoutWithRedirect()}
                  >
                    Sign out
                  </NavLink>
                </li>
              </ul>
            </div>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        )}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="mobile-menu-2"
        >
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
            <li>
              <NavLink
                tag={RouterNavLink}
                to="/"
                activeClassName="bg-gray"
                className="block py-2 pl-3 pr-4 text-lg rounded md:bg-transparent md:text-[#c8dabc] hover:text-[#f2f6ef] md:p-0 font-mono font-bold"
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink
                  tag={RouterNavLink}
                  to="/codeView"
                  activeClassName="bg-gray"
                  className="block py-2 pl-3 pr-4 text-[#c8dabc] text-lg rounded hover:text-[#f2f6ef] md:hover:bg-transparent md:p-0 font-mono font-bold"
                >
                  CodeView
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <NavLink
                  tag={RouterNavLink}
                  to="/profile"
                  activeClassName="bg-gray"
                  className="block py-2 pl-3 pr-4 text-[#c8dabc] text-lg rounded hover:text-[#f2f6ef] md:hover:bg-transparent md:p-0 font-mono font-bold"
                >
                  Profile
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
