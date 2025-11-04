"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Type definitions
interface SalesData {
  dept: string;
  date: string;
  selling: number;
}

interface MonthlySalesData {
  name: string;
  revenue: number;
  [key: string]: string | number;
}

interface DepartmentData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface MonthlySalesMap {
  [key: string]: number;
}

interface DeptRevenueMap {
  [key: string]: number;
}

export default function VrdhtechDashboard() {
  const [data, setData] = useState<SalesData[]>([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("deptData") || "[]") as SalesData[];
    setData(storedData);
  }, []);

  const monthlySalesMap: MonthlySalesMap = data.reduce<MonthlySalesMap>((acc, d) => {
    const [y, m] = d.date.split("-");
    const key = `${y}-${m}`;
    acc[key] = (acc[key] || 0) + d.selling;
    return acc;
  }, {});

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  
  const months = Object.keys(monthlySalesMap).sort();
  const monthlySales: MonthlySalesData[] = months.map((k) => {
    const [y, m] = k.split("-");
    return { 
      name: `${monthNames[parseInt(m, 10) - 1]} ${y}`, 
      revenue: monthlySalesMap[k] 
    };
  });

  const deptRevenueMap: DeptRevenueMap = data.reduce<DeptRevenueMap>((acc, d) => {
    acc[d.dept] = (acc[d.dept] || 0) + d.selling;
    return acc;
  }, {});

  const departmentData: DepartmentData[] = Object.keys(deptRevenueMap).map((name) => ({
    name,
    value: deptRevenueMap[name],
  }));

  const target = 200000;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentRevenue = data
    .filter((d) => d.date.startsWith(currentMonth))
    .reduce((sum, d) => sum + d.selling, 0);
  const todaysSales = data
    .filter((d) => new Date(d.date).toDateString() === new Date().toDateString())
    .reduce((sum, d) => sum + d.selling, 0);
  const progress = Math.min(100, (currentRevenue / target) * 100);

  const COLORS = ["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#6366f1"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Target</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="relative w-32 h-32 rounded-full border-[10px] border-gray-200 flex items-center justify-center">
            <div className="text-xl font-semibold text-blue-600">{progress.toFixed(1)}%</div>
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <div>Target: ₹{target.toLocaleString("en-IN")}</div>
            <div>M. Revenue: ₹{currentRevenue.toLocaleString("en-IN")}</div>
            <div>Today&apos;s Sales: ₹{todaysSales.toLocaleString("en-IN")}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySales}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" barSize={80} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Revenue Share</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2 font-medium">Department</th>
                    <th className="text-left p-2 font-medium">Month</th>
                    <th className="text-left p-2 font-medium">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-500 p-4">
                        No recent data
                      </td>
                    </tr>
                  ) : (
                    data
                      .slice(-10)
                      .reverse()
                      .map((d, i) => {
                        const [y, m] = d.date.split("-");
                        return (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="p-2">{d.dept}</td>
                            <td className="p-2">
                              {monthNames[parseInt(m, 10) - 1]} {y}
                            </td>
                            <td className="p-2">₹{d.selling.toLocaleString("en-IN")}</td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}