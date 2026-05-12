# Cấu trúc Phát triển, Deployment & UI

## 1. Workflow Phát triển
- **Backend:** Code trong thư mục `backend/`. Dùng FastAPI tĩnh. Chạy môi trường ảo `venv`, cài `requirements.txt`. Test qua Swagger (có sẵn ở `/docs`).
- **Frontend:** Code trong thư mục `frontend/`. Framework React/Vite. Cài dependencies bằng `npm install`. Vẽ đồ thị tĩnh bằng React Flow trước.
- **Tích hợp:** Thiết lập CORS trên FastAPI để cho phép `localhost` gọi API. Chạy song song cả hai để test luồng từ thao tác trên canvas -> gọi API -> trả kết quả.

## 2. Deployment

Do đặc thù Client-Server (Frontend tĩnh, Backend API Python), hệ thống dùng chiến lược Hybrid:

### 2.1. Frontend (GitHub Pages)
- Dùng package `gh-pages`.
- Cấu hình base path trong `vite.config.js`: `base: '/Shortest-Path-in-Decision-Making-Engineer/'`.
- `npm run build` -> Đẩy thư mục `dist` lên nhánh `gh-pages`.

### 2.2. Backend (Render / VPS)
- Deploy FastAPI lên Render (hoặc nền tảng tương tự).
- Render nhận code từ nhánh main, tự động build và expose endpoint API.
- Cập nhật URL backend thật vào biến fetch trong code Frontend để hoàn tất tích hợp trên production.

## 3. UI/UX 

### 3.1. Bố cục & Theme
- Thiết kế chia 2 cột: Sidebar trái chứa panel điều khiển/log, Canvas chiếm diện tích còn lại.
- Dùng CSS/Tailwind tạo hiệu ứng Glassmorphism (làm mờ nền). 

### 3.2. Trải nghiệm
- **Draggable Nodes:** Sử dụng React Flow cho thao tác kéo thả node, nối các handle.
- **Animation thuật toán:** Trực quan hóa kết quả tìm được (như đổi màu nét vẽ thành đỏ/dày) sau khi nhận API response thay vì chỉ in ra text.
- Hỗ trợ phím tắt (Backspace/Delete) để xóa element.

### 3.3. Micro-Interactions
- Hover effects trên nodes/edges.
- Tooltip hoặc nhãn hiển thị trọng số rõ ràng ngay trên đường nối.
