"use client";

import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";

export default function Template({ children }) {
  return (
    <>
      <AppShell>{children}</AppShell>
    </>
  );
}
