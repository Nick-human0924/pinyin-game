/**
 * 宠物养成系统 - 小书童成长路线
 */

const PET_SYSTEM = {
    // 成长阶段
    stages: {
        1: { name: '小书童', icon: '👶', minLevel: 1, color: '#8B4513' },
        2: { name: '小学士', icon: '🎓', minLevel: 6, color: '#4169E1' },
        3: { name: '小状元', icon: '👑', minLevel: 11, color: '#FFD700' },
        4: { name: '小博士', icon: '📚', minLevel: 16, color: '#9932CC' }
    },
    
    // 经验值配置
    exp: {
        perCorrect: 10,      // 答对一题
        perLevelComplete: 50, // 完成一关
        dailyLogin: 20,      // 每日登录
        streakBonus: [0, 10, 20, 30, 50, 80], // 连续打卡奖励
        achievementUnlock: 100 // 解锁成就
    },
    
    // 等级配置
    levels: [
        { level: 1, exp: 0, title: '初入学堂' },
        { level: 2, exp: 50, title: '勤奋学子' },
        { level: 3, exp: 120, title: '进步明显' },
        { level: 4, exp: 200, title: '品学兼优' },
        { level: 5, exp: 300, title: '小有所成' },
        { level: 6, exp: 450, title: '小学士入门' },
        { level: 7, exp: 600, title: '学识渐长' },
        { level: 8, exp: 800, title: '才华横溢' },
        { level: 9, exp: 1000, title: '出类拔萃' },
        { level: 10, exp: 1300, title: '学富五车' },
        { level: 11, exp: 1700, title: '小状元入门' },
        { level: 12, exp: 2100, title: '才高八斗' },
        { level: 13, exp: 2600, title: '满腹经纶' },
        { level: 14, exp: 3200, title: '博学多才' },
        { level: 15, exp: 4000, title: '登峰造极' },
        { level: 16, exp: 5000, title: '小博士入门' },
        { level: 17, exp: 6200, title: '学贯中西' },
        { level: 18, exp: 7600, title: '博古通今' },
        { level: 19, exp: 9200, title: '一代宗师' },
        { level: 20, exp: 11000, title: '拼音大师' }
    ],
    
    // 服装系统
    outfits: {
        clothes: [
            { id: 'default', name: '基础汉服', icon: '👘', unlockLevel: 1, price: 0 },
            { id: 'school', name: '校服', icon: '👔', unlockLevel: 3, price: 100 },
            { id: 'sport', name: '运动装', icon: '👕', unlockLevel: 5, price: 150 },
            { id: 'formal', name: '礼服', icon: '🤵', unlockLevel: 8, price: 300 },
            { id: 'royal', name: '状元袍', icon: '👘', unlockLevel: 11, price: 500 },
            { id: 'scholar', name: '博士服', icon: '🎓', unlockLevel: 16, price: 800 }
        ],
        accessories: [
            { id: 'none', name: '无', icon: '', unlockLevel: 1, price: 0 },
            { id: 'glasses', name: '眼镜', icon: '👓', unlockLevel: 2, price: 50 },
            { id: 'hat', name: '帽子', icon: '🎩', unlockLevel: 4, price: 80 },
            { id: 'backpack', name: '书包', icon: '🎒', unlockLevel: 6, price: 120 },
            { id: 'crown', name: '状元帽', icon: '👑', unlockLevel: 11, price: 400 },
            { id: 'scroll', name: '书卷', icon: '📜', unlockLevel: 16, price: 600 }
        ]
    },
    
    // 每日任务
    dailyTasks: [
        { id: 'login', name: '每日登录', reward: 20, desc: '每天打开游戏' },
        { id: 'answer5', name: '答题小能手', reward: 30, desc: '答对5道题' },
        { id: 'complete1', name: '关卡挑战', reward: 50, desc: '完成1个关卡' },
        { id: 'streak3', name: '坚持不懈', reward: 100, desc: '连续3天登录' },
        { id: 'perfect', name: '完美通关', reward: 80, desc: '一关全对' }
    ],
    
    // 道具商店
    shop: [
        { id: 'hint', name: '提示卡', icon: '🔍', price: 10, desc: '显示发音技巧' },
        { id: 'skip', name: '跳过卡', icon: '⏭️', price: 20, desc: '跳过当前题目' },
        { id: 'double', name: '双倍卡', icon: '⭐', price: 30, desc: '本关得分x2' },
        { id: 'change', name: '换题卡', icon: '🎲', price: 15, desc: '更换当前题目' },
        { id: 'revive', name: '复活卡', icon: '💖', price: 50, desc: '答错后继续' }
    ]
};

// 宠物状态管理
class PetSystem {
    constructor() {
        this.loadData();
    }
    
    loadData() {
        const saved = localStorage.getItem('pinyinPetData');
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = {
                level: 1,
                exp: 0,
                coins: 100,
                streakDays: 0,
                lastLogin: null,
                outfit: { clothes: 'default', accessory: 'none' },
                inventory: [],
                achievements: [],
                dailyTasks: {},
                totalCorrect: 0,
                totalQuestions: 0
            };
        }
    }
    
    saveData() {
        localStorage.setItem('pinyinPetData', JSON.stringify(this.data));
    }
    
    // 检查每日登录
    checkDailyLogin() {
        const today = new Date().toDateString();
        const lastLogin = this.data.lastLogin;
        
        if (lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastLogin === yesterday.toDateString()) {
                this.data.streakDays++;
            } else {
                this.data.streakDays = 1;
            }
            
            this.data.lastLogin = today;
            this.addCoins(PET_SYSTEM.exp.dailyLogin);
            this.completeTask('login');
            
            // 连续登录奖励
            const streakBonus = PET_SYSTEM.exp.streakBonus[Math.min(this.data.streakDays, 5)];
            if (streakBonus > 0) {
                this.addCoins(streakBonus);
            }
            
            this.saveData();
            return { isNewDay: true, streak: this.data.streakDays, bonus: streakBonus };
        }
        
        return { isNewDay: false, streak: this.data.streakDays };
    }
    
    // 添加经验
    addExp(amount) {
        this.data.exp += amount;
        const oldLevel = this.data.level;
        
        // 检查升级
        for (let i = PET_SYSTEM.levels.length - 1; i >= 0; i--) {
            if (this.data.exp >= PET_SYSTEM.levels[i].exp) {
                this.data.level = PET_SYSTEM.levels[i].level;
                break;
            }
        }
        
        this.saveData();
        
        if (this.data.level > oldLevel) {
            return { leveledUp: true, newLevel: this.data.level, title: this.getCurrentTitle() };
        }
        return { leveledUp: false };
    }
    
    // 添加金币
    addCoins(amount) {
        this.data.coins += amount;
        this.saveData();
    }
    
    // 消费金币
    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.saveData();
            return true;
        }
        return false;
    }
    
    // 获取当前称号
    getCurrentTitle() {
        const levelData = PET_SYSTEM.levels.find(l => l.level === this.data.level);
        return levelData ? levelData.title : '初学者';
    }
    
    // 获取当前阶段
    getCurrentStage() {
        for (let i = 4; i >= 1; i--) {
            if (this.data.level >= PET_SYSTEM.stages[i].minLevel) {
                return PET_SYSTEM.stages[i];
            }
        }
        return PET_SYSTEM.stages[1];
    }
    
    // 获取升级所需经验
    getExpToNextLevel() {
        const nextLevel = PET_SYSTEM.levels.find(l => l.level === this.data.level + 1);
        if (!nextLevel) return 0;
        return nextLevel.exp - this.data.exp;
    }
    
    // 完成每日任务
    completeTask(taskId) {
        const today = new Date().toDateString();
        if (!this.data.dailyTasks[today]) {
            this.data.dailyTasks[today] = [];
        }
        
        if (!this.data.dailyTasks[today].includes(taskId)) {
            this.data.dailyTasks[today].push(taskId);
            const task = PET_SYSTEM.dailyTasks.find(t => t.id === taskId);
            if (task) {
                this.addCoins(task.reward);
                return { completed: true, reward: task.reward };
            }
        }
        return { completed: false };
    }
    
    // 检查任务是否完成
    isTaskCompleted(taskId) {
        const today = new Date().toDateString();
        return this.data.dailyTasks[today]?.includes(taskId) || false;
    }
    
    // 记录答题
    recordAnswer(isCorrect) {
        this.data.totalQuestions++;
        if (isCorrect) {
            this.data.totalCorrect++;
            this.addExp(PET_SYSTEM.exp.perCorrect);
            this.addCoins(5);
            
            // 检查答题任务
            if (this.data.totalCorrect % 5 === 0) {
                this.completeTask('answer5');
            }
        }
        this.saveData();
    }
    
    // 购买道具
    buyItem(itemId) {
        const item = PET_SYSTEM.shop.find(i => i.id === itemId);
        if (!item) return { success: false, message: '道具不存在' };
        
        if (this.spendCoins(item.price)) {
            this.data.inventory.push(itemId);
            this.saveData();
            return { success: true, message: `购买成功：${item.name}` };
        }
        return { success: false, message: '金币不足' };
    }
    
    // 使用道具
    useItem(itemId) {
        const index = this.data.inventory.indexOf(itemId);
        if (index > -1) {
            this.data.inventory.splice(index, 1);
            this.saveData();
            return { success: true };
        }
        return { success: false, message: '道具不足' };
    }
    
    // 换装
    changeOutfit(type, itemId) {
        this.data.outfit[type] = itemId;
        this.saveData();
    }
    
    // 获取完整状态
    getStatus() {
        const stage = this.getCurrentStage();
        const nextLevelExp = this.getExpToNextLevel();
        
        return {
            level: this.data.level,
            title: this.getCurrentTitle(),
            exp: this.data.exp,
            expToNext: nextLevelExp,
            coins: this.data.coins,
            streakDays: this.data.streakDays,
            stage: stage,
            outfit: this.data.outfit,
            totalCorrect: this.data.totalCorrect,
            accuracy: this.data.totalQuestions > 0 
                ? Math.round((this.data.totalCorrect / this.data.totalQuestions) * 100) 
                : 0
        };
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PET_SYSTEM, PetSystem };
}
