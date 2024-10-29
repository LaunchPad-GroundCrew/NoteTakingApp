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
    const centerX = 50;
    const centerY = 50;
    const radiusStep = 130;

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
    <div style={{ width: "70%", height: "70%", position: "relative" }}>
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
