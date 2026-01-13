"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "@/components/user-actions";
import { useState } from "react";
import { EditUser, User } from "@/components/EditUser";
import { Input } from "@/components/ui/input";

const users: User[] = [
  { id: 1, name: "Minh Nhat", email: "MinhNhat123@gmail.com", role: "ADMIN" },
  { id: 2, name: "Hoang Nhat", email: "HoangNhat123@gmail.com", role: "USER" },
  { id: 3, name: "Duy Nhat", email: "DuyNhat123@gmail.com", role: "USER" },
 
];

export default function UsersPage() {
  const [usersState, setUsersState] = useState<User[]>(users);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const filteredUsers = usersState.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = (id: number) => {
    setUsersState((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEdit = (userId: number) => {
    console.log("Edit user:", userId);
  };

  const handleSave = (updateUser: User) => {
    setUsersState((prev) =>
      prev.map((u) => (u.id === updateUser.id ? updateUser : u))
    );
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} className="text-gray-600">
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <UserActions
                  onEdit={() => setEditingUser(user)}
                  onDelete={() =>
                    setUsersState((prev) =>
                      prev.filter((u) => u.id !== user.id)
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditUser
        open={!!editingUser}
        users={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
    </div>
  );
}
