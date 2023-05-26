import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button } from '~/components/button';
import { Meta } from '~/components/meta';

export const FourOhFourPage: React.FC = () => (
  <main className="flex flex-col items-center gap-12 py-20">
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-regale-gray text-9xl font-bold">404</h1>
      <h2 className="text-center text-xl font-bold">
        Looks like what you are looking for doesn&apos;t exist.
      </h2>
      <h3 className="text-lg font-medium">Maybe try again later?</h3>
    </div>

    <Button href="/">Go back to home</Button>
  </main>
);

const Page: NextPage = () => (
  <>
    <Meta
      path={useRouter().asPath}
      title="Not Found - Flashcards"
      description="Not Found - Flashcards"
    />

    <FourOhFourPage />
  </>
);

export default Page;
