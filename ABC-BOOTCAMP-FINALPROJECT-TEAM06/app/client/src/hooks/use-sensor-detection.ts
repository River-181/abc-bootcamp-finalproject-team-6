import { useState, useEffect, useRef, useCallback } from 'react';

interface VoiceFeatures {
  amplitude: number;
  variation: number;
  consistency: number;
  confidence: number;
}

interface VibrationFeatures {
  intensity: number;
  type: number; // 0=none, 1=light, 2=strong, 3=shock
  isContinuous: boolean;
}

export enum DetectionType {
  NOTHING = 'NOTHING',
  VOICE_ONLY = 'VOICE_ONLY',
  VIBRATION_ONLY = 'VIBRATION_ONLY',
  BOTH_DETECTED = 'BOTH_DETECTED'
}

interface SensorState {
  isListening: boolean;
  detectionType: DetectionType;
  voiceFeatures: VoiceFeatures;
  vibrationFeatures: VibrationFeatures;
  isSpeaking: boolean;
  isContinuousVibration: boolean;
  error: string | null;
}

export function useSensorDetection() {
  const [state, setState] = useState<SensorState>({
    isListening: false,
    detectionType: DetectionType.NOTHING,
    voiceFeatures: { amplitude: 0, variation: 0, consistency: 0, confidence: 0 },
    vibrationFeatures: { intensity: 0, type: 0, isContinuous: false },
    isSpeaking: false,
    isContinuousVibration: false,
    error: null
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // 진동 감지를 위한 변수들
  const baselineRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const vibrationHistoryRef = useRef<number[]>([]);
  const voiceHistoryRef = useRef<boolean[]>([]);
  const lastVoiceTimeRef = useRef<number>(0);
  const lastVibrationTimeRef = useRef<number>(0);
  const voiceStartTimeRef = useRef<number>(0);
  const vibrationStartTimeRef = useRef<number>(0);

  // 임계값 설정
  const VOICE_AMPLITUDE_MIN = 25;
  const VOICE_AMPLITUDE_MAX = 350;
  const VOICE_CONFIDENCE_THRESHOLD = 0.6;
  const LIGHT_VIBRATION_THRESHOLD = 1.5;
  const STRONG_VIBRATION_THRESHOLD = 4.0;
  const SHOCK_THRESHOLD = 8.0;

  const analyzeAudioData = useCallback((dataArray: Uint8Array) => {
    const samples = Array.from(dataArray);
    const sum = samples.reduce((a, b) => a + b, 0);
    const average = sum / samples.length;
    
    const maxVal = Math.max(...samples);
    const minVal = Math.min(...samples);
    const amplitude = maxVal - minVal;
    
    // 변화량 계산
    let changes = 0;
    for (let i = 1; i < samples.length; i++) {
      if (Math.abs(samples[i] - samples[i - 1]) > 8) {
        changes++;
      }
    }
    const variation = changes / samples.length;
    
    // 일관성 계산
    const threshold = average + (amplitude * 0.15);
    let consistent = 0;
    for (let i = 0; i < samples.length; i++) {
      if (Math.abs(samples[i] - average) > threshold) {
        consistent++;
      }
    }
    const consistency = consistent / samples.length;
    
    // 신뢰도 계산
    let confidence = 0;
    if (amplitude > VOICE_AMPLITUDE_MIN && amplitude < VOICE_AMPLITUDE_MAX) {
      confidence += 0.4;
    }
    if (variation > 0.15 && variation < 0.7) {
      confidence += 0.3;
    }
    if (consistency > 0.25) {
      confidence += 0.3;
    }

    return { amplitude, variation, consistency, confidence };
  }, []);

  const analyzeVibration = useCallback(() => {
    if (!baselineRef.current) return { intensity: 0, type: 0, isContinuous: false };

    // DeviceMotionEvent에서 가속도 데이터 가져오기는 실시간으로 이벤트에서 처리
    // 여기서는 히스토리 기반으로 분석
    const history = vibrationHistoryRef.current;
    if (history.length === 0) return { intensity: 0, type: 0, isContinuous: false };

    const currentIntensity = history[history.length - 1] || 0;
    
    let type = 0;
    if (currentIntensity > SHOCK_THRESHOLD) {
      type = 3; // 충격
    } else if (currentIntensity > STRONG_VIBRATION_THRESHOLD) {
      type = 2; // 강한 진동
    } else if (currentIntensity > LIGHT_VIBRATION_THRESHOLD) {
      type = 1; // 가벼운 진동
    }

    // 지속성 확인
    const recentHistory = history.slice(-5);
    const avgIntensity = recentHistory.reduce((a, b) => a + b, 0) / recentHistory.length;
    const isContinuous = avgIntensity > LIGHT_VIBRATION_THRESHOLD;

    return { intensity: currentIntensity, type, isContinuous };
  }, []);

  const processFrame = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const voiceFeatures = analyzeAudioData(dataArray);
    const vibrationFeatures = analyzeVibration();

    // 감지 로직
    const voiceDetected = voiceFeatures.confidence > VOICE_CONFIDENCE_THRESHOLD &&
                         voiceFeatures.amplitude > 15 &&
                         voiceFeatures.variation > 0.1 &&
                         voiceFeatures.variation < 0.8;

    const vibrationDetected = vibrationFeatures.type > 0;

    let detectionType = DetectionType.NOTHING;
    if (voiceDetected && vibrationDetected) {
      detectionType = DetectionType.BOTH_DETECTED;
    } else if (voiceDetected) {
      detectionType = DetectionType.VOICE_ONLY;
    } else if (vibrationDetected) {
      detectionType = DetectionType.VIBRATION_ONLY;
    }

    // 음성 히스토리 업데이트
    const currentTime = Date.now();
    voiceHistoryRef.current.push(voiceDetected);
    if (voiceHistoryRef.current.length > 12) {
      voiceHistoryRef.current.shift();
    }

    // 말하기 상태 감지
    const voiceCount = voiceHistoryRef.current.filter(Boolean).length;
    const newIsSpeaking = voiceCount >= 4;
    
    if (!state.isSpeaking && newIsSpeaking) {
      voiceStartTimeRef.current = currentTime;
    }

    if (voiceDetected) {
      lastVoiceTimeRef.current = currentTime;
    }

    if (vibrationDetected) {
      lastVibrationTimeRef.current = currentTime;
    }

    setState(prev => ({
      ...prev,
      voiceFeatures,
      vibrationFeatures,
      detectionType,
      isSpeaking: newIsSpeaking,
      isContinuousVibration: vibrationFeatures.isContinuous
    }));

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [analyzeAudioData, analyzeVibration, state.isSpeaking]);

  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration || !baselineRef.current) return;

    const x = acceleration.x ?? 0;
    const y = acceleration.y ?? 0;
    const z = acceleration.z ?? 0;
    const baseline = baselineRef.current;

    const deltaX = x - baseline.x;
    const deltaY = y - baseline.y;
    const deltaZ = z - baseline.z;

    const intensity = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

    vibrationHistoryRef.current.push(intensity);
    if (vibrationHistoryRef.current.length > 10) {
      vibrationHistoryRef.current.shift();
    }
  }, []);

  const startListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });

      // AudioContext 초기화
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      // 진동 센서 권한 요청 및 기준값 설정
      if ('DeviceMotionEvent' in window) {
        try {
          // iOS에서 권한 요청 (사용자 제스처 필요)
          if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            const permission = await (DeviceMotionEvent as any).requestPermission();
            if (permission !== 'granted') {
              console.warn('DeviceMotion 권한이 거부되었습니다. 음성 감지만 사용됩니다.');
            } else {
              setupDeviceMotion();
            }
          } else {
            // Android 및 기타 플랫폼에서는 바로 설정
            setupDeviceMotion();
          }
        } catch (motionError) {
          console.warn('DeviceMotion 설정 실패:', motionError);
        }
      }

      setState(prev => ({ ...prev, isListening: true }));
      animationFrameRef.current = requestAnimationFrame(processFrame);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : '센서 초기화에 실패했습니다' 
      }));
    }
  }, [handleDeviceMotion, processFrame]);

  const setupDeviceMotion = useCallback(() => {
    // 기준값 캘리브레이션
    let samples = 0;
    let sumX = 0, sumY = 0, sumZ = 0;

    const calibrateHandler = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        sumX += acceleration.x ?? 0;
        sumY += acceleration.y ?? 0;
        sumZ += acceleration.z ?? 0;
        samples++;

        if (samples >= 10) {
          baselineRef.current = {
            x: sumX / samples,
            y: sumY / samples,
            z: sumZ / samples
          };
          window.removeEventListener('devicemotion', calibrateHandler);
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      }
    };

    window.addEventListener('devicemotion', calibrateHandler);
  }, [handleDeviceMotion]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    window.removeEventListener('devicemotion', handleDeviceMotion);

    setState(prev => ({ 
      ...prev, 
      isListening: false,
      detectionType: DetectionType.NOTHING,
      isSpeaking: false,
      isContinuousVibration: false
    }));
  }, [handleDeviceMotion]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...state,
    startListening,
    stopListening
  };
}