//////////THIS ONE WORKSS!!
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   ReactFlow,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Background,
//   Controls,
//   Panel,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import { useEntitiesRelationships } from "../hooks/useEntitiesRelationships";

// const MindMap = ({ accumulatedContents }) => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const { analysis, loading, error, triggerAnalysis } =
//     useEntitiesRelationships(accumulatedContents);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const createNestedStructure = (
//     root,
//     level = 0,
//     parentId = null,
//     xOffset = 0,
//     yOffset = 0
//   ) => {
//     const nodes = [];
//     const edges = [];

//     const node = {
//       id: root.id,
//       type: "default",
//       data: { label: root.text },
//       position: { x: xOffset, y: yOffset },
//       style: {
//         width: 180,
//         padding: 10,
//         borderRadius: 5,
//         backgroundColor: root.type === "category" ? "#e6f2ff" : "#fff5e6",
//         color: root.type === "category" ? "#3b82f6" : "#f97316",
//       },
//     };

//     if (parentId) {
//       edges.push({
//         id: `${parentId}-${root.id}`,
//         source: parentId,
//         target: root.id,
//         animated: true,
//         style: { stroke: "#3b82f6" },
//       });
//     }

//     nodes.push(node);

//     if (root.children) {
//       root.children.forEach((child, index) => {
//         const childXOffset = xOffset + 250;
//         const childYOffset = yOffset + index * 100;
//         const childStructure = createNestedStructure(
//           child,
//           level + 1,
//           root.id,
//           childXOffset,
//           childYOffset
//         );
//         nodes.push(...childStructure.nodes);
//         edges.push(...childStructure.edges);
//       });
//     }

//     return { nodes, edges };
//   };

//   useEffect(() => {
//     if (!analysis || !analysis.roots) return;

//     try {
//       let allNodes = [];
//       let allEdges = [];
//       let yOffset = 0;

//       analysis.roots.forEach((root, index) => {
//         const { nodes: newNodes, edges: newEdges } = createNestedStructure(
//           root,
//           0,
//           null,
//           0,
//           yOffset
//         );
//         allNodes.push(...newNodes);
//         allEdges.push(...newEdges);
//         yOffset += 600; // Adjust this value to change the spacing between root nodes
//       });

//       // Add relationship edges
//       const relationshipEdges = analysis.relationships.map(
//         (relation, index) => ({
//           id: `relation-${index}`,
//           source: relation.source,
//           target: relation.target,
//           label: relation.type,
//           animated: true,
//           style: { stroke: "#3b82f6" },
//         })
//       );

//       setNodes(allNodes);
//       setEdges([...allEdges, ...relationshipEdges]);
//     } catch (err) {
//       console.error("Error processing analysis data:", err);
//     }
//   }, [analysis, setNodes, setEdges]);

//   const handleReanalyze = () => {
//     triggerAnalysis();
//   };

//   return (
//     <div style={{ width: "100%", height: "600px", position: "relative" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Background />
//         <Controls style={{ backgroundColor: "white", color: "black" }} />
//         <Panel
//           position="top-left"
//           style={{ display: "flex", gap: "10px", alignItems: "center" }}
//         >
//           <button
//             onClick={handleReanalyze}
//             className={`text-white text-sm py-2 px-4 rounded ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-700"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Analyzing..." : "Re-analyze"}
//           </button>
//           {loading && (
//             <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
//               Analyzing...
//             </div>
//           )}
//         </Panel>
//       </ReactFlow>
//       {error && (
//         <div className="absolute bottom-0 left-0 w-full bg-red-100 text-red-700 p-2 text-sm">
//           Error: {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MindMap;

// ////Using a Radail Output.........
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   ReactFlow,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Background,
//   Controls,
//   Panel,
//   MiniMap,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import { useEntitiesRelationships } from "../hooks/useEntitiesRelationships";

// // Custom style to override ReactFlow's default styles
// const customStyles = `
//   .react-flow__attribution {
//     background: transparent;
//     color: rgba(255, 255, 255, 0.3);
//   }
//   .react-flow__attribution a {
//     color: rgba(255, 255, 255, 0.3);
//   }
// `;

// const MindMap = ({ accumulatedContents }) => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const { analysis, loading, error, triggerAnalysis } =
//     useEntitiesRelationships(accumulatedContents);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const createRadialLayout = (roots) => {
//     const nodes = [];
//     const edges = [];
//     const centerX = 300;
//     const centerY = 300;
//     const radiusStep = 200;

//     const createNode = (entity, angle, level, isRoot = false) => {
//       const radius = (level + 1) * radiusStep;
//       const x = centerX + radius * Math.cos(angle);
//       const y = centerY + radius * Math.sin(angle);

//       return {
//         id: entity.id,
//         type: "default",
//         data: { label: entity.text },
//         position: { x, y },
//         style: {
//           width: 150,
//           padding: 10,
//           borderRadius: 5,
//           backgroundColor: isRoot
//             ? "#fccccc" //"#ff6b6b"
//             : entity.type === "category"
//             ? "#e6f2ff"
//             : "#fff5e6",
//           color: entity.type === "category" ? "#3b82f6" : "#f97316",
//         },
//       };
//     };

//     const processLevel = (
//       entities,
//       parentId,
//       startAngle,
//       endAngle,
//       level,
//       isRoot = false
//     ) => {
//       const angleStep = (endAngle - startAngle) / entities.length;

//       entities.forEach((entity, index) => {
//         const angle = startAngle + angleStep * (index + 0.5);
//         const node = createNode(entity, angle, level, isRoot);
//         nodes.push(node);

//         if (parentId) {
//           edges.push({
//             id: `${parentId}-${entity.id}`,
//             source: parentId,
//             target: entity.id,
//             animated: true,
//             style: {
//               stroke: isRoot ? "#ff0000" : "#3b82f6",
//               strokeWidth: isRoot ? 4 : 2,
//             },
//           });
//         }

//         if (entity.children) {
//           processLevel(
//             entity.children,
//             entity.id,
//             angle - angleStep / 2,
//             angle + angleStep / 2,
//             level + 1
//           );
//         }
//       });
//     };

//     processLevel(roots, null, 0, 2 * Math.PI, 0, true);

//     return { nodes, edges };
//   };

//   useEffect(() => {
//     if (!analysis || !analysis.roots) return;

//     try {
//       const { nodes: layoutNodes, edges: layoutEdges } = createRadialLayout(
//         analysis.roots
//       );

//       // Create a set of valid node IDs for quick lookup
//       const validNodeIds = new Set(layoutNodes.map((node) => node.id));

//       // Add relationship edges, but only if both source and target nodes exist
//       const relationshipEdges = analysis.relationships
//         .filter(
//           (relation) =>
//             validNodeIds.has(relation.source) &&
//             validNodeIds.has(relation.target)
//         )
//         .map((relation, index) => ({
//           id: `relation-${index}`,
//           source: relation.source,
//           target: relation.target,
//           label: relation.type,
//           animated: true,
//           style: { stroke: "#6a6a6a" },
//         }));

//       setNodes(layoutNodes);
//       setEdges([...layoutEdges, ...relationshipEdges]);
//     } catch (err) {
//       console.error("Error processing analysis data:", err);
//     }
//   }, [analysis, setNodes, setEdges]);

//   const handleReanalyze = () => {
//     triggerAnalysis();
//   };

//   const minimapNodeColor = (node) => {
//     switch (node.style?.backgroundColor) {
//       case "#fccccc":
//         return "#ff6b6b";
//       case "#e6f2ff":
//         return "#4a90e2";
//       case "#fff5e6":
//         return "#f6a623";
//       default:
//         return "#ffffff";
//     }
//   };

//   return (
//     <div style={{ width: "400px", height: "700px", position: "relative" }}>
//       <style>{customStyles}</style>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Background color="#fcd6a9" gap={12} size={1} />
//         <Controls style={{ backgroundColor: "white", color: "black" }} />
//         <MiniMap
//           style={{
//             height: 100,
//             backgroundColor: `rgba(0, 0, 0, 0.7)`,
//             maskColor: `rgba(0, 0, 0, 0.8)`,
//           }}
//           nodeColor={minimapNodeColor}
//           nodeStrokeWidth={3}
//           zoomable
//           pannable
//         />
//         <Panel
//           position="top-left"
//           style={{ display: "flex", gap: "10px", alignItems: "center" }}
//         >
//           <button
//             onClick={handleReanalyze}
//             className={`text-white text-sm py-2 px-4 rounded ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-700"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Analyzing..." : "Re-analyze"}
//           </button>
//           {loading && (
//             <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
//               Analyzing...
//             </div>
//           )}
//         </Panel>
//       </ReactFlow>
//       {error && (
//         <div className="absolute bottom-0 left-0 w-full bg-red-100 text-red-700 p-2 text-sm">
//           Error: {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MindMap;

import React, { useCallback, useEffect, useState, useMemo } from "react";
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
`;

const MindMap = ({ accumulatedContents }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { analysis, loading, error, triggerAnalysis } =
    useEntitiesRelationships(accumulatedContents);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const createRadialLayout = useCallback((roots) => {
    const nodes = [];
    const edges = [];
    const centerX = 300;
    const centerY = 300;
    const radiusStep = 200;

    const createNode = (entity, angle, level, isRoot = false) => {
      const radius = (level + 1) * radiusStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: entity.id,
        type: "default",
        data: { label: entity.text },
        position: { x, y },
        style: {
          width: 150,
          padding: 10,
          borderRadius: 5,
          backgroundColor: isRoot
            ? "#fccccc"
            : entity.type === "category"
            ? "#e6f2ff"
            : "#fff5e6",
          color: entity.type === "category" ? "#3b82f6" : "#f97316",
        },
      };
    };

    const processLevel = (
      entities,
      parentId,
      startAngle,
      endAngle,
      level,
      isRoot = false
    ) => {
      const angleStep = (endAngle - startAngle) / entities.length;

      entities.forEach((entity, index) => {
        const angle = startAngle + angleStep * (index + 0.5);
        const node = createNode(entity, angle, level, isRoot);
        nodes.push(node);

        if (parentId) {
          edges.push({
            id: `${parentId}-${entity.id}`,
            source: parentId,
            target: entity.id,
            type: "default",
            animated: true,
            style: {
              stroke: level === 1 ? "#ff0000" : "#3b82f6", // Red for root edges, blue for others
              strokeWidth: level === 1 ? 4 : 2,
            },
          });
        }

        if (entity.children) {
          processLevel(
            entity.children,
            entity.id,
            angle - angleStep / 2,
            angle + angleStep / 2,
            level + 1,
            false
          );
        }
      });
    };

    processLevel(roots, null, 0, 2 * Math.PI, 0, true);

    return { nodes, edges };
  }, []);

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

          animated: true,
          style: {
            stroke: "#6a6a6a", //#00FF00
          },
        }));

      setNodes(layoutNodes);
      setEdges([...layoutEdges, ...relationshipEdges]);
    } catch (err) {
      console.error("Error processing analysis data:", err);
    }
  }, [analysis, setNodes, setEdges, createRadialLayout]);

  const handleReanalyze = () => {
    triggerAnalysis();
  };

  const minimapNodeColor = useCallback((node) => {
    switch (node.style?.backgroundColor) {
      case "#fccccc":
        return "#ff6b6b";
      case "#e6f2ff":
        return "#4a90e2";
      case "#fff5e6":
        return "#f6a623";
      default:
        return "#ffffff";
    }
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
      >
        <Background />
        {/* color="#fcd6a9" gap={12} size={1} */}
        <Controls style={{ backgroundColor: "white", color: "black" }} />
        <MiniMap
          style={{
            height: 100,
            backgroundColor: `rgba(0, 0, 0, 0)`,
            maskColor: `rgba(0, 0, 0, 0.8)`,
          }}
          nodeColor={minimapNodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Panel
          position="top-left"
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <button
            onClick={handleReanalyze}
            className={`text-white text-sm py-2 px-4 rounded ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Re-analyze"}
          </button>
          {loading && (
            <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Analyzing...
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
      minimapNodeColor,
      handleReanalyze,
    ]
  );

  return (
    <div style={{ width: "400px", height: "700px", position: "relative" }}>
      <style>{customStyles}</style>
      {reactFlowInstance}
      {error && (
        <div className="absolute bottom-0 left-0 w-full bg-red-100 text-red-700 p-2 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default MindMap;
