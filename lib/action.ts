"use server";

import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createLogAction(action: string, entity: string, targetName: string, details: string) {
  let isSuccess = false; // Biến đánh dấu
  
  try {
    await db.insert(activityLogs).values({
      actorId: 1, 
      action,
      entity,
      targetName,
      details,
    });
    isSuccess = true; // Ghi log thành công vào DB
  } catch (error) {
    console.error("Database Log Error:", error);
    return { success: false };
  }

  if (isSuccess) {
    revalidatePath("/", "layout");

    // revalidatePath("/admin/dashboard");
    // revalidatePath("/admin/users");
    return { success: true };
  }
}

export async function getLogsAction() {
  unstable_noStore();
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
