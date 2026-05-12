# Shortest Path & Max Flow Solver

Interactive web application for analyzing network graphs. Built to compute Shortest Path and Max Flow algorithms in real-time.

## Live Demo
[Try the app](https://Sang-HCMUT.github.io/Shortest-Path-in-Decision-Making-Engineer/)

## Features
- Interactive canvas powered by `React Flow`. Add nodes, draw edges, set capacities and weights.
- **Shortest Path**: Uses Dijkstra's algorithm. Handles multi-graph parallel edges automatically.
- **Max Flow & Min Cut**: Implements Edmonds-Karp to compute maximum flow. Highlights bottleneck edges directly on the graph.
- Keyboard support for deletions, plus undo/redo capabilities.
- Step-by-step execution logs for algorithm tracing.

## Tech Stack
- **Frontend**: React, Vite, React Flow, Zustand, TailwindCSS. (Hosted on GitHub Pages)
- **Backend**: Python, FastAPI, Uvicorn. (Deployed on Render)

## Running Locally

Requires Node.js (18+) and Python (3.10+).

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

*Note: Update API endpoints in `frontend/src/components/ControlPanel.jsx` to point to `localhost:8000` during local dev.*
