/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import { getUser } from "../requests/userRequests.js";

function Conversation({ data, currentUserId, online }) {
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
      <div className="flex items-center bg-gray-100 rounded-md p-2">
        <div className="relative">
          <img
            width={70}
            height={70}
            className="rounded-full"
            src={userData?.picture}
            alt={userData?.name}
          />
          {online && (
            <div className="absolute top-2 right-2 transform translate-x-1/4 -translate-y-1/4 rounded-full w-[15px] h-[15px] bg-green-600" />
          )}
        </div>
        <div className="ml-5 hidden md:block">
          <h1 className="text-black">{userData?.name}</h1>
          <p className="text-black">{online ? "online" : "offline"}</p>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
