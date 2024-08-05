import { useContext, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ClientContext } from "../../contexts/clientProvider";

function ChatScreen({ socket }) {
  const client = useContext(ClientContext);
  const auth = useAuthUser();
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessageList, setChatMessageList] = useState([]);
  const { roomid } = useParams();

  useEffect(() => {
    // Fetch all messages when component mounts
    const fetchAllMessages = async () => {
      try {
        let response = await client.post("/meeting/get-allmessages", {
          roomId: roomid,
        });
        if (!response.data.success) return;
        const messages = response.data.messageList.map((message) => ({
          sender: message.user_name,
          message: message.message,
        }));
        setChatMessageList(messages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllMessages();

    // Handle incoming chat messages
    const handleChatMessage = (chatMessage) => {
      setChatMessageList((prevList) => {
        const updatedList = [...prevList, chatMessage];
        return updatedList;
      });
    };

    // Add socket listener
    socket.on("chat message", handleChatMessage);

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("chat message", handleChatMessage);
    };
  }, []);

  const addNewMessage = () => {
    console.log(inputMessage);
    if (!inputMessage) return;
    let message = { sender: auth.username, message: inputMessage };
    socket.emit("chat message", message, roomid);
    setInputMessage("");
  };

  return (
    <div className="chatWindow">
      <div className="chatHeading">CHAT MESSAGES</div>
      <div className="chatListContainer">
        {chatMessageList.reverse().map((chatMessage, index) => {
          return chatMessage.sender !== auth.username ? (
            <div className="chatMessageLeft" key={index}>
              <h5>{chatMessage.sender}</h5>
              <p>{chatMessage.message}</p>
            </div>
          ) : (
            <div className="chatMessageRight" key={index}>
              <h5>{chatMessage.sender}</h5>
              <p>{chatMessage.message}</p>
            </div>
          );
        })}
      </div>
      <div className="chatInput">
        <input
          placeholder="Enter chat message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <span onClick={addNewMessage}>
          <SendIcon />
        </span>
      </div>
    </div>
  );
}

export default ChatScreen;
