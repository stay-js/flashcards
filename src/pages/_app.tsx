import type { Session } from 'next-auth';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { Navigation } from '~/components/navigation';

import '~/styles/globals.css';

const App: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => (
  <SessionProvider session={session}>
    <Analytics />
    <Toaster toastOptions={{ duration: 2000 }} />

    <Navigation />
    <Component {...pageProps} />
  </SessionProvider>
);

export default trpc.withTRPC(App);
