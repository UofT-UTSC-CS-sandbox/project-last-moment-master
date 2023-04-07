import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Draggable from "react-draggable";
import ClipboardJS from "clipboard";

let socket;

const VideoChat = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [isopen, setIsopen] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (isopen) {
      socket = io.connect("wss://skillvitrine.wlt.life:3003");

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          myVideo.current.srcObject = stream;
        });

      socket.on("me", (id) => {
        setMe(id);
      });

      socket.on("callUser", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        setStream(null);
      }
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        setStream(null);
      }
    };
  }, [isopen]);

  useEffect(() => {
    const clipboard = new ClipboardJS("#copyButton");
    clipboard.on("success", (e) => {
      console.log("Copied to clipboard:", e.text);
    });
    clipboard.on("error", (e) => {
      console.error("Failed to copy to clipboard:", e);
    });
  }, [me]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    const stopTracks = (stream) => {
      stream.getTracks().forEach((track) => track.stop());
    };

    if (connectionRef.current) {
      userVideo.current.srcObject = null;
      myVideo.current.srcObject = null;
      stopTracks(stream);
    }

    if (stream) {
      stopTracks(stream);
      setStream(null);
    }

    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal(null);
  };

  return (
    <div>
      <button
        className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold font-mono rounded-lg px-6 py-3 drop-shadow-xl"
        onClick={() => setIsopen(!isopen)}
      >
        {isopen ? "Hide" : "Show"} Video Chat
      </button>
      {isopen && (
        <Draggable>
          <div
            className="fixed mt-28 ml-48 transform -translate-x-1/2 -translate-y-1/2 z-50"
            style={{ width: "400px", height: "400px" }}
          >
            <div className="bg-[#c8dabc] mt-16 rounded-md drop-shadow-2xl fixed w-full h-full z-100 flex">
              <div id="form">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mx-4 mt-10 sborder border-[#ccdcbe] rounded-md font-mono px-3 py-2 w-2/3 focus:outline-none focus:ring focus:border-[#a5c392] drop-shadow-xl"
                />
                <button
                  id="copyButton"
                  type="button"
                  data-clipboard-text={me}
                  data-clipboard-action="copy"
                  className="ml-32 mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold font-mono py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mb-8 drop-shadow-xl"
                >
                  Copy ID
                </button>
                <input
                  id="filled-basic"
                  type="text"
                  variant="filled"
                  placeholder="ID to call"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  className="mx-4 border border-[#ccdcbe] rounded-md px-3 py-2 w-2/3 focus:outline-none focus:ring focus:border-[#a5c392] font-mono drop-shadow-xl"
                />
                <div className="call-button">
                  {callAccepted && !callEnded ? (
                    <button
                      onClick={leaveCall}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold font-mono rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 ml-32"
                    >
                      End Call
                    </button>
                  ) : (
                    <button
                      onClick={() => callUser(idToCall)}
                      className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold font-mono rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
                    >
                      Call
                    </button>
                  )}
                </div>
              </div>
              <div id="video">
                {receivingCall && !callAccepted ? (
                  <div className="caller">
                    <h1 className="font-mono fobt-bold">
                      {name} is calling...
                    </h1>
                    <button
                      className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold font-mono rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
                      variant="contained"
                      color="primary"
                      onClick={answerCall}
                    >
                      Answer
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col">
                <div
                  className="z-10 bg-[#c8dabc] p-1 border border-[#c8dabc] rounded grid auto-cols-auto"
                  style={{ width: "150px", height: "100px" }}
                >
                  {callAccepted && !callEnded ? (
                    <video ref={userVideo} autoPlay />
                  ) : null}
                </div>

                <div
                  className="z-10 bg-[#c8dabc] p-1 border border-[#c8dabc] rounded grid auto-cols-auto"
                  style={{ width: "150px", height: "100px" }}
                >
                  {stream && <video ref={myVideo} autoPlay muted />}
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default VideoChat;
