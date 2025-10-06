import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default async function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    // This is a server component; translate static strings on client entry points instead
    return (
      <div className="relative flex flex-col min-h-screen justify-center bg-sidebar" 
      style={{
        backgroundImage: `radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.3) 0.5px, transparent 0)`,
        backgroundSize: "8px 8px",
        backgroundRepeat: "repeat",
      }}
      >
        <Button className="absolute top-2 left-1" variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-0.5" aria-label="Back to Home">
            <ChevronLeft size={6} />
            Back to Home
          </Link>
        </Button>
        <header className="flex justify-center">
          <Link href="/">
            <Image src="/Whitelogo.png" width={170} height={100} alt="RogitSetu Logo" />
          </Link>
        </header>
        {children}
        <footer className="w-full bg-transparent">
          <p className="text-center text-xs text-muted-foreground">&copy; 2025 RogiSetu | All rights reserved</p>
        </footer>
      </div>
    );
  }