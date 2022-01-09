import { PrismaClient } from "@prisma/client";

let db: PrismaClient

declare global {
  var _db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
  db.$connect()
} else {
  if(!global._db) {
    global._db = new PrismaClient()
    global._db.$connect()
  }

  db = global._db
}

export { db }