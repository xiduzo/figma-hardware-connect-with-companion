import { and, eq, notInArray, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { serialConnections } from "~/server/db/schema";

const VariableResolvedDataType = [
  "BOOLEAN",
  "COLOR",
  "FLOAT",
  "STRING",
] as const satisfies VariableResolvedDataType[];
const VariableResolvedDataTypeSchema = z.enum(VariableResolvedDataType);

export const figmaRouter = createTRPCRouter({
  sync: protectedProcedure
    .input(
      z.array(
        z.object({
          name: z.string(),
          id: z.string(),
          resolvedType: VariableResolvedDataTypeSchema,
          uid: z
            .string()
            .max(40)
            .regex(/^[a-zA-Z-]+$/, {
              message: "Must be alphanumeric or hyphenated",
            }),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.length) {
        return ctx.db
          .delete(serialConnections)
          .where(eq(serialConnections.userId, ctx.session.user.id));
      }
      return ctx.db.transaction(async (transaction) => {
        await transaction.delete(serialConnections).where(
          and(
            notInArray(
              serialConnections.id,
              input.map(({ id }) => id),
            ),
            eq(serialConnections.userId, ctx.session.user.id),
          ),
        );

        return transaction
          .insert(serialConnections)
          .values(
            input.map((variable) => ({
              ...variable,
              userId: ctx.session.user.id,
            })),
          )
          .onConflictDoUpdate({
            target: [serialConnections.id, serialConnections.userId],
            set: {
              name: sql`excluded.name`,
              uid: sql`excluded.uid`,
            },
          });
      });
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.serialConnections.findMany({
      where: eq(serialConnections.userId, ctx.session.user.id),
    });
  }),
});
