// ===== 新版39徽章系统 - 难度递增设计 =====
// 分为6个等级：青铜(8个) -> 白银(7个) -> 黄金(7个) -> 铂金(6个) -> 钻石(6个) -> 王者(5个)

// 初始化徽章系统（支持从旧版数据迁移）
function initBadgeSystem(savedAchievements) {
    // 如果没有保存的成就数据，创建全新的39徽章
    if (!savedAchievements || savedAchievements.length === 0) {
        createFreshBadges();
        return;
    }
    
    // 检查是否是新版39徽章系统
    if (savedAchievements.length >= 39) {
        // 恢复保存的成就数据
        achievements = savedAchievements;
        // 重新绑定condition函数（因为JSON保存会丢失函数）
        rebindBadgeConditions();
    } else {
        // 旧版数据迁移：保留已解锁的成就，并扩展为新版39徽章
        console.log('检测到旧版徽章数据，进行迁移...');
        createFreshBadges();
        migrateOldBadges(savedAchievements);
    }
    
    updateAchievementUI();
}

// 创建全新的39徽章
function createFreshBadges() {
    achievements = [];
    Object.keys(BADGES_DATA).forEach(function(tier) {
        BADGES_DATA[tier].forEach(function(badge) {
            achievements.push({
                id: badge.id,
                name: badge.name,
                desc: badge.desc,
                icon: badge.icon,
                reward: badge.reward,
                tier: badge.tier,
                condition: badge.condition,
                unlocked: false,
                unlockDate: null
            });
        });
    });
}

// 迁移旧版徽章数据
function migrateOldBadges(oldAchievements) {
    var migrationMap = {
        'first_win': 'bronze_1',
        'level_master': 'silver_1',
        'level_king': 'gold_1',
        'battle_hero': 'silver_2',
        'rich': 'silver_3',
        'streak_3': 'bronze_5',
        'shopaholic': 'silver_7',
        'perfect': 'bronze_4'
    };
    
    oldAchievements.forEach(function(oldAch) {
        if (oldAch.unlocked && migrationMap[oldAch.id]) {
            var newBadgeId = migrationMap[oldAch.id];
            var newBadge = achievements.find(function(a) { return a.id === newBadgeId; });
            if (newBadge) {
                newBadge.unlocked = true;
                newBadge.unlockDate = oldAch.unlockDate || new Date().toISOString();
                console.log('迁移徽章:', oldAch.name, '->', newBadge.name);
            }
        }
    });
}

// 重新绑定徽章条件函数
function rebindBadgeConditions() {
    achievements.forEach(function(ach) {
        var badgeData = findBadgeData(ach.id);
        if (badgeData && badgeData.condition) {
            ach.condition = badgeData.condition;
        }
    });
}

// 根据ID查找徽章数据
function findBadgeData(badgeId) {
    for (var tier in BADGES_DATA) {
        var badge = BADGES_DATA[tier].find(function(b) { return b.id === badgeId; });
        if (badge) return badge;
    }
    return null;
}

var BADGES_DATA = {
    // 青铜级 - 入门挑战 (8个)
    bronze: [
        { id: 'bronze_1', name: '拼音萌新', desc: '首次通关任意关卡', icon: '🌱', reward: 10, tier: 'bronze', condition: function() { return completedLevels >= 1; } },
        { id: 'bronze_2', name: '初战告捷', desc: '首次赢得野外战斗', icon: '⚔️', reward: 10, tier: 'bronze', condition: function() { return battleWins >= 1; } },
        { id: 'bronze_3', name: '小小收藏家', desc: '拥有100金币', icon: '🪙', reward: 10, tier: 'bronze', condition: function() { return coins >= 100; } },
        { id: 'bronze_4', name: '完美起步', desc: '首次3题全对通关', icon: '💯', reward: 15, tier: 'bronze', condition: function() { return perfectLevels >= 1; } },
        { id: 'bronze_5', name: '坚持打卡', desc: '累计打卡3天', icon: '📅', reward: 15, tier: 'bronze', condition: function() { return totalCheckInDays >= 3; } },
        { id: 'bronze_6', name: '初识拼音', desc: '完成基础教学全部内容', icon: '📚', reward: 10, tier: 'bronze', condition: function() { return basicTutorialCompleted; } },
        { id: 'bronze_7', name: '小有积蓄', desc: '首次拥有3件装备/道具', icon: '🎒', reward: 10, tier: 'bronze', condition: function() { return ownedItems.length >= 3; } },
        { id: 'bronze_8', name: '连胜开始', desc: '单日连胜5场战斗', icon: '🔥', reward: 15, tier: 'bronze', condition: function() { return dailyBattleStreak >= 5; } }
    ],
    
    // 白银级 - 进阶挑战 (7个)
    silver: [
        { id: 'silver_1', name: '闯关达人', desc: '通关10个关卡', icon: '🌟', reward: 20, tier: 'silver', condition: function() { return completedLevels >= 10; } },
        { id: 'silver_2', name: '战斗高手', desc: '累计赢得20场战斗', icon: '🛡️', reward: 20, tier: 'silver', condition: function() { return battleWins >= 20; } },
        { id: 'silver_3', name: '金币收集者', desc: '拥有500金币', icon: '💰', reward: 20, tier: 'silver', condition: function() { return coins >= 500; } },
        { id: 'silver_4', name: '完美主义者', desc: '累计5次完美通关', icon: '✨', reward: 25, tier: 'silver', condition: function() { return perfectLevels >= 5; } },
        { id: 'silver_5', name: '连续打卡王', desc: '连续打卡7天', icon: '📆', reward: 25, tier: 'silver', condition: function() { return streak >= 7; } },
        { id: 'silver_6', name: '宠物训练师', desc: '任意宠物升至5级', icon: '🐾', reward: 20, tier: 'silver', condition: function() { return hasPetLevel(5); } },
        { id: 'silver_7', name: '购物达人', desc: '累计购买10件商品', icon: '🛍️', reward: 20, tier: 'silver', condition: function() { return totalItemsBought >= 10; } }
    ],
    
    // 黄金级 - 熟练挑战 (7个)
    gold: [
        { id: 'gold_1', name: '闯关大师', desc: '通关全部15个基础关卡', icon: '👑', reward: 30, tier: 'gold', condition: function() { return completedLevels >= 15; } },
        { id: 'gold_2', name: '战斗宗师', desc: '累计赢得50场战斗', icon: '⚔️', reward: 30, tier: 'gold', condition: function() { return battleWins >= 50; } },
        { id: 'gold_3', name: '财富累积', desc: '拥有1000金币', icon: '💎', reward: 30, tier: 'gold', condition: function() { return coins >= 1000; } },
        { id: 'gold_4', name: '完美大师', desc: '累计10次完美通关', icon: '🏆', reward: 35, tier: 'gold', condition: function() { return perfectLevels >= 10; } },
        { id: 'gold_5', name: '半月坚持', desc: '连续打卡15天', icon: '🗓️', reward: 35, tier: 'gold', condition: function() { return streak >= 15; } },
        { id: 'gold_6', name: '宠物大师', desc: '任意宠物升至10级', icon: '🦁', reward: 30, tier: 'gold', condition: function() { return hasPetLevel(10); } },
        { id: 'gold_7', name: '探险家', desc: '野外探险100次', icon: '🗺️', reward: 30, tier: 'gold', condition: function() { return totalExplorations >= 100; } }
    ],
    
    // 铂金级 - 专家挑战 (6个)
    platinum: [
        { id: 'platinum_1', name: '全关卡征服者', desc: '通关全部30个关卡(含进阶)', icon: '🏰', reward: 50, tier: 'platinum', condition: function() { return completedLevels >= 30; } },
        { id: 'platinum_2', name: '百战百胜', desc: '累计赢得100场战斗', icon: '⚡', reward: 50, tier: 'platinum', condition: function() { return battleWins >= 100; } },
        { id: 'platinum_3', name: '富豪之路', desc: '拥有3000金币', icon: '💵', reward: 50, tier: 'platinum', condition: function() { return coins >= 3000; } },
        { id: 'platinum_4', name: '完美传奇', desc: '累计25次完美通关', icon: '👑', reward: 55, tier: 'platinum', condition: function() { return perfectLevels >= 25; } },
        { id: 'platinum_5', name: '月度坚持', desc: '连续打卡30天', icon: '📅', reward: 55, tier: 'platinum', condition: function() { return streak >= 30; } },
        { id: 'platinum_6', name: '宠物王者', desc: '任意宠物升至15级', icon: '🐉', reward: 50, tier: 'platinum', condition: function() { return hasPetLevel(15); } }
    ],
    
    // 钻石级 - 大师挑战 (6个)
    diamond: [
        { id: 'diamond_1', name: '终极征服者', desc: '通关全部50个关卡', icon: '🏆', reward: 80, tier: 'diamond', condition: function() { return completedLevels >= 50; } },
        { id: 'diamond_2', name: '千人斩', desc: '累计赢得500场战斗', icon: '⚔️', reward: 80, tier: 'diamond', condition: function() { return battleWins >= 500; } },
        { id: 'diamond_3', name: '亿万富翁', desc: '拥有10000金币', icon: '💸', reward: 80, tier: 'diamond', condition: function() { return coins >= 10000; } },
        { id: 'diamond_4', name: '完美神话', desc: '累计50次完美通关', icon: '🌟', reward: 85, tier: 'diamond', condition: function() { return perfectLevels >= 50; } },
        { id: 'diamond_5', name: '百日坚持', desc: '连续打卡100天', icon: '🔥', reward: 100, tier: 'diamond', condition: function() { return streak >= 100; } },
        { id: 'diamond_6', name: '全宠大师', desc: '拥有全部6只宠物且都达到10级', icon: '🦄', reward: 100, tier: 'diamond', condition: function() { return allPetsLevel(10); } }
    ],
    
    // 王者级 - 传奇挑战 (5个)
    master: [
        { id: 'master_1', name: '拼音传说', desc: '累计答题10000道正确', icon: '📜', reward: 200, tier: 'master', condition: function() { return totalCorrect >= 10000; } },
        { id: 'master_2', name: '战斗之神', desc: '累计赢得1000场战斗', icon: '👑', reward: 200, tier: 'master', condition: function() { return battleWins >= 1000; } },
        { id: 'master_3', name: '财富神话', desc: '拥有50000金币', icon: '🏦', reward: 200, tier: 'master', condition: function() { return coins >= 50000; } },
        { id: 'master_4', name: '一年坚持', desc: '连续打卡365天', icon: '🗓️', reward: 500, tier: 'master', condition: function() { return streak >= 365; } },
        { id: 'master_5', name: '拼音大师', desc: '获得所有其他38个徽章', icon: '🎓', reward: 1000, tier: 'master', condition: function() { return getUnlockedBadgeCount() >= 38; } }
    ]
};

// 将分层徽章合并为完整数组
var achievements = [];
Object.keys(BADGES_DATA).forEach(function(tier) {
    BADGES_DATA[tier].forEach(function(badge) {
        achievements.push({
            id: badge.id,
            name: badge.name,
            desc: badge.desc,
            icon: badge.icon,
            reward: badge.reward,
            tier: badge.tier,
            condition: badge.condition,
            unlocked: false,
            unlockDate: null
        });
    });
});

// 辅助函数
var totalCheckInDays = 0;  // 累计打卡天数
var basicTutorialCompleted = false;  // 基础教学完成
var totalItemsBought = 0;  // 累计购买商品数
var dailyBattleStreak = 0;  // 单日连胜次数
var totalExplorations = 0;  // 累计探险次数

// 检查是否有宠物达到指定等级
function hasPetLevel(level) {
    for (var petId in pets.list) {
        if (pets.list[petId].level >= level) return true;
    }
    return false;
}

// 检查是否所有宠物都达到指定等级
function allPetsLevel(level) {
    if (pets.owned.length < 6) return false;
    for (var i = 0; i < pets.owned.length; i++) {
        var petId = pets.owned[i];
        if (pets.list[petId].level < level) return false;
    }
    return true;
}

// 获取已解锁徽章数量
function getUnlockedBadgeCount() {
    return achievements.filter(function(a) { return a.unlocked; }).length;
}

// 徽章解锁检查（带防重复弹窗）
var recentlyUnlocked = [];
function checkAchievements() {
    var newUnlocks = [];
    achievements.forEach(function(ach) {
        if (!ach.unlocked && ach.condition()) {
            ach.unlocked = true;
            ach.unlockDate = new Date().toISOString();
            coins += ach.reward;
            
            // 防止同一成就短时间内重复弹窗
            if (recentlyUnlocked.indexOf(ach.id) === -1) {
                newUnlocks.push(ach);
                recentlyUnlocked.push(ach.id);
            }
        }
    });
    
    // 批量显示解锁成就（延迟依次显示，避免弹窗轰炸）
    newUnlocks.forEach(function(ach, index) {
        setTimeout(function() {
            showAchievementPopup(ach);
        }, index * 1500);
    });
    
    // 10秒后清空已显示列表
    setTimeout(function() {
        recentlyUnlocked = [];
    }, 10000);
    
    saveData();
    updateAchievementUI();
}

// 成就弹窗
function showAchievementPopup(ach) {
    var tierColors = {
        bronze: '#CD7F32',
        silver: '#C0C0C0', 
        gold: '#FFD700',
        platinum: '#E5E4E2',
        diamond: '#00CED1',
        master: '#FF4500'
    };
    
    var popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,' + tierColors[ach.tier] + ',#fff);padding:30px 50px;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:9999;text-align:center;animation:achievementPop 0.5s ease;';
    popup.innerHTML = '<div style="font-size:60px;margin-bottom:10px;">' + ach.icon + '</div><div style="font-size:24px;font-weight:bold;color:#333;">🏆 解锁成就</div><div style="font-size:20px;margin:10px 0;">' + ach.name + '</div><div style="font-size:14px;color:#666;">' + ach.desc + '</div><div style="font-size:18px;color:#ff6b35;margin-top:10px;">+' + ach.reward + '金币</div>';
    
    document.body.appendChild(popup);
    
    setTimeout(function() {
        popup.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(function() { popup.remove(); }, 500);
    }, 3000);
}

// 更新成就UI
function updateAchievementUI() {
    var countEl = document.getElementById('achievementCount');
    var totalEl = document.getElementById('totalAchievements');
    var myAchEl = document.getElementById('myAchievements');
    var totalDisplayEl = document.getElementById('totalAchievementsDisplay');
    
    var unlocked = getUnlockedBadgeCount();
    var total = achievements.length;
    
    if (countEl) countEl.textContent = unlocked;
    if (totalEl) totalEl.textContent = total;
    if (myAchEl) myAchEl.textContent = unlocked;
    if (totalDisplayEl) totalDisplayEl.textContent = total;
}

// 渲染成就列表（按等级分组显示）
function renderAchievements() {
    var container = document.getElementById('achievementsList');
    if (!container) return;
    
    var tierNames = {
        bronze: { name: '🥉 青铜徽章', color: '#CD7F32' },
        silver: { name: '🥈 白银徽章', color: '#C0C0C0' },
        gold: { name: '🥇 黄金徽章', color: '#FFD700' },
        platinum: { name: '💎 铂金徽章', color: '#E5E4E2' },
        diamond: { name: '💠 钻石徽章', color: '#00CED1' },
        master: { name: '👑 王者徽章', color: '#FF4500' }
    };
    
    var html = '';
    Object.keys(BADGES_DATA).forEach(function(tier) {
        var tierInfo = tierNames[tier];
        var badges = BADGES_DATA[tier];
        var unlockedCount = badges.filter(function(b) { 
            var ach = achievements.find(function(a) { return a.id === b.id; });
            return ach && ach.unlocked;
        }).length;
        
        html += '<div style="margin:20px 0;">';
        html += '<div style="background:' + tierInfo.color + ';color:white;padding:10px 15px;border-radius:10px;font-weight:bold;font-size:16px;display:flex;justify-content:space-between;">';
        html += '<span>' + tierInfo.name + '</span>';
        html += '<span>' + unlockedCount + '/' + badges.length + '</span>';
        html += '</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:10px;">';
        
        badges.forEach(function(badge) {
            var ach = achievements.find(function(a) { return a.id === badge.id; });
            var isUnlocked = ach && ach.unlocked;
            var opacity = isUnlocked ? '1' : '0.4';
            var bg = isUnlocked ? 'linear-gradient(135deg,' + tierInfo.color + '20,#fff)' : '#f0f0f0';
            
            html += '<div style="background:' + bg + ';padding:15px;border-radius:12px;text-align:center;opacity:' + opacity + ';border:2px solid ' + (isUnlocked ? tierInfo.color : '#ddd') + ';">';
            html += '<div style="font-size:40px;">' + (isUnlocked ? badge.icon : '🔒') + '</div>';
            html += '<div style="font-weight:bold;font-size:13px;margin:5px 0;">' + badge.name + '</div>';
            html += '<div style="font-size:11px;color:#666;">' + badge.desc + '</div>';
            if (isUnlocked) {
                html += '<div style="font-size:12px;color:#ff6b35;margin-top:5px;">+' + badge.reward + '金币</div>';
            }
            html += '</div>';
        });
        
        html += '</div></div>';
    });
    
    container.innerHTML = html;
}

// CSS动画
var style = document.createElement('style');
style.textContent = `
    @keyframes achievementPop {
        0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
        50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
        100% { transform: translateX(-50%) scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// 导出
window.BADGES_DATA = BADGES_DATA;
window.initBadgeSystem = initBadgeSystem;
window.createFreshBadges = createFreshBadges;
window.migrateOldBadges = migrateOldBadges;
window.checkAchievements = checkAchievements;
window.renderAchievements = renderAchievements;
window.getUnlockedBadgeCount = getUnlockedBadgeCount;
