"use server"
// Function related to hospital operation - fetch, add, delete, update
import { createClient } from "@/utils/supabase/server";
import { Hospital } from '../app/super-admin/manage-hospitals/columns';

export async function fetchHospitals() {
    const supabase = await createClient();
    try {
        const { data: hospitals, error: fetchHospitalError } = await supabase.from("hospitals").select("*");
    } catch (error) {
        console.error("Error fetching hospitals: ", error);
    }
}

export async function fetchHospitalById(id: any) {
    const supabase = await createClient();
    try {
        const { data: hospital, error: fetchHospitalError } = await supabase.from("hospitals").select("*").eq("id", id);
    } catch (error) {
        console.error("Error fetching hospital: ", error);
    }
}

export async function addHospital(hospital: Hospital) {
    const supabase = await createClient();
    try {
        const { data: newHospital, error: addHospitalError } = await supabase.from("hospitals").insert([hospital]);
    } catch (error) {
        console.error("Error adding hospital: ", error);
    }
}

export async function deleteHospital(id: any) {
    const supabase = await createClient();
    try {
        const { data: deletedHospital, error: deleteHospitalError } = await supabase.from("hospitals").delete().eq("id", id);
    } catch (error) {
        console.error("Error deleting hospital: ", error);
    }
}

export async function updateHospital(id: any, hospital: Hospital) {
    const supabase = await createClient();
    try {
        const { data: updatedHospital, error: updateHospitalError } = await supabase.from("hospitals").update(hospital).eq("id", id);
    } catch (error) {
        console.error("Error updating hospital: ", error);
    }
}
