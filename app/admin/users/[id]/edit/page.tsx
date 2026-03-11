"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById, updateUser } from "@/lib/api";
import { createLogAction } from "@/lib/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UpdateUserSchema, User } from "@/types/user";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserById(id)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        toast.error("User not found!");
        router.push("/admin/users");
      });
      
    }, [id]);
    
  if (!user) return <div className="p-10 text-center"></div>;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      ...user,
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      isAdmin: formData.get("role") === "admin",
    };

    const validation = UpdateUserSchema.safeParse(updatedData);

    if (!validation.success) {
      const firstError = JSON.parse(validation.error.message)[0].message;
      toast.error(firstError);
      setLoading(false);
      return;
    }

    const rolePrefix = user.isAdmin ? "Admin" : "User";

    let changes = [];

    if (user.name !== updatedData.name) {
      changes.push(`name to ${updatedData.name}`);
    }
    if (user.email !== updatedData.email) {
      changes.push(`email to ${updatedData.email}`);
    }
    if (user.isAdmin !== updatedData.isAdmin) {
      changes.push(`role to ${updatedData.isAdmin ? "Admin" : "User"}`);
    }
    const description =
      changes.length > 0
        ? `${rolePrefix} ${user.name} changed ${changes.join(", ")}`
        : `${rolePrefix} ${user.name} was updated (no field changes)`;

    try {
      await updateUser(validation.data);

      await createLogAction("UPDATE", "USER", updatedData.name, description);
      changes.length > 0
        ? toast.success("Updated successfully!")
        : toast.success("No changes");

      router.push("/admin/users");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <Input name="id" defaultValue={user.id} hidden />
        <Input name="name" defaultValue={user.name} required />
        <Input name="email" defaultValue={user.email} required />
        <select
          name="role"
          defaultValue={user.isAdmin ? "admin" : "user"}
          className="w-full border rounded-md p-2 text-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
