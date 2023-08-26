"use client";

import { type Billboard, type Category } from "@prisma/client";
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
import {
  type CategoryPayload,
  CategoryValidator,
} from "@/lib/validators/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  billboards,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { storeId, billboardId } = useParams();
  const router = useRouter();

  const form = useForm<CategoryPayload>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: category || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async ({ name, billboardId }: CategoryPayload) => {
    try {
      setIsLoading(true);
      const payload: CategoryPayload = {
        name,
        billboardId,
      };

      // if category doesn't exist then create else update
      if (!category) {
        await axios.post(`/api/store/${storeId}/categories/create`, payload);
      } else {
        await axios.patch(
          `/api/store/${storeId}/categories/${billboardId}/update`,
          payload
        );
      }

      router.refresh();
      router.push(`/${storeId}/categories`);
      toast.success(category ? "Category updated" : "Category created");
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
        `/api/store/${storeId}/categories/${billboardId}/delete`
      );

      router.refresh();
      router.push("/");

      toast.success("Category deleted.");
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
          title={category ? "Edit category" : "Create category"}
          description={category ? "Edit a category" : "Add a new category"}
        />
        {category && (
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
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    default={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={isLoading} disabled={isLoading} type="submit">
            {category ? "Save changes" : "Create"}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default CategoryForm;
