import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { FourOhFourPage } from '~/pages/404';
import { MutateSet } from '~/components/mutate-set';
import { LoadingPage } from '~/components/states';
import { Meta } from '~/components/meta';

const Update: React.FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();

  const { id } = router.query;

  const { mutate, isLoading: isMutating } = trpc.sets.update.useMutation({
    onSuccess: () => router.push('/sets/my'),
    onError: () => toast.error('Failed to update Set! Please try again later.'),
  });

  if (!id || typeof id !== 'string') return <FourOhFourPage />;

  const { data: set, isLoading } = trpc.sets.getByID.useQuery({ id });

  if (isLoading) return <LoadingPage />;

  if (!set || session.user?.id !== set.userId) return <FourOhFourPage />;

  return (
    <main>
      <MutateSet
        defaultValues={set}
        mutate={(data) => mutate({ ...data, id })}
        isMutating={isMutating}
      />
    </main>
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
      <Meta
        path={router.asPath}
        title="Update Set - Flashcards"
        description="Update Set - Flashcards"
      />

      {session && <Update session={session} />}
    </>
  );
};

export default Page;
