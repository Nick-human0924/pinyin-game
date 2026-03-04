/**
 * 拼音探险岛 2.0 - 完整版
 * 5个关卡：声母→韵母→声调→拼读→词语
 */

// 关卡数据（内联，避免加载问题）
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

const LEVEL_NAMES = {
    1: '声母岛',
    2: '韵母岛', 
    3: '声调谷',
    4: '拼读森林',
    5: '词语城堡'
};

class PinyinGame {
    constructor() {
        this.currentLevel = 1;
        this.currentQuestion = 1;
        this.score = 0;
        this.soundEnabled = true;
        this.unlockedLevels = 1;
        
        this.currentData = null;
        this.hasPlayed = false;
        this.selectedOption = null;
        
        this.init();
    }
    
    init() {
        this.loadProgress();
        this.bindEvents();
        this.showScreen('main-menu');
        
        setTimeout(() => {
            document.getElementById('loading-screen')?.classList.add('hidden');
        }, 1500);
    }
    
    loadProgress() {
        const saved = localStorage.getItem('pinyinGameProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.unlockedLevels = progress.unlockedLevels || 1;
        }
    }
    
    bindEvents() {
        document.getElementById('btn-start')?.addEventListener('click', () => this.showLevelSelect());
        document.getElementById('btn-continue')?.addEventListener('click', () => this.continueGame());
        document.getElementById('btn-achievements')?.addEventListener('click', () => this.showAchievements());
        document.getElementById('btn-parent')?.addEventListener('click', () => this.showParentCenter());
        document.getElementById('btn-back-menu')?.addEventListener('click', () => this.showScreen('main-menu'));
        
        document.getElementById('btn-exit')?.addEventListener('click', () => this.exitGame());
        document.getElementById('btn-sound')?.addEventListener('click', () => this.toggleSound());
        document.getElementById('btn-play-sound')?.addEventListener('click', () => this.playSound());
        document.getElementById('btn-hint')?.addEventListener('click', () => this.showHint());
        document.getElementById('btn-slow')?.addEventListener('click', () => this.playSlow());
        
        document.getElementById('btn-next-level')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('btn-retry')?.addEventListener('click', () => this.retryQuestion());
        document.getElementById('btn-continue-game')?.addEventListener('click', () => this.closeModal());
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId)?.classList.remove('hidden');
    }
    
    showLevelSelect() {
        const container = document.getElementById('level-buttons');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.className = i <= this.unlockedLevels ? 'level-btn unlocked' : 'level-btn locked';
            btn.innerHTML = `
                <div class="level-num">${i}</div>
                <div class="level-name">${LEVEL_NAMES[i]}</div>
                ${i > this.unlockedLevels ? '<div class="level-lock">🔒</div>' : ''}
            `;
            if (i <= this.unlockedLevels) {
                btn.addEventListener('click', () => this.startLevel(i));
            }
            container.appendChild(btn);
        }
        
        this.showScreen('level-select');
    }
    
    startLevel(level) {
        this.currentLevel = level;
        this.currentQuestion = 1;
        this.score = 0;
        this.showScreen('game-scene');
        this.loadQuestion();
    }
    
    continueGame() {
        const saved = localStorage.getItem('pinyinGameProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.currentLevel = progress.level || 1;
            this.currentQuestion = progress.question || 1;
            this.score = progress.score || 0;
            this.showScreen('game-scene');
            this.loadQuestion();
        } else {
            this.showLevelSelect();
        }
    }
    
    exitGame() {
        if (confirm('确定要退出吗？进度已保存。')) {
            this.saveProgress();
            this.showScreen('main-menu');
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound');
        if (btn) btn.textContent = this.soundEnabled ? '🔊' : '🔇';
    }
    
    loadQuestion() {
        const levelData = LEVEL_DATA[this.currentLevel];
        if (!levelData || this.currentQuestion > levelData.length) {
            this.showLevelComplete();
            return;
        }
        
        this.currentData = levelData[this.currentQuestion - 1];
        this.hasPlayed = false;
        this.selectedOption = null;
        
        // 更新UI
        document.getElementById('current-level').textContent = `${LEVEL_NAMES[this.currentLevel]} - 第${this.currentQuestion}题`;
        document.getElementById('progress-text').textContent = `${this.currentQuestion}/${levelData.length}`;
        document.getElementById('progress-fill').style.width = `${(this.currentQuestion / levelData.length) * 100}%`;
        
        // 根据关卡类型显示不同界面
        const instruction = document.getElementById('instruction');
        const playBtn = document.getElementById('btn-play-sound');
        const displayText = document.getElementById('display-text');
        
        if (this.currentLevel <= 2) {
            instruction.textContent = '点击播放，听一听是什么音？';
            playBtn.classList.remove('hidden');
            if (displayText) displayText.classList.add('hidden');
        } else if (this.currentLevel === 3) {
            instruction.textContent = `听一听，这是${this.currentData.display}？`;
            playBtn.classList.remove('hidden');
            if (displayText) displayText.classList.add('hidden');
        } else {
            instruction.textContent = '点击播放，听一听怎么读？';
            playBtn.classList.remove('hidden');
            if (displayText) {
                displayText.textContent = this.currentData.display;
                displayText.classList.remove('hidden');
            }
        }
        
        document.getElementById('mouth-options')?.classList.add('hidden');
        document.getElementById('character-bubble')?.classList.add('hidden');
        
        this.renderOptions();
    }
    
    renderOptions() {
        const container = document.getElementById('options-container');
        if (!container) return;
        
        container.innerHTML = '';
        this.currentData.options.forEach((option, index) => {
            const btn = document.createElement('div');
            btn.className = 'mouth-option';
            
            if (this.currentLevel <= 2) {
                btn.innerHTML = `
                    <div class="mouth-shape">👄</div>
                    <div class="mouth-pinyin">${option}</div>
                `;
            } else {
                btn.innerHTML = `<div class="mouth-pinyin" style="font-size: 36px;">${option}</div>`;
            }
            
            btn.addEventListener('click', () => this.selectOption(index, btn));
            container.appendChild(btn);
        });
    }
    
    playSound() {
        const sound = this.currentData.sound;
        
        if ('speechSynthesis' in window && this.soundEnabled) {
            const utterance = new SpeechSynthesisUtterance(sound);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
        
        this.hasPlayed = true;
        document.getElementById('mouth-options')?.classList.remove('hidden');
        
        const instruction = document.getElementById('instruction');
        if (this.currentLevel <= 2) {
            instruction.textContent = '选择你听到的发音：';
        } else if (this.currentLevel === 3) {
            instruction.textContent = '选择正确的声调：';
        } else {
            instruction.textContent = '选择正确的读音：';
        }
        
        this.showBubble('仔细听，然后选择！');
    }
    
    playSlow() {
        const sound = this.currentData.sound;
        if ('speechSynthesis' in window && this.soundEnabled) {
            const utterance = new SpeechSynthesisUtterance(sound);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.4;
            speechSynthesis.speak(utterance);
        }
    }
    
    showHint() {
        this.showBubble(this.currentData.hint);
    }
    
    showBubble(text) {
        const bubble = document.getElementById('character-bubble');
        const textEl = document.getElementById('bubble-text');
        if (bubble && textEl) {
            textEl.textContent = text;
            bubble.classList.remove('hidden');
            setTimeout(() => bubble.classList.add('hidden'), 4000);
        }
    }
    
    selectOption(index, element) {
        if (!this.hasPlayed) {
            this.showBubble('先点击播放按钮听发音哦！');
            return;
        }
        
        document.querySelectorAll('.mouth-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedOption = index;
        
        setTimeout(() => this.checkAnswer(), 500);
    }
    
    checkAnswer() {
        const isCorrect = this.selectedOption === this.currentData.correct;
        const options = document.querySelectorAll('.mouth-option');
        
        options[this.selectedOption]?.classList.remove('selected');
        options[this.selectedOption]?.classList.add(isCorrect ? 'correct' : 'wrong');
        
        if (!isCorrect) {
            options[this.currentData.correct]?.classList.add('correct');
        }
        
        setTimeout(() => this.showFeedback(isCorrect), 1000);
    }
    
    showFeedback(isCorrect) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('feedback-icon');
        const title = document.getElementById('feedback-title');
        const message = document.getElementById('feedback-message');
        const explanation = document.getElementById('feedback-explanation');
        const btnNext = document.getElementById('btn-next-level');
        const btnRetry = document.getElementById('btn-retry');
        
        if (isCorrect) {
            icon.textContent = '🎉';
            title.textContent = '太棒了！';
            message.textContent = `正确！这是 "${this.currentData.sound}"`;
            this.score += 10;
            btnNext?.classList.remove('hidden');
            btnRetry?.classList.add('hidden');
            this.showBubble('你真棒！继续加油！');
        } else {
            icon.textContent = '💪';
            title.textContent = '再试一次！';
            message.textContent = `这是 "${this.currentData.sound}"，仔细听一下`;
            btnNext?.classList.add('hidden');
            btnRetry?.classList.remove('hidden');
            this.showBubble('没关系，再听一遍！');
        }
        
        explanation?.classList.remove('hidden');
        document.getElementById('explanation-text').textContent = this.currentData.hint;
        
        modal?.classList.remove('hidden');
        this.saveProgress();
    }
    
    nextQuestion() {
        this.closeModal();
        this.currentQuestion++;
        this.loadQuestion();
    }
    
    retryQuestion() {
        this.closeModal();
        this.loadQuestion();
    }
    
    closeModal() {
        document.getElementById('feedback-modal')?.classList.add('hidden');
    }
    
    showLevelComplete() {
        const levelData = LEVEL_DATA[this.currentLevel];
        const modal = document.getElementById('feedback-modal');
        
        document.getElementById('feedback-icon').textContent = '🏆';
        document.getElementById('feedback-title').textContent = `${LEVEL_NAMES[this.currentLevel]} 完成！`;
        document.getElementById('feedback-message').textContent = 
            `得分：${this.score}/${levelData.length * 10}  准确率：${Math.round((this.score / (levelData.length * 10)) * 100)}%`;
        
        document.getElementById('feedback-explanation')?.classList.add('hidden');
        
        const btnNext = document.getElementById('btn-next-level');
        if (this.currentLevel < 5) {
            btnNext.textContent = '下一关 →';
            btnNext.classList.remove('hidden');
            btnNext.onclick = () => {
                this.closeModal();
                this.unlockedLevels = Math.max(this.unlockedLevels, this.currentLevel + 1);
                this.currentLevel++;
                this.currentQuestion = 1;
                this.score = 0;
                this.loadQuestion();
            };
        } else {
            btnNext.textContent = '完成！返回菜单';
            btnNext.classList.remove('hidden');
            btnNext.onclick = () => {
                this.closeModal();
                this.showScreen('main-menu');
            };
        }
        
        document.getElementById('btn-retry')?.classList.add('hidden');
        modal?.classList.remove('hidden');
        
        if (this.score >= levelData.length * 8) {
            this.unlockAchievement(this.currentLevel);
        }
    }
    
    unlockAchievement(level) {
        const achievements = JSON.parse(localStorage.getItem('pinyinAchievements') || '[]');
        if (!achievements.includes(level)) {
            achievements.push(level);
            localStorage.setItem('pinyinAchievements', JSON.stringify(achievements));
        }
    }
    
    saveProgress() {
        const progress = {
            level: this.currentLevel,
            question: this.currentQuestion,
            score: this.score,
            unlockedLevels: this.unlockedLevels,
            timestamp: Date.now()
        };
        localStorage.setItem('pinyinGameProgress', JSON.stringify(progress));
    }
    
    showAchievements() {
        const achievements = JSON.parse(localStorage.getItem('pinyinAchievements') || '[]');
        const badges = ['🥉', '🥈', '🥇', '🏅', '👑'];
        let msg = '我的成就\n\n';
        for (let i = 1; i <= 5; i++) {
            msg += `${achievements.includes(i) ? badges[i-1] : '🔒'} ${LEVEL_NAMES[i]}\n`;
        }
        alert(msg);
    }
    
    showParentCenter() {
        const saved = localStorage.getItem('pinyinGameProgress');
        const achievements = JSON.parse(localStorage.getItem('pinyinAchievements') || '[]');
        
        let report = '📊 学习报告\n\n';
        if (saved) {
            const progress = JSON.parse(saved);
            report += `当前关卡：${LEVEL_NAMES[progress.level]}\n`;
            report += `已完成题目：${progress.question}\n`;
            report += `总得分：${progress.score}\n`;
            report += `解锁关卡：${progress.unlockedLevels}/5\n`;
            report += `获得成就：${achievements.length}/5\n`;
        } else {
            report += '暂无学习记录，快开始探险吧！';
        }
        alert(report);
    }
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
    new PinyinGame();
});
