// 1688 扫码登录后端服务
// 使用前请配置 .env 文件中的 APP_KEY 和 APP_SECRET

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 配置
const APP_KEY = process.env.APP_KEY || 'your_app_key';
const APP_SECRET = process.env.APP_SECRET || 'your_app_secret';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';

// 存储授权状态（生产环境应该用 Redis）
const authStates = new Map();

app.use(cors());
app.use(express.json());

// 生成授权二维码
app.get('/api/1688/qr', (req, res) => {
    try {
        // 生成随机 state 防止 CSRF
        const state = crypto.randomBytes(16).toString('hex');
        
        // 存储 state 状态
        authStates.set(state, {
            createdAt: Date.now(),
            status: 'pending'
        });
        
        // 构建 1688 OAuth 授权 URL
        const authUrl = `https://oauth.1688.com/oauth2/authorize?client_id=${APP_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}&scope=user_info`;
        
        // 使用 QR 码生成服务
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(authUrl)}`;
        
        console.log('生成二维码，state:', state);
        
        res.json({
            success: true,
            qrCode: qrCodeUrl,
            state: state,
            authUrl: authUrl
        });
    } catch (error) {
        console.error('生成二维码失败:', error);
        res.status(500).json({
            success: false,
            error: '二维码生成失败'
        });
    }
});

// 1688 回调地址
app.get('/callback', async (req, res) => {
    try {
        const { code, state } = req.query;
        
        console.log('收到回调，code:', code, 'state:', state);
        
        // 验证 state
        const authState = authStates.get(state);
        if (!authState) {
            return res.status(400).send('无效的授权状态');
        }
        
        // 用授权码换取 access_token
        const tokenResponse = await axios.post('https://oauth.1688.com/oauth2/token', {
            client_id: APP_KEY,
            client_secret: APP_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { access_token, expires_in, refresh_token } = tokenResponse.data;
        
        // 获取用户信息
        const userResponse = await axios.get('https://open.1688.com/api/v1/user/info', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        
        const userInfo = userResponse.data;
        
        // 更新授权状态
        authStates.set(state, {
            createdAt: authState.createdAt,
            status: 'completed',
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            user: userInfo
        });
        
        // 显示成功页面
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>登录成功</title>
                <style>
                    body { 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        height: 100vh; 
                        margin: 0; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    }
                    .success { 
                        background: white; 
                        padding: 40px; 
                        border-radius: 16px; 
                        text-align: center;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                    }
                    .success h1 { color: #52c41a; margin-bottom: 16px; }
                    .success p { color: #666; }
                </style>
            </head>
            <body>
                <div class="success">
                    <h1>✅ 登录成功</h1>
                    <p>欢迎，${userInfo.nickname || '用户'}</p>
                    <p style="margin-top: 24px; font-size: 14px;">您可以关闭此窗口</p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('回调处理失败:', error.response?.data || error.message);
        res.status(500).send('登录失败：' + (error.response?.data?.error || error.message));
    }
});

// 检查登录状态（前端轮询）
app.get('/api/1688/check/:state', (req, res) => {
    const { state } = req.params;
    const authState = authStates.get(state);
    
    if (!authState) {
        return res.json({ success: false, status: 'invalid' });
    }
    
    if (authState.status === 'completed') {
        // 清理状态
        authStates.delete(state);
        
        res.json({
            success: true,
            status: 'completed',
            user: authState.user,
            accessToken: authState.accessToken
        });
    } else {
        res.json({
            success: false,
            status: 'pending'
        });
    }
});

// 刷新二维码
app.post('/api/1688/refresh', (req, res) => {
    const { state } = req.body;
    if (state) {
        authStates.delete(state);
    }
    // 重新生成二维码逻辑与 /api/1688/qr 相同
    res.json({ message: '请重新请求 /api/1688/qr 接口' });
});

// 测试接口 - 获取模拟用户信息（用于演示）
app.get('/api/1688/mock-user', (req, res) => {
    res.json({
        success: true,
        user: {
            id: 'mock_user_' + Date.now(),
            nickname: '测试用户',
            avatar: 'https://via.placeholder.com/100'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 1688 登录服务已启动：http://localhost:${PORT}`);
    console.log(`📝 回调地址：${REDIRECT_URI}`);
    console.log(`⚠️  当前使用配置:`);
    console.log(`   APP_KEY: ${APP_KEY.substring(0, 8)}...`);
    console.log(`   APP_SECRET: ${APP_SECRET ? '已配置' : '未配置（使用模拟模式）'}`);
});
