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
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9 lg:h-10"
            onClick={() => clerk.openSignIn()}
          >
            <span className="hidden xs:inline">Sign In</span>
            <span className="xs:hidden">In</span>
          </Button>

          <Button
            size="sm"
            className="bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9 lg:h-10"
            onClick={() => clerk.openSignUp()}
          >
            <span className="hidden xs:inline">Sign Up</span>
            <span className="xs:hidden">Up</span>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {isProUser && (
            <div className="hidden sm:flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Pro</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9 lg:h-10"
            onClick={() => window.location.href = ROUTES.DASHBOARD}
          >
            <span className="hidden lg:inline">Dashboard</span>
            <span className="lg:hidden">Dash</span>
          </Button>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full ring-2 ring-black/20 hover:ring-black/40 transition-all duration-200"
              }
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}
