import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../css/DocChat.css";

const socket = io("http://localhost:5000");

export default function DocChat() {
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [msg, setMsg] = useState("");

  const userId = localStorage.getItem("doctorId"); // or hospitalId
  const userType = "Doctor"; // or "Hospital"

  // Register socket
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

  // Fetch existing conversations
  const fetchConversations = async () => {
    const res = await fetch(
      `http://localhost:5000/chat/${userId}/${userType}/conversations`
    );
    const data = await res.json();
    if (res.ok && data.status === "ok") setConversations(data.data);
  };

  // Fetch all users (for "new chat" list)
  const fetchAllUsers = async () => {
    const res = await fetch("http://localhost:5000/chat/get-all-contact");
    const data = await res.json();
    if (res.ok && data.status === "ok") setAllUsers(data.data);
  };

  // Fetch messages for selected conversation
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

  // Start new conversation
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
      fetchConversations(); // refresh sidebar
    }
  };

  // Send message
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

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h3>Conversations</h3>
        <ul>
          {conversations.map((conv) => {
            const other = conv.participants.find((p) => p.id._id !== userId);
            return (
              <li
                key={conv._id}
                onClick={() => {
                  setCurrentConv(conv);
                  fetchMessages(conv._id);
                }}
              >
                {other?.id?.name || "Unknown"} ({other?.type})
              </li>
            );
          })}
        </ul>

        <h3>Start New Chat</h3>
        <ul>
          {allUsers
            .filter((u) => u._id !== userId)
            .map((user) => (
              <li key={user._id}>
                {user.name} ({user.email})
                <button onClick={() => startConversation(user._id, user.type)}>
                  Start Chat
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="chat-header">
          {currentConv
            ? `Chat with ${
                currentConv.participants.find((p) => p.id._id !== userId)?.id
                  ?.name || "Unknown"
              }`
            : "Select or start a chat"}
        </div>

        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`chat-message ${
                m.sender.id === userId ? "sent" : "received"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {currentConv && (
          <div className="chat-input">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
