"use client";

import type { OllamaModel, ChatMessage } from "@/lib/types";
import { Menu, Bot, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ModelConfigPanel } from "./model-config-panel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ChatPanelProps {
  model: OllamaModel | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  onMenuClick: () => void;
}

export function ChatPanel({ model, messages, onSendMessage, isLoading, onMenuClick }: ChatPanelProps) {
  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-card">
        <div className="md:hidden absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu />
          </Button>
        </div>
        <Bot size={64} className="text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-semibold">Welcome to Ollama-NSR</h2>
        <p className="mt-2 text-muted-foreground">Select a model from the sidebar to begin chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-card">
      <header className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{model.name}</h2>
          <p className="text-sm text-muted-foreground">{model.description}</p>
        </div>
      </header>
      <ChatMessages messages={messages} />
      <div className="border-t">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="config">
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-2 text-sm">
                <Settings2 className="h-4 w-4" />
                Configuration
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ModelConfigPanel />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
