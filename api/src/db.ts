import { PrismaClient } from "@prisma/client";

// A single shared Prisma Client instance for the whole app - this is the
// recommended pattern to avoid exhausting the Postgres connection pool with
// a new client per request.
export const prisma = new PrismaClient();
