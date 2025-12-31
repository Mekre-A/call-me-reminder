"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteReminderDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  disableDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm: () => Promise<void>;
  disableDelete?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete reminder?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <span className="font-medium">“{title}”</span>. This can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={disableDelete}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={disableDelete}
            onClick={async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                toast.success("Reminder deleted");
                onOpenChange(false);
              } catch (err: any) {
                toast.error(err?.message ?? "Failed to delete reminder");
              }
            }}
            className="bg-destructive hover:bg-destructive/90"
          >
            {disableDelete ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
