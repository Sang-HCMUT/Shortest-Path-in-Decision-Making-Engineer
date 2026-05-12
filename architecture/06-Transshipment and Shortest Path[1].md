# Ghi chú: Transshipment (Max Flow) & Shortest Path

*Dựa trên Lecture ECE 307: Transshipment & Shortest Path Problems.*

Tài liệu tóm tắt hai bài toán: Tìm lưu lượng tối đa (Max Flow) và Tuyến đường chi phí thấp nhất (Shortest Path).

---

## A. BÀI TOÁN LUỒNG CỰC ĐẠI (MAX FLOW)

### 1. Mô hình bài toán
- **Mục tiêu:** Vận chuyển tối đa một lượng hàng hóa từ Nguồn ($s$) đến Đích ($t$) qua các điểm trung chuyển.
- **Sức chứa (Capacity - $k_{ij}$):** Giới hạn lưu lượng lớn nhất trên cung $(i, j)$.
- **Ràng buộc:** 
  1. $0 \le f_{ij} \le k_{ij}$ (Không vượt sức chứa).
  2. Tại các điểm trung chuyển, tổng luồng đi vào bằng tổng luồng đi ra (Bảo toàn luồng).

### 2. Định lý Max-Flow Min-Cut
- **Lát cắt (Cut):** Phân chia đồ thị thành 2 tập đỉnh $S$ (chứa $s$) và $T$ (chứa $t$). Sức chứa của lát cắt là tổng sức chứa các cung hướng từ $S$ sang $T$.
- **Định lý:** Luồng cực đại trong mạng luôn bằng sức chứa của lát cắt cực tiểu (Min Cut).
  $$\text{Max Flow} = \text{Min Cut}$$
- Ý nghĩa: Năng lực của toàn hệ thống bị giới hạn bởi "nút thắt cổ chai" (bottleneck) - tức là lát cắt có sức chứa nhỏ nhất.

### 3. Thuật toán tìm Max Flow (Ford-Fulkerson / Edmonds-Karp)
- **Đường tăng luồng (Augmenting Path):** Đường từ $s$ đến $t$ trên đồ thị thặng dư. 
- Tại đỉnh $i$, có thể đi sang $j$ nếu:
  1. *Cung thuận (Forward arc):* $f_{ij} < k_{ij}$ (Còn dư sức chứa).
  2. *Cung ngược (Backward arc):* $f_{ji} > 0$ (Rút bớt luồng đã đẩy).
- **Quy trình:**
  - Tìm một đường tăng luồng từ $s$ đến $t$.
  - Tính $\delta$ (lượng luồng nhỏ nhất có thể đẩy thêm trên đường này).
  - Cập nhật luồng: Cộng $\delta$ cho cung thuận, trừ $\delta$ cho cung ngược.
  - Lặp lại cho đến khi không tìm được đường tăng luồng nào từ $s$ đến $t$. Luồng hiện tại là cực đại.

---

## B. BÀI TOÁN ĐƯỜNG ĐI NGẮN NHẤT (SHORTEST PATH)

### 1. Mô hình bài toán
- Đồ thị $G(V, E)$ với $n$ đỉnh. Mỗi cung $(i, j)$ có **Trọng số ($d_{ij} \ge 0$)** đại diện cho chi phí, thời gian, hoặc khoảng cách.
- Mục tiêu: Tìm đường đi từ đỉnh nguồn đến đỉnh đích có tổng trọng số nhỏ nhất.

### 2. Thuật toán Dijkstra
Thuật toán gán nhãn để tìm đường đi ngắn nhất từ một đỉnh đến mọi đỉnh khác.

- **Nhãn tạm thời (Temporary label):** Ước lượng khoảng cách ngắn nhất hiện tại.
- **Nhãn vĩnh viễn (Permanent label):** Khoảng cách ngắn nhất chính xác đã được xác nhận.

**Các bước thực hiện:**
- **Bước 0:** Khởi tạo khoảng cách nguồn bằng 0 (nhãn vĩnh viễn). Các đỉnh khác bằng $\infty$ (nhãn tạm thời).
- **Bước 1:** Xét đỉnh $u$ vừa được gán nhãn vĩnh viễn, cập nhật nhãn tạm thời cho các đỉnh kề $v$:
  $D(v) = \min(D(v), D(u) + d_{uv})$
- **Bước 2:** Chọn đỉnh có nhãn tạm thời nhỏ nhất chưa xét, gán cho nó nhãn vĩnh viễn.
- **Bước 3:** Lặp lại Bước 1 và 2 cho đến khi đỉnh đích được gán nhãn vĩnh viễn.

### 3. Truy vết đường đi (Path Retracing)
Sau khi thuật toán hoàn tất việc tính khoảng cách, ta cần tìm lại danh sách các đỉnh thuộc đường đi.
- Bắt đầu từ đỉnh đích $n$.
- Tìm đỉnh $j$ liền trước sao cho:
  $\text{Khoảng cách}(j) + d_{jn} = \text{Khoảng cách}(n)$
- Lặp lại quá trình từ $j$ lùi dần về đỉnh nguồn. Cấu trúc dữ liệu `previous_nodes` thường được dùng để tối ưu việc này.
