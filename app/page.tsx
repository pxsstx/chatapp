"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socketClient";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [userName, setUserName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to the end

  // Scroll to the bottom whenever the messages state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This will trigger whenever messages change

  useEffect(() => {
    // Function to handle incoming messages
    const handleMessage = (data: { sender: string; message: string }) => {
      setMessages((prev) => [...prev, data]);
    };

    // Function to handle user join message
    const handleUserJoin = (message: string) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    };

    // Set up listeners
    socket.on("message", handleMessage);
    socket.on("user_joined", handleUserJoin);

    // Clean up listeners on component unmount
    return () => {
      socket.off("user_joined", handleUserJoin);
      socket.off("message", handleMessage);
    };
  }, []);

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
    console.log(message);
  };

  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex w-full max-w-3xl mx-auto flex-col items-center gap-y-4">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          <Input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-64 px-4 py-2"
          />
          <Input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2"
          />
          <Button onClick={handleJoinRoom} className="px-4 py-2">
            Join Room
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room : {room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 rounded-lg border-2 flex flex-col gap-y-2 scroll-0">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
            {/* Invisible div to force scroll */}
            <div ref={messagesEndRef} />
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
