# Frontend

## Tổng quan
Giao diện cho phép người dùng vẽ đồ thị, chỉ định source/target và xem kết quả trực quan.

## Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** TailwindCSS
- **Graph Visualization:** React Flow
- **State Management:** Zustand

## Cấu trúc Thư mục
```
frontend/
├── src/
│   ├── components/
│   │   ├── GraphCanvas.jsx      # Render Canvas và xử lý tương tác kéo thả đồ thị
│   │   ├── ControlPanel.jsx     # Panel nhập liệu, chọn mode (Shortest Path/Max Flow)
│   │   └── ResultPanel.jsx      # Hiển thị Execution Logs và kết quả
│   ├── store/
│   │   └── useGraphStore.js     # Quản lý state tập trung cho toàn app
│   ├── app.jsx                  # Layout chính
│   └── index.css                # Global CSS
```

## Luồng hoạt động
1. Double-click lên Canvas để tạo Node mới.
2. Kéo thả giữa các handle của Node để tạo Edge. Click vào Edge để nhập trọng số/sức chứa.
3. Chọn Source Node và Target Node trên ControlPanel.
4. Nhấn "Run". Gọi fetch API xuống Backend.
5. Nhận kết quả từ API, đổi màu đường đi tối ưu (Shortest Path) hoặc highlight bottleneck (Max Flow) trực tiếp trên GraphCanvas.
