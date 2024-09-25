import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { PromptForm } from "./PromptForm";
import { PromptList } from "./PromptList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Prompt {
  id: string;
  title: string;
  content: string;
}

export function Dashboard() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);
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

  const handleSubmit = async (title: string, content: string) => {
    if (editingPrompt) {
      const { data, error } = await supabase
        .from("prompts")
        .update({ title, content, updated_at: new Date() })
        .eq("id", editingPrompt.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating prompt:", error);
      } else if (data) {
        setPrompts(prompts.map((p) => (p.id === editingPrompt.id ? data : p)));
      }
      setIsEditModalOpen(false);
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
    setEditingPrompt(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeletingPromptId(id);
  };

  const handleDelete = async () => {
    if (deletingPromptId) {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", deletingPromptId);

      if (error) {
        console.error("Error deleting prompt:", error);
      } else {
        setPrompts(prompts.filter((prompt) => prompt.id !== deletingPromptId));
      }
      setDeletingPromptId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <PromptForm
        onSubmit={handleSubmit}
        initialTitle=""
        initialContent=""
        isEditing={false}
      />
      <PromptList
        prompts={prompts}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirmation}
      />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
          </DialogHeader>
          <PromptForm
            onSubmit={handleSubmit}
            initialTitle={editingPrompt?.title || ""}
            initialContent={editingPrompt?.content || ""}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deletingPromptId}
        onOpenChange={() => setDeletingPromptId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPromptId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
