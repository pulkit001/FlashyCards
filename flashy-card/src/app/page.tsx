'use client';
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0';
import Profile from './profile';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Oops... {error.message}</div>;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {user ? (
          <>
            <Profile />
            <h1 className="text-4xl font-bold mt-8">Welcome to Flashy Card!</h1>
            <p className="text-lg text-center mt-4 max-w-md">
              Flashy Card is your ultimate solution for creating and managing flashcards.
              Whether you're studying for exams, learning a new language, or just
              want to boost your memory, we've got you covered.
            </p>
            <div className="flex gap-4 mt-6">
              <Button asChild>
                <a href="/dashboard">Get Started</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/logout">Logout</a>
              </Button>
            </div>
          </>
        ) : (
          <Button asChild>
            <a href="/auth/login">Login</a>
          </Button>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
