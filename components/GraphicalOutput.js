// components/GraphicalOutput.js
import MindMapDalle from "./MindMapDalle";
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
      <div className="flex-grow overflow-y-auto">
        <MindMapDalle accumulatedContents={accumulatedContents} />
        {/* <MindMap accumulatedContents={accumulatedContents} /> */}
        {/* <ImageGenerator onImageGenerate={handleImageGenerate} />
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
        )} */}
      </div>
    </div>
  );
}
