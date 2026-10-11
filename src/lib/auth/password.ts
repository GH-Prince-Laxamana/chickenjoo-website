import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const parameters = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => scrypt(password, salt, 64, parameters, (error, key) => error ? reject(error) : resolve(key)));
}
export async function hashPassword(password: string) {
  if (password.length < 16 || password.length > 256) throw new Error("Use a password between 16 and 256 characters.");
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1:${salt}:${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password: string, hash: string) {
  if (typeof password !== "string" || password.length > 256 || !/^scrypt-v1:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash)) return false;
  const [, salt, key] = hash.split(":");
  return timingSafeEqual(await derive(password, salt), Buffer.from(key, "hex"));
}
