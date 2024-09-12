import React, { useState } from "react";

const ImageGenerator = ({ onImageGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      onImageGenerate(data.imageUrl);
      setPrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl text-cyan-500 font-semibold">Generate Image</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate"
          className="w-full p-2 border border-gray-800 bg-black rounded text-sm text-gray-400"
          rows={4}
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className={`px-4 py-2 text-white rounded text-sm transition-colors duration-300 ${
            isGenerating || !prompt.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-700 hover:bg-violet-600"
          }`}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </button>
      </form>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default ImageGenerator;
