import nextEnv from "@next/env";
import { Types } from "mongoose";
import { connectDatabase } from "../src/lib/db/connection.ts";
import { hashPassword } from "../src/lib/auth/password.ts";
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
let connection;
try {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !password || password.length < 16 || password.length > 256) throw new Error("Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD (16–256 characters) locally.");
  connection = await connectDatabase();
  // Create only declared indexes; never drop records/indexes or reset an admin.
  const indexes = [
    ["admins", { email: 1 }, { unique: true }],
    ["adminSessions", { expiresAt: 1 }, { expireAfterSeconds: 0 }],
    ["adminLoginAttempts", { expiresAt: 1 }, { expireAfterSeconds: 0 }],
    ["menuItems", { seedKey: 1 }, { unique: true, sparse: true }],
    ["menuItems", { isArchived: 1, category: 1, name: 1 }, {}],
    ["branches", { seedKey: 1 }, { unique: true, sparse: true }],
    ["branches", { isArchived: 1, isActive: 1, city: 1, name: 1 }, {}],
    ["blogPosts", { slug: 1 }, { unique: true }],
    ["blogPosts", { seedKey: 1 }, { unique: true, sparse: true }],
    ["blogPosts", { status: 1, publishedDate: -1 }, {}],
    ["inquiries", { email: 1, createdAt: -1 }, {}],
    ["inquiries", { status: 1, createdAt: -1 }, {}],
  ];
  for (const [name, keys, options] of indexes) await connection.collection(name).createIndex(keys, options);
  const admins = connection.collection("admins");
  if (await admins.findOne({ email }, { projection: { _id: 1 } })) console.log("Existing admin preserved; password was not changed.");
  else {
    const now = new Date();
    await admins.updateOne({ email }, { $setOnInsert: { _id: new Types.ObjectId(), email, passwordHash: await hashPassword(password), isActive: true, createdAt: now, updatedAt: now } }, { upsert: true });
    console.log("Admin account created with a hashed password.");
  }
  console.log("Admin setup and indexes ready. No credentials are printed.");
} catch { console.error("Admin setup failed. Supply valid local seed credentials and check MongoDB write/index permissions or duplicate keys. No credentials are printed; existing records are preserved."); process.exitCode = 1; }
finally { await connection?.close(); }
