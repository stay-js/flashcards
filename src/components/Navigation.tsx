import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export const Navigation: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="relative flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {session?.user?.image && (
          <Image
            className="select-none rounded-full"
            src={session.user.image}
            alt="GitHub Profile Picture"
            width={48}
            height={48}
          />
        )}
        <p className="text-lg">
          Hi, <span className="font-bold">{session?.user?.name}!</span>
        </p>
      </div>

      <button
        type="button"
        className="rounded border-2 border-blue-700 bg-blue-700 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-blue-700"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};
