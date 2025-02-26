import { Phone, Mail, MapPin, Section } from "lucide-react";

export default function ContactPage() {
  return (
    
    <section className="bg-white py-6 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">Contact US</h2>
        <p className="text-gray-600 mt-2">
          To make hastlefree and easy way to book your OPD of 25+ hospitals under one roof at sitting in your home.
        </p>
      </div>
    <div className="flex items-center justify-center shadow-sm">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-3 transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started with RogiSetu</h2>
          <p className="text-gray-600 mb-6">
            Transform your hospital management today. Contact us for a free demo.
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Hospital Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Tell us about your requirements"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/90">
              Request Demo
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-3 transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <p className="flex items-center space-x-2">
              <Phone className="text-blue-500 h-5 w-5" />
              <span>+91 1234567890</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="text-blue-500 h-5 w-5" />
              <span>contact@rogisetu.com</span>
            </p>
            <p className="flex items-center space-x-2">
              <MapPin className="text-blue-500 h-5 w-5" />
              <span>123, Tech Park, Mumbai, India</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-3 transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Working Hours</h3>
            <p>
              Monday - Friday: <span className="font-semibold">9:00 AM - 6:00 PM</span>
            </p>
            <p>
              Saturday: <span className="font-semibold">9:00 AM - 2:00 PM</span>
            </p>
            <p>
              Sunday: <span className="font-semibold text-red-500">Closed</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
