"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { getSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductEntry {
  id: number;
  productCode: string;
  productName: string;
  received: number;
  sold: number;
  productReturned: number;
  emptyReturned: number;
  price: number;
  totalSales: number;
}

interface Sale {
  id: number;
  date: string;
  salesPerson: {
    name: string;
    username: string;
  };
  plateNumber: {
    id: number;
    plate: string;
    createdAt: string;
  } | null; // can be null if no plate selected
  cashReceived: number;
  cashDeposited: number;
  totalSales: number;
  difference: number;
  products: ProductEntry[];
}

export default function ReportPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const session = await getSession();
        if (!session?.user || session.user.role !== "ADMIN") {
          alert("Access denied — Admins only!");
          return;
        }

        const res = await fetch("/api/sales");
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error("Error loading sales:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading sales reports...
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <Card className="shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Sales Reports Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-left">
                  #
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-left">
                  Salesperson
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-left">
                  Plate No.
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-left">
                  Date
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-right">
                  Total Sales (ETB)
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-right">
                  Cash Received
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-right">
                  Cash Deposited
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-right">
                  Difference
                </th>
                <th className="border-b border-gray-300 dark:border-gray-600 p-3 text-center">
                  Details
                </th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale, i) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-center text-gray-700 dark:text-gray-300">
                    {i + 1}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200">
                    {sale.salesPerson.name}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200">
                    {sale.plateNumber?.plate || "N/A"}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-gray-600 dark:text-gray-300">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-right font-medium text-gray-900 dark:text-gray-100">
                    {sale.totalSales.toFixed(2)}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-right text-gray-700 dark:text-gray-300">
                    {sale.cashReceived.toFixed(2)}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-right text-gray-700 dark:text-gray-300">
                    {sale.cashDeposited.toFixed(2)}
                  </td>
                  <td
                    className={`border-b border-gray-200 dark:border-gray-700 p-3 text-right font-semibold ${
                      sale.difference < 0
                        ? "text-red-500"
                        : sale.difference > 0
                        ? "text-emerald-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {sale.difference.toFixed(2)}
                  </td>
                  <td className="border-b border-gray-200 dark:border-gray-700 p-3 text-center">
                    <SaleDetails sale={sale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ Expandable Product Details
function SaleDetails({ sale }: { sale: Sale }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <Button
        variant={open ? "default" : "outline"}
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs"
      >
        {open ? "Hide" : "View"}
      </Button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full mt-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-inner overflow-hidden"
          >
            <table className="w-full text-xs">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Sold</th>
                  <th className="p-2 text-right">Returned</th>
                  <th className="p-2 text-right">Empty</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {p.productName}
                    </td>
                    <td className="p-2 text-right text-gray-700 dark:text-gray-300">
                      {p.price.toFixed(2)}
                    </td>
                    <td className="p-2 text-right text-gray-700 dark:text-gray-300">
                      {p.sold}
                    </td>
                    <td className="p-2 text-right text-gray-700 dark:text-gray-300">
                      {p.productReturned}
                    </td>
                    <td className="p-2 text-right text-gray-700 dark:text-gray-300">
                      {p.emptyReturned}
                    </td>
                    <td className="p-2 text-right font-medium text-gray-900 dark:text-gray-100">
                      {p.totalSales.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
