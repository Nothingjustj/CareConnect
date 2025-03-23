import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Pill, Clock, Bed, Building, CheckCircle, Check } from "lucide-react";
import Link from "next/link";
import React from "react";

// Define feature data separately
const features: { icon: React.ReactNode; title: string; description: string }[] = [
  {
    icon: <Calendar className="h-10 w-10 text-primary" />, 
    title: "Smart Appointment Booking",
    description: "Easy online appointment scheduling with automated queue management and instant confirmations."
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Token Management",
    description: "Real-time token updates and waiting time estimates for better queue management."
  },
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: "Multi-Hospital Integration",
    description: "Access services from multiple government hospitals through a single platform."
  },
  {
    icon: <Pill className="h-10 w-10 text-primary" />,
    title: "Medicine Inventory",
    description: "Comprehensive medicine stock management with automated reorder notifications."
  },
  {
    icon: <Bed className="h-10 w-10 text-primary" />,
    title: "Real-time Bed Tracking",
    description: "Live monitoring of bed availability across departments with instant status updates."
  },
  {
    icon: <Bell className="h-10 w-10 text-primary" />,
    title: "SMS Notifications",
    description: "Automated SMS updates for appointments, prescriptions, and important reminders."
  }
];

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full">
        <section 
        className="bg-background flex flex-col items-center justify-center py-28 w-full"
        style={{
          backgroundImage: `radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.6) 0.5px, transparent 0)`,
          backgroundSize: "8px 8px",
          backgroundRepeat: "repeat"
        }}
        >
          <div className="w-full max-w-2xl px-4 md:px-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance md:leading-tight">
              Simplifying Hospital <span className="text-primary">OPD Management</span> System
            </h1>
            <p className="text-balance mt-6 text-lg text-secondary-foreground">
              A one stop solution for managing all your hospital OPD needs like Book and Track OPDs, Check Bed Availability, Patient Admission, Check Medicine Inventory and many more.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button className="text-base py-6 px-6" asChild>
                <Link href="/login">Get started</Link>
              </Button>
              <Button className="text-base py-6 px-6" variant="outline" asChild>
                <Link href="/hospitals">View Hospitals</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Clock className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Real-time Token Updates</h3>
                <p className="text-muted-foreground">
                  Track your token status in real-time and get notified when it&apos;s your turn.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Calendar className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Easy Appointment Booking</h3>
                <p className="text-muted-foreground">
                  Book appointments with your preferred department quickly and easily.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Bell className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">SMS Notifications</h3>
                <p className="text-muted-foreground">
                  Receive SMS updates about your appointment status and token number.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features---------------------------------Features Section ----------------------------------------------------------*/}
        <section id="features" className="bg-white py-24 px-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Comprehensive <span className="text-primary">ROGISETU</span> Features
            </h2>
            <p className="text-gray-600 mt-2">
              Streamline your hospital operations with our powerful suite of features designed for modern healthcare management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-3 transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400 cursor-pointer"
              >
                <div className="p-3 rounded-lg bg-gray-100 w-fit">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solutions-----------------------------------Solution Approach Section --------------------------------------------- */}
        <section id="solutions" className="bg-muted py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple OPD Booking Process</h2>
            <p className="text-gray-600 mt-2">
              Follow these easy steps to book your OPD appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Select Hospital",
                description: "Choose from our network of government hospitals in your area",
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
                description: "Pick your preferred date and time for the appointment",
                points: ["Select date", "Choose time"],
              },
              {
                step: "4",
                title: "Confirm Booking",
                description: "Get instant confirmation and digital token",
                points: ["Receive SMS", "Track token"],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#e9f9ff] text-black p-6 rounded-lg shadow-lg relative hover:shadow-lg duration-300 hover:shadow-gray-400 cursor-pointer"
              >
                <div className="absolute -top-3 left-5 bg-primary text-white rounded-full px-3 py-1 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-800 mt-2">{item.description}</p>
                <ul className="mt-3 space-y-2">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="bg-[hsl(196,98%,33%)] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#1B87AF] transition">
              Book Appointment Now
            </button>
            <p className="text-gray-500 mt-2">Need help? Contact our support team 24/7</p>
          </div>
        </section>

        {/* Real-time Token Tracking -------------------------------------------------------------*/}          
        <section id="benefits" className="max-w-6xl mx-auto py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Real-time Token Tracking</h2>
              <p className="text-gray-600 mt-2">
                Monitor your position in the queue and get live updates about your appointment status.
              </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Left Column (50%) */}
            <div className="flex flex-col space-y-6">
              {/* Live Queue Status */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary text-white rounded-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Live Queue Status</h3>
                </div>
                <p className="text-gray-600 mt-1">
                  See real-time updates of your position in the queue
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <div className="flex justify-between text-gray-800 font-semibold">
                    <span>Current Token</span>
                    <span className="text-blue-700">A-15</span>
                  </div>
                  <div className="flex justify-between text-gray-800 font-semibold mt-2">
                    <span>Your Token</span>
                    <span className="text-green-700">A-18</span>
                  </div>
                </div>
              </div>

              {/* Smart Notifications */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary text-white rounded-lg">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Smart Notifications</h3>
                </div>
                <p className="text-gray-600 mt-1">
                  Get alerts when your turn is approaching
                </p>
                <ul className="mt-3 space-y-2 text-green-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5" /> SMS notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5" /> Email updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5" /> In-app alerts
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column (50%) */}
            <div className="bg-muted shadow-lg rounded-lg p-6 items-center">
              <h3 className="text-3xl font-semibold text-primary mt-10 text-center">Track Your Token</h3>
              <div className="mt-4">
                <label className="block text-md font-medium text-gray-600">Token Number</label>
                <input
                  type="text"
                  placeholder="Enter your token number"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                />
              </div>
              <div className="mt-4">
                <label className="block text-md font-medium text-gray-600">Hospital</label>
                <select className="w-full p-3 mt-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-900">
                  <option>Select Hospital</option>
                </select>
              </div>
              <button className="w-full bg-primary text-white font-semibold py-3 rounded-lg mt-4 hover:bg-primary/90">
                Track Now
              </button>
              <p className="text-gray-500 text-center mt-2">
                Track your token status anytime, anywhere
              </p>
            </div>
          </div>
        </section>
        {/* How it works------------------------------------------------------------------------------------------------- */}
      </div>
      <Footer />
    </>
  );
}

// FeatureCard Component
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-blue-500 hover:bg-blue-600 p-6 rounded-lg shadow-md flex flex-col space-y-3 transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400 cursor-pointer">
    <Icon className="h-10 w-10 text-white mb-3" />
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-200">{description}</p>
  </div>
);

