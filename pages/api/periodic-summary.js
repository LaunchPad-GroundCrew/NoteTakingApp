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
      model: "gpt-4o-mini", // gpt-3.5-turbo
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
