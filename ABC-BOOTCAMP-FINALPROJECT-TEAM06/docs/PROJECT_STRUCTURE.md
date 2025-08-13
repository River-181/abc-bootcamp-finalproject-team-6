# 📁 프로젝트 구조 설명

이 문서는 프로젝트의 폴더 구조와 각 파일의 역할을 설명합니다.

## 📂 전체 구조

```
abc-bootcamp-finalproject-team-6/
├── README.md                    # 프로젝트 메인 문서
├── requirements.txt             # Python 패키지 목록
├── .gitignore                   # Git 추적 제외 파일 목록
├── 📁 data/                     # 데이터 저장소
│   ├── raw/                     # 원시 데이터
│   ├── processed/               # 전처리된 데이터
│   └── external/                # 외부 참조 데이터
├── 📁 notebooks/               # Jupyter 노트북
│   ├── 01_EDA.ipynb            # 탐색적 데이터 분석
│   ├── 02_Preprocessing.ipynb  # 데이터 전처리
│   ├── 03_Modeling.ipynb       # 모델링
│   └── 04_Evaluation.ipynb     # 평가 및 검증
├── 📁 src/                     # 소스 코드 모듈
│   ├── data_processing/        # 데이터 처리 모듈
│   ├── models/                 # 머신러닝 모델
│   ├── utils/                  # 유틸리티 함수
│   └── visualization/          # 시각화 모듈
├── 📁 results/                 # 결과물 저장
│   ├── figures/                # 생성된 그래프
│   ├── models/                 # 학습된 모델
│   └── reports/                # 분석 리포트
├── 📁 docs/                    # 프로젝트 문서
│   ├── SETUP.md               # 환경 설정 가이드
│   ├── QUICKSTART.md          # 퀵스타트 가이드
│   └── PROJECT_STRUCTURE.md   # 이 문서
└── 📁 tests/                   # 테스트 파일
```

## 📋 폴더별 상세 설명

### 📊 `data/` - 데이터 디렉토리

#### `data/raw/`
- **목적**: 원시 데이터 저장
- **규칙**: 
  - 원본 데이터는 절대 수정하지 않음
  - 파일명은 날짜나 버전 포함 권장
  - 큰 파일은 `.gitignore`에 의해 Git 추적 제외
- **예시 파일**:
  ```
  sales_data_2024.csv
  customer_info_raw.xlsx
  api_response_20240101.json
  ```

#### `data/processed/`
- **목적**: 전처리된 데이터 저장
- **포함 내용**:
  - 정리된 데이터셋
  - 피처 엔지니어링 완료 데이터
  - 학습/검증/테스트 분할 데이터
- **파일 형식**: `.pkl`, `.parquet`, `.h5`, `.csv`

#### `data/external/`
- **목적**: 외부 참조 데이터
- **포함 내용**:
  - 공개 데이터셋
  - 참조 테이블 (지역 코드, 카테고리 매핑 등)
  - 메타데이터

### 📓 `notebooks/` - Jupyter 노트북

#### 네이밍 규칙
- `01_EDA.ipynb`: 탐색적 데이터 분석
- `02_Preprocessing.ipynb`: 데이터 전처리
- `03_Modeling.ipynb`: 모델 개발 및 학습
- `04_Evaluation.ipynb`: 모델 평가 및 검증

#### 작성 가이드라인
- 각 노트북은 독립적으로 실행 가능해야 함
- 마크다운으로 충분한 설명 추가
- 결과 출력은 저장 후 커밋
- 긴 실행 시간의 셀은 별도 표시

### 🔧 `src/` - 소스 코드 모듈

#### `src/data_processing/`
- **역할**: 데이터 전처리 관련 함수들
- **주요 파일**:
  - `__init__.py`: 모듈 초기화
  - `preprocessing.py`: 전처리 함수들
  - `feature_engineering.py`: 피처 엔지니어링
  - `data_validation.py`: 데이터 검증

#### `src/models/`
- **역할**: 머신러닝 모델 정의
- **주요 파일**:
  - `__init__.py`: 모듈 초기화
  - `base_model.py`: 기본 모델 클래스
  - `regression_models.py`: 회귀 모델들
  - `classification_models.py`: 분류 모델들
  - `ensemble_models.py`: 앙상블 모델들

#### `src/utils/`
- **역할**: 공통 유틸리티 함수들
- **주요 파일**:
  - `__init__.py`: 모듈 초기화
  - `data_loader.py`: 데이터 로딩/저장
  - `config.py`: 설정 관리
  - `logger.py`: 로깅 설정

#### `src/visualization/`
- **역할**: 시각화 관련 함수들
- **주요 파일**:
  - `__init__.py`: 모듈 초기화
  - `plots.py`: 기본 플롯 함수들
  - `interactive_plots.py`: 인터랙티브 시각화
  - `report_plots.py`: 리포트용 시각화

### 📈 `results/` - 결과물 저장

#### `results/figures/`
- **목적**: 생성된 그래프 및 시각화 결과
- **파일 형식**: `.png`, `.jpg`, `.pdf`, `.svg`
- **네이밍**: `날짜_분석종류_상세설명.확장자`
- **예시**: `20240801_EDA_correlation_matrix.png`

#### `results/models/`
- **목적**: 학습된 모델 저장
- **파일 형식**: `.pkl`, `.joblib`, `.h5`, `.pth`
- **포함 내용**:
  - 최종 모델
  - 중간 체크포인트
  - 모델 설정 파일

#### `results/reports/`
- **목적**: 분석 리포트 및 문서
- **파일 형식**: `.md`, `.html`, `.pdf`
- **포함 내용**:
  - 주간/월간 분석 리포트
  - 모델 성능 리포트
  - 비즈니스 인사이트 문서

### 📚 `docs/` - 프로젝트 문서

#### 문서 종류
- `SETUP.md`: 상세한 환경 설정 가이드
- `QUICKSTART.md`: 빠른 시작 가이드
- `PROJECT_STRUCTURE.md`: 프로젝트 구조 설명 (이 문서)
- `API_REFERENCE.md`: 함수/클래스 참조 문서

### 🧪 `tests/` - 테스트 파일

#### 테스트 구조
```
tests/
├── __init__.py
├── test_data_processing/
├── test_models/
├── test_utils/
└── test_visualization/
```

#### 테스트 실행
```bash
# 모든 테스트 실행
pytest

# 특정 모듈 테스트
pytest tests/test_data_processing/

# 커버리지와 함께 실행
pytest --cov=src
```

## 🔄 워크플로우

### 1. 데이터 분석 프로세스
```
data/raw/ → notebooks/01_EDA.ipynb → 
data/processed/ → notebooks/02_Preprocessing.ipynb →
src/models/ → notebooks/03_Modeling.ipynb →
results/ → notebooks/04_Evaluation.ipynb
```

### 2. 코드 개발 프로세스
```
issue 생성 → branch 생성 → 
src/ 모듈 개발 → tests/ 테스트 작성 →
notebooks/ 활용 예시 → 
Pull Request → 코드 리뷰 → merge
```

## 📏 네이밍 규칙

### 파일명
- **Snake case 사용**: `data_loader.py`
- **의미 있는 이름**: `customer_churn_model.py`
- **날짜 포함 (필요시)**: `analysis_20240801.ipynb`

### 변수명
- **Snake case**: `train_data`, `model_accuracy`
- **상수**: `MAX_ITERATIONS`, `DEFAULT_CONFIG`
- **클래스**: `PascalCase` - `DataProcessor`, `ModelEvaluator`

### 함수명
- **동사로 시작**: `load_data()`, `train_model()`, `calculate_metrics()`
- **명확한 의미**: `remove_outliers()` (not `clean_data()`)

## 🚨 주의사항

### Git 관리
- 큰 데이터 파일은 Git에 업로드하지 않음
- 민감한 정보 (API 키, 비밀번호)는 `.env` 파일 사용
- 바이너리 파일은 필요시만 커밋

### 코드 품질
- 함수는 한 가지 기능만 수행
- 주석과 docstring 필수
- 타입 힌트 사용 권장
- 테스트 코드 작성

### 성능 고려사항
- 대용량 데이터는 청크 단위로 처리
- 메모리 사용량 모니터링
- 중간 결과물 저장으로 재실행 시간 단축

이 구조를 따르면 체계적이고 유지보수가 쉬운 데이터 분석 프로젝트를 만들 수 있습니다.
