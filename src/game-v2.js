/**
 * 拼音探险岛 3.0 - 宠物养成版
 * 5大关卡 + 宠物养成系统
 */

// 关卡数据
const LEVEL_DATA = {
    1: [
        { sound: 'b', options: ['b', 'd', 'p'], correct: 0, hint: '双唇紧闭，突然放开，不送气' },
        { sound: 'p', options: ['b', 'p', 'm'], correct: 1, hint: '双唇紧闭，突然放开，送气' },
        { sound: 'm', options: ['m', 'n', 'l'], correct: 0, hint: '双唇紧闭，气流从鼻腔出' },
        { sound: 'f', options: ['h', 'f', 's'], correct: 1, hint: '上齿咬下唇，气流从缝隙出' },
        { sound: 'd', options: ['d', 'b', 't'], correct: 0, hint: '舌尖抵上齿龈，突然放开，不送气' },
        { sound: 't', options: ['d', 't', 'n'], correct: 1, hint: '舌尖抵上齿龈，突然放开，送气' },
        { sound: 'n', options: ['m', 'n', 'l'], correct: 1, hint: '舌尖抵上齿龈，气流从鼻腔出' },
        { sound: 'l', options: ['n', 'l', 'r'], correct: 1, hint: '舌尖抵上齿龈，气流从两边出' },
        { sound: 'g', options: ['g', 'k', 'h'], correct: 0, hint: '舌根抵软腭，突然放开，不送气' },
        { sound: 'k', options: ['g', 'k', 'h'], correct: 1, hint: '舌根抵软腭，突然放开，送气' }
    ],
    2: [
        { sound: 'a', options: ['a', 'o', 'e'], correct: 0, hint: '张大嘴巴，声音响亮' },
        { sound: 'o', options: ['o', 'u', 'e'], correct: 0, hint: '圆圆嘴巴，像吹口哨' },
        { sound: 'e', options: ['e', 'a', 'o'], correct: 0, hint: '扁扁嘴巴，像微笑' },
        { sound: 'i', options: ['i', 'u', 'ü'], correct: 0, hint: '牙齿对齐，嘴角向两边' },
        { sound: 'u', options: ['u', 'o', 'ü'], correct: 0, hint: '圆圆嘴巴，嘴唇向前突' },
        { sound: 'ü', options: ['ü', 'u', 'i'], correct: 0, hint: '嘴唇向前突，像小鱼嘴' },
        { sound: 'ai', options: ['ai', 'ei', 'ui'], correct: 0, hint: '从a滑到i，嘴巴由大变小' },
        { sound: 'ei', options: ['ai', 'ei', 'ui'], correct: 1, hint: '从e滑到i，像说"诶"' },
        { sound: 'ui', options: ['ai', 'ei', 'ui'], correct: 2, hint: '从u滑到i，像说"威"' },
        { sound: 'ao', options: ['ao', 'ou', 'iu'], correct: 0, hint: '从a滑到o，像说"袄"' }
    ],
    3: [
        { sound: 'ā', display: '一声平', options: ['ā', 'á', 'ǎ', 'à'], correct: 0, hint: '一声平，高平调，像平地' },
        { sound: 'á', display: '二声扬', options: ['ā', 'á', 'ǎ', 'à'], correct: 1, hint: '二声扬，升调，像上坡' },
        { sound: 'ǎ', display: '三声拐', options: ['ā', 'á', 'ǎ', 'à'], correct: 2, hint: '三声拐弯，先降后升，像山谷' },
        { sound: 'à', display: '四声降', options: ['ā', 'á', 'ǎ', 'à'], correct: 3, hint: '四声降，降调，像下坡' },
        { sound: 'ō', display: '一声平', options: ['ō', 'ó', 'ǒ', 'ò'], correct: 0, hint: '一声平，高而平' },
        { sound: 'ó', display: '二声扬', options: ['ō', 'ó', 'ǒ', 'ò'], correct: 1, hint: '二声扬，由低到高' },
        { sound: 'ě', display: '三声拐', options: ['ē', 'é', 'ě', 'è'], correct: 2, hint: '三声拐弯，先降后升' },
        { sound: 'è', display: '四声降', options: ['ē', 'é', 'ě', 'è'], correct: 3, hint: '四声降，急降调' }
    ],
    4: [
        { sound: 'ba', display: 'b + a = ?', options: ['ba', 'pa', 'ma'], correct: 0, hint: 'b和a快速连读' },
        { sound: 'pa', display: 'p + a = ?', options: ['ba', 'pa', 'fa'], correct: 1, hint: 'p和a快速连读' },
        { sound: 'ma', display: 'm + a = ?', options: ['ma', 'na', 'la'], correct: 0, hint: 'm和a快速连读' },
        { sound: 'fa', display: 'f + a = ?', options: ['ha', 'fa', 'sa'], correct: 1, hint: 'f和a快速连读' },
        { sound: 'da', display: 'd + a = ?', options: ['da', 'ba', 'ta'], correct: 0, hint: 'd和a快速连读' },
        { sound: 'ta', display: 't + a = ?', options: ['da', 'ta', 'na'], correct: 1, hint: 't和a快速连读' },
        { sound: 'na', display: 'n + a = ?', options: ['ma', 'na', 'la'], correct: 1, hint: 'n和a快速连读' },
        { sound: 'la', display: 'l + a = ?', options: ['na', 'la', 'ra'], correct: 1, hint: 'l和a快速连读' }
    ],
    5: [
        { sound: 'baba', display: '爸 爸', options: ['baba', 'papa', 'mama'], correct: 0, hint: '爸爸 - 声母b，韵母a，轻声' },
        { sound: 'mama', display: '妈 妈', options: ['baba', 'papa', 'mama'], correct: 2, hint: '妈妈 - 声母m，韵母a，轻声' },
        { sound: 'dadi', display: '大 地', options: ['dadi', 'tadi', 'nadi'], correct: 0, hint: '大地 - d+a，d+i' },
        { sound: 'taitai', display: '太 太', options: ['daitai', 'taitai', 'naitai'], correct: 1, hint: '太太 - t+a，t+ai' },
        { sound: 'nainai', display: '奶 奶', options: ['nainai', 'lailai', 'maimai'], correct: 0, hint: '奶奶 - n+ai，n+ai，轻声' },
        { sound: 'lala', display: '拉 拉', options: ['nana', 'lala', 'rara'], correct: 1, hint: '拉拉 - l+a，l+a，轻声' }
    ]
};

const LEVEL_NAMES = { 1: '声母岛', 2: '韵母岛', 3: '声调谷', 4: '拼读森林', 5: '词语城堡' };

// 宠物系统配置
const PET_STAGES = {
    1: { name: '小书童', icon: '👶', color: '#8B4513' },
    2: { name: '小学士', icon: '🎓', color: '#4169E1' },
    3: { name: '小状元', icon: '👑', color: '#FFD700' },
    4: { name: '小博士', icon: '📚', color: '#9932CC' }
};

const LEVEL_TITLES = [
    '初入学堂', '勤奋学子', '进步明显', '品学兼优', '小有所成',
    '小学士入门', '学识渐长', '才华横溢', '出类拔萃', '学富五车',
    '小状元入门', '才高八斗', '满腹经纶', '博学多才', '登峰造极',
    '小博士入门', '学贯中西', '博古通今', '一代宗师', '拼音大师'
];

class PinyinGame {
    constructor() {
        this.currentLevel = 1;
        this.currentQuestion = 1;
        this.score = 0;
        this.soundEnabled = true;
        this.unlockedLevels = 1;
        
        // 宠物数据
        this.petData = this.loadPetData();
        
        this.currentData = null;
        this.hasPlayed = false;
        this.selectedOption = null;
        
        this.init();
    }
    
    loadPetData() {
        const saved = localStorage.getItem('pinyinPetData');
        if (saved) return JSON.parse(saved);
        return {
            level: 1, exp: 0, coins: 100, streakDays: 0, lastLogin: null,
            outfit: { clothes: 'default', accessory: 'none' },
            inventory: [], achievements: [], dailyTasks: {},
            totalCorrect: 0, totalQuestions: 0
        };
    }
    
    savePetData() {
        localStorage.setItem('pinyinPetData', JSON.stringify(this.petData));
    }
    
    init() {
        this.checkDailyLogin();
        this.loadProgress();
        this.bindEvents();
        this.showScreen('main-menu');
        this.updatePetDisplay();
        
        setTimeout(() => {
            document.getElementById('loading-screen')?.classList.add('hidden');
        }, 1500);
    }
    
    checkDailyLogin() {
        const today = new Date().toDateString();
        if (this.petData.lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.petData.lastLogin === yesterday.toDateString()) {
                this.petData.streakDays++;
            } else {
                this.petData.streakDays = 1;
            }
            
            this.petData.lastLogin = today;
            this.petData.coins += 20;
            
            // 连续登录奖励
            const bonuses = [0, 10, 20, 30, 50, 80];
            const bonus = bonuses[Math.min(this.petData.streakDays, 5)];
            if (bonus > 0) this.petData.coins += bonus;
            
            this.savePetData();
            
            // 显示欢迎弹窗
            setTimeout(() => {
                this.showWelcomeBack(bonus);
            }, 2000);
        }
    }
    
    showWelcomeBack(bonus) {
        const modal = document.getElementById('feedback-modal');
        document.getElementById('feedback-icon').textContent = '🎉';
        document.getElementById('feedback-title').textContent = '欢迎回来！';
        document.getElementById('feedback-message').innerHTML = 
            `连续登录第 ${this.petData.streakDays} 天！\n获得 ${20 + bonus} 金币！`;
        document.getElementById('feedback-explanation').classList.add('hidden');
        document.getElementById('btn-next-level').classList.add('hidden');
        document.getElementById('btn-retry').classList.add('hidden');
        document.getElementById('btn-continue-game').classList.remove('hidden');
        modal?.classList.remove('hidden');
    }
    
    // ... 其他方法保持不变，添加宠物相关功能
    
    updatePetDisplay() {
        // 更新主菜单宠物显示
        const petInfo = document.getElementById('pet-info');
        if (petInfo) {
            const stage = this.getPetStage();
            petInfo.innerHTML = `
                <div class="pet-avatar">${stage.icon}</div>
                <div class="pet-name">${stage.name}</div>
                <div class="pet-level">Lv.${this.petData.level} ${LEVEL_TITLES[this.petData.level - 1]}</div>
                <div class="pet-coins">💰 ${this.petData.coins}</div>
            `;
        }
    }
    
    getPetStage() {
        if (this.petData.level >= 16) return PET_STAGES[4];
        if (this.petData.level >= 11) return PET_STAGES[3];
        if (this.petData.level >= 6) return PET_STAGES[2];
        return PET_STAGES[1];
    }
    
    addPetExp(amount) {
        this.petData.exp += amount;
        const oldLevel = this.petData.level;
        
        // 升级检查
        const expNeeded = [0, 50, 120, 200, 300, 450, 600, 800, 1000, 1300, 
                          1700, 2100, 2600, 3200, 4000, 5000, 6200, 7600, 9200, 11000];
        
        for (let i = 19; i >= 0; i--) {
            if (this.petData.exp >= expNeeded[i]) {
                this.petData.level = i + 1;
                break;
            }
        }
        
        this.savePetData();
        
        if (this.petData.level > oldLevel) {
            this.showLevelUp(oldLevel, this.petData.level);
        }
    }
    
    showLevelUp(oldLevel, newLevel) {
        const modal = document.getElementById('feedback-modal');
        const newStage = this.getPetStage();
        
        document.getElementById('feedback-icon').textContent = '🎊';
        document.getElementById('feedback-title').textContent = '升级啦！';
        document.getElementById('feedback-message').innerHTML = 
            `恭喜！你升到了 ${newLevel} 级！\n获得称号：${LEVEL_TITLES[newLevel - 1]}\n${oldLevel < 6 && newLevel >= 6 ? '\n🎓 进阶为小学士！' : ''}${oldLevel < 11 && newLevel >= 11 ? '\n👑 进阶为小状元！' : ''}${oldLevel < 16 && newLevel >= 16 ? '\n📚 进阶为小博士！' : ''}`;
        
        document.getElementById('feedback-explanation').classList.add('hidden');
        document.getElementById('btn-next-level').classList.add('hidden');
        document.getElementById('btn-retry').classList.add('hidden');
        document.getElementById('btn-continue-game').classList.remove('hidden');
        modal?.classList.remove('hidden');
        
        this.updatePetDisplay();
    }
    
    // 记录答题并更新宠物
    recordAnswer(isCorrect) {
        this.petData.totalQuestions++;
        if (isCorrect) {
            this.petData.totalCorrect++;
            this.addPetExp(10);
            this.petData.coins += 5;
        }
        this.savePetData();
        this.updatePetDisplay();
    }
    
    // 绑定事件
    bindEvents() {
        // 主菜单按钮
        document.getElementById('btn-start')?.addEventListener('click', () => {
            this.showScreen('level-select');
            this.renderLevelButtons();
        });
        
        document.getElementById('btn-continue')?.addEventListener('click', () => {
            this.loadProgress();
            this.startLevel(this.currentLevel);
        });
        
        document.getElementById('btn-achievements')?.addEventListener('click', () => {
            alert('🏆 成就系统\n\n当前进度：\n• 已完成关卡：' + (this.unlockedLevels - 1) + '/5\n• 总得分：' + this.score + '\n• 宠物等级：Lv.' + this.petData.level);
        });
        
        document.getElementById('btn-parent')?.addEventListener('click', () => {
            const stats = `📊 学习统计

总答题数：${this.petData.totalQuestions}
正确率：${this.petData.totalQuestions > 0 ? Math.round(this.petData.totalCorrect / this.petData.totalQuestions * 100) : 0}%
连续登录：${this.petData.streakDays}天
金币总数：${this.petData.coins}`;
            alert(stats);
        });
        
        // 返回按钮
        document.getElementById('btn-back-menu')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('btn-exit')?.addEventListener('click', () => {
            this.saveProgress();
            this.showScreen('main-menu');
        });
        
        // 播放声音按钮
        document.getElementById('btn-play-sound')?.addEventListener('click', () => {
            this.playCurrentSound();
        });
        
        // 提示按钮
        document.getElementById('btn-hint')?.addEventListener('click', () => {
            this.showHint();
        });
        
        // 慢放按钮
        document.getElementById('btn-slow')?.addEventListener('click', () => {
            this.playSlowSound();
        });
        
        // 音量按钮
        document.getElementById('btn-sound')?.addEventListener('click', () => {
            this.toggleSound();
        });
        
        // 反馈弹窗按钮
        document.getElementById('btn-next-level')?.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        document.getElementById('btn-retry')?.addEventListener('click', () => {
            this.retryQuestion();
        });
        
        document.getElementById('btn-continue-game')?.addEventListener('click', () => {
            document.getElementById('feedback-modal')?.classList.add('hidden');
        });
    }
    
    // 渲染关卡按钮
    renderLevelButtons() {
        const container = document.getElementById('level-buttons');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn' + (i > this.unlockedLevels ? ' locked' : '');
            btn.innerHTML = `
                <div class="level-number">${i}</div>
                <div class="level-name">${LEVEL_NAMES[i]}</div>
                ${i > this.unlockedLevels ? '<div class="lock-icon">🔒</div>' : ''}
            `;
            
            if (i <= this.unlockedLevels) {
                btn.addEventListener('click', () => this.startLevel(i));
            }
            
            container.appendChild(btn);
        }
    }
    
    // 开始关卡
    startLevel(level) {
        this.currentLevel = level;
        this.currentQuestion = 1;
        this.showScreen('game-scene');
        this.loadQuestion();
    }
    
    // 加载题目
    loadQuestion() {
        const levelData = LEVEL_DATA[this.currentLevel];
        if (!levelData || this.currentQuestion > levelData.length) {
            this.levelComplete();
            return;
        }
        
        this.currentData = levelData[this.currentQuestion - 1];
        this.hasPlayed = false;
        this.selectedOption = null;
        
        // 更新UI
        document.getElementById('level-info').textContent = `第 ${this.currentLevel} 关 - ${this.currentQuestion}/${levelData.length}`;
        document.getElementById('progress-text').textContent = `${this.currentQuestion}/${levelData.length}`;
        document.getElementById('progress-fill').style.width = `${(this.currentQuestion / levelData.length) * 100}%`;
        
        // 显示题目
        const displayText = document.getElementById('display-text');
        if (this.currentData.display) {
            displayText.textContent = this.currentData.display;
            displayText.classList.remove('hidden');
        } else {
            displayText.classList.add('hidden');
        }
        
        // 重置选项区域
        document.getElementById('mouth-options').classList.add('hidden');
        document.getElementById('instruction').textContent = '点击播放，听一听是什么音？';
        
        // 自动播放
        setTimeout(() => this.playCurrentSound(), 500);
    }
    
    // 播放当前声音
    playCurrentSound() {
        if (!this.currentData) return;
        
        this.hasPlayed = true;
        document.getElementById('instruction').textContent = '请选择正确的答案：';
        document.getElementById('mouth-options').classList.remove('hidden');
        
        // 渲染选项
        this.renderOptions();
        
        // 播放音频
        if (window.voiceManager) {
            window.voiceManager.speak(this.currentData.sound);
        }
    }
    
    // 慢放声音
    playSlowSound() {
        if (!this.currentData || !window.voiceManager) return;
        window.voiceManager.speak(this.currentData.sound, 0.7);
    }
    
    // 渲染选项
    renderOptions() {
        const container = document.getElementById('options-container');
        if (!container || !this.currentData) return;
        
        container.innerHTML = '';
        
        this.currentData.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => this.selectOption(index));
            container.appendChild(btn);
        });
    }
    
    // 选择选项
    selectOption(index) {
        if (!this.currentData) return;
        
        this.selectedOption = index;
        const isCorrect = index === this.currentData.correct;
        
        // 更新按钮样式
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === this.currentData.correct) {
                btn.classList.add('correct');
            } else if (i === index && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
        
        // 记录答案
        this.recordAnswer(isCorrect);
        
        // 显示反馈
        setTimeout(() => this.showFeedback(isCorrect), 500);
    }
    
    // 显示反馈
    showFeedback(isCorrect) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('feedback-icon');
        const title = document.getElementById('feedback-title');
        const message = document.getElementById('feedback-message');
        const explanation = document.getElementById('feedback-explanation');
        const explanationText = document.getElementById('explanation-text');
        
        if (isCorrect) {
            icon.textContent = '🎉';
            title.textContent = '回答正确！';
            message.textContent = '太棒了！继续加油！';
            this.score += 10;
        } else {
            icon.textContent = '😅';
            title.textContent = '再想想看';
            message.textContent = `正确答案是：${this.currentData.options[this.currentData.correct]}`;
        }
        
        explanationText.textContent = this.currentData.hint;
        explanation.classList.remove('hidden');
        
        document.getElementById('btn-next-level').classList.remove('hidden');
        document.getElementById('btn-retry').classList.add('hidden');
        document.getElementById('btn-continue-game').classList.add('hidden');
        
        modal.classList.remove('hidden');
    }
    
    // 显示提示
    showHint() {
        if (!this.currentData) return;
        alert('💡 提示：' + this.currentData.hint);
        this.petData.coins = Math.max(0, this.petData.coins - 5);
        this.savePetData();
        this.updatePetDisplay();
    }
    
    // 下一题
    nextQuestion() {
        document.getElementById('feedback-modal').classList.add('hidden');
        this.currentQuestion++;
        this.loadQuestion();
    }
    
    // 重试
    retryQuestion() {
        document.getElementById('feedback-modal').classList.add('hidden');
        this.loadQuestion();
    }
    
    // 关卡完成
    levelComplete() {
        if (this.currentLevel < 5) {
            this.unlockedLevels = Math.max(this.unlockedLevels, this.currentLevel + 1);
        }
        
        alert(`🎉 恭喜完成第 ${this.currentLevel} 关！\n\n得分：${this.score}\n解锁下一关！`);
        this.saveProgress();
        this.showScreen('level-select');
        this.renderLevelButtons();
    }
    
    // 保存进度
    saveProgress() {
        localStorage.setItem('pinyinGameProgress', JSON.stringify({
            currentLevel: this.currentLevel,
            currentQuestion: this.currentQuestion,
            score: this.score,
            unlockedLevels: this.unlockedLevels
        }));
    }
    
    // 切换声音
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound');
        if (btn) {
            btn.textContent = this.soundEnabled ? '🔊' : '🔇';
        }
    }
    
    // 显示指定屏幕
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        const screenMap = {
            'main-menu': 'main-menu',
            'level-select': 'level-select',
            'game-scene': 'game-scene'
        };
        
        const screenId = screenMap[screenName];
        if (screenId) {
            document.getElementById(screenId)?.classList.remove('hidden');
        }
    }
    
    // 加载进度
    loadProgress() {
        // 从本地存储加载游戏进度
        const saved = localStorage.getItem('pinyinGameProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.currentLevel = progress.currentLevel || 1;
            this.currentQuestion = progress.currentQuestion || 1;
            this.score = progress.score || 0;
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
    new PinyinGame();
});
