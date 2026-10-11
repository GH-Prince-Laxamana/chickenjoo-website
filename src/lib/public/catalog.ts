import "server-only";
import { connectDatabase } from "@/lib/db";
import { getCatalogModels } from "@/lib/models/catalog";
import { escapeSearchText, listMeta, type PublicListQuery } from "./query";
import type { PublicBranch, PublicList, PublicMenuItem } from "./types";
import { isMapsLink, isFacebookLink } from "./links";

export async function getPublicMenu(query: PublicListQuery): Promise<PublicList<PublicMenuItem>> {
  const { menuItems } = getCatalogModels(await connectDatabase());
  const visible = { isArchived: false };
  const filter = {
    ...visible,
    ...(query.filter ? { category: query.filter } : {}),
    ...(query.q ? { $or: ["name", "description"].map((key) => ({ [key]: { $regex: escapeSearchText(query.q), $options: "i" } })) } : {}),
  };

  const [records, total, categories] = await Promise.all([
    menuItems.find(filter).select("name description category priceCentavos image isAvailable isFeatured flavorOptions requiredFlavorCount")
      .sort({ name: 1, _id: 1 }).skip((query.page - 1) * query.limit).limit(query.limit).maxTimeMS(5000).lean().exec(),
    menuItems.countDocuments(filter).maxTimeMS(5000).exec(),
    menuItems.aggregate<{ _id: string }>([
      { $match: visible }, { $group: { _id: "$category" } }, { $sort: { _id: 1 } }, { $limit: 100 },
    ]).option({ maxTimeMS: 5000 }).exec(),
  ]);

  return {
    data: records.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      priceCentavos: item.priceCentavos,
      image: item.image || null,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      flavorOptions: item.flavorOptions ?? [],
      requiredFlavorCount: item.requiredFlavorCount ?? 0,
    })),
    meta: listMeta(query, total),
    options: categories.map((value) => value._id).filter((value): value is string => typeof value === "string" && value.length > 0),
  };
}

export async function getPublicBranches(query: PublicListQuery): Promise<PublicList<PublicBranch>> {
  const { branches } = getCatalogModels(await connectDatabase());
  const visible = { isArchived: false, isActive: true };
  const filter = {
    ...visible,
    ...(query.filter ? { city: query.filter } : {}),
    ...(query.q ? { $or: ["name", "address", "city"].map((key) => ({ [key]: { $regex: escapeSearchText(query.q), $options: "i" } })) } : {}),
  };

  const [records, total, cities] = await Promise.all([
    branches.find(filter).select("name address city province businessHours phone email mapsUrl facebookUrl")
      .sort({ city: 1, name: 1, _id: 1 }).skip((query.page - 1) * query.limit).limit(query.limit).maxTimeMS(5000).lean().exec(),
    branches.countDocuments(filter).maxTimeMS(5000).exec(),
    branches.aggregate<{ _id: string }>([
      { $match: visible }, { $group: { _id: "$city" } }, { $sort: { _id: 1 } }, { $limit: 100 },
    ]).option({ maxTimeMS: 5000 }).exec(),
  ]);

  return {
    data: records.map((branch) => ({
      id: branch._id.toString(),
      name: branch.name,
      address: branch.address,
      city: branch.city,
      province: branch.province || null,
      businessHours: branch.businessHours || null,
      phone: branch.phone || null,
      email: branch.email || null,
      directionsUrl: branch.mapsUrl && isMapsLink(branch.mapsUrl) ? branch.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name}, ${branch.address}, ${branch.city}, ${branch.province || ""}`)}`,
      facebookUrl: branch.facebookUrl && isFacebookLink(branch.facebookUrl) ? branch.facebookUrl : null,
    })),
    meta: listMeta(query, total),
    options: cities.map((value) => value._id).filter((value): value is string => typeof value === "string" && value.length > 0),
  };
}
