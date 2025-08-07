# NoiseBuddy PoC - 실행 가이드 📖

## 🎯 프로젝트 개요

NoiseBuddy는 층간소음 예방을 위한 IoT 피규어 시스템의 Proof-of-Concept입니다. 이 PoC는 다음 4개의 컴포넌트로 구성됩니다:

1. **가상 IoT 디바이스** (`virtual-device.js`) - ESP32 하드웨어 시뮬레이션
2. **웹소켓 서버** (`server.js`) - 데이터 수집 및 브로드캐스트
3. **웹 앱 프론트엔드** (`web-app/`) - 실시간 대시보드
4. **Supabase 데이터베이스** - 센서 데이터 저장

## 🗄️ 데이터베이스 설정

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

## 📝 다음 단계

이 PoC를 확장하여 다음 기능들을 추가할 수 있습니다:

1. **실제 ESP32/Arduino 통합**
2. **푸시 알림 시스템**
3. **데이터 분석 및 패턴 인식**
4. **모바일 앱 개발**
5. **다중 디바이스 지원**

## 💡 참고사항

- 이 PoC는 개발/테스트 목적으로 작성되었습니다
- 프로덕션 환경에서는 보안, 에러 처리, 성능 최적화가 필요합니다
- WebSocket 연결은 자동으로 재연결을 시도합니다

---

**문의사항이나 문제가 발생하면 GitHub Issues를 통해 알려주세요! 🚀**
