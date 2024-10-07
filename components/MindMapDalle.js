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
    color: #f59e0b;
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
      "rgba(255, 82, 187, 0.9)", // Reddish
      "rgba(76, 230, 188, 0.7)", // Light greenblue
      "rgba(0, 240, 255, 0.6)", // Blueish
      "rgba(0, 157, 255, 0.5", // sky blue
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
          color: level === 0 ? "#000000" : "#000000", //#6d28d9
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

  //       The vegetation should be intense and detailed at the outer edges of the image, gradually fading and becoming less distinct as it approaches the dark center, creating a smooth transition. Within the vegetation, subtly incorporate  shapes or  elements related to these concepts: ${topics}.

  //       Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by a ring of nature that tells a story about the content's mood and themes through its flora.`;
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

  //BEST expresionist//////////
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme,
  //       brushstrokeDescription,
  //       vegetationDescription,
  //       moodDescription;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `various spring colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of soft pinks, light yellows, pale blues, and fresh greens`;
  //       brushstrokeDescription =
  //         "light and airy brushstrokes, with gentle swirls and dabs of color";
  //       vegetationDescription = `a vibrant spring landscape with blossoming trees, budding flowers, and fresh green leaves. Include ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} different types of spring flowers, such as cherry blossoms, daffodils, and tulips`;
  //       moodDescription = "uplifting and rejuvenating";
  //     } else if (sentimentScore < -0.1) {
  //       colorScheme = `dark and muted colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of deep browns, murky greys, and blacks`;
  //       brushstrokeDescription =
  //         "heavy and somber brushstrokes, with rough textures and dripping effects";
  //       vegetationDescription = `a decaying swamp or dying forest. Show ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} stages of decay, from withering plants to rotting logs and stagnant water. Include gnarled trees, drooping vines, and patches of slimy algae`;
  //       moodDescription = "gloomy and foreboding";
  //     } else {
  //       colorScheme =
  //         "various tones of green, ranging from soft sage to deep forest greens";
  //       brushstrokeDescription =
  //         "balanced and steady brushstrokes, with a mix of smooth gradients and textured areas";
  //       vegetationDescription =
  //         "a serene forest scene with a variety of trees, ferns, and mosses. Include different shades and textures of green foliage, creating a sense of depth and tranquility";
  //       moodDescription = "calm and balanced";
  //     }

  //     return `Create an image with a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vibrant halo effect inspired by expressionist painting styles, featuring nature-based imagery. The halo should be based on the following sentiment, concepts, and vegetation: ${topics}.

  //       Use a color scheme of ${colorScheme}. The intensity of the colors should correspond to the sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1.

  //       The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The expressionist style in the halo should use bold, emotional brushstrokes with ${brushstrokeDescription}. The overall mood should feel ${moodDescription}.

  //       Within the halo, paint ${vegetationDescription}. The vegetation should be rendered in an expressionist style, becoming more defined towards the edges and more abstract as it approaches the center.

  //       Include abstract shapes or symbolic elements related to the topics, seamlessly integrated into the expressionist vegetation. These elements should become more defined towards the edges and more abstract as they approach the center.

  //       Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border of nature that tells a story about the content's mood and themes through color, brushstrokes, and abstract symbolism in vegetation.`;
  //   }, [nodes, analysis]);

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
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme, patternDescription, imageryDescription, moodDescription;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `vibrant earth tones and spring colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of soft pinks, light yellows, pale blues, ochre, and fresh greens`;
  //       patternDescription =
  //         "intricate dot patterns forming spirals and concentric circles, representing growth and positive energy";
  //       imageryDescription = `flourishing landscapes with ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} different types of native Australian flora such as wattle, banksia, and eucalyptus. Include symbolic representations of water holes and rivers`;
  //       moodDescription = "joyful and life-affirming";
  //     } else if (sentimentScore < -0.1) {
  //       colorScheme = `muted earth tones, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of deep browns, dark ochres, greys, and blacks`;
  //       patternDescription =
  //         "angular lines and rough textures, with sparse dot work representing scarcity and hardship";
  //       imageryDescription = `a harsh, arid landscape with ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} symbolic representations of drought, such as cracked earth, withered trees, and empty billabongs`;
  //       moodDescription = "somber and challenging";
  //     } else {
  //       colorScheme =
  //         "balanced earth tones, focusing on various shades of greens, ochres, and soft browns";
  //       patternDescription =
  //         "a mix of fluid lines and evenly spaced dot work, creating a sense of balance and continuity";
  //       imageryDescription =
  //         "a harmonious bush scene with a variety of native trees, animals, and landforms. Include symbols of community and gathering places";
  //       moodDescription = "contemplative and balanced";
  //     }

  //     return `Create an image inspired by Australian Aboriginal art style, with a dark circular center for a mind map overlay, based on the following concepts: ${topics}. The artwork should blend traditional Aboriginal painting techniques with a modern mind map structure.

  //     Use a color palette of ${colorScheme} for the outer areas. The vibrancy and depth of the colors should reflect the sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1.

  //     The central focus should be a large, dark circular area occupying about 75% of the image. This dark center should be nearly black, creating a stark contrast with the surrounding Aboriginal-inspired artwork.

  //     Surrounding the dark center, fill with Aboriginal-inspired art featuring ${patternDescription}. This should be intense and detailed at the outer edges, gradually fading and becoming less distinct as it approaches the dark center, creating a smooth transition.

  //     Within this ring, incorporate ${imageryDescription}. Use traditional Aboriginal symbols and motifs such as U-shapes for people, animal tracks, and concentric circles for important sites. These elements should be seamlessly integrated into the overall design, becoming more defined towards the edges and more abstract as they approach the center.

  //     Utilize the characteristic dot painting technique to create texture and depth, varying the size and spacing of dots to convey different elements and emotions. The composition should feel ${moodDescription}, with the arrangement and flow of elements around the dark center telling a story related to the given concepts.

  //     Ensure that the artwork respects the traditional techniques and symbolism of Aboriginal art while adapting it to the mind map structure. The final effect should be a rich, symbolically dense ring of Aboriginal-inspired art surrounding a dark, empty center, perfect for overlaying mind map elements.`;
  //   }, [nodes, analysis]);

  ///FUSION

  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme,
  //       brushstrokeDescription,
  //       vegetationDescription,
  //       moodDescription,
  //       aboriginalElements;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `various spring colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of soft pinks, light yellows, pale blues, and fresh greens`;
  //       brushstrokeDescription =
  //         "light and airy brushstrokes, with gentle swirls and dabs of color, interspersed with fine dot work patterns";
  //       vegetationDescription = `a vibrant spring landscape with blossoming trees, budding flowers, and fresh green leaves. Include ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} different types of spring flowers, such as cherry blossoms, daffodils, and tulips`;
  //       moodDescription = "uplifting and rejuvenating";
  //       aboriginalElements =
  //         "circular patterns representing water holes and spirals symbolizing growth and renewal";
  //     } else if (sentimentScore < -0.1) {
  //       colorScheme = `dark and muted colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of deep browns, murky greys, and blacks`;
  //       brushstrokeDescription =
  //         "heavy and somber brushstrokes, with rough textures and dripping effects, combined with sparse, angular dot patterns";
  //       vegetationDescription = `a decaying swamp or dying forest. Show ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} stages of decay, from withering plants to rotting logs and stagnant water. Include gnarled trees, drooping vines, and patches of slimy algae`;
  //       moodDescription = "gloomy and foreboding";
  //       aboriginalElements =
  //         "jagged lines representing cracked earth and disconnected dot patterns symbolizing scarcity";
  //     } else {
  //       colorScheme =
  //         "various tones of green, ranging from soft sage to deep forest greens";
  //       brushstrokeDescription =
  //         "balanced and steady brushstrokes, with a mix of smooth gradients and textured areas, complemented by evenly spaced dot work";
  //       vegetationDescription =
  //         "a serene forest scene with a variety of trees, ferns, and mosses. Include different shades and textures of green foliage, creating a sense of depth and tranquility";
  //       moodDescription = "calm and balanced";
  //       aboriginalElements =
  //         "interconnected circular and curved line patterns representing harmony and connection with the land";
  //     }

  //     return `Create an image with a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vibrant halo effect that fuses expressionist painting styles with Aboriginal art elements, featuring nature-based imagery. The halo should be based on the following sentiment, concepts, and vegetation: ${topics}.

  //   Use a color scheme of ${colorScheme}. The intensity of the colors should correspond to the sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1.

  //   The halo should be intense and detailed at the edges of the image, gradually diffusing and fading as it approaches the dark center, creating a smooth transition. The style in the halo should blend expressionist and Aboriginal techniques, using bold, emotional brushstrokes with ${brushstrokeDescription}. Incorporate traditional Aboriginal dot painting techniques throughout the halo, using dots to create texture, depth, and symbolic patterns. The overall mood should feel ${moodDescription}.

  //   Within the halo, paint ${vegetationDescription}. The vegetation should be rendered in a style that combines expressionist bold strokes with Aboriginal-inspired representations, becoming more defined towards the edges and more abstract as it approaches the center. Integrate ${aboriginalElements} into the vegetation and throughout the halo.

  //   Include abstract shapes or symbolic elements related to the topics, seamlessly integrated into the expressionist-Aboriginal fusion vegetation. These elements should become more defined towards the edges and more abstract as they approach the center. Use traditional Aboriginal symbols such as concentric circles for meeting places, wavy lines for water or journey, and animal tracks where appropriate, but render them with an expressionist flair.

  //   Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements. The final effect should resemble a window of darkness framed by an emotive, expressive border that blends nature-based expressionist painting with Aboriginal art techniques. This frame should tell a story about the content's mood and themes through color, brushstrokes, dot work, and abstract symbolism in vegetation and traditional Aboriginal motifs.`;
  //   }, [nodes, analysis]);

  //   //Expresionist and Surrealist
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme,
  //       brushstrokeDescription,
  //       vegetationDescription,
  //       moodDescription,
  //       surrealistElements;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `various spring colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of soft pinks, light yellows, pale blues, and fresh greens`;
  //       brushstrokeDescription =
  //         "dynamic, sweeping brushstrokes with explosive bursts of color, creating a sense of euphoric energy";
  //       vegetationDescription = `a vibrant spring landscape with blossoming trees, budding flowers, and fresh green leaves. Include ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} different types of spring flowers, such as cherry blossoms, daffodils, and tulips`;
  //       moodDescription = "ecstatic and transcendent";
  //       surrealistElements =
  //         "floating, oversized flower petals and leaves that morph into butterflies or birds mid-flight";
  //     } else if (sentimentScore < -0.1) {
  //       colorScheme = `dark and muted colors, predominantly using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of deep browns, murky greys, and blacks`;
  //       brushstrokeDescription =
  //         "violent, jagged brushstrokes with drips and splatters, conveying turmoil and despair";
  //       vegetationDescription = `a decaying swamp or dying forest. Show ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} stages of decay, from withering plants to rotting logs and stagnant water. Include gnarled trees, drooping vines, and patches of slimy algae`;
  //       moodDescription = "nightmarish and oppressive";
  //       surrealistElements =
  //         "trees with clock-like faces melting into the swamp, and shadowy figures emerging from decaying logs";
  //     } else {
  //       colorScheme =
  //         "various tones of green, ranging from soft sage to deep forest greens";
  //       brushstrokeDescription =
  //         "fluid, meandering brushstrokes that create a sense of gentle movement and flow";
  //       vegetationDescription =
  //         "a serene forest scene with a variety of trees, ferns, and mosses. Include different shades and textures of green foliage, creating a sense of depth and tranquility";
  //       moodDescription = "contemplative and dreamlike";
  //       surrealistElements =
  //         "trees that seamlessly blend into human silhouettes, and clouds that take the shape of gentle, sleeping faces";
  //     }

  //     return `Create an abstract expressionist image with surrealist elements, featuring a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vivid, emotionally charged representation of nature. The artwork should be inspired by the following concepts: ${topics}.

  //   Use a color scheme of ${colorScheme}. The intensity and saturation of the colors should reflect the sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1, with colors becoming more vivid and contrasting as the intensity increases.

  //   The area surrounding the dark center should be a riot of color and emotion, with no clear boundary between the center and the outer area. Instead, create a gradual transition using ${brushstrokeDescription}. These brushstrokes should create a sense of movement and depth, drawing the viewer's eye around the composition.

  //   Within this abstract expressionist framework, represent ${vegetationDescription}. However, distort and exaggerate these natural elements to heighten their emotional impact. Use impasto techniques to add texture and dimensionality to the paint, making the vegetation appear to almost leap off the canvas.

  //   Incorporate surrealist elements to add an element of the unexpected and enhance the emotional resonance. Include ${surrealistElements}. These surreal elements should be seamlessly integrated into the abstract landscape, creating a dreamlike quality that amplifies the overall mood.

  //   The overall composition should feel ${moodDescription}. Use stark contrasts in color, texture, and form to create visual tension and enhance the emotional impact. Experiment with unexpected color juxtapositions within the specified color scheme to further intensify the mood.

  //   Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements, but allow some of the surrounding chaos to bleed into its edges, creating a dynamic interplay between the dark void and the emotional turmoil surrounding it.

  //   The final effect should be a highly emotive, almost visceral representation of nature and emotion. It should challenge the viewer's perceptions, evoking strong feelings through its use of color, form, and surreal imagery while still maintaining a connection to the natural world through the distorted vegetation.`;
  //   }, [nodes, analysis]);
  ///Works ok but triggers warnings due to language use
  const generateImagePrompt = useCallback(() => {
    const topics = nodes.map((node) => node.data.label).join(", ");
    const sentimentScore = analysis?.sentiment?.score || 0;
    const sentimentIntensity = Math.abs(sentimentScore);

    let colorScheme,
      brushstrokeDescription,
      vegetationDescription,
      moodDescription,
      styleElements;

    if (sentimentScore > 0.3) {
      colorScheme = `various spring colors, predominantly using ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} shades of soft pinks, light yellows, pale blues, and fresh greens`;
      brushstrokeDescription =
        "precise, detailed brushstrokes that capture the intricate textures and subtle color variations";
      vegetationDescription = `a vibrant spring landscape with blossoming trees, budding flowers, and fresh green leaves. Include ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} different types of spring flowers, such as cherry blossoms, daffodils, and tulips`;
      moodDescription = "joyful and rejuvenating";
      styleElements =
        "highly realistic representation of flora, with meticulous attention to detail. Capture the delicate structures of flower petals, the veins in leaves, and the play of light on dewdrops. Use techniques reminiscent of botanical illustrations or high-resolution nature photography";
    } else if (sentimentScore < -0.2) {
      colorScheme = `dark and muted colors, predominantly using ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} shades of deep browns, murky greys, and blacks`;
      brushstrokeDescription =
        "distorted, unsettling brushstrokes that blur the line between reality and nightmare";
      vegetationDescription = `a decaying swamp or dying forest. Show ${Math.min(
        Math.round(sentimentIntensity * 5),
        5
      )} stages of decay, from withering plants to rotting logs and stagnant water. Include gnarled trees, drooping vines, and patches of slimy algae`;
      moodDescription = "deeply unsettling and foreboding";
      styleElements =
        "surrealistic elements that distort and transform the landscape. Incorporate melting or morphing vegetation, impossible juxtapositions of scale, and dreamlike abstractions. Draw inspiration from artists like Salvador Dalí or Yves Tanguy";
    } else {
      colorScheme =
        "various tones of green, ranging from soft sage to deep forest greens";
      brushstrokeDescription =
        "bold, expressive brushstrokes that emphasize emotion over literal representation";
      vegetationDescription =
        "a forest scene with a variety of trees, ferns, and mosses. Include different shades and textures of green foliage, creating a sense of depth and atmosphere";
      moodDescription = "emotionally charged and dynamic";
      styleElements =
        "expressionistic style that prioritizes emotional impact over realism. Use exaggerated forms, vibrant or contrasting colors, and visible, energetic brushstrokes. Draw inspiration from artists like Vincent van Gogh or Edvard Munch";
    }

    return `Create an image with a very dark, nearly black center occupying about 75% of the total area. Surround this dark center with a vivid representation of nature that adapts its style based on the sentiment. The artwork should be inspired by the following concepts: ${topics}.

    Use a color scheme of ${colorScheme}. The intensity and saturation of the colors should reflect the sentiment intensity of ${sentimentIntensity.toFixed(
      2
    )} on a scale from 0 to 1, with colors becoming more vivid as the intensity increases.

    The area surrounding the dark center should be rich in detail and emotion, with a gradual transition from the center outwards. Use ${brushstrokeDescription} to create depth and evoke the appropriate mood.

    Within this framework, depict ${vegetationDescription}. The style of representation should vary dramatically based on the sentiment:

    ${styleElements}

    The overall composition should feel ${moodDescription}. Use contrasts in light, shadow, and detail to enhance the emotional impact and draw attention to key elements of the scene. For the expressionistic and surrealistic styles, don't hesitate to distort proportions or natural colors to heighten the emotional effect.

    Ensure the dark center remains largely empty and very dark to allow for clear visibility of overlaid elements, but allow some of the surrounding imagery to interact with its edges, creating a dynamic interplay between the dark void and the emotionally charged nature scene surrounding it. The interaction should reflect the style - precise for realistic, energetic for expressionistic, and fluid or distorted for surrealistic.

    The final effect should be a powerful representation of nature that clearly conveys the emotional tone through its distinct artistic style, use of color, and focus on specific natural elements. It should captivate the viewer and evoke strong emotions aligned with the sentiment, while maintaining a clear connection to the natural world through the depicted vegetation.`;
  }, [nodes, analysis]);
  //   const generateImagePrompt = useCallback(() => {
  //     const topics = nodes.map((node) => node.data.label).join(", ");
  //     const sentimentScore = analysis?.sentiment?.score || 0;
  //     const sentimentIntensity = Math.abs(sentimentScore);

  //     let colorScheme,
  //       brushstrokeDescription,
  //       vegetationDescription,
  //       moodDescription,
  //       styleElements;

  //     if (sentimentScore > 0.3) {
  //       colorScheme = `vibrant spring colors, using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of soft pinks, light yellows, pale blues, and fresh greens`;
  //       brushstrokeDescription =
  //         "precise, detailed brushstrokes that capture intricate textures and subtle color variations";
  //       vegetationDescription = `a lively spring landscape with flowering trees, blooming flowers, and fresh green leaves. Include ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} different types of spring flowers, such as cherry blossoms, daffodils, and tulips`;
  //       moodDescription = "uplifting and refreshing";
  //       styleElements =
  //         "highly detailed representation of flora, with careful attention to the structures of flower petals, leaf veins, and the interplay of light on surfaces";
  //     } else if (sentimentScore < -0.3) {
  //       colorScheme = `muted tones, using ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} shades of deep browns, greys, and dark greens`;
  //       brushstrokeDescription =
  //         "bold, textured brushstrokes that create a sense of unease and tension";
  //       vegetationDescription = `a stark landscape with bare trees, fallen leaves, and still water. Show ${Math.min(
  //         Math.round(sentimentIntensity * 5),
  //         5
  //       )} signs of environmental stress, such as drooping plants and dry soil`;
  //       moodDescription = "somber and thought-provoking";
  //       styleElements =
  //         "abstract elements that transform the landscape in unexpected ways. Use exaggerated forms and unconventional perspectives to create a dreamlike atmosphere";
  //     } else {
  //       colorScheme =
  //         "earthy tones, ranging from soft sage to deep forest greens, with touches of warm browns and cool greys";
  //       brushstrokeDescription =
  //         "expressive brushstrokes that balance detail with emotional resonance";
  //       vegetationDescription =
  //         "a diverse forest scene with a variety of trees, ferns, and ground cover. Include different textures and shades of foliage to create depth and atmosphere";
  //       moodDescription = "contemplative and balanced";
  //       styleElements =
  //         "a style that emphasizes emotional impact through color and form. Use visible brushstrokes and slightly exaggerated shapes to convey the essence of the natural elements";
  //     }

  //     return `Create a nature-inspired image with a dark circular center occupying about 75% of the total area. Surround this center with a vivid representation of a natural landscape that reflects the given sentiment. The artwork should be inspired by these concepts: ${topics}.

  //   Use a color palette of ${colorScheme}. Adjust the color intensity to reflect a sentiment intensity of ${sentimentIntensity.toFixed(
  //       2
  //     )} on a scale from 0 to 1.

  //   The area surrounding the dark center should be rich in detail and atmosphere, with a smooth transition from the center outwards. Apply ${brushstrokeDescription} to create depth and convey the intended mood.

  //   Within this setting, depict ${vegetationDescription}. Adapt the artistic style based on the sentiment:

  //   ${styleElements}

  //   The overall composition should evoke a feeling of being ${moodDescription}. Use variations in light, shadow, and detail to enhance the visual impact and highlight key elements of the scene.

  //   Maintain the dark center as a mostly empty, very dark area to allow for clear visibility of potential overlays. Allow some elements of the surrounding landscape to subtly interact with the edges of this dark area, creating a harmonious transition between the center and the vibrant nature scene.

  //   The final image should be a compelling representation of nature that clearly conveys the emotional tone through its artistic style, use of color, and focus on natural elements. It should engage the viewer and evoke emotions aligned with the given sentiment, while showcasing the beauty and complexity of the natural world.`;
  //   }, [nodes, analysis]);

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

  //   useEffect(() => {
  //     if (
  //       analysis &&
  //       nodes.length > 0 &&
  //       !backgroundImageUrl &&
  //       !imageRequested
  //     ) {
  //       setImageRequested(true);
  //       //   generateImage();
  //     }
  //   }, [analysis, nodes, backgroundImageUrl]);

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
        defaultzoom={0.5}
        style={{ background: "transparent", zIndex: 1 }}
      >
        <Controls style={{ backgroundColor: "white", color: "black" }} />
        <Panel
          position="top-left"
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <button
            onClick={handleReanalyze}
            className={`text-white text-sm py-1 px-3 rounded ${
              loading || isGeneratingImage
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700"
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
