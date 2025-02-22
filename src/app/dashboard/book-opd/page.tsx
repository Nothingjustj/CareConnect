"use client"

import BookOpdForm from "@/components/book-opd-form";
import LoadingSpinner from "@/components/loading-screen";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookOpd() {

    const [loading, setLoading] = useState(true);
    const [hospitals, setHospitals] = useState<any>([]);

    useEffect(() => {
      const fetchHospitals = async () => {
        try {
            const supabase = createClient();
            const {data, error} = await supabase.from("hospitals").select("*");
            if (error) {
                console.error(error);
                toast.error("Failed to fetch hospitals");
            } else {
                setHospitals(data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(`Error fetching hospitals: ${error}`);
        }
      }

      fetchHospitals();
    }, [])
    
    
    if (loading) {
        return <LoadingSpinner />;
    }
    

    return (
        <div className="px-2 w-full max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">Book OPD</h1>
            <p className="text-muted-foreground mt-1 text-lg">Fill in your details to get an appointment token</p>
            <div className="my-6">
                <BookOpdForm hospitals={hospitals} />
            </div>
        </div>
    )
}