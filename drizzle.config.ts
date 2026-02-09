import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

// Ép dotenv đọc file .env ở thư mục gốc
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log(
  "DB URL Check:",
  process.env.DATABASE_URL ? "Đã thấy URL" : "Vẫn chưa thấy URL",
);

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
url: process.env.DATABASE_URL! }  
});
