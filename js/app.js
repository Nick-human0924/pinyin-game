// ============================================
// 拼音大冒险 - 完整游戏化自由学习
// ============================================

const app = {
    currentVersion: 'shanghai',
    parentLoggedIn: false,
    settings: { sound: true, speed: 1 },
    progress: {},
    coins: 0,
    
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
    
    // 基础导航
    start() { this.showScreen('main-menu'); },
    backToSplash() { this.showScreen('splash-screen'); },
    backToMenu() { this.showScreen('main-menu'); },
    
    // 版本选择
    showVersionSelect() { this.showScreen('version-select'); },
    selectVersion(version) {
        this.currentVersion = version;
        game.currentVersion = version;
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

    // 显示成就（从主菜单进入）
    showProgress() {
        this.showScreen('learn-screen');
        this.showAchievements();
    },

    // 显示设置
    showSettings() {
        this.showScreen('learn-screen');
        const container = document.getElementById('learn-content');

        const html = `
            <div style="padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;">
                    <button class="btn-back" onclick="app.backToMenu()">⬅️ 返回</button>
                    <h2>⚙️ 设置</h2>
                    <span></span>
                </div>

                <div style="background:white;border-radius:20px;padding:25px;margin-bottom:20px;box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                        <div>
                            <div style="font-weight:bold;font-size:16px;">🔊 声音</div>
                            <div style="font-size:13px;color:#666;">开启或关闭游戏音效</div>
                        </div>
                        <button onclick="app.toggleSound()" style="padding:10px 20px;background:${this.settings.sound ? '#4ECDC4' : '#ccc'};color:white;border:none;border-radius:20px;cursor:pointer;">
                            ${this.settings.sound ? '开启' : '关闭'}
                        </button>
                    </div>

                    <div style="border-top:1px solid #eee;padding-top:20px;">
                        <div style="font-weight:bold;font-size:16px;margin-bottom:10px;">🐢 朗读速度</div>
                        <input type="range" min="0.5" max="1.5" step="0.1" value="${this.settings.speed}" onchange="app.setSpeed(this.value)" style="width:100%;">
                        <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;margin-top:5px;">
                            <span>慢</span>
                            <span>${this.settings.speed}x</span>
                            <span>快</span>
                        </div>
                    </div>
                </div>

                <div style="background:white;border-radius:20px;padding:25px;box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                    <div style="font-weight:bold;font-size:16px;margin-bottom:15px;">📊 游戏数据</div>
                    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>总星星</span>
                        <span style="font-weight:bold;">⭐ ${this.getTotalStars()}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>金币</span>
                        <span style="font-weight:bold;">🪙 ${this.coins}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:10px 0;">
                        <span>已完成关卡</span>
                        <span style="font-weight:bold;">${Object.keys(this.progress).length} 关</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        document.getElementById('learn-title').textContent = '⚙️ 设置';
    },
    
    // ==================== 游戏化自由学习 ====================
    showFreeMode() {
        this.showScreen('learn-screen');
        this.renderFunLearn();
    },
    
    // 游戏化学习主界面 - 美化版
    renderFunLearn() {
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="fun-learn-container">
                <!-- 玩家状态卡片 -->
                <div class="player-card">
                    <div class="player-avatar">👶</div>
                    <div class="player-info">
                        <div class="player-level">Lv.1 拼音小达人</div>
                        <div class="player-stats">
                            <span class="stat">🪙 ${this.coins}</span>
                            <span class="stat">⭐ ${this.getTotalStars()}</span>
                        </div>
                    </div>
                </div>
                
                <!-- 游戏模式选择 -->
                <h3 class="mode-title">🎮 选择游戏模式</h3>
                
                <!-- 成就入口 -->
                <div class="achievement-entry" onclick="app.showAchievements()" style="background:linear-gradient(135deg,#FFD93D,#FFE66D);border-radius:15px;padding:15px 20px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 5px 15px rgba(255,217,61,0.3);transition:all 0.3s;"
                     onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''">
                    <div style="display:flex;align-items:center;gap:15px;">
                        <span style="font-size:40px;">🏆</span>
                        <div>
                            <div style="font-weight:bold;font-size:16px;">我的成就</div>
                            <div style="font-size:12px;color:#666;">点击查看所有成就</div>
                        </div>
                    </div>
                    <span style="font-size:24px;">➡️</span>
                </div>
                
                <div class="game-modes-grid">
                    <div class="game-mode-btn mode-explore" onclick="app.showExplore()">
                        <div class="mode-icon">🗺️</div>
                        <h4>拼音探险</h4>
                        <p>探索所有拼音卡片</p>
                        <span class="reward">+5金币</span>
                    </div>
                    
                    <div class="game-mode-btn mode-quiz" onclick="app.showQuiz()">
                        <div class="mode-icon">⚡</div>
                        <h4>闪电答题</h4>
                        <p>听拼音选答案</p>
                        <span class="reward">+10金币</span>
                    </div>
                    
                    <div class="game-mode-btn mode-memory" onclick="app.showMemory()">
                        <div class="mode-icon">🧠</div>
                        <h4>记忆翻牌</h4>
                        <p>配对挑战</p>
                        <span class="reward">+15金币</span>
                    </div>
                    
                    <div class="game-mode-btn mode-trace" onclick="app.showTrace()">
                        <div class="mode-icon">✍️</div>
                        <h4>拼音描红</h4>
                        <p>跟着写拼音</p>
                        <span class="reward">+8金币</span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('learn-title').textContent = '🎮 拼音乐园';
    },
    
    getTotalStars() {
        let total = 0;
        Object.values(this.progress || {}).forEach(v => {
            total += Object.values(v).reduce((a, b) => a + b, 0);
        });
        return total;
    },
    
    // 1. 拼音探险 - 美化版
    showExplore() {
        const data = getPinyinData(this.currentVersion);
        const container = document.getElementById('learn-content');
        
        let html = `
            <div class="explore-container">
                <div class="explore-header">
                    <button class="btn-back" onclick="app.renderFunLearn()">⬅️ 返回</button>
                    <h2>🗺️ 拼音探险</h2>
                    <span class="coin-display">🪙 ${this.coins}</span>
                </div>
                <div class="pinyin-grid">
        `;
        
        data.levels.forEach(level => {
            level.items.forEach(item => {
                html += `
                    <div class="pinyin-card" onclick="app.speakAndShow('${item.char}', '${item.word}', '${item.emoji}')">
                        <div class="card-emoji">${item.emoji}</div>
                        <div class="card-char">${item.char}</div>
                        <div class="card-word">${item.word}</div>
                        <div class="card-sound">🔊</div>
                    </div>
                `;
            });
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    speakAndShow(char, word, emoji) {
        game.speak(char);
        this.showToast(`${emoji} ${char} - ${word}`);
    },
    
    // 2. 闪电答题 - 美化版
    showQuiz() {
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="quiz-intro">
                <button class="btn-back" onclick="app.renderFunLearn()">⬅️</button>
                <h2>⚡ 闪电答题</h2>
                <div class="quiz-mascot">⚡</div>
                <p>听拼音，选择正确的答案！</p>
                <p>共5题，准备好了吗？</p>
                <button class="btn-start" onclick="app.startQuiz()">开始挑战</button>
            </div>
        `;
    },
    
    quizIndex: 0,
    quizScore: 0,
    quizItems: [],
    
    startQuiz() {
        const data = getPinyinData(this.currentVersion);
        const allItems = data.levels.flatMap(l => l.items);
        this.quizItems = [...allItems].sort(() => Math.random() - 0.5).slice(0, 5);
        this.quizIndex = 0;
        this.quizScore = 0;
        this.showQuizQuestion();
    },
    
    showQuizQuestion() {
        if (this.quizIndex >= this.quizItems.length) {
            this.endQuiz();
            return;
        }
        
        const item = this.quizItems[this.quizIndex];
        const container = document.getElementById('learn-content');
        
        // 生成选项
        const data = getPinyinData(this.currentVersion);
        const allChars = data.levels.flatMap(l => l.items.map(i => i.char));
        let options = [item.char];
        let filtered = allChars.filter(c => c !== item.char);
        while (options.length < 4 && filtered.length > 0) {
            const idx = Math.floor(Math.random() * filtered.length);
            options.push(filtered.splice(idx, 1)[0]);
        }
        options = options.sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div class="quiz-game">
                <div class="quiz-progress">题目 ${this.quizIndex + 1}/5</div>
                <div class="quiz-emoji">${item.emoji}</div>
                <div class="quiz-word">${item.word}</div>
                <div class="quiz-question">这个拼音怎么读？</div>
                <div class="quiz-options">
                    ${options.map(opt => `
                        <button class="quiz-option" onclick="app.answerQuiz('${opt}', '${item.char}')">${opt}</button>
                    `).join('')}
                </div>
                <button class="btn-hear" onclick="game.speak('${item.char}')">🔊 再听一遍</button>
            </div>
        `;
        
        game.speak(item.char);
    },
    
    answerQuiz(selected, correct) {
        if (selected === correct) {
            this.quizScore++;
            game.speak('答对了');
            this.showToast('✅ 正确！+2金币');
            this.addCoins(2);
        } else {
            game.speak('再想想看');
            this.showToast('❌ 再试一次');
        }
        
        this.quizIndex++;
        setTimeout(() => this.showQuizQuestion(), 1000);
    },
    
    endQuiz() {
        const coins = this.quizScore * 3;
        this.addCoins(coins);
        
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="quiz-result">
                <div class="result-trophy">${this.quizScore >= 4 ? '🏆' : this.quizScore >= 2 ? '🥈' : '🥉'}</div>
                <h2>挑战完成!</h2>
                <p class="result-score">答对 ${this.quizScore}/5 题</p>
                <p class="result-coins">+${coins} 🪙</p>
                <button class="btn-primary" onclick="app.renderFunLearn()">返回乐园</button>
            </div>
        `;
    },
    
    // 3. 记忆翻牌
    showMemory() {
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="memory-intro">
                <button class="btn-back" onclick="app.renderFunLearn()">⬅️</button>
                <h2>🧠 记忆翻牌</h2>
                <p>找出相同的拼音配对！</p>
                <button class="btn-start" onclick="app.startMemory()">开始游戏</button>
            </div>
        `;
    },
    
    memoryCards: [],
    flippedCards: [],
    matchedPairs: 0,
    memoryMoves: 0,
    
    startMemory() {
        const data = getPinyinData(this.currentVersion);
        const items = data.levels[0].items.slice(0, 4);
        
        let cards = [];
        items.forEach((item, i) => {
            cards.push({ id: i, type: 'char', value: item.char, emoji: item.emoji, matched: false });
            cards.push({ id: i, type: 'word', value: item.word, emoji: item.emoji, matched: false });
        });
        cards = cards.sort(() => Math.random() - 0.5);
        
        this.memoryCards = cards;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.memoryMoves = 0;
        this.renderMemoryGrid();
    },
    
    renderMemoryGrid() {
        const container = document.getElementById('learn-content');
        
        let html = `
            <div class="memory-game">
                <div class="memory-header">
                    <button class="btn-back" onclick="app.renderFunLearn()">⬅️</button>
                    <span>步数: ${this.memoryMoves}</span>
                </div>
                <div class="memory-grid">
        `;
        
        this.memoryCards.forEach((card, idx) => {
            const isFlipped = this.flippedCards.includes(idx);
            const isMatched = card.matched;
            
            html += `
                <div class="memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}" 
                     onclick="app.flipCard(${idx})">
                    <div class="card-face card-back">❓</div>
                    <div class="card-face card-front">
                        ${card.type === 'char' ? `<div class="mem-char">${card.value}</div>` : `<div class="mem-word">${card.value}</div>`}
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    flipCard(idx) {
        if (this.flippedCards.includes(idx) || this.memoryCards[idx].matched) return;
        if (this.flippedCards.length >= 2) return;
        
        this.flippedCards.push(idx);
        this.renderMemoryGrid();
        
        if (this.flippedCards.length === 2) {
            this.memoryMoves++;
            const [idx1, idx2] = this.flippedCards;
            const card1 = this.memoryCards[idx1];
            const card2 = this.memoryCards[idx2];
            
            if (card1.id === card2.id) {
                setTimeout(() => {
                    card1.matched = true;
                    card2.matched = true;
                    this.flippedCards = [];
                    this.matchedPairs++;
                    
                    if (this.matchedPairs === 4) {
                        this.endMemory();
                    } else {
                        this.renderMemoryGrid();
                    }
                }, 600);
            } else {
                setTimeout(() => {
                    this.flippedCards = [];
                    this.renderMemoryGrid();
                }, 1000);
            }
        }
    },
    
    endMemory() {
        const coins = Math.max(12 - this.memoryMoves, 5);
        this.addCoins(coins);
        
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="memory-result">
                <div class="result-emoji">🎉</div>
                <h2>完成!</h2>
                <p>用了 ${this.memoryMoves} 步</p>
                <p class="result-coins">+${coins} 🪙</p>
                <button class="btn-primary" onclick="app.renderFunLearn()">返回乐园</button>
            </div>
        `;
    },
    
    // 成就系统
    showAchievements() {
        const achievements = [
            { id: 'first_step', name: '初次尝试', desc: '完成第一关', icon: '🌟', unlocked: this.getTotalStars() > 0 },
            { id: 'collector', name: '拼音收藏家', desc: '收集10个拼音', icon: '📚', unlocked: (JSON.parse(localStorage.getItem('pinyinCollection') || '[]').length >= 10) },
            { id: 'quiz_master', name: '答题达人', desc: '闪电答题全对', icon: '⚡', unlocked: false },
            { id: 'memory_pro', name: '记忆大师', desc: '记忆翻牌5步内完成', icon: '🧠', unlocked: false },
            { id: 'rich', name: '小富翁', desc: '获得100金币', icon: '💰', unlocked: this.coins >= 100 },
            { id: 'explorer', name: '探险家', desc: '完成拼音探险', icon: '🗺️', unlocked: false }
        ];
        
        const container = document.getElementById('learn-content');
        let html = `
            <div style="padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">
                    <button class="btn-back" onclick="app.renderFunLearn()">⬅️ 返回</button>
                    <h2>🏆 我的成就</h2>
                    <span>已解锁 ${achievements.filter(a => a.unlocked).length}/${achievements.length}</span>
                </div>
                <div style="display:grid;gap:15px;">
        `;
        
        achievements.forEach(ach => {
            html += `
                <div style="background:${ach.unlocked ? 'white' : '#f5f5f5'};border-radius:15px;padding:20px;display:flex;align-items:center;gap:15px;box-shadow:0 3px 10px rgba(0,0,0,0.08);opacity:${ach.unlocked ? 1 : 0.6};">
                    <div style="font-size:50px;filter:${ach.unlocked ? 'none' : 'grayscale(100%)'};">${ach.icon}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold;font-size:16px;margin-bottom:3px;">${ach.name}</div>
                        <div style="font-size:13px;color:#666;">${ach.desc}</div>
                    </div>
                    ${ach.unlocked ? '<span style="color:#4ECDC4;font-size:24px;">✅</span>' : '<span style="color:#ccc;font-size:24px;">🔒</span>'}
                </div>
            `;
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    // 4. 拼音描红
    showTrace() {
        const data = getPinyinData(this.currentVersion);
        const item = data.levels[0].items[0];
        
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="trace-container">
                <div class="trace-header">
                    <button class="btn-back" onclick="app.renderFunLearn()">⬅️</button>
                    <h2>✍️ 拼音描红</h2>
                </div>
                <div class="trace-card">
                    <div class="trace-emoji">${item.emoji}</div>
                    <div class="trace-char">${item.char}</div>
                    <div class="trace-word">${item.word}</div>
                    <button class="btn-hear" onclick="game.speak('${item.char}')">🔊 听发音</button>
                </div>
                <div class="trace-hint">
                    <p>跟着大声读：${item.char}</p>
                    <button class="btn-next" onclick="app.nextTrace()">下一个 ➡️</button>
                </div>
            </div>
        `;
        
        game.speak(item.char);
    },
    
    traceIndex: 0,
    nextTrace() {
        const data = getPinyinData(this.currentVersion);
        const allItems = data.levels.flatMap(l => l.items);
        this.traceIndex = (this.traceIndex + 1) % allItems.length;
        const item = allItems[this.traceIndex];
        
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div class="trace-container">
                <div class="trace-header">
                    <button class="btn-back" onclick="app.renderFunLearn()">⬅️</button>
                    <h2>✍️ 拼音描红</h2>
                </div>
                <div class="trace-card">
                    <div class="trace-emoji">${item.emoji}</div>
                    <div class="trace-char">${item.char}</div>
                    <div class="trace-word">${item.word}</div>
                    <button class="btn-hear" onclick="game.speak('${item.char}')">🔊 听发音</button>
                </div>
                <div class="trace-hint">
                    <p>跟着大声读：${item.char}</p>
                    <button class="btn-next" onclick="app.nextTrace()">下一个 ➡️</button>
                </div>
            </div>
        `;
        
        game.speak(item.char);
        this.addCoins(1);
    },
    
    // 工具函数
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    },
    
    addCoins(amount) {
        this.coins += amount;
        localStorage.setItem('pinyinCoins', this.coins);
    },
    
    loadCoins() {
        this.coins = parseInt(localStorage.getItem('pinyinCoins') || '0');
    },
    
    // 设置相关
    loadSettings() {
        const saved = localStorage.getItem('pinyinSettings');
        if (saved) this.settings = JSON.parse(saved);
    },
    
    saveSettings() {
        localStorage.setItem('pinyinSettings', JSON.stringify(this.settings));
    },
    
    loadProgress() {
        const saved = localStorage.getItem('pinyinProgress');
        if (saved) this.progress = JSON.parse(saved);
    },
    
    saveProgress() {
        localStorage.setItem('pinyinProgress', JSON.stringify(this.progress));
    },
    
    updateSettingsUI() {
        const soundToggle = document.getElementById('setting-sound');
        const speedSlider = document.getElementById('setting-speed');
        if (soundToggle) soundToggle.checked = this.settings.sound;
        if (speedSlider) speedSlider.value = this.settings.speed;
    },
    
    toggleSound() {
        this.settings.sound = !this.settings.sound;
        game.soundEnabled = this.settings.sound;
        this.saveSettings();
    },
    
    setSpeed(value) {
        this.settings.speed = parseFloat(value);
        game.speechRate = this.settings.speed;
        this.saveSettings();
    },
    
    // 家长登录
    showParentLogin() {
        // 直接显示密码输入界面
        const splash = document.getElementById('splash-screen');
        const originalContent = splash.innerHTML;
        
        splash.innerHTML = `
            <div class="splash-content">
                <div class="logo">
                    <span class="logo-icon">🔒</span>
                    <h1>家长验证</h1>
                </div>
                <p class="subtitle">请输入家长密码</p>
                <input type="password" id="parent-password" placeholder="输入密码" style="padding:15px;font-size:18px;border:2px solid #FF6B9D;border-radius:10px;margin:20px 0;width:200px;text-align:center;">
                <div style="display:flex;gap:15px;">
                    <button class="btn btn-secondary" onclick="location.reload()">取消</button>
                    <button class="btn btn-primary" onclick="app.checkParentPassword()">验证</button>
                </div>
                <p style="margin-top:20px;font-size:12px;color:#999;">默认密码: 1234</p>
            </div>
        `;
        
        // 保存原始内容以便恢复
        this._originalSplash = originalContent;
    },
    
    checkParentPassword() {
        const password = document.getElementById('parent-password').value;
        if (password === '1234') {
            this.parentLoggedIn = true;
            this.showParentDashboard();
        } else {
            alert('密码错误，请重试');
        }
    },
    
    showParentDashboard() {
        this.showScreen('parent-screen');
        this.renderParentProgress();
    },
    
    renderParentProgress() {
        const container = document.getElementById('parent-content');
        if (!container) return;
        
        const data = getPinyinData(this.currentVersion);
        const progress = this.progress[this.currentVersion] || {};
        
        let html = `
            <div style="padding:20px;">
                <h3>📊 学习统计</h3>
                <div style="background:white;border-radius:15px;padding:20px;margin:15px 0;box-shadow:0 3px 10px rgba(0,0,0,0.1);">
                    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>总星星数</span>
                        <span style="font-weight:bold;color:#FFD93D;">⭐ ${this.getTotalStars()}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>金币总数</span>
                        <span style="font-weight:bold;">🪙 ${this.coins}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:10px 0;">
                        <span>已完成关卡</span>
                        <span style="font-weight:bold;">${Object.keys(progress).length}/${data.levels.length}</span>
                    </div>
                </div>
                
                <h3>📈 关卡进度</h3>
        `;
        
        data.levels.forEach(level => {
            const stars = progress[level.id] || 0;
            html += `
                <div style="background:white;border-radius:10px;padding:15px;margin:10px 0;display:flex;justify-content:space-between;align-items:center;">
                    <span>${level.name}</span>
                    <span>${stars > 0 ? '⭐'.repeat(stars) : '⚪'}</span>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    logoutParent() {
        this.parentLoggedIn = false;
        this.backToSplash();
    },
    
    // 模态框
    showModal(type, content) {
        const modal = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        body.innerHTML = content;
        modal.classList.add('active');
    },
    
    hideModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    },
    
    // 学习模式切换
    switchLearnMode(mode) {
        // 已整合到游戏化界面
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
