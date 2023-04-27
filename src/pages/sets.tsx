import type { NextPage } from 'next';
import { Meta } from '@components/Meta';
import { useSession } from 'next-auth/react';
import { SignIn } from '@components/SignIn';
import { Sets } from '@components/Sets';

const Page: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Meta path="/" title="Sets - Flashcards" desc="Sets - Flashcards" />

      {session ? <Sets /> : <SignIn />}
    </>
  );
};

export default Page;
