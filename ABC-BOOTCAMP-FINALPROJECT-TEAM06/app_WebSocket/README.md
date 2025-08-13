# 🔗 쿵덕이 WebSocket 연결 프로토타입

> **하드웨어 센서와 웹 애플리케이션 간 실시## 🗄️ 데이터베이스 설정로젝트 개요

이 애플리케이션은 쿵덕이 서비스의 **하드웨어 센서와 웹앱 간 WebSocket 통신**을 구현한 프로토타입입니다. IoT 센서에서 수집된 층간소음 데이터를 실시간으로 웹 대시보드에 전송하는 시스템을 시연합니다.

### ⚠️ 현재 상태
- **프로토타입 단계**: 기본적인 WebSocket 통신 구현 완료
- **연결 상태**: 하드웨어와 앱이 **독립적으로 동작** (실제 연결되지 않음)
- **데이터 처리**: 음성과 발소리를 **하드웨어에서 따로, 앱에서 따로** 처리

### 🏗️ 시스템 구성

```
[가상 IoT 센서] ──WebSocket──> [서버] ──WebSocket──> [웹 대시보드]
     ↓                          ↓                      ↓
  진동/소음 생성              데이터 중계            실시간 표시
```

## ✨ 주요 기능

### 1. 가상 IoT 디바이스 (`virtual-device.js`)
- ESP32 하드웨어 동작 시뮬레이션
- 진동/소음 센서 데이터 생성
- WebSocket을 통한 실시간 데이터 전송

### 2. WebSocket 서버 (`server.js`)
- 실시간 양방향 통신 서버
- 다중 클라이언트 연결 관리
- Supabase 데이터베이스 저장

### 3. 웹 대시보드 (`web-app/`)
- React 기반 실시간 모니터링
- 센서 데이터 시각화
- 연결 상태 표시

## � 프로젝트 구조

```
app_WebSocket/
├── 📄 package.json              # Node.js 의존성 및 스크립트
├── 📄 server.js                 # WebSocket 서버 메인 파일
├── 📄 virtual-device.js         # IoT 센서 시뮬레이터
├── 📄 .env.example             # 환경변수 템플릿
├── 📄 .env                     # 실제 환경변수 (git 제외)
├── 📁 src/                     # 서버 소스 코드
├── 📁 web-app/                 # React 웹 대시보드
│   ├── package.json            # React 앱 의존성
│   ├── public/                 # 정적 파일
│   └── src/                    # React 소스 코드
└── 📁 node_modules/            # 설치된 패키지
```

## 🔧 기술 스택

### Backend
- **Node.js**: 서버 런타임
- **WebSocket (ws)**: 실시간 통신
- **Supabase**: 클라우드 데이터베이스
- **dotenv**: 환경변수 관리

### Frontend  
- **React**: 사용자 인터페이스
- **WebSocket API**: 실시간 데이터 수신
- **CSS**: 반응형 스타일링

### IoT 시뮬레이션
- **가상 센서**: 진동/소음 데이터 생성
- **WebSocket Client**: 서버와 통신

### Supabase 테이블 생성

Supabase 프로젝트에서 다음 SQL을 실행하여 테이블을 생성하세요:

```sql
-- NoiseBuddy 센서 데이터 테이블 생성
CREATE TABLE noise_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deviceId TEXT NOT NULL,
    vibration FLOAT8 NOT NULL,
    noise FLOAT8 NOT NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_noise_logs_created_at ON noise_logs(created_at DESC);
CREATE INDEX idx_noise_logs_device_id ON noise_logs(deviceId);
```

### 환경 변수 설정

1. `.env.example` 파일을 `.env`로 복사:
```bash
cp .env.example .env
```

2. `.env` 파일을 편집하여 Supabase 정보 입력:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
```

> **Supabase 정보 찾는 방법:**
> - Supabase 대시보드 → Settings → API
> - URL: Project URL 복사
> - Key: anon/public key 복사

## 🚀 설치 및 실행

### 1. 서버 환경 설정

```bash
# 프로젝트 디렉토리로 이동
cd /Users/river/abc-bootcamp-finalproject-team-6

# Node.js 패키지 설치
npm install

# 또는 yarn 사용시
yarn install
```

### 2. 웹소켓 서버 실행

```bash
# 터미널 1: 웹소켓 서버 시작
npm run server

# 또는 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
```

**예상 출력:**
```
✅ Supabase 클라이언트 초기화 완료
🚀 NoiseBuddy 웹소켓 서버 시작 - 포트: 8080
```

### 3. 가상 IoT 디바이스 실행

```bash
# 터미널 2: 가상 디바이스 시작
npm run device
```

**예상 출력:**
```
🚀 NoiseBuddy 가상 디바이스 시작
🔌 가상 디바이스 NoiseBuddy-001 서버 연결 시도: ws://localhost:8080
✅ 웹소켓 서버 연결 성공
📡 데이터 전송: 진동=75.5, 소음=45.2
```

### 4. 웹 앱 프론트엔드 실행

```bash
# 터미널 3: 웹 앱 디렉토리로 이동
cd web-app

# React 패키지 설치
npm install

# 웹 앱 시작
npm start
```

웹 브라우저에서 `http://localhost:3000`으로 접속하여 대시보드를 확인하세요.

## 🔧 Replit에서 실행하는 방법

### 1. Replit 프로젝트 생성
- Replit에서 "Node.js" 템플릿으로 새 프로젝트 생성
- 모든 파일을 Replit 프로젝트에 업로드

### 2. 환경 변수 설정
- Replit의 "Secrets" 탭에서 환경 변수 추가:
  - `SUPABASE_URL`: Supabase 프로젝트 URL
  - `SUPABASE_KEY`: Supabase anon key

### 3. 패키지 설치 및 실행
```bash
# 서버 의존성 설치
npm install

# 웹소켓 서버 시작
npm run server
```

### 4. 웹 앱용 별도 Replit 프로젝트
- React 템플릿으로 새 프로젝트 생성
- `web-app/` 폴더의 내용을 복사
- `src/App.js`에서 WebSocket URL 수정:
```javascript
const WS_URL = 'wss://your-server-replit-url.replit.dev';
```

## 📊 시스템 아키텍처

```
[가상 IoT 디바이스] 
        ↓ WebSocket
[웹소켓 서버] ↔ [Supabase DB]
        ↓ WebSocket Broadcast
[웹 앱 대시보드]
```

## 🎮 사용법

### 대시보드 기능

1. **실시간 센서 데이터 표시**
   - 진동 레벨 (0-100)
   - 소음 레벨 (30-90 dB)
   - 색상별 경고 시스템 (녹색/주황/빨강)

2. **연결 상태 모니터링**
   - Connected: 정상 연결
   - Connecting: 연결 시도 중
   - Disconnected: 연결 끊김

3. **데이터 히스토리**
   - 최근 10개 데이터 로그 표시
   - 시간별 진동/소음 추이 확인

### 경고 레벨 기준

**진동 레벨:**
- 🟢 0-60: 안전 (녹색)
- 🟡 61-80: 주의 (주황)
- 🔴 81-100: 위험 (빨강)

**소음 레벨:**
- 🟢 30-50 dB: 안전 (녹색)
- 🟡 51-70 dB: 주의 (주황)
- 🔴 71-90 dB: 위험 (빨강)

## 🔍 트러블슈팅

### 일반적인 문제 해결

1. **서버 연결 실패**
   ```bash
   # 포트 8080이 사용 중인지 확인
   lsof -i :8080
   
   # 다른 포트 사용하려면 server.js에서 포트 변경
   ```

2. **Supabase 연결 오류**
   - `.env` 파일의 URL과 KEY가 정확한지 확인
   - Supabase 프로젝트가 활성화되어 있는지 확인
   - 네트워크 연결 상태 확인

3. **웹소켓 연결 실패**
   - 서버가 먼저 실행되었는지 확인
   - 방화벽이 8080 포트를 차단하지 않는지 확인

4. **React 앱 빌드 오류**
   ```bash
   # 캐시 정리 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

### 디버깅 팁

- 각 컴포넌트의 콘솔 로그를 확인하세요
- 브라우저 개발자 도구의 Network 탭에서 WebSocket 연결 상태 확인
- Supabase 대시보드에서 데이터가 정상적으로 저장되는지 확인

## � 현재 개발 상태

### ✅ 구현 완료
- **WebSocket 서버**: 실시간 통신 서버 구축
- **가상 IoT 디바이스**: 센서 데이터 생성 및 전송
- **웹 대시보드**: 실시간 데이터 시각화
- **데이터베이스 연동**: Supabase를 통한 데이터 저장

### ⚠️ 현재 제한사항
- **하드웨어 미연결**: 실제 IoT 센서와 연결되지 않음
- **독립적 처리**: 
  - 하드웨어에서 음성/발소리 따로 처리
  - 앱에서도 음성/발소리 따로 처리
  - 두 시스템 간 데이터 교환 없음
- **프로토타입 수준**: 개념 검증 단계

### 🔮 향후 개발 계획
1. **실제 하드웨어 연동**
   - ESP32/Arduino 센서 통합
   - 실시간 소음 측정 센서
   - 진동 감지 센서

2. **통합 AI 분석**
   - 하드웨어 + 앱 데이터 통합
   - 종합적 소음 분석
   - 정확도 향상

3. **고급 기능 추가**
   - 푸시 알림 시스템
   - 이웃간 소통 기능
   - 관리사무소 연동

## � 시스템 아키텍처 (목표)

```
[실제 IoT 센서] ──WiFi──> [쿵덕이 서버] ──API──> [모바일 앱]
       ↓                      ↓                    ↓
  실시간 측정              AI 분석 통합         사용자 알림
  진동/소음/음성           발소리+말소리        대시보드+리포트
```

**현재는**: 각 구성요소가 독립적으로 동작하는 프로토타입 단계

## 🔧 개발자 가이드

### 코드 구조 이해

**server.js - WebSocket 서버**
```javascript
// 주요 기능
- WebSocket 서버 생성 및 관리
- 클라이언트 연결/해제 처리  
- 데이터베이스 저장
- 실시간 브로드캐스트
```

**virtual-device.js - IoT 시뮬레이터**
```javascript
// 시뮬레이션 데이터
- 진동: 0-100 (임의 생성)
- 소음: 30-90 dB (임의 생성)  
- 전송 주기: 2초마다
```

**web-app/ - React 대시보드**
```javascript
// 실시간 기능
- WebSocket 연결 관리
- 센서 데이터 시각화
- 경고 레벨 표시
- 연결 상태 모니터링
```

### 로컬 개발 환경

```bash
# 1. 서버 실행 (터미널 1)
npm run server

# 2. 가상 디바이스 실행 (터미널 2)  
npm run device

# 3. 웹앱 실행 (터미널 3)
cd web-app && npm start
```

### 배포 가이드

**Replit 배포**
1. Node.js 템플릿으로 프로젝트 생성
2. 환경변수 Secrets에 추가
3. `npm run server` 실행

**Vercel/Netlify 배포**
- 웹앱만 정적 배포 가능
- 서버는 별도 호스팅 필요

## 📞 연락처 및 지원

- **GitHub**: [abc-bootcamp-finalproject-team-6](https://github.com/River-181/abc-bootcamp-finalproject-team-6)
- **개발팀**: ABC 부트캠프 Team 6
- **이슈 리포트**: GitHub Issues

---

> 🔗 **연결 상태**: 프로토타입 (하드웨어 미연결)  
> 🎯 **목표**: 실시간 IoT 통신 시스템 구축  
> 📅 **최종 업데이트**: 2025년 8월 13일  
> 👥 **개발팀**: ABC 부트캠프 Team 6
