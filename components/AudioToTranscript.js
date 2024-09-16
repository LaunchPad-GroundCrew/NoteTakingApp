import React, { useState, useCallback } from "react";
import RecordingSession from "./RecordingSession";
import QuestionAndAnswer from "./QuestionAndAnswer";

export default function AudioToTranscript({
  onContentSave,
  accumulatedContents,
  isRecording,
  setIsRecording,
  onSummaryRequest,
  onSummaryUpdate,
}) {
  const [currentTranscript, setCurrentTranscript] = useState("");

  const handleTranscriptSave = useCallback(
    async (newTranscript) => {
      try {
        const response = await fetch("/api/save-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTranscript),
        });
        if (!response.ok) {
          throw new Error("Failed to save transcript");
        }
        const data = await response.json();
        onContentSave(data);
      } catch (error) {
        console.error("Error saving transcript:", error);
      }
    },
    [onContentSave]
  );

  const handleTypedContextSave = useCallback(
    (newContext) => {
      onContentSave(newContext);
    },
    [onContentSave]
  );

  return (
    <div className="space-y-4 px-4">
      <div className="py-0">
        <RecordingSession
          onTranscriptSave={handleTranscriptSave}
          currentTranscript={currentTranscript}
          setCurrentTranscript={setCurrentTranscript}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onSummaryRequest={onSummaryRequest}
          onSummaryUpdate={onSummaryUpdate}
        />
        <QuestionAndAnswer
          onContextAdd={handleTypedContextSave}
          accumulatedContents={accumulatedContents}
        />
      </div>
    </div>
  );
}
