import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and, ne } from "drizzle-orm";
import { UserSchema } from "@/types/user";
import { z } from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validatedData = UserSchema.parse(body);
    const userId = Number(id);

    // check exit name
    const existingName = await db
      .select()
      .from(users)
      .where(and(eq(users.name, validatedData.name), ne(users.id, userId)))
      .limit(1);

    if (existingName.length > 0) {
      return NextResponse.json(
        { message: "Name already exists." },
        { status: 409 },
      );
    }

    // update user
    const updatedUser = await db
      .update(users)
      .set({
        name: validatedData.name,
        email: validatedData.email,
        isAdmin: validatedData.isAdmin,
      })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedUser[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 },
      );
    }
    if (
      error.code === "23505" ||
      error.message?.includes("inique constraint")
    ) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = Number(id);

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

// fetch user GET
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)))
    .limit(1);

  if (!user.length) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user[0]);
}
