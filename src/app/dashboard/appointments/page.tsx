"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("id, date, time_slot, status, hospitals(name), departments(name)")
        .eq("user_id", user.id);

      if (!error) setAppointments(data || []);
      setLoading(false);
    }

    fetchAppointments();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="px-2 py-8">
      <h1 className="text-2xl font-bold mb-2">My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Hospital:</strong> {appt.hospitals.name}</p>
              <p><strong>Department:</strong> {appt.departments.name}</p>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time Slot:</strong> {appt.time_slot}</p>
              <p><strong>Status:</strong> {appt.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
