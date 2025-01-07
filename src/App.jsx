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

// This function transforms the `lifecycleData` into the format required by React Flow 
const processFlowchartData = (input) => {
  const nodes = input.map((item, index) => ({
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
    position: { x: item.Branch === "Frontend" ? 200 : item.Branch === "Backend" ? 600 : 400, y: index * 100 },
  }));

  const edges = [];
  const branchMap = new Map();

  input.forEach((item, index) => {
    const branch = item.Branch || "null";

    if (branchMap.has(branch)) {
      const prevIndex = branchMap.get(branch);
      edges.push({ id: `e${prevIndex}-${index}`, source: `${prevIndex}`, target: `${index}`, type: "smoothstep" });
    } else if (index > 0) {
      edges.push({ id: `e${index - 1}-${index}`, source: `${index - 1}`, target: `${index}`, type: "smoothstep" });
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