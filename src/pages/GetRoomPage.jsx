import { useContext, useEffect, useState } from "react";
import { ClientContext } from "../contexts/clientProvider";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Link } from "react-router-dom";

import config from "./components/ChatBot/chatbotConfig";
import MessageParser from "./components/ChatBot/MessageParser";
import ActionProvider from "./components/ChatBot/ActionProvider";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { Button, Modal } from "react-bootstrap";
import "./components/ChatBot/ChatBotModal.css";

function GetRoomPage() {
  const client = useContext(ClientContext);
  const [meetings, setMeetings] = useState([]);
  const auth = useAuthUser();
  const [showChats, setShowChats] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        let response = await client.post("/users/get_all_activity", {
          user_id: auth.username,
        });
        
        setMeetings(response.data.rooms);
        setShowChats(Array(response.data.rooms.length).fill(false));
      } catch (err) {
        console.log("error occured ! ");
        console.dir(err);
        setMeetings([]);
      }
    };

    fetchMeetings();
  }, []);
  return (
    <div className="container p-5 mt-5">
      <div className="row fs-1 mx-5">Your Rooms!</div>
      <div className="row ">
        <div className="col ">
          <ol className="list-group list-group-numbered roomListContainer border">
            {meetings.length == 0 && (
              <p className="text-center my-auto">no such rooms yet! </p>
            )}
            {meetings &&
              meetings.map((meeting, index) => {
                const to = "/room/".concat(meeting.meetingCode);
                return (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-dark"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{meeting.meetingCode}</div>
                      {meeting.date}
                    </div>
                    <Button
                      variant="btn btn-outline-success me-1"
                      onClick={() => {
                        setShowChats((prevArray) =>
                          prevArray.map((item, i) =>
                            i === index ? !item : item
                          )
                        );
                      }}
                    >
                      Chat
                    </Button>
                    <span class="badge badge-secondary bg-primary mt-2 me-1">
                      {auth.username == meeting.user_id ? "created" : "joined"}
                    </span>
                    <Link className="badge text-bg-dark rounded-pill" to={to}>
                      <NavigateNextRoundedIcon />
                    </Link>
                  </li>
                );
              })}
          </ol>
        </div>
        <div className="col">
          <img
            src="https://image.shutterstock.com/image-vector/phones-people-using-virtual-communication-260nw-1692506122.jpg"
            style={{ height: "100%", width: "100%", borderRadius: "5px" }}
          ></img>
        </div>
      </div>

      {meetings &&
        meetings.map((meeting, index) => {
          return (
            <Modal
              key={index}
              show={showChats[index]}
              onHide={() =>
                setShowChats((prevArray) =>
                  prevArray.map((item, i) => (i === index ? !item : item))
                )
              }
            >
              <Modal.Header closeButton>
                <Modal.Title>ChatBot</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Chatbot
                  config={config}
                  messageParser={MessageParser}
                  actionProvider={ActionProvider}
                  transcripts={meeting.transcripts}
                />
              </Modal.Body>
            </Modal>
          );
        })}
    </div>
  );
}

export default GetRoomPage;
