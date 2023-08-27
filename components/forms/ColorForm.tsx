"use client";

import { type Color } from "@prisma/client";
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
import { type ColorPayload, ColorValidator } from "@/lib/validators/color";

interface ColorFormProps {
  color: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({ color }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { storeId, colorId } = useParams();
  const router = useRouter();

  const form = useForm<ColorPayload>({
    resolver: zodResolver(ColorValidator),
    defaultValues: color || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async ({ value, name }: ColorPayload) => {
    try {
      setIsLoading(true);
      const payload: ColorPayload = {
        value,
        name,
      };

      // if color doesn't exist then create else update
      if (!color) {
        await axios.post(`/api/store/${storeId}/colors/create`, payload);
      } else {
        await axios.patch(
          `/api/store/${storeId}/colors/${colorId}/update`,
          payload
        );
      }

      router.refresh();
      router.push(`/${storeId}/colors`);
      toast.success(color ? "Color updated" : "Color created");
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

      await axios.delete(`/api/store/${storeId}/colors/${colorId}/delete`);

      router.refresh();
      router.push("/");

      toast.success("Color deleted.");
    } catch (error) {
      // because of safety mechanism of Prisma
      toast.error("Make sure you removed all products using this color first.");
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
          title={color ? "Edit color" : "Create color"}
          description={color ? "Edit a color" : "Add a new color"}
        />
        {color && (
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoading}
                        placeholder="Color value"
                        {...field}
                      />
                      {field.value && (
                        <div
                          className="border p-4 rounded-full"
                          style={{ backgroundColor: field.value }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={isLoading} disabled={isLoading} type="submit">
            {color ? "Save changes" : "Create"}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default ColorForm;
