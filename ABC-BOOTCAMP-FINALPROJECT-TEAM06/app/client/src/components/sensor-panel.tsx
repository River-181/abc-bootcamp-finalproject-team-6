import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSensorDetection, DetectionType } from '@/hooks/use-sensor-detection';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Mic, Waves, Play, Square, AlertTriangle } from 'lucide-react';

interface SensorPanelProps {
  onInteraction?: () => void;
}

export default function SensorPanel({ onInteraction }: SensorPanelProps) {
  const [isActive, setIsActive] = useState(false);
  const {
    isListening,
    detectionType,
    voiceFeatures,
    vibrationFeatures,
    isSpeaking,
    isContinuousVibration,
    error,
    startListening,
    stopListening
  } = useSensorDetection();

  const petCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/character/default_user/pet");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/character/default_user"] });
      onInteraction?.();
    },
  });

  const feedCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/character/default_user/feed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/character/default_user"] });
      onInteraction?.();
    },
  });

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
      setIsActive(false);
    } else {
      await startListening();
      setIsActive(true);
    }
  };

  // 감지 결과에 따른 자동 반응
  useEffect(() => {
    if (!isListening) return;

    if (detectionType === DetectionType.VOICE_ONLY && isSpeaking) {
      // 음성 감지시 캐릭터 쓰다듬기
      if (!petCharacterMutation.isPending) {
        petCharacterMutation.mutate();
      }
    } else if (detectionType === DetectionType.VIBRATION_ONLY && vibrationFeatures.type >= 2) {
      // 강한 진동 감지시 캐릭터 돌보기
      if (!feedCharacterMutation.isPending) {
        feedCharacterMutation.mutate();
      }
    } else if (detectionType === DetectionType.BOTH_DETECTED) {
      // 음성과 진동 모두 감지시 특별 반응
      if (!petCharacterMutation.isPending && !feedCharacterMutation.isPending) {
        feedCharacterMutation.mutate();
      }
    }
  }, [detectionType, isSpeaking, vibrationFeatures.type, isListening, petCharacterMutation, feedCharacterMutation]);

  const getDetectionColor = () => {
    switch (detectionType) {
      case DetectionType.VOICE_ONLY:
        return 'text-blue-400';
      case DetectionType.VIBRATION_ONLY:
        return 'text-green-400';
      case DetectionType.BOTH_DETECTED:
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getDetectionText = () => {
    switch (detectionType) {
      case DetectionType.VOICE_ONLY:
        return '음성 감지됨';
      case DetectionType.VIBRATION_ONLY:
        return '진동 감지됨';
      case DetectionType.BOTH_DETECTED:
        return '음성+진동 감지됨';
      default:
        return '감지 대기 중';
    }
  };

  const getVibrationTypeText = () => {
    switch (vibrationFeatures.type) {
      case 3: return '충격';
      case 2: return '강한 진동';
      case 1: return '가벼운 진동';
      default: return '진동 없음';
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center space-x-2">
          <Waves className="w-5 h-5" />
          <span>스마트 센서</span>
        </h3>
        
        <button
          onClick={handleToggleListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          disabled={petCharacterMutation.isPending || feedCharacterMutation.isPending}
        >
          {isListening ? (
            <>
              <Square className="w-4 h-4" />
              <span>중지</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>센서 시작</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}

      {isListening && (
        <div className="space-y-4">
          {/* 전체 상태 */}
          <div className="text-center">
            <div className={`text-sm font-medium ${getDetectionColor()}`}>
              {getDetectionText()}
            </div>
            {(isSpeaking || isContinuousVibration) && (
              <div className="text-xs text-gray-400 mt-1">
                {isSpeaking && '🎤 말하는 중'}
                {isSpeaking && isContinuousVibration && ' • '}
                {isContinuousVibration && '📳 지속적 진동'}
              </div>
            )}
          </div>

          {/* 음성 분석 */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Mic className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">음성 분석</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">강도: </span>
                <span className="text-white">{voiceFeatures.amplitude.toFixed(0)}</span>
              </div>
              <div>
                <span className="text-gray-400">신뢰도: </span>
                <span className="text-white">{(voiceFeatures.confidence * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-gray-400">변화량: </span>
                <span className="text-white">{(voiceFeatures.variation * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-gray-400">일관성: </span>
                <span className="text-white">{(voiceFeatures.consistency * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* 진동 분석 */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Waves className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">진동 분석</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">강도: </span>
                <span className="text-white">{vibrationFeatures.intensity.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">타입: </span>
                <span className="text-white">{getVibrationTypeText()}</span>
              </div>
            </div>
          </div>

          {/* 상태 표시등 */}
          <div className="flex justify-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${
              detectionType === DetectionType.VOICE_ONLY || detectionType === DetectionType.BOTH_DETECTED
                ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'
            }`} title="음성 감지"></div>
            <div className={`w-3 h-3 rounded-full ${
              detectionType === DetectionType.VIBRATION_ONLY || detectionType === DetectionType.BOTH_DETECTED
                ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
            }`} title="진동 감지"></div>
            <div className={`w-3 h-3 rounded-full ${
              isSpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'
            }`} title="말하기"></div>
            <div className={`w-3 h-3 rounded-full ${
              isContinuousVibration ? 'bg-red-400 animate-pulse' : 'bg-gray-600'
            }`} title="지속적 진동"></div>
          </div>
        </div>
      )}

      {!isListening && !error && (
        <div className="text-center text-gray-400 text-sm py-4">
          <div className="mb-2">센서 시작 버튼을 눌러 음성과 진동을 감지하세요</div>
          <div className="text-xs text-gray-500">
            📱 iOS에서는 진동 센서 권한을 요청합니다
          </div>
        </div>
      )}
    </div>
  );
}