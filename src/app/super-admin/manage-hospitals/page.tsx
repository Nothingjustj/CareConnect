"use client";
import { useState, useEffect } from "react";
import type { Hospital } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { RefreshCcw } from "lucide-react";
import { AddHospitalBtn } from "@/components/add-hospital-form";
import { toast } from "sonner";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    const supabase = createClient();
    
    const fetchPromise = new Promise(async (resolve, reject) => {
      try {
        const { data, error } = await supabase
          .from("hospitals")
          .select("*")
          .order("name");
  
        if (error) throw error;
        setHospitals(data || []);
        resolve("Hospitals fetched successfully");
      } catch (error) {
        setError((error as Error).message);
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  
    toast.promise(fetchPromise, {
      loading: "Fetching hospitals...",
      success: "Hospitals loaded successfully!",
      error: "Failed to fetch hospitals. Please try again.",
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="px-2 my-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Manage Hospitals</h1>
          <p className="text-muted-foreground">
            Here is the list of govt hospitals currently present in Mumbai
          </p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col md:items-center gap-2 md:flex-row">
          <Button size={"sm"} variant={"outline"} onClick={fetchHospitals}>
            <RefreshCcw /> Refresh
          </Button>
          <AddHospitalBtn />
        </div>
      </div>


      <DataTable columns={columns} data={hospitals} />
    </div>
  );
}
