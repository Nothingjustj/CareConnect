// src/app/hospital-admin/departments/page.tsx
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
import { Plus, Trash } from "lucide-react";
import { AddHospitalBtn } from "@/components/add-hospital-form";

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

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: admin, error } = await supabase
                .from("admins")
                .select("hospital_id")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching hospital ID:", error);
                toast.error("Failed to fetch hospital data.");
                setLoading(false);
                return;
            }

            if (admin?.hospital_id) {
                setHospitalId(admin.hospital_id);

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

                const { data: deptData, error: deptError } = await supabase
                    .from("department_types")
                    .select("id, name")
                    .order('name');

                if (deptError) {
                    console.error("Error fetching department types:", deptError);
                    toast.error("Failed to fetch department types.");
                    setLoading(false);
                    return;
                }

                setDepartments(deptData || []);

                const { data: hospitalDepts, error: hospitalDeptError } = await supabase
                    .from("hospital_departments")
                    .select("department_type_id")
                    .eq("hospital_id", admin.hospital_id);

                if (hospitalDeptError) {
                    console.error("Error fetching hospital departments:", hospitalDeptError);
                    toast.error("Failed to fetch added departments.");
                    setLoading(false);
                    return;
                }

                const addedDeptIds = hospitalDepts.map((item: any) => item.department_type_id);
                const addedDeptDetails = (deptData || []).filter((d) => addedDeptIds.includes(d.id));
                setAddedDepartments(addedDeptDetails);
            } else {
                toast.error("No hospital assigned to this admin.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while loading data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAllData();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const unaddedDepartments = departments.filter(
        (dept) => !addedDepartments.some((added) => added.id === dept.id)
    );

    const handleAddDepartment = async () => {
        if (!selectedDepartment || !hospitalId) {
            toast.error("Please select a department");
            return;
        }

        if (!dailyTokenLimit) {
            toast.error("Please enter a daily token limit");
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

            if (error) {
                if (error.code === '23505') {
                     toast.error("This department is already added to the hospital.");
                } else {
                    throw error;
                }
            } else {
                const addedDept = departments.find((d) => d.id === selectedDepartment);
                if (addedDept) {
                    setAddedDepartments([...addedDepartments, addedDept]);
                }

                setSelectedDepartment(null);
                setDailyTokenLimit("");
                toast.success("Department added successfully!");
                fetchAllData();
            }
        } catch (error) {
            console.error("Error adding department:", error);
            toast.error(`Failed to add department: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    // FIXED VERSION WITH RESPONSIVE LAYOUT
    return (
        <div className="px-2 pb-10 pt-5 w-full mx-auto">
            <div className="space-y-6 max-w-[100%]">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl md:text-2xl font-bold">Manage Departments</h1>
                    <h2 className="text-sm md:text-lg">
                        <span className="font-semibold">Hospital Name:</span> {hospital || "Loading..."}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Add Department Form */}
                        <div className="bg-white p-6 rounded-lg border shadow-sm max-w-2xl w-full">
                            <h2 className="text-lg font-semibold mb-4">Add Department to Hospital</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Department:</Label>
                                    <Select
                                        onValueChange={(value) => setSelectedDepartment(Number(value))}
                                        value={selectedDepartment?.toString() || ""}
                                    >
                                        <SelectTrigger className="w-full mt-1">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {unaddedDepartments.length > 0 ? (
                                                    unaddedDepartments.map((department) => (
                                                        <SelectItem 
                                                            key={department.id} 
                                                            value={department.id.toString()}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        No more departments to add
                                                    </SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label>Daily Token Limit</Label>
                                    <Input
                                        className="w-full mt-1"
                                        placeholder="Default: 50"
                                        type="number"
                                        value={dailyTokenLimit}
                                        onChange={(e) => setDailyTokenLimit(e.target.value)}
                                    />
                                </div>
                                
                                <Button
                                    onClick={handleAddDepartment}
                                    disabled={!selectedDepartment}
                                    className="w-full"
                                >
                                    Add Department
                                </Button>
                            </div>
                        </div>

                        {/* Added Departments List */}
                        <div className="space-y-4">
                            <h2 className="text-lg md:text-xl font-bold">Added Departments</h2>
                            {addedDepartments.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                    {addedDepartments.map((department) => (
                                        <div 
                                            key={department.id} 
                                            className="bg-white p-3 rounded-lg border flex items-center justify-between shadow-sm"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium">{department.name}</h3>
                                            </div>
                                            <div className="">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveDepartment(department.id)}
                                                    className="w-full flex items-center"
                                                >
                                                    <Trash />
                                                    <span>Remove</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No departments added to this hospital yet.</p>
                            )}
                        </div>

                        {/* Utilization Chart - Now with responsive wrapper */}
                        {hospitalId && (
                            <div className="mt-8">
                                {/* Mobile view - hide chart */}
                                <div className="block sm:hidden">
                                    <p className="text-muted-foreground text-center p-4 bg-muted rounded-lg">
                                        Department utilization chart is available on larger screens
                                    </p>
                                </div>
                                
                                {/* Desktop view - show chart */}
                                <div className="hidden sm:block overflow-hidden">
                                    <div className="border rounded-lg shadow-sm p-4">
                                        <DepartmentUtilizationChart hospitalId={hospitalId} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}