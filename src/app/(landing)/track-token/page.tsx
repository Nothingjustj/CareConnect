"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

// Define interfaces for our data structures
interface Hospital {
  id: string;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface TokenData {
  id: string;
  date: string;
  time_slot: string;
  status: string;
  estimated_time: string | null;
  token_number: string;
  called_at: string | null;
  completed_at: string | null;
  hospitals: {
    name: string;
  };
  departments: {
    name: string;
  };
  patients?: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone_no: string;
  };
}

export default function TrackTokenPage() {
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<string>("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch hospitals on component mount
  useEffect(() => {
    async function fetchHospitals() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("hospitals")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setHospitals(data || []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast.error("Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, []);

  // Fetch departments when hospital changes
  useEffect(() => {
    if (!selectedHospital) {
      setDepartments([]);
      setSelectedDepartment(null); // Reset department selection
      return;
    }

    // --- MODIFICATION START: Add loading state for departments ---
    // This helps manage UI state while fetching, though not directly related to layout shift
    const fetchDepartments = async () => {
      // Optional: Add a specific loading state for departments if needed
      // setLoadingDepartments(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("hospital_departments")
          .select(`
            department_type_id,
            department_types:department_type_id(id, name)
          `)
          .eq("hospital_id", selectedHospital);

        if (error) throw error;

        // Transform the data safely
        const transformedData: Department[] = [];

        if (data) {
          for (const dept of data) {
            // Safely access the nested properties with type assertions
            const deptTypeId = dept.department_type_id;

            // Access the nested department_types object
            // Use type assertion to tell TypeScript about the structure
            const deptTypes = dept.department_types as any;
            const deptName = deptTypes?.name || 'Unknown Department';

            transformedData.push({
              id: deptTypeId,
              name: deptName
            });
          }
        }

        setDepartments(transformedData);
        setSelectedDepartment(null); // Reset department selection when hospital changes
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to load departments");
      } finally {
        // Optional: setLoadingDepartments(false);
      }
    };
    // --- MODIFICATION END ---


    fetchDepartments();
  }, [selectedHospital]);

  // Function to track token
  const handleTrackToken = async () => {
    if (!selectedHospital || !selectedDepartment || !date || !tokenNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setDatePickerOpen(false); // Close the date picker when searching

    try {
      // Get the hospital code
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (!hospital) throw new Error("Hospital not found");

      // Get the department code
      const department = departments.find(d => d.id.toString() === selectedDepartment);
      if (!department) throw new Error("Department not found");

      // Create hospital code from hospital name (first letter of each word)
      const hospitalCode = hospital.name
        .split(/[\s.]+/)
        .filter((part: string) => part.length > 0)
        .map((part: string) => part.charAt(0))
        .join('')
        .substring(0, 3)
        .toUpperCase();

      // Create department code (first 3 letters of department name)
      const departmentCode = department.name.substring(0, 3).toUpperCase();

      // Format date as YYYYMMDD
      const dateCode = format(date, "yyyyMMdd");

      // Construct the full token
      const fullToken = `${hospitalCode}-${departmentCode}-${dateCode}-${tokenNumber.padStart(3, '0')}`;

      // Query the database for this token
      const supabase = createClient();
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          date,
          time_slot,
          status,
          estimated_time,
          token_number,
          called_at,
          completed_at,
          hospitals:hospital_id(name),
          departments:department_id(name),
          patients:patient_id(id, name, age, gender, phone_no)
        `)
        .eq("token_number", fullToken)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No results found
          setTokenData(null);
          setError(`No token found matching ${fullToken}`);
        } else {
          throw error;
        }
      } else {
        // Use type assertion to handle the data conversion
        const rawData = data as any;

        // Create a properly structured TokenData object
        const tokenDataObject: TokenData = {
          id: rawData.id,
          date: rawData.date,
          time_slot: rawData.time_slot,
          status: rawData.status,
          estimated_time: rawData.estimated_time,
          token_number: rawData.token_number,
          called_at: rawData.called_at,
          completed_at: rawData.completed_at,
          // Handle nested objects properly
          hospitals: {
            name: rawData.hospitals?.name || "Unknown Hospital"
          },
          departments: {
            name: rawData.departments?.name || "Unknown Department"
          },
          // Handle patients data if it exists
          patients: rawData.patients ? {
            id: rawData.patients.id,
            name: rawData.patients.name,
            age: rawData.patients.age,
            gender: rawData.patients.gender,
            phone_no: rawData.patients.phone_no
          } : undefined
        };

        setTokenData(tokenDataObject);
      }
    } catch (error) {
      console.error("Error tracking token:", error);
      setError("An error occurred while tracking the token. Please try again.");
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
  const formatTime = (timeString: string | null) => { // Added null check
    try {
      if (!timeString) return "Not available";

      // If it's an ISO date string (contains 'T')
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return "Invalid date";

        // Format to 12-hour time with AM/PM
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }

      // If it's a database timestamp like "2025-03-26 09:15:00+00" (with or without timezone)
      if (timeString.includes(' ') && timeString.includes(':')) {
        // Try creating a date object directly, handling potential timezone offset
        const date = new Date(timeString.replace(' ', 'T')); // Replace space with T for better parsing
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        }
        // Fallback for simple time extraction if Date object fails
        const timePart = timeString.split(' ')[1].split('+')[0]; // Handle potential timezone
        const [hours, minutes] = timePart.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // Convert 0 to 12
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
      }


      // If it's a simple time string like "09:15" or "9:15"
      if (timeString.match(/^\d{1,2}:\d{2}$/)) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // Convert 0 to 12
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
      }

      // If it's in an unknown format, return as is
      return timeString;
    } catch (error) {
      console.error("Error formatting time:", error, "Input:", timeString);
      return "Time format error";
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Track Your Token</h1>
      <p className="text-muted-foreground mb-8 text-sm md:text-base">
        Enter your token details to check the current status
      </p>

      {/* Search form - only show if no results or if there's an error */}
      {(!searchPerformed || error) && (
        <div className="grid gap-6 p-6 bg-primary-foreground rounded-lg border shadow-sm">
          {/* --- MODIFICATION: Wrap grid in another div if needed, but grid itself should be fine --- */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* --- MODIFICATION START: Ensure consistent height and prevent content shifts --- */}
            {/* The `space-y-2` and fixed height `h-10` on inputs/triggers are good.
                The main cause of shifts is often text length changes in SelectValue/placeholders.
                Adding `truncate` to SelectTrigger prevents width changes. */}
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Select
                value={selectedHospital || ""}
                onValueChange={setSelectedHospital}
              >
                {/* Added `truncate` to prevent width changes due to long selected names or placeholder */}
                <SelectTrigger className="h-10 w-full truncate max-w-[18rem] sm:max-w-full bg-background">
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {hospitals.map(hospital => (
                    // Added `truncate` here too for consistency in the dropdown list
                    <SelectItem key={hospital.id} value={hospital.id} className="truncate max-w-[calc(var(--radix-select-trigger-width)-2rem)]">
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartment || ""}
                onValueChange={setSelectedDepartment}
                disabled={!selectedHospital || departments.length === 0}
              >
                 {/* Added `truncate` to prevent width changes due to long selected names or placeholder variations */}
                <SelectTrigger className="h-10 w-full truncate max-w-[18rem] sm:max-w-full bg-background">
                  <SelectValue placeholder={selectedHospital ? (departments.length > 0 ? "Select department" : "No departments found") : "Select hospital first"} />
                </SelectTrigger>
                <SelectContent>
                   {/* Added placeholder logic directly into SelectValue above */}
                  {departments.map(department => (
                    // Added `truncate` here too
                    <SelectItem key={department.id} value={department.id.toString()} className="truncate max-w-[calc(var(--radix-select-trigger-width)-2rem)]">
                      {department.name}
                    </SelectItem>
                  ))}
                  {/* Keep disabled items for clarity if needed, though placeholder handles the main message */}
                  {!selectedHospital && <SelectItem value="placeholder-no-hospital" disabled>Select hospital first</SelectItem>}
                  {selectedHospital && departments.length === 0 && <SelectItem value="placeholder-no-dept" disabled>No departments found</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            {/* --- MODIFICATION END --- */}


            <div className="space-y-2">
              <Label>Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "h-10 w-full justify-start text-left font-normal", // h-10 ensures fixed height
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setDatePickerOpen(false); // Close the popover when a date is selected
                    }}
                    initialFocus
                    // Optional: Disable past dates if applicable
                    // disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Token Number (last 3 digits)</Label>
              <Input
                id="token"
                placeholder="e.g. 001"
                value={tokenNumber}
                className="h-10 bg-background" // Fixed height
                onChange={(e) => {
                  // Only allow up to 3 digits
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 3) {
                    setTokenNumber(value);
                  }
                }}
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter only the last 3 digits of your token number
              </p>
            </div>
          </div>

          <Button
            onClick={handleTrackToken}
            disabled={!selectedHospital || !selectedDepartment || !date || !tokenNumber || loading}
            className="w-full"
          >
            {loading ? "Searching..." : "Track Token"}
          </Button>
        </div>
      )}

      {/* Error message */}
      {searchPerformed && error && (
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">{error}</p>
          <p className="mt-2">Please check your token details and try again.</p>
          {/* Add button to try again */}
           <Button
              onClick={() => {
                setSearchPerformed(false);
                setError(null); // Clear error when trying again
                // Optionally reset fields if desired, or keep them
                // setSelectedHospital(null);
                // setSelectedDepartment(null);
                // setTokenNumber("");
                // setDate(new Date());
              }}
              variant="outline"
              className="mt-4 border-red-300 text-red-800 hover:bg-red-100"
            >
              Try Again
            </Button>
        </div>
      )}

      {/* Token data results */}
      {searchPerformed && !error && tokenData && (
        <div className="mt-8 bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-primary">{tokenData.token_number}</h2>
              <p className="text-muted-foreground">Token Number</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium self-start">
              {tokenData.status.charAt(0).toUpperCase() + tokenData.status.slice(1)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Hospital</p>
                {/* --- Ensure truncate is applied here too --- */}
                <p className="font-medium truncate max-w-sm">
                  {tokenData.hospitals.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                 {/* --- Ensure truncate is applied here too --- */}
                <p className="font-medium truncate max-w-sm">{tokenData.departments.name}</p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <p className="font-medium">{formatDate(tokenData.date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="font-medium">{tokenData.time_slot}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="font-medium">
                  {formatTime(tokenData.estimated_time)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">
                  {tokenData.status === 'waiting' ? 'Waiting to be called' :
                   tokenData.status === 'in-progress' ? 'Currently being served' :
                   tokenData.status === 'completed' ? 'Appointment completed' :
                   tokenData.status === 'cancelled' ? 'Appointment cancelled' :
                   tokenData.status.charAt(0).toUpperCase() + tokenData.status.slice(1)} {/* Fallback */}
                </p>
              </div>

              {tokenData.called_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Called At</p>
                  <p className="font-medium">{formatTime(tokenData.called_at)}</p>
                </div>
              )}

              {tokenData.completed_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="font-medium">{formatTime(tokenData.completed_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Patient Details Section (Optional) */}
          {tokenData.patients && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Patient Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {tokenData.patients.name}</div>
                <div><span className="text-muted-foreground">Age:</span> {tokenData.patients.age}</div>
                <div><span className="text-muted-foreground">Gender:</span> {tokenData.patients.gender}</div>
                <div><span className="text-muted-foreground">Phone:</span> {tokenData.patients.phone_no}</div>
              </div>
            </div>
          )}


          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">
              <span className="font-semibold">Important:</span> Please arrive at the hospital 15 minutes
              before your estimated time. Bring this token and any relevant medical records.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                // Reset state to show the search form again
                setSearchPerformed(false);
                setTokenData(null);
                setError(null);
                // Reset form fields
                setSelectedHospital(null); // This will trigger department reset via useEffect
                setTokenNumber("");
                setDate(new Date()); // Reset date to today
              }}
              variant="outline"
              className="flex-1"
            >
              Track Another Token
            </Button>

            <Button asChild className="flex-1">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      )}

       {/* Loading indicator for initial load */}
       {loading && !searchPerformed && (
          <div className="flex justify-center items-center p-10">
              {/* You can use a spinner component here */}
              <p>Loading hospitals...</p>
          </div>
       )}

       {/* Message when no token found after search */}
       {searchPerformed && !loading && !tokenData && !error && (
         <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">No token found matching the provided details.</p>
            <p className="mt-2">Please double-check the hospital, department, date, and token number.</p>
            <Button
              onClick={() => {
                setSearchPerformed(false); // Go back to the form
                // Keep entered values or reset as desired
              }}
              variant="outline"
              className="mt-4 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              Try Again
            </Button>
         </div>
       )}

    </div>
  );
}