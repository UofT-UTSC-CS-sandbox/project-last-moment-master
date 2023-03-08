import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthBtn from "../AuthBtn/AuthBtn.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const navigate = useNavigate();

  function handleClose(e) {
    setErrorMessage("");
  }

  function handleLogin(e) {
    if (email === "" || password === "") {
      setLoggingIn(false);
      return setErrorMessage(
        "please enter all the fields:\n - email\n - password"
      );
    }
    setLoggingIn(true);
    setErrorMessage("");
    axios
      .post(
        process.env.REACT_APP_API_SERVER_URL + "/api/users/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": process.env.REACT_APP_API_SERVER_URL,
          },
        }
      )
      .then(function (response) {
        if (response.data.token) {
          setLoggingIn(false);
          navigate("/mainpage");
        }
      })
      .catch(function (error) {
        setLoggingIn(false);
        setErrorMessage(error.response.data.error);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Login</h1>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <div className="flex items-center justify-between">
            <button className="btn" type="submit" onClick={handleLogin}>
              Login
            </button>
            <AuthBtn />
          </div>
          {loggingIn && (
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-full h-full text-center text-blue-500 font-bold">
                Loading...
              </div>
            </div>
          )}
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline">{errorMessage}</span>
              <button
                className="absolute top-0 right-0 px-4 py-3"
                onClick={() => handleClose()}
              >
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 5.652a.999.999 0 1 0-1.414 1.414L11 7.414l-1.934 1.934a.999.999 0 1 0 1.414 1.414L12.414 9l1.934 1.934a.999.999 0 1 0 1.414-1.414L13.828 9l1.52-1.52a.999.999 0 0 0 0-1.414z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
