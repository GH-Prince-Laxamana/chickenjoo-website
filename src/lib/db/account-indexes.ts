import type { Connection } from "mongoose";
const pending = new WeakMap<Connection, Promise<void>>();
export function ensureAccountIndexes(connection: Connection) {
  let operation = pending.get(connection);
  if (!operation) {
    operation = (async () => {
      await connection.collection("users").createIndex({ email: 1 }, { unique: true });
      await connection.collection("admins").createIndex({ email: 1 }, { unique: true });
      await connection.collection("orders").createIndex({ userId: 1, createdAt: -1 });
      for (const name of ["userSessions", "authAttempts"]) {
        await connection.collection(name).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      }
      // The order insert is the redemption: no separate claim can be lost or double-used.
      await connection.collection("orders").createIndex({ userId: 1, "quote.promotion.id": 1 }, {
        name: "one_voucher_per_user", unique: true,
        partialFilterExpression: { userId: { $type: "objectId" }, "quote.promotion.id": { $type: "string" } },
      });
    })().catch(error => { pending.delete(connection); throw error; });
    pending.set(connection, operation);
  }
  return operation;
}
