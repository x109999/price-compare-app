#!/bin/bash

# 即时零售比价工具 - 一键部署脚本
# 支持：阿里云 ECS / 腾讯云 CVM / 本地服务器

set -e

echo "🚀 开始部署即时零售比价工具..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
check_nodejs() {
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Node.js 未安装，正在安装...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} 已安装${NC}"
    echo -e "${GREEN}✓ npm ${NPM_VERSION} 已安装${NC}"
}

# 安装依赖
install_dependencies() {
    echo -e "${YELLOW}正在安装后端依赖...${NC}"
    cd backend
    npm install --production
    cd ..
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
}

# 配置环境变量
setup_env() {
    echo -e "${YELLOW}配置环境变量...${NC}"
    
    if [ -f backend/.env ]; then
        echo -e "${YELLOW}发现已有 .env 文件${NC}"
        read -p "是否覆盖？(y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            echo -e "${GREEN}✓ 保留原有配置${NC}"
            return
        fi
    fi
    
    cat > backend/.env << EOF
# 1688 开放平台配置
APP_KEY=${APP_KEY:-your_app_key}
APP_SECRET=${APP_SECRET:-your_app_secret}

# 回调地址（部署后修改为实际域名）
REDIRECT_URI=http://localhost:3000/callback

# 服务配置
PORT=3000
NODE_ENV=production
EOF
    
    echo -e "${GREEN}✓ 环境变量配置完成${NC}"
    echo -e "${YELLOW}⚠️  请编辑 backend/.env 填入您的 APP_KEY 和 APP_SECRET${NC}"
}

# 配置 systemd 服务
setup_systemd() {
    echo -e "${YELLOW}配置系统服务...${NC}"
    
    sudo tee /etc/systemd/system/price-compare.service > /dev/null <<EOF
[Unit]
Description=Price Compare Backend Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/backend
ExecStart=$(which node) server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable price-compare.service
    echo -e "${GREEN}✓ 系统服务配置完成${NC}"
}

# 配置 Nginx
setup_nginx() {
    echo -e "${YELLOW}配置 Nginx...${NC}"
    
    if ! command -v nginx &> /dev/null; then
        echo -e "${YELLOW}Nginx 未安装，正在安装...${NC}"
        sudo apt-get update
        sudo apt-get install -y nginx
    fi
    
    DOMAIN=${DOMAIN:-localhost}
    
    sudo tee /etc/nginx/sites-available/price-compare > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN};
    
    # 前端静态文件
    location / {
        root $(pwd);
        index 比价工具 -1688 登录版.html;
        try_files \$uri \$uri/ =404;
    }
    
    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
    
    # 回调地址
    location /callback {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/price-compare /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    
    echo -e "${GREEN}✓ Nginx 配置完成${NC}"
    echo -e "${GREEN}✓ 访问地址：http://${DOMAIN}${NC}"
}

# 配置 HTTPS（可选）
setup_https() {
    echo -e "${YELLOW}配置 HTTPS（可选）...${NC}"
    read -p "是否配置 HTTPS？需要域名 (y/n): " setup_https
    
    if [ "$setup_https" = "y" ]; then
        read -p "请输入域名：" DOMAIN
        
        if ! command -v certbot &> /dev/null; then
            echo -e "${YELLOW}Certbot 未安装，正在安装...${NC}"
            sudo apt-get install -y certbot python3-certbot-nginx
        fi
        
        sudo certbot --nginx -d ${DOMAIN}
        echo -e "${GREEN}✓ HTTPS 配置完成${NC}"
    fi
}

# 启动服务
start_service() {
    echo -e "${YELLOW}启动服务...${NC}"
    sudo systemctl start price-compare.service
    sudo systemctl status price-compare.service --no-pager
    
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo -e "访问地址：${GREEN}http://$(hostname -I | awk '{print $1}')${NC}"
    echo -e "后端状态：${GREEN}运行中${NC}"
    echo ""
    echo -e "${YELLOW}下一步：${NC}"
    echo "1. 编辑 backend/.env 填入 APP_KEY 和 APP_SECRET"
    echo "2. 重启服务：sudo systemctl restart price-compare.service"
    echo "3. 如果有域名，配置 HTTPS"
    echo ""
}

# 主流程
main() {
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}即时零售比价工具 - 部署脚本${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    
    check_nodejs
    install_dependencies
    setup_env
    setup_systemd
    setup_nginx
    setup_https
    start_service
}

# 运行
main
