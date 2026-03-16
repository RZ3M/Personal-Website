"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sectionNav } from "../../lib/portfolio-data";

interface HPatternShifterProps {
  activeSectionIndex: number;
  onGearEngage: (index: number) => void;
  className?: string;
}

// Graph model:
//  G1      G3      G5      G7       (top row)
//   |       |       |       |
//  R0------R1------R2------R3       (middle rail)
//   |       |       |       |
//  G2      G4      G6      G8       (bottom row)

type NodeId =
  | "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7" | "G8"
  | "R0" | "R1" | "R2" | "R3";

const SVG_W = 220;
const SVG_H = 160;

const SVG_POSITIONS: Record<NodeId, { x: number; y: number }> = {
  G1: { x: 30, y: 22 },  G2: { x: 30, y: 138 },
  G3: { x: 83, y: 22 },  G4: { x: 83, y: 138 },
  G5: { x: 137, y: 22 }, G6: { x: 137, y: 138 },
  G7: { x: 190, y: 22 }, G8: { x: 190, y: 138 },
  R0: { x: 30, y: 80 },  R1: { x: 83, y: 80 },
  R2: { x: 137, y: 80 }, R3: { x: 190, y: 80 },
};

interface GraphNode {
  id: NodeId;
  gear?: number;
}

const NODES: GraphNode[] = [
  { id: "G1", gear: 1 }, { id: "G2", gear: 2 },
  { id: "G3", gear: 3 }, { id: "G4", gear: 4 },
  { id: "G5", gear: 5 }, { id: "G6", gear: 6 },
  { id: "G7", gear: 7 }, { id: "G8", gear: 8 },
  { id: "R0" }, { id: "R1" }, { id: "R2" }, { id: "R3" },
];

const EDGES: [NodeId, NodeId][] = [
  ["G1", "R0"], ["R0", "G2"],
  ["G3", "R1"], ["R1", "G4"],
  ["G5", "R2"], ["R2", "G6"],
  ["G7", "R3"], ["R3", "G8"],
  ["R0", "R1"], ["R1", "R2"], ["R2", "R3"],
];

const nodeMap = new Map<NodeId, GraphNode>();
for (const n of NODES) nodeMap.set(n.id, n);

const adjacency = new Map<NodeId, NodeId[]>();
for (const n of NODES) adjacency.set(n.id, []);
for (const [a, b] of EDGES) {
  adjacency.get(a)!.push(b);
  adjacency.get(b)!.push(a);
}

function bfsPath(from: NodeId, to: NodeId): NodeId[] {
  if (from === to) return [from];
  const visited = new Set<NodeId>([from]);
  const queue: NodeId[][] = [[from]];
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    for (const neighbor of adjacency.get(current)!) {
      if (visited.has(neighbor)) continue;
      const newPath = [...path, neighbor];
      if (neighbor === to) return newPath;
      visited.add(neighbor);
      queue.push(newPath);
    }
  }
  return [from];
}

function gearToNodeId(gear: number): NodeId {
  return `G${gear}` as NodeId;
}

export function HPatternShifter({ activeSectionIndex, onGearEngage, className }: HPatternShifterProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentGear, setCurrentGear] = useState(1);
  const [knobX, setKnobX] = useState(SVG_POSITIONS.G1.x);
  const [knobY, setKnobY] = useState(SVG_POSITIONS.G1.y);
  const [isDragging, setIsDragging] = useState(false);
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());

  const isAnimatingRef = useRef(false);
  const animFrameRef = useRef(0);
  const lastSyncedGearRef = useRef(1);
  const nearestNodeRef = useRef<NodeId>("G1");
  const isDraggingRef = useRef(false);
  const currentGearRef = useRef(1);
  const knobXRef = useRef(SVG_POSITIONS.G1.x);
  const knobYRef = useRef(SVG_POSITIONS.G1.y);

  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { currentGearRef.current = currentGear; }, [currentGear]);

  const findNearestNode = useCallback((x: number, y: number): NodeId => {
    let best: NodeId = "R0";
    let bestDist = Infinity;
    for (const node of NODES) {
      const pos = SVG_POSITIONS[node.id];
      const dx = pos.x - x;
      const dy = pos.y - y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = node.id;
      }
    }
    return best;
  }, []);

  const computeActiveEdges = useCallback((x: number, y: number): Set<string> => {
    const edges = new Set<string>();
    const nearest = findNearestNode(x, y);
    const gearNode = nodeMap.get(nearest);
    if (gearNode?.gear) {
      const path = bfsPath("G1", nearest);
      for (let i = 0; i < path.length - 1; i++) {
        const key = [path[i], path[i + 1]].sort().join("-");
        edges.add(key);
      }
    }
    return edges;
  }, [findNearestNode]);

  const animateToGear = useCallback((targetGear: number) => {
    if (isAnimatingRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    isAnimatingRef.current = true;

    const fromNode = findNearestNode(knobXRef.current, knobYRef.current);
    const toNode = gearToNodeId(targetGear);
    const path = bfsPath(fromNode, toNode);

    if (path.length <= 1) {
      isAnimatingRef.current = false;
      return;
    }

    let segmentIndex = 0;
    let segmentProgress = 0;
    const speed = 0.06;

    const step = () => {
      if (isDraggingRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      segmentProgress += speed;
      if (segmentProgress >= 1) {
        segmentProgress = 0;
        segmentIndex++;
      }

      if (segmentIndex >= path.length - 1) {
        const toPos = SVG_POSITIONS[toNode];
        setKnobX(toPos.x);
        setKnobY(toPos.y);
        knobXRef.current = toPos.x;
        knobYRef.current = toPos.y;
        nearestNodeRef.current = toNode;
        const gearNode = nodeMap.get(toNode);
        if (gearNode?.gear) {
          setCurrentGear(gearNode.gear);
          lastSyncedGearRef.current = gearNode.gear;
        }
        isAnimatingRef.current = false;
        setActiveEdges(computeActiveEdges(toPos.x, toPos.y));
        return;
      }

      const fromPos = SVG_POSITIONS[path[segmentIndex]];
      const toPos = SVG_POSITIONS[path[segmentIndex + 1]];
      const x = fromPos.x + (toPos.x - fromPos.x) * segmentProgress;
      const y = fromPos.y + (toPos.y - fromPos.y) * segmentProgress;

      setKnobX(x);
      setKnobY(y);
      knobXRef.current = x;
      knobYRef.current = y;

      if (segmentProgress > 0.5) {
        nearestNodeRef.current = path[segmentIndex + 1];
      } else {
        nearestNodeRef.current = path[segmentIndex];
      }

      const nearest = nearestNodeRef.current;
      const nearestGear = nodeMap.get(nearest);
      if (nearestGear?.gear && segmentProgress > 0.8) {
        setCurrentGear(nearestGear.gear);
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [computeActiveEdges, findNearestNode]);

  // Scroll sync: always track latest activeSectionIndex
  useEffect(() => {
    const targetGear = activeSectionIndex + 1;
    if (isDraggingRef.current) return;
    if (targetGear === lastSyncedGearRef.current) return;
    lastSyncedGearRef.current = targetGear;
    animateToGear(targetGear);
  }, [activeSectionIndex, animateToGear]);

  const handleGearClick = useCallback((gear: number) => {
    lastSyncedGearRef.current = gear;
    onGearEngage(gear - 1);
    animateToGear(gear);
  }, [onGearEngage, animateToGear]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (isAnimatingRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      isAnimatingRef.current = false;
    }

    setIsDragging(true);
    isDraggingRef.current = true;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const rawY = ((e.clientY - rect.top) / rect.height) * SVG_H;

    const currentNearest = nearestNodeRef.current;
    const currentPos = SVG_POSITIONS[currentNearest];
    const neighbors = adjacency.get(currentNearest)!;

    let bestX = currentPos.x;
    let bestY = currentPos.y;
    let bestDist = Infinity;

    for (const neighborId of neighbors) {
      const neighborPos = SVG_POSITIONS[neighborId];
      const edgeDx = neighborPos.x - currentPos.x;
      const edgeDy = neighborPos.y - currentPos.y;
      const edgeLenSq = edgeDx * edgeDx + edgeDy * edgeDy;

      const dx = rawX - currentPos.x;
      const dy = rawY - currentPos.y;
      let t = (dx * edgeDx + dy * edgeDy) / edgeLenSq;
      t = Math.max(0, Math.min(1, t));

      const projX = currentPos.x + edgeDx * t;
      const projY = currentPos.y + edgeDy * t;
      const distToProj = Math.sqrt((rawX - projX) ** 2 + (rawY - projY) ** 2);

      if (distToProj < bestDist) {
        bestDist = distToProj;
        bestX = projX;
        bestY = projY;
      }
    }

    setKnobX(bestX);
    setKnobY(bestY);
    knobXRef.current = bestX;
    knobYRef.current = bestY;

    // Snap threshold in SVG pixels
    const snapThreshold = 12;
    for (const node of NODES) {
      const pos = SVG_POSITIONS[node.id];
      const dx = pos.x - bestX;
      const dy = pos.y - bestY;
      if (Math.sqrt(dx * dx + dy * dy) < snapThreshold) {
        nearestNodeRef.current = node.id;
        if (node.gear) {
          setCurrentGear(node.gear);
        }
        break;
      }
    }

    setActiveEdges(computeActiveEdges(bestX, bestY));
  }, [computeActiveEdges]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    isDraggingRef.current = false;

    const nearest = nearestNodeRef.current;
    const node = nodeMap.get(nearest)!;
    if (node.gear) {
      const pos = SVG_POSITIONS[nearest];
      setKnobX(pos.x);
      setKnobY(pos.y);
      knobXRef.current = pos.x;
      knobYRef.current = pos.y;
      lastSyncedGearRef.current = node.gear;
      onGearEngage(node.gear - 1);
    } else {
      // Released on rail — snap back to current gear
      const targetGear = currentGearRef.current;
      lastSyncedGearRef.current = targetGear;
      onGearEngage(targetGear - 1);
      animateToGear(targetGear);
    }
  }, [animateToGear, onGearEngage]);

  const sectionLabel = sectionNav[currentGear - 1]?.label ?? "";

  const knobLeft = (knobX / SVG_W) * 100;
  const knobTop = (knobY / SVG_H) * 100;

  return (
    <div className={`h-pattern-shifter ${className ?? ""}`.trim()}>
      <div className="h-gate-plate">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shifterPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a24" />
              <stop offset="35%" stopColor="#252535" />
              <stop offset="65%" stopColor="#1e1e2e" />
              <stop offset="100%" stopColor="#141420" />
            </linearGradient>
            <filter id="shifterGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Plate background */}
          <rect x="0" y="0" width={SVG_W} height={SVG_H} rx="12" fill="url(#shifterPlateGrad)" />
          {/* Subtle plate edge highlight */}
          <rect x="0.75" y="0.75" width={SVG_W - 1.5} height={SVG_H - 1.5} rx="11.5"
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

          {/* Groove shadow layer — dark outer rim of channel */}
          {EDGES.map(([a, b]) => {
            const posA = SVG_POSITIONS[a];
            const posB = SVG_POSITIONS[b];
            return (
              <line
                key={`shadow-${a}-${b}`}
                x1={posA.x} y1={posA.y}
                x2={posB.x} y2={posB.y}
                stroke="rgba(0,0,0,0.85)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            );
          })}

          {/* Groove floor — deep black channel interior */}
          {EDGES.map(([a, b]) => {
            const posA = SVG_POSITIONS[a];
            const posB = SVG_POSITIONS[b];
            return (
              <line
                key={`floor-${a}-${b}`}
                x1={posA.x} y1={posA.y}
                x2={posB.x} y2={posB.y}
                stroke="#060609"
                strokeWidth="8"
                strokeLinecap="round"
              />
            );
          })}

          {/* Active edge glow */}
          {EDGES.map(([a, b]) => {
            const edgeKey = [a, b].sort().join("-");
            if (!activeEdges.has(edgeKey)) return null;
            const posA = SVG_POSITIONS[a];
            const posB = SVG_POSITIONS[b];
            return (
              <line
                key={`glow-${a}-${b}`}
                x1={posA.x} y1={posA.y}
                x2={posB.x} y2={posB.y}
                stroke="rgba(230,57,70,0.35)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#shifterGlow)"
              />
            );
          })}

          {/* Gear endpoint circles + labels */}
          {NODES.filter(n => n.gear !== undefined).map((node) => {
            const pos = SVG_POSITIONS[node.id];
            const isActive = node.gear === currentGear;
            return (
              <g
                key={node.id}
                onClick={() => node.gear !== undefined && handleGearClick(node.gear)}
                style={{ cursor: "none" }}
              >
                <circle
                  cx={pos.x} cy={pos.y} r="10"
                  fill={isActive ? "rgba(230,57,70,0.18)" : "rgba(6,6,10,0.92)"}
                  stroke={isActive ? "#e63946" : "rgba(70,70,95,0.7)"}
                  strokeWidth="1.5"
                  filter={isActive ? "url(#shifterGlow)" : undefined}
                />
                <text
                  x={pos.x} y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="'Share Tech Mono', monospace"
                  fill={isActive ? "#e63946" : "rgba(90,90,120,0.9)"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.gear}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Draggable knob — positioned absolutely over SVG */}
        <div
          className="h-gate-knob"
          data-dragging={isDragging}
          style={{
            left: `${knobLeft}%`,
            top: `${knobTop}%`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>

      <div className="h-gate-indicator">
        <span className="gear-display">{currentGear}</span>
        <span className="section-label">{sectionLabel}</span>
      </div>
    </div>
  );
}
