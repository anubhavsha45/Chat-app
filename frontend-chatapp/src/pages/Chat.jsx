import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit("addUser", user._id);
    }
  }, [user]);

  return (
    <div className="h-screen flex bg-[#0f172a] text-white">
      <div className="w-[320px] border-r border-gray-700">
        <Sidebar setSelectedChat={setSelectedChat} />
      </div>

      <div className="flex-1 flex flex-col">
        <ChatBox selectedChat={selectedChat} />
      </div>
    </div>
  );
}
