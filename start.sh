#!/bin/bash

# 拼音大冒险启动脚本
# 在本地启动一个HTTP服务器用于测试

echo "🎮 启动拼音大冒险..."
echo ""

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    echo "使用 Python 3 启动服务器..."
    cd "$(dirname "$0")"
    python3 -m http.server 8080 &
    SERVER_PID=$!
elif command -v python &> /dev/null; then
    echo "使用 Python 2 启动服务器..."
    cd "$(dirname "$0")"
    python -m SimpleHTTPServer 8080 &
    SERVER_PID=$!
else
    echo "❌ 未找到 Python，请手动安装或使用其他HTTP服务器"
    exit 1
fi

echo ""
echo "✅ 服务器已启动！"
echo "🌐 请在浏览器中访问: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 等待用户中断
trap "kill $SERVER_PID 2>/dev/null; echo '服务器已停止'; exit" INT
wait
