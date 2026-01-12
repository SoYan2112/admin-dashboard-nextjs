import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">120 </CardContent>
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
      </div>
    </div>
  );
}
