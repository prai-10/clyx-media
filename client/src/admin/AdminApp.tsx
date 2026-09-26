import { useQueryClient } from '@tanstack/react-query';
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { useEffect, useState } from 'react';
import superjson from 'superjson';
import Admin from '@/pages/Admin';
import { ADMIN_LOGOUT_EVENT, API_URL, adminToken } from '@/lib/api';
import { trpc } from '@/lib/trpc';

// An expired or invalid admin token comes back as UNAUTHORIZED: drop it and let the admin page show the login form.
const handleUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (error.data?.code !== 'UNAUTHORIZED') return;
  if (!adminToken.get()) return;
  adminToken.clear();
  window.dispatchEvent(new Event(ADMIN_LOGOUT_EVENT));
};

// Only the admin panel talks tRPC, so the client (and superjson) is created here and loaded with the
// admin page instead of being part of every visitor's first download.
export default function AdminApp() {
  const queryClient = useQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/api/trpc`,
          transformer: superjson,
          headers() {
            const token = adminToken.get();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    }),
  );

  useEffect(() => {
    const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') handleUnauthorized(event.query.state.error);
    });
    const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') handleUnauthorized(event.mutation.state.error);
    });
    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [queryClient]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <Admin />
    </trpc.Provider>
  );
}
