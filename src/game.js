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
        });
        
        document.getElementById('btn-continue')?.addEventListener('click', () => {
            this.loadProgress();
            this.showScreen('game-scene');
        });
        
        document.getElementById('btn-achievements')?.addEventListener('click', () => {
            alert('成就系统开发中...');
        });
        
        document.getElementById('btn-parent')?.addEventListener('click', () => {
            alert('家长中心开发中...');
        });
        
        // 返回按钮
        document.getElementById('btn-back-menu')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('btn-exit')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
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
