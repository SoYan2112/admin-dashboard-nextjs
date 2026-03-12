"use client";
import { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "@/components/users/UserAction";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableRowSkeleton } from "./user-skeleton";
import { getUsers, updateUser, deleteUser, createUser } from "@/lib/api";
import { toast } from "sonner";
import { createLogAction } from "@/lib/action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [usersState, setUsersState] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // State search, sort, page
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState<"id" | "name" | "isAdmin" | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // fetch db
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsersState(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch users";
        console.error(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // filter & sort
  const filteredUsers = usersState.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    const valA = String(a[sortField] || "");
    const valB = String(b[sortField] || "");

    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // page
  const totalPage = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // actions
  // delete
  const handleDelete = async (id: number) => {
    const userToDelete = usersState.find((u) => u.id === id);
    if (!userToDelete) return;

    try {
      await deleteUser(id);

      startTransition(async () => {
        await createLogAction(
          "DELETE",
          "USER",
          userToDelete.name,
          `${userToDelete?.name} (${userToDelete?.email})  was deleted`,
        );
        router.refresh();
      });

      // ghi log
      setUsersState((prev) => prev.filter((u) => u.id !== id));
      toast.success(`Delete user successfully!`);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/admin/users/create" className="w-full sm:w-auto">
            <Button className="w-full">Add new user</Button>
          </Link>

          <Input
            placeholder="Search by name or email..."
            className="w-full sm:max-w-xs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            disabled={loading}
          />
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <div className="overflow-x-auto shadow-sm">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead
                  className="cursor-pointer w-[250px]"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Name{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
                </TableHead>

                <TableHead className="w-[300px]">Email</TableHead>
                <TableHead
                  className="cursor-pointer w-[120px]"
                  onClick={() => {
                    setSortField("isAdmin");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Role{" "}
                  {sortField === "isAdmin" &&
                    (sortOrder === "asc" ? "⬆️" : "⬇️")}
                </TableHead>

                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRowSkeleton rows={10} />
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>

                    <TableCell>
                      <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
                    </TableCell>

                    <TableCell className="w-[100px]">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {user.isAdmin === true ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <UserActions
                        userId={user.id}
                        onDelete={() => handleDelete(user.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {paginatedUsers.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No users found
            </div>
          )}
        </div>
      </div>

      {/* page */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mt-4 text-gray-500 ">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPage}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
