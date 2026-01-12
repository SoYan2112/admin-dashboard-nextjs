import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  { id: 1, name: "Minh Nhat", email: "MinhNhat123@gmail.com", role: "ADMIN" },
  { id: 2, name: "Hoang Nhat", email: "HoangNhat123@gmail.com", role: "USER" },
  { id: 3, name: "Duy Nhat", email: "DuyNhat123@gmail.com", role: "USER" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
