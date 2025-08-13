# 📱 쿵덕이 UI + AI 모델 통합 앱

> **발걸음 소음 분석 AI 모델이 통합된 웹 애플리케이션**

## 🎯 프로젝트 개요

이 앱은 쿵덕이 서비스의 **UI 인터페이스**와 **발걸음 분석 AI 모델**이 통합된 웹 애플리케이션입니다. 사용자는 직관적인 인터페이스를 통해 실시간으로 발걸음 소음을 분석하고 결과를 확인할 수 있습니다.

### ✨ 주요 기능
- 🎤 **실시간 발걸음 감지**: 마이크를 통한 실시간 발소리 분석
- 🤖 **AI 모델 분석**: 딥러닝 기반 발걸음 패턴 분류
- 📊 **시각화 대시보드**: 분석 결과의 직관적 표시
- 📱 **반응형 UI**: 모바일/데스크톱 최적화 인터페이스

## 🏗️ 기술 스택

### Frontend
- **React 18** + **TypeScript**: 모던 웹 개발
- **Tailwind CSS**: 효율적 스타일링
- **shadcn/ui**: 일관성 있는 디자인 시스템
- **Vite**: 빠른 개발 환경

### Backend
- **Node.js** + **Express**: REST API 서버
- **WebSocket**: 실시간 통신
- **SQLite**: 경량 데이터베이스

### AI/ML
- **TensorFlow.js**: 브라우저 내 AI 모델 실행
- **Web Audio API**: 실시간 오디오 처리
- **Canvas API**: 시각화 렌더링

## 📁 프로젝트 구조

```
app_UI and AI model/
├── 📄 package.json           # 의존성 및 스크립트
├── 📄 vite.config.ts         # Vite 설정
├── 📄 tailwind.config.ts     # Tailwind CSS 설정
├── 📄 tsconfig.json          # TypeScript 설정
├── 📁 client/               # React 프론트엔드
│   ├── index.html
│   └── src/
│       ├── App.tsx          # 메인 앱 컴포넌트
│       ├── main.tsx         # 앱 진입점
│       ├── components/      # 재사용 가능한 컴포넌트
│       │   ├── ai-report.tsx        # AI 분석 결과 리포트
│       │   ├── character-display.tsx # 캐릭터 애니메이션
│       │   ├── sensor-panel.tsx     # 센서 상태 패널
│       │   └── ui/                  # shadcn/ui 컴포넌트
│       ├── hooks/           # 커스텀 React 훅
│       │   ├── use-sensor-detection.ts  # 센서 감지 로직
│       │   └── use-toast.ts             # 토스트 알림
│       ├── pages/           # 페이지 컴포넌트
│       │   ├── home.tsx     # 메인 대시보드
│       │   ├── report.tsx   # 분석 리포트
│       │   └── not-found.tsx
│       └── lib/             # 유틸리티 라이브러리
├── 📁 server/               # Node.js 백엔드
│   ├── index.ts             # 서버 진입점
│   ├── routes.ts            # API 라우트
│   ├── storage.ts           # 데이터 저장소
│   └── vite.ts              # Vite 개발 서버
├── 📁 shared/               # 공유 타입 정의
│   └── schema.ts            # 데이터 스키마
└── 📁 attached_assets/      # 첨부 자료
    ├── image_*.png          # UI 스크린샷
    └── *.txt                # 개발 노트
```

## 🚀 빠른 시작

### 환경 요구사항
- Node.js 18+
- npm 9+
- 모던 브라우저 (Chrome 90+, Firefox 88+)

### 설치 및 실행
```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
# http://localhost:5173
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🤖 AI 모델 통합

### 발걸음 분석 모델
- **모델 타입**: CNN + RNN 하이브리드
- **입력**: 실시간 오디오 스트림 (16kHz, 16bit)
- **출력**: 발걸음 감지 확률 + 강도 분류
- **추론 시간**: < 100ms (실시간 처리)

### 실시간 분석 프로세스
1. **오디오 캡처**: Web Audio API로 마이크 접근
2. **전처리**: 노이즈 제거 및 정규화
3. **특성 추출**: MFCC, 스펙트로그램 생성
4. **AI 추론**: TensorFlow.js 모델 실행
5. **결과 표시**: 실시간 시각화 업데이트

## 📱 주요 컴포넌트

### 1. 메인 대시보드 (`pages/home.tsx`)
- 실시간 소음 레벨 표시
- AI 분석 결과 실시간 업데이트
- 쿵덕이 캐릭터 애니메이션

### 2. AI 리포트 (`components/ai-report.tsx`)
- 분석 결과 상세 표시
- 소음 패턴 차트
- 개선 제안 및 가이드

### 3. 센서 패널 (`components/sensor-panel.tsx`)
- 마이크 상태 모니터링
- 소음 강도 실시간 표시
- 설정 및 보정 기능

## 🎨 UI/UX 특징

### 디자인 시스템
- **컬러**: 차분한 블루/그린 톤 (층간소음 해결의 평화로운 이미지)
- **타이포그래피**: Inter 폰트로 가독성 최적화
- **애니메이션**: Framer Motion으로 부드러운 인터랙션
- **아이콘**: Lucide React로 일관성 있는 아이콘셋

### 접근성 (a11y)
- 키보드 내비게이션 지원
- 스크린 리더 호환
- 색상 대비비 WCAG 2.1 AA 준수
- 다국어 지원 준비

## 📊 성능 최적화

### 번들 최적화
- **코드 분할**: React.lazy로 페이지별 분할
- **트리 쉐이킹**: 불필요한 코드 제거
- **압축**: Gzip/Brotli 압축 적용

### AI 모델 최적화
- **모델 경량화**: TensorFlow Lite 변환
- **웹 워커**: 별도 스레드에서 AI 추론
- **캐싱**: 모델 파일 브라우저 캐싱

## 🔧 개발 도구

### 코드 품질
```bash
# ESLint 검사
npm run lint

# Prettier 포맷팅
npm run format

# TypeScript 타입 검사
npm run type-check
```

### 테스트
```bash
# 단위 테스트
npm run test

# E2E 테스트 (Playwright)
npm run test:e2e
```

## 🚧 현재 상태 및 제한사항

### ✅ 구현 완료
- 기본 UI 프레임워크
- 발걸음 AI 모델 통합
- 실시간 오디오 처리
- 반응형 디자인

### ⚠️ 알려진 제한사항
- **하드웨어 연결 없음**: 현재는 웹 마이크만 사용
- **모델 정확도**: 실제 환경에서 추가 튜닝 필요
- **브라우저 호환성**: Safari에서 일부 Web Audio API 제한

### 🔮 향후 개선 계획
- IoT 센서와의 하드웨어 연동
- 더 정확한 AI 모델 적용
- 푸시 알림 시스템
- 다중 사용자 지원

## 🤝 기여 방법

1. 이슈 생성 또는 기존 이슈 선택
2. 브랜치 생성: `git checkout -b feature/ui-improvement`
3. 개발 및 테스트
4. Pull Request 생성

## 📞 문의 및 지원

- **프로젝트 리포지토리**: [GitHub](https://github.com/River-181/abc-bootcamp-finalproject-team-6)
- **이슈 트래킹**: GitHub Issues
- **개발팀**: ABC 부트캠프 Team 6

---

> 🎯 **목표**: 직관적이고 정확한 층간소음 분석 서비스  
> 📱 **플랫폼**: 웹 기반 (모바일 반응형)  
> 🤖 **AI 모델**: 발걸음 패턴 분석 특화  
> 📅 **최종 업데이트**: 2025년 8월 13일
