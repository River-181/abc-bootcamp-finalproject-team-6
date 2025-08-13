/**
 * NoiseBuddy WebSocket Server
 * IoT 디바이스로부터 데이터를 수신하여 Supabase에 저장하고 웹 클라이언트에 브로드캐스트
 */

const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

class NoiseBuddyServer {
    constructor(port = 8080) {
        this.port = port;
        this.wss = null;
        this.supabase = null;
        this.webClients = new Set(); // 웹 앱 클라이언트들을 추적
        
        this.initializeSupabase();
    }

    /**
     * Supabase 클라이언트 초기화
     */
    initializeSupabase() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_url_here')) {
            console.log('⚠️  Supabase 환경 변수가 설정되지 않았습니다.');
            console.log('📊 테스트 모드로 실행됩니다 (데이터베이스 저장 없음)');
            this.supabase = null;
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase 클라이언트 초기화 완료');
    }

    /**
     * 웹소켓 서버 시작
     */
    start() {
        this.wss = new WebSocket.Server({ 
            port: this.port,
            perMessageDeflate: false
        });

        console.log(`🚀 NoiseBuddy 웹소켓 서버 시작 - 포트: ${this.port}`);

        this.wss.on('connection', (ws, request) => {
            const clientIp = request.socket.remoteAddress;
            console.log(`🔌 새로운 클라이언트 연결: ${clientIp}`);

            // 클라이언트 타입 구분을 위한 초기 메시지 대기
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    
                    // IoT 디바이스로부터의 센서 데이터인지 확인
                    if (data.deviceId && data.vibration !== undefined && data.noise !== undefined) {
                        this.handleSensorData(data);
                    } else if (data.type === 'web_client_init') {
                        // 웹 클라이언트 등록
                        this.webClients.add(ws);
                        console.log(`🌐 웹 클라이언트 등록됨 (총 ${this.webClients.size}개)`);
                        
                        ws.send(JSON.stringify({
                            type: 'connection_confirmed',
                            message: 'NoiseBuddy 서버에 연결되었습니다.'
                        }));
                    }
                } catch (error) {
                    console.error('❌ 메시지 파싱 오류:', error.message);
                }
            });

            ws.on('close', () => {
                console.log(`❌ 클라이언트 연결 종료: ${clientIp}`);
                this.webClients.delete(ws);
                console.log(`🌐 웹 클라이언트 수: ${this.webClients.size}개`);
            });

            ws.on('error', (error) => {
                console.error('❌ 웹소켓 연결 오류:', error.message);
                this.webClients.delete(ws);
            });
        });

        // Graceful shutdown 처리
        process.on('SIGINT', () => {
            console.log('\n🛑 서버 종료 중...');
            this.wss.close(() => {
                console.log('✅ 웹소켓 서버 종료 완료');
                process.exit(0);
            });
        });
    }

    /**
     * IoT 디바이스로부터 수신한 센서 데이터 처리
     */
    async handleSensorData(sensorData) {
        console.log(`📊 센서 데이터 수신: ${sensorData.deviceId} - 진동=${sensorData.vibration}, 소음=${sensorData.noise}`);

        try {
            // Supabase에 데이터 저장
            await this.saveSensorDataToDatabase(sensorData);
            
            // 웹 클라이언트들에게 브로드캐스트
            this.broadcastToWebClients(sensorData);
            
        } catch (error) {
            console.error('❌ 센서 데이터 처리 오류:', error.message);
        }
    }

    /**
     * 센서 데이터를 Supabase에 저장
     */
    async saveSensorDataToDatabase(sensorData) {
        // Supabase가 설정되지 않은 경우 테스트 모드로 동작
        if (!this.supabase) {
            console.log(`🧪 테스트 모드 - 데이터 로깅: ${sensorData.deviceId} (진동: ${sensorData.vibration}, 소음: ${sensorData.noise})`);
            return null;
        }

        try {
            const { data, error } = await this.supabase
                .from('noise_logs')
                .insert([
                    {
                        device_id: sensorData.deviceId,  // 소문자 스네이크 케이스로 변경
                        vibration: sensorData.vibration,
                        noise: sensorData.noise,
                        // timestamp는 Supabase에서 자동으로 created_at에 설정됨
                    }
                ]);

            if (error) {
                throw error;
            }

            console.log(`💾 데이터베이스 저장 성공: ${sensorData.deviceId}`);
            return data;
        } catch (error) {
            console.error('❌ 데이터베이스 저장 실패:', error.message);
            throw error;
        }
    }

    /**
     * 연결된 모든 웹 클라이언트에게 데이터 브로드캐스트
     */
    broadcastToWebClients(sensorData) {
        const message = JSON.stringify({
            type: 'sensor_data',
            data: sensorData
        });

        let activeClients = 0;
        this.webClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.send(message);
                    activeClients++;
                } catch (error) {
                    console.error('❌ 클라이언트 전송 오류:', error.message);
                    this.webClients.delete(client);
                }
            } else {
                this.webClients.delete(client);
            }
        });

        if (activeClients > 0) {
            console.log(`📡 ${activeClients}개 웹 클라이언트에게 브로드캐스트 완료`);
        }
    }
}

// 서버 인스턴스 생성 및 시작
const server = new NoiseBuddyServer(8080);
server.start();
