"use client"

import { signUpAsHospitalAdmin } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const ManageAdmins = () => {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospitals, setSelectedHospitals] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("hospitals").select("*");

        if (error) {
          setError(error.message);
          return;
        }

        setHospitals(data || null);
      } catch (error) {
        console.error("Error in fetchHospitals:", error);
        toast.error(`Error in fetchHospitals: ${error}`);
      }
    }

    fetchHospitals();
  }, [])
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signUpAsHospitalAdmin(formData);
      console.log(result.status);
      if (result.status === "success") {
        toast.success("Admin created successfully");
      }
    } catch (error) {
      console.error("Error in handleSubmit (Manage Admins): ", error);
      toast.error("Error in handleSubmit (Manage Admins)");
    }

    setLoading(false);
  }

  return (
    <div className="px-2 py-6 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-10">Manage Hospital Admins</h1>

      <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-red-600 font-medium">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <div className="grid gap-2">
                <Label>Hospital:</Label>
                <Select onValueChange={(value) => setSelectedHospitals(value)} name="hospital" required>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {hospitals.length > 0 ? (
                          hospitals.map((hospital) => (
                              <SelectItem key={hospital.id} value={hospital.id.toString()} className="truncate">
                                  {hospital.name}
                              </SelectItem>
                          ))
                      ) : (
                          <SelectItem value={"No hospital available"} disabled>
                              No hospital available
                          </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Adding...</span>
                  </div>
                ) : "Add Hospital Admin"}
              </Button>
            </div>
          </form>
    </div>
  )
}

export default ManageAdmins