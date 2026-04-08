from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.graph import GraphRequest, GraphResponse, GraphResponseData, MaxFlowResponse, MaxFlowResponseData
from services.dijkstra import calculate_shortest_path
from services.max_flow import calculate_max_flow

app = FastAPI(title="Shortest Path API")

# Setup CORS middleware cho phép Frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Thay đổi khi deploy thực tế
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Shortest Path API is running."}

@app.post("/api/v1/shortest-path/calculate", response_model=GraphResponse)
def calculate_path(request: GraphRequest):
    try:
        result, message = calculate_shortest_path(
            nodes=request.nodes,
            edges=request.edges,
            start_node=request.source,
            target_node=request.target,
            directed=request.directed
        )
        
        if result is None:
             return GraphResponse(status="error", message=message)
             
        data = GraphResponseData(
            shortest_distance=result["shortest_distance"],
            path=result["path"],
            calculation_steps=result["calculation_steps"]
        )
        return GraphResponse(status="success", data=data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/max-flow/calculate", response_model=MaxFlowResponse)
def calculate_flow(request: GraphRequest):
    try:
        result, message = calculate_max_flow(
            nodes=request.nodes,
            edges=request.edges,
            source=request.source,
            sink=request.target,
            directed=request.directed
        )
        
        if result is None:
             return MaxFlowResponse(status="error", message=message)
             
        data = MaxFlowResponseData(
            max_flow=result["max_flow"],
            flow_distribution=result["flow_distribution"],
            min_cut_edges=result["min_cut_edges"],
            calculation_steps=result["calculation_steps"]
        )
        return MaxFlowResponse(status="success", data=data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
