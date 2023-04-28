import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { Set, Card, User } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { prisma } from '@server/db';
import { Meta } from '@components/Meta';
import { Error404 } from '@pages/404';

const Page: NextPage<{
  set:
    | (Set & {
        user: User;
        cards: Card[];
      })
    | null;
}> = ({ set }) => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setFlipped(false);
  }, [currentCard]);

  if (!set)
    return (
      <>
        <Meta path={router.asPath} title="Not Found - Flashcards" desc="Not Found - Flashcards" />

        <Error404 />
      </>
    );

  const { user, name, description, cards } = set;

  const incrementCard = () => {
    if (currentCard == cards.length - 1) return;
    setCurrentCard((value) => value + 1);
  };

  const decrementCard = () => {
    if (currentCard == 0) return;
    setCurrentCard((value) => value - 1);
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

        <div
          className="grid min-h-[30rem] cursor-pointer place-content-center rounded-xl border bg-white p-12 text-center text-2xl font-medium"
          onClick={() => setFlipped((value) => !value)}
        >
          {flipped ? cards[currentCard]?.back : cards[currentCard]?.front}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
            onClick={decrementCard}
          >
            Previous
          </button>

          <span className="text-center text-xl font-medium">
            Card {currentCard + 1} of {cards.length}
          </span>

          <button
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
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
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;

  if (!id || typeof id !== 'string') return { props: { set: null } };

  try {
    const set = await prisma.set.findUnique({
      where: { id },
      include: {
        user: true,
        cards: true,
      },
    });
    return { props: { set } };
  } catch (error) {
    console.error(error);
    return { props: { set: null } };
  }
};

export default Page;
