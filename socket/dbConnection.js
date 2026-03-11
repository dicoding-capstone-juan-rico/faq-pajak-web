import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

export const dbCon = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});