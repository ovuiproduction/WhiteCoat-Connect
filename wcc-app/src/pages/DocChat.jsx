import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../css/DocChat.css";

const socket = io("http://localhost:5000");

import docchatlogo from "../images/Logo-DocChat.png";

export default function DocChat() {
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [msg, setMsg] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef(null);

  const userId = sessionStorage.getItem("userId");
  const userType = sessionStorage.getItem("userType");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit("register", { userId, userType });

    socket.on("receiveMessage", (message) => {
      if (message.conversationId === currentConv?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messageSent", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
    };
  }, [currentConv, userId]);

  const fetchConversations = async () => {
    const res = await fetch(
      `http://localhost:5000/chat/${userId}/${userType}/conversations`
    );
    const data = await res.json();
    if (res.ok && data.status === "ok") setConversations(data.data);
  };

  const fetchAllUsers = async () => {
    const res = await fetch("http://localhost:5000/chat/get-all-contact");
    const data = await res.json();
    if (res.ok && data.status === "ok") setAllUsers(data.data);
  };

  const fetchMessages = async (conversationId) => {
    const res = await fetch(
      `http://localhost:5000/chat/${conversationId}/messages`
    );
    const data = await res.json();
    if (res.ok && data.status === "ok") setMessages(data.data);
  };

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
  }, []);

  const startConversation = async (otherId, otherType) => {
    const res = await fetch("http://localhost:5000/chat/startConversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participants: [
          { id: userId, type: userType },
          { id: otherId, type: otherType },
        ],
      }),
    });
    const data = await res.json();
    if (res.ok && data.status === "ok") {
      setCurrentConv(data.data);
      fetchMessages(data.data._id);
      fetchConversations();
      setShowNewChat(false);
    }
  };

  const sendMessage = () => {
    if (!msg.trim() || !currentConv) return;
    socket.emit("sendMessage", {
      conversationId: currentConv._id,
      senderId: userId,
      senderType: userType,
      text: msg,
    });
    setMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="doc-chat-container">
      {/* Sidebar */}
      <div className="doc-chat-sidebar">
        <div className="doc-chat-sidebar-header">
          <div className="doc-chat-profile-section">
            <img className="doc-chat-logo" src={docchatlogo} alt="" />
            <h2>DocChat</h2>
          </div>
          <button
            className="doc-chat-new-chat-btn"
            onClick={() => setShowNewChat(!showNewChat)}
            title="New Chat"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
              />
            </svg>
          </button>
        </div>

        <div className="doc-chat-conversations-list">
          {showNewChat ? (
            <div className="doc-chat-new-chat-section">
              <div className="doc-chat-new-chat-header">
                <button
                  onClick={() => setShowNewChat(false)}
                  className="doc-chat-back-btn"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                      fill="currentColor"
                      d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"
                    />
                  </svg>
                </button>
                <h3>New Chat</h3>
              </div>
              <ul className="doc-chat-users-list">
                {allUsers
                  .filter((u) => u._id !== userId)
                  .map((user) => (
                    <li
                      key={user._id}
                      onClick={() => startConversation(user._id, user.type)}
                    >
                      <div className="doc-chat-avatar">
                        {getInitials(user.name)}
                      </div>
                      <div className="doc-chat-user-info">
                        <div className="doc-chat-user-name">{user.name}</div>
                        <div className="doc-chat-user-email">{user.email}</div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <ul className="doc-chat-conversations">
              {conversations.map((conv) => {
                const other = conv.participants.find(
                  (p) => p.id._id !== userId
                );
                console.log(conv.lastMessage.text);
                return (
                  <li
                    key={conv._id}
                    className={`${
                      currentConv?._id === conv._id ? "doc-chat-active" : ""
                    }`}
                    onClick={() => {
                      setCurrentConv(conv);
                      fetchMessages(conv._id);
                    }}
                  >
                    <div className="avatar">{getInitials(other?.id?.name)}</div>
                    <div className="doc-chat-conv-info">
                      <div className="doc-chat-conv-header">
                        <div className="doc-chat-conv-name">
                          {other?.id?.name || "Unknown"}
                        </div>
                        {conv.lastMessage && (
                          <div className="doc-chat-conv-time">
                            {formatTime(conv.lastMessage?.createdAt)}
                          </div>
                        )}
                      </div>
                      <div className="doc-chat-conv-preview">
                        {conv.lastMessage?.text || "No messages yet"}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="doc-chat-window">
        {currentConv ? (
          <>
            <div className="doc-chat-header">
              <div className="doc-chat-header-info">
                <div className="doc-chat-avatar">
                  {getInitials(
                    currentConv.participants.find((p) => p.id._id !== userId)
                      ?.id?.name
                  )}
                </div>
                <div className="doc-chat-header-text">
                  <div className="doc-chat-chat-name">
                    {currentConv.participants.find((p) => p.id._id !== userId)
                      ?.id?.name || "Unknown"}
                  </div>
                  <div className="doc-chat-chat-status">
                    {currentConv.participants.find((p) => p.id._id !== userId)
                      ?.type || ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="doc-chat-messages">
              {messages.map((m, index) => (
                <div
                  key={m._id || index}
                  className={`doc-chat-message-wrapper ${
                    m.sender.id === userId
                      ? "doc-chat-sent"
                      : "doc-chat-received"
                  }`}
                >
                  <div className="doc-chat-chat-message">
                    <div className="doc-chat-message-text">{m.text}</div>
                    <div className="doc-chat-message-time">
                      {formatTime(m.createdAt)}
                      {m.sender.id === userId && (
                        <span className="doc-chat-message-status">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="doc-chat-input">
              <button className="doc-chat-emoji-btn" title="Emoji">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                  />
                </svg>
              </button>
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
              />
              <button className="doc-chat-send-btn" onClick={sendMessage}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="doc-chat-welcome-screen">
            <div className="doc-chat-welcome-content">
              <div className="doc-chat-welcome-icon">
                <img className="doc-chat-logo-screen" src={docchatlogo} alt="" />
              </div>
              <h2>DocChat</h2>
              <p>Send and receive messages securely</p>
              <p className="doc-chat-welcome-hint">
                Select a conversation or start a new chat to begin messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
