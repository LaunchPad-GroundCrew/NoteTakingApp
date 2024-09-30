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
import { useEntitiesRelationshipsSentiment } from "@/hooks/useEntititesRelationshipsSentiment";

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
  .sentiment-indicator {
    position: absolute;
    bottom: 20px;
    left: 275px;
    background-color: rgba(0, 0, 0, 0.7);
    color: orange;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    z-index: 1000;
  }
  .sentiment-tooltip {
    position: absolute;
    bottom: 50px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    max-width: 250px;
    z-index: 1001;
  }
`;

const MindMapDalle = ({ accumulatedContents }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { analysis, loading, error, triggerAnalysis } =
    useEntitiesRelationshipsSentiment(accumulatedContents);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const containerRef = useRef(null);
  const [imageRequested, setImageRequested] = useState(false);
  const [showSentimentTooltip, setShowSentimentTooltip] = useState(false);

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

  // const generateImagePrompt = useCallback(() => {
  //   const topics = nodes.map(node => node.data.label).join(", ");
  //   return `Abstract visualization of interconnected concepts: ${topics}. Style: Ethereal, colorful, with subtle connections between elements.`;
  // }, [nodes]);
  // const generateImagePrompt = useCallback(() => {
  //   const topics = nodes.map((node) => node.data.label).join(", ");
  //   return `Create a soft, monochromatic black or dark gray-toned background inspired by Leonardo da Vinci's sketches, particularly his Vitruvian Man. The image should be mostly black or dark gray with gray or darkbrown outlines and should subtly represent the following concepts: ${topics}, DO NOT INCLUDE TEXT. Feature an Ethereal style with faint, sketch-like drawings of the entitites or concepts. Include subtle, barely visible outlines of human figures in various poses, representing the overall sentiment of the entitites and relations used, for example distressed figures for a negative sentiment or empowered or power stanced figures for a positive sentimen†. The overall composition should be sparse and balanced, with ample empty space(mostly black or dark gray) for overlaying mind map components. Use a black base with slightly darker brown or dark gray line work, mimicking aged ink. The image should evoke a sense of timeless wisdom, innovation, and the interconnectedness of ideas, serving as a perfect backdrop for a conceptual mind map.`;
  // }, [nodes]);
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     return `Create a dark, monochromatic background inspired by Leonardo da Vinci's sketches on black slate or obsidian. The base should be very dark gray or near-black. The image should subtly represent the following concepts: ${topics}, WITHOUT INCLUDING ANY TEXT. Use light gray, pale sepia, or muted gold lines to create ethereal, faint sketch-like drawings of the entities or concepts, as if carved or etched into the dark surface. Include subtle, barely visible outlines of human figures in various poses, their stances reflecting the overall sentiment of the entities and relations (e.g., hunched or tense figures for negative sentiment, upright for neutral or running or some sort of olimpic dynamic poses for positive sentiment). The composition should be sparse and balanced, maintaining ample empty dark space for overlaying mind map components. The light-on-dark sketch style should evoke a sense of timeless wisdom emerging from darkness, innovation, and the interconnectedness of ideas, serving as a perfect backdrop for a conceptual mind map. Ensure the sketches and figures are lighter than the background, creating a subtle contrast that doesn't overpower the dark theme.`;
  //   }, [nodes]);
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");

  //     return `Create an image with a very dark, nearly black center occupying about 60% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles. The halo should be based on the following sentiment and concepts: ${topics}. The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes and vivid colors that reflect the overall sentiment (use warm, bright colors for positive sentiment; cool, muted colors for negative sentiment). Include abstract shapes or symbolic elements related to the topics in the halo. Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border that tells a story about the content's mood and themes.`;
  //   }, [nodes]);

  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     let colorScheme;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = "warm, bright colors like reds, oranges, and yellows";
  //     } else if (sentimentScore < -0.2) {
  //       colorScheme = "cool, muted colors like blues, purples, and grays";
  //     } else {
  //       colorScheme =
  //         "balanced, neutral colors like soft greens, light browns, and muted yellows";
  //     }

  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     return `Create an image with a very dark, nearly black center occupying about 60% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles. The halo should be based on the following concepts: ${topics}. The overall sentiment has an intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1. The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes and vivid colors that reflect the overall sentiment (use ${colorScheme}). The intensity of the colors should correspond to the sentiment intensity. Include abstract shapes or symbolic elements related to the topics in the halo. Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border that tells a story about the content's mood and themes.`;
  //   }, [nodes, analysis]);

  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let vegetationDescription;
  //     if (sentimentScore > 0.1) {
  //       // Positive sentiment
  //       const flowerIntensity = Math.min(Math.round(sentimentIntensity * 5), 5); // Scale from 1 to 5
  //       vegetationDescription = `a lush garden with vibrant, colorful flowers. The garden should feature ${flowerIntensity} different types of flowers, each more vivid and beautiful than the last. Include blooming trees and healthy, green shrubs. The intensity and variety of colors should reflect the positive sentiment intensity of ${sentimentIntensity.toFixed(
  //         2
  //       )}.`;
  //     } else if (sentimentScore < -0.1) {
  //       // Negative sentiment
  //       const deathIntensity = Math.min(Math.round(sentimentIntensity * 5), 5); // Scale from 1 to 5
  //       vegetationDescription = `a landscape with increasingly dying vegetation. Start with wilting plants and progress to ${deathIntensity} stages of decay, ending with completely dead and dried up vegetation. Include withered trees, brown grass, and decaying leaves. The extent of the decay should reflect the negative sentiment intensity of ${sentimentIntensity.toFixed(
  //         2
  //       )}.`;
  //     } else {
  //       // Neutral sentiment
  //       vegetationDescription = `a balanced natural scene with various shades of green vegetation. Include a mix of trees, shrubs, and ground cover plants. The vegetation should appear healthy but not excessively lush or vibrant. Add some moss-covered rocks or fallen logs to create a sense of established, steady growth.`;
  //     }

  //     return `Create an image with a very dark, nearly black center occupying about 70% of the total area. Surround this dark center with a ring of vegetation-based imagery. The vegetation should be based on the following description: ${vegetationDescription}

  //     The vegetation should be intense and detailed at the edges of the image, gradually fading and becoming less distinct as it approaches the dark center, creating a smooth transition. Within the vegetation, subtly incorporate abstract shapes or symbolic elements related to these concepts: ${topics}.

  //     Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by a ring of nature that tells a story about the content's mood and themes through its flora.`;
  //   }, [nodes, analysis]);

  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let vegetationDescription;
  //     if (sentimentScore > 0.3) {
  //       const flowerIntensity = Math.min(Math.round(sentimentIntensity * 5), 5);
  //       vegetationDescription = `a lush garden with vibrant, colorful flowers. The garden should feature ${flowerIntensity} different types of flowers, each more vivid and beautiful than the last. Include blooming trees and healthy, green shrubs. The intensity and variety of colors should reflect the positive sentiment intensity of ${sentimentIntensity.toFixed(
  //         2
  //       )}.`;
  //     } else if (sentimentScore < -0.1) {
  //       const deathIntensity = Math.min(Math.round(sentimentIntensity * 5), 5);
  //       vegetationDescription = `a landscape with increasingly dying vegetation. Start with wilting plants and progress to ${deathIntensity} stages of decay, ending with completely dead and dried up vegetation. Include withered trees, brown grass, and decaying leaves. The extent of the decay should reflect the negative sentiment intensity of ${sentimentIntensity.toFixed(
  //         2
  //       )}.`;
  //     } else {
  //       vegetationDescription = `a balanced natural scene with various shades of green vegetation. Include a mix of trees, shrubs, and ground cover plants. The vegetation should appear healthy but not excessively lush or vibrant. Add some moss-covered rocks or fallen logs to create a sense of established, steady growth.`;
  //     }

  //     return `Create an image with a very dark, nearly black circular center occupying about 70% of the total area. Surround this dark center with vegetation-based imagery filling the rest of the frame. The vegetation should be based on the following description: ${vegetationDescription}

  //     The vegetation should be intense and detailed at the outer edges of the image, gradually fading and becoming less distinct as it approaches the dark center, creating a smooth transition. Within the vegetation, subtly incorporate  shapes or  elements related to these concepts: ${topics}.

  //     Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by a ring of nature that tells a story about the content's mood and themes through its flora.`;
  //   }, [nodes, analysis]);

  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme, brushstrokeDescription, moodDescription;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `warm and vibrant colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of reds, oranges, yellows, and bright pinks`;
  //       brushstrokeDescription =
  //         "energetic and uplifting brushstrokes, with swirling patterns and bursts of light";
  //       moodDescription = "joyful and optimistic";
  //     } else if (sentimentScore < -0.1) {
  //       colorScheme = `cool and muted colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of blues, purples, greys, and deep greens`;
  //       brushstrokeDescription =
  //         "heavy and turbulent brushstrokes, with sharp angles and shadowy areas";
  //       moodDescription = "melancholic and tense";
  //     } else {
  //       colorScheme =
  //         "balanced mix of both warm and cool colors, with muted tones and subtle contrasts";
  //       brushstrokeDescription =
  //         "steady and balanced brushstrokes, with a mix of curved and straight lines";
  //       moodDescription = "contemplative and balanced";
  //     }

  //     return `Create an image with a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles. The halo should be based on the following sentiment and concepts: ${topics}.

  //     Use a color scheme of ${colorScheme}. The intensity of the colors should correspond to the sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1.

  //     The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes with ${brushstrokeDescription}. The overall mood should feel ${moodDescription}.

  //     Include abstract shapes or symbolic elements related to the topics in the halo. These elements should be integrated seamlessly into the expressionist style, becoming more defined towards the edges and more abstract as they approach the center.

  //     Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border that tells a story about the content's mood and themes through color, brushstrokes, and abstract symbolism.`;
  //   }, [nodes, analysis]);
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme,
  //       brushstrokeDescription,
  //       vegetationDescription,
  //       moodDescription;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `warm and vibrant colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of reds, oranges, yellows, and bright pinks`;
  //       brushstrokeDescription =
  //         "energetic and uplifting brushstrokes, with swirling patterns and bursts of light";
  //       vegetationDescription = `lush garden with vibrant, colorful flowers. Include ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} different types of flowers, each more vivid and beautiful than the last, along with blooming trees and healthy, green shrubs`;
  //       moodDescription = "joyful and optimistic";
  //     } else if (sentimentScore < -0.1) {
  //       colorScheme = `cool and muted colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of blues, purples, greys, and deep greens`;
  //       brushstrokeDescription =
  //         "heavy and turbulent brushstrokes, with sharp angles and shadowy areas";
  //       vegetationDescription = `landscape with increasingly dying vegetation. Show ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} stages of decay, from wilting plants to completely dead and dried up vegetation, including withered trees, brown grass, and decaying leaves`;
  //       moodDescription = "melancholic and tense";
  //     } else {
  //       colorScheme =
  //         "balanced mix of both warm and cool colors, with muted tones and subtle contrasts";
  //       brushstrokeDescription =
  //         "steady and balanced brushstrokes, with a mix of curved and straight lines";
  //       vegetationDescription =
  //         "balanced natural scene with various shades of green vegetation, including a mix of trees, shrubs, and ground cover plants. Add moss-covered rocks or fallen logs to create a sense of established, steady growth";
  //       moodDescription = "contemplative and balanced";
  //     }

  //     return `Create an image with a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles, featuring nature-based imagery. The halo should be based on the following sentiment, concepts, and vegetation: ${topics}.

  //   Use a color scheme of ${colorScheme}. The intensity of the colors should correspond to the sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1.

  //   The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes with ${brushstrokeDescription}. The overall mood should feel ${moodDescription}.

  //   Within the halo, paint ${vegetationDescription}. The vegetation should be rendered in an expressionist style, becoming more defined towards the edges and more abstract as it approaches the center.

  //   Include abstract shapes or symbolic elements related to the topics, seamlessly integrated into the expressionist vegetation. These elements should become more defined towards the edges and more abstract as they approach the center.

  //   Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border of nature that tells a story about the content's mood and themes through color, brushstrokes, and abstract symbolism in vegetation.`;
  //   }, [nodes, analysis]);

  //testing commit
  const generateImagePrompt = useCallback(() => {
    const topics = nodes.map((node) => node.data.label).join(", ");
    const sentimentScore = analysis?.sentiment?.score || 0;
    const sentimentIntensity = Math.abs(sentimentScore);

    let colorScheme,
      brushstrokeDescription,
      vegetationDescription,
      moodDescription;

    if (sentimentScore > 0.3) {
      colorScheme = `various spring colors, predominantly using ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} shades of soft pinks, light yellows, pale blues, and fresh greens`;
      brushstrokeDescription =
        "light and airy brushstrokes, with gentle swirls and dabs of color";
      vegetationDescription = `a vibrant spring landscape with blossoming trees, budding flowers, and fresh green leaves. Include ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} different types of spring flowers, such as cherry blossoms, daffodils, and tulips`;
      moodDescription = "uplifting and rejuvenating";
    } else if (sentimentScore < -0.1) {
      colorScheme = `dark and muted colors, predominantly using ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} shades of deep browns, murky greys, and blacks`;
      brushstrokeDescription =
        "heavy and somber brushstrokes, with rough textures and dripping effects";
      vegetationDescription = `a decaying swamp or dying forest. Show ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} stages of decay, from withering plants to rotting logs and stagnant water. Include gnarled trees, drooping vines, and patches of slimy algae`;
      moodDescription = "gloomy and foreboding";
    } else {
      colorScheme =
        "various tones of green, ranging from soft sage to deep forest greens";
      brushstrokeDescription =
        "balanced and steady brushstrokes, with a mix of smooth gradients and textured areas";
      vegetationDescription =
        "a serene forest scene with a variety of trees, ferns, and mosses. Include different shades and textures of green foliage, creating a sense of depth and tranquility";
      moodDescription = "calm and balanced";
    }

    return `Create an image with a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles, featuring nature-based imagery. The halo should be based on the following sentiment, concepts, and vegetation: ${topics}.

  Use a color scheme of ${colorScheme}. The intensity of the colors should correspond to the sentiment intensity of ${sentimentIntensity.toFixed(
      2
    )} on a scale from 0 to 1.

  The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes with ${brushstrokeDescription}. The overall mood should feel ${moodDescription}.

  Within the halo, paint ${vegetationDescription}. The vegetation should be rendered in an expressionist style, becoming more defined towards the edges and more abstract as it approaches the center.

  Include abstract shapes or symbolic elements related to the topics, seamlessly integrated into the expressionist vegetation. These elements should become more defined towards the edges and more abstract as they approach the center.

  Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border of nature that tells a story about the content's mood and themes through color, brushstrokes, and abstract symbolism in vegetation.`;
  }, [nodes, analysis]);

  const generateImage = useCallback(async () => {
    setIsGeneratingImage(true);
    const prompt = generateImagePrompt();
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
      setBackgroundImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      setImageRequested(false); // Reset the state to allow another attempt
    } finally {
      setIsGeneratingImage(false);
    }
  }, [generateImagePrompt]);

  useEffect(() => {
    if (
      analysis &&
      nodes.length > 0 &&
      !backgroundImageUrl &&
      !imageRequested
    ) {
      setImageRequested(true);
      generateImage();
    }
  }, [analysis, nodes, backgroundImageUrl, imageRequested, generateImage]);

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
      {analysis && analysis.sentiment && (
        <>
          <div
            className="sentiment-indicator"
            onMouseEnter={() => setShowSentimentTooltip(true)}
            onMouseLeave={() => setShowSentimentTooltip(false)}
          >
            Sentiment
          </div>
          {showSentimentTooltip && (
            <div className="sentiment-tooltip">
              <strong>Overall Sentiment:</strong>
              <br />
              Score: {analysis.sentiment.score.toFixed(2)}
              <br />
              {analysis.sentiment.explanation}
            </div>
          )}
        </>
      )}
      {error && (
        <div className="absolute bottom-0 left-0 w-full bg-red-100 text-red-700 p-2 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default MindMapDalle;
