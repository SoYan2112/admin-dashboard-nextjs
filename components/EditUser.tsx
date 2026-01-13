"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
  onSave: (user: User) => void;
};

export function EditUser({ open, onClose, user, onSave }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave({ ...user, name, email })}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
