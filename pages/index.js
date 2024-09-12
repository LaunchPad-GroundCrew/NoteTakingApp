// import React, { useState, useEffect } from "react";
// import AudioToTranscript from "@/components/AudioToTranscript";
// import TextTransformation from "@/components/TextTransformation";
// import GraphicalOutput from "@/components/GraphicalOutput";

// export default function Home() {
//   const [accumulatedContents, setAccumulatedContents] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);

//   useEffect(() => {
//     fetchContents();
//   }, []);
//   /////////////
//   useEffect(() => {
//     console.log("accumulatedContents updated:", accumulatedContents);
//   }, [accumulatedContents]);
//   ////////////

//   const fetchContents = async () => {
//     try {
//       console.log("Fetching contents...");
//       const response = await fetch("/api/get-transcripts");
//       if (!response.ok) {
//         throw new Error("Failed to fetch contents");
//       }
//       const data = await response.json();
//       console.log("Fetched contents:", data);
//       setAccumulatedContents(data);
//     } catch (error) {
//       console.error("Error fetching contents:", error);
//     }
//   };

//   const handleContentSave = (newContent) => {
//     setAccumulatedContents((prev) => [...prev, newContent]);
//   };

//   const handleSummaryRequest = async () => {
//     console.log("Summary request initiated");
//     try {
//       if (accumulatedContents.length === 0) {
//         console.log("No content available for summarization");
//         throw new Error("No content available for summarization");
//       }

//       console.log("Sending summary request to API");
//       const response = await fetch("/api/periodic-summary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contents: accumulatedContents }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch summary");
//       }

//       const data = await response.json();
//       console.log("Summary received:", data.summary);
//       return data.summary;
//     } catch (error) {
//       console.error("Error fetching summary:", error);
//       throw error;
//     }
//   };

//   return (
//     <div className="flex h-screen p-4 bg-black space-x-4">
//       <div className="w-1/5 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <AudioToTranscript
//           onContentSave={handleContentSave}
//           accumulatedContents={accumulatedContents}
//           isRecording={isRecording}
//           setIsRecording={setIsRecording}
//           onSummaryRequest={handleSummaryRequest}
//         />
//       </div>
//       <div className="w-1/5 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <TextTransformation
//           accumulatedContents={accumulatedContents}
//           isRecording={isRecording}
//           onSummaryRequest={handleSummaryRequest}
//         />
//       </div>
//       <div className="w-3/5 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <GraphicalOutput accumulatedContents={accumulatedContents} />
//       </div>
//     </div>
//   );
// }

///minor bugs
// import React, { useState, useEffect } from "react";
// import AudioToTranscript from "@/components/AudioToTranscript";
// import TextTransformation from "@/components/TextTransformation";
// import TopicMindMap from "@/components/TopicMindMap";

// export default function Home() {
//   const [accumulatedContents, setAccumulatedContents] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);

//   useEffect(() => {
//     fetchContents();
//   }, []);

//   useEffect(() => {
//     console.log("accumulatedContents updated:", accumulatedContents);
//   }, [accumulatedContents]);

//   const fetchContents = async () => {
//     try {
//       console.log("Fetching contents...");
//       const response = await fetch("/api/get-transcripts");
//       if (!response.ok) {
//         throw new Error("Failed to fetch contents");
//       }
//       const data = await response.json();
//       console.log("Fetched contents:", data);
//       setAccumulatedContents(data);
//     } catch (error) {
//       console.error("Error fetching contents:", error);
//     }
//   };

//   const handleContentSave = (newContent) => {
//     setAccumulatedContents((prev) => [...prev, newContent]);
//   };

//   const handleSummaryRequest = async () => {
//     console.log("Summary request initiated");
//     try {
//       if (accumulatedContents.length === 0) {
//         console.log("No content available for summarization");
//         throw new Error("No content available for summarization");
//       }

//       console.log("Sending summary request to API");
//       const response = await fetch("/api/periodic-summary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contents: accumulatedContents }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch summary");
//       }

//       const data = await response.json();
//       console.log("Summary received:", data.summary);
//       return data.summary;
//     } catch (error) {
//       console.error("Error fetching summary:", error);
//       throw error;
//     }
//   };

//   return (
//     <div className="flex h-screen p-4 bg-black space-x-4">
//       <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <AudioToTranscript
//           onContentSave={handleContentSave}
//           accumulatedContents={accumulatedContents}
//           isRecording={isRecording}
//           setIsRecording={setIsRecording}
//           onSummaryRequest={handleSummaryRequest}
//         />
//       </div>
//       <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <TextTransformation
//           accumulatedContents={accumulatedContents}
//           isRecording={isRecording}
//           onSummaryRequest={handleSummaryRequest}
//         />
//       </div>
//       <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <TopicMindMap accumulatedContents={accumulatedContents} />
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import AudioToTranscript from "@/components/AudioToTranscript";
// import TextTransformation from "@/components/TextTransformation";
// import TopicMindMap from "@/components/TopicMindMap";

// export default function Home() {
//   const [accumulatedContents, setAccumulatedContents] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [currentSummary, setCurrentSummary] = useState("");

//   useEffect(() => {
//     fetchContents();
//   }, []);

//   useEffect(() => {
//     console.log("accumulatedContents updated:", accumulatedContents);
//   }, [accumulatedContents]);

//   const fetchContents = async () => {
//     try {
//       console.log("Fetching contents...");
//       const response = await fetch("/api/get-transcripts");
//       if (!response.ok) {
//         throw new Error("Failed to fetch contents");
//       }
//       const data = await response.json();
//       console.log("Fetched contents:", data);
//       setAccumulatedContents(data);
//     } catch (error) {
//       console.error("Error fetching contents:", error);
//     }
//   };

//   const handleContentSave = (newContent) => {
//     setAccumulatedContents((prev) => [...prev, newContent]);
//   };

//   const handleSummaryRequest = async () => {
//     console.log("Summary request initiated");
//     if (accumulatedContents.length === 0) {
//       console.log("No content available for summarization");
//       return "No content available for summarization.";
//     }

//     try {
//       console.log("Sending summary request to API");
//       const response = await fetch("/api/periodic-summary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contents: accumulatedContents }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch summary");
//       }

//       const data = await response.json();
//       console.log("Summary received:", data.summary);
//       return data.summary;
//     } catch (error) {
//       console.error("Error fetching summary:", error);
//       return "Error fetching summary. Please try again later.";
//     }
//   };

//   const handleSummaryUpdate = (newSummary) => {
//     setCurrentSummary(newSummary);
//   };

//   return (
//     <div className="flex h-screen p-4 bg-black space-x-4">
//       <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <AudioToTranscript
//           onContentSave={handleContentSave}
//           accumulatedContents={accumulatedContents}
//           isRecording={isRecording}
//           setIsRecording={setIsRecording}
//           onSummaryRequest={handleSummaryRequest}
//           onSummaryUpdate={handleSummaryUpdate}
//         />
//       </div>
//       <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <TextTransformation
//           accumulatedContents={accumulatedContents}
//           isRecording={isRecording}
//           onSummaryRequest={handleSummaryRequest}
//           currentSummary={currentSummary}
//         />
//       </div>
//       <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
//         <TopicMindMap accumulatedContents={accumulatedContents} />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import AudioToTranscript from "@/components/AudioToTranscript";
import TextTransformation from "@/components/TextTransformation";
import GraphicalOutput from "@/components/GraphicalOutput";

export default function Home() {
  const [accumulatedContents, setAccumulatedContents] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSummary, setCurrentSummary] = useState("");

  useEffect(() => {
    fetchContents();
  }, []);

  // useEffect(() => {
  //   console.log("accumulatedContents updated:", accumulatedContents);
  // }, [accumulatedContents]);

  useEffect(() => {
    console.log("accumulatedContents updated:", accumulatedContents);
    if (accumulatedContents.length > 0) {
      handleSummaryRequest();
    }
  }, [accumulatedContents]);

  const fetchContents = async () => {
    try {
      console.log("Fetching contents...");
      const response = await fetch("/api/get-transcripts");
      if (!response.ok) {
        throw new Error("Failed to fetch contents");
      }
      const data = await response.json();
      console.log("Fetched contents:", data);
      setAccumulatedContents(data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const handleContentSave = (newContent) => {
    setAccumulatedContents((prev) => [...prev, newContent]);
  };

  const handleSummaryRequest = async () => {
    console.log("Summary request initiated");
    if (accumulatedContents.length === 0) {
      console.log("No content available for summarization");
      return "No content available for summarization.";
    }

    try {
      console.log("Sending summary request to API");
      const response = await fetch("/api/periodic-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: accumulatedContents }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch summary");
      }

      const data = await response.json();
      console.log("Summary received:", data.summary);
      setCurrentSummary(data.summary); //update the current summary
      return data.summary;
    } catch (error) {
      console.error("Error fetching summary:", error);
      return "Error fetching summary. Please try again later.";
    }
  };

  const handleSummaryUpdate = (newSummary) => {
    console.log("Updating summary:", newSummary);
    setCurrentSummary(newSummary);
  };

  return (
    <div className="flex h-screen p-4 bg-black space-x-4">
      <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
        <AudioToTranscript
          onContentSave={handleContentSave}
          accumulatedContents={accumulatedContents}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onSummaryRequest={handleSummaryRequest}
          onSummaryUpdate={handleSummaryUpdate}
        />
      </div>
      <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
        <TextTransformation
          accumulatedContents={accumulatedContents}
          isRecording={isRecording}
          onSummaryRequest={handleSummaryRequest}
          currentSummary={currentSummary}
        />
      </div>
      <div className="w-1/3 p-4 overflow-y-auto border-2 border-amber-500 rounded-lg bg-black custom-scrollbar">
        <GraphicalOutput accumulatedContents={accumulatedContents} />
      </div>
    </div>
  );
}
