import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { connectDatabase } from "@/lib/db";
import { cookieOptions, tokenHash } from "./session";
import { AuthError } from "./validation";
export const userCookie = process.env.NODE_ENV === "production" ? "__Host-cj-user" : "cj-user";
const seconds = 8 * 60 * 60;
export type UserIdentity = { id: string; name: string; email: string };
type UserSession = { _id: string; userId: Types.ObjectId; createdAt: Date; expiresAt: Date };
export async function getUser(): Promise<UserIdentity | null> {
  const token = (await cookies()).get(userCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const connection = await connectDatabase();
  const session = await connection.db!.collection<UserSession>("userSessions").findOne({ _id: tokenHash(token), expiresAt: { $gt: new Date() } }, { maxTimeMS: 5000 });
  if (!session || !(session.userId instanceof Types.ObjectId)) return null;
  const user = await connection.collection("users").findOne({ _id: session.userId, isActive: true }, { projection: { name: 1, email: 1 }, maxTimeMS: 5000 });
  return user ? { id: user._id.toString(), name: String(user.name), email: String(user.email) } : null;
}
export async function requireUser() {
  const user = await getUser();
  if (!user) throw new AuthError("Sign in to continue with your order.", 401);
  return user;
}
export async function createUserSession(userId: Types.ObjectId) {
  const connection = await connectDatabase(), store = await cookies();
  const sessions = connection.db!.collection<UserSession>("userSessions");
  const previous = store.get(userCookie)?.value;
  if (previous && /^[a-f0-9]{64}$/.test(previous)) await sessions.deleteOne({ _id: tokenHash(previous) });
  const token = randomBytes(32).toString("hex");
  await sessions.insertOne({ _id: tokenHash(token), userId, createdAt: new Date(), expiresAt: new Date(Date.now() + seconds * 1000) });
  store.set(userCookie, token, { ...cookieOptions, maxAge: seconds });
}
export async function revokeUserSession() {
  const store = await cookies(), token = store.get(userCookie)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) await (await connectDatabase()).db!.collection<UserSession>("userSessions").deleteOne({ _id: tokenHash(token) });
  store.set(userCookie, "", { ...cookieOptions, maxAge: 0 });
}
