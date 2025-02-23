import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, UserPlus } from "lucide-react";

const FriendList = ({ onSelectFriend }) => {
  const token = localStorage.getItem("token");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          "https://web-chat-application-a0f4.onrender.com/api/auth/friends/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friend list:", error);
      }
    };
    fetchFriends();
  }, [token]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#075E54]" />
          <h2 className="text-lg font-semibold text-gray-800">Friends</h2>
        </div>
        <button className="text-[#075E54] hover:text-[#054c44] p-1 rounded-full hover:bg-gray-100 transition-colors">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => onSelectFriend(friend)}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {friend.username[0].toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {friend.username}
                </h3>
                <p className="text-xs text-gray-500">Click to chat</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-2">
            No friends found
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
