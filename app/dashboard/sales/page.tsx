"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { getSession } from "next-auth/react";
import { Loader2 } from "lucide-react"; // ✅ spinner icon

interface Product {
  productCode: string;
  productName: string;
  price: number;
}

interface SalesPerson {
  id: number;
  name: string;
  username: string;
  plateNumber?: string;
}

interface ProductEntry {
  productCode: string;
  productName: string;
  price: number;
  received: number;
  sold: number;
  productReturned: number;
  emptyReturned: number;
}

export default function SalesFormPage() {
  const router = useRouter();
  const [salesPerson, setSalesPerson] = useState<SalesPerson | null>(null);
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cashDeposited, setCashDeposited] = useState<number>(0);
  const [loading, setLoading] = useState(false); // ✅ loading state for submission

  const difference = cashReceived - cashDeposited;

  useEffect(() => {
    async function fetchData() {
      try {
        const session = await getSession();
        if (!session?.user) return;

        const userRes = await fetch(`/api/users/${session.user.username}`);
        const userData = await userRes.json();
        setSalesPerson(userData);

        const prodRes = await fetch("/api/products");
        const productsData: Product[] = await prodRes.json();

        const productEntries = productsData.map((p) => ({
          productCode: p.productCode,
          productName: p.productName,
          price: p.price,
          received: 0,
          sold: 0,
          productReturned: 0,
          emptyReturned: 0,
        }));
        setProducts(productEntries);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (
    index: number,
    field: keyof ProductEntry,
    value: number
  ) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const totalSalesPerProduct = products.map(
    (p) => (p.sold || 0) * (p.price || 0)
  );
  const grandTotal = totalSalesPerProduct.reduce((a, b) => a + b, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesPerson) return alert("User session not found.");
    setLoading(true); // ✅ start loading

    const body = {
      date: new Date().toISOString(),
      salesPerson: salesPerson.username,
      plateNumber: salesPerson.plateNumber,
      products,
      cashReceived,
      cashDeposited,
      difference,
    };

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Sale submitted successfully!");
        router.refresh();
      } else {
        alert("❌ Error submitting sale");
      }
    } catch (err) {
      alert("⚠️ Network error submitting sale");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  if (!salesPerson) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full p-2 sm:p-2 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="w-full max-w-5xl shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-base sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            🧃 Soft Drink Sales Form
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Salesperson Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/60 shadow-inner">
              <div className="flex flex-col gap-1">
                <Label className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100">
                  Salesperson
                </Label>
                <div className="h-10 flex items-center px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 text-sm">
                  {salesPerson.name || "—"}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100">
                  Plate No.
                </Label>
                <div className="h-10 flex items-center px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 text-sm">
                  {salesPerson.plateNumber || "—"}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
              <table className="w-full text-[11px] sm:text-sm border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="border p-1 sm:p-2 text-center dark:border-gray-600">
                      #
                    </th>
                    <th className="border p-1 sm:p-2 text-left dark:border-gray-600">
                      Product
                    </th>
                    <th className="border p-1 sm:p-2 text-center dark:border-gray-600">
                      Rec.
                    </th>
                    <th className="border p-1 sm:p-2 text-center dark:border-gray-600">
                      Sold
                    </th>
                    <th className="border p-1 sm:p-2 text-center dark:border-gray-600">
                      P.Ret
                    </th>
                    <th className="border p-1 sm:p-2 text-center dark:border-gray-600">
                      E.Ret
                    </th>
                    <th className="border p-1 sm:p-2 text-right dark:border-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="border p-1 sm:p-2 text-center font-medium dark:border-gray-600">
                        {i + 1}
                      </td>
                      <td className="border p-1 sm:p-2 text-left dark:border-gray-600">
                        {p.productName}
                      </td>

                      {[
                        "received",
                        "sold",
                        "productReturned",
                        "emptyReturned",
                      ].map((field) => (
                        <td
                          key={field}
                          className="border p-1 sm:p-2 text-center dark:border-gray-600"
                        >
                          <Input
                            type="number"
                            value={p[field as keyof ProductEntry]}
                            onChange={(e) =>
                              handleChange(
                                i,
                                field as keyof ProductEntry,
                                Number(e.target.value)
                              )
                            }
                            className="w-10 sm:w-16 text-[11px] text-center dark:bg-gray-700 dark:text-gray-100"
                            disabled={loading}
                          />
                        </td>
                      ))}

                      <td className="border p-1 sm:p-2 text-right font-semibold dark:border-gray-600 dark:text-gray-100">
                        {(p.sold * p.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-700 font-semibold text-[11px] sm:text-sm">
                    <td
                      colSpan={6}
                      className="border p-1 sm:p-2 text-right dark:border-gray-600 dark:text-gray-200"
                    >
                      Total Sales (ETB)
                    </td>
                    <td className="border p-1 sm:p-2 text-right dark:border-gray-600 dark:text-gray-100">
                      {grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Cash Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
              <div>
                <Label className="text-xs sm:text-sm dark:text-gray-200">
                  Cash Received
                </Label>
                <Input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-xs sm:text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm dark:text-gray-200">
                  Cash Deposited
                </Label>
                <Input
                  type="number"
                  value={cashDeposited}
                  onChange={(e) => setCashDeposited(Number(e.target.value))}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-xs sm:text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm dark:text-gray-200">
                  Difference
                </Label>
                <Input
                  type="number"
                  value={difference}
                  disabled
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3 sm:pt-4">
              <Button
                type="submit"
                className="px-4 py-1.5 sm:px-6 sm:py-2 font-medium text-xs sm:text-sm dark:bg-mint-500 dark:hover:bg-mint-600 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Sale"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
