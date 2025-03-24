// src/components/admin/time-slot-config.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function TimeSlotConfig({ hospitalId, departmentId }: { hospitalId: string, departmentId: number }) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [lunchStartTime, setLunchStartTime] = useState("13:00");
  const [lunchEndTime, setLunchEndTime] = useState("14:00");
  const [slotDuration, setSlotDuration] = useState("15");
  const [enableLunchBreak, setEnableLunchBreak] = useState(true);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate time slots based on configuration
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: string[] = [];
      const duration = parseInt(slotDuration);
      
      // Parse times to minutes since midnight
      const start = parseTimeToMinutes(startTime);
      const end = parseTimeToMinutes(endTime);
      const lunchStart = parseTimeToMinutes(lunchStartTime);
      const lunchEnd = parseTimeToMinutes(lunchEndTime);
      
      for (let time = start; time < end; time += duration) {
        // Skip lunch break times
        if (enableLunchBreak && time >= lunchStart && time < lunchEnd) {
          continue;
        }
        
        slots.push(formatMinutesToTime(time));
      }
      
      setTimeSlots(slots);
    };
    
    generateTimeSlots();
  }, [startTime, endTime, lunchStartTime, lunchEndTime, slotDuration, enableLunchBreak]);

  // Helper functions to convert between time format and minutes
  const parseTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const formatMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Save configuration to database
  const saveConfiguration = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // First check if the department_time_slots table exists
      try {
        const { error: tableCheckError } = await supabase
          .from('department_time_slots')
          .select('id')
          .limit(1);
        
        if (tableCheckError && tableCheckError.code === '42P01') {
          // Table doesn't exist, we need to create it
          toast.error("Time slot configuration table doesn't exist. Using default time slots instead.");
          setLoading(false);
          return;
        }
        
        // Table exists, proceed with upsert
        const { error } = await supabase
          .from('department_time_slots')
          .upsert({
            hospital_id: hospitalId,
            department_id: departmentId,
            start_time: startTime,
            end_time: endTime,
            lunch_start_time: enableLunchBreak ? lunchStartTime : null,
            lunch_end_time: enableLunchBreak ? lunchEndTime : null,
            slot_duration: parseInt(slotDuration),
            slots: timeSlots,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'hospital_id,department_id'
          });
        
        if (error) throw error;
        
        toast.success("Time slot configuration saved successfully");
      } catch (tableError) {
        console.error("Error checking table existence:", tableError);
        toast.error("Unable to save time slot configuration. Using default time slots.");
      }
    } catch (error) {
      console.error("Error saving time slot configuration:", error);
      toast.error("Failed to save time slot configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Time Slot Configuration</h2>
        <p className="text-muted-foreground">Configure appointment time slots for this department</p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="lunch-break">Enable Lunch Break</Label>
            <Switch
              id="lunch-break"
              checked={enableLunchBreak}
              onCheckedChange={setEnableLunchBreak}
            />
          </div>
        </div>
        
        {enableLunchBreak && (
          <>
            <div>
              <Label htmlFor="lunch-start">Lunch Break Start</Label>
              <Input
                id="lunch-start"
                type="time"
                value={lunchStartTime}
                onChange={(e) => setLunchStartTime(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="lunch-end">Lunch Break End</Label>
              <Input
                id="lunch-end"
                type="time"
                value={lunchEndTime}
                onChange={(e) => setLunchEndTime(e.target.value)}
              />
            </div>
          </>
        )}
        
        <div className="md:col-span-2">
          <Label htmlFor="slot-duration">Slot Duration (minutes)</Label>
          <Select
            value={slotDuration}
            onValueChange={setSlotDuration}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Generated Time Slots</h3>
        <div className="bg-muted p-4 rounded-md max-h-48 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <div key={slot} className="bg-background border rounded px-2 py-1 text-center text-sm">
                {slot}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={saveConfiguration} disabled={loading}>
          {loading ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}