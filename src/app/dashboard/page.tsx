"use client"

import { RootState } from "@/store/store";
import { 
  ActivityIcon, 
  CalendarCheck2Icon, 
  CalendarPlusIcon, 
  BellIcon, 
  UserIcon, 
  FileTextIcon, 
  ClockIcon 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    if (!user.id) {
      router.push('/login');
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [user, router]);

  // Mocked upcoming appointment for UI demonstration
  const upcomingAppointment = {
    id: "app-123",
    doctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "April 15, 2025",
    time: "10:30 AM",
    status: "confirmed"
  };

  return (
    <main className="py-6 px-2 md:px-4 max-w-7xl mx-auto">
      <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {greeting}, <span className="text-primary">{user?.name}</span> 👋
          </h1>
          <p className="text-muted-foreground text-base">Manage your healthcare journey with ease</p>
      </div>

      {/* Stats Overview */}
      {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Badge variant="outline" className="mb-2 bg-blue-100">Upcoming</Badge>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">Appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Badge variant="outline" className="mb-2 bg-green-100">Complete</Badge>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Past Visits</p>
          </CardContent>
        </Card>
        {upcomingAppointment && (
            <Card className="border-l-4 border-l-primary col-span-4">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                <CardTitle className="text-xl">Next Appointment</CardTitle>
                    <Badge>{upcomingAppointment.status}</Badge>
                </div>
                <CardDescription>Your upcoming appointment details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-blue-100">
                    <AvatarFallback><UserIcon className="h-5 w-5 text-blue-600" /></AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-medium">{upcomingAppointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{upcomingAppointment.department}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                    <CalendarCheck2Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                    <p className="font-medium">{upcomingAppointment.date}</p>
                    <p className="text-sm text-muted-foreground">Appointment Date</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                    <p className="font-medium">{upcomingAppointment.time}</p>
                    <p className="text-sm text-muted-foreground">Appointment Time</p>
                    </div>
                </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button size="sm" asChild><Link href="/dashboard/appointments">View Details</Link></Button>
            </CardFooter>
            </Card>
        )}
      </div> */}

      

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <CalendarPlusIcon className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book OPD</h3>
            <p className="text-muted-foreground mb-4">Schedule a new outpatient department appointment with your preferred doctor</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/book-opd">Book Now</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <ActivityIcon className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track OPD</h3>
            <p className="text-muted-foreground mb-4">Check the status of your appointment and estimated waiting time</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/track-opd">Track Status</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <FileTextIcon className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">View Appointments</h3>
            <p className="text-muted-foreground mb-4">Access your complete appointment history and medical records</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/appointments">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Health Tips Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-2 rounded-full">
              <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Health Tip of the Day</h3>
          </div>
          <p className="text-muted-foreground">Regular physical activity can help reduce the risk of chronic diseases and improve your mental health. Aim for at least 30 minutes of moderate exercise most days of the week.</p>
        </CardContent>
      </Card>
    </main>
  )
}