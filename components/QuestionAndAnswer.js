import React, { useState } from "react";

export default function QuestionAndAnswer({
  onContextAdd,
  accumulatedContents,
}) {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newContext, setNewContext] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newContext,
          contents: accumulatedContents,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContext = async (e) => {
    e.preventDefault();
    if (newContext.trim()) {
      setIsLoading(true);
      setSaveSuccess(false);
      setError("");
      try {
        const response = await fetch("/api/save-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: newContext.trim(),
            type: "typed",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to save context");
        }
        const data = await response.json();
        onContextAdd({
          id: data.id,
          content: newContext.trim(),
          type: "typed",
        });
        setNewContext("");
        setSaveSuccess(true);
      } catch (error) {
        console.error("Error saving context:", error);
        setError("Failed to save context");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl text-cyan-500 font-semibold">
        Add Context or Ask Question
      </h3>
      <form onSubmit={handleAddContext} className="space-y-2">
        <textarea
          value={newContext}
          onChange={(e) => setNewContext(e.target.value)}
          placeholder="Add context or type your question"
          className="w-full p-2 border border-gray-800 bg-black rounded text-sm text-gray-400"
          rows={4}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-3 py-1 text-amber-300 rounded text-sm transition-colors duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-700 bg-opacity-70 hover:bg-violet-700"
          }`}
        >
          {isLoading ? "Saving..." : "Add Context"}
        </button>
      </form>
      {saveSuccess && (
        <p className="text-green-500">Context saved successfully!</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading || newContext.trim() === ""}
        className={`px-3 py-1 text-amber-300 rounded text-sm transition-colors duration-300 ${
          isLoading || newContext.trim() === ""
            ? "bg-gray-900  text-gray-400 cursor-not-allowed"
            : "bg-violet-700 bg-opacity-70 hover:bg-violet-700"
        }`}
      >
        {isLoading ? "Processing..." : "Ask GPT"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {answer && (
        <div className="bg-amber-100 p-3 rounded-lg">
          <h4 className="text-xl text-red-600 font-semibold mb-2">
            GPT Answer:
          </h4>
          <p className="text-sm text-red-500 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}
