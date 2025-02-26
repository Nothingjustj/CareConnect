import { getUserSession } from "@/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const userSession = await getUserSession();
    
    if (userSession?.user) {
        redirect('/');
    }

    return (
      <>
        <header className="flex justify-center pt-10">
          <Link href="/">
            <Image src="/logo.png" width={170} height={100} alt="RogitSetu Logo" />
          </Link>
        </header>
        {children}
        <footer className="w-full bg-background">
          <p className="text-center text-xs p-4 text-muted-foreground">&copy; 2025 RogiSetu | All rights reserved</p>
        </footer>
      </>
    );
  }