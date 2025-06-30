
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CompanyForm } from './CompanyForm';
import { CompanyFormProps } from '@/components/forms/types';

interface CompanyDialogsProps {
  open: boolean;
  isEditMode: boolean;
  selectedCompany: any;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export function CompanyDialogs({
  open,
  isEditMode,
  selectedCompany,
  onSubmit,
  onClose
}: CompanyDialogsProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Empresa' : 'Nova Empresa'}
          </DialogTitle>
        </DialogHeader>
        <CompanyForm
          onSubmit={onSubmit}
          onClose={onClose}
          initialData={selectedCompany}
          isEdit={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}
