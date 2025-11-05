import { requireRole } from "@/lib/permissions";
import CreateUserForm from "@/app/components/users/CreateUserForm";
import { prisma } from "@/lib/db";
import { Toaster } from "../../components/ui/toaster";
import DeleteUserButton from "../../components/users/DeleteUserButton"; // ✅ add this line

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default async function UsersPage() {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    where: { role: "SALESPERSON" },
    select: { id: true, username: true, name: true, role: true },
    orderBy: { id: "asc" },
  });

  return (
    <div className="p-8 space-y-8">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Admin — Manage Salespersons
        </h1>
      </div>

      {/* Create Salesperson Section */}
      <Card className="shadow-sm">
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
                    <th className="py-2 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b transition-colors">
                      <td className="py-2 px-4">{u.username}</td>
                      <td className="py-2 px-4">{u.name}</td>
                      <td className="py-2 px-4 capitalize text-gray-700">
                        {u.role.toLowerCase()}
                      </td>
                      <td className="py-2 px-4">
                        <DeleteUserButton username={u.username} />{" "}
                        {/* ✅ new delete button */}
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
