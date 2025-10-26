"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

// ✅ Schema with plate number
const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  plateNumber: z.string().min(3, "Plate number is required"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onCreated?: () => void; // optional callback for parent refresh
}

export default function CreateUserForm({ onCreated }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        onCreated?.();
        toast.success("✅ Salesperson created successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Username */}
      <div>
        <label className="block font-medium">Username</label>
        <input
          {...register("username")}
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block font-medium">Name</label>
        <input
          {...register("name")}
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Enter full name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Plate Number */}
      <div>
        <label className="block font-medium">Plate Number</label>
        <input
          {...register("plateNumber")}
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Enter assigned vehicle plate number"
        />
        {errors.plateNumber && (
          <p className="text-red-500 text-sm">{errors.plateNumber.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block font-medium">Password</label>
        <input
          {...register("password")}
          type="password"
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Salesperson"}
      </button>
    </form>
  );
}
