// import { promises as fs } from "fs";
// import path from "path";

// const MAX_TRANSCRIPTS = 96; // 8 hours * 12 (5-minute chunks per hour)

// export default async function handler(req, res) {
//   console.log("Save transcript API route hit", req.method);
//   if (req.method === "POST") {
//     try {
//       const { transcript } = req.body;
//       console.log("Received transcript:", transcript);
//       const dataDir = path.join(process.cwd(), "data");
//       const timestamp = Date.now();
//       const fileName = `transcript-${timestamp}.txt`;
//       const filePath = path.join(dataDir, fileName);

//       console.log("Data directory:", dataDir);
//       console.log("File path:", filePath);

//       // Ensure the data directory exists
//       await fs.mkdir(dataDir, { recursive: true });

//       // Write the new transcript
//       await fs.writeFile(filePath, transcript);
//       console.log("Transcript written to file");

//       // Get all transcript files
//       const files = await fs.readdir(dataDir);
//       const transcriptFiles = files.filter(
//         (file) => file.startsWith("transcript-") && file.endsWith(".txt")
//       );

//       console.log("Total transcript files:", transcriptFiles.length);

//       // If we have more than MAX_TRANSCRIPTS, remove the oldest ones
//       if (transcriptFiles.length > MAX_TRANSCRIPTS) {
//         const sortedFiles = transcriptFiles.sort();
//         const filesToRemove = sortedFiles.slice(
//           0,
//           sortedFiles.length - MAX_TRANSCRIPTS
//         );

//         for (const file of filesToRemove) {
//           await fs.unlink(path.join(dataDir, file));
//           console.log("Removed old transcript file:", file);
//         }
//       }

//       res.status(200).json({
//         message: "Transcript saved successfully",
//         id: timestamp, // Send the timestamp as the ID
//       });
//     } catch (error) {
//       console.error("Error saving transcript:", error);
//       res.status(500).json({ error: "Failed to save transcript" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { transcript, type } = req.body;
      const timestamp = Date.now();
      const key = `content:${timestamp}`;

      const contentToStore = {
        id: timestamp,
        content: transcript,
        type: type,
      };

      console.log("Saving content:", key, contentToStore);
      await kv.set(key, JSON.stringify(contentToStore)); // Stringify the object before storing
      await kv.lpush("contents", timestamp);
      console.log("Content saved successfully");

      res.status(200).json(contentToStore);
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ error: "Failed to save content" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
