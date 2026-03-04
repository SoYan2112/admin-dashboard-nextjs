import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { UserSchema } from "@/types/user";

// get users data from DB
export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(asc(users.id));
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Drizzle GET error:", error);
    return NextResponse.json({ message: "DB Error" }, { status: 500 });
  }
}

// add user to DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = UserSchema.parse(body);

    const existingName = await db
      .select()
      .from(users)
      .where(eq(users.name, data.name))
      .limit(1);

    if (existingName.length > 0) {
      return NextResponse.json(
        { message: "Name already exists." },
        { status: 400 },
      );
    }

    const newUser = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      })
      .returning();

    return NextResponse.json(newUser[0]);
  } catch (error) {
    return NextResponse.json({ message: "Email already exists." }, { status: 400 });
  }
}
