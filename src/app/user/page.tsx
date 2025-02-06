import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function UserPage () {

    const supabase = await createClient()

    const {data, error} = await supabase.auth.getUser()

    if (error || !data?.user) {
        redirect("/login");
    }

    return (
        <div className="flex items-center justify-center py-24 font-medium text-4xl">Hello {data?.user.user_metadata.name}</div>
    )
}