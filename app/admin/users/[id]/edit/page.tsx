"use client";

import UserForm, { UserFormData } from "@/components/user-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setUser(data);
            setLoading(false);
        });
    }, [id]);

    const handleUpdate = async (data: UserFormData) => {
        const res = await fetch (`/api/users/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Update failed");
        }

        alert("User updated successfully");
    };

    if (loading) return <p>Loading...</p>
     
    return (
        <div className="max-w-md space-y-6">
            <h1 className="text-2xl font-bold">Edit User</h1>

            {user && (
                <UserForm 
                defaultValues={user}
                onSubmit={handleUpdate}
                submitText="Update"/>
            )}
        </div>
    )

}
