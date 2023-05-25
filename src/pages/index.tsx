import type { NextPage, GetStaticProps } from 'next';
import { useEffect, useState, useDeferredValue } from 'react';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { TbLock, TbWorld } from 'react-icons/tb';
import { trpc } from '~/utils/trpc';
import { ssg } from '~/utils/trpc-ssg-helper';
import { Meta } from '~/components/meta';
import { ErrorPage, LoadingSpinner } from '~/components/states';
import { Input } from '~/components/input';

const Sets: React.FC = () => {
  const [query, serQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(query);

  const {
    data: sets,
    isError,
    isLoading,
    refetch,
  } = trpc.sets.getAllPublic.useQuery({ query: deferredQuery });

  useEffect(() => void refetch(), [deferredQuery, refetch]);

  if (isError) return <ErrorPage />;

  return (
    <main className="flex max-w-5xl flex-col gap-4">
      <h1 className="pb-12 pt-8 text-center text-5xl font-bold text-neutral-800 underline decoration-blue-600 decoration-wavy underline-offset-8">
        Discover Sets
      </h1>

      <Input placeholder="Search" value={query} onChange={(e) => serQuery(e.target.value)} />

      {isLoading && <LoadingSpinner />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sets?.map(({ id, name, description, _count: { cards }, visibility, category }) => (
          <Link
            href={`/sets/${encodeURIComponent(id)}`}
            key={id}
            className="flex h-52 flex-col gap-3 overflow-hidden rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="line-clamp-1 text-lg font-bold">{name}</h2>
                <h3 className="line-clamp-2">{description}</h3>
              </div>

              <FaExternalLinkAlt
                className="text-transparent transition-all duration-200 group-hover:text-black"
                size={20}
              />
            </div>

            <div className="flex gap-2">
              <span className="flex w-fit items-center rounded-full bg-gray-200 px-3 py-1.5 ">
                {visibility === 'PRIVATE' ? <TbLock /> : <TbWorld />}
              </span>

              <span className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800">
                {cards} cards
              </span>

              <span className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800">
                {category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

const Page: NextPage = () => (
  <>
    <Meta path="/" title="Flashcards" description="Flashcards App with GitHub authentication." />

    <Sets />
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  await ssg.sets.getAllPublic.prefetch({ query: '' });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: true,
  };
};

export default Page;
