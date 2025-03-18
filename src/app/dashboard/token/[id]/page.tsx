"use client";

import { trackOpdByToken } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-screen";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Download, Share2 } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

type TokenPageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default function TokenPage({ params }: TokenPageProps) {
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokenData() {
      if (!(await params).id) return;
      
      try {
        const result = await trackOpdByToken((await params).id);
        
        if (result.status === "success" && result.found) {
          setTokenData(result);
        } else {
          setError(result.message || "Token not found");
          toast.error(`Token not found: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setError(error instanceof Error ? error.message : String(error));
        toast.error(`Failed to fetch token details: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTokenData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My OPD Token',
          text: `My OPD token number is ${tokenData.token.token_number} for ${tokenData.department.name} at ${tokenData.hospital.name} on ${formatDate(tokenData.appointment.date)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !tokenData) {
    return (
      <div className="px-2 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || "The token you're looking for couldn't be found. It may have been cancelled or expired."}
        </p>
        <Button asChild>
          <Link href="/dashboard/appointments">View My Appointments</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-2 py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left side - Token details */}
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary">{tokenData.token.token_number}</h2>
                <p className="text-muted-foreground">Token Number</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium self-start">
                {tokenData.token.status.charAt(0).toUpperCase() + tokenData.token.status.slice(1)}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Hospital</p>
                <p className="font-medium">{tokenData.hospital.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{tokenData.department.name}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="font-medium">{formatDate(tokenData.appointment.date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="font-medium">{tokenData.appointment.time_slot}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="font-medium">
                  {tokenData.estimatedTime ? formatTime(tokenData.estimatedTime) : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                <span className="font-semibold">Important:</span> Please arrive at the hospital 15 minutes 
                before your estimated time. Bring this token and any relevant medical records.
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <Button asChild className="flex-1">
                <Link href={`/dashboard/track-opd?token=${tokenData.token.token_number}`}>
                  Track Status
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/dashboard/appointments">
                  View All Appointments
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - QR code */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="p-4 bg-white border rounded-lg">
              <QRCode 
                value={`${window.location.origin}/dashboard/track-opd?token=${tokenData.token.token_number}`} 
                size={180} 
              />
            </div>
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Scan to track token status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}