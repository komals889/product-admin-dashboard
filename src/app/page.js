"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait until we've checked localStorage
    if (user) {
      router.replace("/products");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );
}
