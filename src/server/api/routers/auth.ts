import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { accounts, authReadWriteKeys } from "~/server/db/schema";
import {
  createCallerFactory,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  refreshToken: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    console.log("refresh token", { ctx, input });
  }),
  createReadWriteKeys: publicProcedure.mutation(async ({ ctx }) => {
    const values = await ctx.db
      .insert(authReadWriteKeys)
      .values({})
      .returning();
    return values[0];
  }),
  getAccessToken: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const readWriteKeys = await ctx.db.query.authReadWriteKeys.findFirst({
        where: eq(authReadWriteKeys.read, input),
      });

      if (readWriteKeys?.accountId) {
        return ctx.db.transaction(async (transaction) => {
          await transaction
            .delete(authReadWriteKeys)
            .where(eq(authReadWriteKeys.read, input));

          const tokens = await transaction.query.accounts.findFirst({
            where: eq(accounts.providerAccountId, readWriteKeys.accountId!),
          });

          return {
            accessToken: tokens?.access_token,
            refreshToken: tokens?.refresh_token,
            expiresAt: tokens?.expires_at,
          };
        });
      }

      return undefined;
    }),
  // TODO: make this a serverProtectedProcedure
  setReadWriteAuthToken: publicProcedure
    .input(
      z.object({
        write: z.string(),
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(authReadWriteKeys)
        .set(input)
        .where(eq(authReadWriteKeys.write, input.write));
    }),
});

const createCaller = createCallerFactory(authRouter);

export const authCaller = createCaller({
  session: null,
  headers: new Headers(),
  db,
});
