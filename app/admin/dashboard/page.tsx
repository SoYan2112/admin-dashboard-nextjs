import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { count } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"; 
import ActivityTimeline from "@/components/users/ActivityTimeline";

export default async function DashboardPage() {

  const [result] = await db.select({ value: count()}).from(users);
  const totalUsers = result.value;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalUsers} </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">58</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revuene</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">2,430</CardContent>
        </Card>
        <ActivityTimeline />
      </div>
    </div>
  );
}
