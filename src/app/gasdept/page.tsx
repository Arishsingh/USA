"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react"; // ✅ Trash icon

type GasEntry = {
  gasType: string;
  date: string;
  buyingPrice: number;
  buyingGallons: number;
  sellingPrice: number;
  sellingGallons: number;
  saleAmount: number;
  profitPercent: number;
  profitAmount: number;
};

// Helper to sanitize loaded entry objects
function sanitizeEntry(entry: Partial<GasEntry>): GasEntry {
  return {
    gasType: entry.gasType ?? "",
    date: entry.date ?? "",
    buyingPrice: typeof entry.buyingPrice === "number" ? entry.buyingPrice : 0,
    buyingGallons: typeof entry.buyingGallons === "number" ? entry.buyingGallons : 0,
    sellingPrice: typeof entry.sellingPrice === "number" ? entry.sellingPrice : 0,
    sellingGallons: typeof entry.sellingGallons === "number" ? entry.sellingGallons : 0,
    saleAmount: typeof entry.saleAmount === "number" ? entry.saleAmount : 0,
    profitPercent: typeof entry.profitPercent === "number" ? entry.profitPercent : 0,
    profitAmount: typeof entry.profitAmount === "number" ? entry.profitAmount : 0,
  };
}

// List of fields that should be treated as numbers
const numberFields: Array<keyof GasEntry> = [
  "buyingPrice",
  "buyingGallons",
  "sellingPrice",
  "sellingGallons",
  "profitPercent",
];

export default function GasDeptPage() {
  const [entries, setEntries] = useState<GasEntry[]>([]);

  // Load data from localStorage or set initial data
  useEffect(() => {
    const savedData = localStorage.getItem("gasEntries");
    if (savedData) {
      // Sanitize each loaded entry to ensure all fields exist
      const parsed: Partial<GasEntry>[] = JSON.parse(savedData);
      setEntries(parsed.map(sanitizeEntry));
    } else {
      setEntries([
        { gasType: "Regular", date: "", buyingPrice: 0, buyingGallons: 0, sellingPrice: 0, sellingGallons: 0, saleAmount: 0, profitPercent: 0, profitAmount: 0 },
        { gasType: "Mid", date: "", buyingPrice: 0, buyingGallons: 0, sellingPrice: 0, sellingGallons: 0, saleAmount: 0, profitPercent: 0, profitAmount: 0 },
        { gasType: "Premium", date: "", buyingPrice: 0, buyingGallons: 0, sellingPrice: 0, sellingGallons: 0, saleAmount: 0, profitPercent: 0, profitAmount: 0 },
        { gasType: "Diesel", date: "", buyingPrice: 0, buyingGallons: 0, sellingPrice: 0, sellingGallons: 0, saleAmount: 0, profitPercent: 0, profitAmount: 0 },
      ]);
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("gasEntries", JSON.stringify(entries));
    }
  }, [entries]);

  const handleChange = (index: number, field: keyof GasEntry, value: string) => {
    const newEntries = [...entries];
    if (numberFields.includes(field)) {
      // Assign as number
      (newEntries[index][field] as number) = value === "" ? 0 : parseFloat(value);
    } else {
      // Assign as string
      (newEntries[index][field] as string) = value;
    }

    // Recalculate saleAmount & profitAmount
    const e = newEntries[index];
    e.saleAmount = (e.sellingPrice ?? 0) * (e.sellingGallons ?? 0);
    e.profitAmount = (e.saleAmount * (e.profitPercent ?? 0)) / 100;

    setEntries(newEntries);
  };

  const addRow = () => {
    setEntries([
      ...entries,
      {
        gasType: "",
        date: "",
        buyingPrice: 0,
        buyingGallons: 0,
        sellingPrice: 0,
        sellingGallons: 0,
        saleAmount: 0,
        profitPercent: 0,
        profitAmount: 0,
      },
    ]);
  };

  const deleteRow = (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this entry?");
    if (!confirmDelete) return;
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Gas Department Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-left">Gas Type</th>
                  <th className="border px-2 py-1 text-left">Date</th>
                  <th className="border px-2 py-1 text-left">Buying Price/Gallon</th>
                  <th className="border px-2 py-1 text-left">Buying Gallons</th>
                  <th className="border px-2 py-1 text-left">Selling Price/Gallon</th>
                  <th className="border px-2 py-1 text-left">Selling Gallons</th>
                  <th className="border px-2 py-1 text-left">Sale Amount</th>
                  <th className="border px-2 py-1 text-left">Profit %</th>
                  <th className="border px-2 py-1 text-left">Profit Amount</th>
                  <th className="border px-2 py-1 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">
                      <Input
                        value={entry.gasType ?? ""}
                        onChange={(e) => handleChange(index, "gasType", e.target.value)}
                        placeholder="Type"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="date"
                        value={entry.date ?? ""}
                        onChange={(e) => handleChange(index, "date", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="number"
                        value={entry.buyingPrice ?? 0}
                        onChange={(e) => handleChange(index, "buyingPrice", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="number"
                        value={entry.buyingGallons ?? 0}
                        onChange={(e) => handleChange(index, "buyingGallons", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="number"
                        value={entry.sellingPrice ?? 0}
                        onChange={(e) => handleChange(index, "sellingPrice", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="number"
                        value={entry.sellingGallons ?? 0}
                        onChange={(e) => handleChange(index, "sellingGallons", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {Number.isFinite(entry.saleAmount) ? entry.saleAmount.toFixed(2) : "0.00"}
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="number"
                        value={entry.profitPercent ?? 0}
                        onChange={(e) => handleChange(index, "profitPercent", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {Number.isFinite(entry.profitAmount) ? entry.profitAmount.toFixed(2) : "0.00"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(index)}
                        className="hover:bg-red-100 text-red-500"
                        title="Delete Row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Separator className="my-4" />
          <Button onClick={addRow}>Add Row</Button>
        </CardContent>
      </Card>
    </div>
  );
}
