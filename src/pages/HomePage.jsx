import Button from "@mui/material/Button";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { ClientContext } from "../contexts/clientProvider";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function HomePage() {
  const client = useContext(ClientContext);
  const [meetingCode, setMeetingCode] = useState("");
  const auth = useAuthUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const isAuthenticated = useIsAuthenticated();

  
  const createMeeting = async () => {
    setError("");
    if (!isAuthenticated) {
      setError("you are not sigin/login !");
      return;
    }

    try {
      const response = await client.post("/meeting/create-room", {
        user_id: auth.username,
      });
      if (response.data.success) {
        const roomid = response.data.meetingCode;
        console.log("new room id is ", roomid);
        return navigate(`/room/${roomid}`);
      }

      console.log(response.data);
    } catch (e) {

    }
  };

  const joinMeeting = async () => {
    setError("");
    console.log(meetingCode);
    if (!meetingCode || meetingCode === "") {
      setError("enter a non-empty room id !");
      return;
    }
    return navigate(`/room/${meetingCode}`);
  };

  return (
    <div className="container p-5 mt-5">
      <div className="row">
        <div className="col fs-1 my-auto">
          Video Calls <br /> and Meeting for Everyone!
          <div className="fs-5 fw-light ">
            Collect ,collaborate ,celebrate from anywhere !
          </div>
          <form className="row">
            <Button
              variant="contained"
              className="col-3 p-2 m-4 me-1 ms-0"
              style={{ color: "white", backgroundColor: "black" }}
              onClick={createMeeting}
            >
              New meeting
            </Button>
            <TextField
              id="outlined-basic"
              label="Enter room name /id"
              variant="outlined"
              className="col p-1 m-3 me-1"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
            />

            <Button
              className="col-3 p-2 m-4"
              style={{ color: "black" }}
              onClick={joinMeeting}
            >
              Join
            </Button>
          </form>
          <p style={{ color: "red", fontSize: "1rem" }}>{error}</p>
        </div>
        <div className="col">
          <img
            src="https://managerresourcecenter.com/wp-content/uploads/AdobeStock_333387098.jpeg"
            style={{ height: "100%", width: "100%", borderRadius: "5px" }}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
