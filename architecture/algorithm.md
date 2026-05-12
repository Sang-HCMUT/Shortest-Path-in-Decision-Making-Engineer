# Thuật toán

## Tổng quan
Module này cài đặt các thuật toán cốt lõi xử lý đồ thị: Dijkstra (Shortest Path) và Edmonds-Karp (Max Flow & Min Cut).

## 1. Dijkstra (Shortest Path)
Tính toán đường đi ngắn nhất từ Source đến Target.

**Input:**
- `nodes`: Danh sách đỉnh (`["A", "B", ...]`).
- `edges`: Danh sách cung (`[{source: "A", target: "B", weight: 5}]`).
- `source`, `target`.

**Cấu trúc Dữ liệu:**
- `Adjacency List`: `dict` trong Python, lọc cung song song nhỏ nhất.
- `Priority Queue`: `heapq` ($O(\log V)$) cho Min-Heap.
- `distances`, `previous_nodes`: `dict` để lưu nhãn và truy vết.

**Output:**
- `shortest_distance`: Chi phí tối thiểu.
- `path`: Array tuần tự đỉnh trên đường đi.
- `calculation_steps`: Array strings các bước tính toán (logs).

## 2. Edmonds-Karp (Max Flow & Min Cut)
Tính luồng cực đại và xác định các cung tạo thành lát cắt cực tiểu (bottlenecks).

**Input:**
- Tương tự Dijkstra, nhưng `edges` sử dụng field `capacity` thay vì `weight`.

**Cấu trúc Dữ liệu:**
- `Residual Graph`: Khởi tạo cung thuận và cung ngược (capacity = 0).
- `Queue`: `deque` cho Breadth-First Search (BFS) tìm đường tăng luồng.
- `flow_tracking`: `dict` theo dõi lượng flow đã đẩy qua từng cung.

**Output:**
- `max_flow`: Lượng luồng cực đại.
- `bottleneck_edges`: Array các object cạnh nối từ tập S (reachable) sang tập T (unreachable) trên Residual Graph sau khi đạt bão hòa.
- `calculation_steps`: Array strings ghi lại quá trình BFS và đẩy luồng.
