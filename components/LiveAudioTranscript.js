// import React, { useState, useEffect, useRef } from "react";

// const LiveAudioTranscription = ({ onTranscriptChange, isRecording }) => {
//   const recognitionRef = useRef(null);
//   const [interimTranscript, setInterimTranscript] = useState("");

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window) {
//       recognitionRef.current = new window.webkitSpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;

//       recognitionRef.current.onresult = (event) => {
//         let finalTranscript = "";
//         let interimTranscript = "";

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript;
//           } else {
//             interimTranscript += event.results[i][0].transcript;
//           }
//         }

//         setInterimTranscript(interimTranscript);
//         if (finalTranscript) {
//           onTranscriptChange(finalTranscript);
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error", event);
//       };
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [onTranscriptChange]);

//   useEffect(() => {
//     if (isRecording) {
//       recognitionRef.current.start();
//     } else {
//       recognitionRef.current.stop();
//     }
//   }, [isRecording]);

//   return (
//     //   <div>{isRecording && <p>Interim: {interimTranscript}</p>}</div>
//     <div>
//       {isRecording && (
//         <div className="bg-white text-red-400 p-3 rounded shadow animate-pulse">
//           <p className="font-semibold">Interim Transcript:</p>
//           <p>{interimTranscript || "Listening..."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveAudioTranscription;

// import React, { useState, useEffect, useRef } from "react";

// const LiveAudioTranscription = ({ onTranscriptChange, isRecording }) => {
//   const recognitionRef = useRef(null);
//   const [interimTranscript, setInterimTranscript] = useState("");
//   const restartIntervalRef = useRef(null);

//   const startRecognition = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.start();
//     }
//   };

//   const stopRecognition = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window) {
//       recognitionRef.current = new window.webkitSpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;

//       recognitionRef.current.onresult = (event) => {
//         let finalTranscript = "";
//         let interimTranscript = "";

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript;
//           } else {
//             interimTranscript += event.results[i][0].transcript;
//           }
//         }

//         setInterimTranscript(interimTranscript);
//         if (finalTranscript) {
//           onTranscriptChange(finalTranscript);
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error", event);
//         if (isRecording) {
//           startRecognition(); // Attempt to restart on error
//         }
//       };
//     }

//     return () => {
//       stopRecognition();
//     };
//   }, [onTranscriptChange]);

//   useEffect(() => {
//     if (isRecording) {
//       startRecognition();
//       // Restart recognition every 4 minutes to prevent automatic stopping
//       restartIntervalRef.current = setInterval(() => {
//         stopRecognition();
//         startRecognition();
//       }, 240000); // 4 minutes
//     } else {
//       stopRecognition();
//       if (restartIntervalRef.current) {
//         clearInterval(restartIntervalRef.current);
//       }
//     }

//     return () => {
//       if (restartIntervalRef.current) {
//         clearInterval(restartIntervalRef.current);
//       }
//     };
//   }, [isRecording]);

//   return (
//     <div>
//       {isRecording && (
//         <div className="bg-white text-red-400 p-3 rounded shadow animate-pulse">
//           <p className="font-semibold">Interim Transcript:</p>
//           <p>{interimTranscript || "Listening..."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveAudioTranscription;

///CURRENTLY WORKING WITH SOME BUGS BUT CAN RECORD FOR 8 MIN
// import React, { useState, useEffect, useRef } from "react";

// const LiveAudioTranscription = ({ onTranscriptChange, isRecording }) => {
//   const recognitionRef = useRef(null);
//   const [interimTranscript, setInterimTranscript] = useState("");
//   const restartTimeoutRef = useRef(null);
//   const isRecognitionActiveRef = useRef(false);

//   const startRecognition = () => {
//     if (recognitionRef.current && !isRecognitionActiveRef.current) {
//       try {
//         recognitionRef.current.start();
//         isRecognitionActiveRef.current = true;
//         console.log("Speech recognition started");
//       } catch (error) {
//         console.error("Error starting speech recognition:", error);
//       }
//     }
//   };

//   const stopRecognition = () => {
//     if (recognitionRef.current && isRecognitionActiveRef.current) {
//       try {
//         recognitionRef.current.stop();
//         isRecognitionActiveRef.current = false;
//         console.log("Speech recognition stopped");
//       } catch (error) {
//         console.error("Error stopping speech recognition:", error);
//       }
//     }
//   };

//   const restartRecognition = () => {
//     stopRecognition();
//     setTimeout(() => {
//       startRecognition();
//     }, 100);
//   };

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window) {
//       recognitionRef.current = new window.webkitSpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;

//       recognitionRef.current.onresult = (event) => {
//         let finalTranscript = "";
//         let interimTranscript = "";

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript;
//           } else {
//             interimTranscript += event.results[i][0].transcript;
//           }
//         }

//         setInterimTranscript(interimTranscript);
//         if (finalTranscript) {
//           onTranscriptChange(finalTranscript);
//         }
//       };

//       recognitionRef.current.onend = () => {
//         console.log("Speech recognition ended");
//         isRecognitionActiveRef.current = false;
//         if (isRecording) {
//           restartRecognition();
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error", event);
//         isRecognitionActiveRef.current = false;
//         if (isRecording) {
//           restartRecognition();
//         }
//       };
//     }

//     return () => {
//       stopRecognition();
//     };
//   }, [onTranscriptChange, isRecording]);

//   useEffect(() => {
//     if (isRecording) {
//       startRecognition();
//       // Restart recognition every 60 seconds to prevent automatic stopping
//       restartTimeoutRef.current = setInterval(() => {
//         restartRecognition();
//       }, 60000);
//     } else {
//       stopRecognition();
//       if (restartTimeoutRef.current) {
//         clearInterval(restartTimeoutRef.current);
//       }
//     }

//     return () => {
//       if (restartTimeoutRef.current) {
//         clearInterval(restartTimeoutRef.current);
//       }
//     };
//   }, [isRecording]);

//   return (
//     <div>
//       {isRecording && (
//         <div className="bg-white text-red-400 p-3 rounded shadow animate-pulse">
//           <p className="font-semibold">Interim Transcript:</p>
//           <p>{interimTranscript || "Listening..."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveAudioTranscription;

import React, { useState, useEffect, useRef } from "react";

const LiveAudioTranscription = ({ onTranscriptChange, isRecording }) => {
  const recognitionRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const restartTimeoutRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);
  const shouldRestartRef = useRef(true);

  const startRecognition = () => {
    if (recognitionRef.current && !isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.start();
        isRecognitionActiveRef.current = true;
        shouldRestartRef.current = true;
        console.log("Speech recognition started");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        isRecognitionActiveRef.current = false;
      }
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        isRecognitionActiveRef.current = false;
        shouldRestartRef.current = false;
        console.log("Speech recognition stopped");
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
  };

  const restartRecognition = () => {
    stopRecognition();
    restartTimeoutRef.current = setTimeout(() => {
      if (isRecording) {
        startRecognition();
      }
    }, 100);
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interimTranscript);
        if (finalTranscript) {
          onTranscriptChange(finalTranscript);
        }
      };

      // recognitionRef.current.onend = () => {
      //   console.log("Speech recognition ended");
      //   isRecognitionActiveRef.current = false;
      //   if (isRecording) {
      //     restartRecognition();
      //   }
      // };
      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        isRecognitionActiveRef.current = false;
        if (shouldRestartRef.current && isRecording) {
          console.log("Attempting to restart speech recognition");
          startRecognition();
        } else {
          console.log("Not restarting speech recognition");
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
        isRecognitionActiveRef.current = false;
        if (isRecording) {
          restartRecognition();
        }
      };
    }

    return () => {
      stopRecognition();
    };
  }, [onTranscriptChange, isRecording]);

  useEffect(() => {
    if (isRecording) {
      startRecognition();
    } else {
      stopRecognition();
    }
  }, [isRecording]);

  return (
    <div className="bg-amber-500">
      {isRecording && (
        <div className="bg-amber-300 text-red-500 p-3 rounded shadow animate-pulse">
          <p className="font-semibold">Interim Transcript:</p>
          <p>{interimTranscript || "Listening..."}</p>
        </div>
      )}
    </div>
  );
};

export default LiveAudioTranscription;
