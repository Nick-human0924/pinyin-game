#!/bin/bash
# 拼音游戏发布前自检脚本

echo "====================================="
echo "🧪 拼音游戏发布前自检脚本"
echo "====================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# 检查1: 本地文件完整性
echo ""
echo "📋 检查1: 本地文件完整性"
echo "-------------------------------------"

# 检查index.html存在
if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ index.html 存在${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ index.html 不存在${NC}"
    ((FAIL++))
fi

# 检查audio文件夹
if [ -d "audio" ]; then
    AUDIO_COUNT=$(ls audio/*.mp3 2>/dev/null | wc -l)
    if [ $AUDIO_COUNT -ge 200 ]; then
        echo -e "${GREEN}✅ 音频文件充足 (${AUDIO_COUNT}个)${NC}"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️ 音频文件较少 (${AUDIO_COUNT}个)${NC}"
        ((PASS++))
    fi
else
    echo -e "${RED}❌ audio文件夹不存在${NC}"
    ((FAIL++))
fi

# 检查版本号
echo ""
echo "📋 检查2: 版本号"
echo "-------------------------------------"
VERSION=$(grep -o 'v6\.[0-9.]*' index.html | head -1)
if [ ! -z "$VERSION" ]; then
    echo -e "${GREEN}✅ 版本号: ${VERSION}${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ 未找到版本号${NC}"
    ((FAIL++))
fi

# 检查关键函数
echo ""
echo "📋 检查3: 关键JavaScript函数"
echo "-------------------------------------"

FUNCTIONS=("showPage" "speak" "saveGameData" "switchUser" "showUserManager")
for func in "${FUNCTIONS[@]}"; do
    if grep -q "function $func" index.html; then
        echo -e "${GREEN}✅ 函数 $func 存在${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ 函数 $func 不存在${NC}"
        ((FAIL++))
    fi
done

# 检查关键页面元素
echo ""
echo "📋 检查4: 关键页面元素"
echo "-------------------------------------"

ELEMENTS=('id="mainMenu"' 'id="learning"' 'id="levelMap"' 'id="userManager"')
for elem in "${ELEMENTS[@]}"; do
    if grep -q "$elem" index.html; then
        echo -e "${GREEN}✅ 元素 $elem 存在${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ 元素 $elem 不存在${NC}"
        ((FAIL++))
    fi
done

# GitHub推送检查
echo ""
echo "📋 检查5: GitHub推送状态"
echo "-------------------------------------"

# 获取最新commit
LOCAL_COMMIT=$(git rev-parse HEAD 2>/dev/null)
REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null)

if [ "$LOCAL_COMMIT" == "$REMOTE_COMMIT" ]; then
    echo -e "${GREEN}✅ 本地与远程同步${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️ 本地与远程不同步，需要推送${NC}"
    echo "   本地: ${LOCAL_COMMIT:0:7}"
    echo "   远程: ${REMOTE_COMMIT:0:7}"
    ((FAIL++))
fi

# 线上验证
echo ""
echo "📋 检查6: 线上版本验证"
echo "-------------------------------------"

echo "正在检查 https://nick-human0924.github.io/pinyin-game/ ..."
ONLINE_VERSION=$(curl -s https://nick-human0924.github.io/pinyin-game/ 2>/dev/null | grep -o 'v6\.[0-9.]*' | head -1)

if [ ! -z "$ONLINE_VERSION" ]; then
    echo -e "${GREEN}✅ 线上版本可访问: ${ONLINE_VERSION}${NC}"
    if [ "$ONLINE_VERSION" == "$VERSION" ]; then
        echo -e "${GREEN}✅ 线上版本与本地一致${NC}"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️ 线上版本(${ONLINE_VERSION})与本地(${VERSION})不一致${NC}"
        ((PASS++))
    fi
else
    echo -e "${RED}❌ 无法获取线上版本信息${NC}"
    ((FAIL++))
fi

# 总结
echo ""
echo "====================================="
echo "📊 自检结果汇总"
echo "====================================="
echo -e "通过: ${GREEN}${PASS}${NC}"
echo -e "失败: ${RED}${FAIL}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 所有检查通过，可以发布！${NC}"
    exit 0
else
    echo -e "${RED}⚠️ 有 ${FAIL} 项检查未通过，请修复后再发布${NC}"
    exit 1
fi