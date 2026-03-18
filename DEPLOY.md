# 🚀 快速部署指南 - 获取对外展示网址

## 方案 1：Vercel 部署（推荐 ⭐）

**优点**：免费、HTTPS、自动 CDN、永久有效

### 步骤：

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 或者直接把项目文件夹拖到 Vercel CLI

3. **使用 Vercel CLI（更快）**
   ```bash
   # 安装 Vercel CLI
   npm install -g vercel
   
   # 进入项目目录
   cd /home/admin/openclaw/workspace/price-compare-app
   
   # 部署
   vercel
   
   # 按提示操作：
   # - Set up and deploy? Y
   # - Which scope? 选择你的账号
   # - Link to existing project? N
   # - Project name? price-compare-app
   # - Directory? ./
   # - Override settings? N
   
   # 部署完成后会显示：
   # ✅ Production: https://price-compare-app-xxx.vercel.app
   ```

4. **获取网址**
   - 部署完成后，Vercel 会给你一个 `https://xxx.vercel.app` 的网址
   - 这个网址可以直接分享给任何人访问

---

## 方案 2：Netlify Deploy

**优点**：同样免费、支持拖拽部署

### 步骤：

1. 访问 https://app.netlify.com/drop
2. 直接把 `price-compare-app` 文件夹拖到网页上
3. 几秒钟后生成 `https://xxx.netlify.app` 网址

---

## 方案 3：GitHub Pages

**优点**：完全免费、适合长期展示

### 步骤：

1. **创建 GitHub 仓库**
   ```bash
   cd /home/admin/openclaw/workspace/price-compare-app
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/price-compare-app.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库页面
   - Settings → Pages
   - Source 选择 "main branch"
   - 保存后获得 `https://你的用户名.github.io/price-compare-app`

---

## 方案 4：临时公网 URL（测试用）

### 使用 ngrok：
```bash
# 安装 ngrok
npm install -g ngrok

# 启动（确保本地服务器在运行）
ngrok http 8080
```
会生成一个临时网址如：`https://xxx.ngrok.io`

### 使用 Cloudflare Tunnel：
```bash
# 安装 cloudflared
cloudflared tunnel --url http://localhost:8080
```

---

## 🎯 推荐方案

| 需求 | 推荐方案 | 耗时 |
|------|----------|------|
| 快速分享测试 | Vercel CLI | 2 分钟 |
| 长期展示 | GitHub Pages | 5 分钟 |
| 无需注册 | Netlify Drop | 1 分钟 |

---

## 需要我帮您直接部署吗？

如果您有 Vercel 账号，我可以帮您：
1. 安装 Vercel CLI
2. 自动完成部署
3. 返回最终的公网网址

请告诉我您想使用哪个方案！
