"use client";

import { SignUpForm } from "@/components/forms/sign-up/sign-up-form";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");

  console.log(plan, billing);
  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full">
        <SignUpForm />
      </div>
    </main>
  );
}
