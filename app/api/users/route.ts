import { NextResponse } from "next/server";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);

    if (data.email === "test@gmail.com") {
      return NextResponse.json(
        { fieldErrors: { email: "Email already exists" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: crypto.randomUUID(),
      ...data,
    });
  } catch {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }
}
