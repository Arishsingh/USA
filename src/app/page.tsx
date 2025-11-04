"use client"

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export default function VrdhtechDashboard() {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("deptData") || "[]");
    setData(storedData);
  }, []);

  const monthlySalesMap = data.reduce((acc, d) => {
    const [y, m] = d.date.split('-');
    const key = `${y}-${m}`;
    acc[key] = (acc[key] || 0) + d.selling;
    return acc;
  }, {});

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = Object.keys(monthlySalesMap).sort();
  const monthlySales = months.map(k => {
    const [y, m] = k.split('-');
    return { name: `${monthNames[parseInt(m) - 1]} ${y}`, revenue: monthlySalesMap[k] };
  });

  const deptRevenueMap = data.reduce((acc, d) => {
    acc[d.dept] = (acc[d.dept] || 0) + d.selling;
    return acc;
  }, {});

  const departmentData = Object.keys(deptRevenueMap).map(name => ({ name, value: deptRevenueMap[name] }));

  const target = 200000;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentRevenue = data.filter(d => d.date.startsWith(currentMonth)).reduce((sum, d) => sum + d.selling, 0);
  const todaysSales = data.filter(d => new Date(d.date).toDateString() === new Date().toDateString()).reduce((sum, d) => sum + d.selling, 0);
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
            <div>Target: ₹{target.toLocaleString('en-IN')}</div>
            <div>M. Revenue: ₹{currentRevenue.toLocaleString('en-IN')}</div>
            <div>Today's Sales: ₹{todaysSales.toLocaleString('en-IN')}</div>
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
                <Pie data={departmentData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Revenue (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">No recent data</TableCell>
                  </TableRow>
                ) : (
                  data.slice(-10).reverse().map((d, i) => {
                    const [y, m] = d.date.split('-');
                    return (
                      <TableRow key={i}>
                        <TableCell>{d.dept}</TableCell>
                        <TableCell>{monthNames[parseInt(m) - 1]} {y}</TableCell>
                        <TableCell>₹{d.selling}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
