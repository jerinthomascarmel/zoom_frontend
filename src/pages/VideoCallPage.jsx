// import React, { useEffect, useRef, useState } from "react";
// import SimplePeer from "simple-peer";
// import { io } from "socket.io-client";
// import { TextField, Button } from "@mui/material";

// const socket = io("https://zoom-backend-u8q7.onrender.com");
// // const socket = io("http://localhost:8080");

// function VideoCallPage() {
//   const [roomId, setRoomId] = useState("");
//   const myVideoRef = useRef();
//   const [peerVideos, setPeerVideos] = useState([]);
//   const remoteVideoRef = useRef();
//   const [callerId, setCallerId] = useState("");
//   const [newJoineeId, setNewJoineeId] = useState("");

//   const [peers, setPeers] = useState([]);

//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         myVideoRef.current.srcObject = stream;

//         socket.on("user-connected", (userId) => {
//           console.log("User connected: ", userId);

//           const peer = new SimplePeer({
//             initiator: true,
//             trickle: false,
//             stream,
//           });

//           // connectionRef.current = peer;
//           setPeers((peers) => [...peers, { conn: peer, userid: userId }]);

//           peer.on("signal", (data) => {
//             socket.emit("callNewUser", {
//               to: userId,
//               from: socket.id,
//               signal: data,
//             });

//             console.log("call new user !");
//           });

//           peer.on("stream", (stream) => {
//             console.log("stream recieved ! ");
//             remoteVideoRef.current.srcObject = stream;
//             createVideoElement(stream);
//             setCallerId("");
//           });

//           socket.on("answerCall", (data) => {
//             console.log("answered call from new user");
//             // const peerList = peers.filter(
//             //   (peerObj) => peerObj.userid == data.from
//             // );
//             peer.signal(data.signal);
//           });
//         });

//         return () => {
//           socket.off("user-connected");
//           socket.off("signal");
//         };
//       });
//   }, []);

//   const joinRoom = () => {
//     console.log("Joining room: ", roomId);
//     socket.emit("join-room", roomId);

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         socket.on("callNewUser", (data) => {
//           const fromUser = data.from;
//           console.log("called by existing user ! ");

//           const peer = new SimplePeer({
//             initiator: false,
//             trickle: false,
//             stream: stream,
//           });

//           // connectionRef.current = peer;
//           setPeers((peers) => [...peers, { conn: peer, userid: data.from }]);

//           peer.on("signal", (data) => {
//             console.log("emit signal back to existing user ! ");
//             socket.emit("answerCall", {
//               to: fromUser,
//               from: socket.id,
//               signal: data,
//             });
//           });

//           peer.on("stream", (stream) => {
//             console.log("Stream received");
//             remoteVideoRef.current.srcObject = stream;
//             createVideoElement(stream);
//             setCallerId("");
//           });

//           peer.signal(data.signal);
//         });
//       });
//   };

//   const createRoom = () => {
//     console.log("Creating room: ", roomId);
//     socket.emit("join-room", roomId);
//   };

//   return (
//     <div>
//       <TextField
//         id="outlined-basic"
//         label="Room"
//         variant="outlined"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <Button variant="contained" onClick={createRoom}>
//         Create Room
//       </Button>
//       <Button variant="contained" onClick={joinRoom}>
//         Join Room
//       </Button>
//       <video ref={myVideoRef} autoPlay playsInline />
//       <video ref={remoteVideoRef} autoPlay playsInline />
//       <div id="videoContainer"></div>
//     </div>
//   );
// }

// export default VideoCallPage;

// const createVideoElement = (stream) => {
//   console.log("Creating video element!");
//   const videoContainer = document.querySelector("#videoContainer");
//   console.log("Video tracks:", stream.getVideoTracks());
//   if (videoContainer) {
//     let newVideo = document.createElement("video");
//     newVideo.srcObject = stream;
//     newVideo.autoPlay = true; // Ensure video plays automatically
//     newVideo.playsInline = true; // For mobile browsers to play inline
//     newVideo.style.width = "300px"; // Set width
//     newVideo.style.height = "200px"; // Set height
//     newVideo.style.margin = "10px"; // Optional: Add some spacing

//     videoContainer.appendChild(newVideo);
//   } else {
//     console.error("Video container not found!");
//   }
// };

function VideoCallPage() {
  return <h>Video call page ! </h>;
}

export default VideoCallPage;
