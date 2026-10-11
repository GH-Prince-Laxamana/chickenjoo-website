import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { connectDatabase } from "@/lib/db";

export const sessionCookie = process.env.NODE_ENV === "production" ? "__Host-cj-admin" : "cj-admin";
export const sessionSeconds = 8 * 60 * 60;
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };
export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export type AdminIdentity = { id: string; email: string };
type SessionRecord = { _id: string; adminId: Types.ObjectId; createdAt: Date; expiresAt: Date };

export async function getAdmin(): Promise<AdminIdentity | null> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const connection = await connectDatabase();
  const session = await connection.db!.collection<SessionRecord>("adminSessions").findOne({ _id: tokenHash(token), expiresAt: { $gt: new Date() } }, { projection: { adminId: 1 }, maxTimeMS: 5000 });
  if (!session || !(session.adminId instanceof Types.ObjectId)) return null;
  const admin = await connection.collection("admins").findOne({ _id: session.adminId, isActive: true }, { projection: { email: 1 }, maxTimeMS: 5000 });
  return admin ? { id: admin._id.toString(), email: admin.email } : null;
}
export async function createSession(adminId: Types.ObjectId) {
  const connection = await connectDatabase();
  const store = await cookies();
  const old = store.get(sessionCookie)?.value;
  const sessions = connection.db!.collection<SessionRecord>("adminSessions");
  if (old && /^[a-f0-9]{64}$/.test(old)) await sessions.deleteOne({ _id: tokenHash(old) });
  const token = randomBytes(32).toString("hex");
  await sessions.insertOne({ _id: tokenHash(token), adminId, createdAt: new Date(), expiresAt: new Date(Date.now() + sessionSeconds * 1000) });
  store.set(sessionCookie, token, { ...cookieOptions, maxAge: sessionSeconds });
}
export async function revokeSession() {
  const store = await cookies();
  const token = store.get(sessionCookie)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) await (await connectDatabase()).db!.collection<SessionRecord>("adminSessions").deleteOne({ _id: tokenHash(token) });
  store.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
}
