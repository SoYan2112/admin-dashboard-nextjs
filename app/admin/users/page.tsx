import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "@/components/users/UserAction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

// Định nghĩa Type cho SearchParams
type Order = "asc" | "desc";
type SortField = "id" | "name" | "isAdmin";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: SortField;
    order?: Order;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // 1. Lấy dữ liệu từ URL params
  const { search, page, sort, order } = await searchParams;

  const currentSearch = search || "";
  const currentPage = Number(page) || 1;
  const currentSortField: SortField = sort || "id";
  const currentOrder: Order = order || "asc";
  const pageSize = 10;

  const allUsers = await db.select().from(users).orderBy(asc(users.id));

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(currentSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(currentSearch.toLowerCase()),
  );

  var sortedUsers = filteredUsers;

  if (sort == "name") {
    sortedUsers = [...filteredUsers].sort((a, b) => {
      const valA = String(a[currentSortField] || "");
      const valB = String(b[currentSortField] || "");
      return currentOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }

  const totalPage = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/admin/users/create">
            <Button className="w-full sm:w-auto">Add new user</Button>
          </Link>
          <SearchInput defaultValue={currentSearch} />
        </div>
      </div>

      {/* Table Section */}
      <div className="min-h-[600px]">
        <div className="border rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[700px] table-fixed">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[250px]">
                    <SortLink
                      label="Name"
                      field="name"
                      current={currentSortField}
                      order={currentOrder}
                      search={currentSearch}
                    />
                  </TableHead>
                  <TableHead className="w-[300px]">Email</TableHead>
                  <TableHead className="w-[120px]">
                    <SortLink
                      label="Role"
                      field="isAdmin"
                      current={currentSortField}
                      order={currentOrder}
                      search={currentSearch}
                    />
                  </TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <Link href={`/admin/users/${user.id}`}>
                      <TableCell className="font-medium cursor-pointer">
                        {user.name}
                      </TableCell>
                    </Link>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`block rounded md:rounded-lg w-20 text-xs py-2 text-center ${user.isAdmin ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <UserActions
                        userId={user.id}
                        userName={user.name || ""}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginatedUsers.length === 0 && (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div>
        <p className="text-muted-foreground absolute">
          {currentPage} / {totalPage}
        </p>
        <div className="flex justify-center gap-2 ">
          <Link
            href={
              currentPage > 1
                ? `?page=${currentPage - 1}&search=${currentSearch}&sort=${currentSortField}&order=${currentOrder}`
                : "#"
            }
          >
            <Button
              className="w-20"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
          </Link>
          <Link
            href={
              currentPage < totalPage
                ? `?page=${currentPage + 1}&search=${currentSearch}&sort=${currentSortField}&order=${currentOrder}`
                : "#"
            }
            scroll={false}
          >
            <Button
              className="w-20"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPage}
            >
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper component cho việc Sort (Server side)
function SortLink({
  label,
  field,
  current,
  order,
  search,
}: {
  label: string;
  field: SortField;
  current: SortField;
  order: Order;
  search: string;
}) {
  const isCurrent = current === field;
  const nextOrder = isCurrent && order === "asc" ? "desc" : "asc";
  return (
    <Link
      href={`?sort=${field}&order=${nextOrder}&search=${search}`}
      className="flex items-center gap-1 cursor-pointer"
    >
      {label} {isCurrent && (order === "asc" ? "⬆️" : "⬇️")}
    </Link>
  );
}
