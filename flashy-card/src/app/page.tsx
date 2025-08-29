'use client';
import { SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const clerk = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold mt-8">Welcome</h1>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => clerk.openSignIn()}>
            Sign In
          </Button>
          <Button onClick={() => clerk.openSignUp()}>
            Sign Up
          </Button>
        </div>
      </main>
      
    </div>
  );
}
