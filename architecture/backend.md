# Backend

## Tổng quan
RESTful API xử lý thuật toán đồ thị.
- **Tech Stack:** Python, FastAPI.
- **Features:** Xử lý JSON request, thực thi thuật toán (Dijkstra, Edmonds-Karp), trả về JSON response.

## Cấu trúc Thư mục
```
backend/
├── main.py              # FastAPI entry point
├── models/              # Pydantic models (Data Validation schemas)
│   └── graph.py
├── services/            # Core algorithms
│   ├── dijkstra.py      # Thuật toán Shortest Path
│   └── max_flow.py      # Thuật toán Edmonds-Karp & Min-Cut
├── requirements.txt     # Python dependencies
```

## API Endpoints
- `POST /api/v1/shortest-path/calculate`
  - Input JSON: `nodes`, `edges`, `source`, `target`.
  - Output: `shortest_distance`, `path`, `calculation_steps`.

- `POST /api/v1/max-flow/calculate`
  - Input JSON: `nodes`, `edges` (với capacity), `source`, `target`.
  - Output: `max_flow`, `bottleneck_edges`, `calculation_steps`.
