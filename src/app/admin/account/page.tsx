// src/app/admin/account/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/loading-screen";
import Link from "next/link";

export default function AdminAccountPage() {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminDetails, setAdminDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      setLoading(true);
      try {
        if (!user?.id) {
          // User is not logged in or data not loaded yet
          return;
        }
        
        const supabase = createClient();
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        setAdminDetails(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone_no: data.phone_no || "",
        });
      } catch (error) {
        console.error("Error fetching admin details:", error);
        toast.error("Failed to load your account details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminDetails();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("admins")
        .update({
          name: formData.name,
          phone_no: formData.phone_no,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast.success("Account details updated successfully");
    } catch (error) {
      console.error("Error updating admin details:", error);
      toast.error("Failed to update account details");
    } finally {
      setSaving(false);
    }
  };

  // Show login message if user is not logged in
  if (!user?.id && !loading) {
    return (
      <div className="px-2 py-6 text-center">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        <p className="text-muted-foreground">Please log in to view your account details.</p>
        <Button className="mt-4" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-2 py-6">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_no">Phone Number</Label>
              <Input
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={user.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <Button type="submit" className="mt-4" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}