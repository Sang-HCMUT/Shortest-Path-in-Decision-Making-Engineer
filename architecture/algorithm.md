# Module Thuật toán: Dijkstra Algorithm

## Tổng quan
Module này nhận đầu vào là đồ thị (danh sách các Nút và Cung có trọng số), sau đó tính toán đường đi ngắn nhất giữa điểm xuất phát và điểm đích.

## Input (Đầu vào)
- `nodes`: Danh sách các nút (ví dụ: `[1, 2, 3, 4]`).
- `edges`: Danh sách các cung kèm trọng số (ví dụ: `[{source: 1, target: 2, weight: 5}]`).
- `source`: Nút xuất phát.
- `target`: Nút đích.

## Cấu trúc Dữ liệu
- **Adjacency List (Danh sách kề):** `dict` trong Python, lưu trữ đỉnh kề và chi phí.
- **Min-Priority Queue:** `heapq` trong Python, dùng để lấy nhãn tạm thời nhỏ nhất với độ phức tạp $O(\log V)$.
- **Distances:** `dict` lưu chi phí ngắn nhất ($d$).
- **Previous Nodes:** `dict` dùng để truy xuất ngược đường đi.

## Output (Đầu ra)
- `shortest_distance`: Chi phí tối ưu.
- `path`: Mảng các nút tạo thành đường đi.
- `calculation_steps`: Các bước tính toán (logs) để hiển thị lên UI nhằm mục đích giáo dục.
