import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const phoneUsers = pgTable("phone_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  citizenId: text("citizen_id").notNull().unique(),
  phoneNumber: text("phone_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  settings: json("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const phoneContacts = pgTable("phone_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => phoneUsers.id),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  avatar: text("avatar"),
  favorite: boolean("favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const phoneMessages = pgTable("phone_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => phoneUsers.id),
  receiverId: varchar("receiver_id").notNull().references(() => phoneUsers.id),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const phoneTransactions = pgTable("phone_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => phoneUsers.id),
  type: text("type").notNull(), // 'deposit', 'withdraw', 'transfer'
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  targetAccount: text("target_account"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const phoneTweets = pgTable("phone_tweets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => phoneUsers.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  retweets: integer("retweets").default(0),
  replies: integer("replies").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const phoneNotes = pgTable("phone_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => phoneUsers.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  color: text("color").default("#fbbf24"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const phonePhotos = pgTable("phone_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => phoneUsers.id),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  filename: text("filename").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const phoneYellowPages = pgTable("phone_yellow_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  category: text("category").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address"),
  description: text("description"),
  website: text("website"),
  rating: integer("rating").default(5),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertPhoneUserSchema = createInsertSchema(phoneUsers).omit({ id: true, createdAt: true });
export const insertPhoneContactSchema = createInsertSchema(phoneContacts).omit({ id: true, createdAt: true });
export const insertPhoneMessageSchema = createInsertSchema(phoneMessages).omit({ id: true, createdAt: true });
export const insertPhoneTransactionSchema = createInsertSchema(phoneTransactions).omit({ id: true, createdAt: true });
export const insertPhoneTweetSchema = createInsertSchema(phoneTweets).omit({ id: true, createdAt: true });
export const insertPhoneNoteSchema = createInsertSchema(phoneNotes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPhonePhotoSchema = createInsertSchema(phonePhotos).omit({ id: true, createdAt: true });
export const insertPhoneYellowPageSchema = createInsertSchema(phoneYellowPages).omit({ id: true, createdAt: true });

// Types
export type InsertPhoneUser = z.infer<typeof insertPhoneUserSchema>;
export type PhoneUser = typeof phoneUsers.$inferSelect;
export type InsertPhoneContact = z.infer<typeof insertPhoneContactSchema>;
export type PhoneContact = typeof phoneContacts.$inferSelect;
export type InsertPhoneMessage = z.infer<typeof insertPhoneMessageSchema>;
export type PhoneMessage = typeof phoneMessages.$inferSelect;
export type InsertPhoneTransaction = z.infer<typeof insertPhoneTransactionSchema>;
export type PhoneTransaction = typeof phoneTransactions.$inferSelect;
export type InsertPhoneTweet = z.infer<typeof insertPhoneTweetSchema>;
export type PhoneTweet = typeof phoneTweets.$inferSelect;
export type InsertPhoneNote = z.infer<typeof insertPhoneNoteSchema>;
export type PhoneNote = typeof phoneNotes.$inferSelect;
export type InsertPhonePhoto = z.infer<typeof insertPhonePhotoSchema>;
export type PhonePhoto = typeof phonePhotos.$inferSelect;
export type InsertPhoneYellowPage = z.infer<typeof insertPhoneYellowPageSchema>;
export type PhoneYellowPage = typeof phoneYellowPages.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
