// src/components/analytics/dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { CalendarIcon, Users, Activity, Clock } from "lucide-react";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsDashboard({ 
  hospitalId = null, 
  departmentId = null 
}: { 
  hospitalId?: string | null, 
  departmentId?: number | null 
}) {
  const [dailyStats, setDailyStats] = useState<{date: string, count: number}[]>([]);
  const [departmentStats, setDepartmentStats] = useState<{name: string, value: number}[]>([]);
  const [statusStats, setStatusStats] = useState<{name: string, value: number}[]>([]);
  const [timeSlotStats, setTimeSlotStats] = useState<{time: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7");

  useEffect(() => {
    fetchAnalyticsData();
  }, [hospitalId, departmentId, dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    try {
      // Get date range
      const endDate = new Date();
      const startDate = subDays(endDate, parseInt(dateRange));
      const startDateString = format(startDate, "yyyy-MM-dd");
      
      // Build query for appointments
      let query = supabase.from("appointments").select(`
        id, 
        date, 
        time_slot, 
        status,
        department_id,
        hospital_id,
        departments:department_id(name)
      `);
      
      // Apply filters based on props
      if (hospitalId) {
        query = query.eq("hospital_id", hospitalId);
      }
      
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      
      // Filter by date range
      query = query.gte("date", startDateString);
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process daily stats
      const dailyMap = new Map();
      const today = format(new Date(), "yyyy-MM-dd");
      
      // Initialize with all dates in range
      for (let i = 0; i < parseInt(dateRange); i++) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        dailyMap.set(date, { date, count: 0 });
      }
      
      // Count appointments by date
      data.forEach(appointment => {
        if (dailyMap.has(appointment.date)) {
          const current = dailyMap.get(appointment.date);
          dailyMap.set(appointment.date, { 
            ...current, 
            count: current.count + 1 
          });
        }
      });
      
      // Convert map to array and sort by date
      const dailyData = Array.from(dailyMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
          ...item,
          date: format(parseISO(item.date), "MMM dd")
        }));
      
      setDailyStats(dailyData);
      
      // Process department stats
      const deptMap = new Map();
      data.forEach(appointment => {
        // Use type assertion to tell TypeScript that departments is an object with a name property
        const deptName = (appointment.departments as any)?.name || `Department ${appointment.department_id}`;
        
        if (deptMap.has(deptName)) {
          deptMap.set(deptName, deptMap.get(deptName) + 1);
        } else {
          deptMap.set(deptName, 1);
        }
      });
      const deptData = Array.from(deptMap.entries()).map(([deptName, value]) => ({ name: deptName, value }));
      setDepartmentStats(deptData);
      
      // Process status stats
      const statusMap = new Map([
        ["waiting", 0],
        ["in-progress", 0],
        ["completed", 0],
        ["cancelled", 0]
      ]);
      
      data.forEach(appointment => {
        if (statusMap.has(appointment.status)) {
          statusMap.set(appointment.status, statusMap.get(appointment.status)! + 1);
        }
      });
      
      const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }));
      
      setStatusStats(statusData);
      
      // Process time slot stats
      const timeSlotMap = new Map();
      
      // Group by hour
      data.forEach(appointment => {
        if (appointment.time_slot) {
          const hour = appointment.time_slot.split(":")[0];
          const hourFormatted = `${hour}:00`;
          
          if (timeSlotMap.has(hourFormatted)) {
            timeSlotMap.set(hourFormatted, timeSlotMap.get(hourFormatted) + 1);
          } else {
            timeSlotMap.set(hourFormatted, 1);
          }
        }
      });
      
      const timeSlotData = Array.from(timeSlotMap.entries())
        .map(([time, count]) => ({ time, count }))
        .sort((a, b) => {
          const hourA = parseInt(a.time.split(":")[0]);
          const hourB = parseInt(b.time.split(":")[0]);
          return hourA - hourB;
        });
      
      setTimeSlotStats(timeSlotData);
      
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Analytics Dashboard</h2>
        <Tabs defaultValue={dateRange} onValueChange={setDateRange} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="7">7 Days</TabsTrigger>
            <TabsTrigger value="14">14 Days</TabsTrigger>
            <TabsTrigger value="30">30 Days</TabsTrigger>
            <TabsTrigger value="90">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats.reduce((sum, day) => sum + day.count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  In the last {dateRange} days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Per Day</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(dailyStats.reduce((sum, day) => sum + day.count, 0) / dailyStats.length)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Appointments per day
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statusStats.length > 0 
                    ? Math.round((statusStats.find(s => s.name === "Completed")?.value || 0) / 
                        statusStats.reduce((sum, status) => sum + status.value, 0) * 100) 
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Of all appointments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Busiest Hour</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {timeSlotStats.length > 0 
                    ? timeSlotStats.reduce((max, slot) => slot.count > max.count ? slot : max, timeSlotStats[0]).time
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most appointments scheduled
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Daily Appointments</CardTitle>
                <CardDescription>
                  Number of appointments scheduled each day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full overflow-x-auto">
                  <div className="min-w-[500px] h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          formatter={(value) => [`${value} appointments`, 'Count']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Appointments by Status</CardTitle>
                <CardDescription>
                  Distribution of appointment statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full overflow-x-auto">
                  <div className="min-w-[300px] h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Utilization</CardTitle>
                <CardDescription>
                  Appointments by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full overflow-x-auto">
                  <div className="min-w-[400px] h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={departmentStats}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 60,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                        <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Time</CardTitle>
                <CardDescription>
                  Distribution across hours of the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full overflow-x-auto">
                  <div className="min-w-[400px] h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timeSlotStats}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--chart-3))" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}