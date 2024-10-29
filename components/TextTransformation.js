import React, { useState, useEffect, useCallback } from "react";

export default function TextTransformation({
  accumulatedContents,
  onSummaryRequest,
  currentSummary,
}) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasContents, setHasContents] = useState(false);
  const [actionItems, setActionItems] = useState([]);

  useEffect(() => {
    setHasContents(accumulatedContents.length > 0);
  }, [accumulatedContents]);

  useEffect(() => {
    if (currentSummary) {
      setSummary(currentSummary);
      extractActionItems(currentSummary);
    }
  }, [currentSummary]);

  const handleSummaryRequest = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const newSummary = await onSummaryRequest(accumulatedContents);
      setSummary(newSummary);
      extractActionItems(newSummary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch summary");
    } finally {
      setIsLoading(false);
    }
  }, [onSummaryRequest, accumulatedContents]);

  const extractActionItems = (summaryText) => {
    const actionItemRegex =
      /\[(.*?)\] \(by (.*?), (.*?)\) \[id: (.*?)\]\[Status: (.*?)\]/g;
    const items = [];
    let match;
    while ((match = actionItemRegex.exec(summaryText)) !== null) {
      items.push({
        task: match[1],
        responsibility: match[2],
        deadline: match[3],
        id: match[4],
        status: match[5],
      });
    }
    setActionItems(items);
  };

  const updateActionItem = (index, field, value) => {
    const updatedItems = [...actionItems];
    updatedItems[index][field] = value;
    setActionItems(updatedItems);
    updateSummaryText(updatedItems);
  };

  const updateSummaryText = (updatedItems) => {
    let newSummary = summary;
    updatedItems.forEach((item) => {
      const regex = new RegExp(
        `\\[(.*?)\\] \\(by .*?, .*?\\) \\[id: ${item.id}\\]\\[Status: .*?\\]`
      );
      newSummary = newSummary.replace(
        regex,
        `[${item.task}] (by ${item.responsibility}, ${item.deadline}) [id: ${item.id}][Status: ${item.status}]`
      );
    });
    setSummary(newSummary);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-red-500";
      case "in progress":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-white";
    }
  };

  const renderActionItems = () => {
    return actionItems.map((item, index) => (
      <div key={item.id || index} className="mb-2 p-2 bg-gray-800 rounded">
        <input
          type="text"
          value={item.task}
          onChange={(e) => updateActionItem(index, "task", e.target.value)}
          className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 mb-1"
        />
        <div className="flex items-center mt-1 space-x-2">
          <select
            value={item.status}
            onChange={(e) => updateActionItem(index, "status", e.target.value)}
            className={`bg-gray-700 text-sm rounded px-2 py-1 ${getStatusColor(
              item.status
            )}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            value={item.responsibility}
            onChange={(e) =>
              updateActionItem(index, "responsibility", e.target.value)
            }
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 flex-grow"
            placeholder="Responsible party"
          />
          <input
            type="text"
            value={item.deadline}
            onChange={(e) =>
              updateActionItem(index, "deadline", e.target.value)
            }
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 w-32"
            placeholder="Deadline"
          />
        </div>
      </div>
    ));
  };

  const removeMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/^#+\s*/gm, "")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^>\s*/gm, "")
      .replace(/^\s*[-+*]\s/gm, "")
      .replace(/^\s*\d+\.\s/gm, "")
      .trim();
  };

  const formatContent = (content, isMainTopics = false, isAbstract = false) => {
    const cleanContent = removeMarkdown(content);
    return cleanContent.split("\n").map((line, index) => {
      const parts = line.split(":");
      if (parts.length > 1) {
        return (
          <React.Fragment key={`content-${index}`}>
            <p className={`mb-1 ${isAbstract ? "text-justify" : ""}`}>
              <strong className="text-violet-200">{parts[0]}:</strong>{" "}
              <span className="text-gray-300">
                {parts.slice(1).join(":").trim()}
              </span>
            </p>
            {isMainTopics && <hr className="border-gray-600 my-2" />}
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={`content-${index}`}>
          <p
            className={`mb-1 text-gray-300 ${isAbstract ? "text-justify" : ""}`}
          >
            {line}
          </p>
          {isMainTopics && <hr className="border-gray-600 my-2" />}
        </React.Fragment>
      );
    });
  };

  const renderSummarySection = (title, content) => {
    if (!content) return null;
    const isMainTopics = title.toLowerCase().includes("main topics and goals");
    const isAbstract = title.toLowerCase().includes("abstract");
    if (title.toLowerCase().includes("action items")) {
      return (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-violet-400 mb-2">
            {removeMarkdown(title)}
          </h3>
          {renderActionItems()}
        </div>
      );
    }
    return (
      <div className="mb-4">
        <h3
          className={`text-lg font-semibold text-violet-400 mb-2 ${
            isAbstract ? "text-center" : ""
          }`}
        >
          {removeMarkdown(title)}
        </h3>
        <div
          className={`bg-gray-800 p-3 rounded shadow-inner ${
            isAbstract ? "mx-auto max-w-2xl" : ""
          }`}
        >
          <div className="text-sm space-y-1">
            {formatContent(content, isMainTopics, isAbstract)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              hasContents ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-300">
            {hasContents
              ? "Content available for summarization"
              : "No content available"}
          </span>
        </div>
        <button
          onClick={handleSummaryRequest}
          disabled={isLoading || !hasContents}
          className={`px-3 py-1 text-amber-300 rounded text-sm transition-colors duration-300  ${
            isLoading || !hasContents
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-violet-700 bg-opacity-70 hover:bg-violet-700 "
          }`}
        >
          {isLoading ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {summary && (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
          {summary.split(/\d+\./).map((section, index) => {
            if (index === 0) return null;
            const [title, ...content] = section.split(":");
            return renderSummarySection(title.trim(), content.join(":").trim());
          })}
        </div>
      )}
    </div>
  );
}
