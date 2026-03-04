"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";
import { createLogAction } from "@/lib/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserSchema } from "@/types/user";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      isAdmin: formData.get("role") === "admin",
    };  

    const validation = UserSchema.safeParse(rawData);

    if (!validation.success) {
        const firstError = JSON.parse(validation.error.message)[0].message;
        toast.error(firstError);
        setLoading(false);
        return;
    }

    try {
      // 1. Gọi API tạo user
      const newUser = await createUser(validation.data);

      // 2. Ghi Log hành động
      await createLogAction(
        "CREATE",
        "USER",
        newUser.name,
        `Created new user: ${newUser.name} (${newUser.email})`
      );

      toast.success("Create user successfully!");
      
      // 3. Làm mới dữ liệu và quay lại danh sách
      router.refresh(); 
      router.push("/admin/users");
    } catch (error: any) {
      toast.error(error.message || "Failed to create user!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border mt-10">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Name */}
        <Input 
          name="name" 
          placeholder="Full Name" 
          required 
          disabled={loading}
        />

        {/* Input Email */}
        <Input 
          name="email" 
          type="email" 
          placeholder="Email Address" 
          required 
          disabled={loading}
        />

        {/* Select Role */}
        <select 
          name="role" 
          className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          defaultValue="user"
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}