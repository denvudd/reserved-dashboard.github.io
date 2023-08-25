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
import { useForm } from "react-hook-form";
import {
  type CreateStorePayload,
  CreateStoreValidator,
} from "@/lib/validators/store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "react-query";
import axios from "axios";

const StoreModal: React.FC = ({}) => {
  const { isOpen, onClose } = useStoreModal();

  const { mutate: createStore, isLoading: isStoreLoading } = useMutation({
    mutationFn: async ({ name }: CreateStorePayload) => {
      const payload: CreateStorePayload = { name };

      const { data } = await axios.patch(`/api/store/create`, payload);
      return data;
    },
    onError: () => {},
    onSuccess: () => {},
  });

  const form = useForm<CreateStorePayload>({
    resolver: zodResolver(CreateStoreValidator),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async ({ name }: CreateStorePayload) => {
    const payload: CreateStorePayload = { name };
    createStore(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create store</DialogTitle>
          <DialogDescription>
            Add a new store to menage products and categories.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isStoreLoading}
                          placeholder="E-Commerce"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button
                    disabled={isStoreLoading}
                    variant="outline"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isStoreLoading}
                    isLoading={isStoreLoading}
                    type="submit"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreModal;
