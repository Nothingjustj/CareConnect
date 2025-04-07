import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer () {
  return (
    <footer className="bg-accent-foreground text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex flex-wrap justify-between">
          {/* Logo and Description */}
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0">
            <Link href="/">
              <Image
                src="/logo-dark.png"
                alt="RogiSetu logo in footer"
                width={170}
                height={50}
              />
            </Link>
            <p className="text-gray-400 mt-4 text-balance">
              Simplifying Hospital OPD Management System for better healthcare delivery.
            </p>
            <div className="flex items-center gap-4 mt-8">
                <Link href="" aria-label="Twitter">
                    <Twitter className="w-5 h-5 text-muted/50 hover:text-muted transition ease-linear duration-200" />
                </Link>
                <Link href="" aria-label="Instagram">
                    <Instagram className="w-5 h-5 text-muted/50 hover:text-muted transition ease-linear duration-200" />
                </Link>
                <Link href="" aria-label="Linkedin">
                    <Linkedin className="w-5 h-5 text-muted/50 hover:text-muted transition ease-linear duration-200" />
                </Link>
                <Link href="" aria-label="Github">
                    <Github className="w-5 h-5 text-muted/50 hover:text-muted transition ease-linear duration-200" />
                </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-1/5 mb-6 lg:mb-0">
            <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-muted/80">
              <li><Link href="/#features" className="hover:text-white">Features</Link></li>
              <li><Link href="/#solutions" className="hover:text-white">Solutions</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="w-full lg:w-1/5">
            <h2 className="text-white text-lg font-semibold mb-4">Resources</h2>
            <ul className="space-y-2">
              <li><Link href="/dashboard/book-opd" className="hover:text-white">Book OPD</Link></li>
              <li><Link href="/track-token" className="hover:text-white">Track OPD</Link></li>
              <li><Link href="/hospitals" className="hover:text-white">Hospitals</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full lg:w-1/5 mt-6 md:mt-0">
            <h2 className="text-white text-lg font-semibold mb-4">Contact Us</h2>
            <p className="text-muted/80">123, Tech Park, Mumbai, India</p>
            <p className="text-muted/80">+91 1234567890</p>
            <p className="text-muted/80"><Link href="mailto:contact@rogisetu.com" className="hover:text-white">contact@rogisetu.com</Link></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between mt-10 border-t border-t-accent/10 pt-8">
          {/* Legal Links */}
          <div className="w-full text-center flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <p className="text-sm">&copy; 2025 RogiSetu. All rights reserved.</p>
            <p className="text-sm">Developed with ❤️ by <Link href="https://adityasharma.vercel.app" target="_blank" className="text-white hover:underline underline-offset-4">Aditya Sharma</Link></p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="hover:text-white text-gray-300 text-sm">Privacy Policy</Link>
              <Link href="#" className="hover:text-white text-gray-300 text-sm">Terms of Service</Link>
              {/* <Link href="#" className="hover:text-white text-gray-300 text-sm">Cookie Policy</Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>

    )
}