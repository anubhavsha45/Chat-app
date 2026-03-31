import { useEffect, useState } from "react";
import { API } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ setSelectedChat }) {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get("/conversations");
        setConversations(res.data.data.conversations);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#111827]">
      <div className="p-4 text-lg font-semibold border-b border-gray-700">
        Chats
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {conversations.map((convo) => {
          const otherUser = convo.chatWith;

          return (
            <div
              key={convo._id}
              onClick={() => setSelectedChat(convo)}
              className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition"
            >
              <p className="font-medium">{otherUser?.name}</p>
              <p className="text-sm text-gray-400">
                {convo.lastMessage?.content || "No messages yet"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
