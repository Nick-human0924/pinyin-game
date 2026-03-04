/**
 * 拼音探险岛 - 升级版
 * 基于认知科学的学习路径设计
 */

class PinyinGame {
    constructor() {
        this.currentLevel = 1;
        this.currentScene = 'main-menu';
        this.playerProgress = {
            mastered: [],
            learning: [],
            totalScore: 0,
            currentLevel: 1
        };
        
        this.scenes = ['main-menu', 'game-scene'];
        this.currentPinyin = '';
        this.options = [];
        
        // 完整的拼音数据库
        this.pinyinDatabase = {
            // Level 1-3: 声母
            1: { target: 'b', options: ['b', 'd', 'p'], type: 'initial', hint: '双唇音，不送气' },
            2: { target: 'p', options: ['b', 'p', 'm'], type: 'initial', hint: '双唇音，送气' },
            3: { target: 'm', options: ['m', 'n', 'l'], type: 'initial', hint: '双唇鼻音' },
            // Level 4-6: 韵母
            4: { target: 'a', options: ['a', 'o', 'e'], type: 'final', hint: '开口呼' },
            5: { target: 'o', options: ['o', 'u', 'ü'], type: 'final', hint: '合口呼' },
            6: { target: 'e', options: ['e', 'i', 'u'], type: 'final', hint: '开口呼' },
            // Level 7-9: 拼读
            7: { target: 'ba', options: ['ba', 'pa', 'ma'], type: 'blend', hint: 'b + a' },
            8: { target: 'pa', options: ['pa', 'ba', 'fa'], type: 'blend', hint: 'p + a' },
            9: { target: 'ma', options: ['ma', 'na', 'la'], type: 'blend', hint: 'm + a' },
            // Level 10+: 复杂拼读
            10: { target: 'bai', options: ['bai', 'bei', 'bao'], type: 'complex', hint: 'b + ai' },
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('main-menu');
        console.log('拼音探险岛已加载');
    }
    
    bindEvents() {
        document.getElementById('btn-start')?.addEventListener('click', () => this.startGame());
        document.getElementById('btn-continue')?.addEventListener('click', () => this.continueGame());
        document.getElementById('btn-parent')?.addEventListener('click', () => this.showParentCenter());
        document.getElementById('btn-next')?.addEventListener('click', () => this.nextQuestion());
    }
    
    showScreen(screenId) {
        this.scenes.forEach(scene => {
            const el = document.getElementById(scene);
            if (el) el.classList.add('hidden');
        });
        const target = document.getElementById(screenId);
        if (target) target.classList.remove('hidden');
        this.currentScene = screenId;
    }
    
    startGame() {
        this.showScreen('game-scene');
        this.loadLevel(1);
    }
    
    continueGame() {
        const saved = localStorage.getItem('pinyinProgress');
        if (saved) {
            this.playerProgress = JSON.parse(saved);
            this.currentLevel = this.playerProgress.currentLevel || 1;
        }
        this.showScreen('game-scene');
        this.loadLevel(this.currentLevel);
    }
    
    showParentCenter() {
        const report = this.generateReport();
        alert(report);
    }
    
    generateReport() {
        const mastered = this.playerProgress.mastered.length;
        const learning = this.playerProgress.learning.length;
        const score = this.playerProgress.totalScore;
        return `学习报告：\n已掌握：${mastered}个\n学习中：${learning}个\n总得分：${score}分`;
    }
    
    loadLevel(level) {
        this.currentLevel = level;
        const data = this.pinyinDatabase[level] || this.pinyinDatabase[1];
        this.currentPinyin = data.target;
        this.options = data.options;
        this.currentHint = data.hint;
        this.currentType = data.type;
        
        this.renderQuestion();
        this.updateProgress();
        this.updateSceneBackground();
    }
    
    updateSceneBackground() {
        const bg = document.getElementById('scene-background');
        if (!bg) return;
        
        const scenes = {
            'initial': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            'final': 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
            'blend': 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
            'complex': 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)'
        };
        
        bg.style.background = scenes[this.currentType] || scenes['initial'];
    }
    
    renderQuestion() {
        const display = document.getElementById('pinyin-display');
        const optionsContainer = document.getElementById('options-container');
        const feedbackArea = document.getElementById('feedback-area');
        const hintText = document.getElementById('hint-text');
        
        if (display) display.textContent = this.currentPinyin;
        if (feedbackArea) feedbackArea.classList.add('hidden');
        if (hintText) hintText.textContent = this.currentHint || '';
        
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            this.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.addEventListener('click', () => this.checkAnswer(option, btn));
                optionsContainer.appendChild(btn);
            });
        }
    }
    
    checkAnswer(selected, btnElement) {
        const isCorrect = selected === this.currentPinyin;
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackText = document.getElementById('feedback-text');
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        if (isCorrect) {
            btnElement.classList.add('correct');
            if (feedbackText) feedbackText.textContent = '太棒了！答对了！🎉';
            this.playerProgress.mastered.push(this.currentPinyin);
            this.playerProgress.totalScore += 10;
        } else {
            btnElement.classList.add('wrong');
            if (feedbackText) feedbackText.textContent = `再想想，正确答案是 ${this.currentPinyin}`;
            this.playerProgress.learning.push(this.currentPinyin);
        }
        
        if (feedbackArea) feedbackArea.classList.remove('hidden');
        this.saveProgress();
    }
    
    nextQuestion() {
        if (this.playerProgress.mastered.includes(this.currentPinyin)) {
            this.currentLevel = Math.min(this.currentLevel + 1, 10);
        }
        this.loadLevel(this.currentLevel);
    }
    
    updateProgress() {
        const progress = Math.min((this.currentLevel / 10) * 100, 100);
        const fill = document.getElementById('progress-fill');
        if (fill) fill.style.width = progress + '%';
    }
    
    saveProgress() {
        this.playerProgress.currentLevel = this.currentLevel;
        localStorage.setItem('pinyinProgress', JSON.stringify(this.playerProgress));
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loading = document.getElementById('loading-screen');
        if (loading) loading.classList.add('hidden');
        new PinyinGame();
    }, 1500);
});
