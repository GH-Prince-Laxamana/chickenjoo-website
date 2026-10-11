export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Calendar dates retain the supplied day without inventing publication times.
export function isPublicationDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

export const inquiryLimits = { name: 100, email: 254, subject: 160, message: 5000 } as const;
export type InquiryField = keyof typeof inquiryLimits;
export type InquiryFields = Record<InquiryField, string>;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export function validateInquiry(input: unknown): { data?: InquiryFields; errors: InquiryErrors } {
  const record = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const errors: InquiryErrors = {};
  const data = {} as InquiryFields;
  for (const field of Object.keys(inquiryLimits) as InquiryField[]) {
    const value = typeof record[field] === "string" ? record[field].trim() : "";
    data[field] = field === "email" ? value.toLowerCase() : value;
    if (!value) errors[field] = `Enter your ${field === "email" ? "email address" : field}.`;
    else if (value.length > inquiryLimits[field]) errors[field] = `Use ${inquiryLimits[field]} characters or fewer.`;
    else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = "Enter a valid email address.";
    else if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors[field] = "Remove unsupported control characters.";
  }
  return { data: Object.keys(errors).length ? undefined : data, errors };
}
