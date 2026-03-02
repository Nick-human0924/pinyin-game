#!/bin/bash
# 拼音游戏 - GitHub上传脚本
# 使用方法：在pinyin-game目录下执行此脚本

echo "========================================"
echo "拼音大冒险 - GitHub部署脚本"
echo "========================================"
echo ""

# 检查git
if ! command -v git &> /dev/null; then
    echo "错误：未安装git"
    echo "请执行: apt-get install git 或 yum install git"
    exit 1
fi

# 配置信息
REPO_NAME="pinyin-game"
GITHUB_USER="您的GitHub用户名"

echo "步骤1: 初始化Git仓库"
git init

echo ""
echo "步骤2: 添加所有文件"
git add .

echo ""
echo "步骤3: 提交更改"
git commit -m "初始提交：拼音大冒险游戏"

echo ""
echo "步骤4: 创建main分支"
git branch -M main

echo ""
echo "步骤5: 添加远程仓库"
echo "请先创建GitHub仓库: https://github.com/new"
echo "仓库名称: $REPO_NAME"
echo ""
read -p "请输入您的GitHub用户名: " GITHUB_USER
read -p "请输入GitHub Token (用于认证): " GITHUB_TOKEN

git remote add origin "https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "步骤6: 推送到GitHub"
git push -u origin main

echo ""
echo "========================================"
echo "上传完成！"
echo "========================================"
echo ""
echo "启用GitHub Pages:"
echo "1. 访问: https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
echo "2. Source 选择 'Deploy from a branch'"
echo "3. Branch 选择 'main' / '/ (root)'"
echo "4. 点击 Save"
echo ""
echo "等待1-2分钟后访问:"
echo "https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
