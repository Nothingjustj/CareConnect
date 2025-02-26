// src\components\Header\NavLinks.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function NavLinks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const pathname = usePathname();

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

// src\components\Header\NavLinks.tsx
// Update the useEffect for scroll detection

useEffect(() => {
  const handleScroll = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // Add offset to account for header height
    
    // Special case for home section when at the top of the page
    if (scrollPosition < 300) { // Adjust this value based on your hero section height
      setActiveSection("/");
      return;
    }
    
    // Check other sections
    let foundActiveSection = false;
    sections.forEach((section) => {
      const htmlSection = section as HTMLElement;
      const sectionTop = htmlSection.offsetTop;
      const sectionBottom = sectionTop + htmlSection.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        setActiveSection(`#${htmlSection.id}`);
        foundActiveSection = true;
      }
    });
    
    // If no section is active and we're not at the top, don't highlight any
    if (!foundActiveSection && scrollPosition >= 300) {
      setActiveSection("");
    }
  };

  // Only run on client side
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    setTimeout(handleScroll, 100); // Small delay to ensure DOM is fully loaded
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }
}, []);

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

  // Replace the isLinkActive function with this:
const isLinkActive = (url: string) => {
  // Home is only active when explicitly at the top
  if (url === '/' && activeSection === '/') return true;
  
  // For other sections, match exactly with the current active section
  return url === activeSection;
};
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {navlinks.map((navlink) => (
          <Link 
            key={navlink.name} 
            href={navlink.url} 
            className={`transition duration-300 ${
              isLinkActive(navlink.url) 
                ? "text-primary font-medium" 
                : "text-zinc-600 hover:text-primary"
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
              className={`block px-3 py-2 rounded-md transition duration-300 ${
                isLinkActive(navlink.url)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-zinc-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {navlink.name}
            </Link>
          ))}
          
          {/* Mobile Auth Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2 px-3">
            <Button variant="outline" className="w-full justify-center" asChild>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            </Button>
            <Button className="w-full justify-center" asChild>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}