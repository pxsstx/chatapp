"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function ChatForm({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here...."
        value={message}
        autoFocus // This will ensure the input gets refocused after submission
      />
      <Button type="submit" className="px-4 py-2">
        Send
      </Button>
    </form>
  );
}

export default ChatForm;
