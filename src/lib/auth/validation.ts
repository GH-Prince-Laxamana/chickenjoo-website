export class AuthError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(message: string, status = 400, fields?: Record<string, string>) { super(message); this.status = status; this.fields = fields; }
}
export function credentials(input: Record<string, unknown>, registration = false) {
  const allowed = registration ? ["name", "email", "password"] : ["email", "password"];
  if (Object.keys(input).some(key => !allowed.includes(key))) throw new AuthError("Unexpected account fields.");
  const fields: Record<string, string> = {};
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (email.length > 254 || /[\x00-\x1f\x7f]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = "Enter a valid email address.";
  if (!password || password.length > 256 || (registration && password.length < 16)) fields.password = registration ? "Use a password between 16 and 256 characters." : "Enter your password.";
  if (registration && (!name || name.length > 100 || /[\x00-\x1f\x7f]/.test(name))) fields.name = "Enter your name (up to 100 characters).";
  if (Object.keys(fields).length) throw new AuthError("Check your account details.", 400, fields);
  return { name, email, password };
}
export function safeReturnTo(value: unknown) {
  if (typeof value !== "string") return "/menu";
  // An allowlist prevents open redirects and admin redirects from customer auth.
  return /^\/(menu|cart|checkout|confirmation|account)(?:\?[^#\\\s]*)?(?:#dish-[a-f0-9]{24})?$/.test(value) ? value : "/menu";
}
