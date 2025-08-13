import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCharacterStateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get character state
  app.get("/api/character/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const characterState = await storage.getCharacterState(userId);
      
      if (!characterState) {
        return res.status(404).json({ message: "Character state not found" });
      }
      
      res.json(characterState);
    } catch (error) {
      res.status(500).json({ message: "Failed to get character state" });
    }
  });

  // Update character state
  app.patch("/api/character/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const validatedData = insertCharacterStateSchema.partial().parse(req.body);
      
      const updatedState = await storage.updateCharacterState(userId, validatedData);
      res.json(updatedState);
    } catch (error) {
      res.status(500).json({ message: "Failed to update character state" });
    }
  });

  // Pet character
  app.post("/api/character/:userId/pet", async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedState = await storage.updateCharacterState(userId, {
        mood: "happy",
        lastPetTime: new Date(),
      });
      res.json(updatedState);
    } catch (error) {
      res.status(500).json({ message: "Failed to pet character" });
    }
  });

  // Feed character
  app.post("/api/character/:userId/feed", async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedState = await storage.updateCharacterState(userId, {
        mood: "excited",
        lastFeedTime: new Date(),
      });
      res.json(updatedState);
    } catch (error) {
      res.status(500).json({ message: "Failed to feed character" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
