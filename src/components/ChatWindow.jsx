// import { useState, useEffect, useRef, useCallback } from "react";
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import axios from "axios";
// import { Send, Wifi, WifiOff, Pencil } from "lucide-react";
// import gsap from "gsap";

// const groupMessagesByDate = (messages) => {
//   const groups = {};
//   messages.forEach((msg) => {
//     const date = new Date(msg.timestamp).toLocaleDateString();
//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(msg);
//   });
//   return groups;
// };

// const ChatWindow = ({
//   otherUserId,
//   otherUsername: initialOtherUsername,
//   token,
//   currentUserId,
//   currentUsername,
//   isDarkMode,
// }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [connectionStatus, setConnectionStatus] = useState("disconnected");
//   const [otherUsername, setOtherUsername] = useState(initialOtherUsername);

//   const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const ws = useRef(null);
//   const messagesEndRef = useRef(null);
//   const headerRef = useRef(null);
//   const inputAreaRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const fetchOnlineStatus = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `https://web-chat-application-a0f4.onrender.com/api/auth/users/${otherUserId}/status/`,
//         { headers: { Authorization: `Token ${token}` } }
//       );
//       setIsOtherUserOnline(response.data.is_online);
//     } catch (err) {
//       console.error("Error fetching online status:", err);
//     }
//   }, [otherUserId, token]);

//   useEffect(() => {
//     fetchOnlineStatus();
//     const interval = setInterval(() => {
//       fetchOnlineStatus();
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [fetchOnlineStatus]);

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(
//         JSON.stringify({
//           type: "typing",
//           is_typing: true,
//         })
//       );
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = setTimeout(() => {
//         ws.current.send(
//           JSON.stringify({
//             type: "typing",
//             is_typing: false,
//           })
//         );
//       }, 500);
//     }
//   };

//   useEffect(() => {
//     gsap.from(headerRef.current, {
//       y: -50,
//       opacity: 0,
//       duration: 0.5,
//       ease: "power2.out",
//     });

//     gsap.from(messagesContainerRef.current, {
//       opacity: 0,
//       duration: 0.5,
//       delay: 0.2,
//       ease: "power2.out",
//     });

//     gsap.from(inputAreaRef.current, {
//       y: 50,
//       opacity: 0,
//       duration: 0.5,
//       ease: "power2.out",
//     });
//   }, []);

//   useEffect(() => {
//     setMessages([]);
//     setOtherUsername(initialOtherUsername);

//     gsap.fromTo(
//       messagesContainerRef.current,
//       { opacity: 0, x: 20 },
//       { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
//     );
//   }, [initialOtherUsername]);

//   const fetchUsername = useCallback(async () => {
//     if (!otherUserId || otherUsername) return;
//     try {
//       const response = await axios.get(
//         `https://web-chat-application-a0f4.onrender.com/api/auth/users/${otherUserId}/`,
//         { headers: { Authorization: `Token ${token}` } }
//       );
//       setOtherUsername(response.data.username);
//     } catch (err) {
//       console.error("Error fetching username:", err);
//     }
//   }, [otherUserId, token, otherUsername]);

//   const fetchMessageHistory = useCallback(async () => {
//     if (!otherUserId || !currentUserId) return;
//     try {
//       const response = await axios.get(
//         `https://web-chat-application-a0f4.onrender.com/api/auth/messages/${otherUserId}/`,
//         { headers: { Authorization: `Token ${token}` } }
//       );
//       setMessages(
//         response.data.map((msg) => ({
//           message: msg.message,
//           sender_id: msg.sender.toString(),
//           sender_username: msg.sender_username,
//           timestamp: msg.timestamp,
//         }))
//       );
//     } catch (err) {
//       console.error("Error fetching message history:", err);
//     }
//   }, [otherUserId, token, currentUserId]);

//   const handleWebSocketMessage = useCallback(
//     (e) => {
//       try {
//         const data = JSON.parse(e.data);

//         switch (data.type) {
//           case "chat_message":
//             setMessages((prev) => {
//               const newMessages = [
//                 ...prev,
//                 {
//                   message: data.message,
//                   sender_id: data.sender_id,
//                   sender_username: data.sender_username,
//                   timestamp: data.timestamp,
//                 },
//               ];

//               setTimeout(() => {
//                 const lastMessage = document.querySelector(
//                   ".message-bubble:last-child"
//                 );
//                 if (lastMessage) {
//                   gsap.from(lastMessage, {
//                     scale: 0.8,
//                     opacity: 0,
//                     duration: 0.3,
//                     ease: "back.out(1.7)",
//                   });
//                 }
//               }, 0);

//               return newMessages;
//             });
//             break;

//           case "typing":
//             if (data.user_id !== currentUserId.toString()) {
//               setIsTyping(data.is_typing);
//               if (typingTimeoutRef.current)
//                 clearTimeout(typingTimeoutRef.current);
//               if (data.is_typing) {
//                 typingTimeoutRef.current = setTimeout(
//                   () => setIsTyping(false),
//                   500
//                 );
//               }
//             }
//             break;

//           default:
//             console.error("Unknown message type:", data.type);
//         }
//       } catch (error) {
//         console.error("Error processing message:", error);
//       }
//     },
//     [currentUserId]
//   );

//   useEffect(() => {
//     fetchUsername();
//     if (ws.current) return;

//     if (!token || token === "null") return;

//     const wsUrl = `wss://web-chat-application-a0f4.onrender.com/ws/chat/${otherUserId}/?token=${token}`;
//     ws.current = new W3CWebSocket(wsUrl);

//     ws.current.onopen = () => {
//       setConnectionStatus("connected");
//       fetchMessageHistory();
//     };

//     ws.current.onmessage = handleWebSocketMessage;
//     ws.current.onerror = () => setConnectionStatus("error");
//     ws.current.onclose = () => {
//       setConnectionStatus("disconnected");
//       ws.current = null;
//     };

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//         ws.current = null;
//       }
//     };
//   }, [
//     fetchUsername,
//     otherUserId,
//     token,
//     fetchMessageHistory,
//     handleWebSocketMessage,
//   ]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       gsap.to(messagesContainerRef.current, {
//         scrollTop: messagesEndRef.current.offsetTop,
//         duration: 2,
//         ease: "power2.out",
//       });
//     }
//   }, [messages]);

//   const sendMessage = () => {
//     if (newMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(
//         JSON.stringify({
//           message: newMessage,
//           sender_id: currentUserId,
//         })
//       );
//       setNewMessage("");

//       gsap.from(".send-button", {
//         rotate: 360,
//         duration: 0.5,
//         ease: "power2.out",
//       });
//     }
//   };

//   return (
//     <div
//       className={`flex flex-col h-screen ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-100"
//       }`}
//     >
//       <div
//         ref={headerRef}
//         className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md"
//       >
//         <div className="flex items-center space-x-3 ml-4">
//           <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//             <span className="text-[#075E54] font-semibold">
//               {otherUsername?.[0]?.toUpperCase() || "?"}
//             </span>
//           </div>
//           <div>
//             <div className="font-semibold">
//               {otherUsername || `User ${otherUserId}`}
//             </div>
//             <div className="text-xs flex items-center connection-status">
//               {isOtherUserOnline ? (
//                 <>
//                   <Wifi className="w-3 h-3 mr-1" /> Online
//                 </>
//               ) : (
//                 <>
//                   <WifiOff className="w-3 h-3 mr-1" /> Offline
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         ref={messagesContainerRef}
//         className={`flex-1 overflow-y-auto p-4 ${
//           isDarkMode ? "bg-gray-800" : "bg-[#E5DDD5]"
//         }`}
//       >
//         {Object.entries(groupMessagesByDate(messages)).map(
//           ([date, dateMessages]) => (
//             <div key={date} className="space-y-4">
//               <div className="flex justify-center">
//                 <span
//                   className={`${
//                     isDarkMode
//                       ? "bg-gray-700 text-gray-300"
//                       : "bg-white text-gray-500"
//                   } rounded-lg px-3 py-1 text-xs shadow`}
//                 >
//                   {date}
//                 </span>
//               </div>
//               {dateMessages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex message-bubble ${
//                     msg.sender_id === currentUserId
//                       ? "justify-end"
//                       : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[70%] rounded-lg px-4 py-2 shadow ${
//                       msg.sender_id === currentUserId
//                         ? isDarkMode
//                           ? "bg-[#056162] text-white"
//                           : "bg-[#DCF8C6]"
//                         : isDarkMode
//                         ? "bg-gray-700 text-white"
//                         : "bg-white"
//                     }`}
//                   >
//                     {msg.sender_id !== currentUserId && (
//                       <div className="text-sm font-semibold text-[#075E54]">
//                         {msg.sender_username}
//                       </div>
//                     )}
//                     <div
//                       className={isDarkMode ? "text-gray-100" : "text-gray-800"}
//                     >
//                       {msg.message}
//                     </div>
//                     <div
//                       className={`text-right text-xs ${
//                         isDarkMode ? "text-gray-400" : "text-gray-500"
//                       } mt-1`}
//                     >
//                       {new Date(msg.timestamp).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div
//         ref={inputAreaRef}
//         className={`px-4 py-3 ${
//           isDarkMode ? "bg-gray-800" : "bg-gray-50"
//         } relative`}
//       >
//         {isTyping && (
//           <div className="absolute top-0 left-4 transform -translate-y-full text-sm text-gray-600 flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded-t-md">
//             <Pencil className="w-4 h-4 mr-1 animate-pulse" />
//             {otherUsername} is typing...
//           </div>
//         )}

//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={handleInputChange}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type a message"
//             className={`flex-1 rounded-full px-4 py-2 border ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#075E54]"
//                 : "bg-white border-gray-300 focus:border-[#075E54]"
//             } focus:outline-none focus:ring-1 focus:ring-[#075E54]`}
//           />
//           <button
//             onClick={sendMessage}
//             disabled={!newMessage.trim()}
//             className="send-button bg-[#075E54] text-white rounded-full p-2 hover:bg-[#054c44] disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

import { useState, useEffect, useRef, useCallback } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import { Send, Pencil, Phone, Video, MoreVertical } from "lucide-react";
import gsap from "gsap";

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
  });
  return groups;
};

const ChatWindow = ({
  otherUserId,
  otherUsername: initialOtherUsername,
  token,
  currentUserId,
  currentUsername,
  isDarkMode,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [otherUsername, setOtherUsername] = useState(initialOtherUsername);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const headerRef = useRef(null);
  const inputAreaRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const sendButtonRef = useRef(null);

  const fetchOnlineStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://web-chat-application-a0f4.onrender.com/api/auth/users/${otherUserId}/status/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setIsOtherUserOnline(response.data.is_online);
    } catch (err) {
      console.error("Error fetching online status:", err);
    }
  }, [otherUserId, token]);

  useEffect(() => {
    fetchOnlineStatus();
    const interval = setInterval(() => {
      fetchOnlineStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchOnlineStatus]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "typing",
          is_typing: true,
        })
      );
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        ws.current.send(
          JSON.stringify({
            type: "typing",
            is_typing: false,
          })
        );
      }, 500);
    }
  };

  useEffect(() => {
    // Initial animations timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.5,
    })
      .from(
        messagesContainerRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
        },
        "-=0.3"
      )
      .from(
        inputAreaRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.4,
        },
        "-=0.2"
      );
  }, []);

  useEffect(() => {
    setMessages([]);
    setOtherUsername(initialOtherUsername);

    const tl = gsap.timeline();
    tl.fromTo(
      messagesContainerRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    ).from(".message-bubble", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, [initialOtherUsername]);

  const fetchUsername = useCallback(async () => {
    if (!otherUserId || otherUsername) return;
    try {
      const response = await axios.get(
        `https://web-chat-application-a0f4.onrender.com/api/auth/users/${otherUserId}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setOtherUsername(response.data.username);
    } catch (err) {
      console.error("Error fetching username:", err);
    }
  }, [otherUserId, token, otherUsername]);

  const fetchMessageHistory = useCallback(async () => {
    if (!otherUserId || !currentUserId) return;
    try {
      const response = await axios.get(
        `https://web-chat-application-a0f4.onrender.com/api/auth/messages/${otherUserId}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessages(
        response.data.map((msg) => ({
          message: msg.message,
          sender_id: msg.sender.toString(),
          sender_username: msg.sender_username,
          timestamp: msg.timestamp,
        }))
      );

      // Animate messages appearing
      gsap.from(".message-bubble", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    } catch (err) {
      console.error("Error fetching message history:", err);
    }
  }, [otherUserId, token, currentUserId]);

  const handleWebSocketMessage = useCallback(
    (e) => {
      try {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case "chat_message":
            setMessages((prev) => {
              const newMessages = [
                ...prev,
                {
                  message: data.message,
                  sender_id: data.sender_id,
                  sender_username: data.sender_username,
                  timestamp: data.timestamp,
                },
              ];

              // Animate new message appearing
              setTimeout(() => {
                const lastMessage = document.querySelector(
                  ".message-bubble:last-child"
                );
                if (lastMessage) {
                  gsap.from(lastMessage, {
                    scale: 0.8,
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                  });
                }
              }, 0);

              return newMessages;
            });
            break;

          case "typing":
            if (data.user_id !== currentUserId.toString()) {
              setIsTyping(data.is_typing);
              if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
              if (data.is_typing) {
                // Animate typing indicator
                gsap.from(".typing-indicator", {
                  y: 10,
                  opacity: 0,
                  duration: 0.3,
                  ease: "power2.out",
                });
                typingTimeoutRef.current = setTimeout(
                  () => setIsTyping(false),
                  500
                );
              }
            }
            break;

          default:
            console.error("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    fetchUsername();
    if (ws.current) return;

    if (!token || token === "null") return;

    const wsUrl = `wss://web-chat-application-a0f4.onrender.com/ws/chat/${otherUserId}/?token=${token}`;
    ws.current = new W3CWebSocket(wsUrl);

    ws.current.onopen = () => {
      setConnectionStatus("connected");
      fetchMessageHistory();
    };

    ws.current.onmessage = handleWebSocketMessage;
    ws.current.onerror = () => setConnectionStatus("error");
    ws.current.onclose = () => {
      setConnectionStatus("disconnected");
      ws.current = null;
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [
    fetchUsername,
    otherUserId,
    token,
    fetchMessageHistory,
    handleWebSocketMessage,
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      gsap.to(messagesContainerRef.current, {
        scrollTop: messagesEndRef.current.offsetTop,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          message: newMessage,
          sender_id: currentUserId,
        })
      );
      setNewMessage("");

      // Animate send button
      const tl = gsap.timeline();
      tl.to(sendButtonRef.current, {
        rotate: 360,
        scale: 0.8,
        duration: 0.3,
        ease: "back.out(1.7)",
      }).to(sendButtonRef.current, {
        scale: 1,
        duration: 0.2,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div
        ref={headerRef}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between shadow-md"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {otherUsername?.[0]?.toUpperCase()}
              </span>
            </div>
            {isOtherUserOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{otherUsername}</h2>
            <p className="text-xs text-white/70">
              {isOtherUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        } ${isDarkMode ? "scrollbar-dark" : "scrollbar-light"}`}
      >
        {Object.entries(groupMessagesByDate(messages)).map(
          ([date, dateMessages]) => (
            <div key={date} className="space-y-4 mb-6">
              <div className="flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {date}
                </span>
              </div>
              {dateMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex message-bubble ${
                    msg.sender_id === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                      msg.sender_id === currentUserId
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {msg.sender_id !== currentUserId && (
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {msg.sender_username}
                      </div>
                    )}
                    <div className="text-sm">{msg.message}</div>
                    <div
                      className={`text-right text-xs mt-1 ${
                        msg.sender_id === currentUserId
                          ? "text-blue-100"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        ref={inputAreaRef}
        className={`px-4 py-3 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } relative`}
      >
        {isTyping && (
          <div
            className={`typing-indicator absolute top-0 left-4 transform -translate-y-full text-sm ${
              isDarkMode
                ? "text-gray-300 bg-gray-700"
                : "text-gray-600 bg-white"
            } flex items-center px-3 py-1.5 rounded-t-lg shadow-sm border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <Pencil className="w-4 h-4 mr-2 text-blue-500 animate-pulse" />
            {otherUsername} is typing...
          </div>
        )}

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message"
            className={`flex-1 rounded-full px-4 py-2.5 ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-gray-100 text-gray-900 border-transparent placeholder-gray-500"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
          />
          <button
            ref={sendButtonRef}
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="send-button bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
