// ============================================
// 拼音大冒险 - 主应用逻辑
// ============================================

const app = {
    currentVersion: 'shanghai',
    parentLoggedIn: false,
    settings: {
        sound: true,
        speed: 1
    },
    progress: {},
    
    // 初始化
    init() {
        this.loadSettings();
        this.loadProgress();
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
        this.showVersionSelect();
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
    
    // 渲染学习内容
    renderLearnContent() {
        const data = getPinyinData(this.currentVersion);
        const container = document.getElementById('learn-content');
        
        let html = '';
        data.levels.forEach(level => {
            html += `
                <div class="learn-section">
                    <h3>${level.name}</h3>
                    <div class="pinyin-grid">
                        ${level.items.map(item => `
                            <div class="pinyin-item" onclick="app.speakPinyin('${item.char}')">
                                <span class="pinyin-char">${item.char}</span>
                                <span class="pinyin-example">${item.word}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        document.getElementById('learn-title').textContent = 
            `${data.name} - 自由学习`;
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
            </div>
            <button class="btn btn-primary" onclick="app.hideModal()">知道了</button>
        `);
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
            localStorage.removeItem('pinyinProgress');
            alert('进度已清除');
        }
    },
    
    // 保存关卡进度
    saveLevelProgress(levelId, stars) {
        if (!this.progress[this.currentVersion]) {
            this.progress[this.currentVersion] = {};
        }
        // 只保存最高星级
        const current = this.progress[this.currentVersion][levelId] || 0;
        this.progress[this.currentVersion][levelId] = Math.max(current, stars);
        localStorage.setItem('pinyinProgress', JSON.stringify(this.progress));
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
    
    // 显示家长后台
    showParentScreen() {
        this.showScreen('parent-screen');
        this.switchTab('progress');
    },
    
    // 切换家长后台标签
    switchTab(tabName) {
        // 更新标签按钮状态
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(this.getTabLabel(tabName))) {
                btn.classList.add('active');
            }
        });
        
        const content = document.getElementById('parent-content');
        
        switch(tabName) {
            case 'progress':
                content.innerHTML = this.renderParentProgress();
                break;
            case 'stats':
                content.innerHTML = this.renderParentStats();
                break;
            case 'settings':
                content.innerHTML = this.renderParentSettings();
                break;
        }
    },
    
    // 获取标签中文名
    getTabLabel(tabName) {
        const labels = {
            'progress': '学习进度',
            'stats': '统计数据',
            'settings': '学习设置'
        };
        return labels[tabName] || '';
    },
    
    // 家长进度视图
    renderParentProgress() {
        const shanghaiProgress = this.progress.shanghai || {};
        const renjiaoProgress = this.progress.renjiao || {};
        
        return `
            <h3>学习进度</h3>
            <div class="version-progress">
                <h4>上海版</h4>
                <div class="progress-bar" style="margin: 10px 0;">
                    <div class="progress-fill" style="width: ${this.calcProgressPercent('shanghai')}%;"></div>
                </div>
                <p>已完成 ${Object.keys(shanghaiProgress).length}/8 关</p>
            </div>
            <div class="version-progress" style="margin-top: 20px;">
                <h4>人教版</h4>
                <div class="progress-bar" style="margin: 10px 0;">
                    <div class="progress-fill" style="width: ${this.calcProgressPercent('renjiao')}%;"></div>
                </div>
                <p>已完成 ${Object.keys(renjiaoProgress).length}/12 关</p>
            </div>
        `;
    },
    
    // 计算进度百分比
    calcProgressPercent(version) {
        const data = getPinyinData(version);
        const progress = this.progress[version] || {};
        return Math.round((Object.keys(progress).length / data.levels.length) * 100);
    },
    
    // 家长统计视图
    renderParentStats() {
        let totalTime = 0; // 实际应用中需要记录学习时间
        const shanghaiStars = Object.values(this.progress.shanghai || {}).reduce((a, b) => a + b, 0);
        const renjiaoStars = Object.values(this.progress.renjiao || {}).reduce((a, b) => a + b, 0);
        
        return `
            <h3>学习统计</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${shanghaiStars + renjiaoStars}</div>
                    <div class="stat-label">总星星数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Object.keys(this.progress).length}</div>
                    <div class="stat-label">学习天数</div>
                </div>
            </div>
        `;
    },
    
    // 家长设置视图
    renderParentSettings() {
        return `
            <h3>学习设置</h3>
            <div class="setting-item">
                <span>每日学习目标</span>
                <select onchange="app.saveParentSetting('dailyGoal', this.value)">
                    <option value="1">1关</option>
                    <option value="2" selected>2关</option>
                    <option value="3">3关</option>
                </select>
            </div>
            <div class="setting-item">
                <span>休息提醒</span>
                <label class="switch">
                    <input type="checkbox" checked onchange="app.saveParentSetting('restReminder', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    },
    
    // 保存家长设置
    saveParentSetting(key, value) {
        const parentSettings = JSON.parse(localStorage.getItem('pinyinParentSettings') || '{}');
        parentSettings[key] = value;
        localStorage.setItem('pinyinParentSettings', JSON.stringify(parentSettings));
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
