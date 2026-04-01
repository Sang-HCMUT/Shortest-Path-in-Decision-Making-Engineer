# Kiến trúc Hệ thống & Thuật toán: Ứng dụng Giải bài toán Đường đi ngắn nhất (Shortest Path App)

## 1. Tổng quan Dự án
Tài liệu này mô tả kiến trúc phần mềm và cơ sở thuật toán để xây dựng một ứng dụng web toàn diện (Full-stack Web Application) nhằm giải quyết Bài toán Đường đi ngắn nhất. Ứng dụng cho phép người dùng trực quan hóa mạng lưới đồ thị, nhập các thông số (nút, cung, khoảng cách) và nhận kết quả đường đi tối ưu thông qua giao diện tương tác.

## 2. Cơ sở Lý thuyết & Thuật toán cốt lõi
Bài toán tập trung vào việc tìm đường đi có tổng chi phí (hoặc khoảng cách) nhỏ nhất từ một điểm gốc (source) đến một điểm đích (sink).

### 2.1. Mô hình Toán học
- **Tập hợp nút:** $\mathcal{F}=\{s=1,2,...,n=t\}$.
- **Cung (Arcs):** Trọng số của mỗi cung $(i, j)$ được gọi là $d_{ij}$, đại diện cho khoảng cách hoặc thời gian di chuyển.
- **Điều kiện:** $d_{ij} \ge 0$. Nếu hai nút không kết nối trực tiếp, $d_{ij} = \infty$.

### 2.2. Thuật toán Dijkstra
Thuật toán gán nhãn lặp (Labeling Procedure) được sử dụng làm lõi xử lý trên Backend:
- **Bước 0:** Gán nhãn vĩnh viễn (permanent label) có giá trị 0 cho nút gốc 1.
- **Bước 1:** Gán nhãn tạm thời (temporary label) cho các nút còn lại: $d_{1j}$ nếu kết nối trực tiếp với 1, hoặc $\infty$ nếu không kết nối. Chọn nhãn tạm thời nhỏ nhất để chuyển thành nhãn vĩnh viễn.
- **Bước 2:** Gọi nút vừa được gán nhãn vĩnh viễn là $l$. Cập nhật lại nhãn tạm thời cho các nút $j$ theo công thức: $\min\{\text{nhãn tạm thời của } j, \text{nhãn vĩnh viễn của } l + d_{lj}\}$.
- **Bước 3:** Tiếp tục chọn nhãn tạm thời nhỏ nhất biến thành nhãn vĩnh viễn.
- **Bước 4:** Lặp lại cho đến khi nút đích $n$ được gán nhãn vĩnh viễn.

### 2.3. Truy xuất ngược (Path Retracing)
Từ nút đích $n$, truy xuất ngược về nút 1 để tìm đường đi chính xác. Nút $j$ liền trước nút $n$ phải thỏa mãn:
(Nhãn vĩnh viễn của nút $j$) + $d_{jn}$ = (Khoảng cách ngắn nhất của nút $n$).

## 3. Kiến trúc Hệ thống (System Architecture)
Hệ thống được thiết kế theo mô hình Client-Server chia tách rõ ràng giữa Frontend (UI) và Backend (API).

### 3.1. Frontend (User Interface)
Chịu trách nhiệm tương tác người dùng, thu thập cấu trúc đồ thị và trực quan hóa kết quả.
- **Tech Stack:** React.js hoặc Vue.js.
- **Thư viện đồ họa:** Cytoscape.js, D3.js, hoặc React Flow (để vẽ đồ thị node/edge tương tác).
- **State Management:** Redux hoặc Zustand (quản lý trạng thái các nút và kết quả tính toán).

### 3.2. Backend (API & Algorithm Computation)
Chịu trách nhiệm xử lý logic kinh doanh, xác thực dữ liệu đầu vào và chạy thuật toán Dijkstra để trả về kết quả tối ưu.
- **Tech Stack:** Node.js (Express) hoặc Python (FastAPI/Flask). Khuyến nghị dùng Python nếu sau này muốn tích hợp thêm các thuật toán Graph phức tạp như A*, Bellman-Ford.
- Lõi thuật toán: Module tách biệt chỉ nhận đầu vào là Adjacency List (Danh sách kề) và trả ra mảng đường đi + tổng chi phí.

### 3.3. Database (Tùy chọn)
Nếu ứng dụng yêu cầu lưu trữ các bài toán đã giải hoặc cấu hình đồ thị của người dùng:
- **Tech Stack:** PostgreSQL (lưu trữ quan hệ người dùng/bài toán) hoặc MongoDB (lưu trữ nguyên cấu trúc JSON của đồ thị linh hoạt).

## 4. Giao tiếp dữ liệu (API Design)
Hệ thống sử dụng RESTful API với định dạng trao đổi JSON. Dưới đây là thiết kế API cốt lõi:

**Endpoint:** `POST /api/v1/shortest-path/calculate`
**Mô tả:** Nhận cấu trúc đồ thị, chạy Dijkstra và trả về kết quả.

**Request Body (JSON):**
```json
{
  "source": "1",
  "target": "6",
  "directed": false,
  "nodes": ["1", "2", "3", "4", "5", "6"],
  "edges": [
    { "source": "1", "target": "2", "weight": 3 },
    { "source": "1", "target": "3", "weight": 7 },
    { "source": "2", "target": "3", "weight": 2 }
  ]
}
```

**Response Body (JSON - Success):**
```json
{
  "status": "success",
  "data": {
    "shortest_distance": 10,
    "path": ["1", "4", "5", "6"],
    "calculation_steps": [
      "Khởi tạo nhãn vĩnh viễn cho nút 1 là 0",
      "Cập nhật nhãn tạm thời..."
    ]
  }
}
```

## 5. Tổ chức Cấu trúc Dữ liệu (Backend)
Để thuật toán Dijkstra chạy tối ưu với độ phức tạp $O((V + E) \log V)$ (với V là số đỉnh, E là số cung), cấu trúc dữ liệu trên Backend nên được triển khai như sau:

| Thành phần | Cấu trúc Dữ liệu sử dụng | Lý do sử dụng |
| :--- | :--- | :--- |
| **Đồ thị (Graph)** | Adjacency List (Danh sách kề) bằng Hash Map (Dictionary) | Tiết kiệm bộ nhớ hơn Ma trận kề, lặp qua các nút lân cận nhanh chóng. |
| **Hàng đợi ưu tiên** | Min-Priority Queue (Binary Heap) | Tìm nhanh nút có nhãn tạm thời nhỏ nhất ở Bước 1 & 3. |
| **Theo dõi nhãn** | Hash Map / Cặp Key-Value | Lưu chi phí ngắn nhất từ nguồn đến từng nút (`distances = {node: cost}`). |
| **Truy xuất ngược** | Hash Map (`previous_nodes`) | Lưu vết nút cha của một nút trên đường đi ngắn nhất để phục hồi kết quả. |

## 6. Luồng hoạt động của Người dùng (User Flow)
1. **Khởi tạo (Canvas Setup):** Người dùng truy cập UI, click vào vùng làm việc để tạo các Nút (Nodes).
2. **Kết nối (Edge Creation):** Người dùng kéo thả chuột giữa 2 nút để tạo Cung (Arc) và nhập giá trị khoảng cách $d_{ij}$.
3. **Thiết lập tham số (Parameter Setting):** Chọn nút Xuất phát ($s$) và nút Đích ($t$). Bấm nút "Tìm đường đi".
4. **Xử lý Backend:** UI gửi payload (định dạng JSON) xuống Backend API. Thuật toán Dijkstra được thực thi.
5. **Trực quan hóa (Visualization):** Backend trả kết quả. UI dùng animation để đổi màu (ví dụ: màu đỏ/dày hơn) cho các cung nằm trên đường đi ngắn nhất, đồng thời hiển thị tổng chi phí trên bảng thông báo.
