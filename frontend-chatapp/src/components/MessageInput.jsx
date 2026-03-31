import { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");

  const sendMessage = () => {
    console.log(text);
    setText("");
  };

  return (
    <div className="p-4 border-t border-gray-800 flex gap-2">
      <input
        className="flex-1 p-3 rounded bg-gray-800"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-blue-600 px-4 rounded">
        Send
      </button>
    </div>
  );
}
