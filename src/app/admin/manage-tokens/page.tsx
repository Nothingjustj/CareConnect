// src/app/admin/manage-tokens/page.tsx - Updated version

"use client";

import { getDepartmentTokens, updateTokenStatus } from "@/actions/tokens";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ManageTokens = () => {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Get the admin's associated hospital and department
    const fetchAdminDetails = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("admins")
          .select("hospital_id, department_id")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setHospitalId(data.hospital_id);
          setDepartmentId(data.department_id);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        toast.error("Failed to fetch admin details");
      }
    };
    
    fetchAdminDetails();
  }, [user.id]);
  
  useEffect(() => {
    if (hospitalId && departmentId && date) {
      fetchTokens();
    }
  }, [hospitalId, departmentId, date]);
  
  const fetchTokens = async () => {
    if (!hospitalId || !departmentId) return;
    
    setLoading(true);
    try {
      const result = await getDepartmentTokens(hospitalId, departmentId, date);
      
      if (result.status === "success") {
        setTokens(result.tokens || []);
      } else {
        toast.error(result.message || "Failed to fetch tokens");
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      toast.error("An error occurred while fetching tokens");
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (tokenId: string, newStatus: 'waiting' | 'in-progress' | 'completed' | 'cancelled') => {
    try {
      const result = await updateTokenStatus(tokenId, newStatus);
      
      if (result.status === "success") {
        toast.success(result.message || "Status updated successfully");
        // Refresh the tokens list
        fetchTokens();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    }
  };
  
  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="px-2 py-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Tokens</h1>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={fetchTokens} className="ml-auto">
              Refresh Tokens
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <p>Loading tokens...</p>
      ) : tokens.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tokens found for this date</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left border">Token #</th>
                <th className="px-4 py-2 text-left border">Patient</th>
                <th className="px-4 py-2 text-left border">Time Slot</th>
                <th className="px-4 py-2 text-left border">Status</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id} className="hover:bg-muted/50">
                  <td className="px-4 py-2 border font-medium">{token.token_number}</td>
                  <td className="px-4 py-2 border">
                    <div>
                      <p>{token.patient?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">
                        {token.patient ? `${token.patient.age}y, ${token.patient.gender}` : ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{formatTime(token.timeSlot)}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      token.status === 'waiting' ? 'bg-blue-100 text-blue-800' :
                      token.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      token.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <Select
                      value={token.status}
                      onValueChange={(value) => handleStatusChange(token.id, value as any)}
                      disabled={token.status === 'completed' || token.status === 'cancelled'}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTokens;