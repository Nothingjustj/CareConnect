"use client"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import AnalyticsSummaryCard from "@/components/analytics/summary-card"
import Link from "next/link"
import { Building2Icon, Hospital, Users } from "lucide-react"

export default function HospitalAdminDashboard () {
    const user = useSelector((state: RootState) => state.user);
    const [hospitalId, setHospitalId] = useState<string | undefined>(undefined);
    const [hospitalName, setHospitalName] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminHospitalDetails = async () => {
            if (!user?.id) return;
            
            setLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from("admins")
                .select("hospital_id") // Select only hospital_id first
                .eq("id", user.id)
                .single();
                
            if (!error && data) {
                const fetchedHospitalId = data.hospital_id;
                setHospitalId(fetchedHospitalId);

                // Now fetch hospital name using the fetched ID
                if (fetchedHospitalId) {
                    const { data: hospData, error: hospError } = await supabase
                        .from("hospitals")
                        .select("name")
                        .eq("id", fetchedHospitalId)
                        .single();
                    if (!hospError && hospData) {
                        setHospitalName(hospData.name);
                    }
                }
            }
            setLoading(false);
        };
        
        fetchAdminHospitalDetails();
    }, [user]);

    return (
        <div className="py-6 px-2">
            <h1 className="text-xl md:text-3xl font-medium mb-1 md:mb-2">Welcome, 
                <span className="font-bold"> {user.name} 👋</span>
            </h1>
            <h2 className="text-sm md:text-lg text-muted-foreground">
                {loading ? "Loading hospital..." : 
                 hospitalName ? <p>Hospital: <span className="font-medium">{hospitalName}</span></p> : "Hospital Admin Dashboard"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {hospitalId && (
                    <AnalyticsSummaryCard 
                        hospitalId={hospitalId} 
                        linkTo="/hospital-admin/analytics" 
                    />
                )}
                <Link href="departments" className="bg-muted p-4 rounded-xl border hover:border-primary">
                    <Building2Icon className="text-primary w-8 h-8 md:w-10 md:h-10" />
                    <h3 className="text-lg md:text-xl font-semibold mt-2 md:mt-4">Manage Departments</h3>
                    <p className="text-sm md:text-base">Manage all your hospital departments</p>
                </Link>
                <Link href="staffs" className="bg-muted p-4 rounded-xl border hover:border-primary">
                    <Users className="text-primary w-8 h-8 md:w-10 md:h-10" />
                    <h3 className="text-lg md:text-xl font-semibold mt-2 md:mt-4">Manage Staffs</h3>
                    <p className="text-sm md:text-base">Manage all your department admins in your hospital</p>
                </Link>
            </div>
        </div>
    )
}