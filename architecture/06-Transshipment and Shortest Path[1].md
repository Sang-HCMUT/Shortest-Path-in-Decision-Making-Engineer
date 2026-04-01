# Kiến thức: Mạng lưới Transshipment (Max Flow) & Đường đi ngắn nhất (Shortest Path)

*Tài liệu tóm tắt từ Lecture ECE 307: Transshipment & Shortest Path Problems.*
Tài liệu hướng dẫn giải quyết 2 bài toán kinh điển trên đồ thị: Tìm tổng lưu lượng hàng hóa tối đa có thể chuyển qua mạng (Max Flow) và Tuyến đường vận chuyển tốn ít chi phí/thời gian nhất (Shortest Path).

---

## PHẦN A: BÀI TOÁN LUỒNG CỰC ĐẠI (MAX FLOW PROBLEM)

### 1. Giới thiệu bài toán phân bổ (Transshipment)
- **Mục tiêu:** Vận chuyển một loại hàng hóa từ **Điểm nguồn (Source - $s$)** đến **Điểm đích (Sink - $t$)** thông qua vô số các điểm trung chuyển (transshipment points) đan xen.
- **Sức chứa (Capacity - $k_{ij}$):** Mỗi tuyến đường (cung $(i, j)$) đều có giới hạn tải trọng lớn nhất không được phép vượt qua. 
- **Yêu cầu:** Xác định chiến lược phân bổ lượng hàng hóa $f_{ij}$ chạy trên từng đường mòn sao cho đạt được **Tổng luồng cực đại (Maximal Flow)** bơm từ $s$ đến $t$.
  - Điều kiện 1 ($\text{Sức chứa}$): Lượng hàng trên 1 đường không được vượt sức chứa $0 \le f_{ij} \le k_{ij}$.
  - Điều kiện 2 ($\text{Bảo toàn luồng}$): Tại các điểm trung chuyển, tổng lượng hàng gom vào phải bằng tổng lượng hàng xả đi. Trừ hao tụt luồng là không được phép.

### 2. Định lý Max-Flow Min-Cut (Luồng Cực Đại - Lát Cắt Cực Tiểu)
Cốt tủy của bài toán là xác định xem hệ thống bị "nghẽn cổ chai" ở đâu thông qua Lát cắt (Cut):
- **Lát cắt:** Sự kiện "chia cắt" hệ thống thành 2 phân khu $S$ (chứa $s$) và $T$ (chứa đích $t$). Sức chứa của một lát cắt (Cut capacity) tính bằng tổng giới hạn tải trọng (Capacity) của các con đường hướng từ chùm $S$ trút qua chùm $T$.
- Tưởng tượng ta phá dỡ tất cả các đường thuộc mặt cắt này thì mạng lưới sẽ đứt đoạn, hàng hóa không thể qua đích được nữa.
- **Định lý chốt hệ:** Lượng hàng tối đa (Max Flow) bơm được qua toàn đồ thị luôn **bằng đúng giới hạn** của Lát cắt yếu nhất/có sức chứa nhỏ nhất (Min Cut).
  $$\text{Max Flow} = \text{Min Cut}$$

### 3. Thuật toán tìm cách phân bổ Max Flow (Labeling Procedure)
Để tìm ra được sơ đồ phân bổ tối ưu, thuật toán phải tìm cách bơm dần từng ít lưu lượng một vào qua cái gọi là **Đường tăng luồng (Flow Augmenting Path)**:
- Khởi tạo hệ thống trống không (hoặc 1 luồng flow hợp lệ).
- **Bước 1 (Dán nhãn tìm đường):** Bắt đầu rà soát và đánh dấu đường đi từ nút này sang nút khác có khả năng dẫn luồng. Từ đỉnh đang đứng $i$, ta tìm đỉnh kế $j$ bằng 1 trong 2 quyền:
  1. *Đi xuôi chiều (Forward arc):* Tuyến $(i, j)$ vẫn còn chỗ trống chưa chở hết hàng ($f_{ij} < k_{ij}$).
  2. *Đi ngược chiều (Backward arc):* Tuyến $(j, i)$ hiện đang có chở hàng từ trên xuống ($f_{ji} > 0$). Việc đi ngược chiều này giống như cơ chế "hủy lệnh", lấy bớt số hàng đó để nén qua đường khác.
- **Bước 2 (Bơm hàng):** Nếu may mắn rà soát dán nhãn được chạm tới tận đích $t$, ta vừa tìm được 1 đường dẫn mới. Giới hạn bơm thêm $\delta$ dọc con đường này sẽ bằng lượng khe hở (hoặc luồng ngược) bé nhất nấp trên con đường đó.
- **Bước 3 (Chỉnh sổ sách):** Nâng cấp lưu lượng phân bổ (Cộng $\delta$ vào các cung đi tiến và Trừ $\delta$ khỏi cung đi lùi vừa mượn đường).
- **Kết luận:** Quay lại Bước 1 quét tiếp. Vòng lặp dừng khi mạng lưới kẹt cứng đến mức **không thể dán nhãn chạm tới đích $t$ được nữa**. Xác nhận hệ thống đạt điểm bão hoà (Max Flow) hoàn chỉnh lộ trình phân bổ hàng hoá.

---

## PHẦN B: BÀI TOÁN ĐƯỜNG ĐI NGẮN NHẤT (SHORTEST PATH PROBLEM)

Trong khi đỉnh chóp của luồng cực đại bỏ qua chi phí đường xá để tối ưu lưu lượng tổng, Shortest Path lại ưu tiên giải quyết việc tiết kiệm khoảng cách/chi phí cho duy nhất 1 chuyến hàng/người chạy từ xuất phát ra đích (Bài toán định tuyến).

### 1. Mô hình đồ thị (Shortest Route Problem)
- Vẫn trên mạng lưới đỉnh $1 \dots n$, mỗi cung $(i, j)$ được gắn **Trọng số ($d_{ij} \ge 0$)** thay vì giới hạn sức chứa. Trọng số đóng vai trò làm giá vé, thời gian di chuyển, khoảng cách địa lý.
- Có thể dùng cho mọi trường hợp đồ thị vô hướng, đồ thị có chiều. Coi chi phí là $\infty$ với 2 đỉnh bị ngắt kết nối.

### 2. Thuật toán Dijkstra (The Dijkstra Algorithm)
Điểm rơi cốt lõi của lý thuyết ứng dụng vào viết Code. Hoạt động trên kỹ thuật liên tục đánh nhãn nhằm loại bỏ tất cả các con đường tốn chi phí.

- **Nhãn tạm thời (Temporary label):** Chi phí tìm được tốt nhất *hiện tại*. (Có thể sửa lại nếu tìm được đường rẻ hơn).
- **Nhãn vĩnh viễn (Permanent label):** Cột mốc xác nhận đã chốt khoảng cách ở mức Rẻ Nhất từ điểm xuất phát, bất khả xâm phạm.

**Cách nó hoạt động:**
- Mở màn (Bước 0): Gán nhãn Vĩnh viễn bằng `0` vào ngay vị trí xuất phát. Mọi trạm khác nhận Nhãn tạm thời bằng $\infty$. 
- Tiếp theo (Bước 1): Cập nhật Nhãn tạm thời cho những trạm kế bên nối liền với chạm gốc bằng khoảng cách $d_{1j}$.
- Tìm Mốc (Bước 2): Tự động đảo qua xem trạm nào đang nắm trong tay con số Nhãn tạm thời THẤP NHẤT $\rightarrow$ Chốt kiểm duyệt biên trạm ấy thành **Nhãn vĩnh viễn**. (Ví von: đây là ngõ cột mốc chắc chắn nhất không thể đi đường nào tốt hơn).
- Cập nhật mới (Tái định tuyến): Nhờ đứng từ trạm mới vĩnh viễn trên, ta nhìn xuyên ra các trạm chưa chốt xung quanh và so sánh:
  $$\text{Nhãn tạm cũ} \quad \text{vs} \quad \text{Nhãn vĩnh viễn vừa chốt} + d$$
  Nếu lối đứng từ trạm mới này dẫn tới mà tiết kiệm hơn con số nhãn cũ đang gánh $\rightarrow$ Sửa nhãn cũ thấp xuống theo chỉ số mới.
- Quá trình "Lấy nhãn nhỏ nhất làm Vĩnh viễn rồi đem nhìn ra cập nhật Nhãn Tạm xung quanh" cứ cuộn lặp liên tục cho tới khi **Nhãn đích được đóng dấu vĩnh viễn**. Quá trình giải quyết xong.

### 3. Tìm lại đường đã đi (Path Retracing)
Xong thuật toán là ta mới nắm được con số chi phí tiết kiệm đỉnh nhất (Ví dụ: Chạy mất 10 đồng). Để vẽ lại được đường bản đồ chạy qua các ngã cụ thể:
- Đặt bút tại điểm đích ngược dần về mốc nguồn một cách suy ngược.
- Hỏi trạm sát liền phía trước: "Có phải khoảng cách vĩnh viễn của ông cộng thêm mã phí cầu đường từ nhà ông bước sang nhà tôi ($d_{jn}$) bằng đúng con số vĩnh viễn của tôi đang giữ không?"
- Thỏa mãn thì trạm đó đích thực nằm trên đường ngắn nhất! Lần mò tương tự lùi tới tận chuồng xuất phát. (Đây là cái mà App của bạn lập trình lưu truy vết trong biến `previous_nodes`).
