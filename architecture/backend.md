# Module Backend: REST API Server

## Tổng quan
Bao gồm RESTful API để kết nối Frontend với lõi Thuật toán.
- **Tech Stack:** Python (FastAPI).
- **Features:** Xử lý request JSON, gọi thuật toán Dijkstra, và trả về Response.

## Cấu trúc Thư mục (Dự kiến)
```
backend/
├── main.py              # Entry point của FastAPI ứng dụng
├── models/              # Pydantic models (Schemas cho Request/Response JSON)
│   └── graph.py
├── services/            # Chứa logic nghiệp vụ và thuật toán
│   └── dijkstra.py      # Lõi thuật toán
├── requirements.txt     # Danh sách thư viện Python
```

## API Endpoints
- `POST /api/v1/shortest-path/calculate`
  - Nhận HTTP Body chứa danh sách `nodes`, `edges`, `source`, `target`.
  - Gọi hàm trong `services/dijkstra.py`.
  - Formatting output và gửi JSON response cho client.
