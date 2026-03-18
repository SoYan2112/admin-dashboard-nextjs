"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteUser } from "@/lib/api";
import { createLogAction } from "@/lib/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UserActions({
  userId,
  userName,
}: {
  userId: number;
  userName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        await deleteUser(userId);

        await createLogAction(
          "DELETE",
          "USER",
          userName,
          `Deleted user ${userName} (ID: ${userId})`,
        );

        toast.success("User deleted successfully");
        setOpen(false);

        router.refresh();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <MoreHorizontal size={18} />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <Link href={`/admin/users/${userId}`}>
            <DropdownMenuItem className="cursor-pointer">
              <span>View Detail</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/admin/users/${userId}/edit`}>
            <DropdownMenuItem className="cursor-pointer">
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{userName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
