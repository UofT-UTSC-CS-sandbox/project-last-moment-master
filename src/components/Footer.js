import React from "react";

const Footer = () => (
  <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-[#668f53] border-t border-[#668f53] shadow md:flex md:items-center md:justify-between md:p-6">
    <span className="text-sm text-[#c8dabc] sm:text-center">
      © 2023{" "}
      <a
        href="https://github.com/orgs/UofT-UTSC-CS-sandbox/teams/last-moment-master"
        className="hover:underline"
      >
        Last Moment Master
      </a>
      . All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-[#c8dabc] sm:mt-0">
      <li>
        <a href="/" className="mr-4 hover:underline md:mr-6 ">
          About
        </a>
      </li>
      <li>
        <a href="/" className="mr-4 hover:underline md:mr-6">
          Privacy Policy
        </a>
      </li>
      <li>
        <a href="/" className="mr-4 hover:underline md:mr-6">
          Licensing
        </a>
      </li>
      <li>
        <a href="/" className="hover:underline">
          Contact
        </a>
      </li>
    </ul>
  </footer>
);

export default Footer;
