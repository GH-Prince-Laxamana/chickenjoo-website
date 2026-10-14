import { Schema, type Connection, type InferSchemaType, type Model } from "mongoose";

export const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  passwordHash: { type: String, required: true, select: false, match: /^scrypt-v1:[a-f0-9]{32}:[a-f0-9]{128}$/ },
  isActive: { type: Boolean, required: true, default: true },
}, { timestamps: true, collection: "users", autoCreate: false, autoIndex: false, strict: "throw" });
userSchema.index({ email: 1 }, { unique: true });
type UserRecord = InferSchemaType<typeof userSchema>;
export function getUserModel(connection: Connection) {
  return (connection.models.User as Model<UserRecord> | undefined) ?? connection.model<UserRecord>("User", userSchema);
}
