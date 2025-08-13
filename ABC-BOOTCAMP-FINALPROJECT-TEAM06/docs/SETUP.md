# 환경 설정 가이드

이 문서는 프로젝트 환경을 처음부터 설정하는 방법을 설명합니다.

## 1. Python 가상환경 설정

### Option 1: Conda 환경 (권장)

#### Conda 설치 확인
```bash
conda --version
```

#### 새로운 Conda 환경 생성
```bash
# 프로젝트 디렉토리로 이동
cd abc-bootcamp-finalproject-team-6

# Conda 환경 생성 (Python 3.12)
conda create -n abc-bootcamp-FP-2025 python=3.12 -y

# 환경 활성화
conda activate abc-bootcamp-FP-2025

# 패키지 설치
pip install -r requirements.txt
```

#### Conda 환경 관리 명령어
```bash
# 환경 목록 확인
conda info --envs

# 환경 활성화
conda activate abc-bootcamp-FP-2025

# 환경 비활성화
conda deactivate

# 환경 삭제 (필요시)
conda remove -n abc-bootcamp-FP-2025 --all
```

### Option 2: Python venv 환경

#### venv 환경 생성
```bash
# 프로젝트 디렉토리로 이동
cd abc-bootcamp-finalproject-team-6

# 가상환경 생성
python3 -m venv abc-bootcamp-FP-2025

# 환경 활성화 (macOS/Linux)
source abc-bootcamp-FP-2025/bin/activate

# 환경 활성화 (Windows)
abc-bootcamp-FP-2025\Scripts\activate

# 패키지 설치
pip install -r requirements.txt
```

#### venv 환경 관리
```bash
# 환경 비활성화
deactivate

# 환경 삭제 (필요시)
rm -rf abc-bootcamp-FP-2025
```

## 2. GitHub 설정 및 등록

### GitHub 저장소 생성

1. **GitHub 웹사이트에서 새 저장소 생성**
   - https://github.com 접속
   - "New repository" 클릭
   - Repository name: `abc-bootcamp-finalproject-team-6`
   - Description: "ABC 부트캠프 최종 프로젝트 - 데이터 분석"
   - Public 또는 Private 선택
   - "Create repository" 클릭

### 로컬 프로젝트와 GitHub 연결

#### 첫 번째 설정 (새 프로젝트)
```bash
# 프로젝트 디렉토리로 이동
cd abc-bootcamp-finalproject-team-6

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 번째 커밋
git commit -m "Initial commit: 프로젝트 환경 설정 완료"

# GitHub 저장소와 연결
git remote add origin https://github.com/[YOUR_USERNAME]/abc-bootcamp-finalproject-team-6.git

# 메인 브랜치로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

#### 기존 저장소 클론 (팀 프로젝트)
```bash
# 저장소 클론
git clone https://github.com/River-181/abc-bootcamp-finalproject-team-6.git

# 프로젝트 디렉토리로 이동
cd abc-bootcamp-finalproject-team-6

# 브랜치 확인
git branch -a
```

### Git 기본 설정

```bash
# 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 기본 에디터 설정 (선택사항)
git config --global core.editor "code --wait"
```

### 일반적인 Git 워크플로우

```bash
# 작업 전 최신 상태로 업데이트
git pull origin main

# 새 브랜치 생성 및 이동
git checkout -b feature/your-feature-name

# 변경사항 확인
git status

# 파일 스테이징
git add .

# 커밋
git commit -m "feat: 새로운 기능 추가"

# 브랜치 푸시
git push origin feature/your-feature-name

# GitHub에서 Pull Request 생성
```

## 3. 개발 환경 설정

### VS Code 설정 (권장)

#### 필수 확장 프로그램
- Python
- Jupyter
- Python Docstring Generator
- Black Formatter
- Pylance

#### VS Code에서 Python 인터프리터 설정
1. `Ctrl+Shift+P` (또는 `Cmd+Shift+P`)
2. "Python: Select Interpreter" 선택
3. Conda 환경 선택: `abc-bootcamp-FP-2025`

### Jupyter Lab 실행

```bash
# 가상환경 활성화 후
conda activate abc-bootcamp-FP-2025

# Jupyter Lab 실행
jupyter lab

# 또는 Jupyter Notebook
jupyter notebook
```

## 4. 패키지 관리

### 새 패키지 설치 시
```bash
# 패키지 설치
pip install new-package

# requirements.txt 업데이트
pip freeze > requirements.txt
```

### 팀원 간 환경 동기화
```bash
# 최신 requirements.txt로 업데이트
pip install -r requirements.txt --upgrade
```

## 5. 문제 해결

### 일반적인 문제들

#### 1. 가상환경이 활성화되지 않는 경우
```bash
# Conda 환경 재설치
conda remove -n abc-bootcamp-FP-2025 --all
conda create -n abc-bootcamp-FP-2025 python=3.12 -y
conda activate abc-bootcamp-FP-2025
pip install -r requirements.txt
```

#### 2. Jupyter에서 가상환경 커널이 보이지 않는 경우
```bash
# 커널 등록
python -m ipykernel install --user --name=abc-bootcamp-FP-2025 --display-name="Python (abc-bootcamp-FP-2025)"
```

#### 3. Git 인증 문제
```bash
# Personal Access Token 사용 (HTTPS)
git remote set-url origin https://[TOKEN]@github.com/River-181/abc-bootcamp-finalproject-team-6.git

# 또는 SSH 키 설정
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
```

#### 4. 패키지 설치 오류
```bash
# pip 업그레이드
pip install --upgrade pip

# 캐시 클리어
pip cache purge

# 패키지 재설치
pip install -r requirements.txt --force-reinstall
```

## 6. 팀 협업 가이드

### 브랜치 전략
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

### 코드 리뷰 프로세스
1. Feature 브랜치에서 작업
2. Pull Request 생성
3. 팀원 리뷰 요청
4. 승인 후 Main 브랜치에 병합
