// pages/api/chat.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_OPENAI_API_KEY,
});

function processContents(contents) {
  // Sort contents by id (timestamp) in ascending order
  const sortedContents = contents.sort((a, b) => a.id - b.id);

  // Process all contents in a single chronological list
  const processedContent = sortedContents
    .map((c) => {
      const timestamp = new Date(c.id).toLocaleString();
      const contentType = c.type === "transcribed" ? "Audio" : "Typed";
      return `[${timestamp}] (${contentType}) ${c.content}`;
    })
    .join("\n");

  return processedContent;
}

export default async function handler(req, res) {
  console.log("API route called");
  console.log("Request body:", req.body);
  console.log("API Key available:", !!process.env.REACT_OPENAI_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, contents } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ error: "Contents must be an array" });
  }

  const processedContent = processContents(contents);
  console.log("Processed content:", processedContent);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Use the following context to answer the user's question. The context is presented in chronological order with timestamps and content types (Audio or Typed):",
        },
        {
          role: "user",
          content: `Context:\n${processedContent}\n\nQuestion: ${question}`,
        },
      ],
    });

    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
}
