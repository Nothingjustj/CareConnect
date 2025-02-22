import Link from "next/link";
import NavLinks from "./NavLinks";
import { Button } from "../ui/button";
import Logo from "/public/logo.png"
import Image from "next/image";

export default function Header () {
    return (
        <header className="sticky top-0 border-b border-b-secondary py-5 px-4 md:px-12 bg-background/90 backdrop-blur">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/">
                <Image src={Logo} alt="RogiSetu Header Logo Image" className="max-w-40" />
                </Link>
                <NavLinks />
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Register</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}