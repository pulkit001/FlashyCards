'use client';

import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function HeaderAuthButtons() {
  const clerk = useClerk();

  return (
    <>
      <SignedOut>
        <Button
          variant="ghost"
          className="text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          onClick={() => clerk.openSignIn()}
        >
          Sign In
        </Button>

        <Button
          variant="ghost"
          className="text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          onClick={() => clerk.openSignUp()}
        >
          Sign Up
        </Button>

        
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
