"use server"
// Function related to hospital operation - fetch, add, delete, update
import { createClient } from "@/utils/supabase/server";
import { Hospital } from '../app/super-admin/manage-hospitals/columns';

export async function fetchHospitals() {
    const supabase = await createClient();
    try {
        const { data: hospitals, error: fetchHospitalError } = await supabase.from("hospitals").select("*");
        
        if (fetchHospitalError) throw fetchHospitalError;
        
        return {
            status: "success",
            data: hospitals
        };
    } catch (error) {
        console.error("Error fetching hospitals: ", error);
        return {
            status: "error",
            message: "Failed to fetch hospitals",
            error
        };
    }
}

export async function fetchHospitalById(id: any) {
    const supabase = await createClient();
    try {
        const { data: hospital, error: fetchHospitalError } = await supabase.from("hospitals").select("*").eq("id", id).single();
        
        if (fetchHospitalError) throw fetchHospitalError;
        
        return {
            status: "success",
            data: hospital
        };
    } catch (error) {
        console.error("Error fetching hospital: ", error);
        return {
            status: "error",
            message: "Failed to fetch hospital",
            error
        };
    }
}

export async function addHospital(hospital: Hospital) {
    const supabase = await createClient();
    try {
        const { data: newHospital, error: addHospitalError } = await supabase.from("hospitals").insert([hospital]).select();
        
        if (addHospitalError) throw addHospitalError;
        
        return {
            status: "success",
            data: newHospital
        };
    } catch (error) {
        console.error("Error adding hospital: ", error);
        return {
            status: "error",
            message: "Failed to add hospital",
            error
        };
    }
}

export async function deleteHospital(id: any) {
    const supabase = await createClient();
    try {
        const { data: deletedHospital, error: deleteHospitalError } = await supabase.from("hospitals").delete().eq("id", id).select();
        
        if (deleteHospitalError) throw deleteHospitalError;
        
        return {
            status: "success",
            data: deletedHospital
        };
    } catch (error) {
        console.error("Error deleting hospital: ", error);
        return {
            status: "error",
            message: "Failed to delete hospital",
            error
        };
    }
}

export async function updateHospital(id: any, hospital: Hospital) {
    const supabase = await createClient();
    try {
        const { data: updatedHospital, error: updateHospitalError } = await supabase.from("hospitals").update(hospital).eq("id", id).select();
        
        if (updateHospitalError) throw updateHospitalError;
        
        return {
            status: "success",
            data: updatedHospital
        };
    } catch (error) {
        console.error("Error updating hospital: ", error);
        return {
            status: "error",
            message: "Failed to update hospital",
            error
        };
    }
}