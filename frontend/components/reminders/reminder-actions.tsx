"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteReminderDialog } from "@/components/reminders/delete-reminder-dialog";

export function ReminderActions({
  id,
  title,
  onDelete,
  disableDelete,
}: {
  id: string;
  title: string;
  onDelete: (id: string) => Promise<void>;
  disableDelete?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <span className="text-lg leading-none">⋯</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/reminders/${id}/edit`)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={disableDelete} className="text-destructive focus:text-destructive" onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteReminderDialog open={open} onOpenChange={setOpen} title={title} onConfirm={() => onDelete(id)} disableDelete={disableDelete} />
    </>
  );
}
