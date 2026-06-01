# Caro AI 8x8

Một trò chơi Gomoku (Caro) chạy trên web, nơi người chơi đối đầu với AI.<br>
AI được xây dựng bằng **Flask backend** kết hợp **Minimax algorithm with Alpha-Beta Pruning** và hàm đánh giá **heuristic**.

---

## 🎮Features

- Chơi Gomoku (Caro) trên bàn cờ 8x8 
- Đối đầu với AI
- Có nhiều mức độ khó
- Giao diện web đẹp, responsive, hoạt động mượt trên mọi thiết bị
- AI tạo nước đi nhanh
- Không yêu cầu đăng nhập (chơi ngay)
- Thống kê thành tích

--- 

## 📁Project Structure

```
CARO-AI
|         
├── engine/  
│   ├── Dockerfile                        # Build container
│   ├── ai.py                             # Core AI engine 
│   ├── app.py                            # Flask API server for moves
│   ├── board.py                          # Board and game rules 
│   ├── config_para.json                  # Parameters 
│   ├── requirements.txt                  # Dependencies
│   ├── static/          
|   |   ├── favicon.ico                   # Browser icon
│   │   ├── css/              
|   |   |   ├── bootstrap.min.css         # Bs5 framework 
│   │   │   ├── error.css                 # Style error page
│   │   │   ├── intro.css                 # Style home
│   │   │   └── style.css                 # Game UI styling
│   │   └── js/          
|   |       ├── bootstrap.bundle.min.js   # Js bs5  
│   │       ├── jquery.min.js             # Jquery  
│   │       └── script.js                 # Frontend logic and API calls  
│   └── templates/             
│       ├── 500.html                      # Server error page
│       ├── index.html                    # Game page
│       └── intro.html                    # Home page  
| 
├── .dockerignore                         # Docker build ignore rules
├── .gitignore                            # Files ignored by Git
├── docker-compose.yaml                   # Orchestration
├── run-app.sh                            # Run app local
├── create-container.sh                   # Build & run Docker
├── gunicorn.sh                           # Run with Gunicorn
├── LICENSE                               # License
└── README.md                             # This Document 
```

---

## 🧠AI Core Flow

```
AI sẽ xác định nước đi tốt nhất bằng cách sử dụng một chuỗi các bước:

Player đánh
     │
     ▼
Phân tích board state
     │
     ▼
Tactical Evaluation
     │
     ▼
Sinh các nước đi tiềm năng
     │
     ▼
Move Scoring (heuristic)
     │
     ▼
Minimax (alpha-beta)
     │
     ▼
Trả kết quả best move
```
### &nbsp; &nbsp; ⚡Tối ưu ở level Hard:

🟣 Phát hiện nước thắng tức thời.<br>
🟣 Chặn mọi nước thắng tức thời của đối thủ.<br>
🟣 Nhận diện các Threat nguy hiểm.<br>
🟣 Tối ưu tìm kiếm bằng Alpha-Beta Pruning.<br>
🟣 Sử dụng bộ nhớ đệm để giảm tính toán lặp lại.<br>
🟣 Phân tích nhiều lớp nước đi trong tương lai.<br>
🟣 Ưu tiên các chuỗi ép thắng và phòng thủ bắt buộc.<br>

### &nbsp; &nbsp; 🔍Kết quả:
<p>
AI được thiết kế để không bỏ sót các nước thắng hoặc nước chặn quan trọng, có khả năng phòng thủ gần như tuyệt đối trước các chiến thuật phổ biến (cơ bản) trên bàn cờ 8×8.
</p>

---

## 📊Performance
**(+):** Minimax kết hợp Alpha-Beta Pruning trên bàn cờ 8x8:

| Độ khó | Algorithm | Avg Response Time | Số lượng states ước tính|
|---|---|---|---|
| Easy | Random / Basic Heuristic | < 1ms | ~1-100 |
| Medium | Depth-Limited Minimax | ~10-80ms | ~1,000-8,000 |
| Hard | α-β Pruning + Threat Analysis | ~100ms-1.2s | ~10,000-60,000+ |

&nbsp; &nbsp;  &nbsp;  &nbsp;  &nbsp; **NOTE:** 
- Alpha-Beta Pruning giảm  ~60% số states đánh giá so với Minimax thuần.
- Nhiều worker Gunicorn giúp tăng throughput khi có nhiều request đồng thời, làm giảm thời gian avg response trong các tình huống tải cao.
---

## 🛡️Security
 &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚫**Anti-abuse**
- Từ chối request JSON không hợp lệ hoặc thiếu dữ liệu
- Giới hạn tốc độ (chống spam)
- Giới hạn toàn hệ thống: 100 request / phút
- Endpoint /move: 60 request / phút
- Chặn bot tự động spam AI / flood request
- Ngăn quá tải server
- Hạn chế một số dạng DoS ở mức ứng dụng

#### &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Input Validation✅
- API **/move** chỉ nhận dữ liệu hợp lệ: &nbsp; <b style="color: #87CEEB">X</b> (player) | <b style="color: red">O</b> (AI) | ⚪(ô trống) 
- Độ khó: &nbsp; (&nbsp;-1 = Easy&nbsp;&nbsp;|&nbsp;&nbsp;0  = Medium&nbsp;&nbsp;|&nbsp;&nbsp;1  = Hard&nbsp;)

---

## 🛠️Tech Stack

- *Python*
- *Flask*
- *JavaScript*
- *HTML / CSS*
- *Bootstrap 5*
- *Docker*

---

## 📋Prerequisites

Trước khi chạy project, hãy đảm bảo đã cài đặt:
- Python 3.12+
- pip
- Docker & Docker Compose (nếu chạy bằng Docker)

Kiểm tra phiên bản Python:
```bash
python --version
```

Kết quả mong muốn:
```text
Python 3.12.x
```

---

## 🚀Quick Start

```bash
git clone 'url'
cd caro-ai

# Option 1 — Chạy local trên Linux 
# script sẽ tạo môi trường ảo, cài thư viện và chạy Flask
chmod +x run-app.sh
./run-app.sh 

# Option 2 — Chạy bằng Docker (recommended)
# chạy script build + run container
chmod +x create-container.sh
./create-container.sh

# Option 3 — Chạy bằng Gunicorn (production)
# chạy 4 workers 2 threads -timeout 150
chmod +x gunicorn.sh
./gunicorn.sh
```

WINDOWS🪟:
```bash
git clone 'url'
cd caro-ai
python -m venv .venv
.venv\Script\activate
pip install -r engine\requirements.txt
python engine\app.py
```

Then open:
```text
http://localhost:5100
```
---

## 📄License

This project is licensed under the MIT License.<br>
Được phép sử dụng, chỉnh sửa, học tập và phát triển dự án cho mục đích cá nhân.

---

## 👤Author

Project minh họa các kỹ thuật Trí tuệ Nhân tạo trong tìm kiếm trên board game.
- Game theory
- Heuristic evaluate
- Alpha-Beta Pruning

*"Phiên bản nâng cấp của repo caro-5x5"*
<h3>Phạm Nguyễn Long Hải</h3>

---

<h2 align="center"><b>💗 This project is open source 💗</b></h2> 
