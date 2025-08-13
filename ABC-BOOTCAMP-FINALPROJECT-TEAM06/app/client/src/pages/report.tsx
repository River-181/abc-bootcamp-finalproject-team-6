import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CharacterState } from "@shared/schema";
import { useSensorDetection } from "@/hooks/use-sensor-detection";
import AIReport from "@/components/ai-report";
import MobileStatusBar from "@/components/mobile-status-bar";
import { ArrowLeft, FileText, Download, Share } from "lucide-react";
import { Link } from "wouter";

export default function Report() {
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: characterState } = useQuery<CharacterState>({
    queryKey: ["/api/character/default_user"],
  });

  const sensorState = useSensorDetection();

  const handleExport = async () => {
    setIsExporting(true);
    
    // 리포트 내용을 텍스트로 생성
    const reportContent = `
=== AI 웰니스 리포트 ===
생성 시간: ${new Date().toLocaleString('ko-KR')}

📊 현재 상태:
- 캐릭터 색상: ${characterState?.color || '노란색'}
- 수면 시간: ${characterState?.sleepHours}시간
- 수면 품질: ${characterState?.sleepQuality}
- 웰니스 점수: ${characterState?.wellnessScore}점

🎤 음성 분석:
- 현재 강도: ${Math.round(sensorState.voiceFeatures.amplitude)}
- 신뢰도: ${Math.round(sensorState.voiceFeatures.confidence * 100)}%
- 변화량: ${Math.round(sensorState.voiceFeatures.variation * 100)}%
- 일관성: ${Math.round(sensorState.voiceFeatures.consistency * 100)}%

📳 진동 분석:
- 현재 강도: ${sensorState.vibrationFeatures.intensity.toFixed(2)}
- 타입: ${sensorState.vibrationFeatures.type === 0 ? '없음' : 
          sensorState.vibrationFeatures.type === 1 ? '가벼운 진동' :
          sensorState.vibrationFeatures.type === 2 ? '강한 진동' : '충격'}

🤖 AI 분석:
- 감지 상태: ${sensorState.detectionType}
- 말하는 중: ${sensorState.isSpeaking ? '예' : '아니요'}
- 지속적 진동: ${sensorState.isContinuousVibration ? '예' : '아니요'}

💡 추천사항:
1. 규칙적인 수면 패턴을 유지하세요
2. 캐릭터와 꾸준한 상호작용을 해보세요  
3. 적절한 운동과 휴식의 균형을 맞추세요

이 리포트는 AI가 실시간 센서 데이터를 분석하여 생성되었습니다.
    `.trim();

    // 텍스트 파일로 다운로드
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wellness-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI 웰니스 리포트',
          text: `오늘의 웰니스 점수: ${characterState?.wellnessScore}점\n수면 품질: ${characterState?.sleepQuality}\n건강한 하루를 보내고 있어요!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('공유하기 취소됨');
      }
    } else {
      // 공유 API를 지원하지 않는 경우 클립보드에 복사
      const shareText = `AI 웰니스 리포트\n웰니스 점수: ${characterState?.wellnessScore}점\n수면 품질: ${characterState?.sleepQuality}`;
      await navigator.clipboard.writeText(shareText);
      alert('리포트 내용이 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <MobileStatusBar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">AI 리포트</h1>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Share className="w-4 h-4" />
              <span className="hidden sm:inline">공유</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExporting ? '내보내는 중...' : '내보내기'}
              </span>
            </button>
          </div>
        </div>

        {/* 센서가 활성화되지 않은 경우 */}
        {!sensorState.isListening && (
          <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-yellow-300 text-sm">
                더 정확한 분석을 위해 홈페이지에서 센서를 활성화해주세요
              </span>
            </div>
          </div>
        )}

        {/* AI 리포트 컴포넌트 */}
        <AIReport 
          characterState={characterState}
          sensorData={{
            voiceFeatures: sensorState.voiceFeatures,
            vibrationFeatures: sensorState.vibrationFeatures,
            detectionType: sensorState.detectionType,
            isSpeaking: sensorState.isSpeaking,
            isContinuousVibration: sensorState.isContinuousVibration
          }}
        />

        {/* 푸터 정보 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>이 리포트는 AI가 실시간 센서 데이터를 분석하여 생성되었습니다.</p>
          <p className="mt-1">정확한 분석을 위해 센서를 지속적으로 활성화해주세요.</p>
        </div>
      </div>
    </div>
  );
}