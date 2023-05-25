import type { NextPage } from 'next';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { TbLock, TbWorld } from 'react-icons/tb';
import { trpc } from '~/utils/trpc';
import { Meta } from '~/components/meta';
import { LoadingPage, ErrorPage } from '~/components/states';

const Sets: React.FC = () => {
  const { data: sets, isLoading, isError } = trpc.sets.getAllPublic.useQuery();

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <main className="mx-auto w-fit p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sets?.map(({ id, name, description, _count: { cards }, visibility, category }) => (
          <Link href={`/sets/${encodeURIComponent(id)}`} key={id}>
            <div
              key={id}
              className="flex h-52 w-80 flex-col justify-between overflow-hidden rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3">
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
              </div>
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

export default Page;
