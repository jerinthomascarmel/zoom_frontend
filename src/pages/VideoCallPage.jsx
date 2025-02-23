import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { io } from "socket.io-client";
import { Button } from "@mui/material";
import VideoCard from "./components/VideoCard";
import Navbar from "./components/Navbar.jsx";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import RoundedIcon from "./components/RoundedIcon.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatScreen from "./components/ChatScreen.jsx";
import { useParams } from "react-router-dom";

const BASEURL = import.meta.env.VITE_BASE_URL;
const socket = io(BASEURL);

function VideoCallPage() {
  const { roomid } = useParams();
  const myVideoRef = useRef();
  const secondaryVideoRef = useRef();
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const [isJoined, setIsJoined] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isChatOpened, setIsChatOpened] = useState(false);
  const streamRef = useRef();
  const isStreamReady = useRef(false);

  useEffect(() => {
    console.log("me :", socket.id);
    const getMediaStream = async () => {
      isStreamReady.current = false;
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = newStream;
        myVideoRef.current.srcObject = newStream;
        secondaryVideoRef.current.srcObject = newStream;
        isStreamReady.current = true;
        startTranscription(newStream);
      } catch (err) {
        console.error("Error getting media stream:", err);
      }
    };

    getMediaStream();

    socket.on("user-disconnected", (userId) => {
      console.log("called user-disconnected ! ");
      // Remove from peersRef
      peersRef.current = peersRef.current.filter(
        (peer) => peer.userid !== userId
      );

      // Update the peers state
      setPeers((prevPeers) =>
        prevPeers.filter((peer) => peer.userid !== userId)
      );
    });

    window.addEventListener("beforeunload", endCall);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      socket.emit("leave-room", roomid);
    };
  }, []);

  const startTranscription = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
    
      console.log('speak is:',finalTranscript);
      socket.emit("on-speak", {
        role: socket.id,
        message: finalTranscript,
        roomid,
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const endCall = () => {
    console.log("end call is called ! ");
    // Destroy all peers
    peersRef.current.forEach(({ conn }) => {
      conn.destroy();
    });

    // Clear peersRef and peers state
    peersRef.current = [];
    setPeers([]);

    // Notify the server that the call has ended
    socket.emit("leave-room", roomid);

    // Optionally, update the UI or redirect the user
    setIsJoined(false);

    if (myVideoRef.current) myVideoRef.current.srcObject = streamRef.current;
    if (secondaryVideoRef.current)
      secondaryVideoRef.current.srcObject = streamRef.current;
  };

  const handleVideoEnable = () => {
    const videoTrack = streamRef.current.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setVideoEnabled(videoTrack.enabled);
  };

  const handleAudioEnable = () => {
    const audioTrack = streamRef.current.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setAudioEnabled(audioTrack.enabled);
  };

  const joinRoom = () => {
    //check isStreamReady
    if (!isStreamReady.current) {
      console.log("media devices is not ready to join room !");
      return;
    }

    setIsJoined(true);
    socket.emit("join-room", roomid);
    console.log("Joining room: ", roomid);

    //for new user joins !
    socket.on("callNewUser", (data) => {
      console.log("calling you (new user) : by ", data.from);
      const fromUser = data.from;
      const peer = addPeer(fromUser, streamRef.current, data);
      console.log(peersRef);
    });

    //for existing user !
    socket.on("user-connected", (userId) => {
      console.log("User connected: ", userId);

      const peer = createPeer(userId, streamRef.current);
    });

    socket.on("answerCall", (data) => {
      let peer = peersRef.current.find((peer) => peer.userid == data.from);
      if (!peer) return;
      peer.conn.signal(data.signal);
    });
  };

  const createPeer = (userId, stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peersRef.current.push({ conn: peer, userid: userId });
    setPeers((peers) => [...peers, { conn: peer, userid: userId }]);

    peer.on("stream", (stream) => {
      setPeers((prevPeers) => {
        const newPeers = prevPeers.map((p) => {
          return p.userid === userId ? { ...p, stream } : p;
        });
        return newPeers;
      });
    });

    peer.on("signal", (data) => {
      // if (data.renegotiate || data.transceiverRequest) return;
      socket.emit("callNewUser", {
        to: userId,
        from: socket.id,
        signal: data,
      });

      console.log("call new user !");
    });

    peer.on("error", (err) => {
      console.log(err);
    });

    return peer;
  };

  const addPeer = (fromUser, stream, data) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peersRef.current.push({ conn: peer, userid: fromUser });
    setPeers((peers) => [...peers, { conn: peer, userid: fromUser }]);

    peer.on("stream", (stream) => {
      setPeers((prevPeers) => {
        const newPeers = prevPeers.map((p) => {
          return p.userid === fromUser ? { ...p, stream } : p;
        });
        return newPeers;
      });
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        to: fromUser,
        from: socket.id,
        signal: data,
      });
    });

    peer.on("error", (err) => {
      console.log(err);
    });

    peer.signal(data.signal);
    return peer;
  };

  return (
    <div>
      {!isJoined && <Navbar />}
      <div
        className="container p-5"
        style={{ display: isJoined ? "none" : "" }}
      >
        <div className="row ">
          <div className="col-8 p-5" style={{ height: "70vh" }}>
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              className="w-100 h-100 rounded"
              style={{ objectFit: "cover", backgroundColor: "black" }}
            />
          </div>
          <div className="col text-center mt-auto mb-auto">
            <h1>Ready to join ?</h1>
            <p>No one else is here !</p>
            <Button
              variant="contained"
              onClick={joinRoom}
              style={{ backgroundColor: "black", borderRadius: "0.5rem" }}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>

      <div
        className="videoChatScreenDiv"
        style={{ display: isJoined ? "" : "none" }}
      >
        <div className="videoContainer">
          <video
            ref={secondaryVideoRef}
            autoPlay
            playsInline
            className="videoElement"
          />
          {peers &&
            peers.map((peer) => {
              return <VideoCard key={peer.userid} peer={peer} />;
            })}
        </div>
        {isChatOpened && (
          <div className="chatScreenDiv">
            <ChatScreen socket={socket} />
          </div>
        )}
        <div className="videoControllerDiv">
          <div className="p-5 fs-5">
            <GroupsIcon style={{ fontSize: "2rem", marginRight: "1rem" }} />
            {roomid}
          </div>
          <div
            className="p-5 childCenterController"
            style={{ display: "flex" }}
          >
            {videoEnabled ? (
              <RoundedIcon
                icon={<VideocamIcon />}
                onClick={handleVideoEnable}
              />
            ) : (
              <RoundedIcon
                icon={<VideocamOffIcon />}
                onClick={handleVideoEnable}
              />
            )}

            {audioEnabled ? (
              <RoundedIcon icon={<MicIcon />} onClick={handleAudioEnable} />
            ) : (
              <RoundedIcon icon={<MicOffIcon />} onClick={handleAudioEnable} />
            )}
            <RoundedIcon
              icon={<CallEndIcon />}
              color={"red"}
              onClick={endCall}
            />
          </div>
          <div className="p-5">
            <RoundedIcon
              icon={<ChatIcon />}
              onClick={() =>
                setIsChatOpened((prev) => {
                  return !prev;
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCallPage;
