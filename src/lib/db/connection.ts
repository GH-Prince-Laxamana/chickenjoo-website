import mongoose, { type Connection } from "mongoose";

type ConnectionCache = {
  connection: Connection | null;
  pending: Promise<Connection> | null;
};

const databaseGlobal = globalThis as typeof globalThis & {
  chickenJooDatabase?: ConnectionCache;
};

// Persist across development hot reloads and share concurrent connection attempts.
const cache = (databaseGlobal.chickenJooDatabase ??= {
  connection: null,
  pending: null,
});

export class DatabaseConfigurationError extends Error {}

export function getDatabaseConfig() {
  const uri = process.env.MONGODB_URI?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim();

  if (!uri || !dbName) {
    throw new DatabaseConfigurationError(
      "Set MONGODB_URI and MONGODB_DB_NAME in your ignored environment file.",
    );
  }

  if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new DatabaseConfigurationError("MONGODB_URI must be a MongoDB connection URI.");
  }

  if (/<[^>]+>/.test(uri)) {
    throw new DatabaseConfigurationError("Replace placeholders in MONGODB_URI locally before connecting.");
  }

  return { uri, dbName };
}

// Application code imports the server-only facade in ../db.ts.
// This core module is also used by the local smoke-check command.
export async function connectDatabase(): Promise<Connection> {
  const { uri, dbName } = getDatabaseConfig();

  if (cache.connection?.readyState === 1) return cache.connection;
  if (cache.pending) return cache.pending;

  cache.pending = (async () => {
    let connection: Connection | undefined;
    try {
      connection = mongoose.createConnection(uri, {
        dbName,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10_000,
        bufferCommands: false,
        autoIndex: process.env.NODE_ENV !== "production",
      });
      await connection.asPromise();
      cache.connection = connection;
      return connection;
    } catch {
      await connection?.close().catch(() => undefined);
      // Driver error messages may contain credentials or connection details.
      throw new Error(
        "MongoDB connection failed. Check credentials, database permissions, network access, and the connection URI locally.",
      );
    } finally {
      cache.pending = null;
    }
  })();

  return cache.pending;
}
