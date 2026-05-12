# Báo cáo: Tối ưu hóa Mạng lưới - Đường đi Ngắn nhất và Luồng Cực đại

## 1. Tổng quan
Dự án tập trung giải quyết và trực quan hóa hai bài toán đồ thị có hướng cơ bản trong Kỹ thuật ra quyết định:
1. Đường đi ngắn nhất (Shortest Path)
2. Luồng cực đại và Lát cắt cực tiểu (Max Flow - Min Cut)

---

## 2. Đường đi ngắn nhất (Shortest Path)

### 2.1. Mô tả bài toán và Cơ sở lý thuyết
- **Mô hình toán học:** Cho đồ thị có hướng $G = (V, E)$. Mỗi cạnh $(u, v)$ có trọng số $w(u, v) \ge 0$ biểu diễn khoảng cách, thời gian hoặc chi phí di chuyển. Nếu hai đỉnh không kết nối trực tiếp, khoảng cách được xem là $\infty$.
- **Mục tiêu:** Định tuyến một lộ trình từ đỉnh xuất phát (Source) đến đỉnh đích (Target) sao cho tổng chi phí tích lũy là nhỏ nhất. Bài toán ưu tiên giải quyết việc tiết kiệm chi phí/khoảng cách cho một chuyến đi đơn lẻ trên mạng lưới.

### 2.2. Hướng giải quyết (Phương pháp gán nhãn)
Để giải quyết bài toán, hệ thống áp dụng **Thuật toán Dijkstra** dựa trên kỹ thuật gán nhãn (Labeling Procedure) nhằm loại bỏ dần các con đường tốn kém:
1. **Nhãn tạm thời (Temporary label):** Ước lượng chi phí đi từ nguồn đến đỉnh hiện tại (có thể được cập nhật giảm xuống nếu tìm thấy đường đi rẻ hơn).
2. **Nhãn vĩnh viễn (Permanent label):** Chi phí tối ưu chính xác đã được xác nhận, không thể cải thiện thêm.
Thuật toán liên tục tìm đỉnh có nhãn tạm thời nhỏ nhất, chốt nó thành nhãn vĩnh viễn, rồi từ đó nhìn ra xung quanh để cập nhật (giảm) nhãn tạm thời cho các đỉnh kề.

### 2.3. Triển khai Dijkstra (Backend)
Thuật toán Dijkstra được cài đặt qua các bước:
- **Lọc đa cung (Multi-graph Filtering):** Nếu có nhiều cạnh song song giữa 2 đỉnh, giữ lại cạnh có trọng số nhỏ nhất.
- **Khởi tạo:** Dùng Hash Map `distances` lưu khoảng cách (mặc định $\infty$, đỉnh nguồn là 0). Mảng `previous_nodes` lưu vết đường đi.
- **Hàng đợi ưu tiên:** Dùng `heapq` ($O(E \log V)$) để chọn đỉnh có chi phí nhỏ nhất tiếp theo.
- **Cập nhật nhãn:** Khi xét đỉnh $v$ kề $u$, nếu chi phí đi qua $u$ nhỏ hơn nhãn hiện tại của $v$, cập nhật `distances[v]`, gán `previous_nodes[v] = u` và đẩy $v$ vào queue.
- **Truy vết:** Đi ngược từ đích qua `previous_nodes` để lấy đường đi hoàn chỉnh trả về frontend.

---

## 3. Luồng cực đại & Lát cắt cực tiểu (Max Flow & Min Cut)

### 3.1. Luồng cực đại
Mỗi cạnh $(u, v)$ có sức chứa $c(u, v)$.
Mục tiêu: Tìm luồng lớn nhất từ Source đến Target mà không vượt sức chứa của bất kỳ cạnh nào.

### 3.2. Triển khai Edmonds-Karp
- **Đồ thị thặng dư:** Mỗi cung thuận $(u, v)$ sinh ra một cung ngược $(v, u)$ với sức chứa ban đầu là 0.
- **Tìm đường tăng luồng (BFS):** Dùng BFS trên đồ thị thặng dư để tìm đường ngắn nhất (số cạnh) đến đích, điều kiện đi qua là sức chứa còn lại > 0.
- **Cập nhật:** Lấy giá trị nút thắt ($\Delta$) trên đường tìm được. Cộng $\Delta$ vào cung thuận, trừ $\Delta$ ở cung ngược.
- Lặp đến khi không còn đường đi từ nguồn đến đích trên đồ thị thặng dư.

### 3.3. Lát cắt cực tiểu (Min Cut)
- Chạy BFS từ Source trên đồ thị thặng dư ở trạng thái bão hòa. Các đỉnh thăm được vào tập $S$, còn lại vào $T$.
- Các cạnh ban đầu nối từ một đỉnh trong $S$ sang một đỉnh trong $T$ chính là các cạnh thuộc lát cắt cực tiểu (bottlenecks). Sức chứa các cạnh này đã bị dùng hết 100%.
- Trên UI, các cạnh này sẽ được vẽ đứt khúc để highlight.

---

## 4. Cấu trúc Triển khai
- **Backend (Python):** Chịu trách nhiệm logic, tính toán bằng các cấu trúc dữ liệu chuẩn (`dict`, `heapq`, `deque`).
- **Execution Logs:** Các bước chạy của thuật toán được API trả về chi tiết để frontend hiển thị dạng log, tiện cho việc debug và demo.
