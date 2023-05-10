import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { SignIn } from '@components/SignIn';
import { MutateSet } from '@components/MutateSet';
import { FourOhFourPage } from '@pages/404';
import { LoadingPage } from '@components/States';

const Update: React.FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();

  const { id } = router.query;

  const { mutate, isLoading: isMutating } = trpc.sets.update.useMutation({
    onSuccess: () => router.push('/'),
    onError: () => toast.error('Failed to update Set! Please try again later.'),
  });

  if (!id || typeof id !== 'string') return <FourOhFourPage />;

  const { data: set, isLoading } = trpc.sets.getByID.useQuery({ id });

  if (isLoading) return <LoadingPage />;

  if (!set || session.user?.id !== set.userId) return <FourOhFourPage />;

  return (
    <main className="p-6">
      <MutateSet
        defaultValues={set}
        mutate={(data) => mutate({ ...data, id })}
        isMutating={isMutating}
      />
    </main>
  );
};

const Page: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Meta
        path={useRouter().asPath}
        title="Update Set - Flashcards"
        description="Update Set - Flashcards"
      />

      {session ? <Update session={session} /> : <SignIn />}
    </>
  );
};

export default Page;
