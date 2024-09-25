import React from "react";
import { PromptCard } from "./PromptCard";

interface Prompt {
  id: string;
  title: string;
  content: string;
}

interface PromptListProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export function PromptList({ prompts, onEdit, onDelete }: PromptListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
