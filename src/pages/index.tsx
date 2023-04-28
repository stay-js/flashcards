import type { NextPage } from 'next';
import Link from 'next/link';
import { useState, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { TbAlertCircle } from 'react-icons/tb';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { SignIn } from '@components/SignIn';
import { Button } from '@components/Button';

const Sets: React.FC = () => {
  const [setToDelete, setSetToDelete] = useState<string | null>(null);

  const { data: sets, isLoading, isError, refetch } = trpc.sets.getAll.useQuery();

  const { mutate: deleteSet } = trpc.sets.delete.useMutation({
    onMutate: () => setSetToDelete(null),
    onSettled: () => refetch(),
  });

  return (
    <>
      {setToDelete && (
        <Transition appear show as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setSetToDelete(null)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 grid place-items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-11/12 max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl">
                  <div className="flex flex-col gap-2">
                    <Dialog.Title className="text-lg font-bold text-neutral-900">
                      Delete Set
                    </Dialog.Title>

                    <Dialog.Description className="m-0 text-sm text-neutral-500">
                      Are you sure you want to delete this Set? This action <b>cannot be undone</b>.
                      This will <b>permanently</b> delete the selected Set.
                    </Dialog.Description>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setSetToDelete(null)} variant="green">
                      Cancel
                    </Button>

                    <Button onClick={() => deleteSet({ id: setToDelete })} variant="red">
                      Delete <span className="hidden sm:inline-block">Set</span>
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}

      <main className="mx-auto w-fit p-6">
        {isError && (
          <div className="flex flex-col items-center gap-2">
            <TbAlertCircle size={48} color="red" className="animate-bounce" />
            Something went wrong... try again later!
          </div>
        )}

        {isLoading && (
          <svg className="mx-auto h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="stroke-blue-700 opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path
              className="fill-blue-700"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!isError && sets && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/create"
              className="grid h-52 w-80 cursor-pointer place-items-center rounded-lg border bg-white shadow-sm"
            >
              <FiPlus size={48} />
            </Link>

            {sets.map(({ id, name, description, _count: { cards } }) => (
              <div
                key={id}
                className="flex h-52 w-80 cursor-pointer flex-col justify-between overflow-hidden rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <Link href={`/sets/${id}`} className="group flex items-center justify-between">
                    <div>
                      <h2 className="line-clamp-1 text-lg font-bold">{name}</h2>
                      <h3 className="line-clamp-2">{description}</h3>
                    </div>

                    <FaExternalLinkAlt
                      className="text-transparent transition-all duration-200 group-hover:text-black"
                      size={20}
                    />
                  </Link>

                  <div className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5">
                    <span className="text-xs font-medium text-gray-800">{cards} cards</span>
                  </div>
                </div>

                <Button onClick={() => setSetToDelete(id)} variant="red">
                  Delete <span className="hidden sm:inline-block">Set</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

const Page: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Meta path="/" title="Flashcards" desc="Flashcards" />

      {session ? <Sets /> : <SignIn />}
    </>
  );
};

export default Page;
