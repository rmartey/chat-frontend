/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { getUsers } from "../requests/userRequests";

import { createChat } from "../requests/chatRequests";

function AllUsers({ currentUserId, closeModal, setCurrentChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((data) => {
      console.log("getting all user on the platform", data.data);
      setUsers(data?.data?.data);
    });
  }, []);

  const newChat = (newUserId) => {
    const chat = {
      senderId: currentUserId,
      receiverId: newUserId,
    };

    try {
      createChat(chat).then((data) => {
        setCurrentChat(data?.data);
        closeModal();
      });
    } catch (error) {
      console.log("error", error);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col gap-4 bg-white p-10 rounded-lg">
        <p className="text-xl text-black">Select User</p>
        {users?.map((user) => (
          <div
            key={user?.user_id}
            onClick={() => {
              newChat(user?.user_id);
            }}
          >
            <div>
              <div className="flex items-center bg-gray-100 rounded-md p-2">
                <img
                  width={70}
                  height={70}
                  className="rounded-full"
                  src={user?.picture}
                  alt={user?.name}
                />
                <div className="ml-5">
                  <h1 className="text-black">{user?.name}</h1>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;
