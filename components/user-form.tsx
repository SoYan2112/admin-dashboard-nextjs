"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSchema } from "@/types/UserSchema";

export type UserFormData = z.infer<typeof UserSchema>;

type UserFormProps = {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  submitText?: string;
};

export default function UserForm({
  defaultValues,
  onSubmit,
  submitText = "Submit",
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("name")} placeholder="Name" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Input {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Input {...register("role")} placeholder="Role" />
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitText}
      </Button>
    </form>
  );
}
