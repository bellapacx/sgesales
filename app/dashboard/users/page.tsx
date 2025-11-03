import { requireRole } from "@/lib/permissions";
import CreateUserForm from "@/app/components/users/CreateUserForm";
import { prisma } from "@/lib/db";
import { Toaster } from "../../components/ui/toaster";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default async function UsersPage() {
  // ✅ Restrict access to admins only
  await requireRole("ADMIN");

  // ✅ Fetch users (exclude admin for simplicity)
  const users = await prisma.user.findMany({
    where: { role: "SALESPERSON" },
    select: { id: true, username: true, name: true, role: true },
    orderBy: { id: "asc" },
  });

  return (
    <div className="p-8 space-y-8">
      {/* Global toaster */}
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Admin — Manage Salespersons
        </h1>
      </div>

      {/* Create Salesperson Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Create Salesperson</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      {/* Existing Users Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Existing Salespersons</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-500">No salespersons found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="py-2 px-4 text-left font-medium">
                      Username
                    </th>
                    <th className="py-2 px-4 text-left font-medium">Name</th>
                    <th className="py-2 px-4 text-left font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-4">{u.username}</td>
                      <td className="py-2 px-4">{u.name}</td>
                      <td className="py-2 px-4 capitalize text-gray-700">
                        {u.role.toLowerCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
