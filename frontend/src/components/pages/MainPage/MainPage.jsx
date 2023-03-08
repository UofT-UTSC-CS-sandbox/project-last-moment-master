//client side of sharedb
import sharedb from "sharedb/lib/client";
import StringBinding from "sharedb-string-binding";
import React, { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import "./MainPage.css";
// import './dist/bundle.js'

const MainPage = () => {
  const textareaRef = useRef(null);
  const connectionRef = useRef(null);
  const statusRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const host = "localhost:8080";
    const socket = new ReconnectingWebSocket(`ws://${host}`);
    const connection = new sharedb.Connection(socket);

    socketRef.current = socket;
    connectionRef.current = connection;

    socket.addEventListener("open", () => {
      statusRef.current.innerHTML = "Connected";
      textareaRef.current.style.backgroundColor = "white";
    });

    socket.addEventListener("close", () => {
      statusRef.current.innerHTML = "Disconnected";
      textareaRef.current.style.backgroundColor = "gray";
    });

    socket.addEventListener("error", () => {
      statusRef.current.innerHTML = "Error";
      textareaRef.current.style.backgroundColor = "red";
    });

    const doc = connection.get("code", "codearea");
    doc.subscribe((err) => {
      if (err) throw err;

      console.log(textareaRef.current, doc, ["content"]);
      const binding = new StringBinding(textareaRef.current, doc, ["content"]);
      binding.setup();
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <div id="container mt-30">
        <p className="text-green-200 ">
          Connection Status:{" "}
          <span id="status-span" className="text-green-200" ref={statusRef}>
            Not Connected
          </span>
        </p>
        <textarea className="min-h-fit" ref={textareaRef} autoFocus />
      </div>
      {/* <script src="dist/bundle.js"></script> */}
    </div>
  );
};

export default MainPage;
