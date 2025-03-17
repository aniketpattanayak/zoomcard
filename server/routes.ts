import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema } from "@shared/schema";
import { ZodError } from "zod";
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay credentials");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/members", async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      const existingMember = await storage.getMemberByEmail(memberData.email);

      if (existingMember) {
        return res.status(400).json({ 
          message: "A member with this email already exists" 
        });
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: 944000, // Amount in paise (₹9,440 * 100)
        currency: "INR",
        receipt: `mem_${Date.now()}`,
        payment_capture: 1
      });

      const member = await storage.createMember({
        ...memberData,
        paymentStatus: "pending"
      });

      res.status(201).json({
        member,
        order
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid member data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating member:", error);
        res.status(500).json({ 
          message: "Failed to create member" 
        });
      }
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        // Payment is verified
        // Update member payment status
        res.json({
          status: "success",
          message: "Payment verified successfully"
        });
      } else {
        res.status(400).json({
          status: "fail",
          message: "Invalid signature"
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error"
      });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(Number(req.params.id));
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}