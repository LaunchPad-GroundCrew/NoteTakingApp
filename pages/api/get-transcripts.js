// import { promises as fs } from "fs";
// import path from "path";

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     try {
//       const dataDir = path.join(process.cwd(), "data");
//       const files = await fs.readdir(dataDir);
//       const transcripts = await Promise.all(
//         files
//           .filter(
//             (file) => file.startsWith("transcript-") && file.endsWith(".txt")
//           )
//           .map(async (file) => {
//             const content = await fs.readFile(path.join(dataDir, file), "utf8");
//             const id = parseInt(
//               file.replace("transcript-", "").replace(".txt", ""),
//               10
//             );
//             return { id, transcript: content };
//           })
//       );

//       res.status(200).json(transcripts);
//     } catch (error) {
//       console.error("Error retrieving transcripts:", error);
//       res.status(500).json({ error: "Failed to retrieve transcripts" });
//     }
//   } else {
//     res.setHeader("Allow", ["GET"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get all content IDs
      const contentIds = await kv.lrange("contents", 0, -1);
      console.log("Content IDs:", contentIds);

      // Fetch all contents
      const contents = await Promise.all(
        contentIds.map(async (id) => {
          const data = await kv.get(`content:${id}`);
          if (data) {
            // The data is already a JSON object, no need to parse
            console.log(`Data for ID ${id}:`, data);
            return data;
          }
          console.error(`No data found for ID ${id}`);
          return null;
        })
      );

      const validContents = contents.filter((content) => content !== null);
      console.log("Processed contents:", validContents);
      res.status(200).json(validContents);
    } catch (error) {
      console.error("Error retrieving contents:", error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
