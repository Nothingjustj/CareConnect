"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getUserSession } from "./auth";

export async function bookOpd(formData: FormData) {
    const supabase = await createClient();

    const patientData = {
        name: formData.get("name") as string,
        phone_no: formData.get("phone") as string,
        age: formData.get("age") as string,
        gender: formData.get("gender") as string,
    }

    const result = await getUserSession();
    const user = result?.user;

    if (result?.role === "patient") {   
        const { data, error } = await supabase.from("patients").insert([
            { 
                user_id: user?.id, 
                name: patientData.name, 
                phone_no: patientData.phone_no,
                age: patientData.age, 
                gender: patientData.gender 
            }
        ])

        if (error) {
            return {
                status: "error",
                message: "Failed to register patient"
            }
        }
    } else {
        return {status: "error", message: "Only patient can book opd"}
    }
    // const { data, error } = await supabase.from("appointments")

    revalidatePath("/", "layout")
    return { status: "success" };
}