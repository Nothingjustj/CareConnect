// src/actions/tokens.ts - Updated version

"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Get all tokens for a specific department, hospital and date
export async function getDepartmentTokens(
  hospitalId: string,
  departmentId: number,
  date: string
) {
  try {
    const supabase = await createClient()
    
    // Query directly from appointments table since tokens are merged
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        id,
        token_number,
        status,
        date,
        time_slot,
        called_at,
        completed_at,
        created_at,
        patients:patient_id(id, name, age, gender, phone_no)
      `)
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
      .order("created_at", { ascending: true })
    
    if (error) {
      console.error("Error fetching department tokens:", error.message, error.code, error.details);
      throw error;
    }
    
    // Transform the data to make it easier to use
    const transformedTokens = appointments.map(appointment => ({
      id: appointment.id,
      token_number: appointment.token_number,
      status: appointment.status,
      date: appointment.date,
      created_at: appointment.created_at,
      called_at: appointment.called_at,
      completed_at: appointment.completed_at,
      patient: appointment.patients,
      timeSlot: appointment.time_slot
    }))
    
    return {
      status: "success",
      tokens: transformedTokens
    }
  } catch (error) {
    console.error("Error getting department tokens:", error);
    return {
      status: "error",
      message: error instanceof Error ? `Failed to get tokens: ${error.message}` : "Failed to get tokens"
    }
  }
}

// Update token status (for admin panel)
export async function updateTokenStatus(
  appointmentId: string,
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled'
) {
  try {
    const supabase = await createClient()
    
    // First get the appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("hospital_id, department_id, date, token_number, time_slot")
      .eq("id", appointmentId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching appointment:", fetchError.message, fetchError.code, fetchError.details);
      throw fetchError;
    }
    
    // Update status directly in appointments table
    const updateData: any = { status }
    
    // If status is in-progress, set called_at
    if (status === 'in-progress') {
      updateData.called_at = new Date().toISOString()
    }
    
    // If status is completed, set completed_at
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }
    
    const { error: updateError } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", appointmentId)
    
    if (updateError) {
      console.error("Error updating token status:", updateError.message, updateError.code, updateError.details);
      throw updateError;
    }
    
    // If status changed to completed or cancelled, update estimated times for remaining tokens
    // Note: This will now reset all estimated times to their appointment times (no waiting time)
    if (status === 'completed' || status === 'cancelled') {
      await updateQueueEstimatedTimes(
        appointment.hospital_id,
        appointment.department_id,
        appointment.date
      );
    }
    
    revalidatePath(`/admin/manage-tokens`)
    
    return {
      status: "success",
      message: `Token status updated to ${status}`
    }
  } catch (error) {
    console.error("Error updating token status:", error);
    return {
      status: "error",
      message: error instanceof Error ? `Failed to update token status: ${error.message}` : "Failed to update token status"
    }
  }
}

// Helper function to update estimated times for the queue
async function updateQueueEstimatedTimes(
  hospitalId: string,
  departmentId: number,
  date: string
) {
  try {
    const supabase = await createClient();
    
    // Get all waiting tokens for this hospital, department, and date
    const { data: waitingTokens, error } = await supabase
      .from("appointments")
      .select("id, time_slot")
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
      .eq("status", "waiting")
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching waiting tokens:", error.message, error.code, error.details);
      throw error;
    }
    
    // Update estimated times for each waiting token
    for (let i = 0; i < waitingTokens.length; i++) {
      const token = waitingTokens[i];
      
      // Parse time slot
      const [hoursStr, minutesStr] = token.time_slot.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      // Create a Date object for the appointment date
      const baseDate = new Date(date);
      // Set the hours and minutes
      baseDate.setHours(hours, minutes, 0, 0);
      
      // MODIFIED: Set estimated time equal to appointment time (no waiting time)
      const estimatedDate = new Date(baseDate);
      
      // Format as timestamp for database storage (YYYY-MM-DD HH:MM:SS)
      const estimatedTimeString = `${estimatedDate.getFullYear()}-${(estimatedDate.getMonth() + 1).toString().padStart(2, '0')}-${estimatedDate.getDate().toString().padStart(2, '0')} ${estimatedDate.getHours().toString().padStart(2, '0')}:${estimatedDate.getMinutes().toString().padStart(2, '0')}:00`;
      
      // Update the database
      const { error: updateError } = await supabase
        .from("appointments")
        .update({ estimated_time: estimatedTimeString })
        .eq("id", token.id);
      
      if (updateError) {
        console.error("Error updating estimated time:", updateError.message, updateError.code, updateError.details);
        // Continue with next token even if this one fails
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating queue estimated times:", error);
    return false;
  }
}
// Get current queue status for a department
export async function getDepartmentQueueStatus(
  hospitalId: string,
  departmentId: number,
  date: string
) {
  try {
    const supabase = await createClient()
    
    // Get counts for each status from appointments table
    const { data: waitingCount, error: waitingError } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
      .eq("status", "waiting")
    
    if (waitingError) {
      console.error("Error getting waiting count:", waitingError.message, waitingError.code, waitingError.details);
    }
    
    const { data: inProgressCount, error: inProgressError } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
      .eq("status", "in-progress")
    
    if (inProgressError) {
      console.error("Error getting in-progress count:", inProgressError.message, inProgressError.code, inProgressError.details);
    }
    
    const { data: completedCount, error: completedError } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
      .eq("status", "completed")
    
    if (completedError) {
      console.error("Error getting completed count:", completedError.message, completedError.code, completedError.details);
    }
    
    // Get currently serving token
    const { data: currentToken, error: currentError } = await supabase
      .from("appointments")
      .select("token_number, called_at")
      .eq("hospital_id", hospitalId)
      .eq("department_id", departmentId)
      .eq("date", date)
      .eq("status", "in-progress")
      .order("called_at", { ascending: true })
      .limit(1)
      .single()
    
    if (currentError && currentError.code !== 'PGRST116') {
      console.error("Error getting current token:", currentError.message, currentError.code, currentError.details);
    }
    
    return {
      status: "success",
      queueStatus: {
        waiting: waitingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        currentToken: currentToken?.token_number || null,
        calledAt: currentToken?.called_at || null
      }
    }
  } catch (error) {
    console.error("Error getting queue status:", error);
    return {
      status: "error",
      message: error instanceof Error ? `Failed to get queue status: ${error.message}` : "Failed to get queue status"
    }
  }
}