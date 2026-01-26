import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Link href="/admin/dashboard" >
      <Button variant={"default"}>
        Home page, click to redirect to dashboard
      </Button>
        </Link>
    </main>
  );
}
