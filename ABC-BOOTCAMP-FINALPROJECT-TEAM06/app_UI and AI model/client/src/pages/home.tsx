import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CharacterState } from "@shared/schema";
import CharacterDisplay from "@/components/character-display";
import MobileStatusBar from "@/components/mobile-status-bar";
import SensorPanel from "@/components/sensor-panel";
import { Home as HomeIcon, Menu, FileText } from "lucide-react";
import { Link } from "wouter";

const MOCK_MESSAGES = [
  "현재 잠은 조용해요!",
  "건강한 수면 상태입니다!",
  "깊은 잠에 빠져있어요!",
  "편안한 휴식 중이에요!"
];

const MOCK_SUB_MESSAGES = [
  "지금 상태를 유지해주세요.",
  "계속 이대로 유지하세요.",
  "아주 좋은 상태입니다.",
  "완벽한 휴식이에요."
];

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const { data: characterState, isLoading } = useQuery<CharacterState>({
    queryKey: ["/api/character/default_user"],
  });

  const updateCharacterMutation = useMutation({
    mutationFn: async (updates: Partial<CharacterState>) => {
      const response = await apiRequest("PATCH", "/api/character/default_user", updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/character/default_user"] });
    },
  });

  const petCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/character/default_user/pet");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/character/default_user"] });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    },
  });

  const feedCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/character/default_user/feed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/character/default_user"] });
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % MOCK_MESSAGES.length);
        setIsAnimating(false);
      }, 2000);
    },
  });

  const changeCharacterColor = (color: string) => {
    if (isAnimating || color === characterState?.color) return;
    updateCharacterMutation.mutate({ color });
  };

  const petCharacter = () => {
    if (isAnimating) return;
    petCharacterMutation.mutate();
  };

  const feedCharacter = () => {
    if (isAnimating) return;
    feedCharacterMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-korean text-white overflow-hidden">
      <MobileStatusBar />
      
      {/* App Header */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">운심측정항목</span>
          <div className="flex items-center space-x-4">
            <HomeIcon className="w-5 h-5 text-white" />
            <Menu className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="text-status-blue text-lg font-medium">
          <span>{MOCK_MESSAGES[currentMessage]}</span><br />
          <span className="text-base">{MOCK_SUB_MESSAGES[currentMessage]}</span>
        </div>
      </div>

      {/* Character Display */}
      <CharacterDisplay 
        characterState={characterState}
        isAnimating={isAnimating}
      />

      {/* Character Controls */}
      <div className="px-6 pb-8">
        {/* Mood Status Indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2">
            <div className={`w-3 h-3 rounded-full ${
              characterState?.mood === 'happy' ? 'bg-yellow-500' :
              characterState?.mood === 'excited' ? 'bg-red-500' :
              characterState?.mood === 'sleepy' ? 'bg-blue-500' :
              'bg-green-500'
            }`}></div>
            <span className="text-sm text-gray-300">
              {characterState?.mood === 'happy' ? '기쁨' :
               characterState?.mood === 'excited' ? '흥분' :
               characterState?.mood === 'sleepy' ? '졸림' :
               '평온함'}
            </span>
          </div>
        </div>

        {/* Character Color Selection */}
        <div className="flex justify-center space-x-6 mb-6">
          <button 
            onClick={() => changeCharacterColor('yellow')}
            className={`w-16 h-16 rounded-full new-character-gradient-yellow border-4 transition-all duration-300 transform hover:scale-110 focus:outline-none ${
              characterState?.color === 'yellow' ? 'border-white ring-2 ring-white' : 'border-transparent'
            }`}
            disabled={updateCharacterMutation.isPending}
          >
            <span className="sr-only">노란색 캐릭터</span>
          </button>
          <button 
            onClick={() => changeCharacterColor('green')}
            className={`w-16 h-16 rounded-full new-character-gradient-green border-4 transition-all duration-300 transform hover:scale-110 focus:outline-none ${
              characterState?.color === 'green' ? 'border-white ring-2 ring-white' : 'border-transparent'
            }`}
            disabled={updateCharacterMutation.isPending}
          >
            <span className="sr-only">초록색 캐릭터</span>
          </button>
          <button 
            onClick={() => changeCharacterColor('red')}
            className={`w-16 h-16 rounded-full new-character-gradient-red border-4 transition-all duration-300 transform hover:scale-110 focus:outline-none ${
              characterState?.color === 'red' ? 'border-white ring-2 ring-white' : 'border-transparent'
            }`}
            disabled={updateCharacterMutation.isPending}
          >
            <span className="sr-only">빨간색 캐릭터</span>
          </button>
        </div>

        {/* Interaction Buttons */}
        <div className="space-y-3">
          <button 
            onClick={petCharacter}
            disabled={petCharacterMutation.isPending || isAnimating}
            className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white py-4 rounded-2xl font-medium transition-all duration-200 transform active:scale-95"
          >
            캐릭터 쓰다듬기
          </button>
          <button 
            onClick={feedCharacter}
            disabled={feedCharacterMutation.isPending || isAnimating}
            className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white py-4 rounded-2xl font-medium transition-all duration-200 transform active:scale-95"
          >
            캐릭터 돌보기
          </button>
          
          {/* AI Report Button */}
          <Link href="/report">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-200 shadow-lg flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>AI 리포트 보기</span>
            </button>
          </Link>
        </div>

        {/* Sensor Panel */}
        <div className="mb-6">
          <SensorPanel 
            onInteraction={() => {
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 2000);
            }}
          />
        </div>

        {/* Status Info */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 mb-2">수면 상태</div>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-status-blue font-medium">{characterState?.sleepHours}</div>
              <div className="text-gray-400 text-xs">수면시간</div>
            </div>
            <div className="text-center">
              <div className="text-status-blue font-medium">{characterState?.sleepQuality}</div>
              <div className="text-gray-400 text-xs">수면품질</div>
            </div>
            <div className="text-center">
              <div className="text-status-blue font-medium">{characterState?.wellnessScore}</div>
              <div className="text-gray-400 text-xs">웰니스점수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
