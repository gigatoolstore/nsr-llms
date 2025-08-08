"use client";

import type { OllamaModel } from "@/lib/types";
import { Bot, DownloadCloud, Globe, PlayCircle, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ModelSidebarProps {
  models: OllamaModel[];
  selectedModel: OllamaModel | null;
  onSelectModel: (model: OllamaModel) => void;
  onModelAction: (modelId: string, action: 'start' | 'stop') => void;
}

export function ModelSidebar({ models, selectedModel, onSelectModel, onModelAction }: ModelSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="text-primary" />
          NSR LLMs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Your local model manager</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Local Models</h2>
        <ul className="space-y-2">
          {models.map((model) => (
            <li key={model.id}>
              <button
                onClick={() => onSelectModel(model)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3",
                  selectedModel?.id === model.id
                    ? "bg-primary/10 text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <div className={cn("mt-1", selectedModel?.id === model.id ? "text-primary" : "text-muted-foreground")}>
                  <Bot size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{model.name}</span>
                    <Badge variant={model.status === 'running' ? 'default' : 'secondary'} className={cn(
                      model.status === 'running' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-transparent' : '',
                      'capitalize'
                    )}>
                      {model.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full mb-2">
          <DownloadCloud className="mr-2 h-4 w-4" /> Import Model
        </Button>
        <Button variant="outline" className="w-full">
          <Globe className="mr-2 h-4 w-4" /> Browse Repositories
        </Button>
      </div>
    </div>
  );
}
