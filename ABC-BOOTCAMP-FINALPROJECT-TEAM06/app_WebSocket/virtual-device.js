/**
 * NoiseBuddy Virtual IoT Device Simulator
 * ESP32 하드웨어를 시뮬레이션하여 진동과 소음 데이터를 생성하고 웹소켓 서버에 전송
 */

const WebSocket = require('ws');

class VirtualNoiseBuddyDevice {
    constructor(serverUrl = 'ws://localhost:8080', deviceId = 'NoiseBuddy-001') {
        this.serverUrl = serverUrl;
        this.deviceId = deviceId;
        this.ws = null;
        this.isConnected = false;
        this.dataInterval = null;
    }

    /**
     * 웹소켓 서버에 연결
     */
    connect() {
        console.log(`🔌 가상 디바이스 ${this.deviceId} 서버 연결 시도: ${this.serverUrl}`);
        
        this.ws = new WebSocket(this.serverUrl);

        this.ws.on('open', () => {
            console.log('✅ 웹소켓 서버 연결 성공');
            this.isConnected = true;
            this.startSendingData();
        });

        this.ws.on('close', () => {
            console.log('❌ 웹소켓 서버 연결 종료');
            this.isConnected = false;
            this.stopSendingData();
            
            // 3초 후 재연결 시도
            setTimeout(() => {
                console.log('🔄 재연결 시도...');
                this.connect();
            }, 3000);
        });

        this.ws.on('error', (error) => {
            console.error('❌ 웹소켓 연결 오류:', error.message);
        });
    }

    /**
     * 진동 데이터 생성 (0-100 사이의 랜덤 값)
     */
    generateVibrationData() {
        return Math.round(Math.random() * 100 * 100) / 100; // 소수점 2자리까지
    }

    /**
     * 소음 데이터 생성 (30-90 사이의 랜덤 값)
     */
    generateNoiseData() {
        return Math.round((Math.random() * 60 + 30) * 100) / 100; // 소수점 2자리까지
    }

    /**
     * 센서 데이터 패키지 생성
     */
    createSensorData() {
        return {
            deviceId: this.deviceId,
            vibration: this.generateVibrationData(),
            noise: this.generateNoiseData(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 데이터 전송 시작 (1초마다)
     */
    startSendingData() {
        if (this.dataInterval) {
            clearInterval(this.dataInterval);
        }

        this.dataInterval = setInterval(() => {
            if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
                const sensorData = this.createSensorData();
                
                try {
                    this.ws.send(JSON.stringify(sensorData));
                    console.log(`📡 데이터 전송: 진동=${sensorData.vibration}, 소음=${sensorData.noise}`);
                } catch (error) {
                    console.error('❌ 데이터 전송 실패:', error.message);
                }
            }
        }, 1000); // 1초마다 전송
    }

    /**
     * 데이터 전송 중지
     */
    stopSendingData() {
        if (this.dataInterval) {
            clearInterval(this.dataInterval);
            this.dataInterval = null;
        }
    }

    /**
     * 디바이스 시뮬레이션 시작
     */
    start() {
        console.log('🚀 NoiseBuddy 가상 디바이스 시작');
        this.connect();
        
        // Graceful shutdown 처리
        process.on('SIGINT', () => {
            console.log('\n🛑 가상 디바이스 종료 중...');
            this.stopSendingData();
            if (this.ws) {
                this.ws.close();
            }
            process.exit(0);
        });
    }
}

// 가상 디바이스 인스턴스 생성 및 시작
const device = new VirtualNoiseBuddyDevice();
device.start();
