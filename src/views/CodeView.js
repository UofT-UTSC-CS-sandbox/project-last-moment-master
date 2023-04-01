import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import sharedb from "sharedb/lib/client";
import Loading from "../components/Loading";
import CodeArea from "../components/CodeArea";
import DescArea from "../components/DescArea";
import CodeViewFooter from "../components/CodeViewFooter";
import VideoChat from "../components/VideoChat";

const port = process.env.API_PORT || 3002;
const socket = new WebSocket(`ws://localhost:${port}`);
const connection = new sharedb.Connection(socket);

export const ExternalApiComponent = () => {
  const { apiOrigin = "http://localhost:3001" } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });
  const [content, setContent] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const docRef = React.useRef(null);

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup } =
    useAuth0();

  const callApi = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiOrigin}/api/codeViewId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    return responseData.id;
  }, [getAccessTokenSilently, apiOrigin]);

  useEffect(() => {
    const fetchData = async () => {
      const doc = connection.get(await callApi(), "textarea");
      doc.subscribe((err) => {
        if (err) throw err;
        setContent(doc.data.content);
      });
      doc.on("op", () => {
        setContent(doc.data.content);
      });
      docRef.current = doc;
      return () => {
        if (docRef.current) {
          docRef.current.destroy();
        }
      };
    };
    return fetchData();
  }, [callApi]);

  const handleChange = (value) => {
    docRef.current.submitOp([
      { p: ["content"], ld: docRef.current.data[0], li: value },
    ]);
    setContent(value);
  };

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <div className="mt-24">
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              className="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              className="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}
      </div>
      <button 
        className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold font-mono rounded-lg px-6 py-3 drop-shadow-xl"
        onClick={() => setShowVideo(!showVideo)}
      >
        {showVideo ? "Hide" : "Show"} Video Chat
      </button>
      <div className="mt-4" style={{ display: "flex" }}>
        <div style={{ flex: 3, overflow: "auto" }}>
          {showVideo && 
            <div className="fixed w-full h-full z-50 flex justify-center items-center"
            >
              <VideoChat isopen={showVideo}/>
            </div>
          }
          <CodeArea value={content} onChange={handleChange} />
        </div>
        <div style={{ flex: 2, overflow: "auto" }}>
          <DescArea />
        </div>
      </div>
      <CodeViewFooter value={content} />
      <div className="result-block-container">
        {state.showResult && <div></div>}
      </div>
    </div>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
