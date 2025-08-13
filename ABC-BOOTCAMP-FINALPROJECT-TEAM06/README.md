# 🔇 쿵덕이 - 층간소음 AI 분석 서비스

> **ABC 부트캠프 최종 프로젝트 - Team 6**  
> 층간소음 문제 해결을 위한 AI 기반 분석 및 예방 서비스

## 🎯 프로젝트 개요

쿵덕이는 공동주택 층간소음 문제를 AI 기술로 해결하는 혁신적인 서비스입니다. 실시간 소음 분석, 데이터 기반 중재, 그리고 예방 솔루션을 통해 이웃 간 갈등을 줄이고 평화로운 주거환경을 조성합니다.

### 🌟 주요 기능
- 🎤 **실시간 소음 AI 분석**: 발소리, 말소리 등 생활소음 자동 감지 및 분류
- � **데이터 기반 중재**: 객관적 소음 데이터를 통한 갈등 해결
- 🏠 **맞춤형 솔루션**: 거주 환경별 개인화된 소음 방지 가이드
- 📱 **모바일 앱**: 실시간 모니터링 및 알림 서비스

## �📁 프로젝트 구조

```
ABC-BOOTCAMP-FINALPROJECT-TEAM06/
├── README.md
├── requirements.txt
├── 📁 app/                    # 웹 애플리케이션
│   ├── client/               # React 프론트엔드
│   ├── server/               # Node.js 백엔드
│   ├── shared/               # 공통 스키마
│   └── package.json
├── 📁 data/                   # 데이터셋
│   ├── 설문조사/              # 자체 수집 설문조사 데이터
│   ├── external/             # 한국환경공단 층간소음 현황 데이터
│   ├── processed/            # 전처리된 데이터
│   └── raw/                  # 원시 데이터
├── 📁 notebooks/             # 분석 노트북
│   ├── 층간소음_데이터_분석_시각화.ipynb
│   ├── 쿵덕이_설문조사_분석_분할.ipynb
│   ├── 쿵덕이_설문조사_분석_새로운.ipynb
│   └── 머신러닝_딥러닝 모델.ipynb
├── 📁 src/                   # 소스 코드
│   ├── data_processing/      # 데이터 처리 모듈
│   ├── models/              # AI 모델
│   ├── utils/               # 유틸리티 함수
│   └── visualization/       # 시각화 모듈
├── 📁 results/              # 분석 결과물
│   ├── app/                 # 앱 UI 스크린샷
│   ├── figures/             # 데이터 시각화 차트
│   ├── models/              # 학습된 AI 모델
│   └── reports/             # 분석 리포트
└── 📁 docs/                 # 프로젝트 문서
```

## 🚀 시작하기

### 🔧 필수 요구사항
- Python 3.12+
- Git
- Conda (권장) 또는 Python venv

## 🚀 시작하기

### 🔧 필수 요구사항
- Python 3.12+
- Node.js 18+  
- Git
- Conda (권장)

### ⚡ 빠른 시작

```bash
# 1. 저장소 클론
git clone https://github.com/River-181/abc-bootcamp-finalproject-team-6.git
cd abc-bootcamp-finalproject-team-6/ABC-BOOTCAMP-FINALPROJECT-TEAM06

# 2. Python 환경 설정
conda create -n abc-bootcamp-FP-2025 python=3.12 -y
conda activate abc-bootcamp-FP-2025
pip install -r requirements.txt

# 3. 웹 애플리케이션 실행 (선택사항)
cd app
npm install
npm run dev

# 4. 데이터 분석 시작
jupyter lab notebooks/
```

### 📊 데이터 분석 워크플로우

1. **층간소음 현황 분석**: `notebooks/층간소음_데이터_분석_시각화.ipynb`
2. **설문조사 분석**: `notebooks/쿵덕이_설문조사_분석_새로운.ipynb`  
3. **AI 모델 개발**: `notebooks/머신러닝_딥러닝 모델.ipynb`
4. **결과 시각화**: `results/figures/` 폴더 참조

## � 개발 환경

### 가상환경 관리
```bash
# Conda 환경 목록 확인
conda info --envs

# 환경 활성화/비활성화
conda activate abc-bootcamp-FP-2025
conda deactivate

# 새 패키지 설치 후 requirements.txt 업데이트
pip install new-package
pip freeze > requirements.txt
```

### Git 브랜치 전략
- `main`: 안정화된 코드
- `develop`: 개발 중인 코드  
- `feature/[기능명]`: 새로운 기능 개발
- `fix/[수정내용]`: 버그 수정

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 기타 작업
```

## �️ 기술 스택

### Frontend
- **React 18** + **TypeScript**: 모던 웹 애플리케이션 개발
- **Tailwind CSS**: 효율적인 UI 스타일링
- **shadcn/ui**: 일관성 있는 디자인 시스템

### Backend  
- **Node.js** + **Express**: RESTful API 서버
- **Drizzle ORM**: 타입 안전한 데이터베이스 작업
- **SQLite**: 경량 데이터베이스

### AI/ML
- **TensorFlow**: 딥러닝 모델 개발
- **PyTorch**: 고급 AI 모델 실험
- **scikit-learn**: 전통적 머신러닝 알고리즘

### Data Analysis
- **Python**: 주 분석 언어
- **pandas + numpy**: 데이터 처리
- **matplotlib + seaborn**: 데이터 시각화
- **Jupyter Notebook**: 대화형 분석 환경

## 🎯 주요 분석 결과

### 📈 층간소음 현황 분석
- 연도별, 지역별 층간소음 접수 추이 분석
- 주거형태별, 거주위치별 소음 패턴 발견
- 층간소음 원인별 분포 및 트렌드 파악

### 🤖 AI 모델 성능
- **발소리 감지 모델**: 높은 정확도의 실시간 분류
- **말소리 인식 모델**: 한국어 특화 음성 처리
- **통합 소음 분석**: 다중 소음원 동시 분석 가능

### 📱 사용자 수용도 조사
- 쿵덕이 서비스에 대한 높은 관심도 확인
- 세그먼트별 특성 분석을 통한 타겟 고객 정의
- 구매 의향 및 기능 선호도 파악

## 📊 데이터셋

### 🎵 AI 모델 학습 데이터
> **주의**: AI 모델 학습에 사용된 대용량 데이터는 용량 제한으로 업로드하지 않았습니다.

#### 1. 발걸음을 포함한 생활 소음 데이터
- **출처**: [AI Hub - 발걸음을 포함한 생활 소음 데이터](https://www.aihub.or.kr/aihubdata/data/view.do?pageIndex=1&currMenu=&topMenu=&srchOptnCnd=OPTNCND001&searchKeyword=%EB%B0%9C%EA%B1%B8%EC%9D%8C&srchDetailCnd=DETAILCND001&srchOrder=ORDER001&srchPagePer=20&aihubDataSe=data&dataSetSn=71296)
- **용도**: 발소리, 가구 이동 등 생활소음 패턴 학습

#### 2. 한국어 음성 데이터
- **출처**: [Kaggle - Korean Single Speaker Speech Dataset](https://www.kaggle.com/datasets/bryanpark/korean-single-speaker-speech-dataset?resource=download)
- **용도**: 말소리 분류 및 음성 인식 모델 학습

### 📋 설문조사 데이터
- **수집 방법**: 자체 제작 설문지를 통한 1차 데이터 수집
- **내용**: 층간소음 경험, 인식, 쿵덕이 서비스 수용도 등
- **파일 위치**: `data/설문조사/배려 깊은 우리 집, 건강한 공동주택 생활을 위한 생각 나눔 설문지(응답).csv`

### 🏢 층간소음 현황 데이터 (한국환경공단)
- **출처**: [공공데이터포털](https://www.data.go.kr/tcs/dss/selectDataSetList.do?dType=TOTAL&keyword=%ED%95%9C%EA%B5%AD%ED%99%98%EA%B2%BD%EA%B3%B5%EB%8B%A8_%EC%B8%B5%EA%B0%84%EC%86%8C%EC%9D%8C) (검색일: 2025년 8월 6일-10일)
- **포함 데이터**:
  - 층간소음 원인별 분석
  - 거주위치별 분석  
  - 주거형태별 분석
  - 준공연도별 분석
  - 지역별 온라인 현장진단 건수
  - 현장진단 접수현황

### 📚 외부 참고 문헌
- `2021_09_2_공동주택_층간소음의_관리규정과_분쟁_양상.pdf`
- `층간소음 인식 조사 2024.pdf`
- `2020년도 1분기 층간소음이웃사이센터 민원 통계 현황.hwp`

## 👥 팀 멤버

[팀 멤버 정보를 추가하세요]

## � 애플리케이션 스크린샷

웹 애플리케이션의 주요 화면들을 `results/app/` 폴더에서 확인할 수 있습니다:
- 📱 메인 대시보드 (앱UI1.png)
- 🎤 실시간 소음 분석 (앱UI2.png)  
- 📊 분석 리포트 (앱UI3.png)
- ⚙️ 설정 및 알림 (앱UI4.png)

## 📈 주요 분석 결과물

### 시각화 차트 (`results/figures/`)
- 층간소음 원인별 분포 및 트렌드
- 지역별, 연도별 소음 접수 현황  
- 설문조사 기반 사용자 인식 분석
- 쿵덕이 서비스 수용도 조사 결과

### AI 모델 결과 (`results/models/`)
- 발소리/말소리 AI 모델 신뢰도 분석
- 오디오 시뮬레이션 및 시간 도메인 분석
- 딥러닝 모델 성능 리포트

## 💡 사용법 예시

### 데이터 분석
```python
# 층간소음 데이터 로딩 및 분석
import pandas as pd
from src.visualization.plots import plot_noise_trends

# 데이터 로드
noise_data = pd.read_csv('data/external/한국환경공단_층간소음 원인별 분석_20231031.csv')

# 트렌드 시각화
plot_noise_trends(noise_data)
```

### 웹 애플리케이션 개발
```bash
# 개발 서버 실행
cd app
npm run dev

# 프로덕션 빌드
npm run build
```

## 🔧 개발 도구

- **코드 포맷팅**: black, prettier
- **린터**: flake8, eslint
- **테스트**: pytest, jest
- **빌드 도구**: Vite, npm

## � 팀 멤버

**ABC 부트캠프 Team 6** - 층간소음 해결을 위한 AI 전문가들

## �📞 연락처 및 지원

### 📖 프로젝트 문서
- [환경 설정 가이드](docs/SETUP.md): 개발 환경 구성 방법
- [퀵스타트 가이드](docs/QUICKSTART.md): 빠른 시작 가이드  
- [프로젝트 구조](docs/PROJECT_STRUCTURE.md): 상세 폴더 구조 설명

### 🔗 관련 링크
- **GitHub Repository**: [abc-bootcamp-finalproject-team-6](https://github.com/River-181/abc-bootcamp-finalproject-team-6)
- **AI Hub 데이터**: [발걸음을 포함한 생활 소음 데이터](https://www.aihub.or.kr/aihubdata/data/view.do?pageIndex=1&currMenu=&topMenu=&srchOptnCnd=OPTNCND001&searchKeyword=%EB%B0%9C%EA%B1%B8%EC%9D%8C&srchDetailCnd=DETAILCND001&srchOrder=ORDER001&srchPagePer=20&aihubDataSe=data&dataSetSn=71296)
- **공공데이터포털**: [한국환경공단 층간소음 데이터](https://www.data.go.kr/tcs/dss/selectDataSetList.do?dType=TOTAL&keyword=%ED%95%9C%EA%B5%AD%ED%99%98%EA%B2%BD%EA%B3%B5%EB%8B%A8_%EC%B8%B5%EA%B0%84%EC%86%8C%EC%9D%8C)

### � 프로젝트 현황
- ✅ 데이터 수집 및 전처리 완료
- ✅ AI 모델 개발 및 학습 완료  
- ✅ 웹 애플리케이션 프로토타입 구현
- ✅ 사용자 조사 및 분석 완료
- ✅ 최종 결과물 정리 및 문서화

---

> 🏆 **ABC 부트캠프 최종 프로젝트**  
> 🎯 **목표**: AI 기술을 활용한 층간소음 문제 해결  
> 📅 **기간**: 2025년 부트캠프 과정  
> 👥 **팀**: Team 6
