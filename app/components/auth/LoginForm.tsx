"use client";

import { useState, SetStateAction } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react"; // ✅ Spinner icon

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false); // stop loading on error
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm p-8 rounded-2xl border shadow-lg
          border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
          bg-[var(--color-surface-contrast)] dark:bg-[var(--color-surface-deep)]
          backdrop-blur-sm space-y-5 transition-all duration-300"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            SoftDrink Sales
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setUsername(e.target.value)
            }
            className="peer"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setPassword(e.target.value)
            }
            className="peer"
            disabled={loading}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[var(--color-error)] text-sm text-center">
            {error}
          </p>
        )}

        {/* Submit Button with loader */}
        <Button
          type="submit"
          className="w-full h-10 rounded-xl bg-[var(--color-mint-500)] hover:bg-[var(--color-mint-500)/90] text-white font-medium transition-all flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        {/* Footer hint */}
        <p className="text-xs text-center text-[var(--color-text-muted)] pt-2">
          © {new Date().getFullYear()} SoftDrink Sales System
        </p>
      </form>
    </div>
  );
}
