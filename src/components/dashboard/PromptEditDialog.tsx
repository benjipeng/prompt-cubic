import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromptForm } from "./PromptForm";

interface PromptEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, content: string) => void;
  editingPrompt: { title: string; content: string } | null;
}

export function PromptEditDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  editingPrompt,
}: PromptEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
        </DialogHeader>
        <PromptForm
          onSubmit={onSubmit}
          initialTitle={editingPrompt?.title || ""}
          initialContent={editingPrompt?.content || ""}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
}
