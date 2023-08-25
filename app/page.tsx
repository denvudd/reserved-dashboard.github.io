"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import React from "react";

export default function Home() {
  const { onOpen, isOpen } = useStoreModal();

  React.useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className=""></div>
  );
}
