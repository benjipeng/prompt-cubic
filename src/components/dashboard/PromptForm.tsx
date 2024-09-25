import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

interface PromptFormProps {
  onSubmit: (title: string, content: string) => void;
  initialTitle: string;
  initialContent: string;
  isEditing: boolean;
}

export function PromptForm({
  onSubmit,
  initialTitle,
  initialContent,
  isEditing,
}: PromptFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    if (!isEditing) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Prompt Title"
        className="mb-2"
        required
      />
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Prompt Content (Markdown supported)"
            className="mb-2 font-mono min-h-[200px]"
            required
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="border rounded-md p-4 mb-2 min-h-[200px] prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
      <Button type="submit">{isEditing ? "Update" : "Create"} Prompt</Button>
    </form>
  );
}
