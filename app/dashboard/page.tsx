import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ChartBar,
  Wallet,
  PiggyBank,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");
  if (session.user.role !== "ADMIN") redirect("/dashboard/sales");

  // 🧠 Fetch aggregate data
  const [totals, userCount, productCount, recentSales] = await Promise.all([
    prisma.sale.aggregate({
      _sum: {
        totalSales: true,
        cashReceived: true,
        cashDeposited: true,
        difference: true,
      },
      _count: true,
    }),
    prisma.user.count({ where: { role: "SALESPERSON" } }),
    prisma.product.count(),
    prisma.sale.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: {
        salesPerson: { select: { name: true } },
      },
    }),
  ]);

  const sum = totals._sum;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 space-y-8 transition-colors">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {session.user.name} 👋
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Sales"
          value={`${sum.totalSales?.toFixed(2) || 0} ETB`}
          icon={<ChartBar className="w-5 h-5 text-blue-500" />}
        />
        <SummaryCard
          title="Cash Received"
          value={`${sum.cashReceived?.toFixed(2) || 0} ETB`}
          icon={<Wallet className="w-5 h-5 text-green-500" />}
        />
        <SummaryCard
          title="Cash Deposited"
          value={`${sum.cashDeposited?.toFixed(2) || 0} ETB`}
          icon={<PiggyBank className="w-5 h-5 text-indigo-500" />}
        />
        <SummaryCard
          title="Difference"
          value={`${sum.difference?.toFixed(2) || 0} ETB`}
          icon={<DollarSign className="w-5 h-5 text-amber-500" />}
        />
        <SummaryCard
          title="Salespersons"
          value={userCount}
          icon={<Users className="w-5 h-5 text-purple-500" />}
        />
        <SummaryCard
          title="Products"
          value={productCount}
          icon={<Package className="w-5 h-5 text-pink-500" />}
        />
      </div>

      {/* Recent Sales Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 shadow-md backdrop-blur p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ChartBar className="w-4 h-4 text-blue-500" /> Recent Sales
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Salesperson</th>
                <th className="px-4 py-3 text-left font-medium">
                  Plate Number
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Total Sales (ETB)
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Difference (ETB)
                </th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    {sale.date.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{sale.salesPerson.name}</td>
                  <td className="px-4 py-3">{sale.plateNumber}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {sale.totalSales.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      sale.difference < 0
                        ? "text-red-500"
                        : sale.difference > 0
                        ? "text-emerald-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {sale.difference.toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentSales.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No recent sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable SummaryCard Component */
function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
        {value}
      </p>
    </div>
  );
}
