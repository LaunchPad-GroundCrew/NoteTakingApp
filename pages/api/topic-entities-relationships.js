// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.REACT_OPENAI_API_KEY,
// });

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { contents } = req.body;

//   if (!contents || contents.length === 0) {
//     return res.status(400).json({ error: "No content provided" });
//   }

//   try {
//     console.log("API received:", JSON.stringify({ contents }, null, 2));

//     const processedContent = contents.map((c) => c.content).join("\n");

//     console.log("Processed content for GPT:", processedContent);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are an assistant that analyzes text to identify entities and their relationships, organizing them into a hierarchical structure with potentially multiple root nodes. These root nodes will be determined by the different topics covered in the text. You will also determine the main objective of each topic and score each entity based on its semantic similarity to the main objective within its corresponding topic. Output your analysis in JSON format with the following structure:

// {
//   "roots": [
//     {
//       "id": "topic1",
//       "text": "Topic 1 Name",
//       "mainObjective": "Main objective of Topic 1",
//       "children": [
//         {
//           "id": "entity1",
//           "text": "Entity 1",
//           "type": "person/concept/place/etc",
//           "alignmentScore": 85,
//           "children": [
//             // Nested entities if applicable
//           ]
//         },
//         // More entities...
//       ]
//     },
//     // More root nodes (topics)...
//   ],
//   "relationships": [
//     {
//       "source": "entity1",
//       "target": "entity2",
//       "type": "relationship_type"
//     },
//     // More relationships...
//   ]
// }

// For each entity, provide a semantic similarity score from 0 to 100 based on how closely it aligns with the main objective of its topic. The score should be included in the entity object as shown above.

// Organize entities into a hierarchical structure under their respective topic root nodes. Create multiple root nodes to cover distinctly different main topics in the content. Each entity should have a unique 'id', 'text' (the entity name), 'type' field, and 'alignmentScore'. Relationships should reference the unique IDs of the entities. Do not include any markdown formatting in your response.`,
//         },
//         {
//           role: "user",
//           content: `Analyze the following text. Identify the main topics as root nodes, determine their objectives, and extract key entities as children of these root nodes. Organize the entities into a hierarchical structure under each topic, score them based on their alignment with the topic's objective, and identify relationships between entities. Provide the output in the specified JSON format:

// ${processedContent}`,
//         },
//       ],
//     });

//     const analysis = JSON.parse(completion.choices[0].message.content);
//     console.log("GPT response:", JSON.stringify(analysis, null, 2));

//     res.status(200).json(analysis);
//   } catch (error) {
//     console.error("Entities Relationships API error:", error);
//     res.status(500).json({ error: "Failed to analyze content" });
//   }
// }

/// Adding prevalence score and changin allignment score//

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.REACT_OPENAI_API_KEY,
// });

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { contents } = req.body;

//   if (!contents || contents.length === 0) {
//     return res.status(400).json({ error: "No content provided" });
//   }

//   try {
//     console.log("API received:", JSON.stringify({ contents }, null, 2));

//     const processedContent = contents.map((c) => c.content).join("\n");

//     console.log("Processed content for GPT:", processedContent);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are an assistant that analyzes text to identify multiple topics, their entities, and relationships. Organize the information into a hierarchical structure with multiple root nodes (one for each topic). For each topic, determine its main objective and score each entity based on its semantic similarity to the main objective. Additionally, identify challenging entities that may oppose or contradict other entities within each topic. Output your analysis in JSON format with the following structure:

// {
//   "roots": [
//     {
//       "id": "topic1",
//       "text": "Topic 1 Name",
//       "mainObjective": "Main objective of Topic 1",
//       "alignmentScore": 100,
//       "prevalenceScore": 100,
//       "children": [
//         {
//           "id": "entity1",
//           "text": "Entity 1",
//           "type": "person/concept/place/etc",
//           "alignmentScore": 85,
//           "prevalenceScore": 70,
//           "children": [
//             // Nested entities if applicable
//           ],
//           "challengingEntities": [
//             {
//               "id": "challenging1",
//               "text": "Challenging Entity 1",
//               "type": "person/concept/place/etc",
//               "alignmentScore": -60,
//               "prevalenceScore": 40
//             }
//             // More challenging entities...
//           ]
//         }
//         // More entities...
//       ]
//     },
//     // More root nodes (topics)...
//   ],
//   "relationships": [
//     {
//       "source": "entity1",
//       "target": "entity2",
//       "type": "relationship_type"
//     }
//     // More relationships...
//   ]
// }

// For each entity, provide a semantic similarity score (alignmentScore) from -100 to 100 based on how closely it aligns with the main objective of its topic. Also provide a prevalence score from 0 to 100 based on how frequently or significantly the entity appears in the context. Include these scores in the entity object as shown above. Challenging entities should typically have negative alignment scores.

// Organize entities into a hierarchical structure under their respective topic root nodes. Each entity should have a unique 'id', 'text' (the entity name), 'type' field, 'alignmentScore', and 'prevalenceScore'. Challenging entities should be included within the 'challengingEntities' array of the entity they challenge or oppose. Relationships should reference the unique IDs of the entities. Do not include any markdown formatting in your response.`,
//         },
//         {
//           role: "user",
//           content: `Analyze the following text. Identify the main topics as root nodes, determine their objectives, and extract key entities as children of these root nodes. Organize the entities into a hierarchical structure under each topic, score them based on their alignment with the topic's objective and their prevalence, identify challenging entities for each relevant entity, and identify relationships between entities. Provide the output in the specified JSON format:

// ${processedContent}`,
//         },
//       ],
//     });

//     const analysis = JSON.parse(completion.choices[0].message.content);
//     console.log("GPT response:", JSON.stringify(analysis, null, 2));

//     res.status(200).json(analysis);
//   } catch (error) {
//     console.error("Entities Relationships API error:", error);
//     res.status(500).json({ error: "Failed to analyze content" });
//   }
// }

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_OPENAI_API_KEY,
});

// This function can run for a maximum of 35 seconds
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
    console.log("API received:", JSON.stringify({ contents }, null, 2));

    const processedContent = contents.map((c) => c.content).join("\n");

    console.log("Processed content for GPT:", processedContent);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an assistant that analyzes text to identify multiple topics, their entities, and relationships. Organize the information into a hierarchical structure with multiple root nodes (one for each topic). Follow these guidelines:

    1. For each topic, determine its main objective and identify key entities.
    2. Categorize entities as follows:
       - Aligned (20 to 100): Entities with high semantic similarity to the topic's objective.
       - Neutral (-20 to 20): Entities with lower semantic similarity that neither support nor oppose the topic's objective OR entities that are often parts of larger entities (have a meronymy relationship)  OR entitites with high prevalence score(>80) independent of allignment.
       - Challenging (-100 to -20): Entities that oppose or contradict the topic's objective.
    3. PRIORITIZE finding challenging entitites , followed by including at least 30% of entities to be neutral due to meronomy OR allignment. Lastly, include a mix of aligned, neutral and challenging entities for each topic.
    4. For each entity, provide a "classRationale" explaining why it's classified as aligned, neutral, or challenging. For neutral entities, always specify if it's due to meronymy.
    5. Ensure that each entity is unique and avoid duplicating ideas across different nodes.
    6. For aligned entities, create a hierarchical structure with parent-child relationships when appropriate.
    7. Include detailed information in entity descriptions to reduce vagueness.
    8. Assign both alignment and prevalence scores to each entity.
    9. Identify and describe meronymy relationships between entities.

    Output your analysis in the following JSON format:

    {
      "roots": [
        {
          "id": "unique_id",
          "text": "Topic Name",
          "mainObjective": "Main objective of the Topic",
          "alignmentScore": 100,
          "prevalenceScore": 100,
          "children": [
            {
              "id": "unique_id",
              "text": "Entity Name",
              "type": "entity_type",
              "description": "Brief description of the entity",
              "alignmentScore": -100 to 100,
              "prevalenceScore": 0 to 100,
              "classRationale": "Explanation of why this entity is aligned, neutral, or challenging. For neutral entities, specify if it's due to meronymy.",
              "children": [
                // Nested entities if applicable (only for aligned entities)
              ],
              "challengingEntities": [
                // Include challenging entities here (for aligned and neutral entities)
              ]
            }
            // More entities...
          ]
        }
        // More root nodes (topics)...
      ],
      "relationships": [
        {
          "source": "entity_id",
          "target": "entity_id",
          "type": "relationship_type",
          "description": "Brief description of the relationship"
        }
        // More relationships...
      ]
    }

    Ensure that each entity has a unique 'id', descriptive 'text', 'type', 'description', 'alignmentScore', and 'prevalenceScore'.Pay special attention to identifying and describing meronymy relationships, and aim for a higher proportion of neutral entities. Challenging entities should be included within the 'challengingEntities' array of the entity they challenge or oppose. Provide detailed relationship descriptions to clarify connections between entities`,
        },
        {
          role: "user",
          content: `Analyze the following text. Identify the main topics as root nodes, determine their objectives, and extract key entities as children of these root nodes. Organize the entities into a hierarchical structure under each topic, score them based on their alignment with the topic's objective and their prevalence, identify challenging entities for each relevant entity, and identify relationships between entities, paying special attention to meronymy relationships. Aim for at least 30% of entities to be neutral, especially those with meronymy relationships. Do not include any markdown formatting in your response. Provide the output in the specified JSON format:

    ${processedContent}`,
        },
      ],
    });

    //     const completion = await openai.chat.completions.create({
    //       model: "gpt-3.5-turbo",
    //       messages: [
    //         {
    //           role: "system",
    //           content: `You are an assistant that analyzes text to identify multiple topics, their entities, and relationships. Organize the information into a hierarchical structure with multiple root nodes (one for each topic). Follow these guidelines:

    // 1. For each topic, determine its main objective and identify key entities.
    // 2. Categorize entities as follows:
    //    - Aligned (20 to 100): Entities with high semantic similarity to the topic's objective.
    //    - Neutral (-20 to 20): Entities with low semantic similarity to the topic's objective OR entities that have a meronymy (part-of) relationship with any other entity.
    //    - Challenging (-100 to -20): Entities that oppose or contradict the topic's objective.
    // 3. Prioritize including a mix of aligned, neutral, and challenging entities for each topic.
    // 4. Ensure that each entity is unique and avoid duplicating ideas across different nodes.
    // 5. For aligned entities, create a hierarchical structure with parent-child relationships when appropriate.
    // 6. Include more detailed information in entity descriptions to reduce vagueness.
    // 7. Assign both alignment and prevalence scores to each entity.
    // 8. Identify and describe meronymy relationships between entities.

    // Output your analysis in the following JSON format:

    // {
    //   "roots": [
    //     {
    //       "id": "unique_id",
    //       "text": "Topic Name",
    //       "mainObjective": "Main objective of the Topic",
    //       "alignmentScore": 100,
    //       "prevalenceScore": 100,
    //       "children": [
    //         {
    //           "id": "unique_id",
    //           "text": "Entity Name",
    //           "type": "entity_type",
    //           "description": "Brief description of the entity",
    //           "alignmentScore": -100 to 100,
    //           "prevalenceScore": 0 to 100,
    //           "neutralReason": "alignment" or "meronymy",
    //           "children": [
    //             // Nested entities if applicable (only for aligned entities)
    //           ],
    //           "challengingEntities": [
    //             // Include challenging entities here (for aligned and neutral entities)
    //           ]
    //         }
    //         // More entities...
    //       ]
    //     }
    //     // More root nodes (topics)...
    //   ],
    //   "relationships": [
    //     {
    //       "source": "entity_id",
    //       "target": "entity_id",
    //       "type": "relationship_type",
    //       "description": "Brief description of the relationship"
    //     }
    //     // More relationships...
    //   ]
    // }

    // Ensure that each entity has a unique 'id', descriptive 'text', 'type', 'description', 'alignmentScore', and 'prevalenceScore'. For neutral entities, include a 'neutralReason' field specifying whether it's neutral due to alignment score or meronymy relationship. Challenging entities should be included within the 'challengingEntities' array of the entity they challenge or oppose. Provide detailed relationship descriptions to clarify connections between entities, especially highlighting meronymy relationships.`,
    //         },
    //         {
    //           role: "user",
    //           content: `Analyze the following text. Identify the main topics as root nodes, determine their objectives, and extract key entities as children of these root nodes. Organize the entities into a hierarchical structure under each topic, score them based on their alignment with the topic's objective and their prevalence, identify challenging entities for each relevant entity, and identify relationships between entities, paying special attention to meronymy relationships. Provide the output in the specified JSON format:

    // ${processedContent}`,
    //         },
    //       ],
    //     });

    const analysis = JSON.parse(completion.choices[0].message.content);
    console.log("GPT response:", JSON.stringify(analysis, null, 2));

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Entities Relationships API error:", error);
    res.status(500).json({ error: "Failed to analyze content" });
  }
}
