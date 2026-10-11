import "server-only";
import { Schema, type InferSchemaType, type Connection, type Model } from "mongoose";
import { isLocalMenuImage } from "@/lib/public/assets";
import { isMapsLink, isFacebookLink } from "@/lib/public/links";

const menuItemSchema = new Schema({
  seedKey: { type: String, trim: true, maxlength: 80 },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  priceCentavos: { type: Number, required: true, min: 0, max: 100_000_000, validate: Number.isSafeInteger },
  image: {
    type: String, trim: true, default: "", maxlength: 300,
    // Supplied local assets only for now; no arbitrary remote image fetching.
    validate: (value: string) => value === "" || isLocalMenuImage(value),
  },
  isAvailable: { type: Boolean, default: true, required: true },
  isArchived: { type: Boolean, default: false, required: true },
  isFeatured: { type: Boolean, default: false, required: true },
  flavorOptions: { type: [String], default: [], validate: (values: string[]) => values.length <= 20 && values.every((value) => value.trim().length > 0 && value.length <= 80) },
  requiredFlavorCount: {
    type: Number, enum: [0, 1, 2], default: 0, required: true,
    validate: function(this: { flavorOptions: string[] }, value: number) {
      return value === 0 ? this.flavorOptions.length === 0 : this.flavorOptions.length >= value;
    },
  },
}, { timestamps: true, collection: "menuItems", autoCreate: false, autoIndex: false });

menuItemSchema.index({ isArchived: 1, category: 1, name: 1 });
menuItemSchema.index({ seedKey: 1 }, { unique: true, sparse: true });

const branchSchema = new Schema({
  seedKey: { type: String, trim: true, maxlength: 80 },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  province: { type: String, trim: true, default: "", maxlength: 80 },
  businessHours: { type: String, trim: true, default: "", maxlength: 500 },
  openingTime: { type: String, default: null, match: /^(?:[01]\d|2[0-3]):[0-5]\d$/ },
  closingTime: { type: String, default: null, match: /^(?:[01]\d|2[0-3]):[0-5]\d$/ },
  closesNextDay: { type: Boolean, default: false },
  phone: { type: String, trim: true, default: null, maxlength: 60, match: /^[+\d\s().-]*$/ },
  email: { type: String, trim: true, lowercase: true, default: null, maxlength: 254, match: /^(?:|[^\s@]+@[^\s@]+\.[^\s@]+)$/ },
  mapsUrl: { type: String, default: null, maxlength: 1000, validate: (value: string | null) => !value || isMapsLink(value) },
  facebookUrl: { type: String, default: null, maxlength: 1000, validate: (value: string | null) => !value || isFacebookLink(value) },
  isActive: { type: Boolean, default: true, required: true },
  isArchived: { type: Boolean, default: false, required: true },
}, { timestamps: true, collection: "branches", autoCreate: false, autoIndex: false });

branchSchema.index({ isArchived: 1, isActive: 1, city: 1, name: 1 });
branchSchema.index({ seedKey: 1 }, { unique: true, sparse: true });

export type MenuItemRecord = InferSchemaType<typeof menuItemSchema>;
export type BranchRecord = InferSchemaType<typeof branchSchema>;

export function getCatalogModels(connection: Connection) {
  return {
    menuItems: (connection.models.MenuItem as Model<MenuItemRecord> | undefined)
      ?? connection.model<MenuItemRecord>("MenuItem", menuItemSchema),
    branches: (connection.models.Branch as Model<BranchRecord> | undefined)
      ?? connection.model<BranchRecord>("Branch", branchSchema),
  };
}
