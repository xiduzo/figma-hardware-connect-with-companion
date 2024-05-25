import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { authReadWriteKeys } from "~/server/db/schema";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

export const authRouter = createTRPCRouter({
  refreshToken: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    console.log("refresh token", { ctx, input });
  }),
  getReadWriteKeys: publicProcedure.query(async ({ ctx }) => {
    const values = await ctx.db
      .insert(authReadWriteKeys)
      .values({})
      .returning();
    return values[0];
  }),
  getAccessToken: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tokens = await ctx.db.query.authReadWriteKeys.findFirst({
        where: eq(authReadWriteKeys.read, input),
      });

      if (tokens?.token) {
        await ctx.db
          .delete(authReadWriteKeys)
          .where(eq(authReadWriteKeys.read, input));
      }

      return tokens;
    }),
  setReadWriteAuthToken: publicProcedure
    .input(z.object({ write: z.string(), token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: make this a serverProtectedProcedure
      await ctx.db
        .update(authReadWriteKeys)
        .set({
          token: input.token,
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
