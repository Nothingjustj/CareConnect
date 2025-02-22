"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/actions/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function HospitalPage() {
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const dispatch = useDispatch();
  const hospitalList = useSelector((state: RootState) => state.hospital.list)

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

  if (loading) return <div className="font-semibold text-3xl">Loading hospitals...</div>;

  return (
    <div className="max-w-7xl w-full px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">List of Hospitals</h1>
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
              {/* <p>Contact: </p> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
