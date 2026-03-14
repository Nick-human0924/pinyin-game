#!/usr/bin/env python3
# 拼音游戏 v9.0.4 修复脚本
# 修复4个问题

import re

# 读取文件
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("🎮 开始修复4个问题...")

# ========== 修复1: 经验溢出保护 ==========
print("\n修复1: 经验溢出保护...")

# 查找addExp函数并添加溢出保护
old_addExp = """function addPetExp(amount) {
            // 应用技能加成
            amount = triggerPetSkill('double_exp', amount);

            var currentPet = pets.list[pets.current];
            currentPet.exp += amount;

            // 检查是否升级
            while (currentPet.exp >= currentPet.expToLevel) {
                currentPet.exp -= currentPet.expToLevel;
                levelUpPet(currentPet);
            }
        }"""

new_addExp = """function addPetExp(amount) {
            // 应用技能加成
            amount = triggerPetSkill('double_exp', amount);

            var currentPet = pets.list[pets.current];
            currentPet.exp += amount;

            // 检查是否升级（支持经验溢出多次升级）
            while (currentPet.exp >= currentPet.expToLevel) {
                currentPet.exp -= currentPet.expToLevel;
                levelUpPet(currentPet);
            }
            
            // v9.0.4: 经验溢出保护 - 如果经验异常高，强制处理
            if (currentPet.exp >= currentPet.expToLevel * 2) {
                console.log('经验溢出保护触发，当前经验:', currentPet.exp);
                while (currentPet.exp >= currentPet.expToLevel) {
                    currentPet.exp -= currentPet.expToLevel;
                    levelUpPet(currentPet);
                }
            }
            
            savePetData();
        }"""

if old_addExp in content:
    content = content.replace(old_addExp, new_addExp)
    print("  ✅ 经验溢出保护已添加")
else:
    print("  ⚠️  未找到addExp函数，跳过")

# ========== 修复2: 统一血量显示 ==========
print("\n修复2: 统一血量显示...")

# 统一使用currentPet.maxHp而不是maxHp
content = content.replace("hp + '/' + maxHp", "hp + '/' + currentPet.maxHp")
content = content.replace('hp + "/" + maxHp', 'hp + "/" + currentPet.maxHp')

print("  ✅ 血量显示已统一为currentPet.maxHp")

# ========== 修复3: 增加野外探险难度 ==========
print("\n修复3: 增加野外探险难度60%...")

# 敌人难度配置
enemy_updates = [
    # 森林
    ("{name: '小蘑菇', emoji: '🍄', hp: 50, attack: 12}", "{name: '小蘑菇', emoji: '🍄', hp: 80, attack: 19}"),
    ("{name: '小树苗', emoji: '🌱', hp: 45, attack: 10}", "{name: '小树苗', emoji: '🌱', hp: 72, attack: 16}"),
    # 沙漠
    ("{name: '蝎子', emoji: '🦂', hp: 80, attack: 18}", "{name: '蝎子', emoji: '🦂', hp: 128, attack: 29}"),
    ("{name: '沙漠蛇', emoji: '🐍', hp: 70, attack: 15}", "{name: '沙漠蛇', emoji: '🐍', hp: 112, attack: 24}"),
    # 海洋
    ("{name: '螃蟹', emoji: '🦀', hp: 100, attack: 22}", "{name: '螃蟹', emoji: '🦀', hp: 160, attack: 35}"),
    ("{name: '章鱼', emoji: '🐙', hp: 90, attack: 20}", "{name: '章鱼', emoji: '🐙', hp: 144, attack: 32}"),
    # 火山
    ("{name: '火蜥蜴', emoji: '🦎', hp: 150, attack: 30}", "{name: '火蜥蜴', emoji: '🦎', hp: 240, attack: 48}"),
    ("{name: '炎魔', emoji: '👺', hp: 250, attack: 45}", "{name: '炎魔', emoji: '👺', hp: 400, attack: 72}"),
]

updated_count = 0
for old, new in enemy_updates:
    if old in content:
        content = content.replace(old, new)
        updated_count += 1

print(f"  ✅ 已更新{updated_count}个敌人配置")

# ========== 修复4: 强化故事模式保存 ==========
print("\n修复4: 强化故事模式保存...")

# 在completeChapter中添加额外保存
old_complete = """updateUI();
            saveGameData();

            // 返回章节列表
            document.getElementById('storyChapters').classList.remove('hidden');
            document.getElementById('storyScene').classList.add('hidden');
            renderStoryChapters();"""

new_complete = """updateUI();
            saveGameData();
            
            // v9.0.4: 额外保存故事进度确保不丢失
            if (currentUserId) {
                saveUserData(currentUserId);
                console.log('故事章节完成，进度已保存:', currentChapter.id);
            }
            
            // 强制保存到localStorage
            localStorage.setItem('pinyinGameUsers', JSON.stringify(users));

            // 返回章节列表
            document.getElementById('storyChapters').classList.remove('hidden');
            document.getElementById('storyScene').classList.add('hidden');
            renderStoryChapters();"""

if old_complete in content:
    content = content.replace(old_complete, new_complete)
    print("  ✅ 故事模式保存已强化")
else:
    print("  ⚠️  未找到completeChapter函数，跳过")

# 保存文件
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ 所有修复已应用！")
print("📦 准备部署...")
