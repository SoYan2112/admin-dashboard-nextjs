"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { UserSchema } from "@/types/user";

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
  control,
  formState: { errors, isSubmitting },
} = useForm<UserFormData>({
  resolver: zodResolver(UserSchema) as any,
  values: {
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    isAdmin: defaultValues?.isAdmin ?? false, 
  },
});

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Input {...register("name")} placeholder="Name" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Input {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Controller
          name="isAdmin"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isAdmin"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Label htmlFor="isAdmin" className="text-sm font-medium cursor-pointer">
          Assign as Administrator
        </Label>
        {errors.isAdmin && (
          <p className="text-red-500 test-sm">{errors.isAdmin.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitText}
      </Button>
    </form>
  );
}
