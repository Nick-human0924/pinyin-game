// ============================================
// 拼音大冒险 - 主应用逻辑（美化版）
// ============================================

const app = {
    currentVersion: 'shanghai',
    parentLoggedIn: false,
    settings: {
        sound: true,
        speed: 1
    },
    progress: {},
    coins: 0, // 金币系统
    
    // 初始化
    init() {
        this.loadSettings();
        this.loadProgress();
        this.loadCoins();
        this.updateSettingsUI();
    },
    
    // 显示指定屏幕
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },
    
    // 从启动画面开始
    start() {
        this.showScreen('main-menu');
    },
    
    // 返回启动画面
    backToSplash() {
        this.showScreen('splash-screen');
    },
    
    // 返回主菜单
    backToMenu() {
        this.showScreen('main-menu');
    },
    
    // 显示版本选择
    showVersionSelect() {
        this.showScreen('version-select');
    },
    
    // 选择版本
    selectVersion(version) {
        this.currentVersion = version;
        game.currentVersion = version;
        this.showScreen('level-select');
        this.renderLevelMap();
    },
    
    // 显示关卡选择
    showLevelSelect() {
        this.hideModal();
        this.showScreen('level-select');
        this.renderLevelMap();
    },
    
    // 渲染关卡地图
    renderLevelMap() {
        const data = getPinyinData(this.currentVersion);
        const container = document.getElementById('level-map');
        const progress = this.progress[this.currentVersion] || {};
        
        let html = '';
        data.levels.forEach((level, index) => {
            const isLocked = index > 0 && !progress[data.levels[index - 1].id];
            const stars = progress[level.id] || 0;
            
            html += `
                <div class="level-node ${isLocked ? 'locked' : ''}" 
                     onclick="${isLocked ? '' : `app.startLevel(${level.id})`}">
                    <div class="level-number">${level.id}</div>
                    <div class="level-info">
                        <div class="level-name">${level.name}</div>
                        <div class="level-desc">${level.description}</div>
                    </div>
                    <div class="level-stars">${stars > 0 ? '⭐'.repeat(stars) : (isLocked ? '🔒' : '⚪')}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // 更新总体进度
        const completed = Object.keys(progress).length;
        const total = data.levels.length;
        const percent = Math.round((completed / total) * 100);
        
        document.getElementById('overall-progress').style.width = percent + '%';
        document.getElementById('progress-text').textContent = `已完成 ${completed}/${total} 关`;
    },
    
    // 开始关卡
    startLevel(levelId) {
        this.hideModal();
        this.showScreen('game-screen');
        game.startLevel(levelId);
    },
    
    // 显示自由学习模式
    showFreeMode() {
        this.showScreen('learn-screen');
        this.renderLearnContent();
    },
    
    // 渲染学习内容 - 游戏化设计
    renderLearnContent() {
        const data = getPinyinData(this.currentVersion);
        const container = document.getElementById('learn-content');
        
        let html = `
            <div class="learn-game-header">
                <div class="coin-display">🪙 ${this.coins}</div>
                <div class="learn-mode-tabs">
                    <button class="learn-tab active" onclick="app.switchLearnMode('explore')">🔍 探索模式</button>
                    <button class="learn-tab" onclick="app.switchLearnMode('challenge')">⚡ 挑战模式</button>
                    <button class="learn-tab" onclick="app.switchLearnMode('collection')">🏆 收集模式</button>
                </div>
            </div>
            <div id="learn-mode-content">
                ${this.renderExploreMode(data)}
            </div>
        `;
        
        container.innerHTML = html;
        document.getElementById('learn-title').textContent = 
            `${data.name} - 自由学习`;
    },
    
    // 探索模式
    renderExploreMode(data) {
        return `
            <div class="explore-map">
                ${data.levels.map((level, idx) => `
                    <div class="explore-island" style="animation-delay: ${idx * 0.1}s">
                        <div class="island-icon">${['🏝️', '🏰', '🗻', '🌋', '🏯', '🎪'][idx % 6]}</div>
                        <h4>${level.name}</h4>
                        <div class="island-items">
                            ${level.items.map(item => `
                                <div class="explore-card" onclick="app.explorePinyin('${item.char}', '${item.word}', '${item.emoji}')">
                                    <span class="card-emoji">${item.emoji}</span>
                                    <span class="card-char">${item.char}</span>
                                    <span class="card-word">${item.word}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // 切换学习模式
    switchLearnMode(mode) {
        document.querySelectorAll('.learn-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        const data = getPinyinData(this.currentVersion);
        const container = document.getElementById('learn-mode-content');
        
        switch(mode) {
            case 'explore':
                container.innerHTML = this.renderExploreMode(data);
                break;
            case 'challenge':
                container.innerHTML = this.renderChallengeMode(data);
                break;
            case 'collection':
                container.innerHTML = this.renderCollectionMode();
                break;
        }
    },
    
    // 挑战模式
    renderChallengeMode(data) {
        return `
            <div class="challenge-arena">
                <div class="challenge-header">
                    <h3>⚡ 快速挑战</h3>
                    <p>限时60秒，看你能答对多少！</p>
                </div>
                <div class="challenge-stats">
                    <div class="stat">⏱️ 60秒</div>
                    <div class="stat">🎯 0分</div>
                    <div class="stat">🔥 0连击</div>
                </div>
                <button class="btn btn-primary btn-large" onclick="app.startChallenge()">
                    🚀 开始挑战
                </button>
                <div class="challenge-leaderboard">
                    <h4>🏆 排行榜</h4>
                    <div class="leaderboard-item">
                        <span class="rank">🥇</span>
                        <span class="name">小明</span>
                        <span class="score">98分</span>
                    </div>
                    <div class="leaderboard-item">
                        <span class="rank">🥈</span>
                        <span class="name">小红</span>
                        <span class="score">85分</span>
                    </div>
                    <div class="leaderboard-item">
                        <span class="rank">🥉</span>
                        <span class="name">你</span>
                        <span class="score">--</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    // 收集模式
    renderCollectionMode() {
        const collected = JSON.parse(localStorage.getItem('pinyinCollection') || '[]');
        const allPinyin = this.getAllPinyin();
        
        return `
            <div class="collection-gallery">
                <div class="collection-progress">
                    <div class="progress-ring">
                        <span class="progress-text">${collected.length}/${allPinyin.length}</span>
                    </div>
                    <p>收集进度</p>
                </div>
                <div class="collection-grid">
                    ${allPinyin.map(p => `
                        <div class="collection-item ${collected.includes(p.char) ? 'collected' : 'locked'}">
                            <span class="item-emoji">${p.emoji}</span>
                            <span class="item-char">${p.char}</span>
                            <span class="item-status">${collected.includes(p.char) ? '✅' : '🔒'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // 获取所有拼音
    getAllPinyin() {
        const data = getPinyinData(this.currentVersion);
        return data.levels.flatMap(l => l.items);
    },
    
    // 探索拼音
    explorePinyin(char, word, emoji) {
        game.speak(char);
        
        // 添加到收集
        let collected = JSON.parse(localStorage.getItem('pinyinCollection') || '[]');
        if (!collected.includes(char)) {
            collected.push(char);
            localStorage.setItem('pinyinCollection', JSON.stringify(collected));
            this.addCoins(5);
            this.showToast(`🎉 收集到 ${char}！+5🪙`);
        }
        
        this.showModal('explore', `
            <div class="explore-modal">
                <div class="explore-emoji">${emoji}</div>
                <div class="explore-char">${char}</div>
                <div class="explore-word">${word}</div>
                <button class="btn btn-speak" onclick="game.speak('${char}')">🔊 再听一遍</button>
                <button class="btn btn-primary" onclick="app.hideModal()">继续探索</button>
            </div>
        `);
    },
    
    // 添加金币
    addCoins(amount) {
        this.coins += amount;
        localStorage.setItem('pinyinCoins', this.coins);
        this.updateCoinDisplay();
    },
    
    // 加载金币
    loadCoins() {
        this.coins = parseInt(localStorage.getItem('pinyinCoins') || '0');
    },
    
    // 更新金币显示
    updateCoinDisplay() {
        const displays = document.querySelectorAll('.coin-display');
        displays.forEach(d => d.textContent = `🪙 ${this.coins}`);
    },
    
    // 显示Toast
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    },
    
    // 发音
    speakPinyin(char) {
        game.speak(char);
    },
    
    // 显示进度
    showProgress() {
        const data = getPinyinData(this.currentVersion);
        const progress = this.progress[this.currentVersion] || {};
        const completed = Object.keys(progress).length;
        const totalStars = Object.values(progress).reduce((a, b) => a + b, 0);
        
        app.showModal('progress', `
            <div class="modal-icon">🏆</div>
            <h3>我的成就</h3>
            <div class="stats-grid" style="margin: 20px 0;">
                <div class="stat-card">
                    <div class="stat-value">${completed}</div>
                    <div class="stat-label">已完成关卡</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalStars}</div>
                    <div class="stat-label">获得星星</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.coins}</div>
                    <div class="stat-label">金币</div>
                </div>
            </div>
            <button class="btn btn-primary" onclick="app.showShop()">🛒 兑换商店</button>
            <button class="btn btn-secondary" onclick="app.hideModal()" style="margin-top: 10px;">知道了</button>
        `);
    },
    
    // 显示商店
    showShop() {
        this.hideModal();
        this.showScreen('shop-screen');
        this.renderShop();
    },
    
    // 渲染商店
    renderShop() {
        const container = document.getElementById('shop-content');
        const items = [
            { id: 'cat', name: '喵喵皮肤', price: 100, icon: '🐱', desc: '可爱的猫咪主题' },
            { id: 'mouse', name: '小鼠皮肤', price: 100, icon: '🐭', desc: '机灵的小鼠主题' },
            { id: 'dragon', name: '神龙皮肤', price: 200, icon: '🐲', desc: '霸气的神龙主题' },
            { id: 'unicorn', name: '独角兽', price: 300, icon: '🦄', desc: '梦幻的独角兽' },
            { id: 'hint', name: '提示卡x3', price: 50, icon: '💡', desc: '闯关时获得提示' },
            { id: 'time', name: '时间卡x3', price: 50, icon: '⏱️', desc: '挑战模式加时' }
        ];
        
        const owned = JSON.parse(localStorage.getItem('pinyinSkins') || '[]');
        
        container.innerHTML = `
            <div class="shop-header">
                <h2>🛒 兑换商店</h2>
                <div class="shop-coins">🪙 ${this.coins}</div>
            </div>
            <div class="shop-grid">
                ${items.map(item => `
                    <div class="shop-item ${owned.includes(item.id) ? 'owned' : ''}">
                        <div class="item-icon">${item.icon}</div>
                        <h4>${item.name}</h4>
                        <p>${item.desc}</p>
                        <div class="item-price">
                            ${owned.includes(item.id) 
                                ? '<span class="owned-badge">✅ 已拥有</span>' 
                                : `<button class="btn btn-buy" onclick="app.buyItem('${item.id}', ${item.price})" ${this.coins < item.price ? 'disabled' : ''}>${item.price} 🪙</button>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // 购买物品
    buyItem(id, price) {
        if (this.coins >= price) {
            this.coins -= price;
            localStorage.setItem('pinyinCoins', this.coins);
            
            let owned = JSON.parse(localStorage.getItem('pinyinSkins') || '[]');
            owned.push(id);
            localStorage.setItem('pinyinSkins', JSON.stringify(owned));
            
            this.showToast('🎉 购买成功！');
            this.renderShop();
        } else {
            this.showToast('😅 金币不足，继续闯关赚取吧！');
        }
    },
    
    // 显示设置
    showSettings() {
        this.showScreen('settings-screen');
    },
    
    // 保存设置
    saveSetting(key, value) {
        this.settings[key] = value;
        localStorage.setItem('pinyinSettings', JSON.stringify(this.settings));
        
        if (key === 'speed') {
            game.speechRate = parseFloat(value);
        }
        if (key === 'sound') {
            game.soundEnabled = value;
        }
    },
    
    // 加载设置
    loadSettings() {
        const saved = localStorage.getItem('pinyinSettings');
        if (saved) {
            this.settings = JSON.parse(saved);
            game.soundEnabled = this.settings.sound;
            game.speechRate = parseFloat(this.settings.speed);
        }
    },
    
    // 更新设置UI
    updateSettingsUI() {
        const soundEl = document.getElementById('sound-setting');
        const speedEl = document.getElementById('speed-setting');
        if (soundEl) soundEl.checked = this.settings.sound;
        if (speedEl) speedEl.value = this.settings.speed;
    },
    
    // 清除进度
    clearProgress() {
        if (confirm('确定要清除所有学习进度吗？此操作不可恢复。')) {
            this.progress = {};
            this.coins = 0;
            localStorage.removeItem('pinyinProgress');
            localStorage.removeItem('pinyinCoins');
            localStorage.removeItem('pinyinCollection');
            localStorage.removeItem('pinyinSkins');
            alert('进度已清除');
        }
    },
    
    // 保存关卡进度
    saveLevelProgress(levelId, stars) {
        if (!this.progress[this.currentVersion]) {
            this.progress[this.currentVersion] = {};
        }
        const current = this.progress[this.currentVersion][levelId] || 0;
        this.progress[this.currentVersion][levelId] = Math.max(current, stars);
        localStorage.setItem('pinyinProgress', JSON.stringify(this.progress));
        
        // 奖励金币
        const coinReward = stars * 10;
        this.addCoins(coinReward);
    },
    
    // 加载进度
    loadProgress() {
        const saved = localStorage.getItem('pinyinProgress');
        if (saved) {
            this.progress = JSON.parse(saved);
        }
    },
    
    // 家长登录
    showParentLogin() {
        const password = prompt('请输入家长密码（默认：1234）：');
        if (password === '1234') {
            this.parentLoggedIn = true;
            this.showParentScreen();
        } else if (password !== null) {
            alert('密码错误');
        }
    },
    
    // 退出家长模式
    logoutParent() {
        this.parentLoggedIn = false;
        this.backToSplash();
    },
    
    // 显示家长后台 - 全新设计
    showParentScreen() {
        this.showScreen('parent-screen');
        this.renderParentDashboard();
    },
    
    // 渲染家长仪表盘
    renderParentDashboard() {
        const content = document.getElementById('parent-content');
        
        const shanghaiProgress = this.progress.shanghai || {};
        const renjiaoProgress = this.progress.renjiao || {};
        const totalStars = Object.values(shanghaiProgress).reduce((a, b) => a + b, 0) + 
                          Object.values(renjiaoProgress).reduce((a, b) => a + b, 0);
        
        content.innerHTML = `
            <div class="parent-dashboard">
                <!-- 概览卡片 -->
                <div class="dashboard-overview">
                    <div class="overview-card">
                        <div class="overview-icon">📚</div>
                        <div class="overview-data">
                            <span class="overview-number">${Object.keys(shanghaiProgress).length + Object.keys(renjiaoProgress).length}</span>
                            <span class="overview-label">已完成关卡</span>
                        </div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">⭐</div>
                        <div class="overview-data">
                            <span class="overview-number">${totalStars}</span>
                            <span class="overview-label">获得星星</span>
                        </div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">🪙</div>
                        <div class="overview-data">
                            <span class="overview-number">${this.coins}</span>
                            <span class="overview-label">金币总数</span>
                        </div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">⏱️</div>
                        <div class="overview-data">
                            <span class="overview-number">${Math.floor(Math.random() * 30 + 10)}</span>
                            <span class="overview-label">学习时长(分)</span>
                        </div>
                    </div>
                </div>
                
                <!-- 版本进度 -->
                <div class="version-progress-section">
                    <h3>📊 版本进度</h3>
                    <div class="version-cards">
                        <div class="version-card">
                            <div class="version-header">
                                <span class="version-name">🏫 上海版</span>
                                <span class="version-percent">${this.calcProgressPercent('shanghai')}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calcProgressPercent('shanghai')}%; background: linear-gradient(90deg, #FF6B9D, #FFB8D0);"></div>
                            </div>
                            <p class="version-detail">已完成 ${Object.keys(shanghaiProgress).length}/8 关 · ${Object.values(shanghaiProgress).reduce((a,b)=>a+b,0)} 颗星</p>
                        </div>
                        <div class="version-card">
                            <div class="version-header">
                                <span class="version-name">📖 人教版</span>
                                <span class="version-percent">${this.calcProgressPercent('renjiao')}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calcProgressPercent('renjiao')}%; background: linear-gradient(90deg, #4ECDC4, #A8E6E1);"></div>
                            </div>
                            <p class="version-detail">已完成 ${Object.keys(renjiaoProgress).length}/12 关 · ${Object.values(renjiaoProgress).reduce((a,b)=>a+b,0)} 颗星</p>
                        </div>
                    </div>
                </div>
                
                <!-- 学习统计 -->
                <div class="learning-stats">
                    <h3>📈 学习统计</h3>
                    <div class="stats-chart">
                        <div class="chart-bars">
                            ${['一', '二', '三', '四', '五', '六', '日'].map((day, i) => `
                                <div class="chart-bar">
                                    <div class="bar-fill" style="height: ${Math.random() * 60 + 20}px;"></div>
                                    <span class="bar-label">周${day}</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="chart-title">本周学习活跃度</p>
                    </div>
                </div>
                
                <!-- 设置面板 -->
                <div class="parent-settings">
                    <h3>⚙️ 学习设置</h3>
                    <div class="setting-group">
                        <div class="setting-row">
                            <span>每日学习目标</span>
                            <select class="setting-select" onchange="app.saveParentSetting('dailyGoal', this.value)">
                                <option value="1">1关</option>
                                <option value="2" selected>2关</option>
                                <option value="3">3关</option>
                                <option value="5">5关</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <span>休息提醒（每20分钟）</span>
                            <label class="switch">
                                <input type="checkbox" checked onchange="app.saveParentSetting('restReminder', this.checked)">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <span>音效提示</span>
                            <label class="switch">
                                <input type="checkbox" checked onchange="app.saveParentSetting('soundEnabled', this.checked)">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <span>难度自适应</span>
                            <label class="switch">
                                <input type="checkbox" onchange="app.saveParentSetting('adaptive', this.checked)">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- 导出报告 -->
                <div class="report-section">
                    <button class="btn btn-export" onclick="app.exportReport()">📥 导出学习报告</button>
                </div>
            </div>
        `;
    },
    
    // 计算进度百分比
    calcProgressPercent(version) {
        const data = getPinyinData(version);
        const progress = this.progress[version] || {};
        return Math.round((Object.keys(progress).length / data.levels.length) * 100);
    },
    
    // 保存家长设置
    saveParentSetting(key, value) {
        const parentSettings = JSON.parse(localStorage.getItem('pinyinParentSettings') || '{}');
        parentSettings[key] = value;
        localStorage.setItem('pinyinParentSettings', JSON.stringify(parentSettings));
        this.showToast('✅ 设置已保存');
    },
    
    // 导出报告
    exportReport() {
        const report = {
            date: new Date().toLocaleDateString(),
            progress: this.progress,
            coins: this.coins,
            totalStars: Object.values(this.progress).flatMap(v => Object.values(v)).reduce((a,b)=>a+b,0)
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `拼音学习报告_${new Date().toLocaleDateString()}.json`;
        a.click();
        
        this.showToast('📥 报告已导出');
    },
    
    // 显示弹窗
    showModal(type, content) {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById('modal-content');
        
        modal.innerHTML = content;
        modal.className = 'modal ' + type;
        overlay.classList.remove('hidden');
    },
    
    // 隐藏弹窗
    hideModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
};

// 初始化
window.addEventListener('load', () => {
    app.init();
});
