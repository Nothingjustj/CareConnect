"use client"

import { Button } from "./ui/button";
import { useState } from "react";
import { signOut } from "@/actions/auth";

export default function Logout () {

    const [loading, setLoading] = useState<boolean>(false)
    
    const handleLogout = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        // handle the logout functionality here
        await signOut();

        setLoading(false);
    }

    return (
        <form onSubmit={handleLogout}>
            <Button type="submit" variant="secondary" size="sm">
                {loading ? "Logging out..." : "Logout"}
            </Button>
        </form>
    )
}