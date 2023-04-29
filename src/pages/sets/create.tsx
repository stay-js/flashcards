import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { SignIn } from '@components/SignIn';
import { MutateSet } from '@components/MutateSet';

const Create: React.FC = () => {
  const router = useRouter();

  const { mutate } = trpc.sets.create.useMutation({
    onSuccess: () => router.push('/'),
  });

  return (
    <main className="p-6">
      <MutateSet mutate={mutate} />
    </main>
  );
};

const Page: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Meta path="/sets/create" title="Create Set - Flashcards" desc="Create Set - Flashcards" />

      {session ? <Create /> : <SignIn />}
    </>
  );
};

export default Page;
