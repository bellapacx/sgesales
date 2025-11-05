"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ username }: { username: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

    setLoading(true);
    const res = await fetch(`/api/users/${username}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      router.refresh(); // ✅ refreshes user list
    } else {
      alert("❌ Failed to delete user.");
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Trash2 className="w-4 h-4" />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
