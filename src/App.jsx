import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { userChats } from "./requests/chatRequests";
import AllUsers from "./components/AllUsers";

import Conversation from "./components/Conversation";
import ChatBox from "./components/ChatBox";

import { io } from "socket.io-client";

import "./App.css";

function App() {
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const { loginWithRedirect, user, isAuthenticated, isLoading, error } =
    useAuth0();

  const socket = useRef();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await userChats(user?.sub);
        setChats(response.data.chats);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_URL);
    socket.current.emit("new-user-add", user?.sub);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // receive message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (message) => {
      setReceiveMessage(message);
    });
  });

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user?.sub);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const closeModal = () => {
    setShowAllUsers(false);
  };

  return (
    <div className="w-screen h-screen">
      {error && <div className="">Error Authenticating user</div>}
      {!error && isLoading && <div className="">loading...</div>}

      {!isLoading && !error && (
        <div className="flex h-screen">
          {/* Left side */}
          <div className="w-1/4 bg-gray-800 text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Chat App</h1>
            <div>
              <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-4">Chats</h1>
                <p
                  onClick={() => {
                    setShowAllUsers(true);
                  }}
                  className="cursor-pointer"
                >
                  new
                </p>
              </div>

              {showAllUsers && (
                <AllUsers
                  currentUserId={user?.sub}
                  closeModal={closeModal}
                  setCurrentChat={setCurrentChat}
                />
              )}
              <div className="space-y-4">
                {chats?.map((chat, index) => (
                  <div
                    key={index}
                    className=""
                    onClick={() => setCurrentChat(chat)}
                  >
                    <Conversation
                      data={chat}
                      currentUserId={user?.sub}
                      online={checkOnlineStatus(chat)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="w-3/4 h-full bg-white p-4">
            <ChatBox
              chat={currentChat}
              currentUser={user?.sub}
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
