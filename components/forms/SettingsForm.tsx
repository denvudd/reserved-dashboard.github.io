"use client";

import { type Store } from "@prisma/client";
import React from "react";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/Separator";

interface SettingsFormProps {
  store: Store;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Menage store preferences" />
        <Button variant="destructive" size="sm" onClick={() => {}}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default SettingsForm;
