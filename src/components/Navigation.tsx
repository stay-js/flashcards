import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, signIn, useSession } from 'next-auth/react';

export const Navigation: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="relative flex min-h-[5rem] items-center justify-between bg-white px-6 py-4 shadow-sm">
      {useRouter().asPath === '/' && session ? (
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <Image
              className="select-none rounded-full"
              src={session.user.image}
              alt="GitHub Profile Picture"
              width={48}
              height={48}
            />
          )}
          <p className="flex flex-col text-lg sm:flex-row sm:gap-1">
            Hi, <span className="font-bold">{session.user?.name}!</span>
          </p>
        </div>
      ) : (
        <Link href="/" className="text-xl font-bold">
          Flashcards
        </Link>
      )}

      {session ? (
        <button
          type="button"
          className="rounded border-2 border-blue-700 bg-blue-700 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-blue-700"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      ) : (
        <button
          type="button"
          className="rounded border-2 border-blue-700 bg-blue-700 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-blue-700"
          onClick={() => signIn('github')}
        >
          Sign In
        </button>
      )}
    </div>
  );
};
