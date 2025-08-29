'use client';

import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Crown } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { ROUTES } from "@/lib/constants";

export function HeaderAuthButtons() {
  const clerk = useClerk();
  const { isProUser } = useSubscription();
  

  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium"
            onClick={() => clerk.openSignIn()}
          >
            Sign In
          </Button>

          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium"
            onClick={() => clerk.openSignUp()}
          >
            Sign Up
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center space-x-4">
          {isProUser && (
            <div className="flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              <Crown className="h-4 w-4 mr-1" />
              Pro
            </div>
          )}
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium"
            onClick={() => window.location.href = ROUTES.DASHBOARD}
          >
            Dashboard
          </Button>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 rounded-full ring-2 ring-black/20 hover:ring-black/40 transition-all duration-200"
              }
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}
