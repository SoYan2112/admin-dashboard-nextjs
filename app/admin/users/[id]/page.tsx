import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"; 

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(id)),
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">User Details</CardTitle>
          <span
            className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {user.isAdmin ? "Admin" : "User"}
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <span className="font-semibold text-gray-500">Name:</span>
            <span className="col-span-2">{user.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <span className="font-semibold text-gray-500">Email:</span>
            <span className="col-span-2">{user.email}</span>
          </div>
          <div className="flex justify-end gap-2">
            <Link href="/admin/users">
              <Button variant="outline">Back</Button>
            </Link>
            <Link href={`/admin/users/${id}/edit`}>
              <Button>Edit</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}