import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import ReactMarkdown from "react-markdown"; // Add this import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Prompt {
  id: string;
  title: string;
  content: string;
}

export function Dashboard() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPrompts();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user!.id);

    if (error) {
      console.error("Error fetching prompts:", error);
    } else {
      setPrompts(data || []);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel("prompts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prompts",
          filter: `user_id=eq.${user!.id}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          fetchPrompts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { data, error } = await supabase
        .from("prompts")
        .update({ title, content, updated_at: new Date() })
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        console.error("Error updating prompt:", error);
      } else if (data) {
        setPrompts(prompts.map((p) => (p.id === editingId ? data : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("prompts")
        .insert({
          title,
          content,
          user_id: user!.id,
          updated_at: new Date(),
          created_at: new Date(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating prompt:", error);
      } else if (data) {
        setPrompts([...prompts, data]);
      }
    }
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setTitle(prompt.title);
    setContent(prompt.content);
    setEditingId(prompt.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting prompt:", error);
    } else {
      setPrompts(prompts.filter((prompt) => prompt.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
        <Button type="submit">{editingId ? "Update" : "Create"} Prompt</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <CardTitle>{prompt.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{prompt.content}</ReactMarkdown>
              </CardDescription>
              <div className="mt-4">
                <Button onClick={() => handleEdit(prompt)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(prompt.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
