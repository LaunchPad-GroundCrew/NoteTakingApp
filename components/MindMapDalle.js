import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Panel,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEntitiesRelationships } from "../hooks/useEntitiesRelationships";

const customStyles = `
  .react-flow__attribution {
    background: transparent;
    color: rgba(255, 255, 255, 0.3);
  }
  .react-flow__attribution a {
    color: rgba(255, 255, 255, 0.3);
  }
  .react-flow__node {
    font-size: 22px;
    width: auto;
    padding: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .react-flow__node-default {
    border-radius: 8px;
  }
  .react-flow__edge-text {
    font-size: 18px;
    fill: #333333 !important;
  }
  .react-flow__edge-textbg {
    fill: #FFE752;
  }
  .react-flow__renderer {
    background: transparent !important;
  }
  .background-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;
  }
  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mindmap-container {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .mindmap-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

const MindMapDalle = ({ accumulatedContents }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { analysis, loading, error, triggerAnalysis } =
    useEntitiesRelationships(accumulatedContents);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const containerRef = useRef(null);
  const [imageRequested, setImageRequested] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getNodeColor = (level) => {
    const colors = [
      "rgba(255, 82, 187, 0.7)", // Reddish
      "rgba(76, 230, 188, 0.7)", // Light greenblue
      "rgba(0, 240, 255, 0.7)", // Blueish
      "rgba(0, 157, 255, 0.7", // sky blue
    ];
    return colors[level % colors.length];
  };

  const createRadialLayout = useCallback((roots) => {
    const nodes = [];
    const edges = [];
    const centerX = 500;
    const centerY = 270;
    const radiusStep = 180;

    const createNode = (entity, x, y, level) => {
      return {
        id: entity.id,
        type: "default",
        data: { label: entity.text },
        position: { x, y },
        style: {
          backgroundColor: getNodeColor(level),
          color: level === 0 ? "#FFFFFF" : "#000000",
          fontSize: level === 0 ? "32px" : "32px",
          fontWeight: level === 0 ? "bold" : "normal",
          padding: "1px",
          width: "auto",
          minWidth: "180px",
          maxWidth: "250px",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      };
    };

    const processLevel = (entities, parentId, startAngle, endAngle, level) => {
      const angleStep = (endAngle - startAngle) / entities.length;

      entities.forEach((entity, index) => {
        const angle = startAngle + angleStep * (index + 0.5);
        const radius = (level + 1) * radiusStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const node = createNode(entity, x, y, level);
        nodes.push(node);

        if (parentId) {
          edges.push({
            id: `${parentId}-${entity.id}`,
            source: parentId,
            target: entity.id,
            type: "default",
            animated: true,
            style: {
              stroke: getNodeColor(level - 1),
              strokeWidth: 10,
            },
          });
        }

        if (entity.children) {
          processLevel(
            entity.children,
            entity.id,
            angle - angleStep / 2,
            angle + angleStep / 2,
            level + 1
          );
        }
      });
    };

    processLevel(roots, null, 0, 2 * Math.PI, 0);

    return { nodes, edges };
  }, []);

  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");

  //     return `Create an image with a very dark, nearly black center occupying about 60% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles. The halo should be based on the following sentiment and concepts: ${topics}. The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes and vivid colors that reflect the overall sentiment (use warm, bright colors for positive sentiment; cool, muted colors for negative sentiment). Include abstract shapes or symbolic elements related to the topics in the halo. Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border that tells a story about the content's mood and themes.`;
  //   }, [nodes]);

  //   const generateImage = useCallback(async () => {
  //     setIsGeneratingImage(true);
  //     const prompt = generateImagePrompt();
  //     try {
  //       const response = await fetch("/api/generate-image", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ prompt }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to generate image");
  //       }

  //       const data = await response.json();
  //       setBackgroundImageUrl(data.imageUrl);
  //     } catch (error) {
  //       console.error("Error generating image:", error);
  //       setImageRequested(false); // Reset the state to allow another attempt
  //     } finally {
  //       setIsGeneratingImage(false);
  //     }
  //   }, [generateImagePrompt]);

  //   useEffect(() => {
  //     if (
  //       analysis &&
  //       nodes.length > 0 &&
  //       !backgroundImageUrl &&
  //       !imageRequested
  //     ) {
  //       setImageRequested(true);
  //       generateImage();
  //     }
  //   }, [analysis, nodes, backgroundImageUrl, imageRequested, generateImage]);

  useEffect(() => {
    if (
      analysis &&
      nodes.length > 0 &&
      !backgroundImageUrl &&
      !imageRequested
    ) {
      setImageRequested(true);
      //   generateImage(); add later
    }
  }, [analysis, nodes, backgroundImageUrl, imageRequested]);

  useEffect(() => {
    if (!analysis || !analysis.roots) return;

    try {
      const { nodes: layoutNodes, edges: layoutEdges } = createRadialLayout(
        analysis.roots
      );

      const validNodeIds = new Set(layoutNodes.map((node) => node.id));

      const relationshipEdges = analysis.relationships
        .filter(
          (relation) =>
            validNodeIds.has(relation.source) &&
            validNodeIds.has(relation.target)
        )
        .map((relation, index) => ({
          id: `relation-${index}`,
          source: relation.source,
          target: relation.target,
          label: relation.type,
          type: "default",
          animated: true,
          style: {
            stroke: "#FFE752",
            strokeWidth: 6,
          },
          labelStyle: { fill: "#333333", fontWeight: 600, fontSize: 28 },
          labelBgStyle: { fill: "#FFE752" },
          labelBgPadding: [6, 4],
          labelBgBorderRadius: 4,
        }));

      setNodes(layoutNodes);
      setEdges([...layoutEdges, ...relationshipEdges]);
    } catch (err) {
      console.error("Error processing analysis data:", err);
    }
  }, [analysis, setNodes, setEdges, createRadialLayout]);

  const handleReanalyze = () => {
    triggerAnalysis();
    setBackgroundImageUrl(""); // Clear the current background to trigger a new generation
    setImageRequested(false); // Reset the state to allow a new image generation
  };

  const minimapNodeColor = useCallback((node) => {
    return node.style.backgroundColor;
  }, []);

  const reactFlowInstance = useMemo(
    () => (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultZoom={0.5}
        style={{ background: "transparent", zIndex: 1 }}
      >
        <Controls style={{ backgroundColor: "white", color: "black" }} />
        <Panel
          position="top-left"
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <button
            onClick={handleReanalyze}
            className={`text-white text-sm py-2 px-4 rounded ${
              loading || isGeneratingImage
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={loading || isGeneratingImage}
          >
            {loading
              ? "Analyzing..."
              : isGeneratingImage
              ? "Generating Image..."
              : "Re-analyze"}
          </button>
          {(loading || isGeneratingImage) && (
            <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              {loading ? "Analyzing..." : "Generating Image..."}
            </div>
          )}
        </Panel>
      </ReactFlow>
    ),
    [
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      loading,
      isGeneratingImage,
      handleReanalyze,
    ]
  );

  return (
    <div className="mindmap-wrapper" ref={containerRef}>
      <style>{customStyles}</style>
      <div className="background-container">
        {backgroundImageUrl && (
          <img
            src={backgroundImageUrl}
            alt="Background"
            className="background-image"
          />
        )}
      </div>
      <div className="mindmap-container">{reactFlowInstance}</div>
      {error && (
        <div className="absolute bottom-0 left-0 w-full bg-red-100 text-red-700 p-2 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default MindMapDalle;
