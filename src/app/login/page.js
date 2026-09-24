"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../service/authService";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login,user,loading } = useAuth();
  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false); // prevents double-submit on fast clicks

  useEffect(() => {
  if (!loading && user) {
    router.replace("/products");
  }
}, [loading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guard: ignore extra clicks while a request is in flight

    setError("");
    setSubmitting(true);

    try {
      const data = await loginUser(username, password);
      login(data.accessToken, {
        id: data.id,
        username: data.username,
        firstName: data.firstName,
      });
      router.push("/products");
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-gray p-6 shadow"
      >
        <h1 className="mb-4 text-xl font-semibold">Admin Login</h1>

        {error && (
          <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <label className="mb-1 block text-sm font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3 w-full rounded border px-3 py-2 text-sm"
          required
        />

        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2 text-sm"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}