// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import gsap from "gsap";
// import ChatWindow from "./ChatWindow";
// import PendingRequest from "./PendingRequest";
// import SearchUser from "./SearchUser";
// import {
//   Search,
//   MessageSquare,
//   Users,
//   LogOut,
//   Moon,
//   Sun,
//   ArrowLeft,
// } from "lucide-react";

// const Home = () => {
//   const [chats, setChats] = useState([]);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearchUser, setShowSearchUser] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
//   const [showChatList, setShowChatList] = useState(true);
//   const navigate = useNavigate();
//   const socketRef = useRef(null);
//   const chatListRef = useRef(null);
//   const searchBarRef = useRef(null);
//   const welcomeMessageRef = useRef(null);

//   const token = localStorage.getItem("token");
//   const currentUserId = localStorage.getItem("user_id");
//   const currentUsername = localStorage.getItem("username");

//   useEffect(() => {
//     // Initial animations
//     gsap.from(searchBarRef.current, {
//       y: -20,
//       opacity: 0,
//       duration: 0.5,
//       ease: "power2.out",
//     });

//     gsap.from(chatListRef.current, {
//       x: -30,
//       opacity: 0,
//       duration: 0.6,
//       ease: "power2.out",
//       stagger: 0.1,
//     });

//     if (welcomeMessageRef.current) {
//       gsap.from(welcomeMessageRef.current, {
//         scale: 0.9,
//         opacity: 0,
//         duration: 0.5,
//         ease: "back.out",
//       });
//     }
//   }, []);
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get(
//           "https://web-chat-application-a0f4.onrender.com/api/auth/users/",
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
//     // Animate chat list items when filtered
//     if (chatListRef.current) {
//       gsap.from(chatListRef.current.children, {
//         x: -20,
//         opacity: 0,
//         duration: 0.3,
//         stagger: 0.05,
//         ease: "power2.out",
//       });
//     }
//   }, [filteredChats]);

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobileView(mobile);
//       if (!mobile) {
//         setShowChatList(true);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (isMobileView && selectedUser) {
//       setShowChatList(false);
//     }
//   }, [selectedUser, isMobileView]);

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     // Animate theme transition
//     gsap.to("body", {
//       backgroundColor: isDarkMode ? "#f3f4f6" : "#111827",
//       duration: 0.3,
//       ease: "power2.inOut",
//     });
//   };

//   const handleUserSelect = (user) => {
//     // Animate chat transition
//     if (isMobileView) {
//       gsap.to(chatListRef.current, {
//         x: -30,
//         opacity: 0,
//         duration: 0.3,
//         ease: "power2.inOut",
//         onComplete: () => {
//           setSelectedUser(user);
//           setShowChatList(false);
//         },
//       });
//     } else {
//       setSelectedUser(user);
//     }
//   };

//   const handleBackToList = () => {
//     if (isMobileView) {
//       gsap.to(".chat-window", {
//         x: 30,
//         opacity: 0,
//         duration: 0.3,
//         ease: "power2.inOut",
//         onComplete: () => {
//           setShowChatList(true);
//           setSelectedUser(null);
//           gsap.from(chatListRef.current, {
//             x: -30,
//             opacity: 0,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         },
//       });
//     }
//   };

//   const logout = () => {
//     gsap.to(".app-container", {
//       opacity: 0,
//       y: 20,
//       duration: 0.3,
//       ease: "power2.inOut",
//       onComplete: () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user_id");
//         localStorage.removeItem("username");
//         navigate("/login");
//       },
//     });
//   };

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = now - date;
//     const oneDay = 24 * 60 * 60 * 1000;

//     if (diff < oneDay) {
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } else if (diff < 7 * oneDay) {
//       return date.toLocaleDateString([], { weekday: "short" });
//     } else {
//       return date.toLocaleDateString([], { month: "short", day: "numeric" });
//     }
//   };

//   const chatListContent = (
//     <div
//       className={`${isMobileView ? "w-full" : "w-96"} ${
//         isDarkMode ? "bg-gray-800" : "bg-white"
//       } border-r ${
//         isDarkMode ? "border-gray-700" : "border-gray-200"
//       } flex flex-col h-full`}
//     >
//       <div className="bg-[#075E54] text-white p-4 flex justify-between items-center">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//             <span className="text-[#075E54] font-semibold">
//               {currentUsername?.[0]?.toUpperCase() || "?"}
//             </span>
//           </div>
//           <h1 className="text-xl font-semibold">Chats</h1>
//         </div>
//         <div className="flex space-x-3">
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full hover:bg-[#064e47] transition-colors duration-200"
//           >
//             {isDarkMode ? (
//               <Sun className="h-5 w-5" />
//             ) : (
//               <Moon className="h-5 w-5" />
//             )}
//           </button>
//           <Users
//             className="h-6 w-6 cursor-pointer hover:text-gray-300"
//             onClick={() => setShowSearchUser(!showSearchUser)}
//           />
//           <LogOut
//             className="h-6 w-6 cursor-pointer hover:text-gray-300"
//             onClick={logout}
//           />
//         </div>
//       </div>
//       <div
//         ref={searchBarRef}
//         className={`p-3 border-b ${
//           isDarkMode ? "border-gray-700" : "border-gray-200"
//         }`}
//       >
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search chats..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2 rounded-lg ${
//               isDarkMode
//                 ? "bg-gray-700 focus:bg-gray-600 text-white placeholder-gray-400"
//                 : "bg-gray-100 focus:bg-white text-gray-900"
//             } focus:outline-none focus:ring-1 focus:ring-[#075E54]`}
//           />
//           <Search
//             className={`absolute left-3 top-2.5 h-5 w-5 ${
//               isDarkMode ? "text-gray-400" : "text-gray-400"
//             }`}
//           />
//         </div>
//       </div>
//       <div className="p-3">
//         <PendingRequest />
//       </div>
//       {showSearchUser && (
//         <div className="p-3">
//           <SearchUser />
//         </div>
//       )}
//       <div ref={chatListRef} className="flex-1 overflow-y-auto">
//         {filteredChats.length > 0 ? (
//           filteredChats.map((chat) => (
//             <div
//               key={chat.other_user_id}
//               onClick={() =>
//                 handleUserSelect({
//                   id: chat.other_user_id,
//                   username: chat.other_user_username,
//                 })
//               }
//               className={`flex items-center p-3 border-b ${
//                 isDarkMode
//                   ? "border-gray-700 hover:bg-gray-700"
//                   : "border-gray-100 hover:bg-gray-50"
//               } cursor-pointer ${
//                 selectedUser?.id === chat.other_user_id
//                   ? isDarkMode
//                     ? "bg-gray-700"
//                     : "bg-gray-100"
//                   : ""
//               }`}
//             >
//               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
//                 <span className="text-gray-600 font-semibold">
//                   {chat.other_user_username[0].toUpperCase()}
//                 </span>
//               </div>
//               <div className="ml-4 flex-1 min-w-0">
//                 <div className="flex justify-between items-baseline">
//                   <h3
//                     className={`text-sm font-semibold ${
//                       isDarkMode ? "text-white" : "text-gray-900"
//                     } truncate`}
//                   >
//                     {chat.other_user_username}
//                   </h3>
//                   <span
//                     className={`text-xs ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   >
//                     {formatTimestamp(chat.latest_message_time)}
//                   </span>
//                 </div>
//                 <p
//                   className={`text-sm ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   } truncate`}
//                 >
//                   {chat.latest_message_content || "No messages yet"}
//                 </p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div
//             className={`flex flex-col items-center justify-center h-full ${
//               isDarkMode ? "text-gray-400" : "text-gray-500"
//             }`}
//           >
//             <MessageSquare className="h-12 w-12 mb-2" />
//             <p>No chats found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const chatWindowContent = selectedUser ? (
//     <div className="flex-1 relative chat-window">
//       {isMobileView && (
//         <button
//           onClick={handleBackToList}
//           className="absolute top-4 left-1 z-10 text-white"
//         >
//           <ArrowLeft className="h-6 w-7" />
//         </button>
//       )}
//       <ChatWindow
//         otherUserId={selectedUser.id}
//         otherUsername={selectedUser.username}
//         token={token}
//         currentUserId={currentUserId}
//         currentUsername={currentUsername}
//         isDarkMode={isDarkMode}
//       />
//     </div>
//   ) : (
//     <div
//       ref={welcomeMessageRef}
//       className={`hidden md:flex h-full items-center justify-center ${
//         isDarkMode ? "bg-gray-900" : "bg-[#F0F2F5]"
//       }`}
//     >
//       <div
//         className={`text-center ${
//           isDarkMode ? "text-gray-400" : "text-gray-500"
//         }`}
//       >
//         <MessageSquare className="h-16 w-16 mx-auto mb-4" />
//         <h2
//           className={`text-xl font-semibold mb-2 ${
//             isDarkMode ? "text-white" : "text-gray-900"
//           }`}
//         >
//           Welcome to Chat
//         </h2>
//         <p>Select a conversation to start messaging</p>
//       </div>
//     </div>
//   );

//   return (
//     <div
//       className={`flex h-screen app-container ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-100"
//       }`}
//     >
//       {(!isMobileView || showChatList) && chatListContent}
//       {(!isMobileView || !showChatList) && chatWindowContent}
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import ChatWindow from "./ChatWindow";
import PendingRequest from "./PendingRequest";
import SearchUser from "./SearchUser";
import {
  Search,
  MessageSquare,
  Users,
  LogOut,
  Moon,
  Sun,
  ArrowLeft,
  Settings,
} from "lucide-react";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchUser, setShowSearchUser] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showChatList, setShowChatList] = useState(true);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const chatListRef = useRef(null);
  const searchBarRef = useRef(null);
  const welcomeMessageRef = useRef(null);
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("user_id");
  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    // Initial animations timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.6,
    })
      .from(
        searchBarRef.current,
        {
          y: -20,
          opacity: 0,
          duration: 0.5,
        },
        "-=0.3"
      )
      .from(
        chatListRef.current?.children || [],
        {
          x: -30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
        },
        "-=0.2"
      );

    if (welcomeMessageRef.current) {
      tl.from(
        welcomeMessageRef.current,
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
    }
  }, []);

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

        // Animate new chats appearing
        gsap.from(".chat-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
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
    if (chatListRef.current) {
      gsap.from(chatListRef.current.children, {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      });
    }
  }, [filteredChats]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowChatList(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileView && selectedUser) {
      setShowChatList(false);
    }
  }, [selectedUser, isMobileView]);

  const toggleTheme = () => {
    const tl = gsap.timeline();
    tl.to("body", {
      backgroundColor: isDarkMode ? "#f3f4f6" : "#111827",
      duration: 0.3,
      ease: "power2.inOut",
    }).to(
      ".theme-transition",
      {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      },
      0
    );

    setIsDarkMode(!isDarkMode);
  };

  const handleUserSelect = (user) => {
    if (isMobileView) {
      const tl = gsap.timeline();
      tl.to(chatListRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }).to(
        ".selected-user-animation",
        {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        },
        0
      );

      tl.eventCallback("onComplete", () => {
        setSelectedUser(user);
        setShowChatList(false);
      });
    } else {
      gsap.to(".selected-user-animation", {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
      setSelectedUser(user);
    }
  };

  const handleBackToList = () => {
    if (isMobileView) {
      const tl = gsap.timeline();
      tl.to(".chat-window", {
        x: 30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      })
        .set(".chat-list", { display: "block" })
        .from(".chat-list", {
          x: -30,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });

      tl.eventCallback("onComplete", () => {
        setShowChatList(true);
        setSelectedUser(null);
      });
    }
  };

  const logout = () => {
    const tl = gsap.timeline();
    tl.to(".app-container", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.inOut",
    })
      .to(
        ".logout-animation",
        {
          rotate: 360,
          scale: 0.5,
          duration: 0.3,
        },
        0
      )
      .eventCallback("onComplete", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        navigate("/login");
      });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < 7 * oneDay) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const chatListContent = (
    <div
      ref={sidebarRef}
      className={`${isMobileView ? "w-full" : "w-96"} ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } border-r ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } flex flex-col h-full shadow-lg`}
    >
      <div
        ref={headerRef}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner">
              <span className="text-white font-semibold">
                {currentUsername?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <h1 className="text-xl font-semibold tracking-wide">Messages</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleTheme}
              className="theme-transition p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setShowSearchUser(!showSearchUser)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <Users className="h-5 w-5" />
            </button>
            <button
              onClick={logout}
              className="logout-animation p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={searchBarRef} className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
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

      <div
        ref={chatListRef}
        className={`flex-1 overflow-y-auto ${
          isDarkMode ? "scrollbar-dark" : "scrollbar-light"
        }`}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.other_user_id}
              onClick={() =>
                handleUserSelect({
                  id: chat.other_user_id,
                  username: chat.other_user_username,
                })
              }
              className={`chat-item selected-user-animation flex items-center p-4 border-b ${
                isDarkMode
                  ? "border-gray-800 hover:bg-gray-800"
                  : "border-gray-100 hover:bg-gray-50"
              } cursor-pointer transition-colors duration-200 ${
                selectedUser?.id === chat.other_user_id
                  ? isDarkMode
                    ? "bg-gray-800"
                    : "bg-blue-50"
                  : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600">
                <span className="text-white font-semibold">
                  {chat.other_user_username[0].toUpperCase()}
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } truncate`}
                  >
                    {chat.other_user_username}
                  </h3>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatTimestamp(chat.latest_message_time)}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } truncate mt-1`}
                >
                  {chat.latest_message_content || "No messages yet"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full p-8 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No conversations yet</p>
            <p className="text-sm text-center opacity-75">
              Start a new chat by clicking the Users icon above
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const chatWindowContent = selectedUser ? (
    <div className="flex-1 relative chat-window">
      {isMobileView && (
        <button
          onClick={handleBackToList}
          className="absolute top-4 left-4 z-10 text-white bg-blue-600 rounded-full p-2 shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <ChatWindow
        otherUserId={selectedUser.id}
        otherUsername={selectedUser.username}
        token={token}
        currentUserId={currentUserId}
        currentUsername={currentUsername}
        isDarkMode={isDarkMode}
      />
    </div>
  ) : (
    <div
      ref={welcomeMessageRef}
      className={`hidden md:flex h-full items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="text-center max-w-md p-8 rounded-2xl">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageSquare className="h-12 w-12 text-white" />
        </div>
        <h2
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to ChatApp
        </h2>
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Select a conversation from the sidebar to start messaging
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={`flex h-screen app-container ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {(!isMobileView || showChatList) && chatListContent}
      {(!isMobileView || !showChatList) && chatWindowContent}
    </div>
  );
};

export default Home;
