"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import DepartmentUtilizationChart from "@/components/analytics/department-utilization";

type Department = {
    id: number;
    name: string;
};

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [addedDepartments, setAddedDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [hospital, setHospital] = useState<string | null>(null);
    const [hospitalId, setHospitalId] = useState<string | null>(null);
    const [dailyTokenLimit, setDailyTokenLimit] = useState("");
    const [loading, setLoading] = useState(true);

    const userId = useSelector((state: RootState) => state.user.id);

    // Combined fetch function to ensure proper sequencing
    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Step 1: Fetch hospital details
            const supabase = createClient();
            const { data: admin, error } = await supabase
                .from("admins")
                .select("hospital_id")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching hospital ID:", error);
                toast.error("Failed to fetch hospital data.");
                return;
            }

            if (admin?.hospital_id) {
                setHospitalId(admin.hospital_id);
                
                // Step 2: Fetch hospital name
                const { data: hospitalData, error: hospitalError } = await supabase
                    .from("hospitals")
                    .select("name")
                    .eq("id", admin.hospital_id)
                    .single();

                if (hospitalError) {
                    console.error("Error fetching hospital name:", hospitalError);
                } else {
                    setHospital(hospitalData?.name || "Unknown Hospital");
                }

                // Step 3: Fetch all department types
                const { data: deptData, error: deptError } = await supabase
                    .from("department_types")
                    .select("id, name");

                if (deptError) {
                    console.error("Error fetching department types:", deptError);
                    toast.error("Failed to fetch department types.");
                    return;
                }

                setDepartments(deptData || []);

                // Step 4: Fetch departments added to this hospital
                const { data: hospitalDepts, error: hospitalDeptError } = await supabase
                    .from("hospital_departments")
                    .select("department_type_id")
                    .eq("hospital_id", admin.hospital_id);

                if (hospitalDeptError) {
                    console.error("Error fetching hospital departments:", hospitalDeptError);
                    toast.error("Failed to fetch added departments.");
                    return;
                }

                // Step 5: Filter departments to get added ones
                const addedDeptIds = hospitalDepts.map((item: any) => item.department_type_id);
                const addedDeptDetails = deptData.filter((d) => addedDeptIds.includes(d.id));
                setAddedDepartments(addedDeptDetails);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while loading data.");
        } finally {
            setLoading(false);
        }
    };

    // Single useEffect to trigger the data fetch
    useEffect(() => {
        if (userId) {
            fetchAllData();
        }
    }, [userId]);

    // Get unadded departments
    const unaddedDepartments = departments.filter(
        (dept) => !addedDepartments.some((added) => added.id === dept.id)
    );

    const handleAddDepartment = async () => {
        if (!selectedDepartment || !hospitalId) {
            toast.error("Please select a department");
            return;
        }
        
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("hospital_departments")
                .insert([{ 
                    hospital_id: hospitalId, 
                    department_type_id: selectedDepartment, 
                    daily_token_limit: dailyTokenLimit || "50",
                    status: true,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            const addedDept = departments.find((d) => d.id === selectedDepartment);
            if (addedDept) {
                setAddedDepartments([...addedDepartments, addedDept]);
            }

            setSelectedDepartment(null);
            setDailyTokenLimit("");
            toast.success("Department added successfully!");
            
            // Refresh data to ensure UI is up to date
            fetchAllData();
        } catch (error) {
            console.error("Error adding department:", error);
            toast.error("Failed to add department.");
        }
    };

    const handleRemoveDepartment = async (departmentId: number) => {
        if (!hospitalId) return;
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("hospital_departments")
                .delete()
                .match({ hospital_id: hospitalId, department_type_id: departmentId });

            if (error) throw error;

            setAddedDepartments(addedDepartments.filter((d) => d.id !== departmentId));
            toast.success("Department removed successfully!");
        } catch (error) {
            console.error("Error removing department:", error);
            toast.error("Failed to remove department.");
        }
    };

    return (
        <div className="px-2 py-6">
            <h1 className="text-2xl font-semibold">Manage Departments</h1>
            <div className="mt-4">
                <h2>
                    <strong>Hospital Name:</strong> {hospital || "Loading..."}
                </h2>
            </div>
            
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 items-center gap-4 my-8">
                        <div className="flex flex-col gap-2">
                            <Label>Department:</Label>
                            <Select 
                                onValueChange={(value) => setSelectedDepartment(Number(value))} 
                                value={selectedDepartment?.toString() || ""}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {unaddedDepartments.length > 0 ? (
                                            unaddedDepartments.map((department) => (
                                                <SelectItem key={department.id} value={department.id.toString()} className="truncate">
                                                    {department.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value={"No departments available"} disabled>
                                                No departments available
                                            </SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Daily Token Limit</Label>
                            <Input 
                                className="" 
                                placeholder="Default: 50" 
                                type="number" 
                                value={dailyTokenLimit} 
                                onChange={(e) => setDailyTokenLimit(e.target.value)} 
                            />
                        </div>
                        <Button 
                            className="mt-4 col-span-2" 
                            onClick={handleAddDepartment} 
                            disabled={!selectedDepartment}
                        >
                            Add Department
                        </Button>
                    </div>

                    {/* Added Departments List */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Added Departments</h2>
                        {addedDepartments.length > 0 ? (
                            <ul className="mt-2">
                                {addedDepartments.map((department) => (
                                    <li key={department.id} className="flex justify-between items-center p-2 border-b">
                                        <span>{department.name}</span>
                                        <Button
                                            className="bg-red-500 hover:bg-red-600"
                                            onClick={() => handleRemoveDepartment(department.id)}
                                        >
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-2">No departments added.</p>
                        )}
                    </div>
                    <div className="mt-8">
                        {hospitalId && <DepartmentUtilizationChart hospitalId={hospitalId} />}
                    </div>
                </>
            )}
        </div>
    );
}