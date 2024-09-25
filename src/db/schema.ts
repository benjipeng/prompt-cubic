import { pgTable, uuid, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const promptsTable = pgTable('prompts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export const tagsTable = pgTable('tags', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const promptTagsTable = pgTable('prompt_tags', {
    promptId: uuid('prompt_id')
        .notNull()
        .references(() => promptsTable.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
        .notNull()
        .references(() => tagsTable.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey(table.promptId, table.tagId),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPrompt = typeof promptsTable.$inferInsert;
export type SelectPrompt = typeof promptsTable.$inferSelect;

export type InsertTag = typeof tagsTable.$inferInsert;
export type SelectTag = typeof tagsTable.$inferSelect;

export type InsertPromptTag = typeof promptTagsTable.$inferInsert;
export type SelectPromptTag = typeof promptTagsTable.$inferSelect;