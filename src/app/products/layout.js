"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";

export default function ProductsLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProductsLayout render:", { user, loading });
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While we're checking localStorage, or redirecting an unauthenticated
  // user, show a loader instead of flashing the protected page's content.
  if (loading || !user) {
    return <Loader />;
  }

  return <>{children}</>;
}