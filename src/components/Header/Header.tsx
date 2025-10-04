"use client"
import Link from "next/link";
import NavLinks from "./NavLinks";
import { Button } from "../ui/button";
import Logo from "/public/logoCare.png"
import Image from "next/image";
import { PWAInstallButton } from "../pwa-install-button";
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useState } from "react";

export default function Header() {
  
  const [visible, setVisible] = useState<boolean>(false);
  const { scrollY } = useScroll({
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 150) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });
  

  return (
    <motion.header className={`sticky top-0 py-5 px-4 md:px-12 bg-transparent backdrop-blur z-30 ${visible ? "!bg-background/90 border-b border-b-secondary" : "" }`}
      initial={{ y: -10, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
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
    </motion.header>
  );
}