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
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const StoreModal: React.FC = ({}) => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<CreateStorePayload>({
    resolver: zodResolver(CreateStoreValidator),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async ({ name }: CreateStorePayload) => {
    const payload: CreateStorePayload = { name };
    try {
      setIsLoading(true);

      const response = await axios.post("/api/store/create", payload);
      toast.success("Store created");

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast.error("Store already exists");
        }

        if (error.response?.status === 401) {
          return toast.error("Unauthorized");
        }

        if (error.response?.status === 422) {
          return toast.error("Invalid name of store");
        }
      }

      toast.error("Something went wrong... Please try again letter");
    } finally {
      setIsLoading(false);
    }
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
                          disabled={isLoading}
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
                    disabled={isLoading}
                    variant="outline"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isLoading}
                    isLoading={isLoading}
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
