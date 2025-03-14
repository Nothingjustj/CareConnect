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

    const userId = useSelector((state: RootState) => state.user.id);

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const supabase = createClient();
                const { data: admin, error } = await supabase
                    .from("admins")
                    .select("hospital_id")
                    .eq("id", userId)
                    .single();

                // if (error) throw error;
                if (admin?.hospital_id) {
                    setHospitalId(admin.hospital_id);
                    const { data: hospitalData, error: hospitalError } = await supabase
                        .from("hospitals")
                        .select("name")
                        .eq("id", admin.hospital_id)
                        .single();

                    // if (hospitalError) throw hospitalError;
                    setHospital(hospitalData?.name || "Unknown Hospital");
                }
            } catch (error) {
                console.error("Error fetching hospital:", error);
                toast.error("Failed to fetch hospital data.");
            }
        };

        const fetchDepartments = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.from("department_types").select("id, name");

                if (error) throw error;
                setDepartments(data || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
                toast.error("Failed to fetch department types.");
            }
        };

        const fetchAddedDepartments = async () => {
            if (!hospitalId) return;
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("hospital_departments")
                    .select("department_type_id")
                    .eq("hospital_id", hospitalId);

                if (error) throw error;

                const addedDeptIds = data.map((item: any) => item.department_type_id);
                const addedDeptDetails = departments.filter((d) => addedDeptIds.includes(d.id));

                setAddedDepartments(addedDeptDetails);
            } catch (error) {
                console.error("Error fetching added departments:", error);
                toast.error("Failed to fetch added departments.");
            }
        };

        fetchHospital();
        fetchDepartments();
        fetchAddedDepartments();
    }, [userId, hospitalId]);

    // Get unadded departments
    const unaddedDepartments = departments.filter(
        (dept) => !addedDepartments.some((added) => added.id === dept.id)
    );

    const handleAddDepartment = async () => {
        if (!selectedDepartment || !hospitalId) return;
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("hospital_departments")
                .insert([{ hospital_id: hospitalId, department_type_id: selectedDepartment, daily_token_limit: dailyTokenLimit }]);

            if (error) throw error;

            const addedDept = departments.find((d) => d.id === selectedDepartment);
            if (addedDept) {
                setAddedDepartments([...addedDepartments, addedDept]);
            }

            setSelectedDepartment(null);
            toast.success("Department added successfully!");
            setDailyTokenLimit("");
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
            <div className="grid grid-cols-2 items-center gap-4 my-8">
                <div className="flex flex-col gap-2">
                    <Label>Department:</Label>
                    <Select onValueChange={(value) => setSelectedDepartment(Number(value))} value={selectedDepartment?.toString() || ""}>
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
                    <Input className="" placeholder="Default: 50" type="number" value={dailyTokenLimit} onChange={(e) => setDailyTokenLimit((e.target.value))} />
                </div>
                <Button className="mt-4 col-span-2" onClick={handleAddDepartment} disabled={!selectedDepartment}>
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
        </div>
    );
}