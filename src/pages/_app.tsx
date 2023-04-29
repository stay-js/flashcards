import type { Session } from 'next-auth';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@utils/trpc';
import { Navigation } from '@components/Navigation';

import '@styles/globals.css';

const App: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => (
  <SessionProvider session={session}>
    <Navigation />
    <Component {...pageProps} />
  </SessionProvider>
);

export default trpc.withTRPC(App);
