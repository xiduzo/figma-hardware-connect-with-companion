import { relations, sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { MAX_UID_LENGTH } from "~/common/constants";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `figma-mqtt-serious_${name}`,
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (verificationToken) => ({
    compoundKey: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authReadWriteKeys = createTable(
  "authReadWriteKeys",
  {
    read: uuid("read").defaultRandom().notNull(),
    write: uuid("write").defaultRandom().notNull(),
    userId: varchar("userId", { length: 255 }).references(() => users.id),
  },
  (authReadWriteKeys) => ({
    compoundKey: primaryKey({
      columns: [authReadWriteKeys.read, authReadWriteKeys.write],
    }),
  }),
);

const customFigmaType = customType<{ data: VariableResolvedDataType }>({
  dataType() {
    return "text";
  },
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return value as VariableResolvedDataType;
  },
});

export const serialConnections = createTable(
  "serialConnections",
  {
    name: varchar("name").notNull(),
    id: varchar("figmaVariableId").notNull(),
    resolvedType: customFigmaType("resolvedType").notNull(),
    uid: varchar("uid", { length: MAX_UID_LENGTH }).notNull(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (serialConnections) => ({
    compoundKey: primaryKey({
      columns: [serialConnections.id, serialConnections.userId],
    }),
  }),
);
