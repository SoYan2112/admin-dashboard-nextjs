export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-red-500 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="space-y-3">
          <a href="/admin/dashboard" className="block hover:text-green-400">
            Dashboard
          </a>
        </nav>
      </aside>

      <div className="flex-1 bg-gray-100">
        <header className="h-14 bg-white shadow px-6 items-center flex">
          <span className="font-medium">Admin Dashboard</span>
        </header>
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
}
