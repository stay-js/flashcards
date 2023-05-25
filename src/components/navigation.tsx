import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import disableScroll from 'disable-scroll';
import { navItems } from '~/constants/nav-items';
import { signOut, signIn, useSession } from 'next-auth/react';
import { Button } from '~/components/button';

export const Navigation: React.FC = () => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const { data: session } = useSession();

  const pathname = useRouter().pathname;

  const handleClose = () => {
    setIsToggled(false);
    disableScroll.off();
  };

  const handleToggle = () => {
    setIsToggled((value) => {
      value ? disableScroll.off() : disableScroll.on();

      return !value;
    });
  };

  return (
    <header>
      <nav className="relative z-10 flex min-h-[5rem] items-center justify-between bg-white px-6 py-4 shadow-sm">
        {session ? (
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <Image
                className="select-none rounded-full"
                src={session.user.image}
                alt="GitHub Profile Picture"
                width={48}
                height={48}
              />
            )}
            <p className="flex flex-col text-lg sm:flex-row sm:gap-1">
              Hi, <span className="font-bold">{session.user?.name}!</span>
            </p>
          </div>
        ) : (
          <Link href="/" className="text-xl font-bold">
            Flashcards
          </Link>
        )}

        <button
          className="h-6 w-6 lg:hidden"
          title="Toggle Hamburger"
          type="button"
          onClick={handleToggle}
        >
          <span
            className={`${
              isToggled ? 'rotate-45' : '-translate-y-2'
            } absolute block h-0.5 w-6 bg-current transition-all duration-500`}
          />
          <span
            className={`${
              isToggled ? 'opacity-0' : ''
            } absolute block h-0.5 w-4 bg-current transition-all duration-500`}
          />
          <span
            className={`${
              isToggled ? 'w-6 -rotate-45' : 'w-2 translate-y-2'
            } absolute block h-0.5 bg-current transition-all duration-500`}
          />
        </button>

        <div
          className={`${
            !isToggled ? 'translate-x-full' : ''
          } fixed left-0 top-20 h-screen w-full bg-white px-6 py-4 transition duration-500 ease-in-out lg:static lg:flex lg:h-fit lg:w-fit lg:translate-x-0 lg:items-center lg:bg-transparent lg:p-0 lg:transition-none`}
        >
          <ul className="flex flex-col gap-8 lg:w-fit lg:flex-row lg:gap-1">
            {navItems.map(({ path, name }) => (
              <li key={path}>
                <Link
                  className={`${
                    path !== pathname ? 'lg:text-neutral-600' : ''
                  } relative flex items-center gap-2 font-bold text-black transition-colors after:absolute after:-bottom-4 after:h-px after:w-full after:bg-neutral-300  lg:static lg:rounded-md lg:px-3 lg:py-2 lg:font-medium lg:after:hidden lg:hover:bg-neutral-300 `}
                  onClick={handleClose}
                  href={path}
                >
                  {name}
                </Link>
              </li>
            ))}

            <li>
              {session ? (
                <Button onClick={() => signOut()}>Sign Out</Button>
              ) : (
                <Button onClick={() => signIn('github')}>Sign In</Button>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
