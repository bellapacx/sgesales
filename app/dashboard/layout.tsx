import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SidebarLink from "./SidebarLink";
import TopNavbar from "./TopNavbar"; // ← now a client component

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const role = session.user.role;

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary)] transition-colors">
      {/* 🧭 Sidebar (desktop) */}
      <aside
        className="hidden md:flex w-64 flex-col border-r border-[var(--color-border-light)] 
        dark:border-[var(--color-border-dark)] bg-[var(--color-surface-contrast)] 
        dark:bg-[var(--color-surface-deep)] shadow-[0_1px_8px_rgba(0,0,0,0.05)] 
        dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300"
      >
        <div className="h-14 flex items-center justify-center border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] font-semibold text-lg tracking-tight text-[var(--color-text-primary)]">
          SoftDrink Admin
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm text-gray-700">
          {role === "ADMIN" ? (
            <>
              <SidebarLink href="/dashboard" label="Overview" />
              <SidebarLink href="/dashboard/reports" label="Sales Report" />
              <SidebarLink href="/dashboard/inventory" label="Inventory" />
              <SidebarLink href="/dashboard/users" label="Manage Users" />
            </>
          ) : (
            <SidebarLink href="/dashboard/sales" label="Sales Form" />
          )}
        </nav>
      </aside>

      {/* 📱 Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Client navbar for interactivity */}
        <TopNavbar
          user={{
            name: session.user.name ?? "User",
            role: session.user.role,
          }}
          role={role}
        />

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
