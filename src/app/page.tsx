import { LoginForm } from "@/components/LoginForm";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from "next/image";

export default async function Home() {

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 dark">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
