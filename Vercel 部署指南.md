# 🚀 Vercel 部署快速指南（5 分钟完成）

## 当前状态

✅ 代码已准备好
✅ Git 仓库已创建
✅ Vercel CLI 已安装

---

## 步骤 1：登录 Vercel（1 分钟）

### 方式 A：使用浏览器登录（推荐）

1. **打开浏览器访问**：
   ```
   https://vercel.com/login
   ```

2. **选择登录方式**：
   - GitHub（推荐）
   - GitLab
   - Bitbucket
   - 邮箱

3. **登录成功后**，记住您的账号名称

---

## 步骤 2：推送到 GitHub（2 分钟）

### 如果您已有 GitHub 账号：

```bash
# 1. 复制以下命令（替换 YOUR_USERNAME 为您的 GitHub 用户名）
cd /home/admin/openclaw/workspace/price-compare-app

# 2. 在 GitHub 上创建新仓库
# 访问：https://github.com/new
# 仓库名：price-compare-app
# 可见性：Public
# 不要勾选"Initialize this repository with a README"

# 3. 推送代码（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/price-compare-app.git
git push -u origin main
```

### 如果您没有 GitHub 账号：

1. 访问 https://github.com 注册（1 分钟）
2. 验证邮箱
3. 执行上方命令

---

## 步骤 3：部署到 Vercel（2 分钟）

### 方式 A：使用 Vercel 网页（最简单）

1. **访问**：https://vercel.com/new

2. **点击** "Import Git Repository"

3. **选择仓库**：
   - 找到 `price-compare-app`
   - 点击 "Import"

4. **配置项目**：
   - Framework Preset: `Other`
   - Root Directory: `./`
   - 点击 "Deploy"

5. **等待部署**（约 1 分钟）

6. **获得网址**：
   ```
   https://price-compare-app-xxx.vercel.app
   ```

### 方式 B：使用 Vercel CLI

```bash
# 1. 登录（会打开浏览器）
vercel login

# 2. 部署
cd /home/admin/openclaw/workspace/price-compare-app
vercel --prod

# 按提示操作：
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - Project name? price-compare-app
# - Directory? ./
# - Override settings? N
```

---

## 步骤 4：配置环境变量

部署完成后，配置 1688 API 密钥：

1. **进入 Vercel 项目页面**
2. **Settings** → **Environment Variables**
3. **添加变量**：
   ```
   APP_KEY = 你的 1688 app_key
   APP_SECRET = 你的 1688 app_secret
   REDIRECT_URI = https://你的项目.vercel.app/callback
   ```
4. **点击 Save**
5. **重新部署**（Deployments → 点击最新部署的 ⋯ → Redeploy）

---

## 🎉 完成！

您现在拥有：

✅ 公网网址：`https://xxx.vercel.app`
✅ 自动 HTTPS
✅ 全球 CDN
✅ 自动部署（每次 push 到 main 分支自动更新）

---

## 📱 分享网址

可以立即分享给任何人：
- 微信/QQ/钉钉直接发送网址
- 手机浏览器可访问
- 无需下载 APP

---

## ⚠️ 当前使用模拟模式

默认情况下，应用使用模拟登录（`USE_MOCK = true`）。

要使用真实 1688 登录：

1. **申请 1688 开放平台账号**
   - 访问：https://open.1688.com/
   - 创建应用获取 APP_KEY 和 APP_SECRET

2. **修改前端配置**
   - 编辑 `比价工具 -1688 登录版.html`
   - 找到第 570 行：`const USE_MOCK = true;`
   - 改为：`const USE_MOCK = false;`
   - 提交并推送：
     ```bash
     git add .
     git commit -m "启用真实 1688 登录"
     git push
     ```
   - Vercel 会自动重新部署

---

## 🆘 需要帮助？

### 问题 1：推送失败
```bash
# 检查远程仓库地址
git remote -v

# 如果错误，删除重新添加
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/price-compare-app.git
git push -u origin main
```

### 问题 2：Vercel 部署失败
- 检查 Vercel 控制台错误信息
- 确保 `vercel.json` 配置正确
- 尝试删除 node_modules 后重新推送

### 问题 3：访问速度慢
- Vercel 在国内访问可能较慢
- 考虑使用国内 CDN 或阿里云部署

---

## 📞 现在需要我帮您做什么？

**A. 帮您推送 GitHub**
- 提供您的 GitHub 用户名
- 我帮您执行推送命令

**B. 手动部署**
- 按照上方步骤自己操作
- 遇到问题随时问我

**C. 先测试模拟版**
- 直接用 `比价工具.html` 演示
- 稍后再部署到 Vercel

请回复 A/B/C！
