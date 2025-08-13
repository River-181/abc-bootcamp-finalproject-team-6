# ABC 부트캠프 최종 프로젝트 - Team 6

데이터 분석을 위한 완전한 프로젝트 환경입니다.

## 📁 프로젝트 구조

```
abc-bootcamp-finalproject-team-6/
├── README.md
├── requirements.txt
├── .gitignore
├── 📁 data/
│   ├── raw/                # 원시 데이터
│   ├── processed/          # 전처리된 데이터
│   └── external/           # 외부 참조 데이터
├── 📁 notebooks/
│   ├── 01_EDA.ipynb        # 탐색적 데이터 분석
│   ├── 02_Preprocessing.ipynb  # 데이터 전처리
│   ├── 03_Modeling.ipynb   # 모델링
│   └── 04_Evaluation.ipynb # 평가 및 검증
├── 📁 src/
│   ├── data_processing/    # 데이터 처리 모듈
│   ├── models/            # 머신러닝 모델
│   ├── utils/             # 유틸리티 함수
│   └── visualization/     # 시각화 모듈
├── 📁 results/
│   ├── figures/           # 생성된 그래프
│   ├── models/            # 학습된 모델
│   └── reports/           # 분석 리포트
├── 📁 docs/               # 문서
└── 📁 tests/              # 테스트 파일
```

## 🚀 시작하기

### 🔧 필수 요구사항
- Python 3.12+
- Git
- Conda (권장) 또는 Python venv

### ⚡ 빠른 시작 (신규 팀원)

```bash
# 1. 저장소 클론
git clone https://github.com/River-181/abc-bootcamp-finalproject-team-6.git
cd abc-bootcamp-finalproject-team-6

# 2. Conda 환경 생성 및 활성화
conda create -n abc-bootcamp-FP-2025 python=3.12 -y
conda activate abc-bootcamp-FP-2025

# 3. 패키지 설치
pip install -r requirements.txt

# 4. Jupyter Lab 실행
jupyter lab
```

> 📋 **더 자세한 설정 가이드**: [docs/SETUP.md](docs/SETUP.md)  
> 🚀 **퀵스타트 가이드**: [docs/QUICKSTART.md](docs/QUICKSTART.md)

### 1. 환경 설정

```bash
# 프로젝트 클론
git clone https://github.com/River-181/abc-bootcamp-finalproject-team-6.git
cd abc-bootcamp-finalproject-team-6

# Conda 환경 활성화
conda activate abc-bootcamp-FP-2025

# 필요한 패키지 설치 (이미 설치됨)
pip install -r requirements.txt
```

### 2. GitHub 협업 설정

#### 첫 번째 설정 (프로젝트 소유자)
```bash
# Git 초기화 및 첫 커밋
git init
git add .
git commit -m "Initial commit: 프로젝트 환경 설정 완료"

# GitHub 저장소 연결
git remote add origin https://github.com/[YOUR_USERNAME]/abc-bootcamp-finalproject-team-6.git
git branch -M main
git push -u origin main
```

#### 팀원 참여 방법
```bash
# 저장소 클론
git clone https://github.com/River-181/abc-bootcamp-finalproject-team-6.git

# 새 브랜치 생성하여 작업
git checkout -b feature/your-feature-name

# 작업 후 커밋 및 푸시
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/your-feature-name

# GitHub에서 Pull Request 생성
```

### 3. Jupyter Lab 실행

```bash
jupyter lab
```

### 4. 데이터 분석 워크플로우

1. **EDA (탐색적 데이터 분석)**: `notebooks/01_EDA.ipynb`
2. **데이터 전처리**: `notebooks/02_Preprocessing.ipynb`
3. **모델링**: `notebooks/03_Modeling.ipynb`
4. **평가**: `notebooks/04_Evaluation.ipynb`

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

## �📚 주요 라이브러리

- **데이터 처리**: pandas, numpy
- **시각화**: matplotlib, seaborn, plotly
- **머신러닝**: scikit-learn, tensorflow
- **통계 분석**: scipy, statsmodels
- **노트북**: jupyter, ipykernel

## 🎯 프로젝트 목표

[여기에 프로젝트의 구체적인 목표를 작성하세요]

## 📊 데이터셋

[사용할 데이터셋에 대한 설명을 추가하세요]

## 👥 팀 멤버

[팀 멤버 정보를 추가하세요]

## 📝 사용법

### 데이터 로딩
```python
from src.utils.data_loader import load_csv, get_data_info

# 데이터 로드
df = load_csv('data/raw/your_data.csv')

# 데이터 정보 확인
info = get_data_info(df)
print(info)
```

### 시각화
```python
from src.visualization.plots import plot_distribution, plot_correlation_matrix

# 분포 시각화
plot_distribution(df, 'column_name')

# 상관관계 매트릭스
plot_correlation_matrix(df)
```

## 🔧 개발 도구

- **코드 포맷팅**: black
- **린터**: flake8
- **테스트**: pytest

## 📞 연락처 및 지원

### 📖 문서
- [환경 설정 가이드](docs/SETUP.md): 상세한 환경 구성 방법
- [퀵스타트 가이드](docs/QUICKSTART.md): 5분 만에 시작하기
- [프로젝트 구조 설명](docs/PROJECT_STRUCTURE.md): 폴더별 역할 설명

### 🆘 문제 해결
1. [SETUP.md](docs/SETUP.md)의 문제 해결 섹션 참조
2. GitHub Issues 탭에서 이슈 생성
3. 팀 슬랙 채널에 질문

### 👥 팀원
[팀 멤버 정보를 추가하세요]

### 🤝 기여 방법
1. 이슈 생성 또는 기존 이슈 선택
2. 브랜치 생성: `git checkout -b feature/issue-number`
3. 코드 작성 및 테스트
4. Pull Request 생성
5. 코드 리뷰 후 병합

프로젝트 관련 문의사항이 있으시면 팀 멤버에게 연락해주세요.
