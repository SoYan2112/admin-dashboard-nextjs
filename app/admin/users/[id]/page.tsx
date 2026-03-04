"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/user";
import { FormCardSkeleton } from "../user-skeleton";

export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getUsers().then((data) => {
      const found = data.find((u) => u.id === parseInt(id));
      setUser(found);
    });
  }, [id]);

  if (!user)
    return (
      <div className="p-10 text-center">
        <FormCardSkeleton />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">User Details</CardTitle>
          <span
            className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {user.isAdmin === true ? "Admin" : "User"}
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <span className="font-semibold text-gray-500 hidden">ID:</span>
            <span className="col-span-2 hidden">#{user.id}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <span className="font-semibold text-gray-500">Name:</span>
            <span className="col-span-2">{user.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <span className="font-semibold text-gray-500">Email:</span>
            <span className="col-span-2">{user.email}</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="w-15 "
              variant="outline"
              onClick={() => router.push("/admin/users")}
            >
              Back
            </Button>
            <Button
              className="w-15 "
              onClick={() => router.push(`/admin/users/${id}/edit`)}
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
