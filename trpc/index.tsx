import { createTRPCReact } from "@trpc/react-query"
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/trpc';

export const trpc = createTRPCReact<AppRouter>()

export const client = trpc.createClient({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/api/trpc',
        }),
    ],
});
