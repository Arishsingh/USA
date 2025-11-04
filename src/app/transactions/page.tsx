"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "next-themes"

type Distributor = {
  date: string
  distributor: string
  amount: number
}

type Department = {
  date: string
  dept: string
  buying: number
  selling: number
}

export default function TransactionsPage() {
  const { theme, setTheme } = useTheme()
  const [distributorData, setDistributorData] = useState<Distributor[]>(() => {
    if (typeof window !== "undefined") {
      const savedDist = localStorage.getItem("distributorData")
      return savedDist ? JSON.parse(savedDist) : []
    }
    return []
  })
  const [deptData, setDeptData] = useState<Department[]>(() => {
    if (typeof window !== "undefined") {
      const savedDept = localStorage.getItem("deptData")
      return savedDept ? JSON.parse(savedDept) : []
    }
    return []
  })

  const [formDistributor, setFormDistributor] = useState({ date: "", distributor: "", amount: "" })
  const [formDept, setFormDept] = useState({ date: "", dept: "", buying: "", selling: "", profitPercent: "" })

  // Save data on changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("distributorData", JSON.stringify(distributorData))
    }
  }, [distributorData])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("deptData", JSON.stringify(deptData))
    }
  }, [deptData])

  // Distributor handlers
  const addDistributor = (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(formDistributor.amount)
    if (!formDistributor.date || !formDistributor.distributor || isNaN(amountNum)) return
    setDistributorData((prev) => [
      ...prev,
      { date: formDistributor.date, distributor: formDistributor.distributor, amount: amountNum },
    ])
    setFormDistributor({ date: "", distributor: "", amount: "" })
  }

  const deleteDistributor = (index: number) => {
    setDistributorData((prev) => prev.filter((_, i) => i !== index))
  }

  const totalDistributor = distributorData.reduce((acc, d) => acc + d.amount, 0)

  // Profit Calculator Helpers
  const roundValue = (num: number) => Math.round(num * 10) / 10

  const handleProfitInputChange = (field: string, value: string) => {
    const newForm = { ...formDept, [field]: value }

    const buyVal = parseFloat(newForm.buying)
    const sellVal = parseFloat(newForm.selling)
    const profitVal = parseFloat(newForm.profitPercent)

    if (field === "buying" && !isNaN(buyVal) && !isNaN(profitVal)) {
      newForm.selling = (buyVal * (1 + profitVal / 100)).toFixed(1)
    } else if (field === "selling" && !isNaN(sellVal) && !isNaN(buyVal)) {
      newForm.profitPercent = (((sellVal - buyVal) / buyVal) * 100).toFixed(1)
    } else if (field === "profitPercent" && !isNaN(profitVal) && !isNaN(buyVal)) {
      newForm.selling = (buyVal * (1 + profitVal / 100)).toFixed(1)
    }

    setFormDept(newForm)
  }

  const addDept = (e: React.FormEvent) => {
    e.preventDefault()
    const buyVal = parseFloat(formDept.buying)
    const sellVal = parseFloat(formDept.selling)
    if (isNaN(buyVal) || isNaN(sellVal)) return alert("Enter valid Buying or Selling values")

    setDeptData((prev) => [
      ...prev,
      {
        date: formDept.date,
        dept: formDept.dept,
        buying: buyVal,
        selling: sellVal,
      },
    ])
    setFormDept({ date: "", dept: "", buying: "", selling: "", profitPercent: "" })
  }

  const deleteDept = (index: number) => {
    setDeptData((prev) => prev.filter((_, i) => i !== index))
  }

  const totalBuying = deptData.reduce((acc, d) => acc + d.buying, 0)
  const totalSelling = deptData.reduce((acc, d) => acc + d.selling, 0)

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {/* Theme Toggle */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </Button>
      </div>

      {/* Distributor Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
            Distributor Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addDistributor} className="flex flex-wrap gap-3 mb-4">
            <Input
              type="date"
              value={formDistributor.date}
              onChange={(e) => setFormDistributor({ ...formDistributor, date: e.target.value })}
              required
            />
            <Input
              placeholder="Distributor Name"
              value={formDistributor.distributor}
              onChange={(e) => setFormDistributor({ ...formDistributor, distributor: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Amount (₹)"
              value={formDistributor.amount}
              onChange={(e) => setFormDistributor({ ...formDistributor, amount: e.target.value })}
              required
            />
            <Button type="submit">Add Transaction</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributorData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No distributor data yet.
                  </TableCell>
                </TableRow>
              ) : (
                distributorData.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>{d.date}</TableCell>
                    <TableCell>{d.distributor}</TableCell>
                    <TableCell>{d.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Button variant="destructive" onClick={() => deleteDistributor(i)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="text-right font-semibold mt-3 text-blue-600 dark:text-blue-400">
            Total: {totalDistributor.toLocaleString("en-IN")}
          </div>
        </CardContent>
      </Card>

      {/* Profit Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
            Profit Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addDept} className="flex flex-wrap gap-3 mb-4">
            <Input
              type="date"
              value={formDept.date}
              onChange={(e) => setFormDept({ ...formDept, date: e.target.value })}
              required
            />
            <Input
              placeholder="Department Name"
              value={formDept.dept}
              onChange={(e) => setFormDept({ ...formDept, dept: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Buying Cost (₹)"
              value={formDept.buying}
              onChange={(e) => handleProfitInputChange("buying", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Selling Price (₹)"
              value={formDept.selling}
              onChange={(e) => handleProfitInputChange("selling", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Profit % (optional)"
              value={formDept.profitPercent}
              onChange={(e) => handleProfitInputChange("profitPercent", e.target.value)}
            />
            <Button type="submit">Add Department Data</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Buying (₹)</TableHead>
                <TableHead>Selling (₹)</TableHead>
                <TableHead>Profit %</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No department data yet.
                  </TableCell>
                </TableRow>
              ) : (
                deptData.map((d, i) => {
                  const profit = d.buying === 0 ? 0 : ((d.selling - d.buying) / d.buying) * 100
                  const color = profit < 0 ? "text-red-500" : profit < 10 ? "text-yellow-500" : "text-green-600"
                  return (
                    <TableRow key={i}>
                      <TableCell>{d.date}</TableCell>
                      <TableCell>{d.dept}</TableCell>
                      <TableCell>{d.buying.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{d.selling.toLocaleString("en-IN")}</TableCell>
                      <TableCell className={`${color} font-semibold`}>{roundValue(profit)}%</TableCell>
                      <TableCell>
                        <Button variant="destructive" onClick={() => deleteDept(i)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <div className="text-right font-semibold mt-3 text-blue-600 dark:text-blue-400">
            Total Buying: {totalBuying.toLocaleString("en-IN")} | Total Selling: {totalSelling.toLocaleString("en-IN")}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
