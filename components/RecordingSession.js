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
    saveIntervalRef.current = setInterval(saveTranscript, 90000); // Every 90 seconds
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
          className={`px-3 py-1 text-sm text-white rounded ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-violet-600 hover:bg-violet-700"
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
