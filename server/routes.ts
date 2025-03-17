import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema } from "@shared/schema";
import { ZodError } from "zod";

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

      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid member data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to create member" 
        });
      }
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
