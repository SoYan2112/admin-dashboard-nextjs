import { z } from "zod";

const nameRegex = /^[a-zA-Z ]+$/;

export const UserSchema = z.object({
  name: z
    .string()
    .min(3, "Name too short")
    .max(50, "Name is too long")
    .regex(nameRegex, "Name only allow letters and space!")
    .transform((val) => val.trim().replace(/\s+/g, " ")),
  email: z.string().email("Invalid email address!"),
  isAdmin: z.boolean(),
});

export const UpdateUserSchema = UserSchema.extend({
  id: z.coerce.number(),
});

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};
