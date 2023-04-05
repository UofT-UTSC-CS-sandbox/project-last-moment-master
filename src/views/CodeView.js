import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import sharedb from "sharedb/lib/client";
import Loading from "../components/Loading";
import CodeArea from "../components/CodeArea";
import CodeViewFooter from "../components/CodeViewFooter";
import VideoChat from "../components/VideoChat";
import roomAPI from "../service/room";

const port = 3002;
let socket;
let connection;
let doc;
// var codeRoomId;

export const ExternalApiComponent = () => {
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });
  const [content, setContent] = useState("");
  const [codeRoomId, setCodeRoomId] = useState("");
  const [owner, setOwner] = useState("");
  //use to control join room button
  const [disable, setDisable] = useState(false);
  // const [doc, setDoc] = useState();

  const { loginWithPopup, getAccessTokenWithPopup } = useAuth0();

  useEffect(() => {
    if(disable){
      socket = new WebSocket(`ws://localhost:${port}`);
      connection = new sharedb.Connection(socket);
    }
  }, [disable]);

  useEffect(() => {
    const onUnload = (e) => {
      e.preventDefault();
      handleLeaveRoom();
    };
  
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("unload", onUnload);
  
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("unload", onUnload);
    };
  }, []);  

  const handleChange = (value) => {
    if(!connection || connection === undefined){
      socket = new WebSocket(`ws://localhost:${port}`);
      connection = new sharedb.Connection(socket);
    }
    doc = connection.get("coderooms", codeRoomId);
    console.log(codeRoomId, doc);
    doc.submitOp([{ p: ["content"], ld: doc.data[0], li: value }], (err) => {
      if (err) throw err;
    });
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

  const handleCreateRoom = async () => {
    setDisable(true);
    roomAPI
      .createRoom(owner)
      .then((res) => {
        setCodeRoomId(res.data._id);
        if(!connection || connection === undefined){
          socket = new WebSocket(`ws://localhost:${port}`);
          connection = new sharedb.Connection(socket);
        }
        // setDoc(connection.get("coderooms", codeRoomId));
        doc = connection.get("coderooms", res.data._id);
        doc.on("op", () => {
          setContent(doc.data.content);
        });
        doc.subscribe((err) => {
          if (err) throw err;
          // setDoc(doc);
        });
        console.log(doc);
        return;
      }).catch((error) => {
        setDisable(false);
        alert(error);
        throw error;
      });
  };

  const handleJoinRoom = async () => {
    setDisable(true);
    roomAPI
      .joinRoom(codeRoomId, owner)
      .then(async (res) => {
        setCodeRoomId(res.data._id);
        // codeRoomId = res.data._id;
        if(!connection || connection === undefined){
          socket = new WebSocket(`ws://localhost:${port}`);
          connection = new sharedb.Connection(socket);
        }
        // setDoc(connection.get("coderooms", codeRoomId));
        doc = await connection.get("coderooms", res.data._id);
        doc.on("op", () => {
          setContent(doc.data.content);
        });
        doc.on("load", () => {
          setContent(doc.data.content);
          console.log(doc.data);
          console.log("load");
        });
        doc.on("create", () => {
          setContent(doc.data.content);
          console.log(doc.data);
          console.log("create");
        });
        doc.subscribe((err) => {
          if (err) {
            setDisable(false);
            throw err;
          }
        });
        return () => {
          setDisable(false);
          if (doc) {
            doc.destroy();
          }
        };
      }).catch((error) => {
        setDisable(false);
        alert(error);
        throw error;
      }); 
  };

  const handleLeaveRoom = async () => {
    roomAPI
      .leaveRoom(codeRoomId, owner)
      .then((res) => {
        // setCodeRoomId("");
        setContent("");
        roomAPI
          .getRoom(codeRoomId)
          .then((res2) => {
            if (!res2.data.owner) {
              handleDeleteRoom();
            }
            setDisable(false);
            setCodeRoomId("");
          })
          .catch((error) => {
            alert(error);
            throw error;
          });
        return () => {
          setDisable(false);
          if (doc) {
            doc.destroy();
          }
        };
      });
  };

  const handleDeleteRoom = async () => {
    roomAPI
      .deleteRoom(codeRoomId, owner)
      .then((res) => {
        setContent("");
        setDisable(false);
        setCodeRoomId("");
        return () => {
          if (doc) {
            doc.destroy();
          }
        };
      }).catch((error) => {
        setDisable(true);
        alert(error);
        throw error;
      });
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
      {!disable && 
        <div>
          <input
            type="text"
            placeholder="please enter your name"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="mx-4 mt-10 sborder border-[#ccdcbe] rounded-md font-mono px-3 py-2 w-2/3 focus:outline-none focus:ring focus:border-[#a5c392] drop-shadow-xl"
          />
          <button 
            className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl"
            onClick={handleCreateRoom}
          >
            Create a Room
          </button>
          <input
            type="text"
            placeholder="enter a room ID"
            value={codeRoomId}
            onChange={(e) => setCodeRoomId(e.target.value)}
            className="mx-4 mt-10 sborder border-[#ccdcbe] rounded-md font-mono px-3 py-2 w-2/3 focus:outline-none focus:ring focus:border-[#a5c392] drop-shadow-xl"
          />
          <button 
            className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl"
            onClick={handleJoinRoom}
          >
            Or enter a room
          </button>
        </div>}
      {disable && <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <VideoChat />
          <h2 className="text-xl font-bold text-[#ccdcbe] left-62">
            roomId: {codeRoomId}
          </h2>
        </div>
        <div style={{ position: "relative" }}>
          <div className="mt-10" style={{ display: "flex" }}>
            <div style={{ flex: 5, overflow: "auto" }}>
              <CodeArea value={content} onChange={handleChange} />
            </div>
            <button
              id="leave-room"
              className="bg-[#e65757] hover:bg-[#d13131] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 right-32"
              onClick={handleLeaveRoom}
            >
              leave room
            </button>
          </div>
        </div>
        <CodeViewFooter value={content} />
        <div className="result-block-container">
          {state.showResult && <div></div>}
        </div>
      </div>}
    </div>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
