// import React, { useState, useEffect } from "react";

// export default function TextTransformation({
//   accumulatedContents,
//   isRecording,
//   onSummaryRequest,
// }) {
//   const [summary, setSummary] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasContent, setHasContent] = useState(false);

//   useEffect(() => {
//     setHasContent(accumulatedContents.length > 0);
//     console.log(
//       "Accumulated contents in TextTransformation:",
//       accumulatedContents
//     );
//   }, [accumulatedContents]);

//   const handleSummaryRequest = async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       const newSummary = await onSummaryRequest(accumulatedContents);
//       setSummary(newSummary);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch summary");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Text Transformation</h2>
//       <button
//         onClick={handleSummaryRequest}
//         disabled={isLoading || !hasContent}
//         className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
//           isLoading || !hasContent
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {isLoading ? "Generating Summary..." : "Generate Summary"}
//       </button>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {hasContent ? (
//         <p className="text-green-500 mb-4">
//           Content available for summarization
//         </p>
//       ) : (
//         <p className="text-yellow-500 mb-4">No content available yet</p>
//       )}
//       {summary && (
//         <div className="mt-4">
//           <h4 className="text-2xl text-red-500 mb-2">Abstract and Outline:</h4>
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <p className="text-sm text-red-500 whitespace-pre-wrap">
//               {summary}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useCallback } from "react";

// export default function TextTransformation({
//   accumulatedContents,
//   isRecording,
//   onSummaryRequest,
// }) {
//   const [summary, setSummary] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasContents, setHasContents] = useState(false);

//   useEffect(() => {
//     setHasContents(accumulatedContents.length > 0);
//     console.log(
//       "Accumulated contents in TextTransformation:",
//       accumulatedContents
//     );
//   }, [accumulatedContents]);

//   useEffect(() => {
//     console.log("Summary updated:", summary);
//   }, [summary]);

//   const handleSummaryRequest = useCallback(async () => {
//     console.log("TextTransformation: Handling summary request");
//     setIsLoading(true);
//     setError("");

//     try {
//       const newSummary = await onSummaryRequest(accumulatedContents);
//       console.log("TextTransformation: New summary received", newSummary);
//       setSummary(newSummary);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch summary");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [onSummaryRequest, accumulatedContents]);

//   useEffect(() => {
//     let intervalId;
//     if (isRecording && hasContents) {
//       intervalId = setInterval(() => {
//         console.log("Triggering periodic summary update");
//         handleSummaryRequest();
//       }, 60000); // Every minute
//     }
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isRecording, hasContents, handleSummaryRequest]);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold mb-4">Text Transformation</h2>
//       <button
//         onClick={handleSummaryRequest}
//         disabled={isLoading || !hasContents}
//         className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
//           isLoading || !hasContents
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {isLoading ? "Generating Summary..." : "Generate Summary"}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//       {hasContents ? (
//         <p className="text-green-500">Content available for summarization</p>
//       ) : (
//         <p className="text-yellow-500">No content available yet</p>
//       )}
//       {summary && (
//         <div className="mt-4">
//           <h4 className="text-2xl text-red-500 mb-2">Abstract and Outline:</h4>
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <pre className="text-sm whitespace-pre-wrap">{summary}</pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
/////WORKING with BUGS
// import React, { useState, useEffect, useCallback } from "react";

// export default function TextTransformation({
//   accumulatedContents,
//   isRecording,
//   onSummaryRequest,
// }) {
//   const [summary, setSummary] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasContents, setHasContents] = useState(false);

//   useEffect(() => {
//     setHasContents(accumulatedContents.length > 0);
//     console.log(
//       "Accumulated contents in TextTransformation:",
//       accumulatedContents
//     );
//   }, [accumulatedContents]);

//   const handleSummaryRequest = useCallback(async () => {
//     console.log("TextTransformation: Handling summary request");
//     setIsLoading(true);
//     setError("");

//     try {
//       const newSummary = await onSummaryRequest(accumulatedContents);
//       console.log("TextTransformation: New summary received", newSummary);
//       setSummary(newSummary);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch summary");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [onSummaryRequest, accumulatedContents]);

//   useEffect(() => {
//     let intervalId;
//     if (isRecording && hasContents) {
//       intervalId = setInterval(() => {
//         console.log("Triggering periodic summary update");
//         handleSummaryRequest();
//       }, 60000); // Every minute
//     }
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isRecording, hasContents, handleSummaryRequest]);

//   useEffect(() => {
//     console.log("Summary updated:", summary);
//   }, [summary]);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold mb-4">Text Transformation</h2>
//       <button
//         onClick={handleSummaryRequest}
//         disabled={isLoading || !hasContents}
//         className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
//           isLoading || !hasContents
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {isLoading ? "Generating Summary..." : "Generate Summary"}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//       {hasContents ? (
//         <p className="text-green-500">Content available for summarization</p>
//       ) : (
//         <p className="text-yellow-500">No content available yet</p>
//       )}
//       {summary && (
//         <div className="mt-4">
//           <h4 className="text-2xl text-red-500 mb-2">Abstract and Outline:</h4>
//           <div className="bg-black p-4 rounded-lg shadow-md">
//             <pre className="text-sm text-red-500 whitespace-pre-wrap">
//               {summary}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
/////ALMOST THERE//////

// import React, { useState, useEffect, useCallback } from "react";

// export default function TextTransformation({
//   accumulatedContents,
//   isRecording,
//   onSummaryRequest,
// }) {
//   const [summary, setSummary] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasContents, setHasContents] = useState(false);

//   useEffect(() => {
//     setHasContents(accumulatedContents.length > 0);
//     console.log(
//       "Accumulated contents in TextTransformation:",
//       accumulatedContents
//     );
//   }, [accumulatedContents]);

//   const handleSummaryRequest = useCallback(async () => {
//     console.log("TextTransformation: Handling summary request");
//     setIsLoading(true);
//     setError("");

//     try {
//       const newSummary = await onSummaryRequest(accumulatedContents);
//       console.log("TextTransformation: New summary received", newSummary);
//       setSummary(newSummary);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch summary");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [onSummaryRequest, accumulatedContents]);

//   useEffect(() => {
//     if (isRecording && hasContents) {
//       const intervalId = setInterval(() => {
//         handleSummaryRequest();
//       }, 60000); // Every minute

//       return () => clearInterval(intervalId);
//     }
//   }, [isRecording, hasContents, handleSummaryRequest]);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold mb-4">Text Transformation</h2>
//       <button
//         onClick={handleSummaryRequest}
//         disabled={isLoading || !hasContents}
//         className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
//           isLoading || !hasContents
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {isLoading ? "Generating Summary..." : "Generate Summary"}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//       {hasContents ? (
//         <p className="text-green-500">Content available for summarization</p>
//       ) : (
//         <p className="text-yellow-500">No content available yet</p>
//       )}
//       {summary && (
//         <div className="mt-4">
//           <h4 className="text-2xl text-red-500 mb-2">Abstract and Outline:</h4>
//           <div className="bg-black p-4 rounded-lg shadow-md">
//             <pre className="text-sm text-red-500 mb-2 whitespace-pre-wrap">
//               {summary}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";

export default function TextTransformation({
  accumulatedContents,
  isRecording,
  onSummaryRequest,
  currentSummary,
}) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasContents, setHasContents] = useState(false);

  useEffect(() => {
    setHasContents(accumulatedContents.length > 0);
    console.log(
      "Accumulated contents in TextTransformation:",
      accumulatedContents
    );
  }, [accumulatedContents]);

  useEffect(() => {
    if (currentSummary) {
      setSummary(currentSummary);
      console.log("TextTransformation: Summary updated", currentSummary);
    }
  }, [currentSummary]);

  const handleSummaryRequest = useCallback(async () => {
    console.log("TextTransformation: Handling summary request");
    setIsLoading(true);
    setError("");

    try {
      const newSummary = await onSummaryRequest(accumulatedContents);
      console.log("TextTransformation: New summary received", newSummary);
      setSummary(newSummary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch summary");
    } finally {
      setIsLoading(false);
    }
  }, [onSummaryRequest, accumulatedContents]);

  return (
    <div className="space-y-0">
      {/* <h2 className="text-2xl font-bold mb-4">Text Transformation</h2> */}
      <div className="px-4">
        <button
          onClick={handleSummaryRequest}
          disabled={isLoading || !hasContents}
          className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
            isLoading || !hasContents
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-700 hover:bg-violet-600"
          }`}
        >
          {isLoading ? "Generating Summary..." : "Generate Summary"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {hasContents ? (
        <p className="px-4 text-emerald-600">
          Content available for summarization
        </p>
      ) : (
        <p className="px-4 text-amber-600">No content available yet</p>
      )}
      {summary && (
        <div className="mt-4">
          {/* <h4 className="text-xl text-red-500 mb-2">Abstract and Outline:</h4> */}
          <div className="bg-black p-4 rounded-lg shadow-md">
            <pre className="text-base text-violet-200 whitespace-pre-wrap">
              {summary}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

//ADDS Improvement in UI still need to get rid of some bugss.
// import React, { useState, useEffect, useCallback } from "react";

// export default function TextTransformation({
//   accumulatedContents,
//   isRecording,
//   onSummaryRequest,
//   currentSummary,
//   onTaskStatusUpdate,
// }) {
//   const [summary, setSummary] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasContents, setHasContents] = useState(false);
//   const [ideaFlowAnalysis, setIdeaFlowAnalysis] = useState(null);
//   const [contextDetection, setContextDetection] = useState("");

//   useEffect(() => {
//     setHasContents(accumulatedContents.length > 0);
//   }, [accumulatedContents]);

//   useEffect(() => {
//     if (currentSummary) {
//       setSummary(currentSummary);
//       extractIdeaFlowAnalysis(currentSummary);
//       extractContextDetection(currentSummary);
//     }
//   }, [currentSummary]);

//   const extractContextDetection = (summaryText) => {
//     const match = summaryText.match(
//       /^(Multiple speakers detected: Interactive discussion|Single speaker detected: Lecture or presentation|Speaker situation unclear)/
//     );
//     if (match) {
//       setContextDetection(match[0]);
//     } else {
//       setContextDetection("");
//     }
//   };

//   const extractIdeaFlowAnalysis = (summaryText) => {
//     const match = summaryText.match(/\{[\s\S]*\}/);
//     if (match) {
//       try {
//         const analysisJson = JSON.parse(match[0]);
//         setIdeaFlowAnalysis(analysisJson);
//       } catch (error) {
//         console.error("Failed to parse Idea Flow Analysis:", error);
//         setIdeaFlowAnalysis(null);
//       }
//     } else {
//       setIdeaFlowAnalysis(null);
//     }
//   };

//   const handleSummaryRequest = useCallback(async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       const newSummary = await onSummaryRequest(accumulatedContents);
//       setSummary(newSummary);
//       extractIdeaFlowAnalysis(newSummary);
//       extractContextDetection(newSummary);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch summary");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [onSummaryRequest, accumulatedContents]);

//   const handleStatusChange = (taskId, newStatus) => {
//     onTaskStatusUpdate(taskId, newStatus);
//     setSummary((prevSummary) => {
//       const updatedSummary = prevSummary.replace(
//         new RegExp(`\\[id: ${taskId}\\] \\[Status: .*?\\]`),
//         `[id: ${taskId}] [Status: ${newStatus}]`
//       );
//       return updatedSummary;
//     });
//   };

//   // New function to remove asterisks
//   const removeAsterisks = (text) => {
//     return text.replace(/\*/g, "");
//   };

//   const renderSummary = () => {
//     if (!summary) return null;

//     const sections = summary
//       .split("\n\n")
//       .filter(
//         (section) =>
//           !section.startsWith("Multiple speakers detected") &&
//           !section.startsWith("Single speaker detected") &&
//           !section.startsWith("Speaker situation unclear")
//       );
//     return sections.map((section, index) => {
//       const [title, ...content] = section.split("\n");
//       if (
//         title ===
//         "9. Idea Flow Analysis (Only if multiple speakers are detected in an interactive discussion):"
//       ) {
//         return null; // We'll render this separately
//       }
//       return (
//         <div key={index} className="mb-4">
//           <h3 className="text-lg font-bold text-violet-300 mb-2">
//             {removeAsterisks(title)}
//           </h3>
//           <div className="text-sm text-violet-100">
//             {content.map((line, lineIndex) => {
//               if (line.match(/^-\s.*\[id:/)) {
//                 const [task, idAndStatus] = line.split("[id:");
//                 const [id, status] = idAndStatus.split("] [Status:");
//                 const [responsiblePart, deadlinePart] = task.split("(by");
//                 const taskId = id.trim();
//                 const currentStatus = status.replace("]", "").trim();
//                 return (
//                   <div key={lineIndex} className="mb-2 pl-4">
//                     <p className="font-semibold">
//                       {removeAsterisks(responsiblePart.trim())}
//                     </p>
//                     <p className="text-amber-400">
//                       {removeAsterisks(deadlinePart.trim())}
//                     </p>
//                     <p className="text-gray-400">[id: {taskId}]</p>
//                     <div className="flex items-center mt-1">
//                       <span className="mr-2">Status:</span>
//                       <select
//                         value={currentStatus}
//                         onChange={(e) =>
//                           handleStatusChange(taskId, e.target.value)
//                         }
//                         className="bg-gray-700 text-white rounded px-2 py-1"
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Resolved">Resolved</option>
//                       </select>
//                     </div>
//                   </div>
//                 );
//               }
//               if (line.startsWith("SUGGESTED:")) {
//                 return (
//                   <p
//                     key={lineIndex}
//                     className="mb-1 font-bold text-emerald-400"
//                   >
//                     {removeAsterisks(line)}
//                   </p>
//                 );
//               }
//               if (
//                 line.startsWith("OPEN ISSUE:") ||
//                 line.startsWith("OPEN QUESTION:") ||
//                 line.startsWith("UNADDRESSED RISK:")
//               ) {
//                 const [label, ...rest] = line.split(":");
//                 return (
//                   <p key={lineIndex} className="mb-1">
//                     <span className="font-bold text-red-400">
//                       {removeAsterisks(label)}:
//                     </span>
//                     {removeAsterisks(rest.join(":"))}
//                   </p>
//                 );
//               }
//               return (
//                 <p key={lineIndex} className="mb-1">
//                   {removeAsterisks(line)}
//                 </p>
//               );
//             })}
//           </div>
//         </div>
//       );
//     });
//   };

//   const renderIdeaFlowAnalysis = () => {
//     if (!ideaFlowAnalysis) return null;

//     return (
//       <div className="mt-6 bg-gray-800 p-4 rounded-lg">
//         <h3 className="text-lg font-bold text-violet-300 mb-4">
//           Idea Flow Analysis
//         </h3>
//         {Object.entries(ideaFlowAnalysis).map(([key, value]) => {
//           if (key === "overallAssessment") {
//             return (
//               <div key={key} className="mt-4">
//                 <h4 className="text-md font-semibold text-violet-200 mb-2">
//                   Overall Assessment
//                 </h4>
//                 <p className="text-sm text-violet-100">
//                   {removeAsterisks(value)}
//                 </p>
//               </div>
//             );
//           }
//           if (typeof value === "object") {
//             return (
//               <div key={key} className="mb-3">
//                 <h4 className="text-md font-semibold text-violet-200 mb-1">
//                   {key.charAt(0).toUpperCase() + key.slice(1)}
//                 </h4>
//                 <div className="flex items-center mb-1">
//                   <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
//                     <div
//                       className="bg-violet-600 h-2.5 rounded-full"
//                       style={{ width: `${value.score}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm text-violet-100">{value.score}</span>
//                 </div>
//                 <p className="text-sm text-violet-100">
//                   {removeAsterisks(value.description)}
//                 </p>
//               </div>
//             );
//           }
//           if (key === "ideaFlowIndex") {
//             return (
//               <div key={key} className="mt-4">
//                 <h4 className="text-md font-semibold text-violet-200 mb-1">
//                   Idea Flow Index
//                 </h4>
//                 <div className="flex items-center">
//                   <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
//                     <div
//                       className="bg-violet-600 h-2.5 rounded-full"
//                       style={{ width: `${value}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm text-violet-100">{value}</span>
//                 </div>
//               </div>
//             );
//           }
//           return null;
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <div className="py-4 px-4">
//         <button
//           onClick={handleSummaryRequest}
//           disabled={isLoading || !hasContents}
//           className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
//             isLoading || !hasContents
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-violet-700 hover:bg-violet-600"
//           }`}
//         >
//           {isLoading ? "Generating Summary..." : "Generate Summary"}
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}
//       {hasContents ? (
//         <p className="px-4 text-emerald-600">
//           Content available for summarization
//         </p>
//       ) : (
//         <p className="px-4 text-amber-600">No content available yet</p>
//       )}
//       {contextDetection && (
//         <div className="px-4 py-2 bg-blue-900 text-blue-200 rounded">
//           <p className="font-semibold">Context Detection:</p>
//           <p>{removeAsterisks(contextDetection)}</p>
//         </div>
//       )}
//       {summary && (
//         <div className="mt-4">
//           <div className="bg-black p-4 rounded-lg shadow-md">
//             {renderSummary()}
//             {renderIdeaFlowAnalysis()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
