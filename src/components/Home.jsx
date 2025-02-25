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

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("user_id");
  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    // Initial animations
    gsap.from(searchBarRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.from(chatListRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
    });

    if (welcomeMessageRef.current) {
      gsap.from(welcomeMessageRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "back.out",
      });
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
    // Animate chat list items when filtered
    if (chatListRef.current) {
      gsap.from(chatListRef.current.children, {
        x: -20,
        opacity: 0,
        duration: 0.3,
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
    setIsDarkMode(!isDarkMode);
    // Animate theme transition
    gsap.to("body", {
      backgroundColor: isDarkMode ? "#f3f4f6" : "#111827",
      duration: 0.3,
      ease: "power2.inOut",
    });
  };

  const handleUserSelect = (user) => {
    // Animate chat transition
    if (isMobileView) {
      gsap.to(chatListRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setSelectedUser(user);
          setShowChatList(false);
        },
      });
    } else {
      setSelectedUser(user);
    }
  };

  const handleBackToList = () => {
    if (isMobileView) {
      gsap.to(".chat-window", {
        x: 30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setShowChatList(true);
          setSelectedUser(null);
          gsap.from(chatListRef.current, {
            x: -30,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    }
  };

  const logout = () => {
    gsap.to(".app-container", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        navigate("/login");
      },
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
      className={`${isMobileView ? "w-full" : "w-96"} ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } border-r ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } flex flex-col h-full`}
    >
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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[#064e47] transition-colors duration-200"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
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
      <div
        ref={searchBarRef}
        className={`p-3 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 focus:bg-gray-600 text-white placeholder-gray-400"
                : "bg-gray-100 focus:bg-white text-gray-900"
            } focus:outline-none focus:ring-1 focus:ring-[#075E54]`}
          />
          <Search
            className={`absolute left-3 top-2.5 h-5 w-5 ${
              isDarkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
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
      <div ref={chatListRef} className="flex-1 overflow-y-auto">
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
              className={`flex items-center p-3 border-b ${
                isDarkMode
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-100 hover:bg-gray-50"
              } cursor-pointer ${
                selectedUser?.id === chat.other_user_id
                  ? isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : ""
              }`}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-semibold">
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
                  } truncate`}
                >
                  {chat.latest_message_content || "No messages yet"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <MessageSquare className="h-12 w-12 mb-2" />
            <p>No chats found</p>
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
          className="absolute top-4 left-1 z-10 text-white"
        >
          <ArrowLeft className="h-6 w-7" />
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
        isDarkMode ? "bg-gray-900" : "bg-[#F0F2F5]"
      }`}
    >
      <div
        className={`text-center ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <MessageSquare className="h-16 w-16 mx-auto mb-4" />
        <h2
          className={`text-xl font-semibold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to Chat
        </h2>
        <p>Select a conversation to start messaging</p>
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
