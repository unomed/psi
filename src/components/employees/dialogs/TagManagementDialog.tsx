
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TagManagementForm } from "./tag-management/TagManagementForm";
import { TagManagementTable } from "./tag-management/TagManagementTable";
import { EmployeeTagType } from "@/types/tags";

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManagementDialog({ open, onOpenChange }: TagManagementDialogProps) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingTag, setEditingTag] = useState<EmployeeTagType | null>(null);

  const handleEdit = (tag: EmployeeTagType) => {
    setEditingTag(tag);
    setIsCreateMode(true);
  };

  const handleCloseForm = () => {
    setIsCreateMode(false);
    setEditingTag(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Tipos de Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário */}
          {isCreateMode && (
            <TagManagementForm 
              editingTag={editingTag}
              onClose={handleCloseForm}
            />
          )}

          {/* Botão para novo */}
          {!isCreateMode && (
            <Button onClick={() => setIsCreateMode(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          )}

          {/* Tabela de tags */}
          <TagManagementTable onEdit={handleEdit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
