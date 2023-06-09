import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { FiPlus } from 'react-icons/fi';
import { TbEyeOff, TbLock, TbWorld } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { Button } from '~/components/button';
import { LoadingPage, ErrorPage } from '~/components/states';
import { Meta } from '~/components/meta';

const Sets: React.FC = () => {
  const [setToDelete, setSetToDelete] = useState<string | null>(null);

  const { data: sets, isLoading, isError, refetch } = trpc.sets.getAllBySessionUser.useQuery();

  const { mutate: deleteSet, isLoading: isDeleting } = trpc.sets.delete.useMutation({
    onMutate: () => setSetToDelete(null),
    onSuccess: () => refetch(),
    onError: () => toast.error('Failed to delete Set! Please try again later.'),
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <Transition appear show={!!setToDelete} as={Fragment}>
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
                  <Button color="green" onClick={() => setSetToDelete(null)}>
                    Cancel
                  </Button>

                  <Button color="red" onClick={() => setToDelete && deleteSet({ id: setToDelete })}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <main className="grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/sets/create"
          className="grid h-52 cursor-pointer place-items-center rounded-lg border bg-white shadow-sm transition hover:bg-neutral-50"
        >
          <FiPlus size={48} />
        </Link>

        {sets?.map(({ id, name, description, _count: { cards }, visibility, category }) => (
          <div
            key={id}
            className="flex h-52 flex-col justify-between overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition hover:bg-neutral-50"
          >
            <Link href={`/sets/${encodeURIComponent(id)}`} className="flex h-full flex-col gap-3">
              <div>
                <h2 className="line-clamp-1 text-lg font-bold">{name}</h2>
                <h3 className="line-clamp-2">{description}</h3>
              </div>

              <div className="flex gap-2">
                <span className="flex w-fit items-center rounded-full bg-gray-200 px-3 py-1.5 ">
                  {visibility === 'PRIVATE' && <TbLock />}
                  {visibility === 'UNLISTED' && <TbEyeOff />}
                  {visibility === 'PUBLIC' && <TbWorld />}
                </span>

                <span className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800">
                  {category}
                </span>

                <span className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800">
                  {cards} {cards === 1 ? 'card' : 'cards'}
                </span>
              </div>
            </Link>

            <div className="flex gap-2">
              <Button
                color="red"
                className="w-full text-center"
                href={`/sets/update/${encodeURIComponent(id)}`}
              >
                Update <span className="hidden sm:inline-block">Set</span>
              </Button>
              <Button color="red" className="w-full text-center" onClick={() => setSetToDelete(id)}>
                Delete <span className="hidden sm:inline-block">Set</span>
              </Button>
            </div>
          </div>
        ))}
      </main>
    </>
  );
};

const Page: NextPage = () => {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(`/sign-in?callbackUrl=${encodeURIComponent(router.asPath)}`);
    },
  });

  return (
    <>
      <Meta path="/" title="My Sets - Flashcards" description="My Sets - Flashcards" />

      {session ? <Sets /> : <LoadingPage />}
    </>
  );
};

export default Page;
