//responsive

import React, { useState, useEffect, useRef, useCallback } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import { Send, Wifi, WifiOff } from "lucide-react";

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
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    setOtherUsername(initialOtherUsername);
  }, [otherUserId, initialOtherUsername]);

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
    } catch (err) {
      console.error("Error fetching message history:", err);
    }
  }, [otherUserId, token, currentUserId]);

  const handleWebSocketMessage = useCallback((e) => {
    try {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        {
          message: data.message,
          sender_id: data.sender_id,
          sender_username: data.sender_username,
          timestamp: data.timestamp,
        },
      ]);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }, []);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3 ml-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-[#075E54] font-semibold">
              {otherUsername?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <div className="font-semibold">
              {otherUsername || `User ${otherUserId}`}
            </div>
            <div className="text-xs flex items-center">
              {connectionStatus === "connected" ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" /> Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" /> Offline
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-[#E5DDD5]"
        }`}
      >
        {Object.entries(groupMessagesByDate(messages)).map(
          ([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <span
                  className={`${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-white text-gray-500"
                  } rounded-lg px-3 py-1 text-xs shadow`}
                >
                  {date}
                </span>
              </div>
              {dateMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender_id === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 shadow ${
                      msg.sender_id === currentUserId
                        ? isDarkMode
                          ? "bg-[#056162] text-white"
                          : "bg-[#DCF8C6]"
                        : isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white"
                    }`}
                  >
                    {msg.sender_id !== currentUserId && (
                      <div className="text-sm font-semibold text-[#075E54]">
                        {msg.sender_username}
                      </div>
                    )}
                    <div
                      className={isDarkMode ? "text-gray-100" : "text-gray-800"}
                    >
                      {msg.message}
                    </div>
                    <div
                      className={`text-right text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } mt-1`}
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
      <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message"
            className={`flex-1 rounded-full px-4 py-2 border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#075E54]"
                : "bg-white border-gray-300 focus:border-[#075E54]"
            } focus:outline-none focus:ring-1 focus:ring-[#075E54]`}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-[#075E54] text-white rounded-full p-2 hover:bg-[#054c44] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
