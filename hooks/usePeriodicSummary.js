import React, { useState, useEffect } from "react";

export default function TextTransformation({
  accumulatedTranscripts,
  isRecording,
  onSummaryRequest,
}) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasTranscripts, setHasTranscripts] = useState(false);

  useEffect(() => {
    setHasTranscripts(accumulatedTranscripts.length > 0);
  }, [accumulatedTranscripts]);

  const handleSummaryRequest = async () => {
    setIsLoading(true);
    setError("");

    try {
      const newSummary = await onSummaryRequest();
      setSummary(newSummary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Text Transformation</h2>
      <button
        onClick={handleSummaryRequest}
        disabled={isLoading || !hasTranscripts}
        className="px-4 py-2 bg-blue-500 text-white rounded text-sm disabled:bg-gray-400 hover:bg-blue-600 transition-colors duration-300 mb-4"
      >
        {isLoading ? "Generating Summary..." : "Generate Summary"}
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {hasTranscripts ? (
        <p className="text-green-500 mb-4">
          Transcripts available for summarization
        </p>
      ) : (
        <p className="text-yellow-500 mb-4">No transcripts available yet</p>
      )}
      {summary && (
        <div className="mt-4">
          <h4 className="text-2xl text-red-500 mb-2">Abstract and Outline:</h4>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
