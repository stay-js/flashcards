import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { SignIn } from '@components/SignIn';
import { MutateSet } from '@components/MutateSet';
import { Error404 } from '@pages/404';
import { Loading } from '@components/Loading';

const Update: React.FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();

  const { id } = router.query;

  const { mutate } = trpc.sets.update.useMutation({
    onSuccess: () => router.push('/'),
  });

  if (!id || typeof id !== 'string') return <Error404 />;

  const { data: set, isLoading } = trpc.sets.getByID.useQuery({ id });

  if (!isLoading && (!set || session.user?.id !== set.userId)) return <Error404 />;

  return (
    <main className="p-6">
      {isLoading && <Loading />}
      {set && <MutateSet defaultValues={set} mutate={mutate} />}
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
        desc="Update Set - Flashcards"
      />

      {session ? <Update session={session} /> : <SignIn />}
    </>
  );
};

export default Page;
