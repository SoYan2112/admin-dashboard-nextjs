import { getLogsAction } from "@/lib/action";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ActivityTimeline() {
  const logs = await getLogsAction();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Activity Feed</h2>
      <div className="border rounded-lg divide-y bg-white overflow-hidden">
        {logs.length === 0 && (
          <p className="p-4 text-gray-500 italic">No activity yet.</p>
        )}

        {logs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              {/* LOGIC ĐỔI MÀU Ở ĐÂY */}
              <p
                className={`font-bold uppercase text-[10px] tracking-widest px-2 py-0.5 rounded border ${
                  log.action === "DELETE"
                    ? "text-red-600 bg-red-50 border-red-100"
                    : log.action === "UPDATE"
                      ? "text-blue-600 bg-blue-50 border-blue-100"
                      : "text-green-600 bg-green-50 border-green-100" // Cho trường hợp CREATE
                }`}
              >
                {log.action}
              </p>

              <p className="text-[11px] text-gray-400">
                {formatDistanceToNow(new Date(log.createdAt!), {
                  addSuffix: true,
                })}
              </p>
            </div>

            <p className="text-sm mt-2 text-slate-700 font-medium">
              {log.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
