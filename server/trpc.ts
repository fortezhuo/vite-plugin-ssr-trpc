import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
    greet: publicProcedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .query(({ input }) => ({ greeting: `hello, ${input}!` })),
});

export const createContext = function () {

}

export type AppRouter = typeof appRouter;
