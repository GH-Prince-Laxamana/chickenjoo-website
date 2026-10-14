import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UserProvider from "@/components/auth/UserProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider><div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-xl bg-cj-navy px-5 py-3 font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </div></UserProvider>
  );
}
