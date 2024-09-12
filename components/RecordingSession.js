// import React, { useState, useCallback, useEffect, useRef } from "react";
// import LiveAudioTranscription from "./LiveAudioTranscript";

// const RecordingSession = ({
//   onTranscriptSave,
//   currentTranscript,
//   setCurrentTranscript,
//   onSummaryRequest,
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingStartTime, setRecordingStartTime] = useState(null);
//   const fullTranscriptRef = useRef("");
//   const saveIntervalRef = useRef(null);

//   const handleTranscriptChange = useCallback(
//     (newTranscript) => {
//       fullTranscriptRef.current += " " + newTranscript;
//       setCurrentTranscript((prev) => (prev + " " + newTranscript).trim());
//     },
//     [setCurrentTranscript]
//   );

//   const startRecording = () => {
//     setIsRecording(true);
//     setRecordingStartTime(Date.now());
//     fullTranscriptRef.current = "";
//     // Start periodic saving and summarizing
//     saveIntervalRef.current = setInterval(() => {
//       saveTranscript();
//       console.log("Attempting to trigger summary request");
//       onSummaryRequest();
//     }, 60000); // Every minute
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//     saveTranscript();
//     // Stop periodic saving and summarizing
//     if (saveIntervalRef.current) {
//       clearInterval(saveIntervalRef.current);
//     }
//   };

//   // const saveTranscript = async () => {
//   //   const transcriptToSave = fullTranscriptRef.current.trim();
//   //   if (transcriptToSave) {
//   //     try {
//   //       const response = await fetch("/api/save-transcript", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({
//   //           transcript: transcriptToSave,
//   //           type: "transcribed",
//   //         }),
//   //       });
//   //       if (!response.ok) {
//   //         throw new Error("Failed to save transcript");
//   //       }
//   //       const data = await response.json();
//   //       onTranscriptSave(data);
//   //       fullTranscriptRef.current = ""; // Clear the transcript after saving
//   //       console.log("Transcript saved successfully");
//   //     } catch (error) {
//   //       console.error("Error saving transcript:", error);
//   //     }
//   //   }
//   // };
//   const saveTranscript = async () => {
//     const transcriptToSave = fullTranscriptRef.current.trim();
//     if (transcriptToSave) {
//       try {
//         onTranscriptSave({
//           transcript: transcriptToSave,
//           type: "transcribed",
//         });
//         fullTranscriptRef.current = ""; // Clear the transcript after saving
//         console.log("Transcript saved successfully");
//       } catch (error) {
//         console.error("Error saving transcript:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (saveIntervalRef.current) {
//         clearInterval(saveIntervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={isRecording ? stopRecording : startRecording}
//           className={`px-2 py-1 text-sm text-white rounded ${
//             isRecording
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-600 hover:bg-green-500"
//           } transition-colors duration-300`}
//         >
//           {isRecording ? "Stop" : "Start"}
//         </button>
//         {isRecording && (
//           <span className="text-xs text-gray-600">
//             {Math.floor((Date.now() - recordingStartTime) / 60000)} min
//           </span>
//         )}
//       </div>

//       <div className="bg-gray-100 p-2 rounded-lg text-sm">
//         <LiveAudioTranscription
//           onTranscriptChange={handleTranscriptChange}
//           isRecording={isRecording}
//         />
//       </div>

//       <textarea
//         value={currentTranscript}
//         onChange={(e) => setCurrentTranscript(e.target.value)}
//         className="w-full p-2 border rounded text-gray-800 bg-white text-sm"
//         rows={3}
//       />
//     </div>
//   );
// };

// export default RecordingSession;

// ///WROKING with bugs

// import React, { useState, useCallback, useEffect, useRef } from "react";
// import LiveAudioTranscription from "./LiveAudioTranscript";

// const RecordingSession = ({
//   onTranscriptSave,
//   currentTranscript,
//   setCurrentTranscript,
//   isRecording,
//   setIsRecording,
//   onSummaryRequest,
// }) => {
//   const [recordingStartTime, setRecordingStartTime] = useState(null);
//   const fullTranscriptRef = useRef("");
//   const lastSavedTranscriptRef = useRef("");
//   const saveIntervalRef = useRef(null);

//   const handleTranscriptChange = useCallback(
//     (newTranscript) => {
//       fullTranscriptRef.current += " " + newTranscript;
//       setCurrentTranscript((prev) => (prev + " " + newTranscript).trim());
//     },
//     [setCurrentTranscript]
//   );

//   const startRecording = () => {
//     setIsRecording(true);
//     setRecordingStartTime(Date.now());
//     fullTranscriptRef.current = "";
//     lastSavedTranscriptRef.current = "";
//     // Start periodic saving and summarizing
//     saveIntervalRef.current = setInterval(() => {
//       saveTranscript();
//       onSummaryRequest();
//     }, 60000); // Every minute
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//     saveTranscript();
//     // Stop periodic saving and summarizing
//     if (saveIntervalRef.current) {
//       clearInterval(saveIntervalRef.current);
//     }
//   };

//   const saveTranscript = async () => {
//     const newTranscript = fullTranscriptRef.current
//       .substring(lastSavedTranscriptRef.current.length)
//       .trim();
//     if (newTranscript) {
//       try {
//         await onTranscriptSave({
//           transcript: newTranscript,
//           type: "transcribed",
//         });
//         console.log("New transcript saved successfully");
//         lastSavedTranscriptRef.current = fullTranscriptRef.current;
//       } catch (error) {
//         console.error("Error saving transcript:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (saveIntervalRef.current) {
//         clearInterval(saveIntervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={isRecording ? stopRecording : startRecording}
//           className={`px-2 py-1 text-sm text-white rounded ${
//             isRecording
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-600 hover:bg-green-500"
//           } transition-colors duration-300`}
//         >
//           {isRecording ? "Stop" : "Start"}
//         </button>
//         {isRecording && (
//           <span className="text-xs text-gray-600">
//             {Math.floor((Date.now() - recordingStartTime) / 60000)} min
//           </span>
//         )}
//       </div>

//       <div className="bg-gray-100 p-2 rounded-lg text-sm">
//         <LiveAudioTranscription
//           onTranscriptChange={handleTranscriptChange}
//           isRecording={isRecording}
//         />
//       </div>

//       <textarea
//         value={currentTranscript}
//         onChange={(e) => setCurrentTranscript(e.target.value)}
//         className="w-full p-2 border rounded text-gray-800 bg-white text-sm"
//         rows={3}
//       />
//     </div>
//   );
// };

// export default RecordingSession;

////ALMOST there////

// import React, { useState, useCallback, useEffect, useRef } from "react";
// import LiveAudioTranscription from "./LiveAudioTranscript";

// const RecordingSession = ({
//   onTranscriptSave,
//   currentTranscript,
//   setCurrentTranscript,
//   isRecording,
//   setIsRecording,
//   onSummaryRequest,
//   onSummaryUpdate,
// }) => {
//   const [recordingStartTime, setRecordingStartTime] = useState(null);
//   const fullTranscriptRef = useRef("");
//   const lastSavedTranscriptRef = useRef("");
//   const saveIntervalRef = useRef(null);

//   const handleTranscriptChange = useCallback(
//     (newTranscript) => {
//       if (isRecording) {
//         fullTranscriptRef.current += " " + newTranscript;
//         setCurrentTranscript((prev) => (prev + " " + newTranscript).trim());
//         console.log("New transcript received:", newTranscript);
//       }
//     },
//     [setCurrentTranscript, isRecording]
//   );

//   const startRecording = () => {
//     setIsRecording(true);
//     setRecordingStartTime(Date.now());
//     fullTranscriptRef.current = "";
//     lastSavedTranscriptRef.current = "";
//     // Start periodic saving and summarizing
//     saveIntervalRef.current = setInterval(() => {
//       saveTranscript();
//     }, 60000); // Every minute
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//     saveTranscript();
//     // Stop periodic saving
//     if (saveIntervalRef.current) {
//       clearInterval(saveIntervalRef.current);
//     }
//   };

//   const saveTranscript = async () => {
//     const newTranscript = fullTranscriptRef.current
//       .substring(lastSavedTranscriptRef.current.length)
//       .trim();
//     if (newTranscript) {
//       try {
//         await onTranscriptSave({
//           transcript: newTranscript,
//           type: "transcribed",
//         });
//         console.log("New transcript saved successfully:", newTranscript);
//         lastSavedTranscriptRef.current = fullTranscriptRef.current;
//         // Trigger summary request after saving transcript
//         const summary = await onSummaryRequest();
//         console.log("Summary after saving transcript:", summary);
//         if (onSummaryUpdate) {
//           onSummaryUpdate(summary);
//         }
//       } catch (error) {
//         console.error("Error saving transcript or getting summary:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (saveIntervalRef.current) {
//         clearInterval(saveIntervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={isRecording ? stopRecording : startRecording}
//           className={`px-2 py-1 text-sm text-white rounded ${
//             isRecording
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-600 hover:bg-green-500"
//           } transition-colors duration-300`}
//         >
//           {isRecording ? "Stop" : "Start"}
//         </button>
//         {isRecording && (
//           <span className="text-xs text-gray-600">
//             {Math.floor((Date.now() - recordingStartTime) / 60000)} min
//           </span>
//         )}
//       </div>

//       <div className="bg-gray-100 p-2 rounded-lg text-sm">
//         <LiveAudioTranscription
//           onTranscriptChange={handleTranscriptChange}
//           isRecording={isRecording}
//         />
//       </div>

//       <textarea
//         value={currentTranscript}
//         onChange={(e) => setCurrentTranscript(e.target.value)}
//         className="w-full p-2 border rounded text-gray-800 bg-white text-sm"
//         rows={3}
//       />
//     </div>
//   );
// };

// export default RecordingSession;

import React, { useState, useCallback, useEffect, useRef } from "react";
import LiveAudioTranscription from "./LiveAudioTranscript";

const RecordingSession = ({
  onTranscriptSave,
  currentTranscript,
  setCurrentTranscript,
  isRecording,
  setIsRecording,
  onSummaryRequest,
  onSummaryUpdate,
}) => {
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const fullTranscriptRef = useRef("");
  const lastSavedTranscriptRef = useRef("");
  const saveIntervalRef = useRef(null);

  const handleTranscriptChange = useCallback(
    (newTranscript) => {
      if (isRecording) {
        fullTranscriptRef.current += " " + newTranscript;
        setCurrentTranscript((prev) => (prev + " " + newTranscript).trim());
        console.log("New transcript received:", newTranscript);
      }
    },
    [setCurrentTranscript, isRecording]
  );

  const startRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    fullTranscriptRef.current = "";
    lastSavedTranscriptRef.current = "";
    // Start periodic saving
    saveIntervalRef.current = setInterval(saveTranscript, 30000); // Every 30 seconds
  };

  const stopRecording = () => {
    setIsRecording(false);
    saveTranscript();
    // Stop periodic saving
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
  };

  const saveTranscript = async () => {
    const newTranscript = fullTranscriptRef.current
      .substring(lastSavedTranscriptRef.current.length)
      .trim();
    if (newTranscript) {
      try {
        await onTranscriptSave({
          transcript: newTranscript,
          type: "transcribed",
        });
        console.log("New transcript saved successfully:", newTranscript);
        lastSavedTranscriptRef.current = fullTranscriptRef.current;

        // Request summary after saving new content
        requestSummary();
      } catch (error) {
        console.error("Error saving transcript:", error);
      }
    }
  };

  const requestSummary = () => {
    // Trigger the summary request without awaiting it
    onSummaryRequest()
      .then((summary) => {
        console.log("Summary requested:", summary);
        if (onSummaryUpdate) {
          onSummaryUpdate(summary);
        }
      })
      .catch((error) => {
        console.error("Error getting summary:", error);
      });
  };

  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 text-sm text-white rounded ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-violet-700 hover:bg-violet-600"
          } transition-colors duration-300`}
        >
          {isRecording ? "Stop" : "Start"}
        </button>
        {isRecording && (
          <span className="text-xs text-gray-600">
            {Math.floor((Date.now() - recordingStartTime) / 60000)} min
          </span>
        )}
      </div>

      <div className="bg-gray-900 p-2 rounded-lg text-sm">
        <LiveAudioTranscription
          onTranscriptChange={handleTranscriptChange}
          isRecording={isRecording}
        />
      </div>

      <textarea
        value={currentTranscript}
        onChange={(e) => setCurrentTranscript(e.target.value)}
        className="w-full p-2 border border-gray-800 rounded text-gray-400 bg-black text-sm"
        rows={3}
      />
    </div>
  );
};

export default RecordingSession;
