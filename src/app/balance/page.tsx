"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Employee = { name: string; amount: number }
type CardFee = { desc: string; amount: number }
type Expense = { name: string; amount: number }

export default function ExpensePage() {
  // States with lazy init from localStorage or fallback empty
  const [employeeName, setEmployeeName] = useState("")
  const [employeeAmount, setEmployeeAmount] = useState("")
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("employees")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [cardDesc, setCardDesc] = useState("")
  const [cardAmount, setCardAmount] = useState("")
  const [cardFees, setCardFees] = useState<CardFee[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cardFees")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [expenseName, setExpenseName] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("expenses")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [revenue, setRevenue] = useState("")

  // Load total revenue from localStorage (from Sales Page)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRevenue = localStorage.getItem("totalRevenue")
      if (savedRevenue) setRevenue(savedRevenue)
    }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("employees", JSON.stringify(employees))
    }
  }, [employees])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cardFees", JSON.stringify(cardFees))
    }
  }, [cardFees])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("expenses", JSON.stringify(expenses))
    }
  }, [expenses])

  // Totals
  const totalPaychecks = employees.reduce((sum, e) => sum + e.amount, 0)
  const totalCardFees = cardFees.reduce((sum, e) => sum + e.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalAllExpenses = totalPaychecks + totalCardFees + totalExpenses
  const finalAmount = (Number(revenue) || 0) - totalAllExpenses

  // Add Handlers
  const handleAddEmployee = () => {
    if (employeeName && employeeAmount) {
      setEmployees((prev) => [...prev, { name: employeeName, amount: Number(employeeAmount) }])
      setEmployeeName("")
      setEmployeeAmount("")
    }
  }

  const handleAddCardFee = () => {
    if (cardDesc && cardAmount) {
      setCardFees((prev) => [...prev, { desc: cardDesc, amount: Number(cardAmount) }])
      setCardDesc("")
      setCardAmount("")
    }
  }

  const handleAddExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses((prev) => [...prev, { name: expenseName, amount: Number(expenseAmount) }])
      setExpenseName("")
      setExpenseAmount("")
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Employee Paychecks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-600 flex justify-between">
            Employee Paychecks
            <Button onClick={handleAddEmployee} variant="default" size="sm">
              + Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <Input
              placeholder="Amount (₹)"
              type="number"
              value={employeeAmount}
              onChange={(e) => setEmployeeAmount(e.target.value)}
            />
          </div>
          {employees.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                {employees.map((emp, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{emp.name}</span>
                    <span>₹{emp.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <Separator />
          <div className="text-right text-blue-600 font-medium">
            Total Paychecks: ₹{totalPaychecks.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Card Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-600 flex justify-between">
            Card Fees
            <Button onClick={handleAddCardFee} variant="default" size="sm">
              + Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Card Fee Description"
              value={cardDesc}
              onChange={(e) => setCardDesc(e.target.value)}
            />
            <Input
              placeholder="Amount (₹)"
              type="number"
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
            />
          </div>
          {cardFees.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                {cardFees.map((fee, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{fee.desc}</span>
                    <span>₹{fee.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <Separator />
          <div className="text-right text-blue-600 font-medium">
            Total Card Fees: ₹{totalCardFees.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* General Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-600 flex justify-between">
            General Expenses
            <Button onClick={handleAddExpense} variant="default" size="sm">
              + Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
            <Input
              placeholder="Amount (₹)"
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
          </div>
          {expenses.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                {expenses.map((exp, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{exp.name}</span>
                    <span>₹{exp.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <Separator />
          <div className="text-right text-blue-600 font-medium">
            Total General Expenses: ₹{totalExpenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-600">
            Final Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Total Revenue</span>
            <Input type="number" className="w-40" value={revenue} readOnly />
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total Expenses</span>
            <span>₹{totalAllExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-green-600">
            <span>Final Amount (Net Profit)</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
