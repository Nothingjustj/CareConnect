"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navlinks = [
    {
      name: "Home",
      url: "/",
      active: true
    },
    {
      name: "Features",
      url: "#features",
      active: true
    },
    {
      name: "Solutions",
      url: "#solutions",
      active: true
    },
    {
      name: "Benefits",
      url: "#benefits",
      active: true
    },
    {
      name: "How It Works",
      url: "#howItWorks",
      active: true
    },
    {
      name: "Testimonials",
      url: "#testimonials",
      active: true
    },
    {
      name: "Pricing",
      url: "#pricing",
      active: true
    },
    {
      name: "Contact",
      url: "#contact",
      active: true
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {navlinks.map((navlink) => (
          <Link 
            key={navlink.name} 
            href={navlink.url} 
            className="text-zinc-600 hover:text-primary transition duration-300"
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
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu (dropdown style as in the generated landing page) */}
      <div 
        id="mobile-menu" 
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm shadow-lg ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navlinks.map((navlink) => (
            <Link
              key={navlink.name}
              href={navlink.url}
              className="block px-3 py-2 hover:bg-muted rounded-md transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {navlink.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}