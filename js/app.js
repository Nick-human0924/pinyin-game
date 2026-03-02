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

    // 显示关卡选择（主菜单入口）
    showLevelSelect() {
        this.showScreen('level-select');
        this.renderLevelMap();
    },

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
                <div class="achievement-entry" onclick="app.showAchievements()" style="background:linear-gradient(135deg,#FFD93D,#FFE66D);border-radius:15px;padding:15px 20px;margin-bottom:15px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 5px 15px rgba(255,217,61,0.3);transition:all 0.3s;"
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

                <!-- 宠物小屋入口 -->
                <div onclick="app.showPetHouse()" style="background:linear-gradient(135deg,#FF6B9D,#FFB8D0);border-radius:15px;padding:15px 20px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 5px 15px rgba(255,107,157,0.3);transition:all 0.3s;"
                     onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''">
                    <div style="display:flex;align-items:center;gap:15px;">
                        <span style="font-size:40px;">🏠</span>
                        <div>
                            <div style="font-weight:bold;font-size:16px;color:white;">宠物小屋</div>
                            <div style="font-size:12px;color:rgba(255,255,255,0.8);">喂养宠物、开宝箱、装饰房间</div>
                        </div>
                    </div>
                    <span style="font-size:24px;color:white;">➡️</span>
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
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>总星星数</span>
                        <span style="font-weight:bold;color:#FFD93D;">⭐ ${this.getTotalStars()}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>金币总数</span>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-weight:bold;">🪙 <span id="parent-coins-display">${this.coins}</span></span>
                            <button onclick="app.showCoinEdit()" style="padding:5px 10px;background:#4ECDC4;color:white;border:none;border-radius:10px;font-size:12px;cursor:pointer;">修改</button>
                        </div>
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

    // 显示金币修改界面
    showCoinEdit() {
        const newCoins = prompt('请输入新的金币数量（当前: ' + this.coins + '）:', this.coins);
        if (newCoins !== null && !isNaN(newCoins) && newCoins >= 0) {
            this.coins = parseInt(newCoins);
            this.saveCoins();
            this.showToast('✅ 金币已更新为: ' + this.coins);
            this.renderParentProgress();
        }
    },

    logoutParent() {
        this.parentLoggedIn = false;
        this.backToSplash();
    },

    // ==================== 宠物养成系统 ====================
    pet: {
        name: '小喵',
        level: 1,
        exp: 0,
        maxExp: 100,
        mood: 100, // 心情 0-100
        hunger: 100, // 饱食度 0-100
        evolution: 1, // 进化阶段 1-3
        lastFed: Date.now()
    },

    // 加载宠物数据
    loadPet() {
        const saved = localStorage.getItem('pinyinPet');
        if (saved) {
            this.pet = JSON.parse(saved);
            // 计算离线饥饿度下降
            const hoursOffline = (Date.now() - this.pet.lastFed) / (1000 * 60 * 60);
            this.pet.hunger = Math.max(0, this.pet.hunger - hoursOffline * 5);
            this.pet.mood = Math.max(0, this.pet.mood - hoursOffline * 3);
        }
    },

    // 保存宠物数据
    savePet() {
        this.pet.lastFed = Date.now();
        localStorage.setItem('pinyinPet', JSON.stringify(this.pet));
    },

    // 显示宠物小屋
    showPetHouse() {
        this.loadPet();
        const container = document.getElementById('learn-content');

        const petEmojis = ['🐱', '🐯', '🦁'];
        const petEmoji = petEmojis[this.pet.evolution - 1] || '🐱';

        container.innerHTML = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <!-- 顶部状态栏 -->
                <div style="background:linear-gradient(135deg,#FF6B9D,#FFB8D0);border-radius:20px;padding:20px;margin-bottom:20px;color:white;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                        <button class="btn-back" onclick="app.renderFunLearn()" style="background:rgba(255,255,255,0.3);color:white;">⬅️</button>
                        <h2 style="margin:0;">🏠 宠物小屋</h2>
                        <span>🪙 ${this.coins}</span>
                    </div>
                    <div style="display:flex;gap:15px;">
                        <div style="flex:1;background:rgba(255,255,255,0.2);border-radius:10px;padding:10px;text-align:center;">
                            <div style="font-size:12px;opacity:0.8;">等级</div>
                            <div style="font-size:24px;font-weight:bold;">Lv.${this.pet.level}</div>
                        </div>
                        <div style="flex:1;background:rgba(255,255,255,0.2);border-radius:10px;padding:10px;text-align:center;">
                            <div style="font-size:12px;opacity:0.8;">心情</div>
                            <div style="font-size:24px;">${this.getMoodEmoji()}</div>
                        </div>
                    </div>
                </div>

                <!-- 宠物展示区 -->
                <div style="background:linear-gradient(180deg,#E8F4F8 0%,#FFF5F5 100%);border-radius:25px;padding:30px;text-align:center;margin-bottom:20px;position:relative;min-height:250px;">
                    <!-- 背景装饰 -->
                    <div style="position:absolute;top:20px;left:20px;font-size:30px;opacity:0.5;">☁️</div>
                    <div style="position:absolute;top:40px;right:30px;font-size:25px;opacity:0.5;">☁️</div>
                    <div style="position:absolute;bottom:30px;left:15%;font-size:20px;opacity:0.3;">🌸</div>
                    <div style="position:absolute;bottom:40px;right:20%;font-size:20px;opacity:0.3;">🌸</div>

                    <!-- 宠物 -->
                    <div onclick="app.petInteraction()" style="font-size:120px;cursor:pointer;animation:petBounce 2s infinite;display:inline-block;filter:drop-shadow(0 10px 20px rgba(0,0,0,0.1));">
                        ${petEmoji}
                    </div>

                    <!-- 宠物信息 -->
                    <div style="margin-top:20px;">
                        <div style="font-size:24px;font-weight:bold;color:#333;">${this.pet.name}</div>
                        <div style="font-size:14px;color:#666;margin-top:5px;">${this.getEvolutionName()}</div>
                    </div>

                    <!-- 状态条 -->
                    <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:20px;">😊</span>
                            <div style="flex:1;height:12px;background:rgba(0,0,0,0.1);border-radius:10px;overflow:hidden;">
                                <div style="width:${this.pet.mood}%;height:100%;background:linear-gradient(90deg,#FFD93D,#FFE66D);border-radius:10px;transition:width 0.3s;"></div>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:20px;">🍖</span>
                            <div style="flex:1;height:12px;background:rgba(0,0,0,0.1);border-radius:10px;overflow:hidden;">
                                <div style="width:${this.pet.hunger}%;height:100%;background:linear-gradient(90deg,#FF6B6B,#FF8E8E);border-radius:10px;transition:width 0.3s;"></div>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:20px;">⭐</span>
                            <div style="flex:1;height:12px;background:rgba(0,0,0,0.1);border-radius:10px;overflow:hidden;">
                                <div style="width:${(this.pet.exp/this.pet.maxExp)*100}%;height:100%;background:linear-gradient(90deg,#4ECDC4,#7EDDD6);border-radius:10px;transition:width 0.3s;"></div>
                            </div>
                            <span style="font-size:12px;color:#666;">${this.pet.exp}/${this.pet.maxExp}</span>
                        </div>
                    </div>
                </div>

                <!-- 互动按钮 -->
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:20px;">
                    <button onclick="app.feedPet()" style="background:linear-gradient(135deg,#FF6B6B,#FF8E8E);color:white;border:none;border-radius:15px;padding:15px;cursor:pointer;box-shadow:0 5px 15px rgba(255,107,107,0.3);">
                        <div style="font-size:30px;">🍖</div>
                        <div style="font-size:12px;margin-top:5px;">喂食 (-10🪙)</div>
                    </button>
                    <button onclick="app.playWithPet()" style="background:linear-gradient(135deg,#4ECDC4,#7EDDD6);color:white;border:none;border-radius:15px;padding:15px;cursor:pointer;box-shadow:0 5px 15px rgba(78,205,196,0.3);">
                        <div style="font-size:30px;">🎾</div>
                        <div style="font-size:12px;margin-top:5px;">玩耍</div>
                    </button>
                    <button onclick="app.showTreasureBox()" style="background:linear-gradient(135deg,#FFD93D,#FFE66D);color:#333;border:none;border-radius:15px;padding:15px;cursor:pointer;box-shadow:0 5px 15px rgba(255,217,61,0.3);">
                        <div style="font-size:30px;">🎁</div>
                        <div style="font-size:12px;margin-top:5px;">开宝箱</div>
                    </button>
                </div>

                <!-- 新功能入口 -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <button onclick="app.showVisualHouse()" style="background:linear-gradient(135deg,#a8edea 0%,#fed6e3 100%);color:#333;border:none;border-radius:15px;padding:20px;cursor:pointer;box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                        <div style="font-size:35px;margin-bottom:5px;">🏠</div>
                        <div style="font-weight:bold;">我的房间</div>
                        <div style="font-size:11px;opacity:0.7;">查看装饰效果</div>
                    </button>
                    <button onclick="app.showBattleMenu()" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:15px;padding:20px;cursor:pointer;box-shadow:0 5px 15px rgba(102,126,234,0.3);">
                        <div style="font-size:35px;margin-bottom:5px;">⚔️</div>
                        <div style="font-weight:bold;">宠物对战</div>
                        <div style="font-size:11px;opacity:0.8;">挑战野生怪物</div>
                    </button>
                </div>

                <!-- 装饰商店入口 -->
                <button onclick="app.showDecorationShop()" style="width:100%;background:white;border:2px dashed #FF6B9D;border-radius:15px;padding:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;">
                    <span style="font-size:24px;">🛋️</span>
                    <span style="font-weight:bold;color:#FF6B9D;">装饰商店</span>
                    <span style="font-size:20px;">➡️</span>
                </button>
            </div>

            <style>
                @keyframes petBounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.05); }
                }
            </style>
        `;

        document.getElementById('learn-title').textContent = '🏠 宠物小屋';
    },

    // 获取心情表情
    getMoodEmoji() {
        if (this.pet.mood >= 80) return '😄';
        if (this.pet.mood >= 60) return '😊';
        if (this.pet.mood >= 40) return '😐';
        if (this.pet.mood >= 20) return '😢';
        return '😭';
    },

    // 获取进化阶段名称
    getEvolutionName() {
        const names = ['幼年期', '成长期', '成熟期'];
        return names[this.pet.evolution - 1] || '幼年期';
    },

    // 宠物互动
    petInteraction() {
        const reactions = ['喵喵~', '好开心！', '陪我玩嘛', '我饿了~', '最喜欢你了！'];
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        this.showToast(reaction);
        this.pet.mood = Math.min(100, this.pet.mood + 5);
        this.savePet();
        this.showPetHouse();
    },

    // 喂食宠物
    feedPet() {
        if (this.coins < 10) {
            this.showToast('❌ 金币不足！');
            return;
        }
        if (this.pet.hunger >= 100) {
            this.showToast('🍖 已经吃饱啦！');
            return;
        }

        this.coins -= 10;
        this.pet.hunger = Math.min(100, this.pet.hunger + 30);
        this.pet.exp += 10;
        this.checkLevelUp();
        this.savePet();
        this.saveCoins();

        this.showToast('🍖 喂食成功！+10经验');
        this.showPetHouse();
    },

    // 和宠物玩耍
    playWithPet() {
        if (this.pet.hunger < 20) {
            this.showToast('😿 太饿了，先喂食吧！');
            return;
        }

        this.pet.mood = Math.min(100, this.pet.mood + 15);
        this.pet.hunger = Math.max(0, this.pet.hunger - 10);
        this.pet.exp += 5;
        this.checkLevelUp();
        this.savePet();

        this.showToast('🎾 玩得好开心！+5经验');
        this.showPetHouse();
    },

    // 检查升级
    checkLevelUp() {
        if (this.pet.exp >= this.pet.maxExp) {
            this.pet.level++;
            this.pet.exp = 0;
            this.pet.maxExp = Math.floor(this.pet.maxExp * 1.2);

            // 检查进化
            if (this.pet.level >= 10 && this.pet.evolution === 1) {
                this.pet.evolution = 2;
                this.showToast('🎉 宠物进化了！');
            } else if (this.pet.level >= 25 && this.pet.evolution === 2) {
                this.pet.evolution = 3;
                this.showToast('🎉 宠物最终进化！');
            } else {
                this.showToast(`🎉 宠物升到 ${this.pet.level} 级！`);
            }
        }
    },

    // ==================== 宝箱抽奖系统 ====================
    treasureKeys: 0,

    // 加载钥匙数量
    loadKeys() {
        this.treasureKeys = parseInt(localStorage.getItem('pinyinKeys') || '0');
    },

    // 保存钥匙
    saveKeys() {
        localStorage.setItem('pinyinKeys', this.treasureKeys);
    },

    // 显示宝箱界面
    showTreasureBox() {
        this.loadKeys();
        const container = document.getElementById('learn-content');

        container.innerHTML = `
            <div style="padding:20px;text-align:center;max-width:400px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;">
                    <button class="btn-back" onclick="app.showPetHouse()">⬅️</button>
                    <h2>🎁 神秘宝箱</h2>
                    <span>🔑 ${this.treasureKeys}</span>
                </div>

                <!-- 宝箱展示 -->
                <div style="background:linear-gradient(180deg,#FFF9E5 0%,#FFF0F5 100%);border-radius:25px;padding:40px 20px;margin-bottom:30px;position:relative;">
                    <div style="font-size:120px;cursor:pointer;transition:transform 0.3s;" id="treasure-box"
                         onclick="app.openTreasure()" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        ${this.treasureKeys > 0 ? '🎁' : '🔒'}
                    </div>
                    <div style="margin-top:20px;font-size:18px;color:#666;">
                        ${this.treasureKeys > 0 ? '点击开启宝箱！' : '完成关卡获得钥匙'}
                    </div>
                </div>

                <!-- 奖励预览 -->
                <div style="background:white;border-radius:15px;padding:20px;text-align:left;">
                    <h3 style="margin-bottom:15px;text-align:center;">🎊 可能获得</h3>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;text-align:center;">
                        <div>
                            <div style="font-size:30px;">🪙</div>
                            <div style="font-size:12px;color:#666;">10-50金币</div>
                        </div>
                        <div>
                            <div style="font-size:30px;">🍖</div>
                            <div style="font-size:12px;color:#666;">宠物食物</div>
                        </div>
                        <div>
                            <div style="font-size:30px;">✨</div>
                            <div style="font-size:12px;color:#666;">经验加成</div>
                        </div>
                    </div>
                </div>

                <!-- 获取钥匙方式 -->
                <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:10px;font-size:13px;color:#666;">
                    💡 每完成一关获得1把钥匙
                </div>
            </div>
        `;

        document.getElementById('learn-title').textContent = '🎁 神秘宝箱';
    },

    // 开启宝箱
    openTreasure() {
        if (this.treasureKeys <= 0) {
            this.showToast('❌ 没有钥匙了！');
            return;
        }

        this.treasureKeys--;
        this.saveKeys();

        // 随机奖励
        const rewards = [
            { type: 'coins', value: 20, emoji: '🪙', name: '20金币' },
            { type: 'coins', value: 50, emoji: '🪙', name: '50金币' },
            { type: 'food', value: 1, emoji: '🍖', name: '宠物食物' },
            { type: 'exp', value: 30, emoji: '⭐', name: '30经验' },
            { type: 'coins', value: 10, emoji: '🪙', name: '10金币' }
        ];

        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        // 发放奖励
        if (reward.type === 'coins') {
            this.coins += reward.value;
            this.saveCoins();
        } else if (reward.type === 'exp') {
            this.pet.exp += reward.value;
            this.checkLevelUp();
            this.savePet();
        } else if (reward.type === 'food') {
            this.pet.hunger = Math.min(100, this.pet.hunger + 50);
            this.savePet();
        }

        // 显示奖励动画
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div style="padding:40px;text-align:center;">
                <div style="font-size:100px;margin-bottom:20px;animation:rewardPop 0.5s ease;">🎉</div>
                <h2 style="margin-bottom:20px;">恭喜获得！</h2>
                <div style="background:linear-gradient(135deg,#FFD93D,#FFE66D);border-radius:20px;padding:30px;margin:20px 0;">
                    <div style="font-size:80px;margin-bottom:10px;">${reward.emoji}</div>
                    <div style="font-size:24px;font-weight:bold;">${reward.name}</div>
                </div>
                <button onclick="app.showTreasureBox()" style="padding:15px 40px;background:linear-gradient(135deg,#FF6B9D,#FFB8D0);color:white;border:none;border-radius:25px;font-size:18px;cursor:pointer;margin-top:20px;">
                    继续开箱
                </button>
            </div>
            <style>
                @keyframes rewardPop {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            </style>
        `;
    },

    // ==================== 装饰商店 ====================
    decorations: [
        { id: 'bed', name: '小床', emoji: '🛏️', price: 50, owned: false },
        { id: 'sofa', name: '沙发', emoji: '🛋️', price: 80, owned: false },
        { id: 'plant', name: '盆栽', emoji: '🪴', price: 30, owned: false },
        { id: 'lamp', name: '台灯', emoji: '🛋️', price: 40, owned: false },
        { id: 'carpet', name: '地毯', emoji: '🧶', price: 60, owned: false },
        { id: 'painting', name: '挂画', emoji: '🖼️', price: 100, owned: false }
    ],

    // 加载装饰
    loadDecorations() {
        const saved = localStorage.getItem('pinyinDecorations');
        if (saved) {
            const ownedIds = JSON.parse(saved);
            this.decorations.forEach(d => {
                d.owned = ownedIds.includes(d.id);
            });
        }
    },

    // 保存装饰
    saveDecorations() {
        const ownedIds = this.decorations.filter(d => d.owned).map(d => d.id);
        localStorage.setItem('pinyinDecorations', JSON.stringify(ownedIds));
    },

    // 显示装饰商店
    showDecorationShop() {
        this.loadDecorations();
        const container = document.getElementById('learn-content');

        let html = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <button class="btn-back" onclick="app.showPetHouse()">⬅️</button>
                    <h2>🛋️ 装饰商店</h2>
                    <span>🪙 ${this.coins}</span>
                </div>

                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
        `;

        this.decorations.forEach(item => {
            html += `
                <div style="background:${item.owned ? '#E8F5E9' : 'white'};border-radius:15px;padding:20px;text-align:center;box-shadow:0 5px 15px rgba(0,0,0,0.08);opacity:${item.owned ? 0.7 : 1};">
                    <div style="font-size:50px;margin-bottom:10px;">${item.emoji}</div>
                    <div style="font-weight:bold;margin-bottom:5px;">${item.name}</div>
                    <div style="color:#FF6B9D;font-weight:bold;margin-bottom:10px;">🪙 ${item.price}</div>
                    ${item.owned ?
                        '<span style="color:#4CAF50;font-size:14px;">✅ 已拥有</span>' :
                        `<button onclick="app.buyDecoration('${item.id}')" style="padding:8px 20px;background:linear-gradient(135deg,#FF6B9D,#FFB8D0);color:white;border:none;border-radius:15px;cursor:pointer;font-size:14px;">购买</button>`
                    }
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        document.getElementById('learn-title').textContent = '🛋️ 装饰商店';
    },

    // 购买装饰
    buyDecoration(id) {
        const item = this.decorations.find(d => d.id === id);
        if (!item || item.owned) return;

        if (this.coins < item.price) {
            this.showToast('❌ 金币不足！');
            return;
        }

        this.coins -= item.price;
        item.owned = true;
        this.saveCoins();
        this.saveDecorations();

        this.showToast(`🎉 购买成功！${item.name}`);
        this.showDecorationShop();
    },

    // 保存金币
    saveCoins() {
        localStorage.setItem('pinyinCoins', this.coins);
    },

    // ==================== 可视化小屋 ====================
    showVisualHouse() {
        this.loadDecorations();
        const container = document.getElementById('learn-content');

        // 获取已购买的装饰
        const ownedDecorations = this.decorations.filter(d => d.owned);

        let html = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <button class="btn-back" onclick="app.showPetHouse()">⬅️ 返回</button>
                    <h2>🏠 我的小屋</h2>
                    <span></span>
                </div>

                <!-- 房间场景 -->
                <div style="background:linear-gradient(180deg,#E8F4F8 0%,#FFF5F5 50%,#F5F0E8 100%);border-radius:25px;padding:20px;min-height:400px;position:relative;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                    
                    <!-- 墙壁装饰 -->
                    <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:40px;">🪟</div>
                    
                    <!-- 地板 -->
                    <div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(180deg,#D4A574 0%,#C49464 100%);border-radius:0 0 25px 25px;"></div>
                    
                    <!-- 地毯（如果购买） -->
                    ${ownedDecorations.find(d => d.id === 'carpet') ? `
                        <div style="position:absolute;bottom:15%;left:50%;transform:translateX(-50%);font-size:80px;z-index:1;">🧶</div>
                    ` : ''}
                    
                    <!-- 宠物 -->
                    <div style="position:absolute;bottom:25%;left:50%;transform:translateX(-50%);font-size:100px;z-index:2;animation:housePetBounce 3s infinite;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.2));">
                        ${['🐱','🐯','🦁'][this.pet.evolution - 1] || '🐱'}
                    </div>
                    
                    <!-- 家具摆放 -->
                    ${ownedDecorations.find(d => d.id === 'bed') ? `
                        <div style="position:absolute;bottom:30%;left:10%;font-size:70px;z-index:1;">🛏️</div>
                    ` : ''}
                    
                    ${ownedDecorations.find(d => d.id === 'sofa') ? `
                        <div style="position:absolute;bottom:30%;right:10%;font-size:70px;z-index:1;">🛋️</div>
                    ` : ''}
                    
                    ${ownedDecorations.find(d => d.id === 'plant') ? `
                        <div style="position:absolute;bottom:35%;left:5%;font-size:50px;z-index:1;">🪴</div>
                    ` : ''}
                    
                    ${ownedDecorations.find(d => d.id === 'lamp') ? `
                        <div style="position:absolute;bottom:35%;right:5%;font-size:50px;z-index:1;">🛋️</div>
                    ` : ''}
                    
                    ${ownedDecorations.find(d => d.id === 'painting') ? `
                        <div style="position:absolute;top:80px;left:20%;font-size:40px;">🖼️</div>
                    ` : ''}
                    
                    <!-- 空房间提示 -->
                    ${ownedDecorations.length === 0 ? `
                        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#999;">
                            <div style="font-size:60px;margin-bottom:10px;">🏠</div>
                            <div>房间空空如也</div>
                            <div style="font-size:14px;">去装饰商店买点家具吧！</div>
                        </div>
                    ` : ''}
                </div>

                <!-- 已拥有家具列表 -->
                <div style="margin-top:20px;background:white;border-radius:15px;padding:15px;">
                    <h3 style="margin-bottom:15px;">🛋️ 已拥有的家具 (${ownedDecorations.length}/${this.decorations.length})</h3>
                    <div style="display:flex;flex-wrap:wrap;gap:10px;">
                        ${ownedDecorations.length > 0 ? ownedDecorations.map(d => `
                            <div style="background:#E8F5E9;border-radius:10px;padding:10px 15px;display:flex;align-items:center;gap:8px;">
                                <span>${d.emoji}</span>
                                <span style="font-size:14px;">${d.name}</span>
                            </div>
                        `).join('') : '<span style="color:#999;">还没有家具，快去购买吧！</span>'}
                    </div>
                </div>
            </div>

            <style>
                @keyframes housePetBounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-10px); }
                }
            </style>
        `;

        container.innerHTML = html;
        document.getElementById('learn-title').textContent = '🏠 我的小屋';
    },

    // ==================== 宠物对战系统 ====================
    // 技能数据
    petSkills: [
        { id: 'scratch', name: '利爪攻击', emoji: '🐾', damage: 15, price: 50, owned: false },
        { id: 'bite', name: '撕咬', emoji: '😺', damage: 25, price: 100, owned: false },
        { id: 'roar', name: '咆哮', emoji: '🦁', damage: 40, price: 200, owned: false },
        { id: 'fire', name: '火焰喷射', emoji: '🔥', damage: 60, price: 500, owned: false },
        { id: 'ice', name: '冰冻术', emoji: '❄️', damage: 55, price: 450, owned: false },
        { id: 'thunder', name: '雷电击', emoji: '⚡', damage: 70, price: 600, owned: false }
    ],

    // 武器数据
    petWeapons: [
        { id: 'claw', name: '钢爪', emoji: '🥊', bonus: 5, price: 80, owned: false },
        { id: 'collar', name: '力量项圈', emoji: '📿', bonus: 10, price: 150, owned: false },
        { id: 'armor', name: '宠物铠甲', emoji: '🛡️', bonus: 15, price: 300, owned: false },
        { id: 'crown', name: '王者之冠', emoji: '👑', bonus: 25, price: 600, owned: false }
    ],

    // 敌人数据
    enemies: [
        { id: 1, name: '小老鼠', emoji: '🐭', hp: 30, damage: 5, reward: 20, exp: 10 },
        { id: 2, name: '小野狗', emoji: '🐕', hp: 50, damage: 8, reward: 35, exp: 15 },
        { id: 3, name: '小蛇', emoji: '🐍', hp: 40, damage: 12, reward: 40, exp: 20 },
        { id: 4, name: '大灰狼', emoji: '🐺', hp: 80, damage: 15, reward: 60, exp: 30 },
        { id: 5, name: '棕熊', emoji: '🐻', hp: 100, damage: 18, reward: 80, exp: 40 },
        { id: 6, name: '老虎', emoji: '🐅', hp: 120, damage: 22, reward: 100, exp: 50 },
        { id: 7, name: '大象', emoji: '🐘', hp: 150, damage: 20, reward: 120, exp: 60 },
        { id: 8, name: '巨龙', emoji: '🐲', hp: 200, damage: 30, reward: 200, exp: 100 }
    ],

    // 加载技能
    loadSkills() {
        const saved = localStorage.getItem('pinyinSkills');
        if (saved) {
            const ownedIds = JSON.parse(saved);
            this.petSkills.forEach(s => s.owned = ownedIds.includes(s.id));
        }
        const savedWeapons = localStorage.getItem('pinyinWeapons');
        if (savedWeapons) {
            const ownedWeaponIds = JSON.parse(savedWeapons);
            this.petWeapons.forEach(w => w.owned = ownedWeaponIds.includes(w.id));
        }
    },

    // 保存技能
    saveSkills() {
        const ownedIds = this.petSkills.filter(s => s.owned).map(s => s.id);
        localStorage.setItem('pinyinSkills', JSON.stringify(ownedIds));
        const ownedWeaponIds = this.petWeapons.filter(w => w.owned).map(w => w.id);
        localStorage.setItem('pinyinWeapons', JSON.stringify(ownedWeaponIds));
    },

    // 显示对战主界面
    showBattleMenu() {
        this.loadSkills();
        const container = document.getElementById('learn-content');

        container.innerHTML = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px;padding:20px;margin-bottom:20px;color:white;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                        <button class="btn-back" onclick="app.showPetHouse()" style="background:rgba(255,255,255,0.2);color:white;">⬅️</button>
                        <h2 style="margin:0;">⚔️ 宠物对战</h2>
                        <span>🪙 ${this.coins}</span>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:80px;margin:10px 0;">⚔️</div>
                        <p>训练你的宠物，挑战强大的敌人！</p>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <button onclick="app.showSkillShop()" style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:white;border:none;border-radius:15px;padding:25px;cursor:pointer;box-shadow:0 5px 15px rgba(240,147,251,0.3);">
                        <div style="font-size:40px;margin-bottom:10px;">📚</div>
                        <div style="font-weight:bold;">技能商店</div>
                        <div style="font-size:12px;opacity:0.9;">学习新技能</div>
                    </button>
                    
                    <button onclick="app.showWeaponShop()" style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;border:none;border-radius:15px;padding:25px;cursor:pointer;box-shadow:0 5px 15px rgba(79,172,254,0.3);">
                        <div style="font-size:40px;margin-bottom:10px;">⚔️</div>
                        <div style="font-weight:bold;">武器商店</div>
                        <div style="font-size:12px;opacity:0.9;">购买装备</div>
                    </button>
                </div>

                <button onclick="app.showBattleMap()" style="width:100%;background:linear-gradient(135deg,#fa709a 0%,#fee140 100%);color:white;border:none;border-radius:15px;padding:25px;cursor:pointer;box-shadow:0 5px 15px rgba(250,112,154,0.3);">
                    <div style="font-size:50px;margin-bottom:10px;">🗺️</div>
                    <div style="font-weight:bold;font-size:18px;">进入对战地图</div>
                    <div style="font-size:14px;opacity:0.9;">挑战野生怪物</div>
                </button>
            </div>
        `;

        document.getElementById('learn-title').textContent = '⚔️ 宠物对战';
    },

    // 技能商店
    showSkillShop() {
        const container = document.getElementById('learn-content');

        let html = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <button class="btn-back" onclick="app.showBattleMenu()">⬅️</button>
                    <h2>📚 技能商店</h2>
                    <span>🪙 ${this.coins}</span>
                </div>
                <div style="display:grid;gap:15px;">
        `;

        this.petSkills.forEach(skill => {
            html += `
                <div style="background:${skill.owned ? '#E8F5E9' : 'white'};border-radius:15px;padding:20px;display:flex;align-items:center;gap:15px;box-shadow:0 3px 10px rgba(0,0,0,0.08);">
                    <div style="font-size:50px;">${skill.emoji}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold;font-size:16px;">${skill.name}</div>
                        <div style="font-size:13px;color:#666;">攻击力: ${skill.damage}</div>
                        <div style="color:#FF6B9D;font-weight:bold;">🪙 ${skill.price}</div>
                    </div>
                    ${skill.owned ? 
                        '<span style="color:#4CAF50;">✅ 已学习</span>' :
                        `<button onclick="app.buySkill('${skill.id}')" style="padding:8px 20px;background:linear-gradient(135deg,#FF6B9D,#FFB8D0);color:white;border:none;border-radius:15px;cursor:pointer;">学习</button>`
                    }
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
        document.getElementById('learn-title').textContent = '📚 技能商店';
    },

    // 购买技能
    buySkill(id) {
        const skill = this.petSkills.find(s => s.id === id);
        if (!skill || skill.owned) return;

        if (this.coins < skill.price) {
            this.showToast('❌ 金币不足！');
            return;
        }

        this.coins -= skill.price;
        skill.owned = true;
        this.saveCoins();
        this.saveSkills();

        this.showToast(`🎉 学会技能：${skill.name}！`);
        this.showSkillShop();
    },

    // 武器商店
    showWeaponShop() {
        const container = document.getElementById('learn-content');

        let html = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <button class="btn-back" onclick="app.showBattleMenu()">⬅️</button>
                    <h2>⚔️ 武器商店</h2>
                    <span>🪙 ${this.coins}</span>
                </div>
                <div style="display:grid;gap:15px;">
        `;

        this.petWeapons.forEach(weapon => {
            html += `
                <div style="background:${weapon.owned ? '#E8F5E9' : 'white'};border-radius:15px;padding:20px;display:flex;align-items:center;gap:15px;box-shadow:0 3px 10px rgba(0,0,0,0.08);">
                    <div style="font-size:50px;">${weapon.emoji}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold;font-size:16px;">${weapon.name}</div>
                        <div style="font-size:13px;color:#666;">攻击加成: +${weapon.bonus}</div>
                        <div style="color:#FF6B9D;font-weight:bold;">🪙 ${weapon.price}</div>
                    </div>
                    ${weapon.owned ? 
                        '<span style="color:#4CAF50;">✅ 已装备</span>' :
                        `<button onclick="app.buyWeapon('${weapon.id}')" style="padding:8px 20px;background:linear-gradient(135deg,#4ECDC4,#7EDDD6);color:white;border:none;border-radius:15px;cursor:pointer;">购买</button>`
                    }
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
        document.getElementById('learn-title').textContent = '⚔️ 武器商店';
    },

    // 购买武器
    buyWeapon(id) {
        const weapon = this.petWeapons.find(w => w.id === id);
        if (!weapon || weapon.owned) return;

        if (this.coins < weapon.price) {
            this.showToast('❌ 金币不足！');
            return;
        }

        this.coins -= weapon.price;
        weapon.owned = true;
        this.saveCoins();
        this.saveSkills();

        this.showToast(`🎉 获得装备：${weapon.name}！`);
        this.showWeaponShop();
    },

    // 对战地图
    showBattleMap() {
        const container = document.getElementById('learn-content');

        let html = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <button class="btn-back" onclick="app.showBattleMenu()">⬅️</button>
                    <h2>🗺️ 对战地图</h2>
                    <span></span>
                </div>
                <div style="display:grid;gap:12px;">
        `;

        this.enemies.forEach((enemy, index) => {
            const unlocked = index === 0 || this.pet.level >= index * 3;
            html += `
                <div style="background:${unlocked ? 'white' : '#f5f5f5'};border-radius:15px;padding:15px;display:flex;align-items:center;gap:15px;box-shadow:0 3px 10px rgba(0,0,0,0.08);opacity:${unlocked ? 1 : 0.6};">
                    <div style="font-size:50px;">${enemy.emoji}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold;font-size:16px;">${enemy.name}</div>
                        <div style="font-size:13px;color:#666;">❤️ ${enemy.hp} | ⚔️ ${enemy.damage}</div>
                        <div style="font-size:12px;color:#FF6B9D;">奖励: 🪙${enemy.reward} ⭐${enemy.exp}经验</div>
                    </div>
                    ${unlocked ? 
                        `<button onclick="app.startBattle(${enemy.id})" style="padding:10px 25px;background:linear-gradient(135deg,#FF6B6B,#FF8E8E);color:white;border:none;border-radius:15px;cursor:pointer;font-weight:bold;">挑战</button>` :
                        `<span style="color:#999;font-size:14px;">🔒 宠物Lv.${index * 3}解锁</span>`
                    }
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
        document.getElementById('learn-title').textContent = '🗺️ 对战地图';
    },

    // 当前战斗状态
    battleState: null,

    // 开始战斗
    startBattle(enemyId) {
        const enemy = this.enemies.find(e => e.id === enemyId);
        if (!enemy) return;

        // 获取已拥有的技能和武器
        const ownedSkills = this.petSkills.filter(s => s.owned);
        const ownedWeapons = this.petWeapons.filter(w => w.owned);

        // 计算宠物属性
        let petAttack = 10 + (this.pet.level * 2);
        let petDefense = 5 + this.pet.level;

        // 武器加成
        ownedWeapons.forEach(w => {
            petAttack += w.bonus;
        });

        this.battleState = {
            enemy: { ...enemy, currentHp: enemy.hp },
            pet: {
                maxHp: 50 + (this.pet.level * 10),
                currentHp: 50 + (this.pet.level * 10),
                attack: petAttack,
                defense: petDefense,
                skills: ownedSkills.length > 0 ? ownedSkills : [{ name: '普通攻击', emoji: '👊', damage: petAttack }]
            },
            turn: 1
        };

        this.renderBattle();
    },

    // 渲染战斗界面
    renderBattle() {
        const container = document.getElementById('learn-content');
        const state = this.battleState;

        const petHpPercent = (state.pet.currentHp / state.pet.maxHp) * 100;
        const enemyHpPercent = (state.enemy.currentHp / state.enemy.hp) * 100;

        container.innerHTML = `
            <div style="padding:15px;max-width:500px;margin:0 auto;">
                <!-- 战斗场景 -->
                <div style="background:linear-gradient(180deg,#667eea 0%,#764ba2 100%);border-radius:20px;padding:20px;margin-bottom:20px;color:white;position:relative;min-height:250px;">
                    
                    <!-- 敌人 -->
                    <div style="position:absolute;top:20px;right:20px;text-align:center;">
                        <div style="font-size:60px;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));animation:enemyShake 2s infinite;">${state.enemy.emoji}</div>
                        <div style="font-size:14px;margin-top:5px;">${state.enemy.name}</div>
                        <div style="width:80px;height:8px;background:rgba(0,0,0,0.3);border-radius:4px;margin-top:5px;overflow:hidden;">
                            <div style="width:${enemyHpPercent}%;height:100%;background:#FF6B6B;border-radius:4px;transition:width 0.3s;"></div>
                        </div>
                        <div style="font-size:12px;margin-top:2px;">${state.enemy.currentHp}/${state.enemy.hp}</div>
                    </div>

                    <!-- VS -->
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;font-weight:bold;opacity:0.5;">VS</div>

                    <!-- 宠物 -->
                    <div style="position:absolute;bottom:20px;left:20px;text-align:center;">
                        <div style="font-size:60px;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));">${['🐱','🐯','🦁'][this.pet.evolution - 1]}</div>
                        <div style="font-size:14px;margin-top:5px;">${this.pet.name}</div>
                        <div style="width:80px;height:8px;background:rgba(0,0,0,0.3);border-radius:4px;margin-top:5px;overflow:hidden;">
                            <div style="width:${petHpPercent}%;height:100%;background:#4ECDC4;border-radius:4px;transition:width 0.3s;"></div>
                        </div>
                        <div style="font-size:12px;margin-top:2px;">${state.pet.currentHp}/${state.pet.maxHp}</div>
                    </div>
                </div>

                <!-- 回合信息 -->
                <div style="text-align:center;margin-bottom:15px;color:#666;">
                    第 ${state.turn} 回合
                </div>

                <!-- 技能按钮 -->
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                    ${state.pet.skills.map(skill => `
                        <button onclick="app.useSkill('${skill.id || 'normal'}')" style="background:linear-gradient(135deg,#FF6B9D,#FFB8D0);color:white;border:none;border-radius:12px;padding:15px;cursor:pointer;">
                            <div style="font-size:30px;">${skill.emoji}</div>
                            <div style="font-size:14px;font-weight:bold;">${skill.name}</div>
                            <div style="font-size:12px;opacity:0.9;">⚔️ ${skill.damage || state.pet.attack}</div>
                        </button>
                    `).join('')}
                </div>

                <!-- 逃跑按钮 -->
                <button onclick="app.fleeBattle()" style="width:100%;margin-top:15px;padding:12px;background:#ccc;color:#666;border:none;border-radius:12px;cursor:pointer;">
                    🏃 逃跑
                </button>
            </div>

            <style>
                @keyframes enemyShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            </style>
        `;

        document.getElementById('learn-title').textContent = '⚔️ 战斗中';
    },

    // 使用技能
    useSkill(skillId) {
        const state = this.battleState;
        const skill = state.pet.skills.find(s => (s.id || 'normal') === skillId) || state.pet.skills[0];

        // 宠物攻击
        const damage = skill.damage || state.pet.attack;
        state.enemy.currentHp = Math.max(0, state.enemy.currentHp - damage);

        this.showToast(`💥 造成 ${damage} 点伤害！`);

        if (state.enemy.currentHp <= 0) {
            this.winBattle();
            return;
        }

        // 敌人反击
        setTimeout(() => {
            const enemyDamage = Math.max(1, state.enemy.damage - Math.floor(state.pet.defense / 5));
            state.pet.currentHp = Math.max(0, state.pet.currentHp - enemyDamage);
            this.showToast(`😿 受到 ${enemyDamage} 点伤害！`);

            if (state.pet.currentHp <= 0) {
                this.loseBattle();
                return;
            }

            state.turn++;
            this.renderBattle();
        }, 1000);
    },

    // 逃跑
    fleeBattle() {
        this.showToast('🏃 逃跑了...');
        setTimeout(() => this.showBattleMap(), 1000);
    },

    // 胜利
    winBattle() {
        const state = this.battleState;
        this.coins += state.enemy.reward;
        this.pet.exp += state.enemy.exp;
        this.saveCoins();
        this.checkLevelUp();
        this.savePet();

        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div style="padding:40px;text-align:center;">
                <div style="font-size:100px;margin-bottom:20px;animation:victoryBounce 0.5s ease;">🏆</div>
                <h2 style="color:#4CAF50;margin-bottom:20px;">战斗胜利！</h2>
                <div style="background:linear-gradient(135deg,#FFD93D,#FFE66D);border-radius:20px;padding:30px;margin:20px 0;">
                    <div style="font-size:24px;margin-bottom:10px;">🪙 +${state.enemy.reward}</div>
                    <div style="font-size:24px;">⭐ +${state.enemy.exp} 经验</div>
                </div>
                <button onclick="app.showBattleMap()" style="padding:15px 40px;background:linear-gradient(135deg,#FF6B9D,#FFB8D0);color:white;border:none;border-radius:25px;font-size:18px;cursor:pointer;">
                    继续挑战
                </button>
            </div>
            <style>
                @keyframes victoryBounce {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            </style>
        `;
    },

    // 失败
    loseBattle() {
        const container = document.getElementById('learn-content');
        container.innerHTML = `
            <div style="padding:40px;text-align:center;">
                <div style="font-size:100px;margin-bottom:20px;">😿</div>
                <h2 style="color:#999;margin-bottom:20px;">战斗失败...</h2>
                <p style="color:#666;margin-bottom:20px;">别灰心，升级后再来挑战！</p>
                <button onclick="app.showBattleMap()" style="padding:15px 40px;background:linear-gradient(135deg,#FF6B9D,#FFB8D0);color:white;border:none;border-radius:25px;font-size:18px;cursor:pointer;">
                    返回地图
                </button>
            </div>
        `;
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
