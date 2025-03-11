"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function getUserSession () {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
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

    const { error: patientsError } = await supabase.from("patients").insert([
        {
            id: data?.user?.id,
            name: credentials.name,
            phone_no: credentials.phoneNo
        }
    ])

    if (patientsError) {
        return {
            status: patientsError.message,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")
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
        return (
            console.error("Error logging out...", error),
            redirect("/error")
        );
    }

    revalidatePath("/", "layout");
    redirect("/");
}


// Methods for handling department admins
export default async function signUpAsDeptAdmin (formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        hospitalId: formData.get("hospitalId") as string,
        departmentId: formData.get("departmentId") as string,
    }

    const {error: authError, data} = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                name: credentials.name,
                role: "department_admin"
            }
        }
    })

    if (authError) {
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

    const { error: adminsError } = await supabase.from("admins").insert([
        { 
            id: data.user?.id, 
            name: credentials.name, 
            role: "department_admin", 
            email: data.user?.email, 
            hospital_id: credentials.hospitalId, 
            department_id: credentials.departmentId
        }
    ])

    if(adminsError){
        return{
            status: adminsError.message,
            user: null,
            role: null
        }
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
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
        email: credentials.email,
        password: credentials.password,
        email_confirm: true,
        user_metadata: {
            name: credentials.name,
            role: "hospital_admin",
            hospitalId: credentials.hospitalId
        }
    });

    if (error) {
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
            hospital_id: credentials.hospitalId,
        }
    ])

    if(adminsError){
        return{
            status: `AdminsError :: ${adminsError.message}`,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user };
}