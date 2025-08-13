/**
 * NoiseBuddy Web App Frontend
 * 실시간 센서 데이터를 수신하여 대시보드 형태로 표시하는 React 앱
 */

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  // 웹소켓 연결 상태 관리
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [currentData, setCurrentData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const wsRef = useRef(null);

  // 웹소켓 서버 URL (Replit 환경에 맞게 조정)
  const WS_URL = 'ws://localhost:8080';

  /**
   * 웹소켓 연결 초기화
   */
  const connectWebSocket = () => {
    try {
      setConnectionStatus('Connecting...');
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('✅ 웹소켓 서버 연결 성공');
        setConnectionStatus('Connected');
        
        // 서버에 웹 클라이언트임을 알림
        wsRef.current.send(JSON.stringify({ type: 'web_client_init' }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'sensor_data') {
            handleSensorData(message.data);
          } else if (message.type === 'connection_confirmed') {
            console.log('✅ 서버 연결 확인:', message.message);
          }
        } catch (error) {
          console.error('❌ 메시지 처리 오류:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('❌ 웹소켓 연결 종료');
        setConnectionStatus('Disconnected');
        
        // 3초 후 재연결 시도
        setTimeout(() => {
          console.log('🔄 재연결 시도...');
          connectWebSocket();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ 웹소켓 오류:', error);
        setConnectionStatus('Error');
      };

    } catch (error) {
      console.error('❌ 웹소켓 연결 실패:', error);
      setConnectionStatus('Error');
    }
  };

  /**
   * 센서 데이터 처리
   */
  const handleSensorData = (data) => {
    console.log('📊 센서 데이터 수신:', data);
    
    setCurrentData(data);
    
    // 히스토리에 추가 (최대 10개 유지)
    setDataHistory(prev => {
      const newHistory = [data, ...prev].slice(0, 10);
      return newHistory;
    });
  };

  /**
   * 컴포넌트 마운트 시 웹소켓 연결
   */
  useEffect(() => {
    connectWebSocket();
    
    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  /**
   * 연결 상태에 따른 스타일 클래스 반환
   */
  const getConnectionStatusClass = () => {
    switch (connectionStatus) {
      case 'Connected': return 'status-connected';
      case 'Connecting...': return 'status-connecting';
      case 'Error': return 'status-error';
      default: return 'status-disconnected';
    }
  };

  /**
   * 진동/소음 레벨에 따른 경고 색상 반환
   */
  const getAlertLevel = (value, type) => {
    if (type === 'vibration') {
      if (value > 80) return 'alert-high';
      if (value > 60) return 'alert-medium';
      return 'alert-low';
    } else { // noise
      if (value > 70) return 'alert-high';
      if (value > 50) return 'alert-medium';
      return 'alert-low';
    }
  };

  /**
   * 시간 포맷팅
   */
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔊 NoiseBuddy Dashboard</h1>
        <div className={`connection-status ${getConnectionStatusClass()}`}>
          <span className="status-indicator"></span>
          {connectionStatus}
        </div>
      </header>

      <main className="app-main">
        {/* 현재 센서 데이터 대시보드 */}
        <section className="current-data-section">
          <h2>📊 실시간 센서 데이터</h2>
          
          {currentData ? (
            <div className="sensor-dashboard">
              <div className="device-info">
                <h3>디바이스: {currentData.deviceId}</h3>
                <p>마지막 업데이트: {formatTime(currentData.timestamp)}</p>
              </div>
              
              <div className="sensor-gauges">
                {/* 진동 게이지 */}
                <div className="gauge-container">
                  <h4>진동 레벨</h4>
                  <div className="gauge">
                    <div 
                      className={`gauge-fill ${getAlertLevel(currentData.vibration, 'vibration')}`}
                      style={{ width: `${currentData.vibration}%` }}
                    ></div>
                    <span className="gauge-value">{currentData.vibration}</span>
                  </div>
                  <div className="gauge-scale">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* 소음 게이지 */}
                <div className="gauge-container">
                  <h4>소음 레벨 (dB)</h4>
                  <div className="gauge">
                    <div 
                      className={`gauge-fill ${getAlertLevel(currentData.noise, 'noise')}`}
                      style={{ width: `${((currentData.noise - 30) / 60) * 100}%` }}
                    ></div>
                    <span className="gauge-value">{currentData.noise}</span>
                  </div>
                  <div className="gauge-scale">
                    <span>30</span>
                    <span>60</span>
                    <span>90</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>센서 데이터를 기다리는 중...</p>
              <div className="loading-spinner"></div>
            </div>
          )}
        </section>

        {/* 데이터 히스토리 */}
        <section className="history-section">
          <h2>📈 최근 데이터 로그</h2>
          
          {dataHistory.length > 0 ? (
            <div className="data-history">
              <div className="history-header">
                <span>시간</span>
                <span>디바이스</span>
                <span>진동</span>
                <span>소음</span>
              </div>
              
              {dataHistory.map((data, index) => (
                <div key={index} className="history-item">
                  <span className="history-time">{formatTime(data.timestamp)}</span>
                  <span className="history-device">{data.deviceId}</span>
                  <span className={`history-vibration ${getAlertLevel(data.vibration, 'vibration')}`}>
                    {data.vibration}
                  </span>
                  <span className={`history-noise ${getAlertLevel(data.noise, 'noise')}`}>
                    {data.noise} dB
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-history">아직 수신된 데이터가 없습니다.</p>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>NoiseBuddy PoC - Real-time IoT Noise Monitoring System</p>
      </footer>
    </div>
  );
};

export default App;
