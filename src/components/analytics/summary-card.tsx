// src/components/analytics/summary-card.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, Users, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function AnalyticsSummaryCard({ 
  hospitalId = null, 
  departmentId = null, 
  linkTo = "/analytics" 
}: {
  hospitalId?: string | null,
  departmentId?: number | null,
  linkTo?: string
}) {
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const supabase = createClient();
        
        // Get today's date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Get date 7 days ago
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        
        // Query for today's appointments
        let todayQuery = supabase.from("appointments").select("id", { count: "exact" }).eq("date", todayStr);
        
        // Query for this week's appointments
     // src/components/analytics/summary-card.tsx (continued)
        // Query for this week's appointments
        let weekQuery = supabase.from("appointments").select("id", { count: "exact" }).gte("date", weekAgoStr);
        
        // Apply filters if provided
        if (hospitalId) {
          todayQuery = todayQuery.eq("hospital_id", hospitalId);
          weekQuery = weekQuery.eq("hospital_id", hospitalId);
        }
        
        if (departmentId) {
          todayQuery = todayQuery.eq("department_id", departmentId);
          weekQuery = weekQuery.eq("department_id", departmentId);
        }
        
        // Execute queries
        const [todayResult, weekResult] = await Promise.all([
          todayQuery,
          weekQuery
        ]);
        
        setTodayCount(todayResult.count || 0);
        setWeekCount(weekResult.count || 0);
        
      } catch (error) {
        console.error("Error fetching analytics summary:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [hospitalId, departmentId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Analytics Overview</CardTitle>
        <ChartPie className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Today</span>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{loading ? "..." : todayCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">appointments</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">This Week</span>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{loading ? "..." : weekCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">appointments</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Link 
            href={linkTo} 
            className="text-sm text-primary hover:underline flex items-center"
          >
            <ChartPie className="mr-1 h-3 w-3" /> View detailed analytics
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}