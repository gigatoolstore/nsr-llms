export interface OllamaModel {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: 'running' | 'stopped' | 'loading';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}
