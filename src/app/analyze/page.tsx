"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { useTheme } from "next-themes"

type Department = {
  date: string
  dept: string
  buying: number
  selling: number
}

export default function AnalyticsPage() {
  const { theme, setTheme } = useTheme()
  const [deptData, setDeptData] = useState<Department[]>([])

  // Load stored department data
  useEffect(() => {
    const savedDept = localStorage.getItem("deptData")
    if (savedDept) setDeptData(JSON.parse(savedDept))
  }, [])

  // --- Helper: Group by Day ---
  const groupByDay = (data: Department[]) => {
    const grouped: Record<string, { buying: number; selling: number }> = {}
    data.forEach((d) => {
      const date = new Date(d.date).toLocaleDateString("en-GB", {
        month: "2-digit",
        day: "2-digit",
      })
      if (!grouped[date]) grouped[date] = { buying: 0, selling: 0 }
      grouped[date].buying += d.buying
      grouped[date].selling += d.selling
    })
    return Object.keys(grouped).map((date) => ({
      date,
      buying: grouped[date].buying,
      selling: grouped[date].selling,
    }))
  }

  // --- Helper: Group by Month ---
  const groupByMonth = (data: Department[]) => {
    const grouped: Record<string, { buying: number; selling: number }> = {}
    data.forEach((d) => {
      const month = new Date(d.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
      if (!grouped[month]) grouped[month] = { buying: 0, selling: 0 }
      grouped[month].buying += d.buying
      grouped[month].selling += d.selling
    })
    return Object.keys(grouped).map((month) => ({
      date: month,
      buying: grouped[month].buying,
      selling: grouped[month].selling,
    }))
  }

  const dailyData = groupByDay(deptData)
  const monthlyData = groupByMonth(deptData)

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

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="flex justify-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="daily" className="px-6 py-2">Daily</TabsTrigger>
          <TabsTrigger value="monthly" className="px-6 py-2">Monthly</TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600 dark:text-green-400">
                Buying Trends (Cost)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="buying"
                    stroke="#16a34a"
                    fillOpacity={1}
                    fill="url(#colorBuy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-amber-500 dark:text-amber-400">
                Selling Trends (Revenue)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="selling"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorSell)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600 dark:text-green-400">
                Buying Trends (Cost)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorBuyMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="buying"
                    stroke="#16a34a"
                    fillOpacity={1}
                    fill="url(#colorBuyMonth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-amber-500 dark:text-amber-400">
                Selling Trends (Revenue)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorSellMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="selling"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorSellMonth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
