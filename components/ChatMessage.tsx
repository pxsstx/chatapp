import { cn } from "@/lib/utils"; // Assuming you have a utility for combining classes

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage: boolean;
}

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {
  const isSystemMessage = sender === "system";

  return (
    <div
      className={cn(
        "flex items-center",
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-xs px-4 py-2 rounded-lg shadow-md",
          isSystemMessage
            ? "bg-muted text-muted-foreground text-center text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-muted text-muted-foreground"
        )}
      >
        {/* Sender name for non-system messages */}
        {!isSystemMessage && (
          <p className="text-sm font-semibold">{sender}</p>
        )}
        {/* Message content */}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
