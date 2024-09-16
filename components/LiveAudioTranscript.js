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
