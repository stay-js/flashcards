import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { trpc } from '@utils/trpc';
import { TbAlertCircle } from 'react-icons/tb';
import { FiPlus } from 'react-icons/fi';

export const Sets: React.FC = () => {
  const { data: session } = useSession();
  const { data: sets, isLoading, isError } = trpc.sets.get.useQuery();

  return (
    <div>
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

      <main className="mx-auto w-fit p-6">
        {isError && (
          <div className="flex flex-col items-center gap-2">
            <TbAlertCircle size={48} color="red" className="animate-bounce" />
            Something went wrong... try again later!
          </div>
        )}

        {isLoading && (
          <svg className="mx-auto h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="stroke-green-500 opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            />
            <path
              className="fill-green-500"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!isError && sets && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sets.map((set) => (
              <div key={set.id}>set</div>
            ))}

            <div className="grid h-40 w-64 place-items-center rounded-lg border bg-white shadow-sm">
              <FiPlus size={48} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
