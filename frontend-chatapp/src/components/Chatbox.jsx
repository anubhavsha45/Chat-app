import { useEffect, useState } from "react";
import { API } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket/socket";
import MessageInput from "./MessageInput";

export default function ChatBox({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  // 🔥 Fetch messages
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const res = await API.get(`/messages/${selectedChat._id}`);
      setMessages(res.data.data.messages);
    };

    fetchMessages();
  }, [selectedChat]);

  // 🔥 SOCKET LISTENER
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      // only add if it belongs to current chat
      if (data.message.conversation === selectedChat?._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#020617]">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-xs ${
                msg.sender._id === user._id ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <MessageInput selectedChat={selectedChat} setMessages={setMessages} />
    </div>
  );
}
