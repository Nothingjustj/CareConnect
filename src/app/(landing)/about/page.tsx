import React from 'react'
import { Building2, Clock, CalendarCheck, CheckCircle } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="bg-white py-6 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">About US</h2>
        <p className="text-gray-600 mt-2">
          Revolutionizing healthcare access through digital transformation and unified hospital management
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
        {[
          {
            icon: <Building2 className="h-10 w-10 text-blue-500" />,
            title: "Unified Platform",
            description:
              "Multiple government hospitals integrated into a single, easy-to-use platform for seamless healthcare management.",
          },
          {
            icon: <Clock className="h-10 w-10 text-green-500" />,
            title: "Real-time Tracking",
            description:
              "Monitor your OPD token status in real-time, reducing waiting times and improving patient experience.",
          },
          {
            icon: <CalendarCheck className="h-10 w-10 text-red-500" />,
            title: "Easy Scheduling",
            description:
              "Book appointments anytime, anywhere with our user-friendly online booking system.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-3 transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400 cursor-pointer">
            <div className="p-3 rounded-lg bg-gray-100 w-fit">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="bg-white text-primary py-12 mt-16 px-6 max-w-6xl mx-auto rounded-lg">
        <h3 className="text-2xl font-bold">Our Mission</h3>
        <p className="mt-2 text-gray-600 max-w-3xl">
          To provide accessible, efficient, and transparent healthcare services to all citizens through digital innovation
          and integrated hospital management.
        </p>
        <ul className="mt-4 space-y-2">
          {[
            "Reduce waiting times",
            "Improve healthcare accessibility",
            "Enhance patient experience",
          ].map((mission, index) => (
            <li key={index} className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" /> {mission}
            </li>
          ))}
        </ul>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {[
            { value: "50k+", label: "Monthly Patients", color: "text-blue-800" },
            { value: "95%", label: "Satisfaction Rate", color: "text-green-800" },
            { value: "25+", label: "Partner Hospitals", color: "text-red-800" },
            { value: "24/7", label: "Support", color: "text-blue-800" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-blue-200 text-white p-6 rounded-lg text-center shadow-md shadow-gray-400">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <p className="text-gray-800">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutPage