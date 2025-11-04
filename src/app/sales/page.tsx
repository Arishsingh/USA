"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SalesRow = {
  date: string
  net: number
  tax: number
  discount: number
  card: number
  total: number
  cash: number
  os: number
  confirmed: boolean
}

const emptyRow = (): SalesRow => ({
  date: "",
  net: 0,
  tax: 0,
  discount: 0,
  card: 0,
  total: 0,
  cash: 0,
  os: 0,
  confirmed: false,
})

export default function SalesPage() {
  // Lazy load initial state from localStorage, fallback to one empty row
  const [rows, setRows] = useState<SalesRow[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("salesData")
      return saved ? JSON.parse(saved) : [emptyRow()]
    }
    return [emptyRow()]
  })

  // Save rows data to localStorage on any change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("salesData", JSON.stringify(rows))
    }
  }, [rows])

  // Add a new editable row at the TOP
  const addNewTopRow = () => {
    setRows((prev) => [emptyRow(), ...prev])
  }

  // Confirm row: lock editing + move it DOWN
  const confirmRow = (index: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows]
      const confirmedRow = { ...newRows[index], confirmed: true }

      newRows.splice(index, 1)
      const updatedRows = [...newRows, confirmedRow]

      return [emptyRow(), ...updatedRows]
    })
  }

  // Clear all rows to single empty row
  const clearAll = () => setRows([emptyRow()])

  // Handle input changes and update total
  const handleChange = (index: number, field: keyof SalesRow, value: string) => {
    setRows((prev) => {
      const newRows = [...prev]
      
      // Update the specific field
      if (field === "date") {
        newRows[index][field] = value
      } else {
        (newRows[index][field] as number) = parseFloat(value) || 0
      }
      
      // Recalculate total
      newRows[index].total = newRows[index].net + newRows[index].tax - newRows[index].discount
      
      return newRows
    })
  }

  // Calculate totals
  const totals = rows.reduce(
    (acc, row) => {
      acc.net += row.net
      acc.tax += row.tax
      acc.discount += row.discount
      acc.card += row.card
      acc.total += row.total
      acc.cash += row.cash
      acc.os += row.os
      return acc
    },
    { net: 0, tax: 0, discount: 0, card: 0, total: 0, cash: 0, os: 0 }
  )

  // Save totalRevenue for other pages if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("totalRevenue", totals.total.toString())
    }
  }, [totals.total])

  // Export CSV functionality
  const exportCSV = () => {
    const header = ["Date", "Net", "Tax", "Discount", "Card", "Total", "Cash", "O/s"]
    const csv = [
      header.join(","),
      ...rows.map(
        (r) =>
          `${r.date},${r.net},${r.tax},${r.discount},${r.card},${r.total},${r.cash},${r.os}`
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sales_data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Sales Data</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Buttons */}
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2">
              <Button onClick={addNewTopRow}>+ New Shop</Button>
              <Button variant="outline" onClick={exportCSV}>
                Export CSV
              </Button>
              <Button variant="destructive" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-left p-2 font-medium">Net</th>
                  <th className="text-left p-2 font-medium">Tax</th>
                  <th className="text-left p-2 font-medium">Discount</th>
                  <th className="text-left p-2 font-medium">Card</th>
                  <th className="text-left p-2 font-medium">Total</th>
                  <th className="text-left p-2 font-medium">Cash</th>
                  <th className="text-left p-2 font-medium">O/s</th>
                  <th className="text-left p-2 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleChange(i, "date", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.net}
                        onChange={(e) => handleChange(i, "net", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.tax}
                        onChange={(e) => handleChange(i, "tax", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.discount}
                        onChange={(e) => handleChange(i, "discount", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.card}
                        onChange={(e) => handleChange(i, "card", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.total}
                        disabled
                        className="bg-gray-100"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.cash}
                        onChange={(e) => handleChange(i, "cash", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={row.os}
                        onChange={(e) => handleChange(i, "os", e.target.value)}
                        disabled={row.confirmed}
                      />
                    </td>

                    <td className="p-2">
                      {!row.confirmed ? (
                        <Button size="sm" onClick={() => confirmRow(i)}>
                          Confirm
                        </Button>
                      ) : (
                        <span className="text-green-600 font-medium">✔ Done</span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Totals row */}
                <tr className="font-bold bg-gray-100">
                  <td className="p-2">Total:</td>
                  <td className="p-2">₹{totals.net.toFixed(2)}</td>
                  <td className="p-2">₹{totals.tax.toFixed(2)}</td>
                  <td className="p-2">₹{totals.discount.toFixed(2)}</td>
                  <td className="p-2">₹{totals.card.toFixed(2)}</td>
                  <td className="p-2">₹{totals.total.toFixed(2)}</td>
                  <td className="p-2">₹{totals.cash.toFixed(2)}</td>
                  <td className="p-2">₹{totals.os.toFixed(2)}</td>
                  <td className="p-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Confirm entries to lock them and move them below. New shop entries appear at the top.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}