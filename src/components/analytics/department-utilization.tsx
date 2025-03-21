// src/components/analytics/department-utilization.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, subDays } from "date-fns";

export default function DepartmentUtilizationChart({ 
  hospitalId 
}: { 
  hospitalId: string 
}) {
  const [data, setData] = useState<Array<{ name: string; appointments: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!hospitalId) return;
      
      try {
        const supabase = createClient();
        
        // Get last 30 days date range
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        const startDateString = format(startDate, "yyyy-MM-dd");
        
        // Get all departments for this hospital
        const { data: departmentsData, error: deptError } = await supabase
          .from("hospital_departments")
          .select(`
            id,
            department_type_id,
            department_types:department_type_id(name)
          `)
          .eq("hospital_id", hospitalId);
        
        if (deptError) throw deptError;
        
        // Get appointment counts for each department
        // Get appointment counts for each department
const deptStats = await Promise.all(
  departmentsData.map(async (dept) => {
    // Log the structure to understand what we're working with
    console.log('Department Types structure:', {
      departmentTypes: dept.department_types,
      type: typeof dept.department_types,
      isArray: Array.isArray(dept.department_types),
      departmentTypeId: dept.department_type_id
    });
    
    const { count, error } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId)
      .eq("department_id", dept.department_type_id)
      .gte("date", startDateString);
    
    if (error) throw error;
    
    // Temporary solution to avoid TypeScript error
    let departmentName = `Department ${dept.department_type_id}`;
    
    // We'll update this after seeing the logs
    return {
      name: departmentName,
      appointments: count || 0
    };
  })
);
        
        // Sort by number of appointments (descending)
        const sortedData = deptStats.sort((a, b) => b.appointments - a.appointments);
        setData(sortedData as Array<{ name: string; appointments: number }>);
        
      } catch (error) {
        console.error("Error fetching department utilization:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [hospitalId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Utilization (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 60,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                <Bar dataKey="appointments" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}