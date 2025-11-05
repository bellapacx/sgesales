"use client";

import { useEffect, useState } from "react";
import { Input } from "../../components/ui/inputs";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Loader2, Save, Plus, Pencil } from "lucide-react";

interface Product {
  id?: number;
  productCode: string;
  productName: string;
  price: number;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleChange = (index: number, field: keyof Product, value: any) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      productCode: "",
      productName: "",
      price: 0,
    };
    setProducts([...products, newProduct]);
    setEditingIndex(products.length); // immediately edit the new row
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });

      if (res.ok) {
        alert("✅ Products saved successfully!");
        setEditingIndex(null);
      } else {
        alert("❌ Failed to save products.");
      }
    } catch (err) {
      console.error("Error saving products:", err);
      alert("⚠️ Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center w-full p-4 sm:p-6 bg-gray-900 min-h-screen">
      <Card className="w-full max-w-5xl shadow-lg rounded-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-md transition-all duration-300">
        <CardHeader className="text-center pb-3 bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 text-white rounded-t-2xl shadow-md">
          <CardTitle className="text-xl font-bold tracking-wide">
            🧾 Manage Products
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-40 text-gray-300">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading products...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400 text-white">
                  <tr>
                    <th className="border p-2 text-center">Code</th>
                    <th className="border p-2 text-center">Product Name</th>
                    <th className="border p-2 text-center">Price (ETB)</th>
                    <th className="border p-2 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id ?? i}>
                      <td className="border p-2 text-center text-white">
                        {editingIndex === i ? (
                          <Input
                            type="text"
                            value={p.productCode}
                            onChange={(e) =>
                              handleChange(i, "productCode", e.target.value)
                            }
                            className="w-full text-center text-white border-gray-700 bg-gray-800 rounded-lg"
                          />
                        ) : (
                          p.productCode
                        )}
                      </td>

                      <td className="border p-2 text-white">
                        {editingIndex === i ? (
                          <Input
                            type="text"
                            value={p.productName}
                            onChange={(e) =>
                              handleChange(i, "productName", e.target.value)
                            }
                            className="w-full text-white border-gray-700 bg-gray-800 rounded-lg"
                          />
                        ) : (
                          p.productName
                        )}
                      </td>

                      <td className="border p-2 text-center text-white">
                        {editingIndex === i ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={p.price}
                            onChange={(e) =>
                              handleChange(i, "price", Number(e.target.value))
                            }
                            className="w-24 text-center text-white border-gray-700 bg-gray-800 rounded-lg"
                          />
                        ) : (
                          p.price
                        )}
                      </td>

                      <td className="border p-2 text-center">
                        {editingIndex === i ? (
                          <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-3 py-1 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setEditingIndex(i)}
                            variant="outline"
                            className="px-3 py-1 text-xs flex items-center gap-1 border-gray-500 text-gray-300 hover:bg-gray-800"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <Button
              onClick={handleAddProduct}
              variant="outline"
              className="flex items-center gap-2 border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
