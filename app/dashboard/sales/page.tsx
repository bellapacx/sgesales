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
import { Loader2 } from "lucide-react";

interface Product {
  productCode: string;
  productName: string;
  price: number;
}

interface SalesPerson {
  id: number;
  name: string;
  username: string;
}

interface PlateNumber {
  id: number;
  plate: string;
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
  const [plateNumbers, setPlateNumbers] = useState<PlateNumber[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<number | null>(null);
  const [saleDate, setSaleDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [cashDeposited, setCashDeposited] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Recalculate derived fields whenever products or cashDeposited change
  const grandTotal = products.reduce((sum, p) => sum + p.sold * p.price, 0);
  const cashReceived = grandTotal; // ✅ auto
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

        const plateRes = await fetch("/api/platenumbers");
        const plateData: PlateNumber[] = await plateRes.json();
        setPlateNumbers(plateData);
        if (plateData.length) setSelectedPlate(plateData[0].id);
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

    // Auto-calculated fields
    updated[index].emptyReturned = updated[index].sold; // 1️⃣
    updated[index].productReturned =
      updated[index].received - updated[index].sold; // 2️⃣

    setProducts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesPerson) return alert("User session not found.");
    if (!selectedPlate) return alert("Please select a plate number.");
    setLoading(true);

    const body = {
      date: saleDate,
      salesPerson: salesPerson.username,
      plateNumberId: selectedPlate,
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
      setLoading(false);
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
    <div className="flex justify-center w-full p-3 sm:p-4 transition-colors duration-500 bg-slate-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen">
      <Card className="w-full max-w-5xl shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg transition-all duration-500 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-700/30">
        {/* Header */}
        <CardHeader className="text-center pb-3 rounded-t-2xl bg-gradient-to-r from-teal-400 via-indigo-500 to-pink-500 dark:from-teal-600 dark:via-indigo-700 dark:to-pink-700 text-white shadow-sm">
          <CardTitle className="text-lg sm:text-2xl font-bold tracking-wide drop-shadow-md">
            🧃 Soft Drink Sales Form
          </CardTitle>
        </CardHeader>

        <CardContent className="bg-slate-700 p-6 sm:p-8 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Salesperson, Plate & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-teal-100 via-emerald-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow-inner transition-colors">
              {/* Salesperson */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Salesperson
                </Label>
                <div className="h-12 flex items-center px-4 rounded-xl bg-slate-700 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-white dark:text-gray-50 font-medium shadow-inner">
                  {salesPerson.username}
                </div>
              </div>

              {/* Plate Number */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Plate No.
                </Label>
                <select
                  value={selectedPlate || ""}
                  onChange={(e) => setSelectedPlate(Number(e.target.value))}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-slate-700 dark:from-gray-800 dark:to-gray-900 px-4 text-sm text-white dark:text-gray-50 shadow-inner focus:ring-2 focus:ring-teal-400 dark:focus:ring-indigo-500 transition-all"
                >
                  <option value="" disabled>
                    Select plate
                  </option>
                  {plateNumbers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.plate}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-black">Date</Label>
                <Input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="h-12 px-4 rounded-xl bg-slate-700 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="relative overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700 shadow-md">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead className="bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400 dark:from-teal-600 dark:via-indigo-700 dark:to-pink-700 text-white transition-all">
                  <tr>
                    {[
                      "Code",
                      "Product",
                      "Rec.",
                      "Sold",
                      "P.Ret",
                      "E.Ret",
                      "Total",
                    ].map((h) => (
                      <th key={h} className="border p-2 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={i}
                      className="transition-colors hover:bg-gradient-to-r hover:from-teal-50 hover:to-pink-50 dark:hover:from-gray-800 dark:hover:to-gray-900"
                    >
                      <td className="border p-2 text-center font-medium">
                        {p.productCode}
                      </td>
                      <td className="border p-2 text-left">{p.productName}</td>
                      {(["received", "sold"] as (keyof ProductEntry)[]).map(
                        (field) => (
                          <td key={field} className="border p-2 text-center">
                            <Input
                              type="number"
                              value={p[field]}
                              onChange={(e) =>
                                handleChange(i, field, Number(e.target.value))
                              }
                              className="w-12 sm:w-16 text-center rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400 dark:focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 transition-all"
                              disabled={loading}
                            />
                          </td>
                        )
                      )}
                      <td className="border p-2 text-center">
                        {p.productReturned}
                      </td>
                      <td className="border p-2 text-center">
                        {p.emptyReturned}
                      </td>
                      <td className="border p-2 text-right font-semibold text-teal-700 dark:text-teal-300">
                        {(p.sold * p.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-indigo-100 to-pink-100 dark:from-gray-800 dark:to-gray-900 font-semibold">
                    <td
                      colSpan={6}
                      className="border p-2 text-right text-gray-800 dark:text-gray-200"
                    >
                      Total Sales (ETB)
                    </td>
                    <td className="border p-2 text-right text-teal-700 dark:text-teal-300">
                      {grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Cash Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {[
                { label: "Cash Received", value: cashReceived, setter: null },
                {
                  label: "Cash Deposited",
                  value: cashDeposited,
                  setter: setCashDeposited,
                },
                { label: "Difference", value: difference, setter: null },
              ].map((item, i) => (
                <div key={i}>
                  <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {item.label}
                  </Label>
                  <Input
                    type="number"
                    value={item.value}
                    onChange={
                      item.setter
                        ? (e) => item.setter(Number(e.target.value))
                        : undefined
                    }
                    disabled={!item.setter || loading}
                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-teal-400 dark:focus:ring-indigo-500 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-5">
              <Button
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 dark:from-teal-600 dark:via-indigo-700 dark:to-pink-700 hover:opacity-90 transition-all shadow-lg rounded-xl flex items-center gap-2"
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
