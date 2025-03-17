import 'dotenv/config';
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema } from "./models/schema";
import { ZodError } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

// ✅ Validate Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay credentials");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function registerRoutes(app: Express): Promise<Server> {

  // ✅ Create new member and Razorpay order
  app.post("/api/members", async (req, res) => {
    try {
      // ✅ Validate request data using Zod
      const memberData = insertMemberSchema.parse(req.body);

      // ✅ Check if member already exists
      const existingMember = await storage.getMemberByEmail(memberData.email);
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: "A member with this email already exists",
        });
      }

      // ✅ Base payment amount (₹4) in paise
      let finalAmount = 400;

      // ✅ Apply discount if applicable
      if (memberData.couponCode === "ABINASH10") {
        finalAmount = Math.floor(finalAmount * 0.9); // 10% discount
      }

      // ✅ Create Razorpay order
      const order = await razorpay.orders.create({
        amount: finalAmount, // Amount in paise
        currency: "INR",
        receipt: `mem_${Date.now()}`,
        payment_capture: 1,
      });

      if (!order) {
        return res.status(500).json({
          success: false,
          message: "Failed to create Razorpay order",
        });
      }

      // ✅ Create member with payment details
      const member = await storage.createMember({
        ...memberData,
        paymentStatus: "pending",
        paymentAmount: (finalAmount / 100).toFixed(2), // Convert to rupees
        address: memberData.address, // ✅ Ensure address is stored
      });

      console.log("✅ Member created successfully:", member);

      return res.status(201).json({
        success: true,
        message: "Member created successfully",
        member,
        order,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid member data",
          errors: error.errors,
        });
      }
      console.error("❌ Error creating member:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create member",
      });
    }
  });

  // ✅ Verify payment and update member status
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Missing payment details",
        });
      }

      // ✅ Generate expected signature for verification
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        console.error("❌ Invalid payment signature");
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }

      // ✅ Payment verified — update member status
      const updatedMember = await storage.updateMemberPaymentStatus(
        razorpay_order_id,
        "completed"
      );

      console.log("✅ Payment verified successfully");
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        updatedMember,
      });
    } catch (error) {
      console.error("❌ Payment verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment",
      });
    }
  });

  // ✅ Get member details by ID
  app.get("/api/members/:id", async (req, res) => {
    try {
      const memberId = Number(req.params.id);
      if (isNaN(memberId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid member ID",
        });
      }

      const member = await storage.getMember(memberId);
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      return res.status(200).json({
        success: true,
        member,
      });
    } catch (error) {
      console.error("❌ Error fetching member:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch member",
      });
    }
  });

  // ✅ Update member address
  app.put("/api/members/:id/address", async (req, res) => {
    try {
      const memberId = Number(req.params.id);
      const { address } = req.body;

      if (isNaN(memberId) || !address) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
        });
      }

      // ✅ Check if member exists before updating
      const existingMember = await storage.getMember(memberId);
      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      // ✅ Update address
      const updatedMember = await storage.updateMemberAddress(memberId, address);

      console.log("✅ Member address updated:", updatedMember);

      return res.status(200).json({
        success: true,
        message: "Member address updated successfully",
        member: updatedMember,
      });
    } catch (error) {
      console.error("❌ Error updating address:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update member address",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
