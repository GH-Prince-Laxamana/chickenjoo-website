export function isLocalMenuImage(value: string): boolean {
  return /^\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|avif)$/i.test(value);
}
