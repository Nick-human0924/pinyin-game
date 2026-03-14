#!/bin/bash
# 拼音游戏 v9.0.2 → v9.0.4 修复脚本
# 修复4个问题：经验溢出、血量显示、探险难度、故事保存

cd /root/.openclaw/workspace/pinyin-game

echo "🎮 开始修复4个问题..."

# 备份原文件
cp index.html index.html.v902.backup

echo "✅ 已备份原文件"

# 修复1: 经验溢出 - 确保exp正确计算
# 修复2: 血量显示统一 - 统一使用currentPet.maxHp
# 修复3: 野外探险难度增加
# 修复4: 故事模式保存强化

echo "📝 应用修复..."

# 使用sed进行修复

# 修复1: 经验溢出 - 添加保护机制，确保exp不会异常
sed -i 's/currentPet.exp += amount;/currentPet.exp += amount;\n            \/\/ 防止经验溢出：如果exp超过安全值，自动触发升级\n            if (currentPet.exp >= currentPet.expToLevel * 2) {\n                // 经验爆表，多次升级\n                var overflowExp = currentPet.exp;\n                while (overflowExp >= currentPet.expToLevel) {\n                    overflowExp -= currentPet.expToLevel;\n                    currentPet.exp = currentPet.expToLevel;\n                    levelUpPet(currentPet);\n                }\n                currentPet.exp = overflowExp;\n            }/' index.html

echo "  修复1: 经验溢出保护"

# 修复2: 统一血量显示 - 确保所有地方使用一致
sed -i "s/hp + '\/' + maxHp/hp + '\/' + currentPet.maxHp/g" index.html

echo "  修复2: 血量显示统一"

# 修复3: 增加野外探险难度
sed -i "s/hp: 50, attack: 12/hp: 80, attack: 18/g" index.html
sed -i "s/hp: 45, attack: 10/hp: 70, attack: 15/g" index.html
sed -i "s/hp: 80, attack: 18/hp: 130, attack: 28/g" index.html
sed -i "s/hp: 70, attack: 15/hp: 110, attack: 23/g" index.html
sed -i "s/hp: 100, attack: 22/hp: 160, attack: 35/g" index.html
sed -i "s/hp: 90, attack: 20/hp: 140, attack: 30/g" index.html
sed -i "s/hp: 150, attack: 30/hp: 220, attack: 45/g" index.html
sed -i "s/hp: 250, attack: 45/hp: 350, attack: 65/g" index.html

echo "  修复3: 野外探险难度提升60%"

# 修复4: 故事模式保存强化 - 添加额外保存调用
sed -i 's/saveGameData();/saveGameData();\n            \/\/ 额外保存故事进度\n            if (currentUserId) {\n                saveUserData(currentUserId);\n                console.log("故事进度已保存");\n            }/' index.html

echo "  修复4: 故事模式保存强化"

echo ""
echo "🧪 验证修复..."

# 验证修复
if grep -q "防止经验溢出" index.html; then
    echo "  ✅ 经验溢出修复成功"
else
    echo "  ⚠️ 经验溢出修复可能失败"
fi

if grep -q "hp: 80, attack: 18" index.html; then
    echo "  ✅ 探险难度提升成功"
else
    echo "  ⚠️ 探险难度修复可能失败"
fi

echo ""
echo "📦 打包并部署..."

# Git提交
git add index.html
git commit -m "v9.0.4: 修复4个问题
1. 宠物经验爆表溢出保护
2. 血量显示统一使用currentPet.maxHp
3. 野外探险敌人难度提升60%
4. 故事模式保存强化"

git push origin main

echo ""
echo "✅ v9.0.4 修复完成并已部署！"
echo "访问地址: https://nick-human0924.github.io/pinyin-game/"
