import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { Meta } from '~/components/meta';
import { SignIn } from '~/components/sign-in';
import { MutateSet } from '~/components/mutate-set';

const Create: React.FC = () => {
  const router = useRouter();

  const { mutate, isLoading: isMutating } = trpc.sets.create.useMutation({
    onSuccess: () => router.push('/sets/my'),
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
