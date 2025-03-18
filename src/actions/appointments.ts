// src/actions/appointments.ts - Updated version

"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUserSession } from "./auth"
import crypto from "crypto"

// Check availability for a specific date, hospital, and department
export async function checkAvailability(
  hospitalId: string,
  departmentId: number,
  date: string
) {
  try {
    const supabase = await createClient()
    
    // Get the hospital department record
    const { data: hospitalDept, error: deptError } = await supabase
      .from("hospital_departments")
      .select("id, daily_token_limit, current_token_count")
      .eq("hospital_id", hospitalId)
      .eq("department_type_id", departmentId)
      .single()
    
    if (deptError) {
      console.error("Error fetching hospital department:", deptError.message, deptError.code, deptError.details);
      throw deptError;
    }
    
    if (!hospitalDept) {
      return {
        status: "error",
        message: "Department not found in this hospital",
        available: false,
      }
    }
    
    // Count appointments for this date, hospital, and department
    const { count, error: countError } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
    
    if (countError) {
      console.error("Error counting appointments:", countError.message, countError.code, countError.details);
      throw countError;
    }
    
    const isAvailable = count !== null && count < hospitalDept.daily_token_limit
    const remainingSlots = hospitalDept.daily_token_limit - (count || 0)
    
    return {
      status: "success",
      available: isAvailable,
      remainingSlots: remainingSlots,
      totalSlots: hospitalDept.daily_token_limit,
      hospitalDepartmentId: hospitalDept.id
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    return {
      status: "error",
      message: error instanceof Error ? `Failed to check availability: ${error.message}` : "Failed to check availability",
      available: false,
    }
  }
}

export async function bookOpdAppointment(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const session = await getUserSession();
    if (!session?.user) {
      return {
        status: "error",
        message: "You must be logged in to book an appointment"
      }
    }
    
    const userId = session.user.id;
    
    // Extract form data
    const patientData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      age: formData.get("age") as string,
      gender: formData.get("gender") as string,
    }
    
    const hospitalId = formData.get("hospital") as string;
    const departmentId = parseInt(formData.get("department") as string);
    const appointmentDate = formData.get("date") as string;
    const timeSlot = formData.get("timeSlot") as string;
    const isExistingPatient = formData.get("existingPatient") === "true";
    
    // Check if we have all required data
    if (!patientData.name || !patientData.phone || !hospitalId || !departmentId || !appointmentDate || !timeSlot) {
      console.error("Missing required data:", { patientData, hospitalId, departmentId, appointmentDate, timeSlot });
      return {
        status: "error",
        message: "Please fill all required details"
      }
    }
    
    // Check availability again
    const availability = await checkAvailability(hospitalId, departmentId, appointmentDate);
    
    if (!availability.available) {
      return {
        status: "error",
        message: "No slots available for the selected date"
      }
    }
    
    // Check if patient record exists, and update it if needed
    const { data: existingPatient, error: patientQueryError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (patientQueryError) {
      console.error("Error checking for existing patient:", patientQueryError.message, patientQueryError.code, patientQueryError.details);
      
      // Patient record doesn't exist, create one using the user ID as the ID
      const { error: insertError } = await supabase
        .from("patients")
        .insert({
          id: userId, // Use the user ID as patient ID
          user_id: userId,
          name: patientData.name,
          phone_no: patientData.phone,
          age: patientData.age,
          gender: patientData.gender,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Error creating patient record:", insertError.message, insertError.code, insertError.details);
        return {
          status: "error",
          message: `Failed to create patient record: ${insertError.message}`
        };
      }
    } else {
      // Patient exists, update if needed
      if (!isExistingPatient) {
        const { error: updateError } = await supabase
          .from("patients")
          .update({
            name: patientData.name,
            phone_no: patientData.phone,
            age: patientData.age,
            gender: patientData.gender,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
        
        if (updateError) {
          console.error("Error updating patient:", updateError.message, updateError.code, updateError.details);
          return {
            status: "error",
            message: `Failed to update patient details: ${updateError.message}`
          };
        }
      }
    }
    
    // Get the hospital department record
    const { data: hospitalDept, error: deptError } = await supabase
      .from("hospital_departments")
      .select("id, last_token_number, current_token_count")
      .eq("hospital_id", hospitalId)
      .eq("department_type_id", departmentId)
      .single();
    
    if (deptError) {
      console.error("Error fetching hospital department:", deptError.message, deptError.code, deptError.details);
      return {
        status: "error",
        message: `Failed to fetch department details: ${deptError.message}`
      };
    }
    
    // Get hospital name for token
    const { data: hospital, error: hospitalError } = await supabase
      .from("hospitals")
      .select("name")
      .eq("id", hospitalId)
      .single();
    
    if (hospitalError) {
      console.error("Error fetching hospital:", hospitalError.message, hospitalError.code, hospitalError.details);
    }
    
    // Get department name for token
    const { data: department, error: departmentError } = await supabase
      .from("department_types")
      .select("name")
      .eq("id", departmentId)
      .single();
    
    if (departmentError) {
      console.error("Error fetching department:", departmentError.message, departmentError.code, departmentError.details);
    }
    
    // Generate token number (hosp-dept-date-3 digit number)
    // Improved hospital code generation
    const hospitalCode = hospital?.name
      ? hospital.name
          .split(/[\s.]+/) // Split by spaces and periods
          .filter((part: any) => part.length > 0) // Remove empty parts
          .map((part: any) => part.charAt(0)) // Take first character of each part
          .join('') // Join them together
          .substring(0, 3) // Take first 3 characters (if available)
          .toUpperCase()
      : "GEN";
    
    const departmentCode = department?.name.substring(0, 3).toUpperCase() || "GEN";
    const dateCode = appointmentDate.replace(/-/g, "");
    const nextTokenNumber = (hospitalDept.last_token_number || 0) + 1;
    const tokenNumber = `${hospitalCode}-${departmentCode}-${dateCode}-${nextTokenNumber.toString().padStart(3, '0')}`;
    
    // Update the last token number
    const { error: updateTokenError } = await supabase
      .from("hospital_departments")
      .update({ 
        last_token_number: nextTokenNumber,
        current_token_count: (hospitalDept.current_token_count || 0) + 1
      })
      .eq("id", hospitalDept.id);
    
    if (updateTokenError) {
      console.error("Error updating token number:", updateTokenError.message, updateTokenError.code, updateTokenError.details);
      return {
        status: "error",
        message: `Failed to generate token: ${updateTokenError.message}`
      };
    }
    
    // Calculate estimated time (simple algorithm - 15 minutes per patient)
    const baseTime = new Date(`${appointmentDate}T${timeSlot}`);
    const estimatedTime = new Date(baseTime.getTime() + (nextTokenNumber * 15 * 60000));
    
    // Log the data being inserted for debugging
    console.log("Creating appointment with data:", {
      patient_id: userId,
      hospital_id: hospitalId,
      department_id: departmentId,
      hospital_department_id: hospitalDept.id,
      date: appointmentDate,
      time_slot: timeSlot,
      token_number: tokenNumber,
      status: "waiting",
      estimated_time: estimatedTime.toISOString()
    });
    
    // Create the appointment - use userId as patient_id
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: userId, // Use userId as patient_id
        hospital_id: hospitalId,
        department_id: departmentId,
        hospital_department_id: hospitalDept.id,
        date: appointmentDate,
        time_slot: timeSlot,
        token_number: tokenNumber,
        status: "waiting",
        estimated_time: estimatedTime.toISOString()
      })
      .select("id, token_number")
      .single();
    
    if (appointmentError) {
      console.error("Error creating appointment:", appointmentError.message, appointmentError.code, appointmentError.details);
      return {
        status: "error",
        message: `Failed to create appointment: ${appointmentError.message}`
      };
    }
    
    revalidatePath("/dashboard/appointments");
    
    return {
      status: "success",
      message: "Appointment booked successfully",
      tokenNumber: tokenNumber,
      appointmentId: appointment.id,
      estimatedTime: estimatedTime.toISOString()
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to book appointment"
    }
  }
}
// Get time slots for a specific date
export async function getTimeSlots(
  hospitalId: string,
  departmentId: number,
  date: string
) {
  try {
    const supabase = await createClient();
    
    // Default time slots if no configuration is found
    let allTimeSlots = [
      "09:00", "09:15", "09:30", "09:45", 
      "10:00", "10:15", "10:30", "10:45", 
      "11:00", "11:15", "11:30", "11:45", 
      "12:00", "12:15", "12:30", "12:45",
      "14:00", "14:15", "14:30", "14:45", 
      "15:00", "15:15", "15:30", "15:45",
      "16:00", "16:15", "16:30", "16:45"
    ];
    
    // Try to get configured time slots
    try {
      const { data: timeSlotConfig, error: configError } = await supabase
        .from("department_time_slots")
        .select("slots")
        .eq("hospital_id", hospitalId)
        .eq("department_id", departmentId)
        .single();
      
      // Use configured slots if available
      if (!configError && timeSlotConfig && timeSlotConfig.slots) {
        allTimeSlots = timeSlotConfig.slots;
      }
    } catch (error) {
      console.log("Using default time slots due to error or missing table:", error);
      // Continue with default time slots
    }
    
    // Get booked slots
    const { data: bookedAppointments, error } = await supabase
      .from("appointments")
      .select("time_slot")
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date);
    
    if (error) {
      console.error("Error fetching booked appointments:", error.message, error.code, error.details);
    }
    
    // If appointments table doesn't exist yet or there's an error, assume no booked slots
    const bookedSlots = error ? [] : (bookedAppointments?.map(app => app.time_slot) || []);
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    
    return {
      status: "success",
      slots: availableSlots
    };
  } catch (error) {
    console.error("Error getting time slots:", error);
    // Return default slots for development/testing
    return {
      status: "error",
      message: error instanceof Error ? `Failed to get time slots: ${error.message}` : "Failed to get time slots",
      slots: [
        "09:00", "09:15", "09:30", "09:45", 
        "10:00", "10:15", "10:30", "10:45", 
        "11:00", "11:15", "11:30", "11:45", 
        "12:00", "12:15", "12:30", "12:45",
        "14:00", "14:15", "14:30", "14:45", 
        "15:00", "15:15", "15:30", "15:45",
        "16:00", "16:15", "16:30", "16:45"
      ]
    };
  }
}

// Track an OPD appointment by token number
export async function trackOpdByToken(tokenNumber: string) {
  try {
    const supabase = await createClient();
    
    // Get the appointment directly by token_number
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select(`
        id, 
        date, 
        time_slot, 
        status, 
        estimated_time,
        token_number,
        hospital_id,
        department_id,
        called_at,
        completed_at,
        created_at,
        hospitals:hospital_id(name),
        departments:department_id(name),
        patients:patient_id(id, name, age, gender, phone_no)
      `)
      .eq("token_number", tokenNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (appointmentError) {
      console.error("Error finding token:", appointmentError.message, appointmentError.code, appointmentError.details);
      return {
        status: "error",
        message: `Token not found: ${appointmentError.message}`,
        found: false
      }
    }
    
    // Get current token being served for this department on this date
    const { data: currentToken, error: currentError } = await supabase
      .from("appointments")
      .select("token_number")
      .eq("hospital_id", appointment.hospital_id)
      .eq("department_id", appointment.department_id)
      .eq("date", appointment.date)
      .eq("status", "in-progress")
      .order("called_at", { ascending: true })
      .limit(1)
      .single();
    
    if (currentError && currentError.code !== 'PGRST116') {
      console.error("Error fetching current token:", currentError.message, currentError.code, currentError.details);
    }
    
    // Calculate position in queue
    const { count: positionInQueue, error: queueError } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", appointment.hospital_id)
      .eq("department_id", appointment.department_id)
      .eq("date", appointment.date)
      .eq("status", "waiting")
      .lt("created_at", appointment.created_at);
    
    if (queueError) {
      console.error("Error calculating queue position:", queueError.message, queueError.code, queueError.details);
      throw queueError;
    }
    
    // Format the response using the appointment data
    return {
      status: "success",
      found: true,
      token: {
        token_number: appointment.token_number,
        status: appointment.status,
        hospital_id: appointment.hospital_id,
        department_id: appointment.department_id,
        date: appointment.date,
        called_at: appointment.called_at,
        completed_at: appointment.completed_at,
        created_at: appointment.created_at
      },
      patient: appointment.patients,
      currentToken: currentToken?.token_number || null,
      positionInQueue: appointment.status === "waiting" ? positionInQueue : 0,
      estimatedTime: appointment.estimated_time,
      appointment: {
        id: appointment.id,
        date: appointment.date,
        time_slot: appointment.time_slot,
        status: appointment.status,
        estimated_time: appointment.estimated_time,
        // patient_id: appointment.patients?.id
      },
      hospital: appointment.hospitals,
      department: appointment.departments
    }
  } catch (error) {
    console.error("Error tracking token:", error);
    return {
      status: "error",
      message: error instanceof Error ? `Failed to track token: ${error.message}` : "Failed to track token",
      found: false
    }
  }
}

// Get all appointments for the current user
export async function getUserAppointments() {
  try {
    const session = await getUserSession();
    if (!session?.user) {
      return {
        status: "error",
        message: "You must be logged in to view appointments"
      }
    }
    
    const userId = session.user.id;
    const supabase = await createClient();
    
    // Query appointments using the patient_id field
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        *,
        hospitals:hospital_id(name),
        departments:department_id(name)
      `)
      .eq("patient_id", userId)
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Error fetching appointments:", error.message, error.code, error.details);
      return {
        status: "error",
        message: `Failed to get appointments: ${error.message}`
      }
    }
    
    return {
      status: "success",
      appointments
    }
  } catch (error) {
    console.error("Error getting appointments:", error);
    return {
      status: "error",
      message: error instanceof Error ? `Failed to get appointments: ${error.message}` : "Failed to get appointments"
    }
  }
}