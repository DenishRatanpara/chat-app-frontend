import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchUser = () => {
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://web-chat-application-a0f4.onrender.com/ws/chatlist/?token=${token}`
    );

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "friend_update") {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === data.user_id ? { ...user, is_friend: true } : user
          )
        );
      }
    };

    return () => ws.close();
  }, [token]);

  const handleSearch = async () => {
    if (!token) return console.error("No token found!");
    try {
      const response = await axios.get(
        `https://web-chat-application-a0f4.onrender.com/api/auth/users/search/?search=${searchTerm}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await axios.post(
        "https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/send/",
        { to_user: userId },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error(
        "Send request error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Search Users</h2>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#075E54]"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#075E54] text-white rounded-md hover:bg-[#064E42] transition"
        >
          Search
        </button>
      </div>
      <ul className="space-y-2">
        {users.length === 0 ? (
          <li className="text-gray-500">No users found with that name</li>
        ) : (
          users.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center p-3 border-b border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-gray-700 font-medium">{user.username}</span>
              {user.is_friend ? (
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-600 rounded-md"
                  disabled
                >
                  Connected
                </button>
              ) : user.has_pending_request_sent ? (
                <button
                  className="px-3 py-1 bg-yellow-400 text-white rounded-md"
                  disabled
                >
                  Request Sent
                </button>
              ) : user.has_pending_request_received ? (
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  disabled
                >
                  Respond to Request
                </button>
              ) : (
                <button
                  onClick={() => sendRequest(user.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Send Request
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchUser;
