"use client";

import { type Store } from "@prisma/client";
import React from "react";
import Heading from "../ui/Heading";
import { Button, buttonVariants } from "../ui/Button";
import { Loader2, Trash } from "lucide-react";
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
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "../modals/AlertModal";
import ApiAlert from "../ui/ApiAlert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  store: Store;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { storeId } = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<SettingsPayload>({
    resolver: zodResolver(SettingsValidator),
    defaultValues: store,
  });

  const onSubmit = async ({ name }: SettingsPayload) => {
    try {
      setIsLoading(true);
      const payload = {
        name,
      };

      await axios.patch(`/api/store/${storeId}/update`, payload);
      router.refresh();

      toast.success("Store updated.");
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

      await axios.delete(`/api/store/${storeId}/delete`);

      router.refresh();
      router.push("/");

      toast.success("Store deleted.");
    } catch (error) {
      // because of safety mechanism of Prisma
      toast.error("Make sure you removed all products and categories first.");
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
        <Heading title="Settings" description="Menage store preferences" />
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
          <Button isLoading={isLoading} disabled={isLoading} type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
