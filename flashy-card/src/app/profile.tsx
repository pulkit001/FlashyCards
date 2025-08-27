'use client';
import { useUser } from '@auth0/nextjs-auth0';

export default function Profile() {
  const { user, isLoading } = useUser();
  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in.</p>;
  return (
    <div className="flex items-center gap-2">
      <img
        src={user.picture}
        alt="Profile"
        className="rounded-full w-10 h-10"
      />
      <h2 className="text-lg font-semibold">{user.name}</h2>
    </div>
  );
}
