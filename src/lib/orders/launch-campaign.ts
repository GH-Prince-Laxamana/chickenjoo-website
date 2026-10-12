export const launchCampaign = {
  id: "website-launch-2026",
  slug: "website-launch-25-off",
  name: "Website launch (25% off)",
  startsAt: Date.parse("2026-09-15T00:00:00+08:00"),
  endsAt: Date.parse("2026-10-16T00:00:00+08:00"),
};
export function isLaunchCampaignActive(now = Date.now()) {
  return now >= launchCampaign.startsAt && now < launchCampaign.endsAt;
}
export function isLaunchCampaignEnded(now = Date.now()) {
  return now >= launchCampaign.endsAt;
}
export function launchPromotion(subtotalCentavos: number, now = Date.now()) {
  return isLaunchCampaignActive(now)
    ? { id: launchCampaign.id, name: launchCampaign.name, discountCentavos: Math.round(subtotalCentavos / 4) }
    : undefined;
}
