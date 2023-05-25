import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { Card, Set as SetType, User } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { Transition } from '@headlessui/react';
import { TbLock, TbWorld } from 'react-icons/tb';
import { ssg } from '~/utils/trpc-ssg-helper';
import { trpc } from '~/utils/trpc';
import { Meta } from '~/components/meta';
import { FourOhFourPage } from '~/pages/404';
import { LoadingPage } from '~/components/states';

type SetWithCardsAndUser = SetType & {
  user: User;
  cards: Card[];
};

const Set: React.FC<{ set: SetWithCardsAndUser }> = ({
  set: { user, name, description, category, cards, visibility },
}) => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isShowing, setIsShowing] = useState<boolean>(true);
  const [flipped, setFlipped] = useState<boolean>(false);

  const mutateCard = (amount: number) => {
    setIsShowing(false);
    setFlipped(false);
    setCurrentCard((value) => value + amount);

    setTimeout(() => setIsShowing(true), 300);
  };

  const incrementCard = () => {
    if (currentCard !== cards.length - 1) mutateCard(1);
  };

  const decrementCard = () => {
    if (currentCard !== 0) mutateCard(-1);
  };

  return (
    <main className="flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <h2 className="text-lg">{description}</h2>
        <p>
          Category: <b>{category}</b>
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {user.image && (
            <Image
              className="select-none rounded-full"
              src={user.image}
              alt="GitHub Profile Picture"
              width={48}
              height={48}
            />
          )}

          <div className="flex flex-col">
            <span className="text-xs text-gray-700">Created by:</span>
            <b className="text-sm">{user.name}</b>
          </div>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-700">Visibility:</span>

          <div className="flex items-center gap-1">
            {visibility === 'PRIVATE' ? <TbLock /> : <TbWorld />}
            <b className="text-sm">{visibility.charAt(0) + visibility.slice(1).toLowerCase()}</b>
          </div>
        </div>
      </div>

      <div className="flex min-h-[30rem]">
        <Transition
          as={Fragment}
          show={isShowing}
          enter="transform transition duration-[400ms] ease-in-out"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transform transition duration-300 ease-in-out"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className="grid w-full cursor-pointer select-none place-content-center rounded-xl border bg-white p-12 text-center text-2xl font-medium"
            onClick={() => setFlipped((value) => !value)}
          >
            {isShowing && (flipped ? cards[currentCard]?.back : cards[currentCard]?.front)}
          </div>
        </Transition>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="select-none rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          onClick={decrementCard}
        >
          Prev<span className="hidden sm:inline-block">ious</span>
        </button>

        <span className="text-center text-xl font-medium">
          Card {currentCard + 1} of {cards.length}
        </span>

        <button
          className="select-none rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          onClick={incrementCard}
        >
          Next
        </button>
      </div>
    </main>
  );
};

const Loading: React.FC<{ path: string }> = ({ path }) => (
  <>
    <Meta path={path} title="Set - Flashcards" description="Set - Flashcards" />

    <LoadingPage />
  </>
);

const Error: React.FC<{ path: string }> = ({ path }) => (
  <>
    <Meta path={path} title="Not Found - Flashcards" description="Not Found - Flashcards" />

    <FourOhFourPage />
  </>
);

const Page: NextPage<{ id: string }> = ({ id }) => {
  const { data: session, status } = useSession();
  const { data: set, isLoading } = trpc.sets.getByID.useQuery({ id });

  const path = useRouter().asPath;

  if (isLoading) console.log('Loading');

  if (!set) return <Error path={path} />;

  if (set.visibility === 'PRIVATE') {
    if (status === 'loading') return <Loading path={path} />;
    if (session?.user?.id !== set.user.id) return <Error path={path} />;
  }

  return (
    <>
      <Meta path={path} title={`${set.name} - Flashcards`} description={set.description} />

      <Set set={set} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id || typeof params.id !== 'string') return { notFound: true };

  try {
    await ssg.sets.getByID.fetch({ id: params.id });

    return {
      props: {
        id: params.id,
        trpcState: ssg.dehydrate(),
      },
      revalidate: true,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Page;
