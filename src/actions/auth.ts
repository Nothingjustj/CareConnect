"use server"

import { redirect } from "next/navigation"
// import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function getUserSession () {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    const { data: profile, error: profilesError } = await supabase.from("profiles").select("role").eq("id", data?.user?.id).single();

    if (error) {
        return null;
    }
    else if(profilesError) {
        return null;
    }
    else {
        return {status: "success", user: data?.user, email: data?.user?.email, role: profile?.role, name: data?.user?.user_metadata?.name};
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
                phoneNo: credentials.phoneNo
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

    const { error: profilesError } = await supabase.from("profiles").insert([
        { id: data.user?.id, name: credentials.name, role: "patient", phone_no: credentials.phoneNo , email: data.user?.email }
    ])

    if(profilesError){
        return{
            status: profilesError.message,
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

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data?.user?.id).single();

    // const { error: roleError, data: roleData } = await supabase.from("roles").select("role").eq("user_id", data.user.id).single();

    // if(roleError) {
    //     return {
    //         status: roleError.message,
    //         user: null,
    //         role: null
    //     }
    // } else if (roleData.role) {
    //     return {
    //         status: "success",
    //         user: data.user,
    //         role: roleData.role
    //     }
    // } 

    // TODO :: Create a user instance in user_profiles table
    // const {data: existingUser} = await supabase
    // .from("user_profiles")
    // .select("*")
    // .eq("email", credentials.email)
    // .limit(1)
    // .single();

    // if (!existingUser) {
    //     const { data: user, error: insertError } = await supabase.from("user_profiles").insert({
    //         email: data?.user.email,
    //         username: data?.user?.user_metadata.name
    //     })
    //     if (insertError) {
    //         return {
    //             status: insertError?.message,
    //             user: null
    //         }
    //     }

    // }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user, role: profile?.role, email: data.user.email, name: data.user.user_metadata.name, userId: data.user.id };
    // return { status: "success", user: data.user, role: roleData.role };
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
export async function signUpAsDeptAdmin (formData: FormData) {
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
                name: credentials.name
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

    const { error: profilesError } = await supabase.from("profiles").insert([
        { 
            id: data.user?.id, 
            name: credentials.name, 
            role: "department_admin", 
            email: data.user?.email, 
            hospital_id: credentials.hospitalId, 
            department_id: credentials.departmentId
        }
    ])

    if(profilesError){
        return{
            status: profilesError.message,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user };
}

// For handling hospital admin
export async function signUpAsHospitalAdmin (formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        hospitalId: formData.get("hospital") as string,
    }
    

    const {error: authError, data} = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                name: credentials.name
            }
        }
    })

    if (authError) {
        return {
            status: `AuthError :: ${authError.message}`,
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

    const { error: profilesError } = await supabase.from("profiles").insert([
        { 
            id: data.user?.id, 
            name: credentials.name, 
            role: "hospital_admin", 
            email: data.user?.email, 
            hospital_id: credentials.hospitalId,
        }
    ])

    if(profilesError){
        return{
            status: `ProfilesError :: ${profilesError.message}`,
            user: null,
            role: null
        }
    }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user };
}