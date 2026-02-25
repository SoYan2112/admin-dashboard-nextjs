"use server";

import { db } from "@/lib/db"
import { activityLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function createLogAction(action: string, entity: string, targetName: string, details: string) {
  try {
    await db.insert(activityLogs).values({
      actorId: 1, 
      action,
      entity,
      targetName,
      details,
    });
    return { success: true };
  } catch (error) {
    console.error("Database Log Error:", error);
    return { success: false };
  }
}

export async function getLogsAction() {
  try {
    const logs = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(10);
    return logs;
  } catch (error) {
    console.error("Lỗi lấy logs:", error);
    return [];
  }
}
