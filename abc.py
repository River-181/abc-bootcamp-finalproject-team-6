# Create an SVG architecture/algorithm diagram for the project
import math, textwrap, os, json

W, H = 1600, 900
svg_elems = []

def rect(x,y,w,h,rx=12,ry=12,fill="#FFFFFF",stroke="#111111",sw=2,opacity=1.0):
    svg_elems.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{opacity}"/>')

def text(x,y,content,fontsize=18,weight="normal",anchor="start"):
    content = content.replace("&", "&amp;").replace("<","&lt;").replace(">","&gt;")
    svg_elems.append(f'<text x="{x}" y="{y}" font-family="Pretendard, Inter, Arial, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="{fontsize}" font-weight="{weight}" text-anchor="{anchor}" fill="#111111">{content}</text>')

def multiline_text(x,y,content,max_width_chars=34,leading=22,fontsize=16,anchor="start"):
    wrapper = textwrap.TextWrapper(width=max_width_chars, replace_whitespace=False, drop_whitespace=False)
    lines = []
    for line in content.split("\n"):
        if len(line.strip())==0:
            lines.append("")
        else:
            lines.extend(wrapper.wrap(line))
    cy = y
    for ln in lines:
        text(x, cy, ln, fontsize=fontsize, anchor=anchor)
        cy += leading
    return cy

def arrow(x1,y1,x2,y2,label=None):
    # Draw a straight arrow with marker
    svg_elems.append(f'<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#111111"/></marker></defs>')
    svg_elems.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#111111" stroke-width="2.2" marker-end="url(#arrow)"/>')
    if label:
        # place label near middle
        mx, my = (x1+x2)/2, (y1+y2)/2 - 8
        box_w = max(80, len(label)*9)
        rect(mx-box_w/2, my-24, box_w, 28, rx=6, ry=6, fill="#f3f4f6", stroke="#9ca3af", sw=1)
        text(mx, my-5, label, fontsize=13, anchor="middle")

# Background
rect(0,0,W,H,rx=0,ry=0,fill="#f8fafc",stroke="#f8fafc",sw=0)

# Title
text(W/2, 48, "소리 신호등 · 쿵덕이 — 하드웨어·소프트웨어 서비스 알고리즘 구성도 (v1)", fontsize=28, weight="600", anchor="middle")
text(W/2, 78, "Edge Device(ESP32) ↔ Cloud Backend ↔ 모바일 앱(React Native) · 실시간 감지–피드백–리포트 파이프라인", fontsize=16, anchor="middle")

# Containers
edge_x, edge_y, edge_w, edge_h = 40, 120, 480, 700
cloud_x, cloud_y, cloud_w, cloud_h = 560, 120, 520, 700
app_x, app_y, app_w, app_h = 1110, 120, 450, 700

rect(edge_x, edge_y, edge_w, edge_h, fill="#ffffff", stroke="#1f2937", sw=2)
rect(cloud_x, cloud_y, cloud_w, cloud_h, fill="#ffffff", stroke="#1f2937", sw=2)
rect(app_x, app_y, app_w, app_h, fill="#ffffff", stroke="#1f2937", sw=2)

text(edge_x+16, edge_y-12, "EDGE DEVICE — 쿵덕이(ESP32, ESP-IDF + FreeRTOS)", fontsize=16, weight="600")
text(cloud_x+16, cloud_y-12, "CLOUD BACKEND — API/AI/Rules/Timeseries", fontsize=16, weight="600")
text(app_x+16, app_y-12, "MOBILE APP — React Native(Expo)", fontsize=16, weight="600")

# Edge subsections
# Sensors
rect(edge_x+20, edge_y+20, edge_w-40, 110, fill="#f1f5f9", stroke="#94a3b8", sw=1.5)
text(edge_x+34, edge_y+48, "센서", fontsize=18, weight="600")
multiline_text(edge_x+34, edge_y+80,
"""• I2S 디지털 마이크 (오디오, Fs 16 kHz)
• 3축 가속도계(IMU) (100 Hz)
• 환경(옵션): 온습도""", max_width_chars=70)

# RTOS tasks
rect(edge_x+20, edge_y+150, edge_w-40, 210, fill="#eef2ff", stroke="#6366f1", sw=1.5)
text(edge_x+34, edge_y+178, "RTOS 태스크 · 전처리", fontsize=18, weight="600")
multiline_text(edge_x+34, edge_y+208,
"""• Sampling Task: 오디오/가속도 버퍼링(이중 버퍼)
• Preprocess Task: HPF, RMS, 스펙트럼(FFT), 정규화
• Windowing: 3–5초 이벤트 윈도우 생성
• Night Mode 기준선 상향/민감도 조정""", max_width_chars=70)

# Event detection
rect(edge_x+20, edge_y+380, edge_w-40, 150, fill="#ecfeff", stroke="#06b6d4", sw=1.5)
text(edge_x+34, edge_y+408, "이벤트 탐지 · 분류(TFLite Micro 가능)", fontsize=18, weight="600")
multiline_text(edge_x+34, edge_y+438,
"""• 적응 임계치 + CNN 기반 분류 (‘발걸음/의자 끌기/낙하’)
• Pseudo-label/온디바이스 업데이트(옵션)
• 프라이버시 필터: 음성 원본 미전송, 특징량만 업링크""", max_width_chars=70)

# Feedback
rect(edge_x+20, edge_y+550, edge_w-40, 120, fill="#ecfccb", stroke="#84cc16", sw=1.5)
text(edge_x+34, edge_y+578, "피드백 컨트롤러", fontsize=18, weight="600")
multiline_text(edge_x+34, edge_y+608,
"""• LED 링(신호등: 녹–황–적)·표정(이모티콘 눈)
• 야간모드: 빛/진동/무음 자동 최적화
• 로컬 알림 후 서버 업링크(최소화)""", max_width_chars=70)

# Connectivity
rect(edge_x+20, edge_y+690, edge_w-40, 110, fill="#fff7ed", stroke="#f59e0b", sw=1.5)
text(edge_x+34, edge_y+718, "연결/업데이트", fontsize=18, weight="600")
multiline_text(edge_x+34, edge_y+748,
"""• Wi-Fi/BLE, MQTT 또는 WebSocket 클라이언트
• OTA 펌웨어 업데이트, 재시도·로컬 버퍼링""", max_width_chars=70)

# Cloud subsections
rect(cloud_x+20, cloud_y+20, cloud_w-40, 150, fill="#f8fafc", stroke="#94a3b8", sw=1.5)
text(cloud_x+34, cloud_y+48, "API Gateway · 실시간 채널", fontsize=18, weight="600")
multiline_text(cloud_x+34, cloud_y+78,
"""• HTTPS/REST + WebSocket
• 인증: OAuth2/JWT, 키 회전
• 속도 제한·기기 바인딩""", max_width_chars=60)

rect(cloud_x+20, cloud_y+190, cloud_w-40, 180, fill="#eef2ff", stroke="#6366f1", sw=1.5)
text(cloud_x+34, cloud_y+218, "수집/저장", fontsize=18, weight="600")
multiline_text(cloud_x+34, cloud_y+248,
"""• 인제스트 → 스트림 처리(필터·집계)
• 시계열 DB: TimescaleDB
• 캐시: Redis, 장치 상태 저장""", max_width_chars=60)

rect(cloud_x+20, cloud_y+390, cloud_w-40, 160, fill="#ecfeff", stroke="#06b6d4", sw=1.5)
text(cloud_x+34, cloud_y+418, "AI 서비스", fontsize=18, weight="600")
multiline_text(cloud_x+34, cloud_y+448,
"""• 분류/이상탐지 서빙(TensorFlow, TFLite)
• 야간 민감 시간대 예측
• 모델 버전 관리/AB 테스트""", max_width_chars=60)

rect(cloud_x+20, cloud_y+570, cloud_w-40, 140, fill="#ecfccb", stroke="#84cc16", sw=1.5)
text(cloud_x+34, cloud_y+598, "규칙·포인트 엔진", fontsize=18, weight="600")
multiline_text(cloud_x+34, cloud_y+628,
"""• 배려 포인트: 알림 대응·조용한 시간 확보 가중치
• 리포트 생성(일/주/월), 알림 정책(푸시/무음)""", max_width_chars=60)

rect(cloud_x+20, cloud_y+730, cloud_w-40, 70, fill="#fff7ed", stroke="#f59e0b", sw=1.5)
text(cloud_x+34, cloud_y+760, "알림 서비스 · 디바이스 제어", fontsize=18, weight="600")

# App subsections
rect(app_x+20, app_y+20, app_w-40, 180, fill="#f1f5f9", stroke="#94a3b8", sw=1.5)
text(app_x+34, app_y+48, "실시간 대시보드", fontsize=18, weight="600")
multiline_text(app_x+34, app_y+78,
"""• 소음/진동 상태를 캐릭터 애니메이션으로 표시
• 배려 포인트 실시간 적립·배지
• 모드(기본/야간/수면) 빠른 토글""", max_width_chars=60)

rect(app_x+20, app_y+220, app_w-40, 170, fill="#eef2ff", stroke="#6366f1", sw=1.5)
text(app_x+34, app_y+248, "설정·접근성·프라이버시", fontsize=18, weight="600")
multiline_text(app_x+34, app_y+278,
"""• 알림 강도·색약 안전 팔레트·큰 글씨
• 데이터 공유 온/오프, 기간·용도 제어
• 펌웨어 업데이트 트리거""", max_width_chars=60)

rect(app_x+20, app_y+410, app_w-40, 180, fill="#ecfeff", stroke="#06b6d4", sw=1.5)
text(app_x+34, app_y+438, "리포트(일/주/월)", fontsize=18, weight="600")
multiline_text(app_x+34, app_y+468,
"""• 주요 원인(발걸음/가구 이동) 비중
• 민감 시간대·조용한 시간대 배지
• 개선 제안 카드(추천 루틴)""", max_width_chars=60)

rect(app_x+20, app_y+610, app_w-40, 190, fill="#ecfccb", stroke="#84cc16", sw=1.5)
text(app_x+34, app_y+638, "가족·공유(옵션)", fontsize=18, weight="600")
multiline_text(app_x+34, app_y+668,
"""• 가족 계정·칭찬 스티커·노력 지표 공유(개인정보 최소화)
• 관리자/상호존중 모드""", max_width_chars=60)

# Arrows across layers
# Edge -> Cloud
arrow(edge_x+480, edge_y+460, cloud_x, cloud_y+250, "특징량/이벤트 업링크")
arrow(edge_x+480, edge_y+740, cloud_x, cloud_y+760, "상태·로그 업링크")

# Cloud -> App
arrow(cloud_x+520, cloud_y+120, app_x+20, app_y+120, "실시간 상태/알림 푸시")
arrow(cloud_x+520, cloud_y+640, app_x+20, app_y+260, "설정/리포트 API")

# App -> Cloud -> Edge (downlink)
arrow(app_x+20, app_y+300, cloud_x+520, cloud_y+330, "설정 변경·모드 토글")
arrow(cloud_x, cloud_y+760, edge_x+480, edge_y+720, "펌웨어/민감도 업데이트")

# Edge local loop arrows
arrow(edge_x+260, edge_y+130, edge_x+260, edge_y+160, None)  # tiny arrow for flow hint
arrow(edge_x+260, edge_y+360, edge_x+260, edge_y+390, None)
arrow(edge_x+260, edge_y+530, edge_x+260, edge_y+560, None)

# Legend / algorithm steps
legend_x, legend_y, legend_w, legend_h = 560, 40, 520, 60
rect(40, 40, 480, 60, fill="#ffffff", stroke="#1f2937", sw=1)
multiline_text(56, 68,
"서비스 알고리즘(요약) ① 센싱→전처리→이벤트 탐지 ② 로컬 피드백(LED/진동) ③ 특징량 업링크 ④ 규칙·AI로 알림/포인트 ⑤ 앱 리포트·설정 ⑥ 설정/펌웨어 다운링크",
max_width_chars=90, fontsize=15)

# Save SVG
out_path = "쿵덕이_서비스_알고리즘_구성도_v1.svg"
with open(out_path, "w", encoding="utf-8") as f:
    f.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
    f.write("\n".join(svg_elems))
    f.write("</svg>")

out_path
