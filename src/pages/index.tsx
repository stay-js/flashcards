import type { NextPage, GetStaticProps } from 'next';
import type { RouterOutputs } from '~/utils/trpc';
import { useEffect, useState, useDeferredValue } from 'react';
import Link from 'next/link';
import { trpc } from '~/utils/trpc';
import { ssg } from '~/utils/trpc-ssg-helper';
import { ErrorPage, LoadingSpinner } from '~/components/states';
import { Input, Select } from '~/components/input';
import { PaginationButton } from '~/components/pagination-button';
import { Meta } from '~/components/meta';
import { categories } from '~/constants/categories';

const PaginatedSets: React.FC<{ sets: RouterOutputs['sets']['getAllPublic'] }> = ({ sets }) => {
  const [itemOffset, setItemOffset] = useState<number>(0);

  const ITEMS_PER_PAGE = 9;

  const endOffset =
    itemOffset + ITEMS_PER_PAGE < sets.length ? itemOffset + ITEMS_PER_PAGE : sets.length;
  const currentSets = sets.slice(itemOffset, endOffset);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentSets.map(({ id, name, description, _count: { cards }, category }) => (
          <Link
            href={`/sets/${encodeURIComponent(id)}`}
            key={id}
            className="flex h-52 flex-col gap-3 overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition hover:bg-neutral-50"
          >
            <div>
              <h2 className="line-clamp-1 text-lg font-bold">{name}</h2>
              <h3 className="line-clamp-2">{description}</h3>
            </div>

            <div className="flex gap-2">
              <span className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800">
                {category}
              </span>

              <span className="flex w-fit rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800">
                {cards} {cards === 1 ? 'card' : 'cards'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto flex flex-col gap-1">
        <span className="text-center">
          Showing <b>{itemOffset + 1}</b> to <b>{endOffset}</b> of <b>{sets.length}</b> sets
        </span>

        <div className="flex justify-center gap-2">
          <PaginationButton
            direction="prev"
            disabled={itemOffset === 0}
            onClick={() => setItemOffset((value) => value - ITEMS_PER_PAGE)}
          />

          <PaginationButton
            direction="next"
            disabled={endOffset === sets.length}
            onClick={() => setItemOffset((value) => value + ITEMS_PER_PAGE)}
          />
        </div>
      </div>
    </>
  );
};

const Sets: React.FC = () => {
  const [category, setCategory] = useState<string>('All');
  const [query, serQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(query);

  const {
    data: sets,
    isError,
    isLoading,
    refetch,
  } = trpc.sets.getAllPublic.useQuery({ query: deferredQuery, category });

  useEffect(() => void refetch(), [deferredQuery, refetch]);

  if (isError) return <ErrorPage />;

  return (
    <main className="flex max-w-5xl flex-col gap-4">
      <h1 className="pb-12 pt-8 text-center text-5xl font-bold text-neutral-800 underline decoration-blue-600 decoration-wavy underline-offset-8">
        Discover Sets
      </h1>

      <div className="flex flex-col items-center gap-2 md:flex-row">
        <div className="w-full">
          <Input
            label="Search:"
            placeholder="Search"
            value={query}
            onChange={(e) => serQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-fit">
          <Select
            label="Category:"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { label: 'All', value: 'All' },
              ...categories.map((category) => ({ label: category, value: category })),
            ]}
          />
        </div>
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading &&
        (sets.length ? (
          <PaginatedSets sets={sets} />
        ) : (
          <span className="text-center font-bold">There are no sets to display...</span>
        ))}
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
  await ssg.sets.getAllPublic.prefetch({ query: '', category: 'All' });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: true,
  };
};

export default Page;
