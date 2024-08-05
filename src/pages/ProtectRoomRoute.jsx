import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoCallPage from "./VideoCallPage";
import { Navigate } from "react-router-dom";

const client = axios.create({
  baseURL: "http://localhost:8080",
});

const ProtectedRoute = () => {
  const { roomid } = useParams();
  const [roomExists, setRoomExists] = useState(null);

  useEffect(() => {
    client
      .post("/meeting/join-room", {
        roomId: roomid,
      })
      .then((response) => {
        if (response.data.success) {
          setRoomExists(true);
          return;
        }

        setRoomExists(false);
      })
      .catch((err) => {
        setRoomExists(false);
        console.dir(err);
      });
  }, []);

  if (roomExists === null) {
    return <div>Loading...</div>; // Show a loading state while checking
  }

  return roomExists ? <VideoCallPage /> : <Navigate to="/not-found" />;
};

export default ProtectedRoute;
