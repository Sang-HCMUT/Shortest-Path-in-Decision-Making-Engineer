# Workflow, Deployment & UI Improvements

## 1. Phân tích Workflow (Luồng Công việc Phát triển)
Để đảm bảo quá trình phát triển dự án diễn ra trơn tru, đây là Workflow đề xuất:

1. **Khởi tạo và Setup:**
   - Phân chia Frontend và Backend thành hai thư mục độc lập (e.g., `frontend/` và `backend/`).
   - Thiết lập môi trường ảo (ví dụ `venv` hoặc `conda`) cho Backend, cài đặt `requirements.txt`.
   - Cài đặt dependency cho Frontend bằng `npm install` hoặc `yarn`.
2. **Phát triển Tính năng độc lập (Tách biệt logic):**
   - **Backend:** Xây dựng API tính toán đường đi với dữ liệu mẫu (Mock data), kiểm thử qua Swagger UI tích hợp sẵn trong FastAPI.
   - **Frontend:** Xây dựng giao diện tĩnh (Static UI), màn hình vẽ đồ thị trực quan và state logic cục bộ.
3. **Tích hợp (Integration):**
   - Cấu hình CORS để Frontend chạy ở localhost có thể gọi tới Backend API.
   - Tích hợp gọi API thật từ Frontend và xử lý hiển thị kết quả (tích hợp logic vẽ đường đi).
4. **Code Quality & Review:**
   - Sử dụng ESLint, Prettier cho Frontend chuẩn hóa code style.
   - Dùng Pylint, Black cho Frontend theo chuẩn PEP8.

## 2. Deploy cơ bản bằng GitHub Pages (github.io)
Vì Backend sử dụng API động (Python FastAPI) nên không thể host thẳng trên GitHub Pages (do nó chỉ hỗ trợ Web tĩnh HTML/CSS/JS). Do đó, chúng ta sẽ áp dụng chiến lược **Hybrid Deployment**:

### 2.1. Deploy Frontend trên GitHub Pages
Sẽ sử dụng package **gh-pages** để tự động hoá quy trình.
1. Cài đặt package trong Frontend: `npm install gh-pages --save-dev`
2. Bổ sung cấu hình vào `package.json`:
   - Trường `homepage`: `"homepage": "https://<username>.github.io/<repository-name>"`
   - Scripts: 
     `"predeploy": "npm run build"`
     `"deploy": "gh-pages -d dist"` (Dùng `build` đối với Create-React-App, `dist` với Vite React).
3. Cấu hình base path (Nếu dùng Vite): 
   Trong `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/<repository-name>/', // Base URL của repo GitHub
     plugins: [react()],
   })
   ```
4. Đẩy mã nguồn lên Github và chạy lệnh `npm run deploy`.

### 2.2. Xử lý Backend API (Tùy chọn Deploy)
- Các API endpoints của FastAPI không thể chạy trên Github Pages. Ta có thể deploy Backend lên các nền tảng chạy Server nhỏ (như **Render**, **Railway**, hay **Vercel** - dùng serverless functions).
- Frontend (trên GitHub Pages) sẽ tự động fetch dữ liệu qua URL API đã deploy trên nền tảng đó. Do Frontend chỉ cung cấp static assets (UI vẽ đồ thị).

--- 

## 3. Cải thiện UI (Giao diện Người dùng)
Để tạo một ứng dụng Modern, bắt mắt và đem đến trải nghiệm tốt (UX), Dưới đây là các định hướng thiết kế và cải tiến giao diện chính:

### 3.1. Phong cách Thiết kế & Bố cục (Layout & Theme)
- **Glassmorphism / Frosted Glass Effect:** Thanh công cụ và bảng thông tin (Control Panel, Results Panel) sẽ sử dụng hiệu ứng hộp thoại làm mờ (backdrop-blur) trên một màu nền gradient hiện đại tối (như màu Midnight Blue và Purple).
- **Bố cục Flexbox:** Giao diện chia làm hai khu vực. Một phần Sidebar nhỏ bé chứa các công cụ cần thiết, phần còn lại tràn màn hình là khung Canvas (khu vực vẽ đồ thị tương tác).

### 3.2. Cải thiện Trải nghiệm Điều hướng (UX)
- **Draggable Nodes:** Nút và nhãn được kéo/thả mượt mà. (Dùng React Flow cho tương tác tự nhiên).
- **Animation Thuật toán Trực quan:** 
  Đây là linh hồn của app Dijkstra. Thay vì ra ngay kết quả, ta bổ sung một nút "Chạy thuật toán từng bước".
  *Thuật toán chạy sẽ animate:* Nút duyệt đổi sang Vàng, cập nhật trọng số nhỏ nhất hiển thị trực tiếp. Khi kết thúc, cung tối ưu sáng lên màu Xanh Lá (Glow/Thicker stroke).
- **Dark/Light Mode:** Nút Toggle trên góc phải thay đổi phối màu toàn bộ giao diện và style Canvas ngay lập tức.

### 3.3. Các Hiệu ứng Vi mô (Micro-Interactions)
- Hover vào một vị trí đỉnh cụ thể sẽ làm to đỉnh lên nhẹ (scale 1.1) kèm theo glow shadow.
- Tooltip khi rê chuột vào Cung sẽ hiển thị Chi phí của cung đó một cách rõ nét thay vì chỉ ghi chữ nhỏ lên đường đi.
