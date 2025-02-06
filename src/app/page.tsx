import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header/>
        <div className="w-full">
          <section className="bg-background flex flex-col items-center justify-center py-28 w-full">
            <div className="w-full max-w-2xl px-4 md:px-0 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-balance md:leading-tight">Simplifying Hospital <span className="text-primary">OPD Management</span> System</h1>
              <p className="text-balance mt-6 text-lg text-secondary-foreground">A one stop solution for managing all your hospital OPD needs like Book and Track OPDs, Check Bed Availability, Patient Admission, Check Medicine Inventory and many more.</p>
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
                  <Clock className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Real-time Token Updates</h3>
                  <p className="text-muted-foreground">
                    Track your token status in real-time and get notified when it's your turn.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Calendar className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Easy Appointment Booking</h3>
                  <p className="text-muted-foreground">
                    Book appointments with your preferred department quickly and easily.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Bell className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">SMS Notifications</h3>
                  <p className="text-muted-foreground">
                    Receive SMS updates about your appointment status and token number.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* features section */}
        </div>
      <Footer/>
    </>
  );
}
