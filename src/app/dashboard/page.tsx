"use client"

import { RootState } from "@/store/store";
import { Hospital } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashboardPage() {

    const user = useSelector((state: RootState) => state.user);
    // const router = useRouter();

    // useEffect(() => {
    //     if (!user.id) {
    //         router.push('/login');
    //     }
    // }, [user])

    return (
            <main className="py-6 px-2">
                <h1 className="text-2xl md:text-3xl font-semibold">Welcome, <span className="font-bold">{user?.name}</span>👋</h1>
                <h2 className="text-muted-foreground mt-1 text-lg">Book your appointment and track your opds.</h2>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                    <Link href="/dashboard/book-opd" className="bg-muted p-4 rounded-xl border hover:border-primary">
                        <Hospital className="text-primary w-8 h-8" />
                        <h3 className="text-xl font-semibold mt-2">Book OPD</h3>
                        <p>Book an OPD appointment online by filling the application form</p>
                    </Link>
                    <Link href="/dashboard/track-opd" className="bg-muted p-4 rounded-xl border hover:border-primary">
                        <Hospital className="text-primary w-8 h-8" />
                        <h3 className="text-xl font-semibold mt-2">Track OPD</h3>
                        <p>Track your OPD appointment online by entering the token no.</p>
                    </Link>
                </div>
            </main>
    )
}