import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { Set, Card, User } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { prisma } from '@server/db';
import { Meta } from '@components/Meta';

const Page: NextPage<{
  set: Set & {
    user: User;
    cards: Card[];
  };
}> = ({ set: { user, name, description, cards } }) => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isShowing, setIsShowing] = useState<boolean>(true);
  const [flipped, setFlipped] = useState<boolean>(false);

  const router = useRouter();

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
    <>
      <Meta path={router.asPath} title={`${name} - Flashcards`} desc={description} />

      <main className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <h2 className="text-lg">{description}</h2>
        </div>

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
            Previous
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
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sets = await prisma.set.findMany({ select: { id: true } });

  return {
    paths: sets.map(({ id }) => ({ params: { id } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;

  if (!id || typeof id !== 'string') return { notFound: true };

  try {
    const set = await prisma.set.findUniqueOrThrow({
      where: { id },
      include: {
        user: true,
        cards: true,
      },
    });

    return { props: { set } };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Page;
