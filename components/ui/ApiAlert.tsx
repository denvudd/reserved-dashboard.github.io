"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./Alert";
import { Copy, ServerIcon } from "lucide-react";
import { Badge, type BadgeProps } from "./Badge";
import { Button } from "./Button";
import { useCopy } from "@/hooks/use-copy";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert: React.FC<ApiAlertProps> = ({
  description,
  title,
  variant = "public",
}) => {
  const [value, copy] = useCopy();

  const onCopy = (value: string) => {
    copy(value);
    toast.success("API route copied to the clipboard.");
  };

  return (
    <Alert>
      <ServerIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted p-2 font-mono text-sm font-semibold">
          {description}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onCopy(description)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
