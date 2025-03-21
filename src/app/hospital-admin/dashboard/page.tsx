// src/app/hospital-admin/dashboard/page.tsx
"use client"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import AnalyticsSummaryCard from "@/components/analytics/summary-card"

export default function HospitalAdminDashboard () {
    const user = useSelector((state: RootState) => state.user);
    const [hospitalId, setHospitalId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchHospitalId = async () => {
            if (!user?.id) return;
            
            const supabase = createClient();
            const { data, error } = await supabase
                .from("admins")
                .select("hospital_id")
                .eq("id", user.id)
                .single();
                
            if (!error && data) {
                setHospitalId(data.hospital_id);
            }
        };
        
        fetchHospitalId();
    }, [user]);

    return (
        <div className="py-6 px-2">
            <h1 className="text-2xl font-semibold">Welcome {user.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {hospitalId && (
                    <AnalyticsSummaryCard 
                        hospitalId={hospitalId} 
                        linkTo="/hospital-admin/analytics" 
                    />
                )}
                {/* Other dashboard cards can go here */}
            </div>
        </div>
    )
}