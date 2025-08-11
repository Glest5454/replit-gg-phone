import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertPhoneUserSchema, 
  insertPhoneContactSchema, 
  insertPhoneMessageSchema,
  insertPhoneTransactionSchema,
  insertPhoneTweetSchema,
  insertPhoneNoteSchema,
  insertPhonePhotoSchema,
  insertPhoneYellowPageSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Phone Users
  app.post("/api/phone/users", async (req, res) => {
    try {
      const userData = insertPhoneUserSchema.parse(req.body);
      const user = await storage.createPhoneUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/phone/users/:citizenId", async (req, res) => {
    try {
      const user = await storage.getPhoneUserByCitizenId(req.params.citizenId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contacts
  app.get("/api/phone/contacts/:userId", async (req, res) => {
    try {
      const contacts = await storage.getPhoneContacts(req.params.userId);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/contacts", async (req, res) => {
    try {
      const contactData = insertPhoneContactSchema.parse(req.body);
      const contact = await storage.createPhoneContact(contactData);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/phone/contacts/:id", async (req, res) => {
    try {
      await storage.deletePhoneContact(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Messages
  app.get("/api/phone/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getPhoneMessages(req.params.userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/messages", async (req, res) => {
    try {
      const messageData = insertPhoneMessageSchema.parse(req.body);
      const message = await storage.createPhoneMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/phone/messages/:id/read", async (req, res) => {
    try {
      await storage.markPhoneMessageRead(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Banking Transactions
  app.get("/api/phone/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getPhoneTransactions(req.params.userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/transactions", async (req, res) => {
    try {
      const transactionData = insertPhoneTransactionSchema.parse(req.body);
      const transaction = await storage.createPhoneTransaction(transactionData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Twitter/Warble
  app.get("/api/phone/tweets", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const tweets = await storage.getPhoneTweets(page, limit);
      res.json(tweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/tweets", async (req, res) => {
    try {
      const tweetData = insertPhoneTweetSchema.parse(req.body);
      const tweet = await storage.createPhoneTweet(tweetData);
      res.json(tweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/phone/tweets/:id/like", async (req, res) => {
    try {
      await storage.likePhoneTweet(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notes
  app.get("/api/phone/notes/:userId", async (req, res) => {
    try {
      const notes = await storage.getPhoneNotes(req.params.userId);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/notes", async (req, res) => {
    try {
      const noteData = insertPhoneNoteSchema.parse(req.body);
      const note = await storage.createPhoneNote(noteData);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/phone/notes/:id", async (req, res) => {
    try {
      const noteData = insertPhoneNoteSchema.parse(req.body);
      const note = await storage.updatePhoneNote(req.params.id, noteData);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/phone/notes/:id", async (req, res) => {
    try {
      await storage.deletePhoneNote(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Gallery/Photos
  app.get("/api/phone/photos/:userId", async (req, res) => {
    try {
      const photos = await storage.getPhonePhotos(req.params.userId);
      res.json(photos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/photos", async (req, res) => {
    try {
      const photoData = insertPhonePhotoSchema.parse(req.body);
      const photo = await storage.createPhonePhoto(photoData);
      res.json(photo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/phone/photos/:id", async (req, res) => {
    try {
      await storage.deletePhonePhoto(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Yellow Pages
  app.get("/api/phone/yellowpages", async (req, res) => {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;
      const businesses = await storage.searchYellowPages(search, category);
      res.json(businesses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/phone/yellowpages", async (req, res) => {
    try {
      const businessData = insertPhoneYellowPageSchema.parse(req.body);
      const business = await storage.createYellowPageBusiness(businessData);
      res.json(business);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
