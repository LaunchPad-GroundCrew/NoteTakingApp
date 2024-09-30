import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useEntitiesRelationshipsSentiment = (accumulatedContents) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeContent = useCallback(
    async (retryCount = 0) => {
      if (accumulatedContents.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/entities-relationships-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: accumulatedContents }),
          timeout: 60000, // 60 seconds timeout
        });

        if (!response.ok) {
          throw new Error("Failed to analyze content");
        }

        const data = await response.json();

        // Validate the new data structure
        if (
          !data.roots ||
          !Array.isArray(data.roots) ||
          !data.relationships ||
          !Array.isArray(data.relationships) ||
          !data.sentiment ||
          typeof data.sentiment.score !== "number" ||
          typeof data.sentiment.explanation !== "string"
        ) {
          throw new Error("Invalid response structure from API");
        }

        setAnalysis(data);
      } catch (err) {
        console.error("Error in analyzeContent:", err);
        if (retryCount < MAX_RETRIES) {
          console.log(
            `Retrying analysis (${retryCount + 1}/${MAX_RETRIES})...`
          );
          setTimeout(() => analyzeContent(retryCount + 1), RETRY_DELAY);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [accumulatedContents]
  );

  const debouncedAnalyzeContent = useCallback(debounce(analyzeContent, 100), [
    analyzeContent,
  ]);

  useEffect(() => {
    debouncedAnalyzeContent();
  }, [debouncedAnalyzeContent]);

  const triggerAnalysis = useCallback(() => {
    analyzeContent();
  }, [analyzeContent]);

  return { analysis, loading, error, triggerAnalysis };
};
