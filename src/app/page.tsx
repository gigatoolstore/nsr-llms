"use client";

import { useState } from "react";
import type { OllamaModel, ChatMessage } from "@/lib/types";
import { ModelSidebar } from "@/components/model-sidebar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatResponseAsMarkdown } from "@/ai/flows/format-response-as-markdown";

const MOCK_MODELS: OllamaModel[] = [
  { id: 'llama3', name: 'Llama 3', shortName: 'llama3', description: 'The latest model from Meta', status: 'running' },
  { id: 'mistral', name: 'Mistral', shortName: 'mistral', description: 'A powerful and efficient model', status: 'stopped' },
  { id: 'codegemma', name: 'CodeGemma', shortName: 'codegemma', description: 'Optimized for code generation', status: 'stopped' },
];

const GREETING_MESSAGE: ChatMessage = {
  id: 'greeting-1',
  role: 'assistant',
  content: "Hello! I'm ready to chat. What can I help you with today?",
};

export default function Home() {
  const [models, setModels] = useState<OllamaModel[]>(MOCK_MODELS);
  const [selectedModel, setSelectedModel] = useState<OllamaModel | null>(MOCK_MODELS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSelectModel = (model: OllamaModel) => {
    if(model.status !== 'running') {
      // For demonstration, we'll start the model automatically on select.
      handleModelAction(model.id, 'start');
    }
    setSelectedModel(model);
    setMessages([GREETING_MESSAGE]); // Reset chat history
    setMobileSidebarOpen(false);
  };
  
  const handleModelAction = (modelId: string, action: 'start' | 'stop') => {
    setModels(currentModels =>
      currentModels.map(m => (m.id === modelId ? { ...m, status: action === 'start' ? 'running' : 'stopped' } : m))
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedModel) return;

    const userMessage: ChatMessage = { id: `msg-${Date.now()}`, role: 'user', content };
    const assistantMessageId = `msg-${Date.now() + 1}`;
    const assistantMessage: ChatMessage = { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    // --- Mock AI Response ---
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency & generation time
    const mockResponse = `This is a mock response from the **${selectedModel.name}** model. You asked: *"${content}"*. Local models like this are great for privacy and offline use. Here are some points:
- They run on your machine.
- No data leaves your device.
- They are fast and efficient.
\`\`\`javascript
console.log("Hello from ${selectedModel.name}!");
\`\`\``;
    
    const formattedResponse = await formatResponseAsMarkdown({ text: mockResponse });

    setMessages(prev =>
      prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: formattedResponse.markdown, isStreaming: false }
          : msg
      )
    );
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-body">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 lg:w-96 shrink-0">
        <ModelSidebar
          models={models}
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          onModelAction={handleModelAction}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <ModelSidebar
            models={models}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            onModelAction={handleModelAction}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col min-w-0">
        <ChatPanel
          key={selectedModel?.id} // Rerender panel when model changes
          model={selectedModel}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
      </main>
    </div>
  );
}
