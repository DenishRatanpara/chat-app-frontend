// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ChatWindow from "./ChatWindow";
// import PendingRequest from "./PendingRequest";
// import SearchUser from "./SearchUser";
// import { Search, MessageSquare, Users } from "lucide-react";

// const Home = () => {
//   const [chats, setChats] = useState([]);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearchUser, setShowSearchUser] = useState(false);
//   const navigate = useNavigate();
//   const socketRef = useRef(null);

//   const token = localStorage.getItem("token");
//   const currentUserId = localStorage.getItem("user_id");
//   const currentUsername = localStorage.getItem("username");

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/auth/users/",
//           {
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         setChats(response.data);
//         setFilteredChats(response.data);
//       } catch (error) {
//         console.error("Error fetching chats:", error);
//       }
//     };

//     if (token) {
//       fetchChats();
//     } else {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     if (searchQuery) {
//       const filtered = chats.filter((chat) =>
//         chat.other_user_username
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       );
//       setFilteredChats(filtered);
//     } else {
//       setFilteredChats(chats);
//     }
//   }, [searchQuery, chats]);

//   useEffect(() => {
//     const wsUrl = `ws://127.0.0.1:8000/ws/chatlist/?token=${token}`;
//     socketRef.current = new WebSocket(wsUrl);

//     socketRef.current.onopen = () => {
//       console.log("WebSocket connection for chat list established");
//     };

//     socketRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setChats((prevChats) => {
//         const updatedChats = prevChats.map((chat) =>
//           chat.other_user_id.toString() === data.other_user_id.toString()
//             ? {
//                 ...chat,
//                 latest_message_content: data.message,
//                 latest_message_time: data.timestamp,
//               }
//             : chat
//         );
//         return updatedChats.sort(
//           (a, b) =>
//             new Date(b.latest_message_time) - new Date(a.latest_message_time)
//         );
//       });
//     };

//     socketRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, [token]);

//   function formatTimestamp(timestamp) {
//     const messageDate = new Date(timestamp);
//     const now = new Date();
//     return now - messageDate < 86400000
//       ? messageDate.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : messageDate.toLocaleDateString();
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
//         <div className="bg-[#075E54] text-white p-4 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//               <span className="text-[#075E54] font-semibold">
//                 {currentUsername?.[0]?.toUpperCase() || "?"}
//               </span>
//             </div>
//             <h1 className="text-xl font-semibold">Chats</h1>
//           </div>
//           <Users
//             className="h-6 w-6 cursor-pointer hover:text-gray-300"
//             onClick={() => setShowSearchUser(!showSearchUser)}
//           />
//         </div>
//         <div className="p-3 border-b border-gray-200">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search chats..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#075E54] focus:bg-white"
//             />
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//         </div>
//         <div className="p-3">
//           <PendingRequest />
//         </div>
//         {showSearchUser && (
//           <div className="p-3">
//             <SearchUser />
//           </div>
//         )}
//         <div className="flex-1 overflow-y-auto">
//           {filteredChats.length > 0 ? (
//             filteredChats.map((chat) => (
//               <div
//                 key={chat.other_user_id}
//                 onClick={() =>
//                   setSelectedUser({
//                     id: chat.other_user_id,
//                     username: chat.other_user_username,
//                   })
//                 }
//                 className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
//                   selectedUser?.id === chat.other_user_id ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-gray-600 font-semibold">
//                     {chat.other_user_username[0].toUpperCase()}
//                   </span>
//                 </div>
//                 <div className="ml-4 flex-1 min-w-0">
//                   <div className="flex justify-between items-baseline">
//                     <h3 className="text-sm font-semibold text-gray-900 truncate">
//                       {chat.other_user_username}
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       {formatTimestamp(chat.latest_message_time)}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-500 truncate">
//                     {chat.latest_message_content || "No messages yet"}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full text-gray-500">
//               <MessageSquare className="h-12 w-12 mb-2" />
//               <p>No chats found</p>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="flex-1">
//         {selectedUser ? (
//           <ChatWindow
//             otherUserId={selectedUser.id}
//             otherUsername={selectedUser.username}
//             token={token}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//           />
//         ) : (
//           <div className="h-full flex items-center justify-center bg-[#F0F2F5]">
//             <div className="text-center text-gray-500">
//               <MessageSquare className="h-16 w-16 mx-auto mb-4" />
//               <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
//               <p>Select a conversation to start messaging</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import PendingRequest from "./PendingRequest";
import SearchUser from "./SearchUser";
import { Search, MessageSquare, Users, LogOut } from "lucide-react";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchUser, setShowSearchUser] = useState(false);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("user_id");
  const currentUsername = localStorage.getItem("username");

  // Logout function: clears localStorage and navigates to login page
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          "https://web-chat-application-a0f4.onrender.com/api/auth/users/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setChats(response.data);
        setFilteredChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (token) {
      fetchChats();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = chats.filter((chat) =>
        chat.other_user_username
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  useEffect(() => {
    const wsUrl = `wss://web-chat-application-a0f4.onrender.com/ws/chatlist/?token=${token}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection for chat list established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat.other_user_id.toString() === data.other_user_id.toString()
            ? {
                ...chat,
                latest_message_content: data.message,
                latest_message_time: data.timestamp,
              }
            : chat
        );
        return updatedChats.sort(
          (a, b) =>
            new Date(b.latest_message_time) - new Date(a.latest_message_time)
        );
      });
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token]);

  function formatTimestamp(timestamp) {
    const messageDate = new Date(timestamp);
    const now = new Date();
    return now - messageDate < 86400000
      ? messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : messageDate.toLocaleDateString();
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="bg-[#075E54] text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-[#075E54] font-semibold">
                {currentUsername?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <h1 className="text-xl font-semibold">Chats</h1>
          </div>
          <div className="flex space-x-3">
            <Users
              className="h-6 w-6 cursor-pointer hover:text-gray-300"
              onClick={() => setShowSearchUser(!showSearchUser)}
            />
            <LogOut
              className="h-6 w-6 cursor-pointer hover:text-gray-300"
              onClick={logout}
            />
          </div>
        </div>
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#075E54] focus:bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-3">
          <PendingRequest />
        </div>
        {showSearchUser && (
          <div className="p-3">
            <SearchUser />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.other_user_id}
                onClick={() =>
                  setSelectedUser({
                    id: chat.other_user_id,
                    username: chat.other_user_username,
                  })
                }
                className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  selectedUser?.id === chat.other_user_id ? "bg-gray-100" : ""
                }`}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-semibold">
                    {chat.other_user_username[0].toUpperCase()}
                  </span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {chat.other_user_username}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(chat.latest_message_time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.latest_message_content || "No messages yet"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p>No chats found</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow
            otherUserId={selectedUser.id}
            otherUsername={selectedUser.username}
            token={token}
            currentUserId={currentUserId}
            currentUsername={currentUsername}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-[#F0F2F5]">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
