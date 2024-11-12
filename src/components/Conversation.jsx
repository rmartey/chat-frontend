/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import { getUser } from "../requests/userRequests.js";

function Conversation({ data, currentUserId, online, checkActiveChat }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data?.members.find((id) => id !== currentUserId);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data?.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);

  return (
    <div>
      <div
        className={`flex items-center rounded-md p-2 ${
          checkActiveChat ? "bg-[#3b3f47]" : "bg-transparent"
        }`}
      >
        <div className="relative">
          <img
            width={50}
            height={50}
            className="rounded-full"
            src={userData?.picture}
            alt={userData?.name}
          />
          {online && (
            <div className="absolute top-1 right-1 transform translate-x-1/4 -translate-y-1/4 rounded-full w-[15px] h-[15px] bg-green-600" />
          )}
        </div>
        <div className="ml-5 hidden md:block">
          <h1 className="line-clamp-1 text-md">{userData?.name}</h1>
          <p className={`text-sm ${online ? "text-green-400" : "text-white"}`}>
            {online ? "online" : "offline"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
