// src/app/dashboard/track-opd/page.tsx - Updated version

"use client";

import { trackOpdByToken } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function TrackOpd() {
    const [tokenNumber, setTokenNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenData, setTokenData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Check if token is provided in URL
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setTokenNumber(token);
            handleTrackToken(token);
        }
    }, [searchParams]);

    const handleTrackToken = async (tokenToTrack?: string) => {
        const tokenToUse = tokenToTrack || tokenNumber;
        
        if (!tokenToUse) {
            toast.error("Please enter a token number");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Clean up the token number - remove extra spaces
            const cleanToken = tokenToUse.trim().toUpperCase();
            const result = await trackOpdByToken(cleanToken);
            
            if (result.status === "success" && result.found) {
                setTokenData(result);
            } else {
                setError(result.message || "Token not found. Please check the token number and try again.");
                setTokenData(null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`An error occurred while tracking the token: ${errorMessage}`);
            console.error("Token tracking error:", err);
            setTokenData(null);
        } finally {
            setLoading(false);
        }
    };

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

    // Calculate estimated waiting time
    const getEstimatedWaitingTime = () => {
        if (!tokenData) return '';
        
        const position = tokenData.positionInQueue;
        // Assuming each patient takes about 15 minutes
        const waitingMinutes = position * 15;
        
        if (waitingMinutes < 60) {
            return `${waitingMinutes} minutes`;
        } else {
            const hours = Math.floor(waitingMinutes / 60);
            const minutes = waitingMinutes % 60;
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minutes` : ''}`;
        }
    };

    return (
        <div className="px-2 py-6 mx-auto w-full max-w-4xl">
            <h1 className="font-bold text-2xl md:text-3xl">Track Your OPD Status</h1>
            <p className="text-muted-foreground mt-2 mb-6">
                Enter your token number to check your position in the queue and estimated waiting time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-3 mt-8">
                <Input 
                    placeholder="Enter your token no. (eg. EYE-123)" 
                    value={tokenNumber}
                    onChange={(e) => setTokenNumber(e.target.value)}
                    className="sm:max-w-md"
                />
                <Button 
                    onClick={() => handleTrackToken()}
                    disabled={loading}
                    className="mt-2 sm:mt-0"
                >
                    {loading ? "Tracking..." : "Track OPD"}
                </Button>
            </div>
            
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
            
            {tokenData && (
                <div className="mt-8">
                    <div className="bg-primary-foreground border rounded-lg p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{tokenData.token.token_number}</h2>
                                <p className="text-muted-foreground">Token Number</p>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium self-start">
                                Status: {tokenData.token.status.charAt(0).toUpperCase() + tokenData.token.status.slice(1)}
                            </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Appointment Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Hospital</p>
                                        <p className="font-medium">{tokenData.hospital.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Department</p>
                                        <p className="font-medium">{tokenData.department.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="font-medium">{formatDate(tokenData.appointment.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time Slot</p>
                                        <p className="font-medium">{tokenData.appointment.time_slot}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Queue Status</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current Token</p>
                                        <p className="font-bold text-lg text-primary">
                                            {tokenData.currentToken || "No token being served yet"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Your Position</p>
                                        <p className="font-medium">
                                            {tokenData.token.status === "waiting" 
                                                ? `${tokenData.positionInQueue} in queue` 
                                                : tokenData.token.status === "in-progress" 
                                                    ? "Currently being served" 
                                                    : "Completed"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estimated Waiting Time</p>
                                        <p className="font-medium">
                                            {tokenData.token.status === "waiting" 
                                                ? getEstimatedWaitingTime()
                                                : tokenData.token.status === "in-progress" 
                                                    ? "Currently being served" 
                                                    : "Completed"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estimated Time</p>
                                        <p className="font-medium">
                                            {tokenData.estimatedTime ? formatTime(tokenData.estimatedTime) : "Not available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-blue-800">
                                <span className="font-semibold">Note:</span> Please arrive at the hospital at least 15 minutes before your estimated time. 
                                Keep checking this page for real-time updates on your token status.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}