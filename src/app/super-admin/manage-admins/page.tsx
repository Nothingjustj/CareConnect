"use client";

import { createHospitalAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Admin = {
  id: string;
  name: string;
  email: string;
  hospital_id: string;
};

const ManageAdmins = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Local state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("hospitals").select("*");

        if (error) {
          setError(error.message);
          return;
        }

        setHospitals(data || []);
      } catch (error) {
        console.error("Error in fetchHospitals:", error);
        toast.error(`Error in fetchHospitals: ${error}`);
      }
    };

    const fetchHospitalAdmins = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("role", "hospital_admin");
        setAdmins(data as Admin[]);
        if (error) {
          setError(error.message);
        }
      } catch (error) {
        console.error(`Error fetching hospital admins: ${error}`);
        toast.error(`Error fetching hospital admins: ${error}`);
      }
    };

    fetchHospitals();
    fetchHospitalAdmins();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedHospital) {
      toast.error("Please select a hospital.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("hospital", selectedHospital || "");

    try {
      const result = await createHospitalAdmin(formData);
      if (result.status === "success") {
        toast.success("Admin created successfully");

        // Clear form fields on success
        setName("");
        setEmail("");
        setPassword("");
        setSelectedHospital(null);
        setError("");
      }
    } catch (error) {
      console.error("Error in handleSubmit (Manage Admins): ", error);
      toast.error("Error in handleSubmit (Manage Admins)");
    }

    setLoading(false);
  };

  return (
    <div className="px-2 py-6">
      <h1 className="text-2xl font-semibold mb-10">Manage Hospital Admins</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-none md:grid-cols-2 gap-6">
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Hospital:</Label>
            <Select
              onValueChange={(value) => setSelectedHospital(value)}
              value={selectedHospital || ""}
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital) => (
                      <SelectItem
                        key={hospital.id}
                        value={hospital.id.toString()}
                        className="truncate"
                      >
                        {hospital.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="No hospital available" disabled>
                      No hospital available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full col-span-2"
            disabled={loading}
          >
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
            ) : (
              "Add Hospital Admin"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Hospital Admins</h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Hospital
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const hospitalName =
                  hospitals.find((h) => h.id.toString() === admin.hospital_id)
                    ?.name ?? "Unknown Hospital";
                return (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {admin.name ?? "Unnamed Admin"}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {admin.email}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {hospitalName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
