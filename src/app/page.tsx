"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import {
  Bell,
  Calendar,
  Pill,
  Clock,
  Bed,
  Building,
  CheckCircle,
  Coins,
  UserIcon,
  StarIcon,
  StarHalfIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { useState } from "react";

const features: {
  icon: React.ReactNode;
  title: string;
  description: string;
}[] = [
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Smart Appointment Booking",
    description:
      "Easy online appointment scheduling with automated queue management and instant confirmations.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Token Management",
    description:
      "Real-time token updates and waiting time estimates for better queue management.",
  },
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: "Multi-Hospital Integration",
    description:
      "Access services from multiple government hospitals through a single platform.",
  },
  {
    icon: <Pill className="h-10 w-10 text-primary" />,
    title: "Medicine Inventory",
    description:
      "Comprehensive medicine stock management with automated reorder notifications.",
  },
  {
    icon: <Bed className="h-10 w-10 text-primary" />,
    title: "Real-time Bed Tracking",
    description:
      "Live monitoring of bed availability across departments with instant status updates.",
  },
  {
    icon: <Bell className="h-10 w-10 text-primary" />,
    title: "SMS Notifications",
    description:
      "Automated SMS updates for appointments, prescriptions, and important reminders.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const videoElement = document.getElementById(
      "videoElement"
    ) as HTMLVideoElement;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <PWAInstallPrompt />
      <Header />
      <div className="w-full">
        <section
          className="relative bg-background flex flex-col items-center justify-center py-20 md:py-28 w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.7) 1px, transparent 0)`,
            backgroundSize: "10px 10px",
            backgroundRepeat: "repeat",
          }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
          {/* Left Circle Blurred */}
          <div className="absolute top-0 left-0 md:w-[15rem] w-[7rem] md:h-[15rem] h-[7rem] rounded-full blur-[70px] md:blur-[150px] bg-primary/40"></div>

          {/* Right Circle Blurred */}
          <div className="absolute bottom-0 right-0 md:w-[15rem] w-[7rem] md:h-[15rem] h-[7rem] rounded-full blur-[70px] md:blur-[150px] bg-primary/40"></div>

          <div className="w-full max-w-6xl px-6 md:px-0 md:text-center z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-balance md:leading-[1.2] tracking-tight text-neutral-800">
              {"Simplifying Hospital OPD Management System"
                .split(" ")
                .map((word, index) => {
                  const isBlue = word === "OPD" || word === "Management";
                  return (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeInOut",
                      }}
                      viewport={{ once: true }}
                      className={`mr-2 inline-block ${
                        isBlue ? "text-primary" : ""
                      }`}
                    >
                      {word}
                    </motion.span>
                  );
                })}
            </h1>
            <motion.p
              className="text-balance mt-6 md:px-36 text-base md:text-lg text-secondary-foreground"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              One-stop solution for managing all your hospital OPD needs.
              Streamline patient care with our comprehensive digital platform.
            </motion.p>
            <motion.div
              className="mt-8 flex md:justify-center gap-4"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
            >
              <Button className="md:text-base md:py-6 md:px-6" asChild>
                <Link href="/login">Get started</Link>
              </Button>
              <Button
                className="md:text-base md:py-6 md:px-6"
                variant="outline"
                asChild
              >
                <Link href="/hospitals">View Hospitals</Link>
              </Button>
            </motion.div>
            {/* <motion.div
              className="mt-24 -mb-24 md:-mb-44 relative rounded-2xl shadow-[10px_10px_0px_#eee,-10px_-10px_0px_#eee,-10px_10px_0px_#eee,10px_-10px_0px_#eee]"
              initial="hidden"
              whileInView="visible"
              variants={scaleIn}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="absolute inset-x-0 -top-[0.625rem] h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </div>
              <Suspense fallback={<p>Loading video...</p>}>
                <video
                  id="videoElement"
                  className="rounded-xl shadow-lg w-[100%]"
                  autoPlay={true}
                  loop
                  onMouseEnter={() => setIsPlaying(true)}
                  onMouseLeave={() => setIsPlaying(false)}
                  width="100%"
                  height="100%"
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300" // Centered play button
                  onClick={togglePlay}
                >
                  <button className="bg-black rounded-full p-5 shadow-[0_0_8px_#222,0_0_4px_#333]">
                    {isPlaying ? (
                      <PauseIcon className="h-10 w-10 text-white" />
                    ) : (
                      <PlayIcon className="h-10 w-10 text-white" />
                    )}
                  </button>
                </div>
              </Suspense>
            </motion.div> */}
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/70">
          <div className="container px-6 max-w-7xl mx-auto">
            <motion.div
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="flex flex-col md:items-center space-y-1 md:space-y-4 md:text-center group"
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Clock className="h-10 w-10 text-primary mb-2" />
                </motion.div>
                <h2 className="text-lg md:text-xl font-bold">
                  Real-time Token Updates
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Track your token status in real-time and get notified when
                  it&apos;s your turn.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col md:items-center space-y-1 md:space-y-4 md:text-center group"
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Calendar className="h-10 w-10 text-primary mb-2" />
                </motion.div>
                <h2 className="text-lg md:text-xl font-bold">
                  Easy Appointment Booking
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Book appointments with your preferred department quickly and
                  easily.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col md:items-center space-y-1 md:space-y-4 md:text-center group"
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bell className="h-10 w-10 text-primary mb-2" />
                </motion.div>
                <h2 className="text-lg md:text-xl font-bold">
                  SMS Notifications
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Receive SMS updates about your appointment status and token
                  number.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ----------------Features Section ---------------*/}
        <section id="features" className="bg-white py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="uppercase tracking-[0.2rem] text-primary"
            >
              our features
            </motion.span>
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-gray-900 mt-4"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              What do we offer
            </motion.h2>
            <motion.p
              className="text-gray-600 mt-4"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Streamline your hospital operations with our powerful suite of
              features designed for modern healthcare management.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
                className="bg-white group p-6 rounded-2xl shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] flex flex-col space-y-3 cursor-pointer"
              >
                <motion.div
                  className="p-3 rounded-lg bg-gray-100 w-fit group-hover:bg-primary/10 transition duration-300"
                  whileHover={{
                    y: -4,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.4 },
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --------------------Solutions-------------------- */}
        <section id="solutions" className="bg-muted/70 py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
            >
              Simple OPD Booking Process
            </motion.h2>
            <motion.p
              className="text-muted-foreground mt-3"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
            >
              Follow these easy steps to book your OPD appointment.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                step: "1",
                title: "Select Hospital",
                description:
                  "Choose from our network of government hospitals in your area",
                points: ["Browse hospitals list", "Check availability"],
              },
              {
                step: "2",
                title: "Choose Department",
                description: "Select the medical department you need to visit",
                points: ["View specialties", "Check doctors"],
              },
              {
                step: "3",
                title: "Book Time Slot",
                description:
                  "Pick your preferred date and time for the appointment",
                points: ["Select date", "Choose time"],
              },
              {
                step: "4",
                title: "Confirm Booking",
                description: "Get instant confirmation and digital token",
                points: ["Receive SMS", "Track token"],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 },
                }}
                className="bg-white text-black p-6 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] relative cursor-pointer pt-10"
              >
                <motion.div
                  className="absolute -top-3 left-5 bg-primary text-white rounded-full px-3 py-1 text-lg font-bold"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.4 },
                  }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-800 mt-2">{item.description}</p>
                <motion.ul
                  className="mt-3 space-y-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {item.points.map((point, i) => (
                    <motion.li
                      key={i}
                      variants={slideInFromLeft}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-center gap-2 text-green-700"
                    >
                      <CheckCircle className="h-5 w-5" /> {point}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              className="bg-primary text-white py-6 px-8 rounded-lg text-base hover:bg-primary/90 transition"
              asChild
            >
              <Link href="/dashboard/book-opd">Book Appointment Now</Link>
            </Button>
            <p className="text-muted-foreground text-sm mt-2">
              Need help? Contact our support team 24/7
            </p>
          </motion.div>
        </section>

        {/* Token Tracking Banner */}
        <motion.section
          className="w-full py-24 px-6"
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative container bg-secondary overflow-hidden p-6 md:p-10 max-w-6xl rounded-3xl mx-auto border"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: { duration: 0.3 },
            }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold mb-4"
              variants={slideInFromLeft}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Track Your Token Status
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-6 max-w-3xl"
              variants={slideInFromLeft}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Already have an appointment? Easily check your token status by
              entering your token details. Stay updated on your position in the
              queue without waiting at the hospital.
            </motion.p>
            <motion.div
              variants={slideInFromLeft}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button size="lg" className="mt-2" asChild>
                <Link href="/track-token">Track Your Token Now</Link>
              </Button>
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Coins
                className="absolute -bottom-5 -right-5 text-primary/10"
                size={148}
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* <section id="testimonials" className="py-20 bg-muted/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2"
                initial={{ opacity: 0, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Trusted by Leading Healthcare Providers
              </motion.h2>
              <motion.p
                className="text-lg text-neutral-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                See what healthcare professionals are saying about RogiSetu
              </motion.p>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white p-6 rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-neutral-900">
                      Dr. Rajesh Kumar
                    </p>
                    <span className="text-sm text-neutral-600">
                      Medical Director, City Hospital
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400">
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-neutral-700">
                  "RogiSetu has transformed our OPD management completely. The
                  automated scheduling and real-time updates have reduced
                  waiting times by 60%. Excellent system!"
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-neutral-900">
                      Mrs. Priya Sharma
                    </p>
                    <span className="text-sm text-neutral-600">
                      Head Nurse, Metro Healthcare
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400">
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarHalfIcon className="h-4 w-4 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-neutral-700">
                  "The inventory management system is a game-changer. We can
                  track medicine stock in real-time and the automated alerts
                  help prevent stockouts. Highly recommended!"
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-neutral-900">
                      Dr. Amit Patel
                    </p>
                    <span className="text-sm text-neutral-600">
                      CEO, Life Care Hospital
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400">
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-neutral-700">
                  "Patient satisfaction has improved significantly since we
                  implemented RogiSetu. The SMS notifications and digital queue
                  management have made the process seamless."
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-8 rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="text-center"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  500+
                </motion.div>
                <p className="text-neutral-600">Hospitals</p>
              </motion.div>
              <motion.div
                className="text-center"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  1M+
                </motion.div>
                <p className="text-neutral-600">Patients Served</p>
              </motion.div>
              <motion.div
                className="text-center"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  98%
                </motion.div>
                <p className="text-neutral-600">Satisfaction Rate</p>
              </motion.div>
              <motion.div
                className="text-center"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  24/7
                </motion.div>
                <p className="text-neutral-600">Support</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button className="px-8 h-12 text-[15px]" asChild>
                <Link href="/contact">
                  Join Our Growing Network
                  <ArrowRightIcon />
                </Link>
              </Button>
            </motion.div>
        </section> */}
      </div>
      <Footer />
    </>
  );
}
