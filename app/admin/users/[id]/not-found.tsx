import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-5">
      <div className="bg-gray-100 p-4 rounded-full">
        <FileQuestion className="w-12 h-12 text-gray-400" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-gray-500">The user you are looking for does not exist or has been deleted.</p>
      </div>
      <Link href="/admin/users">
        <Button>Back to Users List</Button>
      </Link>
    </div>
  );
}