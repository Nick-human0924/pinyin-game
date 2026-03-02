// ============================================
// 拼音大冒险 - 游戏逻辑（修复版）
// ============================================

const game = {
    currentVersion: 'shanghai',
    currentLevel: null,
    currentItem: null,
    score: 0,
    stars: 3,
    soundEnabled: true,
    speechRate: 1,
    hintUsed: false, // 标记是否使用了提示
    
    // 初始化语音合成
    initSpeech() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            // 预加载语音列表
            this.loadVoices();
            // 某些浏览器需要等待语音加载
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    },
    
    // 加载语音列表
    loadVoices() {
        this.voices = this.synth.getVoices();
        this.zhVoice = this.voices.find(v => v.lang.includes('zh') || v.lang.includes('CN') || v.lang.includes('zh-CN'));
        console.log('可用语音:', this.voices.length, '中文语音:', this.zhVoice ? this.zhVoice.name : '未找到');
    },
    
    // 播放拼音发音 - 修复：正确读拼音而非英文
    speak(text, rate = null) {
        if (!this.soundEnabled) return;
        
        // 将拼音转换为中文发音描述
        const pinyinToChinese = this.getPinyinMapping();
        let speakText = text;
        
        // 如果是单个拼音字符，转换为中文描述
        if (pinyinToChinese[text]) {
            speakText = pinyinToChinese[text];
        }
        
        console.log('朗读:', text, '->', speakText);
        
        // 尝试使用Web Speech API
        if ('speechSynthesis' in window) {
            this.synth.cancel();
            
            const utterance = new SpeechSynthesisUtterance(speakText);
            utterance.lang = 'zh-CN';
            // 降低语速，默认0.6倍速
            utterance.rate = (rate || this.speechRate) * 0.6;
            utterance.pitch = 1.0;
            
            // 使用预加载的中文语音
            if (this.zhVoice) {
                utterance.voice = this.zhVoice;
                console.log('使用语音:', this.zhVoice.name);
            } else {
                // 如果没有预加载到，尝试重新获取
                const voices = this.synth.getVoices();
                const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN') || v.lang.includes('zh-CN'));
                if (zhVoice) {
                    utterance.voice = zhVoice;
                    console.log('使用语音(重新获取):', zhVoice.name);
                }
            }
            
            this.synth.speak(utterance);
        }
    },
    
    // 拼音到中文发音的映射
    getPinyinMapping() {
        return {
            // 单韵母
            'a': '啊', 'o': '哦', 'e': '鹅', 'i': '衣', 'u': '乌', 'ü': '迂',
            // 声母
            'b': '玻', 'p': '坡', 'm': '摸', 'f': '佛',
            'd': '得', 't': '特', 'n': '讷', 'l': '勒',
            'g': '哥', 'k': '科', 'h': '喝',
            'j': '基', 'q': '欺', 'x': '希',
            'z': '资', 'c': '雌', 's': '思',
            'zh': '知', 'ch': '蚩', 'sh': '诗', 'r': '日',
            'y': '医', 'w': '巫',
            // 复韵母
            'ai': '哀', 'ei': '诶', 'ui': '威', 'ao': '熬', 'ou': '欧', 'iu': '优',
            'ie': '耶', 'üe': '约', 'er': '儿',
            // 鼻韵母
            'an': '安', 'en': '恩', 'in': '因', 'un': '温', 'ün': '晕',
            'ang': '昂', 'eng': '亨', 'ing': '英', 'ong': '雍',
            // 整体认读
            'zhi': '知', 'chi': '蚩', 'shi': '诗', 'ri': '日',
            'zi': '资', 'ci': '雌', 'si': '思',
            'yi': '衣', 'wu': '乌', 'yu': '迂',
            'ye': '耶', 'yue': '约', 'yuan': '冤',
            'yin': '因', 'yun': '晕', 'ying': '英'
        };
    },
    
    // 备用音频播放
    playAudioBackup(text) {
        // 这里可以添加音频文件播放逻辑
        // 例如：new Audio(`audio/${text}.mp3`).play();
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
        this.hintUsed = false;
        
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
        this.hintUsed = false; // 重置提示标记
        this.renderQuestion();
        
        // 自动播放发音
        setTimeout(() => {
            this.speak(this.currentItem.char);
        }, 500);
    },
    
    // 渲染题目 - 添加返回按钮
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
    
    // 显示提示 - 修复：提示后可以返回继续答题
    showHint() {
        if (this.currentItem && !this.hintUsed) {
            this.hintUsed = true;
            this.speak(`${this.currentItem.char}，${this.currentItem.word}`);
            
            // 显示提示弹窗，有关闭按钮
            app.showModal('hint', `
                <div class="hint-content">
                    <div class="hint-icon">💡</div>
                    <h3>提示</h3>
                    <p>${this.currentItem.word}</p>
                    <div class="hint-pinyin">${this.currentItem.char}</div>
                    <button class="btn btn-primary" onclick="app.hideModal()">知道了，继续答题</button>
                </div>
            `);
        } else if (this.hintUsed) {
            // 已经用过提示了
            app.showToast('每题只能使用一次提示哦！');
        }
    },
    
    // 关卡完成
    showLevelComplete() {
        const accuracy = Math.round((this.score / this.shuffledItems.length) * 100);
        const stars = this.stars;

        // 保存进度
        app.saveLevelProgress(this.currentLevel.id, stars);

        // 奖励钥匙
        let keys = parseInt(localStorage.getItem('pinyinKeys') || '0');
        keys += 1;
        localStorage.setItem('pinyinKeys', keys);

        this.speak(`关卡完成！你获得了${stars}颗星！`);

        app.showModal('complete', `
            <div class="modal-icon">🎉</div>
            <h3>关卡完成！</h3>
            <p>正确率：${accuracy}%</p>
            <p>获得星星：${'⭐'.repeat(stars)}</p>
            <p>奖励金币：${stars * 10} 🪙</p>
            <p>获得钥匙：🔑 +1</p>
            <div class="complete-buttons">
                <button class="btn btn-primary" onclick="app.showLevelSelect(); app.hideModal();">继续闯关</button>
                <button class="btn btn-secondary" onclick="app.backToMenu(); app.hideModal();">返回主菜单</button>
            </div>
        `);
    },
    
    // 暂停游戏 - 添加返回关卡选择
    pauseGame() {
        app.showModal('pause', `
            <div class="pause-menu">
                <h3>⏸️ 游戏暂停</h3>
                <div class="pause-buttons">
                    <button class="btn btn-primary" onclick="app.hideModal()">▶️ 继续游戏</button>
                    <button class="btn btn-secondary" onclick="app.showLevelSelect(); app.hideModal();">🗺️ 返回关卡选择</button>
                    <button class="btn btn-back" onclick="app.backToMenu(); app.hideModal();">🏠 返回主菜单</button>
                </div>
            </div>
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
