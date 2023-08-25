"use client";

import { type Store } from "@prisma/client";
import React from "react";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/Separator";
import { useForm } from "react-hook-form";
import {
  SettingsValidator,
  type SettingsPayload,
} from "@/lib/validators/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";

interface SettingsFormProps {
  store: Store;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SettingsPayload>({
    resolver: zodResolver(SettingsValidator),
    defaultValues: store,
  });

  const onSubmit = async (data: SettingsPayload) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Menage store preferences" />
        <Button
          isLoading={isLoading}
          variant="destructive"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
