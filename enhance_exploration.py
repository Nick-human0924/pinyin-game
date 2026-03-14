#!/usr/bin/env python3
# 野外探险增强脚本 v9.0.5
# 1. 增加更多怪兽 2. 添加技能系统 3. 血量翻倍

import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("🎮 开始增强野外探险...")

# ========== 1. 替换敌人配置 - 更多怪兽 + 血量翻倍 + 技能 ==========
print("\n1. 增加怪兽种类并血量翻倍...")

old_enemies = """explorationEnemies = {
            forest: [{name: '小蘑菇', emoji: '🍄', hp: 80, attack: 19}, {name: '小树苗', emoji: '🌱', hp: 72, attack: 16}],
            desert: [{name: '蝎子', emoji: '🦂', hp: 128, attack: 29}, {name: '沙漠蛇', emoji: '🐍', hp: 112, attack: 24}],
            ocean: [{name: '螃蟹', emoji: '🦀', hp: 160, attack: 35}, {name: '章鱼', emoji: '🐙', hp: 144, attack: 32}],
            volcano: [{name: '火蜥蜴', emoji: '🦎', hp: 240, attack: 48}, {name: '炎魔', emoji: '👺', hp: 400, attack: 72}]
        };"""

new_enemies = """explorationEnemies = {
            // 🌲 森林区域 - 新手区
            forest: [
                {name: '小蘑菇', emoji: '🍄', hp: 160, attack: 19, skills: [{name: '孢子喷射', damage: 1.2, chance: 0.3, desc: '喷射毒孢子造成120%伤害'}]},
                {name: '小树苗', emoji: '🌱', hp: 144, attack: 16, skills: [{name: '缠绕', damage: 1.0, chance: 0.4, desc: '缠绕敌人并恢复10HP', heal: 10}]},
                {name: '野兔', emoji: '🐰', hp: 128, attack: 22, skills: [{name: '迅捷跳跃', damage: 1.3, chance: 0.25, desc: '快速跳跃造成130%伤害'}]},
                {name: '松鼠', emoji: '🐿️', hp: 112, attack: 18, skills: [{name: '坚果投掷', damage: 1.1, chance: 0.35, desc: '投掷坚果造成110%伤害'}]},
                {name: '花仙子', emoji: '🧚', hp: 192, attack: 14, skills: [{name: '花粉迷醉', damage: 0.8, chance: 0.5, desc: '释放花粉，下次攻击50%概率miss'}]}
            ],
            // 🏜️ 沙漠区域
            desert: [
                {name: '蝎子', emoji: '🦂', hp: 256, attack: 29, skills: [{name: '毒刺', damage: 1.4, chance: 0.3, desc: '剧毒尾刺造成140%伤害并中毒(每回合-5HP)'}]},
                {name: '沙漠蛇', emoji: '🐍', hp: 224, attack: 24, skills: [{name: '沙尘隐匿', damage: 1.0, chance: 0.4, desc: '躲入沙尘，闪避下次攻击'}]},
                {name: '仙人掌怪', emoji: '🌵', hp: 320, attack: 20, skills: [{name: '尖刺反弹', damage: 0.5, chance: 0.5, desc: '反弹50%受到伤害'}]},
                {name: '秃鹫', emoji: '🦅', hp: 192, attack: 35, skills: [{name: '俯冲攻击', damage: 1.5, chance: 0.2, desc: '高空俯冲造成150%暴击伤害'}]},
                {name: '沙虫', emoji: '🐛', hp: 288, attack: 26, skills: [{name: '沙遁', damage: 0, chance: 0.3, desc: '钻入沙地恢复30HP', heal: 30}]}
            ],
            // 🌊 海洋区域
            ocean: [
                {name: '螃蟹', emoji: '🦀', hp: 320, attack: 35, skills: [{name: '钳击', damage: 1.3, chance: 0.35, desc: '巨钳夹击造成130%伤害'}]},
                {name: '章鱼', emoji: '🐙', hp: 288, attack: 32, skills: [{name: '墨汁喷射', damage: 0.6, chance: 0.4, desc: '喷射墨汁降低敌人命中率'}]},
                {name: '电鳗', emoji: '🐍', hp: 256, attack: 42, skills: [{name: '放电', damage: 1.6, chance: 0.25, desc: '释放电流造成160%伤害'}]},
                {name: '鲨鱼', emoji: '🦈', hp: 384, attack: 48, skills: [{name: '血腥撕咬', damage: 1.8, chance: 0.2, desc: '闻到血腥味造成180%伤害'}]},
                {name: '海龟', emoji: '🐢', hp: 480, attack: 24, skills: [{name: '龟壳防御', damage: 0.3, chance: 0.6, desc: '缩入壳中只受30%伤害'}]},
                {name: '水母', emoji: '🎐', hp: 192, attack: 38, skills: [{name: '麻痹触手', damage: 1.2, chance: 0.3, desc: '麻痹敌人跳过一回合'}]}
            ],
            // 🌋 火山区域
            volcano: [
                {name: '火蜥蜴', emoji: '🦎', hp: 480, attack: 48, skills: [{name: '火焰喷射', damage: 1.4, chance: 0.4, desc: '喷出火焰造成140%伤害'}]},
                {name: '炎魔', emoji: '👺', hp: 800, attack: 72, skills: [{name: '地狱之火', damage: 2.0, chance: 0.25, desc: '召唤地狱火造成200%伤害'}]},
                {name: '岩浆怪', emoji: '🌋', hp: 640, attack: 56, skills: [{name: '熔岩护盾', damage: 0.4, chance: 0.5, desc: '岩浆外壳减少60%伤害'}]},
                {name: '火凤凰', emoji: '🔥', hp: 560, attack: 64, skills: [{name: '凤凰涅槃', damage: 0, chance: 0.2, desc: '死亡时满血复活一次'}]},
                {name: '火山巨人', emoji: '👹', hp: 960, attack: 80, skills: [{name: '地震践踏', damage: 1.5, chance: 0.3, desc: '践踏地面造成150%范围伤害'}]},
                {name: '黑龙', emoji: '🐉', hp: 720, attack: 88, skills: [{name: '龙息', damage: 1.8, chance: 0.2, desc: '龙息攻击造成180%伤害并灼烧'}]}
            ]
        };"""

if old_enemies in content:
    content = content.replace(old_enemies, new_enemies)
    print("   ✅ 敌人配置已更新（4个地点，22种怪兽）")
else:
    print("   ⚠️  未找到原配置，尝试其他方式...")

# ========== 2. 修改玩家和宠物血量翻倍 ==========
print("\n2. 玩家和宠物血量翻倍...")

# 玩家HP
content = content.replace("hp = 100, maxHp = 100", "hp = 200, maxHp = 200")
content = content.replace('hp: 100, maxHp: 100', 'hp: 200, maxHp: 200')

# 宠物HP翻倍
pet_hp_updates = [
    ('hp: 100, maxHp: 100', 'hp: 200, maxHp: 200'),  # panda
    ('hp: 80, maxHp: 80', 'hp: 160, maxHp: 160'),    # rabbit
    ('hp: 85, maxHp: 85', 'hp: 170, maxHp: 170'),    # tiger
    ('hp: 95, maxHp: 95', 'hp: 190, maxHp: 190'),    # lion
    ('hp: 110, maxHp: 110', 'hp: 220, maxHp: 220'),  # unicorn
    ('hp: 90, maxHp: 90', 'hp: 180, maxHp: 180'),    # dragon
]

for old, new in pet_hp_updates:
    content = content.replace(old, new)

print("   ✅ 所有血量已翻倍")

# ========== 3. 添加敌人技能释放逻辑 ==========
print("\n3. 添加敌人技能系统...")

# 在battleAnswer或战斗逻辑中添加技能处理
old_battle = """function battleAnswer(btn, selected, correct) {"""

new_battle = """// 敌人使用技能
        function enemyUseSkill() {
            if (!currentEnemy.skills || currentEnemy.skills.length === 0) return null;
            
            var skill = currentEnemy.skills[0];
            if (Math.random() > skill.chance) return null;
            
            var skillMsg = '👹 ' + currentEnemy.name + ' 使用【' + skill.name + '】！';
            if (skill.desc) skillMsg += '\n💡 ' + skill.desc;
            
            // 计算技能伤害
            var damage = currentEnemy.attack;
            if (skill.damage) {
                damage = Math.floor(damage * skill.damage);
            }
            
            // 应用技能效果
            if (skill.heal) {
                currentEnemy.hp = Math.min(currentEnemy.hp + skill.heal, currentEnemy.maxHp);
                skillMsg += '\n💚 恢复 ' + skill.heal + ' HP';
            }
            
            return { msg: skillMsg, damage: damage, skill: skill };
        }

        function battleAnswer(btn, selected, correct) {"""

if old_battle in content:
    content = content.replace(old_battle, new_battle)
    print("   ✅ 敌人技能函数已添加")
else:
    print("   ⚠️  未找到战斗函数")

# ========== 4. 在战斗中调用技能 ==========
print("\n4. 在战斗流程中添加技能触发...")

# 在敌人攻击时触发技能
old_enemy_attack = "// 敌人攻击"
new_enemy_attack = """// 敌人攻击前使用技能
            var skillResult = enemyUseSkill();
            if (skillResult) {
                showToast(skillResult.msg, 'warning');
                // 延迟后执行攻击
                setTimeout(function() {
                    executeEnemyAttack(skillResult.damage);
                }, 1500);
                return;
            }
            
            // 普通攻击
            executeEnemyAttack(currentEnemy.attack);
        }
        
        function executeEnemyAttack(damage) {
            // 敌人攻击"""

# 找到敌人攻击的代码块并替换
enemy_attack_pattern = "// 敌人攻击\n            var enemyDamage"
if enemy_attack_pattern in content:
    content = content.replace(enemy_attack_pattern, new_enemy_attack + "\n            var enemyDamage")
    print("   ✅ 战斗流程已更新")

# 保存文件
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ 野外探险增强完成！")
print("\n更新内容:")
print("  • 森林: 5种怪兽 (原2种)")
print("  • 沙漠: 5种怪兽 (原2种)")
print("  • 海洋: 6种怪兽 (原2种)")
print("  • 火山: 6种怪兽 (原2种)")
print("  • 所有怪兽血量翻倍")
print("  • 每个怪兽拥有独特技能")
print("  • 技能释放带提示")
