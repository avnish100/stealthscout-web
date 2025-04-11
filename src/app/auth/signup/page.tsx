'use client'
import { SignUpForm } from "@/components/SignUpForm";

export default function SignInPage(){

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 dark">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
    )
}