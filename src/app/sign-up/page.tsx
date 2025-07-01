"use client";

import { SignUpForm } from "@/components/forms/sign-up/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full">
        <SignUpForm />
      </div>
    </main>
  );
}
