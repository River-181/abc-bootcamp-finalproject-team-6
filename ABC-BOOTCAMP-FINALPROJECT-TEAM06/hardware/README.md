# 🔧 쿵덕이 하드웨어 센서

> **Arduino 기반 층간소음 감지 및 알림 디바이스**

## 🎯 하드웨어 개요

쿵덕이 하드웨어는 **Arduino 기반의 IoT 센서 디바이스**로, 층간소음을 감지하고 시각적/청각적 피드백을 제공하는 스마트 센서입니다. 터치 센서를 통해 활성화되며, 네오픽셀 LED와 피에조 부저를 통해 사용자에게 직관적인 알림을 제공합니다.

### ✨ 주요 기능
- 🖐️ **터치 센서**: 사용자 인터랙션 감지
- 💡 **네오픽셀 LED**: 12개 RGB LED를 통한 시각적 피드백
- 🎵 **피에조 부저**: '학교종이 땡땡땡' 멜로디 재생
- 🎨 **상태 표시**: 평온(초록) / 알림(보라) 색상 변화

## 🛠️ 하드웨어 구성

### 필요한 부품
- **Arduino Uno/Nano**: 메인 컨트롤러
- **터치 센서**: 디지털 입력 (2번 핀)
- **네오픽셀 LED 링/스트립**: 12개 RGB LED (6번 핀)
- **피에조 부저**: 소리 출력 (9번 핀)
- **점퍼 와이어**: 연결선
- **브레드보드**: 회로 구성 (선택사항)

### 📐 핀 배치도

```
Arduino Uno 핀 연결:
┌─────────────────────────────────┐
│  Arduino Uno                    │
│                                 │
│  Digital Pin 2  ←→ 터치 센서     │
│  Digital Pin 6  ←→ 네오픽셀 LED │
│  Digital Pin 9  ←→ 피에조 부저   │
│  GND           ←→ 공통 GND      │
│  5V            ←→ 전원 공급     │
└─────────────────────────────────┘
```

### 🔌 회로 연결

```
터치 센서:
  VCC → Arduino 5V
  GND → Arduino GND
  OUT → Arduino Digital Pin 2

네오픽셀 LED:
  VCC → Arduino 5V
  GND → Arduino GND
  DIN → Arduino Digital Pin 6

피에조 부저:
  + → Arduino Digital Pin 9
  - → Arduino GND
```

## 💻 소프트웨어 구성

### 📦 필요한 라이브러리

#### Adafruit NeoPixel 라이브러리 설치
```
Arduino IDE → 도구 → 라이브러리 관리자 → "Adafruit NeoPixel" 검색 → 설치
```

### 📄 코드 구조

#### 메인 파일: `kungduk_noise_sensor.ino`

```cpp
// 주요 구성요소
#include <Adafruit_NeoPixel.h>  // 네오픽셀 제어

// 핀 정의
#define TOUCH_PIN     2   // 터치 센서
#define NEOPIXEL_PIN  6   // 네오픽셀 LED
#define PIEZO_PIN     9   // 피에조 부저

// 네오픽셀 설정
#define NUM_PIXELS    12  // LED 개수
#define BRIGHTNESS    70  // 밝기 (0-255)
```

### 🎵 멜로디 시스템

#### 학교종이 땡땡땡 구현
- **음계**: 솔(392Hz), 라(440Hz), 미(330Hz), 레(294Hz)
- **박자**: 4분음표와 2분음표 조합
- **구조**: 4마디 × 2반복 형태

```cpp
// 멜로디 배열 (주파수)
int melody[] = {
  392, 392, 440, 440, 392, 392, 330,  // 솔솔라라솔솔미
  392, 392, 330, 330, 294,           // 솔솔미미레
  // ... 반복
};

// 박자 배열 (음표 길이)
int noteDurations[] = {
  4, 4, 4, 4, 4, 4, 2,  // 4분음표들과 2분음표
  // ...
};
```

## 🎮 동작 원리

### 1. 기본 상태 (대기 모드)
```cpp
void loop() {
  if (digitalRead(TOUCH_PIN) == HIGH) {
    playSchoolBell();  // 터치 감지 시 멜로디 재생
  } else {
    // 평상시: 초록색 LED 유지
    pixels.fill(color_calm);  // 초록색 (0, 150, 50)
    pixels.show();
  }
}
```

### 2. 알림 모드 (터치 감지 시)
```cpp
void playSchoolBell() {
  // 1. LED 색상 변경 (초록 → 보라)
  pixels.fill(color_playing);  // 보라색 (200, 0, 200)
  pixels.show();
  
  // 2. 멜로디 재생 (26개 음표)
  for (int thisNote = 0; thisNote < 26; thisNote++) {
    tone(PIEZO_PIN, melody[thisNote], noteDuration);
    delay(pauseBetweenNotes);
    noTone(PIEZO_PIN);
  }
  
  // 3. 1초 대기 (연속 재생 방지)
  delay(1000);
}
```

## 🔧 설정 및 사용법

### Arduino IDE 설정

1. **보드 선택**: Arduino Uno/Nano
2. **포트 선택**: 연결된 USB 포트
3. **라이브러리 설치**: Adafruit NeoPixel
4. **코드 업로드**: `kungduk_noise_sensor.ino` 컴파일 및 업로드

### 하드웨어 조립

1. **회로 연결**: 위의 핀 배치도 참조
2. **전원 공급**: USB 또는 외부 어댑터
3. **테스트**: 터치 센서 동작 확인

### 커스터마이징

#### LED 밝기 조정
```cpp
#define BRIGHTNESS    70  // 0-255 범위에서 조정
```

#### 색상 변경
```cpp
uint32_t color_calm = pixels.Color(0, 150, 50);     // RGB 값 조정
uint32_t color_playing = pixels.Color(200, 0, 200); // RGB 값 조정
```

#### 멜로디 변경
```cpp
// 다른 곡으로 교체 가능
int melody[] = { /* 새로운 주파수 배열 */ };
int noteDurations[] = { /* 새로운 박자 배열 */ };
```

## 🔍 트러블슈팅

### 일반적인 문제 해결

1. **LED가 켜지지 않음**
   - 전원 연결 확인 (5V, GND)
   - 네오픽셀 핀 연결 확인 (6번 핀)
   - 라이브러리 설치 확인

2. **터치 센서 반응 없음**
   - 디지털 2번 핀 연결 확인
   - 센서 전원 연결 확인
   - 시리얼 모니터로 값 확인

3. **소리가 나지 않음**
   - 피에조 부저 극성 확인
   - 9번 핀 연결 확인
   - 부저 불량 여부 확인

4. **컴파일 에러**
   - Adafruit NeoPixel 라이브러리 설치 확인
   - Arduino IDE 버전 업데이트
   - 보드 설정 확인

### 디버깅 코드

```cpp
void setup() {
  Serial.begin(9600);  // 시리얼 통신 시작
  // ... 기존 setup 코드
}

void loop() {
  int touchValue = digitalRead(TOUCH_PIN);
  Serial.print("Touch Sensor: ");
  Serial.println(touchValue);  // 터치 값 출력
  
  // ... 기존 loop 코드
}
```

## 🚀 향후 개선 계획

### 하드웨어 확장
- **소음 센서 추가**: 실제 소음 레벨 측정
- **WiFi 모듈**: ESP32로 업그레이드하여 IoT 연결
- **배터리 팩**: 무선 동작을 위한 전원
- **케이스 설계**: 3D 프린팅 하우징

### 소프트웨어 개선
- **다양한 멜로디**: 여러 알림음 지원
- **소음 레벨 표시**: LED 색상으로 소음 강도 표현
- **WiFi 통신**: 웹앱과 실시간 데이터 교환
- **설정 모드**: 버튼을 통한 각종 설정 변경

### 시스템 통합
- **앱 연동**: WebSocket을 통한 실시간 통신
- **데이터 로깅**: 소음 발생 패턴 기록
- **알림 시스템**: 스마트폰 푸시 알림
- **이웃 연결**: 다중 디바이스 네트워크

## 📞 지원 및 문의

- **프로젝트 리포지토리**: [GitHub](https://github.com/River-181/abc-bootcamp-finalproject-team-6)
- **이슈 리포트**: GitHub Issues
- **개발팀**: ABC 부트캠프 Team 6

### 🔗 관련 문서
- [전체 프로젝트 README](../README.md)
- [웹 애플리케이션 가이드](../app_UI%20and%20AI%20model/README.md)
- [WebSocket 통신 가이드](../app_WebSocket/README.md)

---

> 🔧 **하드웨어 버전**: Arduino Uno 기반 프로토타입  
> 🎯 **목표**: 직관적인 층간소음 알림 시스템  
> 📅 **최종 업데이트**: 2025년 8월 13일  
> 👥 **개발팀**: ABC 부트캠프 Team 6
