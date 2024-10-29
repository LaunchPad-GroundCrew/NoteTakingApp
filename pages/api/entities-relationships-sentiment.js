import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_OPENAI_API_KEY,
});

// This function can run for a maximum of 25 seconds
export const config = {
  maxDuration: 35,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { contents } = req.body;

  if (!contents || contents.length === 0) {
    return res.status(400).json({ error: "No content provided" });
  }

  try {
    console.log("API received:", JSON.stringify(contents, null, 2));

    const processedContent = contents.map((c) => c.content).join("\n");

    console.log("Processed content for GPT:", processedContent);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // gpt-3.5-turbo
      messages: [
        {
          role: "system",
          content: `You are an assistant that analyzes text to identify the overall sentiment, key concepts and their relationships according to their contribution towards the main objectives of the content, organizing them into a hierarchical structure with  potentially multiple root nodes. Your goal is to create a mind map structure that reinforces understanding and provides deeper insights. Follow these guidelines: 

1. Identify the main objectives or key takeaways of the content.
2. Extract important concepts, ideas, and entities that are crucial for accomplishing the main objectives.
3. Establish meaningful relationships between these concepts, showing how they interconnect and support the main objectives.

Output your analysis in JSON format with the following structure:
{
  "roots": [
    {
      "id": "root1",
      "text": "Main Topic 1",
      "children": [
        {
          "id": "unique_id_1",
          "text": "Subtopic 1",
          "type": "category",
          "children": [
            {
              "id": "unique_id_2",
              "text": "Entity 1",
              "type": "entity_type"
            },
            // More entities...
          ]
        },
        // More subtopics...
      ]
    },
    {
      "id": "root2",
      "text": "Main Topic 2",
      "children": [
        // Similar structure as root1...
      ]
    }
    // More root nodes if necessary...
  ],
  "relationships": [
    {
      "source": "unique_id_2",
      "target": "unique_id_3",
      "type": "relationship_type"
    },
    // More relationships...
  ],
  "sentiment": {
    "score": 0.0, // A float between -1.0 (very negative) and 1.0 (very positive)
    "explanation": "A brief explanation of the overall sentiment"
  }
}

Organize entities into logical categories or subtopics under appropriate root nodes. Create multiple root nodes if the content covers distinctly different main topics. Each entity should have a unique 'id', 'text' (the entity name), and 'type' field. Relationships should reference the unique IDs of the entities. Include an overall sentiment score and explanation. Do not include any markdown formatting in your response.`,
        },
        {
          role: "user",
          content: `Analyze the following text and identify key entities, organizing them into a hierarchical structure with potentially multiple root nodes and relationships. Also provide an overall sentiment analysis. Provide the output in the specified JSON format:\n\n${processedContent}`,
        },
      ],
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    console.log("GPT response:", JSON.stringify(analysis, null, 2));

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Entities Relationships Sentiment API error:", error);
    res.status(500).json({ error: "Failed to analyze content" });
  }
}
