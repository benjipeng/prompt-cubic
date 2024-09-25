import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface Prompt {
  id: string;
  title: string;
  content: string;
}

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{prompt.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{prompt.content}</ReactMarkdown>
        </div>
        <div className="mt-4">
          <Button onClick={() => onEdit(prompt)} className="mr-2">
            Edit
          </Button>
          <Button onClick={() => onDelete(prompt.id)} variant="destructive">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
