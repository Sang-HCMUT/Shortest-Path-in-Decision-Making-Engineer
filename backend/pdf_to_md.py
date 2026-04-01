import sys
import os

try:
    import pymupdf4llm
except ImportError:
    print("Lỗi: Thư viện pymupdf4llm chưa được cài đặt.")
    print("Vui lòng chạy lệnh sau trong terminal để cài đặt:")
    print("pip install pymupdf4llm")
    sys.exit(1)

def convert_pdf_to_md(pdf_path):
    """
    Hàm đọc file PDF trên máy và chuyển sang định dạng Markdown.
    Hỗ trợ cả trích xuất bảng (tables) và văn bản tốt nhất nhờ pymupdf4llm.
    """
    if not os.path.exists(pdf_path):
        print(f"Lỗi: Không tìm thấy file tại đường dẫn: {pdf_path}")
        return

    print(f"Đang xử lý file PDF: {pdf_path}\n(có thể mất một lát nếu file nhiều trang)...")
    
    try:
        # Sử dụng pymupdf4llm chuyển đổi PDF thành chuỗi Markdown
        md_text = pymupdf4llm.to_markdown(pdf_path)
        
        import re
        # Khắc phục lỗi font hiển thị dấu bullet (chấm đầu dòng) thành ô vuông
        md_text = md_text.replace("\ufffd", "-")
        # Xoá dòng bản quyền tác giả lặp lại ở mỗi đuôi trang (vd: © 2006 – 2009 George Gross...)
        md_text = re.sub(r'\*\*(?:©|\\(c\\)).*?(?:All Rights Reserved|Reserved\.).*?\*\*', '', md_text, flags=re.IGNORECASE)
        md_text = re.sub(r'(?:©|\\(c\\)).*?(?:All Rights Reserved|Reserved\.).*?\n', '', md_text, flags=re.IGNORECASE)
        # Xoá các vùng trắng thừa thãi (nhiều hơn 3 dòng trống)
        md_text = re.sub(r'\n{3,}', '\n\n', md_text)
        
        # Lấy tên file gốc và lưu vào thư mục architecture của dự án
        base_name = os.path.splitext(os.path.basename(pdf_path))[0]
        script_dir = os.path.dirname(os.path.abspath(__file__))
        architecture_dir = os.path.join(os.path.dirname(script_dir), "architecture")
        os.makedirs(architecture_dir, exist_ok=True)
        
        output_file = os.path.join(architecture_dir, f"{base_name}.md")
        
        # Lưu vào file `.md`
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_text)
            
        print(f"Hoàn tất! File Markdown đã được tạo:")
        print(f"{os.path.abspath(output_file)}")

    except Exception as e:
        print(f"Có lỗi trong lúc chuyển đổi: {e}")

if __name__ == "__main__":
    # Nếu người dùng truyền đường dẫn trực tiếp qua cmd thì ưu tiên dùng
    if len(sys.argv) >= 2:
        pdf_input_path = sys.argv[1]
    else:
        # Bật tính năng hộp thoại Windows (thư viện có sẵn của Python)
        import tkinter as tk
        from tkinter import filedialog
        
        print("Đang mở hộp thoại File Explorer trên máy tính để bạn tự chọn file...")
        root = tk.Tk()
        root.withdraw() # Ẩn đi cửa sổ nền của tkinter
        root.attributes('-topmost', True) # Buộc hộp thoại luôn nổi lên trên cùng (không bị lấp phía sau)
        
        # Hiện hộp thoại hỏi lấy file
        pdf_input_path = filedialog.askopenfilename(
            title="Chọn file PDF cần chuyển qua Markdown",
            filetypes=[("Tài liệu PDF", "*.pdf"), ("Tất cả file", "*.*")]
        )
        
    # Process
    if pdf_input_path:
        convert_pdf_to_md(pdf_input_path)
    else:
        print("🔌 Bạn đã huỷ không chọn file nào. Thoát chương trình...")
