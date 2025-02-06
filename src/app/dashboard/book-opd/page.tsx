import BookOpdForm from "@/components/book-opd-form";
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";

export default async function BookOpd() {

    const supabase = await createClient();

    const {data: hospitalsData, error: hospitalsError} = await supabase.from("hospitals").select("*");

    if(hospitalsError) {
        console.error(hospitalsError);
        toast.error(`Error fetching hospitals :: ${hospitalsError.message}`);
    }

    return (
        <div className="p-6 w-full max-w-4xl mx-auto my-6">
            <h1 className="text-2xl md:text-3xl font-bold">Book OPD</h1>
            <p className="text-muted-foreground mt-1 text-lg">Fill in your details to get an appointment token</p>
            <div className="my-6">
                <BookOpdForm hospitals={hospitalsData} />
            </div>
        </div>
    )
}