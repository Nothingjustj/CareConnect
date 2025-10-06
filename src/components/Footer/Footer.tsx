"use client"
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react"
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function Footer () {
  const { t } = useI18n();
  return (
    <footer className="bg-accent-foreground text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <motion.div className="flex flex-wrap justify-between"
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        >
          {/* Logo and Description */}
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0">
            <Link href="/">
              <Image
                src="/Whitelogo.png"
                alt="logo in footer"
                width={170}
                height={80}
              />
            </Link>
            <p className="text-gray-400 mt-4 text-balance">
              {t("footer.description")}
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
            <h2 className="text-white text-lg font-semibold mb-4">{t("footer.quick_links.title")}</h2>
            <ul className="space-y-2 text-muted/80">
              <li><Link href="/#features" className="hover:text-white">{t("footer.quick_links.features")}</Link></li>
              <li><Link href="/#solutions" className="hover:text-white">{t("footer.quick_links.solutions")}</Link></li>
              <li><Link href="/about" className="hover:text-white">{t("footer.quick_links.about")}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t("footer.quick_links.contact")}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="w-full lg:w-1/5">
            <h2 className="text-white text-lg font-semibold mb-4">{t("footer.resources.title")}</h2>
            <ul className="space-y-2">
              <li><Link href="/dashboard/book-opd" className="hover:text-white">{t("footer.resources.book_opd")}</Link></li>
              <li><Link href="/track-token" className="hover:text-white">{t("footer.resources.track_opd")}</Link></li>
              <li><Link href="/hospitals" className="hover:text-white">{t("footer.resources.hospitals")}</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full lg:w-1/5 mt-6 md:mt-0">
            <h2 className="text-white text-lg font-semibold mb-4">{t("footer.contact.title")}</h2>
            <p className="text-muted/80">Ludhiana, Punjab India</p>
            <p className="text-muted/80">+91 1234567890</p>
            <p className="text-muted/80"><Link href="mailto:contact@CareConnectNCC.com" className="hover:text-white">contact@careconnect.com</Link></p>
          </div>
        </motion.div>

        <motion.div className="flex flex-wrap justify-between mt-10 border-t border-t-accent/10 pt-8"
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.2 }}
        >
          {/* Legal Links */}
          <div className="w-full text-center flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <p className="text-sm">&copy; 2025 {t("app.name")}. {t("footer.copyright")}</p>
            <p className="text-sm">{t("footer.developed_by")}</p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="hover:text-white text-gray-300 text-sm">{t("footer.legal.privacy")}</Link>
              <Link href="#" className="hover:text-white text-gray-300 text-sm">{t("footer.legal.terms")}</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>

    )
}