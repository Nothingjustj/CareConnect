"use client"

import { RootState } from "@/store/store";
import { ActivityIcon, CalendarCheck2Icon, CalendarPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashboardPage() {

    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (!user.id) {
            router.push('/login');
        }
    }, [user])

    return (
            <main className="py-6 px-2">
                <h1 className="text-xl md:text-3xl font-medium md:mb-1">Welcome, 
                    <span className="font-bold"> {user?.name}</span> 👋
                </h1>
                <h2 className="text-muted-foreground text-sm md:text-lg">Book your appointment and track your opds.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                    <Link href="/dashboard/book-opd" className="bg-muted p-4 rounded-xl border hover:border-primary">
                        <CalendarPlusIcon className="text-primary w-7 h-7 md:w-8 md:h-8" />
                        <h3 className="md:text-xl text-lg font-semibold mt-2">Book OPD</h3>
                        <p className="text-sm md:text-base">Book an OPD appointment online by filling the application form</p>
                    </Link>
                    <Link href="/dashboard/track-opd" className="bg-muted p-4 rounded-xl border hover:border-primary">
                        <ActivityIcon className="text-primary w-7 h-7 md:w-8 md:h-8" />
                        <h3 className="md:text-xl text-lg font-semibold mt-2">Track OPD</h3>
                        <p className="text-sm md:text-base">Track your OPD appointment online by entering the token no.</p>
                    </Link>
                    <Link href="/dashboard/appointments" className="bg-muted p-4 rounded-xl border hover:border-primary">
                        <CalendarCheck2Icon className="text-primary w-7 h-7 md:w-8 md:h-8" />
                        <h3 className="md:text-xl text-lg font-semibold mt-2">View Appointments</h3>
                        <p className="text-sm md:text-base">View all your previously booked appointments</p>
                    </Link>
                </div>
            </main>
    )
}