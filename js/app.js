// 即时零售比价工具 - 主逻辑

class PriceCompareApp {
    constructor() {
        this.currentPage = 'welcome-page';
        this.user = null;
        this.orders = [];
        this.deals = [];
        this.progress = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showPage('welcome-page');
    }

    // 绑定事件
    bindEvents() {
        // 开始按钮
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.showPage('login-page');
            this.generateQRCode();
        });

        // 刷新二维码
        document.getElementById('refresh-qr-btn')?.addEventListener('click', () => {
            this.generateQRCode();
        });

        // 取消登录
        document.getElementById('cancel-login-btn')?.addEventListener('click', () => {
            this.showPage('welcome-page');
        });

        // 导出报告
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportReport();
        });

        // 重新比价
        document.getElementById('new-compare-btn')?.addEventListener('click', () => {
            this.startNewCompare();
        });
    }

    // 页面切换
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId)?.classList.add('active');
        this.currentPage = pageId;
    }

    // 生成二维码（模拟）
    generateQRCode() {
        const qrContainer = document.getElementById('qr-code');
        if (!qrContainer) return;

        qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <div class="qr-loading">
                    <div class="spinner"></div>
                    <p>生成二维码中...</p>
                </div>
            </div>
        `;

        // 模拟 API 调用延迟
        setTimeout(() => {
            // 使用简单的 QR 码占位图（实际项目中应使用 QR 码生成库）
            qrContainer.innerHTML = `
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='white' width='200' height='200'/%3E%3Cg fill='black'%3E%3Crect x='20' y='20' width='60' height='60'/%3E%3Crect x='120' y='20' width='60' height='60'/%3E%3Crect x='20' y='120' width='60' height='60'/%3E%3Crect x='100' y='100' width='20' height='20'/%3E%3Crect x='140' y='140' width='20' height='20'/%3E%3Crect x='80' y='40' width='10' height='10'/%3E%3Crect x='40' y='80' width='10' height='10'/%3E%3Crect x='160' y='60' width='10' height='10'/%3E%3Crect x='120' y='100' width='10' height='10'/%3E%3Crect x='60' y='140' width='10' height='10'/%3E%3Crect x='100' y='160' width='10' height='10'/%3E%3Crect x='140' y='80' width='10' height='10'/%3E%3Crect x='80' y='120' width='10' height='10'/%3E%3Crect x='160' y='160' width='10' height='10'/%3E%3Crect x='40' y='160' width='10' height='10'/%3E%3Crect x='180' y='100' width='10' height='10'/%3E%3Crect x='20' y='180' width='10' height='10'/%3E%3Crect x='100' y='60' width='10' height='10'/%3E%3Crect x='60' y='100' width='10' height='10'/%3E%3Crect x='140' y='120' width='10' height='10'/%3E%3Crect x='180' y='140' width='10' height='10'/%3E%3Crect x='80' y='180' width='10' height='10'/%3E%3Crect x='120' y='140' width='10' height='10'/%3E%3Crect x='160' y='100' width='10' height='10'/%3E%3Crect x='40' y='120' width='10' height='10'/%3E%3Crect x='100' y='140' width='10' height='10'/%3E%3Crect x='60' y='160' width='10' height='10'/%3E%3Crect x='140' y='160' width='10' height='10'/%3E%3Crect x='180' y='180' width='10' height='10'/%3E%3Crect x='80' y='80' width='10' height='10'/%3E%3Crect x='120' y='80' width='10' height='10'/%3E%3Crect x='160' y='180' width='10' height='10'/%3E%3C/g%3E%3C/svg%3E" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">
            `;

            // 模拟用户扫码登录
            this.simulateLogin();
        }, 1500);
    }

    // 模拟登录过程
    simulateLogin() {
        setTimeout(() => {
            this.user = {
                name: '用户' + Math.random().toString(36).substr(2, 4).toUpperCase(),
                avatar: '👤'
            };
            
            document.getElementById('user-name').textContent = this.user.name;
            this.showPage('processing-page');
            this.startProcessing();
        }, 3000); // 3 秒后模拟扫码成功
    }

    // 开始处理比价
    startProcessing() {
        this.progress = 0;
        this.orders = [];
        this.deals = [];

        // 步骤 1: 抓取订单
        this.updateStep(1, 'active');
        this.simulateOrderFetching();
    }

    // 模拟订单抓取
    simulateOrderFetching() {
        const totalOrders = Math.floor(Math.random() * 10) + 5; // 5-15 个订单
        let fetched = 0;

        const interval = setInterval(() => {
            fetched++;
            this.orders.push({
                id: fetched,
                name: `商品${fetched}`,
                price: Math.floor(Math.random() * 200) + 50,
                platform: '淘宝/京东'
            });

            document.getElementById('orders-count').textContent = fetched;
            this.updateProgress((fetched / totalOrders) * 33);

            if (fetched >= totalOrders) {
                clearInterval(interval);
                setTimeout(() => this.startComparing(), 500);
            }
        }, 300);
    }

    // 开始 1688 比价
    startComparing() {
        this.updateStep(1, 'completed');
        this.updateStep(2, 'active');

        let compared = 0;
        const interval = setInterval(() => {
            compared++;
            
            // 模拟找到一些优惠商品
            if (Math.random() > 0.4) {
                const order = this.orders[compared - 1];
                if (order) {
                    const savings = Math.floor(order.price * (Math.random() * 0.3 + 0.2)); // 节省 20-50%
                    this.deals.push({
                        id: compared,
                        title: `${order.name} - 1688 同款`,
                        originalPrice: order.price,
                        comparePrice: order.price - savings,
                        savings: savings,
                        image: '📦',
                        link: 'https://www.1688.com'
                    });
                }
            }

            const totalSavings = this.deals.reduce((sum, deal) => sum + deal.savings, 0);
            document.getElementById('potential-savings').textContent = `¥${totalSavings}`;
            this.updateProgress(33 + (compared / this.orders.length) * 33);

            if (compared >= this.orders.length) {
                clearInterval(interval);
                setTimeout(() => this.generateReport(), 500);
            }
        }, 400);
    }

    // 生成报告
    generateReport() {
        this.updateStep(2, 'completed');
        this.updateStep(3, 'active');

        setTimeout(() => {
            this.updateStep(3, 'completed');
            this.updateProgress(100);
            this.showResults();
        }, 1000);
    }

    // 更新步骤状态
    updateStep(stepNum, status) {
        const step = document.getElementById(`step-${stepNum}`);
        if (!step) return;

        step.className = `step ${status}`;
        
        const statusEl = step.querySelector('.step-status');
        if (statusEl) {
            switch(status) {
                case 'active':
                    statusEl.textContent = '进行中...';
                    break;
                case 'completed':
                    statusEl.textContent = '已完成';
                    break;
                default:
                    statusEl.textContent = '等待中';
            }
        }
    }

    // 更新进度
    updateProgress(percent) {
        this.progress = percent;
        const fill = document.getElementById('progress-fill');
        const percentText = document.getElementById('progress-percent');
        const progressText = document.getElementById('progress-text');

        if (fill) fill.style.width = `${percent}%`;
        if (percentText) percentText.textContent = `${Math.round(percent)}%`;
        
        if (progressText) {
            if (percent < 33) {
                progressText.textContent = '正在分析您的订单...';
            } else if (percent < 66) {
                progressText.textContent = '正在 1688 比价中...';
            } else {
                progressText.textContent = '正在生成报告...';
            }
        }
    }

    // 显示结果
    showResults() {
        this.showPage('result-page');

        // 更新统计数据
        const totalSavings = this.deals.reduce((sum, deal) => sum + deal.savings, 0);
        const avgDiscount = this.deals.length > 0 
            ? Math.round((this.deals.reduce((sum, deal) => sum + (deal.savings / deal.originalPrice), 0) / this.deals.length) * 100)
            : 0;

        document.getElementById('deals-count').textContent = this.deals.length;
        document.getElementById('total-savings').textContent = `¥${totalSavings}`;
        document.getElementById('items-found').textContent = this.deals.length;
        document.getElementById('avg-discount').textContent = `${avgDiscount}%`;

        // 渲染商品列表
        this.renderDealsList();
    }

    // 渲染商品列表
    renderDealsList() {
        const container = document.getElementById('deals-list');
        if (!container) return;

        if (this.deals.length === 0) {
            container.innerHTML = `
                <div class="deal-item" style="justify-content: center; padding: 32px;">
                    <p style="color: var(--text-secondary);">暂无优惠商品，继续加油！</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.deals.map(deal => `
            <div class="deal-item">
                <div class="deal-image">${deal.image}</div>
                <div class="deal-info">
                    <div class="deal-title">${deal.title}</div>
                    <div class="deal-prices">
                        <span class="original-price">¥${deal.originalPrice}</span>
                        <span class="compare-price">¥${deal.comparePrice}</span>
                        <span class="deal-savings">省¥${deal.savings}</span>
                    </div>
                    <div class="deal-actions">
                        <button class="view-btn" onclick="app.viewDeal(${deal.id})">查看详情</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 查看商品详情
    viewDeal(dealId) {
        const deal = this.deals.find(d => d.id === dealId);
        if (deal) {
            alert(`商品：${deal.title}\n原价：¥${deal.originalPrice}\n1688 价：¥${deal.comparePrice}\n节省：¥${deal.savings}\n\n即将跳转到 1688...`);
            // 实际项目中这里会打开新窗口跳转到 1688
            // window.open(deal.link, '_blank');
        }
    }

    // 导出报告
    exportReport() {
        const totalSavings = this.deals.reduce((sum, deal) => sum + deal.savings, 0);
        const report = `
即时零售比价报告
================
生成时间：${new Date().toLocaleString('zh-CN')}
用户：${this.user?.name || '未知'}

总结
----
分析订单数：${this.orders.length}
找到优惠：${this.deals.length} 个
总共可省：¥${totalSavings}

优惠商品列表
------------
${this.deals.map(deal => 
    `${deal.title}
    原价：¥${deal.originalPrice} → 1688 价：¥${deal.comparePrice} (省¥${deal.savings})`
).join('\n\n')}
        `.trim();

        // 创建下载
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `比价报告_${new Date().getTime()}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        alert('报告已导出！');
    }

    // 开始新的比价
    startNewCompare() {
        this.showPage('processing-page');
        this.startProcessing();
    }
}

// 初始化应用
const app = new PriceCompareApp();
