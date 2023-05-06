import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { SignIn } from '@components/SignIn';
import { MutateSet } from '@components/MutateSet';

const Create: React.FC = () => {
  const router = useRouter();

  const { mutate, isLoading: isMutating } = trpc.sets.create.useMutation({
    onSuccess: () => router.push('/'),
    onError: () => toast.error('Failed to create Set! Please try again later.'),
  });

  return (
    <main className="p-6">
      <MutateSet mutate={mutate} isMutating={isMutating} />
    </main>
  );
};

const Page: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Meta
        path="/sets/create"
        title="Create Set - Flashcards"
        description="Create Set - Flashcards"
      />

      {session ? <Create /> : <SignIn />}
    </>
  );
};

export default Page;
