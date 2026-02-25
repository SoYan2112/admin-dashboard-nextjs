import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(), 
  entity: text("entity").notNull(), 
  targetName: text("target_name"),
  details: text("details"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
