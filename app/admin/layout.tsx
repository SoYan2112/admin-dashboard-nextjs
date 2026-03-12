import { AdminSidebar } from "@/components/users/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-slate-50 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
