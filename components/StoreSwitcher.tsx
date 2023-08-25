"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { type Store } from "@prisma/client";
import {
  PopoverTrigger,
  type PopoverTriggerProps,
} from "@radix-ui/react-popover";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Popover, PopoverContent } from "./ui/Popover";
import { Button } from "./ui/Button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/Command";

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  className,
  stores = [],
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { storeId } = useParams();
  const router = useRouter();
  const { onOpen } = useStoreModal();

  const currentStore = stores.find((store) => store.id === storeId);

  const onStoreSelect = (store: Store) => {
    setIsOpen(false);
    router.push(`/${store.id}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.id === store.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup heading="Others">
              <CommandItem
                onSelect={() => {
                  setIsOpen(false);
                  onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
