"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "@/components/users/UserAction";
import { EditUser, type User } from "@/components/users/EditUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserSkeleton } from "./user-skeleton";
import {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} from "@/lib/api";
import { AddUser } from "@/components/users/AddUser";
import { toast } from "sonner";
import { createLogAction } from "@/lib/action";

export default function UsersPage() {
  const [usersState, setUsersState] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // State search, sort, page
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [sortField, setSortField] = useState<"id" | "name" | "isAdmin" | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // fetch db
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsersState(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
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

    await deleteUser(id);
    // ghi log
    await createLogAction(
      "DELETE",
      "USER",
      userToDelete.name,
      `${userToDelete?.name} (${userToDelete?.email})  was deleted`,
    );

    setUsersState((prev) => prev.filter((u) => u.id !== id));
    toast.success(`Delete user successfully!`);
  };

  //save, edit
  const handleSave = async (updatedUser: User) => {
    const oldUser = usersState.find((u) => u.id === updatedUser.id);

    const hasChanges =
      oldUser?.name !== updatedUser.name ||
      oldUser?.email !== updatedUser.email ||
      oldUser?.isAdmin !== updatedUser.isAdmin;

    if (!hasChanges) {
      toast.info("No changes detected");
      setEditingUser(null);
      return;
    }

    try {
      await updateUser(updatedUser);

      // ghi log sau khi update thành công
      await createLogAction(
        "UPDATE",
        "USER",
        updatedUser.name,
        `User: ${oldUser?.name} updated username to ${updatedUser.name}`,
      );

      setUsersState((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      );
      setEditingUser(null);
      toast.success("Updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update user: ${error.message}`);
    }
  };

  // create
  const handleCreate = async (newData: {
    name: string;
    email: string;
    isAdmin: boolean;
  }) => {
    try {
      const newUser = await createUser(newData);

      await createLogAction(
        "UPDATE",
        "USER",
        newUser.name,

        `New account created: name: ${newUser.name} role: ${newUser.isAdmin ? "Admin" : "User"}`,
      );

      setUsersState((prev) => [newUser, ...prev]);
      toast.success("Add new user successfully!");
    } catch (error: any) {
      toast.error(`Failed to add new user: ${error.message}`);
    }
  };

  if (loading) return <UserSkeleton />;

  return (
    <div className="space-y-6">
      <div className="justify-between items-center space-y-5">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="md:flex space-y-2 md:space-y-0 justify-between">
          <Button className="px-5" onClick={() => setIsAddOpen(true)}>
            Add new user
          </Button>

          <Input
            placeholder="Search by name or email..."
            className="max-w-3xs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="min-h-[350px] flex flex-col justify-between">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Name{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
                </TableHead>

                <TableHead>Email</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("isAdmin");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Role{" "}
                  {sortField === "isAdmin" &&
                    (sortOrder === "asc" ? "⬆️" : "⬇️")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {user.isAdmin === true ? "Admin" : "User"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <UserActions
                      onEdit={() => setEditingUser(user)}
                      onDelete={() => handleDelete(user.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {paginatedUsers.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No users found
            </div>
          )}
        </div>

        {/* page */}
        <div className="flex items-center gap-2 justify-end  ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>

          <div className="text-sm">
            Page {page} of {totalPage}
          </div>

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
      <AddUser
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleCreate}
      />
      <EditUser
        open={!!editingUser}
        users={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
    </div>
  );
}
