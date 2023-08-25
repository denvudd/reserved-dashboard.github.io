"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";

export default function Home() {
  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test</DialogTitle>
          <DialogDescription>Descr</DialogDescription>
        </DialogHeader>
        Clidren
      </DialogContent>
    </Dialog>
  );
}
