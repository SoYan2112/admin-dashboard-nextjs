import { Skeleton } from "@/components/ui/skeleton";

export function UserSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(1)].map((_, i) => (
        <Skeleton key={i} className="h-3 w-full bg-red-500 rounded-md" />
      ))}
    </div>
  );
}
