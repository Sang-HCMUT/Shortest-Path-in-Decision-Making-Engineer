# Network Graph Solver: Shortest Path & Max Flow

A professional, full-stack decision-making and graph analytics tool built for academic and enterprise network routing problems. This application provides an interactive canvas to construct directed graphs, and computes complex network algorithms instantly.

## 🌟 Live Demo
**👉 [Try the Interactive Web App Here!](https://Sang-HCMUT.github.io/Shortest-Path-in-Decision-Making-Engineer/)**

## ✨ Features
- **Interactive Graph Canvas**: Drag-and-drop nodes, define edge weights, and assign capacities intuitively using `React Flow`.
- **Shortest Path (Dijkstra's Algorithm)**: Calculates the absolute shortest distance between a source and a sink node, visually outlining the exact optimal route.
- **Max Flow (Edmonds-Karp Algorithm)**: Computes the maximum possible flow in a flow network, and visually distributes the flow allocations across the active bottleneck edges.
- **Professional UI/UX**: clean, light-weight minimal aesthetic theme tailored for academic analytics, research, and presentation.
- **Undo & Flexible Editing**: Safely undo accidental edge/node deletions or additions, supporting full keyboard shortcuts (Backspace/Delete).
- **Execution Log Simulation**: View real-time algorithm calculation steps, distances, and mathematical bottlenecks per iteration.

## 🏗️ Technical Architecture
The project strictly follows a decoupled Client-Server architecture.

- **Frontend (`/frontend`)**: Built with React.js, Vite, Zustand (for state management), and Tailwind CSS (for styling). Hosted dynamically on GitHub Pages.
- **Backend (`/backend`)**: A robust Python API powered by **FastAPI** and **Uvicorn**, containing the algorithmic data structures. Deployed 24/7 on Render.

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Start the Backend (API)
Open a terminal, navigate to the `backend` directory, install the required packages, and start the local FastAPI server:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The API will be available at `http://localhost:8000`.*

### 2. Start the Frontend (UI)
In a new separate terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The React app will be rapidly served by Vite.*

> **Note**: For local development, ensure that the API fetch variables in `frontend/src/components/ControlPanel.jsx` temporarily point to `http://localhost:8000` rather than the live Render production URL.

## 🛠️ Built With
- **[React](https://react.dev/)** & **[Vite](https://vitejs.dev/)**
- **[React Flow](https://reactflow.dev/)** (Node-based UI framework)
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Zustand](https://github.com/pmndrs/zustand)** (React State Management)
- **[FastAPI](https://fastapi.tiangolo.com/)** (High-performance Python backend framework)
