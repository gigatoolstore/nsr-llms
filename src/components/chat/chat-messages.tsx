"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, LoaderCircle } from "lucide-react";
import { MarkdownView } from "@/components/markdown-view";
import React from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-4",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <Avatar className="h-9 w-9 border">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot />
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "max-w-xl rounded-xl p-3 shadow-sm",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-card"
            )}
          >
            {message.isStreaming ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <MarkdownView content={message.content} className={cn(message.role === 'user' ? 'prose-invert' : 'prose')} />
            )}
          </div>

          {message.role === "user" && (
            <Avatar className="h-9 w-9 border">
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}
