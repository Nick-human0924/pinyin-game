/**
 * 拼音探险岛 2.0 - 迭代版
 * Level 1: 听音辨形
 */

class PinyinGame {
    constructor() {
        this.currentLevel = 1;
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.score = 0;
        this.soundEnabled = true;
        
        // Level 1 数据：声母听音辨形
        this.levelData = [
            { sound: 'b', options: ['b', 'd', 'p'], correct: 0, hint: '双唇紧闭，突然放开，不送气' },
            { sound: 'p', options: ['b', 'p', 'm'], correct: 1, hint: '双唇紧闭，突然放开，送气' },
            { sound: 'm', options: ['m', 'n', 'l'], correct: 0, hint: '双唇紧闭，气流从鼻腔出' },
            { sound: 'f', options: ['h', 'f', 's'], correct: 1, hint: '上齿咬下唇，气流从缝隙出' },
            { sound: 'd', options: 'd', 'b', 't'], correct: 0, hint: '舌尖抵上齿龈，突然放开，不送气' },
            { sound: 't', options: ['d', 't', 'n'], correct: 1, hint: '舌尖抵上齿龈，突然放开，送气' },
            { sound: 'n', options: ['m', 'n', 'l'], correct: 1, hint: '舌尖抵上齿龈，气流从鼻腔出' },
            { sound: 'l', options: ['n', 'l', 'r'], correct: 1, hint: '舌尖抵上齿龈，气流从两边出' },
            { sound: 'g', options: ['g', 'k', 'h'], correct: 0, hint: '舌根抵软腭，突然放开，不送气' },
            { sound: 'k', options: ['g', 'k', 'h'], correct: 1, hint: '舌根抵软腭，突然放开，送气' }
        ];
        
        this.currentData = null;
        this.hasPlayed = false;
        this.selectedOption = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('main-menu');
        
        // 隐藏加载画面
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
        
        console.log('拼音探险岛 2.0 已加载');
    }
    
    bindEvents() {
        // 主菜单
        document.getElementById('btn-start')?.addEventListener('click', () => this.startGame());
        document.getElementById('btn-continue')?.addEventListener('click', () => this.continueGame());
        document.getElementById('btn-achievements')?.addEventListener('click', () => this.showAchievements());
        document.getElementById('btn-parent')?.addEventListener('click', () => this.showParentCenter());
        
        // 游戏界面
        document.getElementById('btn-exit')?.addEventListener('click', () => this.exitGame());
        document.getElementById('btn-sound')?.addEventListener('click', () => this.toggleSound());
        document.getElementById('btn-play-sound')?.addEventListener('click', () => this.playSound());
        document.getElementById('btn-hint')?.addEventListener('click', () => this.showHint());
        document.getElementById('btn-slow')?.addEventListener('click', () => this.playSlow());
        
        // 弹窗按钮
        document.getElementById('btn-next-level')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('btn-retry')?.addEventListener('click', () => this.retryQuestion());
        document.getElementById('btn-continue-game')?.addEventListener('click', () => this.closeModal());
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId)?.classList.remove('hidden');
    }
    
    startGame() {
        this.currentLevel = 1;
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
        }
        this.showScreen('game-scene');
        this.loadQuestion();
    }
    
    exitGame() {
        if (confirm('确定要退出游戏吗？进度会自动保存。')) {
            this.saveProgress();
            this.showScreen('main-menu');
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound');
        btn.textContent = this.soundEnabled ? '🔊' : '🔇';
    }
    
    loadQuestion() {
        this.currentData = this.levelData[this.currentQuestion - 1];
        this.hasPlayed = false;
        this.selectedOption = null;
        
        // 更新UI
        document.getElementById('current-level').textContent = `第 ${this.currentQuestion} 关`;
        document.getElementById('progress-text').textContent = `${this.currentQuestion}/${this.totalQuestions}`;
        document.getElementById('progress-fill').style.width = `${(this.currentQuestion / this.totalQuestions) * 100}%`;
        
        // 重置界面
        document.getElementById('mouth-options').classList.add('hidden');
        document.getElementById('btn-play-sound').classList.remove('hidden');
        document.getElementById('instruction').textContent = '点击播放，听一听是什么音？';
        
        // 隐藏气泡
        document.getElementById('character-bubble').classList.add('hidden');
        
        this.renderOptions();
    }
    
    renderOptions() {
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        
        this.currentData.options.forEach((option, index) => {
            const btn = document.createElement('div');
            btn.className = 'mouth-option';
            btn.innerHTML = `
                <div class="mouth-shape">👄</div>
                <div class="mouth-pinyin">${option}</div>
            `;
            btn.addEventListener('click', () => this.selectOption(index, btn));
            container.appendChild(btn);
        });
    }
    
    playSound() {
        // 模拟播放发音
        const sound = this.currentData.sound;
        console.log(`播放发音: ${sound}`);
        
        // 使用Web Speech API
        if ('speechSynthesis' in window && this.soundEnabled) {
            const utterance = new SpeechSynthesisUtterance(sound);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
        
        this.hasPlayed = true;
        
        // 显示选项
        document.getElementById('mouth-options').classList.remove('hidden');
        document.getElementById('instruction').textContent = '选择你听到的发音：';
        
        // 小书童提示
        this.showBubble('仔细听，然后选择正确的口型！');
    }
    
    playSlow() {
        const sound = this.currentData.sound;
        if ('speechSynthesis' in window && this.soundEnabled) {
            const utterance = new SpeechSynthesisUtterance(sound);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.5; // 慢速
            speechSynthesis.speak(utterance);
        }
    }
    
    showHint() {
        this.showBubble(this.currentData.hint);
    }
    
    showBubble(text) {
        const bubble = document.getElementById('character-bubble');
        document.getElementById('bubble-text').textContent = text;
        bubble.classList.remove('hidden');
        
        setTimeout(() => {
            bubble.classList.add('hidden');
        }, 3000);
    }
    
    selectOption(index, element) {
        if (!this.hasPlayed) {
            this.showBubble('先点击播放按钮听发音哦！');
            return;
        }
        
        // 清除之前的选择
        document.querySelectorAll('.mouth-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        element.classList.add('selected');
        this.selectedOption = index;
        
        // 检查答案
        setTimeout(() => this.checkAnswer(), 500);
    }
    
    checkAnswer() {
        const isCorrect = this.selectedOption === this.currentData.correct;
        const options = document.querySelectorAll('.mouth-option');
        
        // 显示正确/错误
        options[this.selectedOption].classList.remove('selected');
        options[this.selectedOption].classList.add(isCorrect ? 'correct' : 'wrong');
        
        if (!isCorrect) {
            options[this.currentData.correct].classList.add('correct');
        }
        
        // 显示反馈
        setTimeout(() => {
            this.showFeedback(isCorrect);
        }, 1000);
    }
    
    showFeedback(isCorrect) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('feedback-icon');
        const title = document.getElementById('feedback-title');
        const message = document.getElementById('feedback-message');
        const explanation = document.getElementById('feedback-explanation');
        const explanationText = document.getElementById('explanation-text');
        const btnNext = document.getElementById('btn-next-level');
        const btnRetry = document.getElementById('btn-retry');
        const btnContinue = document.getElementById('btn-continue-game');
        
        if (isCorrect) {
            icon.textContent = '🎉';
            title.textContent = '太棒了！';
            message.textContent = `正确答案是 "${this.currentData.sound}"，你答对了！`;
            this.score += 10;
            
            btnNext.classList.remove('hidden');
            btnRetry.classList.add('hidden');
            btnContinue.classList.add('hidden');
            
            this.showBubble('你真棒！继续加油！');
        } else {
            icon.textContent = '💪';
            title.textContent = '再试一次！';
            message.textContent = `这是 "${this.currentData.sound}"，仔细听一下区别。`;
            
            btnNext.classList.add('hidden');
            btnRetry.classList.remove('hidden');
            btnContinue.classList.add('hidden');
            
            this.showBubble('没关系，再听一遍！');
        }
        
        explanation.classList.remove('hidden');
        explanationText.textContent = this.currentData.hint;
        
        modal.classList.remove('hidden');
        this.saveProgress();
    }
    
    nextQuestion() {
        this.closeModal();
        
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            // 关卡完成
            this.showLevelComplete();
        }
    }
    
    retryQuestion() {
        this.closeModal();
        this.loadQuestion();
    }
    
    closeModal() {
        document.getElementById('feedback-modal').classList.add('hidden');
    }
    
    showLevelComplete() {
        const modal = document.getElementById('feedback-modal');
        document.getElementById('feedback-icon').textContent = '🏆';
        document.getElementById('feedback-title').textContent = '关卡完成！';
        document.getElementById('feedback-message').textContent = `恭喜你完成第1关！得分：${this.score}/${this.totalQuestions * 10}`;
        document.getElementById('feedback-explanation').classList.add('hidden');
        
        document.getElementById('btn-next-level').textContent = '下一关 →';
        document.getElementById('btn-next-level').classList.remove('hidden');
        document.getElementById('btn-retry').classList.add('hidden');
        document.getElementById('btn-continue-game').classList.add('hidden');
        
        modal.classList.remove('hidden');
        
        // 重置到下一关
        this.currentQuestion = 1;
    }
    
    saveProgress() {
        const progress = {
            level: this.currentLevel,
            question: this.currentQuestion,
            score: this.score,
            timestamp: Date.now()
        };
        localStorage.setItem('pinyinGameProgress', JSON.stringify(progress));
    }
    
    showAchievements() {
        const saved = localStorage.getItem('pinyinGameProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            alert(`当前进度：\n关卡：${progress.level}\n题目：${progress.question}\n得分：${progress.score}`);
        } else {
            alert('还没有游戏记录，快开始探险吧！');
        }
    }
    
    showParentCenter() {
        const saved = localStorage.getItem('pinyinGameProgress');
        let report = '学习报告\n\n';
        if (saved) {
            const progress = JSON.parse(saved);
            report += `当前关卡：${progress.level}\n`;
            report += `完成题目：${progress.question}\n`;
            report += `总得分：${progress.score}\n`;
            report += `准确率：${Math.round((progress.score / (progress.question * 10)) * 100)}%`;
        } else {
            report += '暂无学习记录';
        }
        alert(report);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new PinyinGame();
});
