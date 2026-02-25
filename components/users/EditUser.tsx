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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserSchema } from "@/types/user";
import { toast } from "sonner";
import UserForm, { UserFormData } from "./UserForm";

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (users) {
      setName(users.name);
      setEmail(users.email);
      setIsAdmin(users.isAdmin);
    }
  }, [users]);

  const handleSave = () => {
    const result = UserSchema.safeParse({ name, email, isAdmin });

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      toast.error(errorMessage);
      return;
    }

    onSave({ ...users!, name, email, isAdmin });
  };

  if (!users) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user information</DialogTitle>
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
        <div className="flex items-center space-x-2 pt-2">
          <Label>
            <Checkbox
              id="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(!!checked)}
            />
            Assign as Administrator
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
