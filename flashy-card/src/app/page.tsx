'use client';
import { useClerk } from "@clerk/nextjs";
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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground">Welcome to Flashy Cards</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Create, organize, and study flashcards to enhance your learning experience.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            onClick={() => clerk.openSignIn()} 
            variant="outline"
            size="xl"
            className="px-8 py-4 text-lg"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => clerk.openSignUp()} 
            size="xl"
            className="px-8 py-4 text-lg shadow-lg hover:shadow-xl"
          >
            Sign Up
          </Button>
        </div>
      </main>
    </div>
  );
}
