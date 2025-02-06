"use client";

import React from "react";
import { useState, useEffect } from "react";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { createClient } from "@/utils/supabase/client";

const BookOpdForm = ({hospitals}: {hospitals: any}) => {
  const [date, setDate] = useState<Date>();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if(!selectedHospital) return;

      const supabase = createClient();
      const { data, error } = await supabase.from("departments").select("*").eq("hospital_id", selectedHospital);

      if(error) {
        console.error("Error fetching departments: ", error);
      } else {
        setDepartments(data || []);
      }
    }

    fetchDepartments();
  }, [selectedHospital])
  

  return (
    <form className="flex flex-col gap-6">
      {/* Personal Information */}
      <div className="p-6 border rounded-2xl bg-primary-foreground">
        <h3 className="text-xl font-medium mb-6">Patient Details</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2">
            <Label>Patient Full Name:</Label>
            <Input
              className="bg-white"
              placeholder="Enter Patient's Full Name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Phone No:</Label>
            <Input className="bg-white" placeholder="Enter Phone Number" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Age:</Label>
            <Input className="bg-white" placeholder="Enter your age" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Gender:</Label>
            <Select>
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
      </div>

      {/* Appointment Details */}
      <div className="p-6 border rounded-2xl bg-primary-foreground">
        <h3 className="text-xl font-medium mb-6">Appointment Details</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2">
            <Label>Hospital:</Label>
            <Select onValueChange={(value) => setSelectedHospital(value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hospitals && hospitals.length > 0 ? (
                    hospitals.map((hospital: any) => (
                      <SelectItem key={hospital.id} value={hospital.id}>{hospital.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No hospitals available</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Department:</Label>
            <Select disabled={!selectedHospital || departments.length === 0}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={selectedHospital ? "Select department" : "Select hospital first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.length > 0 ? (
                    departments.map((department: any) => (
                      <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="No department" disabled>No departments available</SelectItem>
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
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Brief summary:</Label>
            <Textarea className="bg-white" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox /> <span className="text-muted-foreground">I agree to the terms and conditions and confirm that the
        information provided is accurate</span>
      </div>

      <div>
        <Button size="lg" className="w-full text-base py-5 px-3">Book Appointment</Button>
      </div>
    </form>
  );
};

export default BookOpdForm;
