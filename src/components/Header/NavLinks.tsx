// src/components/Header/NavLinks.tsx (modified)
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { PWAInstallButton } from "../pwa-install-button";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function NavLinks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();
  const pathname = usePathname();

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navlinks = [
    {
      name: t("nav.home"),
      url: "/",
      active: true,
    },
    {
      name: t("nav.features"),
      url: "/#features",
      active: true,
    },
    {
      name: t("nav.solutions"),
      url: "/#solutions",
      active: true,
    },
    {
      name: t("nav.track_token"),
      url: "/track-token",
      active: true,
    },
    {
      name: t("nav.about"),
      url: "/about",
      active: true,
    },
    {
      name: t("nav.contact"),
      url: "/contact",
      active: true,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {navlinks.map((navlink, index) => (
          <Link
            key={index}
            href={navlink.url}
            className={`transition duration-300 text-foreground/60 font-medium hover:text-foreground text-sm ${
              pathname === navlink.url ? "text-gray-700 font-medium" : ""
            }`}
          >
            {navlink.name}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        id="menu-btn"
        className="md:hidden text-foreground hover:text-primary focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu (dropdown style as in the generated landing page) */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-12 border rounded-xl left-0 right-0 bg-background backdrop-blur-sm shadow-lg ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-10 space-y-1 sm:px-3">
          {navlinks.map((navlink) => (
            <Link
              key={navlink.name}
              href={navlink.url}
              className={`block px-3 py-2 rounded-md transition duration-300 hover:bg-muted ${
                pathname === navlink.url ? "text-primary font-medium" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {navlink.name}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 border-t border-gray-200 flex flex-col gap-2 px-3">
            <PWAInstallButton />
            <Button variant="outline" asChild>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}