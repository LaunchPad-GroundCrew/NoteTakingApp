// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.REACT_OPENAI_API_KEY,
// });

// function processContents(contents) {
//   // Sort contents by id (timestamp) in ascending order
//   const sortedContents = contents.sort((a, b) => a.id - b.id);

//   // Process all contents in a single chronological list
//   const processedContent = sortedContents
//     .map((c) => {
//       const timestamp = new Date(c.id).toLocaleString();
//       const contentType = c.type === "transcribed" ? "Audio" : "Typed";
//       return `[${timestamp}] (${contentType}) ${c.content}`;
//     })
//     .join("\n");

//   return processedContent;
// }

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { contents } = req.body;

//   console.log("Received contents:", JSON.stringify(contents, null, 2));

//   if (!contents || contents.length === 0) {
//     return res.status(400).json({ error: "No content provided" });
//   }

//   try {
//     const processedContent = processContents(contents);
//     console.log("Processed content:", processedContent);

//     if (processedContent.trim() === "") {
//       return res.status(400).json({ error: "No valid content found" });
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an assistant that summarizes content, extracts key ideas and action items. The content is provided in chronological order with timestamps and content types (Audio or Typed). Provide a 100-word max abstract summary and up to 7 bullet points of key ideas discussed, considering the order of events and the type of each input.",
//         },
//         {
//           role: "user",
//           content: `Summarize the following context, paying attention to the chronological order and content types:\n\n${processedContent}`,
//         },
//       ],
//     });

//     const summary = completion.choices[0].message.content;

//     res.status(200).json({ summary });
//   } catch (error) {
//     console.error("OpenAI API error:", error);
//     res.status(500).json({ error: "Failed to get summary from OpenAI" });
//   }
// }

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.REACT_OPENAI_API_KEY,
// });

// function processContents(contents) {
//   const sortedContents = contents.sort((a, b) => a.id - b.id);
//   return sortedContents
//     .map((c) => {
//       const timestamp = new Date(c.id).toLocaleString();
//       const contentType = c.type === "transcribed" ? "Audio" : "Typed";
//       return `[${timestamp}] (${contentType}) ${c.content}`;
//     })
//     .join("\n");
// }

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { contents } = req.body;

//   if (!contents || contents.length === 0) {
//     return res.status(400).json({ error: "No content provided" });
//   }

//   try {
//     const processedContent = processContents(contents);
//     if (processedContent.trim() === "") {
//       return res.status(400).json({ error: "No valid content found" });
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI assistant tasked with analyzing and transforming text content from meetings, discussions, or other collaborative sessions. Your goal is to provide a concise summary and action plan. Structure your response as follows, omitting any section that lacks relevant content:

// 1. Abstract (100 words max):
//    Provide a concise overview of the main topics discussed and key outcomes.

// 2. Main Topics and Goals:
//    List the main topics discussed and their respective primary goals or objectives.

// 3. Action Items and Accountability:
//    Extract and list all action items, tasks, and follow-ups mentioned or implied. For each item:
//    - Specify the task or action to be taken
//    - Assign responsibility to an individual, role, or team
//    - Set a clear deadline or timeframe. If no clear deadline is specified, add "(no specified deadline)"
//    - Include any additional relevant details or resources needed
//    If no clear action items are available, provide a maximum of 5 key ideas from the discussion instead.

// 4. Next Steps:
//    Outline the immediate next steps, including:
//    - Documents or information to be exchanged
//    - Upcoming meetings or checkpoints
//    - Any preparatory work required before the next session
//    If no next steps are explicitly discussed, prefix your suggestions with "SUGGESTED:" in bold.

// 5. Open Issues, Questions, and Risks:
//    Identify any unresolved issues, potential risks, or areas requiring further discussion. For each:
//    - Clearly label it as an "OPEN ISSUE:", "OPEN QUESTION:", or "UNADDRESSED RISK:" in bold
//    - Describe the issue, question, or risk
//    - Suggest an action to address or investigate it further
//    - If possible, assign responsibility for addressing the item

// 6. Recommendations:
//    Based on the discussion or findings, provide:
//    - Suggestions for product or service improvements
//    - Recommendations for process enhancements
//    - Ideas for team or organizational development

// 7. Customer Concerns (if applicable):
//    Only include this section if customer concerns are explicitly mentioned. For each concern:
//    - Describe the concern
//    - Specify actions to address it
//    - Assign responsibility
//    - Set deadlines for resolution

// 8. Learning and Development:
//    Only include this section if training or learning components were part of the session. If applicable:
//    - Summarize key learnings
//    - Assign follow-up tasks or practice activities to reinforce learning
//    - Suggest resources for further study or skill development

// Ensure that all action items, tasks, and responsibilities are clearly defined with specific individuals or roles assigned wherever possible. If certain details are not explicitly mentioned in the content, use your best judgment to make reasonable suggestions, and note these as AI-generated recommendations. Omit any section (3-8) that does not have relevant content to report.`,
//         },
//         {
//           role: "user",
//           content: `Analyze and summarize the following context, paying attention to the chronological order and content types. Provide a concise summary and action plan based on the given structure, omitting any sections without relevant content:\n\n${processedContent}`,
//         },
//       ],
//     });

//     const summary = completion.choices[0].message.content;

//     res.status(200).json({ summary });
//   } catch (error) {
//     console.error("OpenAI API error:", error);
//     res.status(500).json({ error: "Failed to get summary from OpenAI" });
//   }
// }

/////////////Working fine/////////////////////
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_OPENAI_API_KEY,
});

function processContents(contents) {
  const sortedContents = contents.sort((a, b) => a.id - b.id);
  return sortedContents
    .map((c) => {
      const timestamp = new Date(c.id).toLocaleString();
      const contentType = c.type === "transcribed" ? "Audio" : "Typed";
      return `[${timestamp}] (${contentType}) ${c.content}`;
    })
    .join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { contents } = req.body;

  if (!contents || contents.length === 0) {
    return res.status(400).json({ error: "No content provided" });
  }

  try {
    const processedContent = processContents(contents);
    if (processedContent.trim() === "") {
      return res.status(400).json({ error: "No valid content found" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant tasked with analyzing and transforming text content from meetings, discussions, or other collaborative sessions. Your goal is to provide a concise summary and action plan. Structure your response as follows, omitting any section that lacks relevant content:

1. Abstract (100 words max):
   Provide a concise overview of the main topics discussed and key outcomes.

2. Main Topics and Goals:
   List the main topics discussed and their respective primary goals or objectives.

3. Action Items and Accountability:
   Extract and list all action items, tasks, and follow-ups mentioned or implied. For each item:
   - Specify the task or action to be taken
   - Assign responsibility to an individual, role, or team
   - Set a clear deadline or timeframe. If no clear deadline is specified, add "(no specified deadline)"
   - Include any additional relevant details or resources needed
   - Indicate, in the end of the corresponding task,  the "id"  of the content file where this action item was first discussed.
   - Format each item as follows:[Task description] (by [Responsible party], [Deadline or "no specified deadline"]) [id: MM/DD/YYYY, HH:MM:SS AM/PM][Status: Pending]
   Determine the status based on the context:
   - Pending: If the task is newly assigned or not explicitly mentioned as completed.
   - Completed: If there's clear indication in the discussion that the task has been finished.
   - Resolved: If the task was addressed or became unnecessary during the meeting.
   If no clear action items are available, provide a maximum of 5 key ideas from the discussion instead.

4. Next Steps:
   Outline the immediate next steps, including:
   - Documents or information to be exchanged
   - Upcoming meetings or checkpoints
   - Any preparatory work required before the next session
   If no next steps are explicitly discussed, prefix your suggestions with "SUGGESTED:" in bold.

5. Open Issues, Questions, and Risks:
   Identify any unresolved issues, potential risks, or areas requiring further discussion. For each:
   - Clearly label it as an "OPEN ISSUE:", "OPEN QUESTION:", or "UNADDRESSED RISK:" in bold
   - Describe the issue, question, or risk
   - Suggest an action to address or investigate it further
   - If possible, assign responsibility for addressing the item

6. Recommendations:
   Based on the discussion or findings, provide:
   - Suggestions for product or service improvements
   - Recommendations for process enhancements
   - Ideas for team or organizational development

7. Customer Concerns (if applicable):
   Only include this section if customer concerns are explicitly mentioned. For each concern:
   - Describe the concern
   - Specify actions to address it
   - Assign responsibility
   - Set deadlines for resolution

8. Learning and Development:
   Only include this section if training or learning components were part of the session. If applicable:
   - Summarize key learnings
   - Assign follow-up tasks or practice activities to reinforce learning
   - Suggest resources for further study or skill development

Ensure that all action items, tasks, and responsibilities are clearly defined with specific individuals or roles assigned wherever possible. If certain details are not explicitly mentioned in the content, use your best judgment to make reasonable suggestions, and note these as AI-generated recommendations. IMPORTANT: Omit any section (3-8) that does not have relevant content to report.`,
        },
        {
          role: "user",
          content: `Analyze and summarize the following context, paying attention to the chronological order and content types. Provide a concise summary and action plan based on the given structure, omitting any sections without relevant content. Be sure to include timestamps for action items:\n\n${processedContent}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;

    res.status(200).json({ summary });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to get summary from OpenAI" });
  }
}

///Working ok just need to sort out the strictness of the response ie. sections 1,2,3......
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.REACT_OPENAI_API_KEY,
// });

// function processContents(contents) {
//   const sortedContents = contents.sort((a, b) => a.id - b.id);
//   return sortedContents
//     .map((c) => {
//       const timestamp = new Date(c.id).toLocaleString();
//       const contentType = c.type === "transcribed" ? "Audio" : "Typed";
//       return `[${timestamp}] (${contentType}) ${c.content}`;
//     })
//     .join("\n");
// }

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { contents } = req.body;

//   if (!contents || contents.length === 0) {
//     return res.status(400).json({ error: "No content provided" });
//   }

//   try {
//     const processedContent = processContents(contents);
//     if (processedContent.trim() === "") {
//       return res.status(400).json({ error: "No valid content found" });
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI assistant tasked with analyzing and transforming text content from meetings, discussions, or other collaborative sessions. Your goal is to provide a concise summary and action plan.

// First, determine the context and speaker situation. Consider the following:
// 1. Explicit speaker labels (e.g., "John:", "Sarah:")
// 2. Distinct viewpoints or perspectives being expressed
// 3. Clear turn-taking in the conversation
// 4. Use of pronouns like "I" and "you" in a way that suggests multiple participants
// 5. The overall tone and structure (e.g., lecture-style vs. interactive discussion)

// Based on your analysis, categorize the content as one of the following:
// 1. "Multiple speakers detected: Interactive discussion" - Clear evidence of multiple participants actively engaging
// 2. "Single speaker detected: Lecture or presentation" - Content appears to be from a single speaker, possibly addressing an audience
// 3. "Speaker situation unclear" - Not enough information to determine the speaker situation confidently

// Include this categorization statement or speaker situation at the end of your response.

// Then, structure your response as follows, ALWAYS start with sections 1,2,3.... as specified below, omitting any section that lacks relevant content:

// 1. Abstract (100 words max):
//    Provide a concise overview of the main topics discussed and key outcomes.

// 2. Main Topics and Goals:
//    List the main topics discussed and their respective primary goals or objectives.

// 3. Action Items and Accountability:
//    Extract and list all action items, tasks, and follow-ups mentioned or implied. Format each item as follows:
//    - [Task description] (by [Responsible party], [Deadline or "no specified deadline"]) [id: MM/DD/YYYY, HH:MM:SS AM/PM] [Status: Pending/Completed/Resolved]

//    Example:
//    - Prepare a visually driven explanation of the data flow in a transformer (by [Team Visuals], no specified deadline) [id: 9/7/2024, 3:23:31 PM] [Status: Pending]

//    Determine the status based on the context:
//    - Pending: If the task is newly assigned or not explicitly mentioned as completed.
//    - Completed: If there's clear indication in the discussion that the task has been finished.
//    - Resolved: If the task was addressed or became unnecessary during the meeting.

//    If no clear action items are available, provide a maximum of 5 key ideas from the discussion instead.

// 4. Next Steps:
//    Outline the immediate next steps, including:
//    - Documents or information to be exchanged
//    - Upcoming meetings or checkpoints
//    - Any preparatory work required before the next session
//    If no next steps are explicitly discussed, prefix your suggestions with "SUGGESTED:" in bold.

// 5. Open Issues, Questions, and Risks:
//    Identify any unresolved issues, potential risks, or areas requiring further discussion. For each:
//    - Clearly label it as an "OPEN ISSUE:", "OPEN QUESTION:", or "UNADDRESSED RISK:" in bold
//    - Describe the issue, question, or risk
//    - Suggest an action to address or investigate it further
//    - If possible, assign responsibility for addressing the item

// 6. Recommendations:
//    Based on the discussion or findings, provide:
//    - Suggestions for product or service improvements
//    - Recommendations for process enhancements
//    - Ideas for team or organizational development

// 7. Customer Concerns (if applicable):
//    Only include this section if customer concerns are explicitly mentioned. For each concern:
//    - Describe the concern
//    - Specify actions to address it
//    - Assign responsibility
//    - Set deadlines for resolution

// 8. Learning and Development:
//    Only include this section if training or learning components were part of the session. If applicable:
//    - Summarize key learnings
//    - Assign follow-up tasks or practice activities to reinforce learning
//    - Suggest resources for further study or skill development

// 9. Idea Flow Analysis (Only if multiple speakers are detected):
//    If you determined that multiple speakers are present, analyze the flow of ideas and energy level in the conversation. Focus on these aspects:
//    1. Idea Density: Calculate the number of distinct ideas or concepts introduced per minute.
//    2. Interaction Rate: Measure how frequently participants build upon or respond to each other's ideas.
//    3. Energy Level: Assess the overall enthusiasm and engagement in the conversation.
//    4. Idea Chaining: Identify sequences where multiple participants contribute to developing a single idea.
//    5. Divergent Thinking: Recognize instances where the conversation branches into new, unexpected directions.
//    6. Convergent Thinking: Identify moments where the group synthesizes multiple ideas into a cohesive concept.

//    Provide a quantitative score (0-100) for each aspect and a qualitative description. Then, give an overall "Idea Flow Index" (0-100) that combines these factors. Format your response as follows:
//    {
//      "ideaDensity": {
//        "score": 85,
//        "description": "High frequency of new ideas, averaging 3 distinct concepts per minute."
//      },
//      "interactionRate": {
//        "score": 70,
//        "description": "Good back-and-forth, with most ideas receiving at least one follow-up or build-upon."
//      },
//      "energyLevel": {
//        "score": 90,
//        "description": "Very high enthusiasm, with frequent exclamations and rapid exchanges."
//      },
//      "ideaChaining": {
//        "score": 80,
//        "description": "Strong collaborative idea development, with 5 instances of 3+ person idea chains."
//      },
//      "divergentThinking": {
//        "score": 65,
//        "description": "Several unexpected turns in the conversation, introducing fresh perspectives."
//      },
//      "convergentThinking": {
//        "score": 75,
//        "description": "Good synthesis of ideas, particularly in the latter half of the discussion."
//      },
//      "ideaFlowIndex": 78,
//      "overallAssessment": "This conversation demonstrates a vibrant exchange of ideas with high energy and engagement. The group shows a strong ability to build upon each other's thoughts, though there's room for improvement in exploring more divergent paths. The high idea density and enthusiasm contribute to a productive and dynamic discussion environment."
//    }

// Ensure that all action items, tasks, and responsibilities are clearly defined with specific individuals or roles assigned wherever possible. If certain details are not explicitly mentioned in the content, use your best judgment to make reasonable suggestions, and note these as AI-generated recommendations. Omit any section (3-8) that does not have relevant content to report.`,
//         },
//         {
//           role: "user",
//           content: `Analyze and summarize the following context, paying attention to the chronological order and content types. First, determine if multiple speakers are present. Then, provide a concise summary and action plan based on the given structure, omitting any sections without relevant content. Be sure to format action items as specified, including their status. Only include the Idea Flow Analysis if multiple speakers are detected:\n\n${processedContent}`,
//         },
//       ],
//     });

//     const summary = completion.choices[0].message.content;

//     res.status(200).json({ summary });
//   } catch (error) {
//     console.error("OpenAI API error:", error);
//     res.status(500).json({ error: "Failed to get summary from OpenAI" });
//   }
// }
