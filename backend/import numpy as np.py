import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, RadioButtons
import scipy.signal as signal
import warnings

# Bỏ qua cảnh báo chia cho 0 trong một số phép tính toán học
warnings.filterwarnings("ignore")

# ==========================================
# 1. THIẾT LẬP THÔNG SỐ HỆ THỐNG
# ==========================================
fs = 100e9                    # Tần số lấy mẫu: 100 GHz (độ phân giải cao cho tín hiệu ns)
dt = 1 / fs
t = np.arange(-5e-9, 5e-9, dt) # Trục thời gian từ -5ns đến 5ns
fc = 6.5e9                    # Tần số trung tâm RF (Channel 5 của UWB): 6.5 GHz

# ==========================================
# 2. CÁC HÀM TẠO DẠNG XUNG (BASEBAND)
# ==========================================
def generate_rrc(pw_ns):
    """Root-Raised Cosine (Chuẩn Giao tiếp)"""
    T_sym = pw_ns * 1e-9
    beta = 0.3
    t_safe = t + 1e-16 # Tránh lỗi Divide by Zero
    num = np.sin(np.pi * t_safe / T_sym * (1 - beta)) + 4 * beta * t_safe / T_sym * np.cos(np.pi * t_safe / T_sym * (1 + beta))
    den = np.pi * t_safe / T_sym * (1 - (4 * beta * t_safe / T_sym)**2)
    pulse = num / den
    return pulse / np.max(np.abs(pulse))

def generate_butterworth(pw_ns):
    """Butterworth Impulse (Chuẩn Định vị - Đo ToF)"""
    fc_filter = 1e9 / pw_ns
    b, a = signal.butter(8, 2 * np.pi * fc_filter, analog=True)
    t_pos = t[t >= 0]
    _, y = signal.impulse((b, a), T=t_pos)
    pulse = np.zeros_like(t)
    pulse[t >= 0] = y
    if np.max(np.abs(pulse)) > 0:
        pulse = pulse / np.max(np.abs(pulse))
    return pulse

def generate_kaiser(pw_ns):
    """Kaiser Window (Chuẩn Cảm biến/Radar)"""
    N = int((pw_ns * 1e-9) / dt)
    if N % 2 == 0: N += 1
    w = signal.windows.kaiser(N, 10) # Hệ số shape beta = 10
    pulse = np.zeros_like(t)
    start = len(t)//2 - N//2
    end = start + len(w)
    if start >= 0 and end <= len(t):
        pulse[start:end] = w
    return pulse

# ==========================================
# 3. HÀM TÍNH TOÁN PHỔ TẦN SỐ (FFT)
# ==========================================
def calculate_spectrum(pulse):
    # Trộn với tần số mang (Up-conversion) để đưa tín hiệu vào dải tần UWB
    rf_pulse = pulse * np.cos(2 * np.pi * fc * t)
    
    N = len(rf_pulse)
    freqs = np.fft.fftfreq(N, dt)[:N//2]
    spectrum = np.abs(np.fft.fft(rf_pulse))[:N//2]
    
    # Chuẩn hóa về dB
    spectrum_norm = spectrum / np.max(spectrum)
    spectrum_db = 20 * np.log10(spectrum_norm + 1e-12)
    return freqs, spectrum_db

# ==========================================
# 4. GIAO DIỆN & TƯƠNG TÁC (MATPLOTLIB)
# ==========================================
fig, (ax_time, ax_freq) = plt.subplots(2, 1, figsize=(12, 8))
plt.subplots_adjust(bottom=0.35, hspace=0.4) # Chừa không gian bên dưới cho nút bấm

# Khởi tạo giá trị mặc định
current_type = 'RRC (Communication)'
current_pw = 2.0

# Hàm vẽ lại đồ thị
def update_plot():
    ax_time.clear()
    ax_freq.clear()
    
    # Sinh xung theo loại
    if 'RRC' in current_type:
        pulse = generate_rrc(current_pw)
    elif 'Butterworth' in current_type:
        pulse = generate_butterworth(current_pw)
    else:
        pulse = generate_kaiser(current_pw)
        
    # Lấy phổ tần số
    freqs, spectrum_db = calculate_spectrum(pulse)
    
    # Vẽ miền thời gian
    ax_time.plot(t * 1e9, pulse, color='#1f77b4', lw=2)
    ax_time.set_title(f'Miền Thời Gian: Hình Dạng Xung - {current_type}')
    ax_time.set_xlabel('Thời gian (ns)')
    ax_time.set_ylabel('Biên độ tương đối')
    ax_time.set_xlim(-5, 5)
    ax_time.grid(True, linestyle='--', alpha=0.6)
    
    # Vẽ miền tần số
    ax_freq.plot(freqs / 1e9, spectrum_db, color='#d62728', lw=2)
    ax_freq.set_title('Miền Tần Số: Phổ Năng Lượng')
    ax_freq.set_xlabel('Tần số (GHz)')
    ax_freq.set_ylabel('Mật độ phổ (dB)')
    ax_freq.set_xlim(0, 12)
    ax_freq.set_ylim(-80, 5)
    
    # Highlight dải chuẩn UWB
    ax_freq.axvspan(3.1, 10.6, color='gold', alpha=0.2, label='Dải tần UWB (3.1 - 10.6 GHz)')
    ax_freq.legend(loc='upper right')
    ax_freq.grid(True, linestyle='--', alpha=0.6)
    
    fig.canvas.draw_idle()

# --- Thiết lập UI Controls ---
ax_slider = plt.axes([0.25, 0.15, 0.65, 0.03])
slider_pw = Slider(ax_slider, 'Độ rộng xung (ns)', 0.5, 4.0, valinit=current_pw, valstep=0.1)

ax_radio = plt.axes([0.05, 0.05, 0.25, 0.15])
radio_type = RadioButtons(ax_radio, ('RRC (Communication)', 'Butterworth (Ranging/ToF)', 'Kaiser (Sensing)'))

# Các hàm callback khi thay đổi UI
def on_slider_change(val):
    global current_pw
    current_pw = val
    update_plot()

def on_radio_change(label):
    global current_type
    current_type = label
    update_plot()

slider_pw.on_changed(on_slider_change)
radio_type.on_clicked(on_radio_change)

# Vẽ đồ thị lần đầu
update_plot()
plt.show()