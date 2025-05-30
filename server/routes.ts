import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiSuggestionRequestSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // AI Suggestions endpoint
  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const validatedData = aiSuggestionRequestSchema.parse(req.body);
      
      const prompt = `Please analyze the following blog post content and provide writing suggestions in JSON format. Return a JSON object with the following structure:
      {
        "suggestions": [
          {
            "type": "improvement",
            "message": "Specific suggestion text",
            "category": "grammar|style|structure|clarity|engagement"
          }
        ],
        "overallScore": number between 1-10,
        "summary": "Brief overall assessment"
      }

      Content to analyze:
      Title: ${validatedData.title || "No title"}
      Content: ${validatedData.content}`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert writing assistant that provides helpful, constructive feedback to improve blog posts. Focus on clarity, engagement, structure, and readability."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const suggestions = JSON.parse(response.choices[0].message.content || '{"suggestions": [], "overallScore": 7, "summary": "No specific suggestions available."}');
      
      res.json(suggestions);
    } catch (error) {
      console.error("AI suggestions error:", error);
      res.status(500).json({ 
        error: "Failed to generate AI suggestions",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all published posts
  app.get("/api/posts", async (req, res) => {
    try {
      const allPosts = await storage.getAllPosts();
      const publishedPosts = allPosts.filter(post => post.status === "published");
      res.json(publishedPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Get single post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Increment views for published posts
      if (post.status === "published") {
        await storage.incrementViews(id);
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
