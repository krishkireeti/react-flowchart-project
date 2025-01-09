import React from "react";
import {
  ReactFlow,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";

// Updated mock data
const lifeCycleData = [
  { State: "New", Time: "January 1, 2024 01:01:01", Branch: null },
  { State: "Ready For Development", Time: "January 2, 2024 01:01:01", Branch: null },
  { State: "Pull Request Created", Time: "January 3, 2024 01:01:01", Branch: "Frontend" },
  { State: "Pull Request Approved", Time: "January 4, 2024 01:01:01", Branch: "Frontend" },
  { State: "Pull Request Created", Time: "January 4, 2024 02:02:02", Branch: "Backend" },
  { State: "Trunk Build Created", Time: "January 6, 2024 01:01:01", Branch: "Frontend" },
  { State: "Pull Request Approved", Time: "January 7, 2024 02:02:02", Branch: "Backend" },
  { State: "Trunk Build Created", Time: "January 7, 2024 04:04:04", Branch: "Backend" },
  { State: "Trunk Build Tested", Time: "January 8, 2024 01:01:01", Branch: "Frontend" },
  { State: "Trunk Build Tested", Time: "January 8, 2024 02:02:02", Branch: "Backend" },
  { State: "Release Build Created", Time: "January 9, 2024 01:01:01", Branch: "Frontend" },
  { State: "Release Build Created", Time: "January 9, 2024 02:02:02", Branch: "Backend" },
  { State: "Release Build Tested", Time: "January 11, 2024 01:01:01", Branch: "Frontend" },
  { State: "Release Build Tested", Time: "January 11, 2024 02:02:02", Branch: "Backend" },
  { State: "Release Build Deployed", Time: "January 12, 2024 01:01:01", Branch: "Frontend" },
  { State: "Release Build Deployed", Time: "January 12, 2024 02:02:02", Branch: "Backend" }
];

const processFlowchartData = (input) => {
  const uniqueBranches = Array.from(
    new Set(input.map((item) => item.Branch || "null"))
  );

  const nullBranch = "null";
  const middleX = 400; // X-position for the "null" branch
  const branchPositions = {};

  uniqueBranches.forEach((branch, index) => {
    if (branch === nullBranch) {
      branchPositions[branch] = middleX;
    } else {
      const direction = index % 2 === 0 ? -1 : 1; // Alternate directions
      branchPositions[branch] = middleX + direction * (200 + index * 100);
    }
  });

  const branchSequenceMap = {};
  const nodes = input.map((item, index) => {
    const branch = item.Branch || nullBranch;

    if (!branchSequenceMap[branch]) branchSequenceMap[branch] = 0;

    // Increase the vertical spacing by changing the multiplier (150 instead of 100)
    const yPosition =
      branch === nullBranch
        ? branchSequenceMap[branch] * 120 // Null nodes spaced out
        : 200 + branchSequenceMap[branch] * 120; // Non-null nodes spaced out

    branchSequenceMap[branch]++;

    return {
      id: `${index}`,
      data: {
        label: (
          <div>
            <strong>{item.State}</strong>
            <div>{item.Time}</div>
            {item.Branch && <div>({item.Branch})</div>}
          </div>
        ),
      },
      position: {
        x: branchPositions[branch],
        y: yPosition,
      },
    };
  });

  const edges = [];
  const branchMap = new Map();

  input.forEach((item, index) => {
    const branch = item.Branch || nullBranch;

    if (branchMap.has(branch)) {
      const prevIndex = branchMap.get(branch);
      edges.push({
        id: `e${prevIndex}-${index}`,
        source: `${prevIndex}`,
        target: `${index}`,
        type: "smoothstep",
      });
    } else if (branch !== nullBranch && branchMap.has(nullBranch)) {
      const prevIndex = branchMap.get(nullBranch);
      edges.push({
        id: `e${prevIndex}-${index}`,
        source: `${prevIndex}`,
        target: `${index}`,
        type: "smoothstep",
      });
    }

    branchMap.set(branch, index);
  });

  return { nodes, edges };
};



function Flowchart({ data }) {
  const { nodes, edges } = processFlowchartData(data);

  return (
    <div style={{ height: "100vh", width: "100%" }} className="reactflow-container">
      <h1 style={{ textAlign: 'center' }}>State Transition Flowchart</h1>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

function App() {
  return <Flowchart data={lifeCycleData} style={{ width: '100% !important' }} />;
}

export default App;