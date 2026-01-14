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
import { useEffect, useState } from "react";
import { EditUser, User } from "@/components/EditUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserSkeleton } from "./user-skeleton";
import { getUsers, updateUser, deleteUser } from "@/lib/api";
const users: User[] = [
  { id: 1, name: "Nguyen Van An", email: "an.nguyen@company.com", role: "ADMIN" },
  { id: 2, name: "Tran Thi Binh", email: "binh.tran@company.com", role: "USER" },
  { id: 3, name: "Le Quoc Cuong", email: "cuong.le@company.com", role: "USER" },
  { id: 4, name: "Pham Minh Duc", email: "duc.pham@company.com", role: "MODERATOR" },
  { id: 5, name: "Vo Thi Hoa", email: "hoa.vo@company.com", role: "USER" },
  { id: 6, name: "Dang Thanh Khoa", email: "khoa.dang@company.com", role: "USER" },
  { id: 7, name: "Bui Anh Tuan", email: "tuan.bui@company.com", role: "USER" },
  { id: 8, name: "Do Ngoc Linh", email: "linh.do@company.com", role: "ADMIN" },
  { id: 9, name: "Hoang Gia Bao", email: "bao.hoang@company.com", role: "USER" },
  { id: 10, name: "Mai Phuong Thao", email: "thao.mai@company.com", role: "USER" },
];


export default function UsersPage() {
  const [usersState, setUsersState] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setUsersState(users);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsersState(
          data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: "USER",
          }))
        ); 
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  
  const filteredUsers = usersState.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  type SortField = "name" | "role" | null;
  type SortOrder = "asc" | "desc";

  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField].toString();
    const valueB = b[sortField].toString();

    return sortOrder === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const totalPage = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = sortedUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsersState((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEdit = (userId: number) => {
    console.log("Edit user:", userId);
  };

  const handleSave = async (user: User) => {
    await updateUser(user);
    setUsersState((prev) =>
      prev.map((u) => (u.id === user.id ? user : u))
    );
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <UserSkeleton />
      
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      {paginatedUsers.length === 0 && (<div className="text-center text-gray-500 py-10">
        No users found
         </div> )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                setSortField("name");
                setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
              }}
            >
              Name {sortField === "name" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.map((user) => (
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


      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          prev
        </Button>

        <span className="text-sm">
          Page {page} / {totalPage}
        </span>

        <Button
          variant="outline"
          disabled={page === totalPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <EditUser
        open={!!editingUser}
        users={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
    </div>
  );
}
