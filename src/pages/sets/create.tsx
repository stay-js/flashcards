import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { MutateSet } from '~/components/mutate-set';
import { Meta } from '~/components/meta';

const Create: React.FC = () => {
  const router = useRouter();

  const { mutate, isLoading: isMutating } = trpc.sets.create.useMutation({
    onSuccess: () => router.push('/sets/my'),
    onError: () => toast.error('Failed to create Set! Please try again later.'),
  });

  return (
    <main>
      <MutateSet mutate={mutate} isMutating={isMutating} />
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
        path="/sets/create"
        title="Create Set - Flashcards"
        description="Create Set - Flashcards"
      />

      {session && <Create />}
    </>
  );
};

export default Page;
