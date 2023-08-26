"use client";

import { type Billboard } from "@prisma/client";
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
import { useOrigin } from "@/hooks/use-origin";
import {
  type BillboardPayload,
  BillboardValidator,
} from "@/lib/validators/billboard";
import ImageUpload from "../ImageUpload";

interface BillboardFormProps {
  billboard: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { storeId, billboardId } = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<BillboardPayload>({
    resolver: zodResolver(BillboardValidator),
    defaultValues: billboard || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async ({ imageUrl, label }: BillboardPayload) => {
    try {
      setIsLoading(true);
      const payload: BillboardPayload = {
        imageUrl,
        label,
      };

      // if billboard doesn't exist then create else update
      if (!billboard) {
        await axios.post(
          `/api/store/${storeId}/billboards/create`,
          payload
        );
      } else {
        await axios.patch(
          `/api/store/${storeId}/billboards/${billboardId}/update`,
          payload
        );
      }

      router.refresh();
      toast.success(billboard ? "Billboard updated" : "Billboard created");
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

      await axios.delete(
        `/api/store/${storeId}/billboards/${billboardId}/delete`
      );

      router.refresh();
      router.push("/");

      toast.success("Billboard deleted.");
    } catch (error) {
      // because of safety mechanism of Prisma
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
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
          title={billboard ? "Edit billboard" : "Create billboard"}
          description={billboard ? "Edit a billboard" : "Add a new billboard"}
        />
        {billboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={isLoading} disabled={isLoading} type="submit">
            {billboard ? "Save changes" : "Create"}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BillboardForm;
