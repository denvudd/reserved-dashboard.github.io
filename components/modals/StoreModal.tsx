"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/Dialog";
import { useStoreModal } from "@/hooks/use-store-modal";

const StoreModal: React.FC = ({}) => {
  const { isOpen, onClose } = useStoreModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create store</DialogTitle>
          <DialogDescription>
            Add a new store to menage products and categories.
          </DialogDescription>
        </DialogHeader>
        Clidren
      </DialogContent>
    </Dialog>
  );
};

export default StoreModal;
