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
  users: User | null;
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
};

export function EditUser({ open, onClose, users, onSave }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (users) {
      setName(users.name);
      setEmail(users.email);
    }
  }, [users]);

  if (!users) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit users</DialogTitle>
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
          <Button onClick={() => onSave({ ...users, name, email })}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
