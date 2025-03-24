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
        
        // First, get all department types for name mapping
        const { data: departmentTypes, error: deptTypesError } = await supabase
          .from("department_types")
          .select("id, name");
        
        if (deptTypesError) throw deptTypesError;
        
        // Create a map of department IDs to names for easy lookup
        const departmentNameMap = new Map();
        departmentTypes.forEach(dept => {
          departmentNameMap.set(dept.id, dept.name);
        });
        
        // Get all departments for this hospital
        const { data: departmentsData, error: deptError } = await supabase
          .from("hospital_departments")
          .select(`
            id,
            department_type_id
          `)
          .eq("hospital_id", hospitalId);
        
        if (deptError) throw deptError;
        
        // Get appointment counts for each department
        const deptStats = await Promise.all(
          departmentsData.map(async (dept) => {
            const { count, error } = await supabase
              .from("appointments")
              .select("id", { count: "exact" })
              .eq("hospital_id", hospitalId)
              .eq("department_id", dept.department_type_id)
              .gte("date", startDateString);
            
            if (error) throw error;
            
            // Use the department name from our map, or fall back to a default
            const departmentName = departmentNameMap.get(dept.department_type_id) || 
                                   `Department ${dept.department_type_id}`;
            
            return {
              name: departmentName,
              appointments: count || 0
            };
          })
        );
        
        // Sort by number of appointments (descending)
        const sortedData = deptStats.sort((a, b) => b.appointments - a.appointments);
        setData(sortedData);
        
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
        <div className="h-[300px] w-full overflow-x-auto">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          ) : (
            <div className="min-w-[400px] h-full">
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}