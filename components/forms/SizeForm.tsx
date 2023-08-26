"use client";

import { type Size } from "@prisma/client";
import React from "react";
import Heading from "../ui/Heading";
import { Button, buttonVariants } from "../ui/Button";
import { Loader2, Trash } from "lucide-react";
import { Separator } from "../ui/Separator";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "../modals/AlertModal";
import { SizeValidator, type SizePayload } from "@/lib/validators/size";

interface SizeFormProps {
  size: Size | null;
}

const SizeForm: React.FC<SizeFormProps> = ({ size }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { storeId, sizeId } = useParams();
  const router = useRouter();

  const form = useForm<SizePayload>({
    resolver: zodResolver(SizeValidator),
    defaultValues: size || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async ({ value, name }: SizePayload) => {
    try {
      setIsLoading(true);
      const payload: SizePayload = {
        value,
        name,
      };

      // if size doesn't exist then create else update
      if (!size) {
        await axios.post(`/api/store/${storeId}/sizes/create`, payload);
      } else {
        await axios.patch(
          `/api/store/${storeId}/sizes/${sizeId}/update`,
          payload
        );
      }

      router.refresh();
      router.push(`/${storeId}/sizes`);
      toast.success(size ? "Size updated" : "Size created");
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

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/store/${storeId}/sizes/${sizeId}/delete`);

      router.refresh();
      router.push("/");

      toast.success("Size deleted.");
    } catch (error) {
      // because of safety mechanism of Prisma
      toast.error("Make sure you removed all products using this size first.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={size ? "Edit size" : "Create size"}
          description={size ? "Edit a size" : "Add a new size"}
        />
        {size && (
          <Button
            className={buttonVariants({ variant: "destructive" })}
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        )}
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
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={isLoading} disabled={isLoading} type="submit">
            {size ? "Save changes" : "Create"}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default SizeForm;
