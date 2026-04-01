# Module Frontend: User Interface

## Tổng quan
Giao diện web cho phép người dùng vẽ đồ thị trực quan, kéo thả các cung (edges), chỉ định gốc/đích, và xem animation thuật toán.

## Tech Stack
- **Framework:** React.js (khởi tạo bằng Vite).
- **Styling:** TailwindCSS hoặc CSS truyền thống (tập trung vào Modern UI, Glassmorphism).
- **Graph Visualization:** React Flow (đề xuất, dễ tương tác và customize giao diện đỉnh/cung).
- **State Management:** Zustand (để giữ trạng thái đồ thị và kết quả của API).

## Cấu trúc Thư mục (Dự kiến)
```
frontend/
├── src/
│   ├── components/
│   │   ├── GraphCanvas.jsx      # Khu vực vẽ đồ thị tương tác
│   │   ├── ControlPanel.jsx     # Nút bấm, chọn gốc/đích
│   │   └── ResultPanel.jsx      # Hiển thị đường đi, khoảng cách, logs
│   ├── store/
│   │   └── useGraphStore.js     # Trạng thái Zustand
│   ├── app.jsx                  # Main view layout
│   └── index.css                # Global styles, variables
```

## Luồng hoạt động
1. Người dùng double-click lên Canvas (React Flow) để tạo một Node mởi.
2. Người dùng kéo Handle từ Node này sang Node khác để tạo Edge, sau đó nhập trọng số (khoảng cách) thông qua một Pop-up nhỏ.
3. Chọn Node Source và Node Target trong ControlPanel.
4. Nhấn "Run". Gọi fetch tới Backend API.
5. Đổi màu đường đi shortest_path sang màu đỏ/dày trên GraphCanvas.
