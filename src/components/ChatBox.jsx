/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { format } from "timeago.js";
import { getUser } from "../requests/userRequests";
import { getMessages } from "../requests/messageRequest";
import { sendMessage } from "../requests/messageRequest";
import InputEmoji from "react-input-emoji";

function ChatBox({ chat, currentUser, setSendMessage, receiveMessage }) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const scroll = useRef();

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat?._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  //   fetching user data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data?.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  //   fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat?._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleSend = async () => {
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    try {
      const { data } = await sendMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    // send new message to socket seerver
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full">
      {chat ? (
        <div className="h-full flex flex-col gap-5">
          <div className="flex items-center py-4 px-10 shadow-2xl">
            <img
              width={50}
              height={50}
              className="rounded-full"
              src={userData?.picture}
              alt={userData?.name}
            />
            <div className="ml-5">
              <h1 className="text-white font-bold text-lg">{userData?.name}</h1>
              {/* <p className="text-black">{online ? "online" : "offline"}</p> */}
            </div>
          </div>
          {/* chat body */}

          <div className="h-full overflow-y-scroll no-scrollbar px-5">
            {messages?.map((message) => (
              <div
                ref={scroll}
                key={message._id}
                className={`flex mb-2 ${
                  message?.senderId === currentUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-2 py-3 px-5 max-w-[500px] ${
                    message?.senderId === currentUser
                      ? "bg-[#6b8afd] text-white text-right rounded-tr-3xl rounded-bl-3xl"
                      : "bg-[#3b3f47] text-white text-left rounded-tl-3xl rounded-br-3xl backdrop-filter backdrop-blur-2xl"
                  }`}
                >
                  <p className="text-xl">{message?.text}</p>
                  <p className="text-[8px]">{format(message?.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* chat sender */}
          <div className="flex gap-2 items-center p-5 bg-white">
            <div>+</div>
            <InputEmoji
              value={newMessage}
              onChange={setNewMessage}
              onEnter={handleSend}
            />
            <div
              onClick={handleSend}
              className="bg-blue-600 rounded-xl px-4 py-2 cursor-pointer"
            >
              <p className="text-white text-xl capitalize">send</p>
            </div>
          </div>
        </div>
      ) : (
        <h1>Tap on message to start chatting</h1>
      )}
    </div>
  );
}

export default ChatBox;
