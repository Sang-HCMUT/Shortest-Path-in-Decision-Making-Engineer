from pydantic import BaseModel
from typing import List, Optional

class Edge(BaseModel):
    source: str
    target: str
    weight: float = 1.0
    capacity: float = 1.0

class GraphRequest(BaseModel):
    source: str
    target: str
    directed: bool = False
    nodes: List[str]
    edges: List[Edge]

class GraphResponseData(BaseModel):
    shortest_distance: float
    path: List[str]
    calculation_steps: List[str]

class GraphResponse(BaseModel):
    status: str
    data: Optional[GraphResponseData] = None
    message: Optional[str] = None

class MaxFlowResponseData(BaseModel):
    max_flow: float
    flow_distribution: dict
    calculation_steps: List[str]

class MaxFlowResponse(BaseModel):
    status: str
    data: Optional[MaxFlowResponseData] = None
    message: Optional[str] = None
