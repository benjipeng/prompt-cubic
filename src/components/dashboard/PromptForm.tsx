import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, List, Heading } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  useEffect(() => {
    if (isLargeScreen) {
      setActiveTab("write");
    }
  }, [isLargeScreen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    if (!isEditing) {
      setTitle("");
      setContent("");
    }
  };

  const insertMarkdown = (markdownType: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const selection = text.substring(start, end);
      const after = text.substring(end);

      let newText = "";
      let cursorOffset = 0;

      switch (markdownType) {
        case "bold":
          newText = `**${selection || "Bold text"}**`;
          cursorOffset = 2;
          break;
        case "italic":
          newText = `*${selection || "Italic text"}*`;
          cursorOffset = 1;
          break;
        case "list":
          newText = `\n- ${selection || "List item"}`;
          cursorOffset = 3;
          break;
        case "heading":
          newText = `\n## ${selection || "Heading"}`;
          cursorOffset = 4;
          break;
      }

      const newContent = before + newText + after;
      setContent(newContent);

      // Use setTimeout to ensure the new content is set before focusing
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = selection
          ? start + newText.length
          : start + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Prompt Title"
        required
      />
      <Card>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "write" | "preview")
            }
            className="w-full"
          >
            <div className="flex justify-between items-center p-2 border-b">
              <TabsList className="md:hidden">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertMarkdown("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertMarkdown("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertMarkdown("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertMarkdown("heading")}
                >
                  <Heading className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="md:flex md:min-h-[300px]">
              <TabsContent value="write" className="mt-0 flex-1 md:w-1/2">
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your markdown here..."
                  className="h-full min-h-[300px] w-full rounded-none border-0 focus-visible:ring-0 resize-none"
                />
              </TabsContent>
              <TabsContent
                value="preview"
                className="mt-0 flex-1 md:w-1/2 md:border-l"
              >
                <div className="prose dark:prose-invert max-w-none p-4 overflow-auto h-full">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </TabsContent>
              {isLargeScreen && (
                <div className="hidden md:block md:w-1/2 border-l overflow-auto">
                  <div className="prose dark:prose-invert max-w-none p-4">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      <Button type="submit">{isEditing ? "Update" : "Create"} Prompt</Button>
    </form>
  );
}
