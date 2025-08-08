"use client";

import { cn } from "@/lib/utils";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

// NOTE: This is a simple renderer for demonstration purposes.
// For production, a robust library like 'react-markdown' with 'rehype-sanitize' is recommended.
export function MarkdownView({ content, className }: MarkdownViewProps) {
  return (
    <div
      className={cn("prose", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
