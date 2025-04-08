"use client";

import { getUserAppointments } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-screen";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Hospital } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedToken, setHighlightedToken] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a token parameter in the URL (for highlighting newly booked appointments)
    const token = searchParams.get('token');
    if (token) {
      setHighlightedToken(token);
      // Clear the highlight after 5 seconds
      setTimeout(() => setHighlightedToken(null), 5000);
    }
    
    fetchAppointments();
  }, [searchParams]);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const result = await getUserAppointments();
      
      if (result.status === "success") {
        setAppointments(result.appointments || []);
      } else {
        console.error("Error fetching appointments:", result.message);
        toast.error(result.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(`An error occurred while fetching appointments: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce((groups: any, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-2 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">My Appointments</h1>
        <Button className="hidden md:block" asChild>
          <Link href="/dashboard/book-opd">Book New Appointment</Link>
        </Button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any appointments yet.</p>
          <Button asChild>
            <Link href="/dashboard/book-opd">Book Your First Appointment</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="font-semibold text-lg mb-3 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {formatDate(date)}
              </h2>
              <div className="space-y-4">
                {groupedAppointments[date].map((appointment: any) => (
                  <div 
                    key={appointment.id} 
                    className={`p-4 rounded-lg border ${
                      highlightedToken === appointment.token_number 
                        ? 'bg-green-50 border-green-300 animate-pulse' 
                        : 'bg-primary-foreground'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Hospital className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{appointment.hospitals.name}</h3>
                        </div>
                        <p className="text-muted-foreground mt-1">{appointment.departments.name} Department</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{appointment.time_slot}</span>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end">
                        <div className="px-3 py-1 bg-primary text-primary-foreground rounded-md font-semibold">
                          {appointment.token_number}
                        </div>
                        <Button 
                          variant="link" 
                          className="mt-2 h-auto p-0" 
                          asChild
                        >
                          <Link href={`/dashboard/track-opd?token=${appointment.token_number}`}>
                            Track Status
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}