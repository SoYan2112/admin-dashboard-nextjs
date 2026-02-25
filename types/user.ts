import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(3, "Name too short"),
  email: z.string().email("Invalid email address"),
  isAdmin: z.boolean()
});
