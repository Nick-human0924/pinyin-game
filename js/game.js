// ============================================
// 拼音大冒险 - 游戏逻辑
// ============================================

const game = {
    currentVersion: 'shanghai',
    currentLevel: null,
    currentItem: null,
    score: 0,
    stars: 3,
    soundEnabled: true,
    speechRate: 1,
    
    // 初始化语音合成
    initSpeech() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
        }
    },
    
    // 播放拼音发音
    speak(text, rate = null) {
        if (!this.soundEnabled || !this.synth) return;
        
        // 取消之前的语音
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = rate || this.speechRate;
        utterance.pitch = 1.2; // 稍微高一点，更适合儿童
        
        this.synth.speak(utterance);
    },
    
    // 再听一遍当前拼音
    speakCurrent() {
        if (this.currentItem) {
            this.speak(this.currentItem.char);
        }
    },
    
    // 开始关卡
    startLevel(levelId) {
        const data = getPinyinData(this.currentVersion);
        this.currentLevel = data.levels.find(l => l.id === levelId);
        this.score = 0;
        this.stars = 3;
        
        if (!this.currentLevel) return;
        
        // 打乱题目顺序
        this.shuffledItems = [...this.currentLevel.items].sort(() => Math.random() - 0.5);
        this.currentItemIndex = 0;
        
        this.showNextQuestion();
    },
    
    // 显示下一题
    showNextQuestion() {
        if (this.currentItemIndex >= this.shuffledItems.length) {
            this.showLevelComplete();
            return;
        }
        
        this.currentItem = this.shuffledItems[this.currentItemIndex];
        this.renderQuestion();
        
        // 自动播放发音
        setTimeout(() => {
            this.speak(this.currentItem.char);
        }, 500);
    },
    
    // 渲染题目
    renderQuestion() {
        const content = document.getElementById('game-content');
        const allChars = getAllPinyinChars(this.currentVersion);
        
        // 生成干扰项
        const distractors = this.generateDistractors(allChars, this.currentItem.char, 3);
        const options = [this.currentItem.char, ...distractors].sort(() => Math.random() - 0.5);
        
        content.innerHTML = `
            <div class="pinyin-card">
                <div class="pinyin-img">${this.currentItem.emoji}</div>
                <div class="pinyin-word">${this.currentItem.word}</div>
                <p style="color: #718096; margin-top: 10px;">这个字的拼音是什么？</p>
            </div>
            <div class="options-grid">
                ${options.map(opt => `
                    <button class="option-btn" data-value="${opt}" onclick="game.checkAnswer('${opt}')">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        
        // 更新关卡信息
        document.getElementById('current-level').textContent = 
            `第${this.currentLevel.id}关 · ${this.currentItemIndex + 1}/${this.shuffledItems.length}`;
    },
    
    // 生成干扰项
    generateDistractors(allChars, correct, count) {
        const distractors = [];
        const filtered = allChars.filter(c => c !== correct);
        
        while (distractors.length < count && filtered.length > 0) {
            const index = Math.floor(Math.random() * filtered.length);
            const char = filtered.splice(index, 1)[0];
            distractors.push(char);
        }
        
        return distractors;
    },
    
    // 检查答案
    checkAnswer(selected) {
        const buttons = document.querySelectorAll('.option-btn');
        const correct = this.currentItem.char;
        
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.value === correct) {
                btn.classList.add('correct');
            } else if (btn.dataset.value === selected && selected !== correct) {
                btn.classList.add('wrong');
            }
        });
        
        if (selected === correct) {
            this.score++;
            this.speak('答对了！真棒！');
            setTimeout(() => {
                this.currentItemIndex++;
                this.showNextQuestion();
            }, 1500);
        } else {
            this.stars = Math.max(1, this.stars - 1);
            this.speak('再想想看');
            setTimeout(() => {
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('correct', 'wrong');
                });
            }, 1500);
        }
        
        this.updateStars();
    },
    
    // 更新星星显示
    updateStars() {
        const starsEl = document.getElementById('level-stars');
        starsEl.textContent = '⭐'.repeat(this.stars);
    },
    
    // 显示提示
    showHint() {
        if (this.currentItem) {
            this.speak(`${this.currentItem.char}，${this.currentItem.word}`);
            app.showModal('hint', `提示：${this.currentItem.word}`);
        }
    },
    
    // 关卡完成
    showLevelComplete() {
        const accuracy = Math.round((this.score / this.shuffledItems.length) * 100);
        const stars = this.stars;
        
        // 保存进度
        app.saveLevelProgress(this.currentLevel.id, stars);
        
        this.speak(`关卡完成！你获得了${stars}颗星！`);
        
        app.showModal('complete', `
            <div class="modal-icon">🎉</div>
            <h3>关卡完成！</h3>
            <p>正确率：${accuracy}%</p>
            <p>获得星星：${'⭐'.repeat(stars)}</p>
            <button class="btn btn-primary" onclick="app.showLevelSelect()" style="margin-top: 20px;">
                继续闯关
            </button>
        `);
    },
    
    // 暂停游戏
    pauseGame() {
        app.showModal('pause', `
            <h3>游戏暂停</h3>
            <button class="btn btn-primary" onclick="app.hideModal()">继续游戏</button>
            <button class="btn btn-secondary" onclick="app.backToMenu(); app.hideModal();">退出关卡</button>
        `);
    },
    
    // 切换音效
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        app.saveSetting('sound', this.soundEnabled);
        return this.soundEnabled;
    }
};

// 初始化语音
window.addEventListener('load', () => {
    game.initSpeech();
});
