// 네오픽셀 라이브러리를 사용합니다.
#include <Adafruit_NeoPixel.h>

// --- 📌 핀 번호 설정 ---
#define TOUCH_PIN     2   // 터치 센서는 디지털 2번 핀
#define NEOPIXEL_PIN  6   // 네오픽셀은 디지털 6번 핀
#define PIEZO_PIN     9   // 피에조 부저는 디지털 9번 핀

// --- ⚙️ 네오픽셀 설정 ---
#define NUM_PIXELS    12  // 사용하는 네오픽셀 개수
#define BRIGHTNESS    70  // 밝기

Adafruit_NeoPixel pixels(NUM_PIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// --- 🎵 '학교종이 땡땡땡' 멜로디와 박자 정의 ---
// 계이름: 솔 솔 라 라 솔 솔 미 / 솔 솔 미 미 레 / 솔 솔 라 라 솔 솔 미 / 솔 솔 미 미 레
int melody[] = {
  392, 392, 440, 440, 392, 392, 330,  // 1절
  392, 392, 330, 330, 294,           // 2절
  392, 392, 440, 440, 392, 392, 330,  // 3절
  392, 392, 330, 330, 294            // 4절
};

// 음표 길이: 4는 4분음표, 2는 2분음표
int noteDurations[] = {
  4, 4, 4, 4, 4, 4, 2,
  4, 4, 4, 4, 2,
  4, 4, 4, 4, 4, 4, 2,
  4, 4, 4, 4, 2
};

// 색깔 정의
uint32_t color_calm = pixels.Color(0, 150, 50);    // 평온 상태: 초록색
uint32_t color_playing = pixels.Color(200, 0, 200); // 연주 상태: 보라색

void setup() {
  pinMode(TOUCH_PIN, INPUT);
  
  pixels.begin();
  pixels.setBrightness(BRIGHTNESS);
  pixels.fill(color_calm);
  pixels.show();
}

void loop() {
  // 터치 센서가 감지되면 (HIGH)
  if (digitalRead(TOUCH_PIN) == HIGH) {
    playSchoolBell(); // '학교종' 멜로디 연주 함수 호출
  } else {
    // 평소에는 초록색으로 유지
    pixels.fill(color_calm);
    pixels.show();
  }
}

// '학교종이 땡땡땡' 멜로디 연주 함수
void playSchoolBell() {
  // 네오픽셀을 연주 상태 색으로 변경
  pixels.fill(color_playing);
  pixels.show();

  // 멜로디의 각 음표를 순서대로 연주
  for (int thisNote = 0; thisNote < 26; thisNote++) {
    
    // 1000을 음표 길이로 나누어 실제 연주 시간 계산
    int noteDuration = 1000 / noteDurations[thisNote];
    
    // tone(핀번호, 음계, 지속시간) 함수로 소리 재생
    tone(PIEZO_PIN, melody[thisNote], noteDuration);

    // 음표 사이의 간격을 줌 (음표 길이의 1.3배)
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    
    // 다음 음표 연주 전에 소리를 끔
    noTone(PIEZO_PIN);
  }

  // 연주가 끝나면 1초 대기 (너무 자주 반복되는 것을 방지)
  delay(1000);
}
