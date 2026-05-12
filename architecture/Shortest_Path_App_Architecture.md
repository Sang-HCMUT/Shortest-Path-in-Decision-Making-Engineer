# Kiến trúc Hệ thống: Shortest Path App

## 1. Tổng quan
Tài liệu mô tả kiến trúc phần mềm và thuật toán cho ứng dụng giải bài toán Đường đi ngắn nhất. Hệ thống gồm Frontend (UI tương tác) và Backend (API xử lý thuật toán).

## 2. Mô hình Thuật toán
Tìm đường đi có tổng chi phí nhỏ nhất từ một điểm gốc (source) đến một điểm đích (sink) trên đồ thị có hướng.

### 2.1. Dijkstra
Sử dụng trên Backend:
- Khởi tạo khoảng cách đến đỉnh nguồn là 0, các đỉnh khác là $\infty$.
- Dùng Min-Heap (Priority Queue) để liên tục lấy đỉnh có khoảng cách nhỏ nhất hiện tại.
- Cập nhật (Relaxation) khoảng cách cho các đỉnh kề nếu tìm được đường đi ngắn hơn.
- Lặp lại cho đến khi xét tới đích.

### 2.2. Truy vết (Path Retracing)
Lưu trữ mảng `previous_nodes`. Khi tìm xong, truy vết ngược từ đích về nguồn để lấy mảng tuần tự các đỉnh thuộc đường đi.

## 3. Kiến trúc Hệ thống
Client-Server chia tách Frontend và Backend.

### 3.1. Frontend
- **Framework:** React.js (Vite).
- **Thư viện đồ họa:** React Flow (vẽ đồ thị node/edge tương tác).
- **State Management:** Zustand.
- **Nhiệm vụ:** Hiển thị UI, lấy input từ user (đồ thị, source, target), gọi API, hiển thị kết quả và animation.

### 3.2. Backend
- **Framework:** Python (FastAPI).
- **Nhiệm vụ:** Nhận JSON payload chứa đồ thị, chạy Dijkstra, trả về JSON path và chi phí.

## 4. API Design

`POST /api/v1/shortest-path/calculate`

**Request:**
```json
{
  "source": "1",
  "target": "6",
  "directed": false,
  "nodes": ["1", "2", "3", "4", "5", "6"],
  "edges": [
    { "source": "1", "target": "2", "weight": 3 },
    { "source": "1", "target": "3", "weight": 7 }
  ]
}
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "shortest_distance": 10,
    "path": ["1", "3", "6"],
    "calculation_steps": [
      "Khởi tạo nhãn vĩnh viễn cho nút 1 là 0",
      "..."
    ]
  }
}
```

## 5. Cấu trúc Dữ liệu Backend
Đảm bảo độ phức tạp $O((V + E) \log V)$:
- **Đồ thị:** Adjacency List (Dictionary).
- **Hàng đợi:** `heapq` (Min-Priority Queue).
- **Trạng thái:** `distances` (Dictionary).
- **Truy vết:** `previous_nodes` (Dictionary).

## 6. Luồng Hoạt động
1. User thêm Nút, Cung, Trọng số bằng cách kéo thả trên UI.
2. User chọn Source, Target và bấm "Run".
3. Frontend gửi data đồ thị dạng JSON xuống FastAPI.
4. FastAPI chạy Dijkstra, tính toán và trả về array đường đi.
5. Frontend nhận dữ liệu, animate đường đi (đổi màu nét vẽ) trên Canvas.
