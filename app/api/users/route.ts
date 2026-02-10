import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  isAdmin: z.boolean().optional()
});

// get users data from DB
export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(asc(users.id));
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Drizzle GET error:", error);
    return NextResponse.json({message: "DB Error"} , { status: 500});
  }
}

// add user to DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);

    const newUser = await db.insert(users).values({
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin
    }).returning();

    return NextResponse.json(newUser[0]);
  } catch (error) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }
}

