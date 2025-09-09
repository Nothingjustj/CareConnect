"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function getUserSession () {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Error getting user session:", error.message);
        return null;
    }
    else {
        return {
            status: "success", 
            user: data?.user, 
            email: data?.user?.email, 
            name: data?.user?.user_metadata?.name,
            role: data?.user.user_metadata?.role, 
        };
    }
}

export async function signUp (formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phoneNo: formData.get("phone") as string,
    }

    const {error: authError, data} = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                name: credentials.name,
                phoneNo: credentials.phoneNo,
                role: "patient"
            }
        }
    })

    if (authError) {
        console.error("Error during signup:", authError.message);
        return {
            status: authError?.message,
            user: null,
            role: null
        }
    } else if (data?.user?.identities?.length === 0) {
        return {
            status: "User with this email already exists",
            user: null,
            role: null
        }
    }

    // Create patient record with user ID as the patient ID
    const { error: patientsError } = await supabase.from("patients").insert([
        {
            id: data?.user?.id, // Use user ID as patient ID
            user_id: data?.user?.id,
            name: credentials.name,
            phone_no: credentials.phoneNo,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ])

    if (patientsError) {
        console.error("Error creating patient record:", patientsError.message, patientsError.code, patientsError.details);
        return {
            status: `Failed to create patient record: ${patientsError.message}`,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")
    // redirect("/dashboard")
    return { status: "success", user: data.user };

}

export async function signIn (formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error, data } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
    })

    if (error) {
        console.error("Error during signin:", error.message);
        return {
            status: error?.message,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")

    return { 
        status: "success", 
        user: data.user, 
        role: data.user.user_metadata.role, 
        email: data.user.email, 
        name: data.user.user_metadata.name, 
        userId: data.user.id 
    };
}

export async function signOut () {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error logging out:", error.message);
        throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    return "success";
}



// For handling department admins
export default async function signUpAsDeptAdmin(formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        hospitalId: formData.get("hospitalId") as string,
        departmentId: formData.get("departmentId") as string,
        phoneNo: formData.get("phone") as string,
    }

    const {error: authError, data} = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                name: credentials.name,
                phoneNo: credentials.phoneNo,
                role: "department_admin"
            }
        }
    })

    if (authError) {
        console.error("Error creating department admin:", authError.message);
        return {
            status: authError?.message,
            user: null,
            role: null
        }
    } else if (data?.user?.identities?.length === 0) {
        return {
            status: "User with this email already exists",
            user: null,
            role: null
        }
    }

    try {
        // Debug log to see the exact values
        console.log("Admin creation values:", {
            id: data.user?.id,
            name: credentials.name,
            role: "department_admin",
            email: data.user?.email,
            phone_no: credentials.phoneNo,
            hospital_id: credentials.hospitalId,
            department_id: parseInt(credentials.departmentId)
        });

        const { error: adminsError } = await supabase.from("admins").insert([
            { 
                id: data.user?.id, 
                name: credentials.name, 
                role: "department_admin", 
                email: data.user?.email, 
                phone_no: credentials.phoneNo,
                hospital_id: credentials.hospitalId, 
                department_id: parseInt(credentials.departmentId) // Make sure this is a number
            }
        ]);

        if(adminsError){
            console.error("Error creating admin record:", adminsError.message, adminsError.code, adminsError.details);
            return{
                status: `Failed to create admin record: ${adminsError.message}`,
                user: null,
                role: null
            }
        }
    } catch (error) {
        console.error("Exception in admin creation:", error);
        return {
            status: `Exception in admin creation: ${error instanceof Error ? error.message : String(error)}`,
            user: null,
            role: null
        };
    }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user };
}

// For handling hospital admin
export async function createHospitalAdmin (formData: FormData) {
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string
    );

    const credentials = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        hospitalId: formData.get("hospital") as string,
        phoneNo: formData.get("phone") as string, // Add phone number
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
        email: credentials.email,
        password: credentials.password,
        email_confirm: true,
        user_metadata: {
            name: credentials.name,
            phoneNo: credentials.phoneNo, // Include phone in metadata
            role: "hospital_admin",
            hospitalId: credentials.hospitalId
        }
    });

    if (error) {
        console.error("Error creating hospital admin:", error.message);
        return {
            status: `Error in creating user :: ${error.message}`,
        }
    } else if (data?.user?.identities?.length === 0) {
        return {
            status: "User with this email already exists",
            user: null,
            role: null
        }
    }

    const { error: adminsError } = await supabase.from("admins").insert([
        { 
            id: data.user?.id, 
            name: credentials.name, 
            role: "hospital_admin", 
            email: data.user?.email, 
            phone_no: credentials.phoneNo, // Add phone number
            hospital_id: credentials.hospitalId,
        }
    ])

    if(adminsError){
        console.error("Error creating admin record:", adminsError.message, adminsError.code, adminsError.details);
        return{
            status: `AdminsError :: ${adminsError.message}`,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user };
}