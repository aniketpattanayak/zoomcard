import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const artistCategories = [
  "Artist",
  "Director",
  "Producer",
  "Writer",
  "Production",
  "Cinematographer",
  "Singer",
  "Music Director",
] as const;

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  bloodGroup: text("blood_group").notNull(),
  category: text("category").notNull(),
  photoUrl: text("photo_url").notNull(),
  paymentAmount: text("payment_amount").notNull(),
  paymentStatus: text("payment_status").notNull(),
  cardNumber: text("card_number").notNull(),
  address: text("address").notNull(), // ✅ Added address field
});

export const insertMemberSchema = createInsertSchema(members)
  .pick({
    name: true,
    email: true,
    phone: true,
    bloodGroup: true,
    category: true,
    photoUrl: true,
    address: true, // ✅ Include address in validation
  })
  .extend({
    category: z.enum(artistCategories),
    phone: z.string().min(10).max(10),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    address: z.string().min(5).max(255), // ✅ Add validation for address
  });

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
