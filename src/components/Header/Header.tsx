import Link from "next/link";
import NavLinks from "./NavLinks";
import { Button } from "../ui/button";
import Logo from "/public/logo.png"
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Logout from "../Logout";

export default async function Header () {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 border-b border-b-secondary py-5 px-4 md:px-12 bg-background/90 backdrop-blur">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/">
                <Image src={Logo} alt="RogiSetu Header Logo Image" className="max-w-40" />
                </Link>
                <NavLinks />
                {/* (condition) ? true : false */}
                {!user ? 
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Register</Link>
                    </Button>
                </div>
                : <div className="flex gap-2 items-center">
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Logout />
                </div>}
            </div>
        </header>
    )
}