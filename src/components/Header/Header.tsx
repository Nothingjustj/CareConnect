import Link from "next/link";
import NavLinks from "./NavLinks";
import { Button } from "../ui/button";
import Logo from "/public/logo.png"
import Image from "next/image";
import { PWAInstallButton } from "../pwa-install-button";

export default function Header() {
  return (
    <header className="sticky top-0 border-b border-b-secondary py-5 px-4 md:px-12 bg-background/90 backdrop-blur z-30">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center relative">
        <Link href="/">
          <Image 
            src={Logo} 
            alt="RogiSetu Header Logo Image" 
            className="w-[110px] md:w-[150px] h-auto"
            priority
          />
        </Link>
        <div className="flex gap-2">
          <div className="flex md:hidden">
            <PWAInstallButton />
          </div>
          <NavLinks />
        </div>
          <div className="hidden md:flex gap-1">
            <Button variant="ghost" className="px-3 md:px-4 h-8 md:h-9 text-xs md:text-sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="px-3 md:px-4 h-8 md:h-9 text-xs md:text-sm" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
      </div>
    </header>
  );
}