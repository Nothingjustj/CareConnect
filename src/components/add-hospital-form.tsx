import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function AddHospitalBtn() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"sm"}>
            <Plus /> Add Hospital
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Hospital</DialogTitle>
            <DialogDescription>
              Fill the details below to add a new hospital.
            </DialogDescription>
          </DialogHeader>
          <AddHospitalForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"}>
          <Plus /> Add Hospital
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Hospital</DrawerTitle>
          <DrawerDescription>
            Fill the details below to add a new hospital.
          </DrawerDescription>
        </DrawerHeader>
        <AddHospitalForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddHospitalForm({ className }: React.ComponentProps<"form">) {
  const [newHospital, setNewHospital] = React.useState({
    name: "",
    address: "",
    contact_number: "",
    email: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    try {
      const { error } = await supabase.from("hospitals").insert([newHospital]);

      if (error) throw error;

      setNewHospital({ name: "", address: "", contact_number: "", email: "" });
      toast.success("Hospital added successfully!");
    } catch (error) {
      setError((error as Error).message);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="John Doe"
          value={newHospital.name}
          onChange={(e) =>
            setNewHospital({ ...newHospital, name: e.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="hospital@email.com"
          value={newHospital.email}
          onChange={(e) =>
            setNewHospital({ ...newHospital, email: e.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact">Contact No,</Label>
        <Input
          type="number"
          id="contact"
          placeholder="7896541230"
          value={newHospital.contact_number}
          onChange={(e) =>
            setNewHospital({ ...newHospital, contact_number: e.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          value={newHospital.address}
          onChange={(e) =>
            setNewHospital({ ...newHospital, address: e.target.value })
          }
        />
      </div>
      <Button type="submit">Add Hospital</Button>
    </form>
  );
}
