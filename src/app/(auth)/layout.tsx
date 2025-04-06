import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return (
      <div className="relative flex flex-col min-h-screen justify-center" 
      style={{
        backgroundImage: `radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.3) 0.5px, transparent 0)`,
        backgroundSize: "8px 8px",
        backgroundRepeat: "repeat",
      }}
      >
        <Button className="absolute top-2 left-2" variant="outline" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1" aria-label="Back to Home">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <header className="flex justify-center">
          <Link href="/">
            <Image src="/logo.png" width={170} height={100} alt="RogitSetu Logo" />
          </Link>
        </header>
        {children}
        <footer className="w-full bg-transparent">
          <p className="text-center text-xs text-muted-foreground">&copy; 2025 RogiSetu | All rights reserved</p>
        </footer>
      </div>
    );
  }