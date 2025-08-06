import { doublePrecision, pgTable, timestamp, varchar, uuid, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './usersSchema.js';
import { productsTable } from './productsSchema.js';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ordersTable = pgTable('orders', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().notNull().defaultNow(),
  status: varchar({ length: 50 }).notNull().default('New'),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),
  stripePaymentIntentId: varchar({ length: 255 }),
});

export const orderItemsTable = pgTable('order_items', {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .references(() => ordersTable.id)
    .notNull(),
  productId: uuid()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  orderId: true,
});

export const insertOrderWithItemsSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemSchema),
});

export const updateOrderSchema = createInsertSchema(ordersTable).pick({
  status: true,
});
