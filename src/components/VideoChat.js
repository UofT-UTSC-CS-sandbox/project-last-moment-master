import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Draggable from "react-draggable";


const socket = io.connect('http://localhost:3000')
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

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
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
  }, []);

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
  }

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
  }

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  }

  return (
    <Draggable>
      <div className="bg-[#c8dabc] w-96 h-96 rounded-md">
        <div className="myId">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-[#ccdcbe] rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-[#a5c392]"
          />
          <button
            type="button"
            onClick={() => {
              console.log(me);
              navigator.clipboard.writeText(me);
            }}
            className="bg-[#588742] hover:bg-[#416b30] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-8"
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
            className="border border-[#ccdcbe] rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-[#a5c392]"
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <button
                onClick={leaveCall}
                className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
              >
                End Call
              </button>
            ) : (
              <button
                onClick={() => callUser(idToCall)}  
                className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
              >
                Call
              </button>
            )}
            {idToCall}
          </div>
			  </div>
        <div>
          {receivingCall && !callAccepted ? (
              <div className="caller">
              <h1 >{name} is calling...</h1>
              <button 
                className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
                variant="contained" color="primary" onClick={answerCall}
              >
                Answer
              </button>
            </div>
          ) : null}
        </div>
        <div
          className="z-10 bg-[#c8dabc] p-1 border border-[#c8dabc] rounded grid auto-cols-auto"
          style={{ width: '200px', height: '150px' }}
        >
          {callAccepted && !callEnded ? <video ref={userVideo} autoPlay /> : null}
        </div>
        <div
          className="z-10 bg-[#c8dabc] p-1 border border-[#c8dabc] rounded grid auto-cols-auto"
          style={{ width: '200px', height: '150px' }}
        >
          {stream && <video ref={myVideo} autoPlay muted/>}
        </div>
        
      </div>
    </Draggable>
  );

};

export default VideoChat;