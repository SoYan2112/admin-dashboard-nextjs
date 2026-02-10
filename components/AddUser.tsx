"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"

export function AddUser({ open, onClose, onSave }: { open: boolean, onClose: () => void, onSave: (data: any) => Promise<void> }) {
  const [formData, setFormData] = useState({ name: "", email: "", isAdmin: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSave(formData);
    setFormData({ name: "", email: "" , isAdmin: false}); // Reset form
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Nguyen Van A"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              placeholder="a@example.com"
            />
          </div>
          <div className="flex justify-between">
            <Label>Admin
                <span className="mt-1">
                    <Checkbox
                        onCheckedChange={() => {
                            setFormData({...formData, isAdmin: true})
                        }}                     
            /></span>
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}