"use client"

import BookOpdForm from "@/components/book-opd-form";
import LoadingSpinner from "@/components/loading-screen";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookOpd() {
    const [loading, setLoading] = useState(true);
    const [hospitals, setHospitals] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const supabase = createClient();
                const {data, error} = await supabase.from("hospitals").select("*");
                if (error) {
                    console.error("Error fetching hospitals:", error.message, error.code, error.details);
                    setError(`Failed to fetch hospitals: ${error.message}`);
                    toast.error(`Failed to fetch hospitals: ${error.message}`);
                } else {
                    setHospitals(data);
                }
            } catch (error) {
                console.error("Exception fetching hospitals:", error);
                setError(`Error fetching hospitals: ${error instanceof Error ? error.message : String(error)}`);
                toast.error(`Error fetching hospitals: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(false);
            }
        }

      fetchHospitals();
    }, [])
    
    
    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return (
            <div className="px-2 py-6 w-full max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold">Book OPD</h1>
                <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                    <button 
                        className="mt-4 text-primary underline"
                        onClick={() => window.location.reload()}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-2 py-6 w-full max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">Book OPD</h1>
            <p className="text-muted-foreground md:mt-1 text-sm md:text-lg">Fill in your details to get an appointment token</p>
            <div className="my-6">
                <BookOpdForm hospitals={hospitals} />
            </div>
        </div>
    )
}