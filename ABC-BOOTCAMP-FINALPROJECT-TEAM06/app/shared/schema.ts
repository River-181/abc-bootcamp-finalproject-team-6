import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characterStates = pgTable("character_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().default("default_user"),
  color: text("color").notNull().default("yellow"),
  mood: text("mood").notNull().default("calm"),
  sleepHours: text("sleep_hours").notNull().default("7.5시간"),
  sleepQuality: text("sleep_quality").notNull().default("좋음"),
  wellnessScore: integer("wellness_score").notNull().default(85),
  lastPetTime: timestamp("last_pet_time"),
  lastFeedTime: timestamp("last_feed_time"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCharacterStateSchema = createInsertSchema(characterStates).omit({
  id: true,
  updatedAt: true,
});

export type InsertCharacterState = z.infer<typeof insertCharacterStateSchema>;
export type CharacterState = typeof characterStates.$inferSelect;
