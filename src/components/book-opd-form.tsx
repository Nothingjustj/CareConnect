"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, Info } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { createClient } from "@/utils/supabase/client";
import {
  bookOpdAppointment,
  checkAvailability,
  getTimeSlots,
} from "@/actions/appointments";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const BookOpdForm = ({ hospitals }: { hospitals: any }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [departments, setDepartments] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [needsPatientDetails, setNeedsPatientDetails] = useState<boolean>(true);
  const router = useRouter();

  // Fetch departments when hospital changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedHospital) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("hospital_departments")
        .select(
          `
          id, 
          daily_token_limit, 
          department_types:department_type_id(id, name)
        `
        )
        .eq("hospital_id", selectedHospital);

      if (error) {
        console.error(
          "Error fetching departments: ",
          error.message,
          error.code,
          error.details
        );
        toast.error(`Failed to fetch departments: ${error.message}`);
      } else {
        // Transform the data to make it easier to use
        const transformedDepartments = data.map((dept: any) => ({
          id: dept.department_types.id,
          name: dept.department_types.name,
          daily_token_limit: dept.daily_token_limit,
        }));
        setDepartments(transformedDepartments || []);
      }
    };

    fetchDepartments();
  }, [selectedHospital]);

  // Effect to handle date change and check availability
  useEffect(() => {
    if (selectedHospital && selectedDepartment && date) {
      const checkAvailabilityAndGetSlots = async () => {
        try {
          const formattedDate = format(date, "yyyy-MM-dd");

          // Check availability
          const availabilityResult = await checkAvailability(
            selectedHospital,
            parseInt(selectedDepartment),
            formattedDate
          );

          setAvailabilityStatus(availabilityResult);

          // If available, get time slots
          if (availabilityResult.available) {
            const timeSlotsResult = await getTimeSlots(
              selectedHospital,
              parseInt(selectedDepartment),
              formattedDate
            );

            setTimeSlots(timeSlotsResult.slots || []);
          } else {
            setTimeSlots([]);
          }
        } catch (error) {
          console.error("Error checking availability:", error);
          toast.error("Failed to check availability");
        }
      };

      checkAvailabilityAndGetSlots();
    }
  }, [selectedHospital, selectedDepartment, date]);

  // Fetch patient details when component mounts
  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: patient, error } = await supabase
            .from("patients")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error(
              "Error fetching patient details:",
              error.message,
              error.code,
              error.details
            );
            setNeedsPatientDetails(true);
          } else if (patient) {
            setPatientDetails(patient);

            const missingDetails =
              !patient.gender || !patient.age || !patient.phone_no;

            setNeedsPatientDetails(missingDetails);

            if (patient.name) {
              const nameInput = document.getElementById(
                "name"
              ) as HTMLInputElement;
              if (nameInput) nameInput.value = patient.name;
            }

            if (patient.phone_no) {
              const phoneInput = document.getElementById(
                "phone"
              ) as HTMLInputElement;
              if (phoneInput) phoneInput.value = patient.phone_no;
            }

            if (patient.age) {
              const ageInput = document.getElementById(
                "age"
              ) as HTMLInputElement;
              if (ageInput) ageInput.value = patient.age;
            }

            if (patient.gender) {
              setSelectedGender(patient.gender);
            }
          } else {
            setNeedsPatientDetails(true);

            if (user.user_metadata?.name) {
              const nameInput = document.getElementById(
                "name"
              ) as HTMLInputElement;
              if (nameInput) nameInput.value = user.user_metadata.name;
            }

            if (user.user_metadata?.phoneNo) {
              const phoneInput = document.getElementById(
                "phone"
              ) as HTMLInputElement;
              if (phoneInput) phoneInput.value = user.user_metadata.phoneNo;
            }
          }
        } else {
          // No user logged in, redirect to login or show error
          toast.error("You must be logged in to book an appointment");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setNeedsPatientDetails(true);
        toast.error(
          `Failed to fetch your details: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData();

    if (needsPatientDetails) {
      const form = event.currentTarget as HTMLFormElement;
      const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
      const phone = (form.elements.namedItem("phone") as HTMLInputElement)
        ?.value;
      const age = (form.elements.namedItem("age") as HTMLInputElement)?.value;

      if (!name || !phone || !age || !selectedGender) {
        setFormError("Please fill all required fields including gender");
        setLoading(false);
        toast.error("Please fill all required fields including gender");
        return;
      }

      // Add patient details to form data
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("age", age);
      formData.append("gender", selectedGender);
    } else {
      // Use existing patient details
      formData.append("name", patientDetails.name);
      formData.append("phone", patientDetails.phone_no);
      formData.append("age", patientDetails.age || "");
      formData.append("gender", patientDetails.gender || selectedGender || "");

      // Add a flag to indicate we're using existing patient
      formData.append("existingPatient", "true");
    }

    // Add appointment details
    if (selectedHospital) formData.append("hospital", selectedHospital);
    if (selectedDepartment) formData.append("department", selectedDepartment);
    if (date) formData.append("date", format(date, "yyyy-MM-dd"));
    if (selectedTimeSlot) formData.append("timeSlot", selectedTimeSlot);

    // Optional field
    const symptoms = (
      event.currentTarget.elements.namedItem("symptoms") as HTMLTextAreaElement
    )?.value;
    if (symptoms) formData.append("symptoms", symptoms);

    try {
      const result = await bookOpdAppointment(formData);

      if (result.status === "success") {
        toast.success("Appointment booked successfully!");
        router.push(`/dashboard/token/${result.tokenNumber}`);
      } else {
        setFormError(result.message || "Unknown error occurred");
        toast.error(`Failed to book appointment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during appointment booking:", error);
      setFormError(
        `Exception occurred: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const goToNextStep = () => {
    if (step === 1) {
      if (
        !selectedHospital ||
        !selectedDepartment ||
        !date ||
        !selectedTimeSlot
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      if (!needsPatientDetails) {
        // Set loading state before triggering form submission
        setLoading(true);
        const form = document.getElementById(
          "appointment-form"
        ) as HTMLFormElement;
        if (form) {
          form.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const goToPrevStep = () => {
    setStep(step - 1);
  };

  return (
    <form
      id="appointment-form"
      className="flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      {step === 1 && (
        <div className="p-4 md:p-6 border rounded-2xl bg-primary-foreground">
          <h3 className="text-xl font-medium mb-6">Appointment Details</h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1">
                Hospital:{" "}
                <span className="text-xs text-destructive">
                  (*Only 2 hospitals available to test)
                </span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setSelectedHospital(value);
                  setSelectedDepartment(null);
                  setAvailabilityStatus(null);
                }}
                name="hospital"
                value={selectedHospital || ""}
              >
                <SelectTrigger className="bg-white w-full max-w-[80vw] md:max-w-none truncate">
                  <SelectValue
                    placeholder="Select hospital"
                    className="truncate"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {hospitals && hospitals.length > 0 ? (
                      hospitals.map((hospital: any) => (
                        <SelectItem
                          key={hospital.id}
                          value={hospital.id}
                          className="truncate"
                        >
                          {hospital.name}
                        </SelectItem>
                      ))
                    ) : (
                        <SelectItem value="none" disabled>
                          No hospitals available
                        </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                Choose either: <br /> - Grant Medical College & J J Group of
                Hospitals <br /> - K. J. Somaiya Hospital, KJH
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Department:</Label>
              <Select
                disabled={!selectedHospital || departments.length === 0}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setAvailabilityStatus(null);
                }}
                name="department"
                value={selectedDepartment || ""}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue
                    placeholder={
                      selectedHospital
                        ? "Select department"
                        : "Select hospital first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {departments.length > 0 ? (
                      departments.map((department: any) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                        >
                          {department.name}
                        </SelectItem>
                      ))
                    ) : (
                        <SelectItem value="no_department" disabled>
                          No departments available
                        </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Preferred Date:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal bg-white",
                      !date && "text-muted-foreground"
                    )}
                    disabled={!selectedHospital || !selectedDepartment}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={
                      (date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                        date >
                          new Date(new Date().setDate(new Date().getDate() + 7)) // Allow booking up to 7 days in advance
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Availability Status */}
            {availabilityStatus && (
              <div className="sm:col-span-2">
                {availabilityStatus.available ? (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Slots Available
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      {availabilityStatus.remainingSlots} slots available out of{" "}
                      {availabilityStatus.totalSlots}. Please select a time
                      slot.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-red-50 border-red-200">
                    <Info className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">
                      No Slots Available
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      All slots for this date are booked. Please select another
                      date.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Time Slots */}
            {availabilityStatus?.available && timeSlots.length > 0 && (
              <div className="sm:col-span-2">
                <Label className="mb-2 block">Select Time Slot:</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={
                        selectedTimeSlot === slot ? "default" : "outline"
                      }
                      className={cn(
                        "bg-white hover:bg-primary/10",
                        selectedTimeSlot === slot &&
                          "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="sm:col-span-2 flex flex-col gap-2 mt-4">
              <Label>Brief summary of symptoms (optional):</Label>
              <Textarea name="symptoms" className="bg-white" />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={goToNextStep}
              disabled={
                loading ||
                !selectedHospital ||
                !selectedDepartment ||
                !date ||
                !selectedTimeSlot ||
                !availabilityStatus?.available
              }
              className="w-full"
            >
              {loading && !needsPatientDetails
                ? "Booking..."
                : needsPatientDetails
                ? "Continue to Patient Details"
                : "Book Appointment"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && needsPatientDetails && (
        <div className="p-6 border rounded-2xl bg-primary-foreground">
          <h3 className="text-xl font-medium mb-6">Patient Details</h3>

          {/* Display form error if present */}
          {formError && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <Info className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {formError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-2">
              <Label>Patient Full Name:</Label>
              <Input
                className="bg-white"
                placeholder="Enter Patient's Full Name"
                name="name"
                id="name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phone No:</Label>
              <Input
                className="bg-white"
                placeholder="Enter Phone Number"
                name="phone"
                id="phone"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Age:</Label>
              <Input
                className="bg-white"
                placeholder="Enter your age"
                name="age"
                id="age"
                type="number"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender:</Label>
              <Select
                name="gender"
                required
                onValueChange={(value) => setSelectedGender(value)}
                value={selectedGender || ""}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 my-6">
            <Checkbox id="terms" required />
            <Label
              className="text-muted-foreground leading-snug"
              htmlFor="terms"
            >
              I agree to the{" "}
              <Link href="/terms" className="underline" target="_blank">
                terms and conditions
              </Link>{" "}
              and confirm that the information provided is accurate.
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookOpdForm;
