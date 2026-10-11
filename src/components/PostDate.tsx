export default function PostDate({ value }: { value: string }) {
  const date = new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  return <time dateTime={value}>{date}</time>;
}
