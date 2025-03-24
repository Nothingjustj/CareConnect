"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Check, X, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function QueueStatusPage() {
    const [loading, setLoading] = useState(true);
    const [adminDetails, setAdminDetails] = useState<any>(null);
    const [queueMetrics, setQueueMetrics] = useState({
        totalAppointments: 0,
        averageWaitTime: 0,
        completionRate: 0,
        cancelRate: 0,
        todayAppointments: 0,
        currentlyServing: 0
    });
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            
            try {
                const supabase = createClient();
                
                // Get admin details
                const { data: admin, error: adminError } = await supabase
                    .from("admins")
                    .select("hospital_id, department_id")
                    .eq("id", user.id)
                    .single();
                
                if (adminError) throw adminError;
                setAdminDetails(admin);
                
                // Get today's date
                const today = format(new Date(), "yyyy-MM-dd");
                
                // Get appointment metrics
                const { data: appointments, error: apptError } = await supabase
                    .from("appointments")
                    .select("id, status, called_at, completed_at, date")
                    .eq("hospital_id", admin.hospital_id)
                    .eq("department_id", admin.department_id);
                
                if (apptError) throw apptError;
                
                const totalAppointments = appointments.length;
                const todayAppointments = appointments.filter(a => a.date === today).length;
                const completed = appointments.filter(a => a.status === "completed").length;
                const cancelled = appointments.filter(a => a.status === "cancelled").length;
                const currentlyServing = appointments.filter(a => a.status === "in-progress" && a.date === today).length;
                
                // Calculate wait times for completed appointments
                const waitTimes = appointments
                    .filter(a => a.status === "completed" && a.called_at && a.completed_at)
                    .map(a => {
                        const calledTime = new Date(a.called_at).getTime();
                        const completedTime = new Date(a.completed_at).getTime();
                        return (completedTime - calledTime) / (1000 * 60); // in minutes
                    });
                
                const averageWaitTime = waitTimes.length > 0 
                    ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length) 
                    : 0;
                
                setQueueMetrics({
                    totalAppointments,
                    averageWaitTime,
                    completionRate: totalAppointments > 0 ? Math.round((completed / totalAppointments) * 100) : 0,
                    cancelRate: totalAppointments > 0 ? Math.round((cancelled / totalAppointments) * 100) : 0,
                    todayAppointments,
                    currentlyServing
                });
                
            } catch (error) {
                console.error("Error fetching queue status:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [user]);

    if (loading) {
        return (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        );
    }

    return (
        <div className="px-2 py-4">
            <h1 className="text-2xl font-bold mb-6">Queue Status</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueMetrics.todayAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            Total appointments scheduled for today
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Currently Serving</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueMetrics.currentlyServing}</div>
                        <p className="text-xs text-muted-foreground">
                            Patients currently being served
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average Service Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueMetrics.averageWaitTime} min</div>
                        <p className="text-xs text-muted-foreground">
                            Average time to serve a patient
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Check className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueMetrics.completionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Of all appointments completed successfully
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
                        <X className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueMetrics.cancelRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Of all appointments cancelled
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueMetrics.totalAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            Total appointments handled
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}