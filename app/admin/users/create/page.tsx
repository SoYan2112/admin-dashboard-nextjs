"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  name: string;
  email: string;
  role: string;
};

const schema = z.object({
  name: z.string().min(3, "Name too short"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

export default function CreateUserPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log("FORM DATA", data);
  };

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register("name")} placeholder="Name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Input {...register("email")} placeholder="Email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Input {...register("role")} placeholder="Role" />
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>

        <Button type="submit" className="bg-blue-500">Create</Button>
      </form>
    </div>
  );
}
