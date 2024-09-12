// components/GraphicalOutput.js

import MindMap from "../components/MindMap";
import ImageGenerator from "./ImageGenerator";
import { useState } from "react";

export default function GraphicalOutput({ accumulatedContents }) {
  console.log(
    "GraphicalOutput rendering, accumulatedContents:",
    accumulatedContents
  );
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleImageGenerate = (imageUrl) => {
    setGeneratedImages((prev) => [...prev, imageUrl]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* <h2 className="text-2xl font-bold mb-2">Graphical Output</h2>
      <h4 className="text-xl text-red-500 mb-4">
        Graphical representation of data:
      </h4> */}
      <div className="flex-grow overflow-y-auto">
        {/* <MindMap accumulatedContents={accumulatedContents} /> */}
        <ImageGenerator onImageGenerate={handleImageGenerate} />
        {generatedImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl text-cyan-500 font-semibold mb-2">
              Generated Images
            </h3>
            <div className="space-y-4">
              {generatedImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
