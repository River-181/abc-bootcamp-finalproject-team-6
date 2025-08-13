import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CharacterState } from '@shared/schema';
import { Brain, TrendingUp, Activity, Moon, Heart, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ActivityData {
  time: string;
  voiceActivity: number;
  vibrationActivity: number;
  interactionCount: number;
  wellnessScore: number;
}

interface AIReportProps {
  characterState?: CharacterState;
  sensorData: {
    voiceFeatures: {
      amplitude: number;
      confidence: number;
      variation: number;
    };
    vibrationFeatures: {
      intensity: number;
      type: number;
    };
    detectionType: string;
    isSpeaking: boolean;
    isContinuousVibration: boolean;
  };
}

export default function AIReport({ characterState, sensorData }: AIReportProps) {
  const [timeRange, setTimeRange] = useState('today');
  const [activityHistory, setActivityHistory] = useState<ActivityData[]>([]);

  // 실시간 데이터 수집
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const newData: ActivityData = {
        time: timeString,
        voiceActivity: sensorData.voiceFeatures.confidence * 100,
        vibrationActivity: sensorData.vibrationFeatures.intensity * 10,
        interactionCount: sensorData.isSpeaking ? 1 : 0,
        wellnessScore: characterState?.wellnessScore || 0
      };

      setActivityHistory(prev => {
        const updated = [...prev, newData];
        // 최근 20개 데이터포인트만 유지
        return updated.slice(-20);
      });
    }, 5000); // 5초마다 데이터 수집

    return () => clearInterval(interval);
  }, [sensorData, characterState]);

  // AI 분석 데이터 생성
  const aiAnalysis = useMemo(() => {
    const recent = activityHistory.slice(-10);
    const avgVoice = recent.reduce((sum, item) => sum + item.voiceActivity, 0) / recent.length || 0;
    const avgVibration = recent.reduce((sum, item) => sum + item.vibrationActivity, 0) / recent.length || 0;
    const totalInteractions = recent.reduce((sum, item) => sum + item.interactionCount, 0);

    // AI 건강 점수 계산
    let healthScore = 70; // 기본 점수
    if (avgVoice > 50) healthScore += 10; // 활발한 음성 활동
    if (avgVibration < 30) healthScore += 10; // 적정 운동량
    if (totalInteractions > 3) healthScore += 10; // 적극적 상호작용

    // 수면 품질 예측
    const sleepQuality = characterState?.sleepQuality === 'good' ? 85 : 
                        characterState?.sleepQuality === 'fair' ? 65 : 45;

    // 활동 패턴 분석
    const activityPattern = avgVoice > 60 ? '활발함' : 
                           avgVoice > 30 ? '보통' : '조용함';

    return {
      healthScore: Math.min(100, healthScore),
      sleepQuality,
      activityPattern,
      recommendations: [
        avgVoice < 30 ? '더 많은 대화나 음성 활동을 권장합니다' : '음성 활동량이 적절합니다',
        avgVibration > 50 ? '너무 많은 움직임이 감지됩니다. 휴식을 취하세요' : '적절한 활동량을 유지하고 있습니다',
        totalInteractions < 2 ? '캐릭터와 더 많이 상호작용해보세요' : '캐릭터와의 상호작용이 활발합니다'
      ]
    };
  }, [activityHistory, characterState]);

  // 차트 색상
  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // 활동 분포 데이터
  const activityDistribution = [
    { name: '음성 활동', value: Math.round(aiAnalysis.healthScore * 0.4), color: '#3b82f6' },
    { name: '운동 활동', value: Math.round(aiAnalysis.healthScore * 0.3), color: '#10b981' },
    { name: '휴식', value: Math.round(aiAnalysis.healthScore * 0.2), color: '#f59e0b' },
    { name: '상호작용', value: Math.round(aiAnalysis.healthScore * 0.1), color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* AI 리포트 헤더 */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-blue-300" />
          <h2 className="text-xl font-bold text-white">AI 웰니스 리포트</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300">{aiAnalysis.healthScore}</div>
            <div className="text-sm text-gray-300">건강 점수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">{aiAnalysis.sleepQuality}</div>
            <div className="text-sm text-gray-300">수면 품질</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-300">{aiAnalysis.activityPattern}</div>
            <div className="text-sm text-gray-300">활동 패턴</div>
          </div>
        </div>
      </div>

      {/* 실시간 활동 차트 */}
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">실시간 활동 분석</h3>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1 border border-gray-700"
          >
            <option value="today">오늘</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={activityHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => value.split(':')[0] + ':' + value.split(':')[1]}
            />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="voiceActivity" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="음성 활동"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="vibrationActivity" 
              stroke="#10b981" 
              strokeWidth={2}
              name="진동 활동"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="wellnessScore" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="웰니스 점수"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 활동 분포 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-medium text-white">활동 분포</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={activityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {activityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {activityDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-300">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI 추천사항 */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-medium text-white">AI 추천사항</h3>
          </div>
          
          <div className="space-y-3">
            {aiAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-300">{rec}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">오늘의 목표</span>
            </div>
            <p className="text-sm text-gray-300">
              건강 점수 85점 달성하고, 캐릭터와 5회 이상 상호작용하기
            </p>
          </div>
        </div>
      </div>

      {/* 상세 통계 */}
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-medium text-white">상세 통계</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-blue-400">
              {Math.round(sensorData.voiceFeatures.amplitude)}
            </div>
            <div className="text-xs text-gray-400">현재 음성 강도</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-green-400">
              {Math.round(sensorData.voiceFeatures.confidence * 100)}%
            </div>
            <div className="text-xs text-gray-400">음성 신뢰도</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-yellow-400">
              {sensorData.vibrationFeatures.intensity.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">진동 강도</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-red-400">
              {activityHistory.length}
            </div>
            <div className="text-xs text-gray-400">데이터 포인트</div>
          </div>
        </div>
      </div>
    </div>
  );
}