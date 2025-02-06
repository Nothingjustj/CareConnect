import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function LandingLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
          <Header />
            <div className="min-h-screen flex items-center justify-center">
              {children}
            </div>
          <Footer />
        </>
    );
  }