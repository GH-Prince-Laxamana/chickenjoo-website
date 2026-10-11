function allowedHttpsLink(value: string, hosts: string[]): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.includes(url.hostname) && !url.username && !url.password && (!url.port || url.port === "443");
  } catch {
    return false;
  }
}

export function isMapsLink(value: string): boolean {
  return allowedHttpsLink(value, ["google.com", "www.google.com", "maps.google.com", "maps.app.goo.gl"]);
}

export function isFacebookLink(value: string): boolean {
  return allowedHttpsLink(value, ["facebook.com", "www.facebook.com", "m.facebook.com"]);
}
