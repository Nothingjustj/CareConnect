"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/actions/supabaseClient";

export default function HospitalPage() {
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<string[]>([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase.from("hospitals").select("*");

      if (error) {
        console.error("Error fetching hospitals:", error.message);
      } else {
        setHospitals(data);
      }

      setLoading(false);
    };

    fetchHospitals();
  }, []);

  if (loading) return <div className="flex items-center text-xl">
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
  <span>Loading hospitals...</span>
</div>;

  return (
    <div className="max-w-7xl w-full px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">List of Hospitals</h1>
      {hospitals.length === 0 ? (
        <p>No hospitals found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital: any) => (
            <li
              key={hospital.id}
              className="p-4 border rounded shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold">{hospital.name}</h2>
              <p>Location: {hospital.address}, {hospital.city}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
