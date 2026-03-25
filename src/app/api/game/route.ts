import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    // Load from a custom variable name to completely bypass any globally broken environment variables
    const apiKey = (process.env.PROMPTWARS_GEMINI_KEY || process.env.GEMINI_API_KEY || "").trim();
    console.log("SERVER SIDE KEY CHECK:", apiKey ? `LOADED (${apiKey.length} chars) -> '${apiKey}'` : "UNDEFINED OR EMPTY");
    const ai = new GoogleGenAI({ apiKey });
    const body = await req.json();
    const { history = [], message } = body;

    const systemInstruction = `You are a Game Master of a psychological horror escape room. 
You are deeply atmospheric, creepy, and responsive. 
The player is trapped in an evolving set of rooms.
Your goal is to terrify the player and provide a gripping narrative. Keep descriptions to 2-4 sentences max, focus on sensory details (sound, smell, temperature). 
Adapt the horror to what the player seems to be interacting with. 
Return ONLY a valid JSON object with the following structure. Do not wrap it in markdown codeblocks:
{
  "narrative": "The atmospheric description of what happens or what they see",
  "choices": ["Option 1", "Option 2", "Option 3"],
  "environment": "A short 1-2 word description of the room (e.g., 'dark', 'bloody', 'sterile', 'flickering')"
}`;

    const contents = [...history, { role: "user", parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
      }
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
