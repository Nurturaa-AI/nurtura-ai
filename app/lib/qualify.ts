// AI Qualification Agent
// Uses the new @google/genai package (updated 2025)

import { GoogleGenAI } from "@google/genai";
import { Lead } from "@/app/types/lead";

// Initialize Gemini with our API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

type QualificationResult = {
  score: number;
  tag: Lead["tag"];
  reason: string;
  suggestedReply: string;
};

export async function qualifyLead(
  message: string,
  businessContext: string = "a service-based business",
): Promise<QualificationResult> {
  // Edge case: empty message
  if (!message || message.trim() === "") {
    return {
      score: 0,
      tag: "cold",
      reason: "No message content to qualify",
      suggestedReply: "Hey! Thanks for reaching out. How can I help you today?",
    };
  }

  try {
    const prompt = `
You are a lead qualification expert for ${businessContext}.

A potential customer sent this Instagram message:
"${message}"

Analyze this message and return a JSON object with exactly these fields:
{
  "score": <number between 0 and 100>,
  "tag": <"hot" or "warm" or "cold">,
  "reason": <one sentence explaining the score>,
  "suggestedReply": <a friendly, natural reply the business should send>
}

Scoring guide:
- 70-100 (hot): Clear buying intent — asking about price, availability, booking, packages, or ready to start
- 40-69 (warm): Interested but researching — asking about services, process, or results
- 0-39 (cold): No buying intent — compliments, generic comments, or unclear messages

Rules:
- Return ONLY the JSON object, no extra text, no markdown, no backticks
- The suggestedReply must sound human and friendly, not robotic
- Keep the suggestedReply under 150 characters for Instagram
`;

    // Call Gemini using the new API format
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Get the text response
    const text = response.text ?? "";

    try {
      // Clean the response in case Gemini adds any extra characters
      // Sometimes it wraps JSON in backticks even when told not to
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      // Validate score is between 0 and 100
      const score = Math.min(100, Math.max(0, Number(parsed.score) || 0));

      // Validate tag is one of our three allowed values
      const validTags: Lead["tag"][] = ["hot", "warm", "cold"];
      const tag: Lead["tag"] = validTags.includes(parsed.tag)
        ? parsed.tag
        : score >= 70
          ? "hot"
          : score >= 40
            ? "warm"
            : "cold";

      return {
        score,
        tag,
        reason: parsed.reason || "No reason provided",
        suggestedReply:
          parsed.suggestedReply || "Thanks for reaching out! How can I help?",
      };
    } catch {
      // Edge case: JSON parsing failed
      console.error("Failed to parse Gemini response:", text);
      return {
        score: 0,
        tag: "cold",
        reason: "AI response could not be parsed",
        suggestedReply:
          "Hey! Thanks for reaching out. How can I help you today?",
      };
    }
  } catch (error) {
    // Edge case: API call failed
    console.error("Gemini qualification error:", error);
    return {
      score: 0,
      tag: "cold",
      reason: "AI qualification failed — manual review needed",
      suggestedReply: "Hey! Thanks for reaching out. How can I help you today?",
    };
  }
}
