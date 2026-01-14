export async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/admin/users", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function updateUser(user: any) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/admin/users/${user.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );

  return res.json();
}

export async function deleteUser(id: number) {
  await fetch(`https://jsonplaceholder.typicode.com/admin/users/${id}`, {
    method: "DELETE",
  });
}
