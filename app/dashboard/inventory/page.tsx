import { requireRole } from "@/lib/permissions";
export default async function InventoryPage() {
  await requireRole("ADMIN");
  return (
    <h1 className="text-xl font-semibold">
      Inventory Management (coming soon)
    </h1>
  );
}
