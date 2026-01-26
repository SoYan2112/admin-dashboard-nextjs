import { NextRequest, NextResponse } from "next/server";
import { UserSchema } from "@/types/UserSchema";
import { users } from "@/data/users";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data = UserSchema.parse(body);

    return NextResponse.json({
      message: "Updated successfully",
      user: { id: Number(id), ...data },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { fieldErrors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
