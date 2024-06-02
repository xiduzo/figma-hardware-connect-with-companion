import { and, eq, notInArray, sql } from "drizzle-orm";
import { z } from "zod";
import { MAX_UID_LENGTH } from "~/common/constants";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { serialConnections } from "~/server/db/schema";

export const VariableResolvedDataTypes = [
  "BOOLEAN",
  "COLOR",
  "FLOAT",
  "STRING",
] as const satisfies VariableResolvedDataType[];
const VariableResolvedDataTypeSchema = z.enum(VariableResolvedDataTypes);

export const variableSchema = z.object({
  name: z.string(),
  id: z.string(),
  resolvedType: VariableResolvedDataTypeSchema,
  uid: z
    .string()
    .max(MAX_UID_LENGTH)
    .regex(/^[a-zA-Z-]+$/, {
      message: "Must be alphanumeric or hyphenated",
    }),
});

export const figmaRouter = createTRPCRouter({
  sync: protectedProcedure
    .input(z.array(variableSchema))
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
