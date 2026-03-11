import { User } from "@/types/user";


export async function getUsers() {
  const res = await fetch("/api/users", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  const list = await res.json();
  return list as User[];
}

export async function updateUser(user: Pick<User, 'id' | 'name' | 'email' | 'isAdmin'>) {
  const res = await fetch(`/api/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  } 
    
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
}

// lib/api.ts
export async function createUser(userData: { name: string; email: string; isAdmin: boolean }) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create user");
  }

  return res.json();
}

// get user by ID
export async function getUserById(id: string) {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok){
        throw new Error("Failed to fetch user");
    }
    return res.json();
}