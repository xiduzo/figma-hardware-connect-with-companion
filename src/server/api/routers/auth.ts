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
    return ctx.session.user;
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

      return ctx.db.transaction(async (transaction) => {
        const userId = readWriteKeys?.userId;
        if (!userId) {
          return undefined;
        }

        await transaction
          .delete(authReadWriteKeys)
          .where(eq(authReadWriteKeys.read, input));

        const tokens = await transaction.query.accounts.findFirst({
          where: eq(accounts.userId, userId),
        });

        return {
          accessToken: tokens?.access_token,
          refreshToken: tokens?.refresh_token,
          expiresAt: tokens?.expires_at,
        };
      });
    }),
  // TODO: make this a serverProtectedProcedure
  setReadWriteUserId: publicProcedure
    .input(
      z.object({
        write: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(authReadWriteKeys)
        .set({
          userId: input.userId,
        })
        .where(eq(authReadWriteKeys.write, input.write));
    }),
});

const createCaller = createCallerFactory(authRouter);

export const authCaller = createCaller({
  session: null,
  headers: new Headers(),
  db,
});
