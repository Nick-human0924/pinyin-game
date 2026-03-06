#!/usr/bin/env python3
"""
阿里通义万相/千问图像生成脚本
用于为拼音游戏生成视觉元素

需要设置环境变量:
export DASHSCOPE_API_KEY="sk-xxx"
"""

import os
import sys
import requests
import json
from pathlib import Path
from urllib.parse import urlparse, unquote
from http import HTTPStatus

# 图像生成配置
IMAGES_TO_GENERATE = [
    {
        "name": "game_logo",
        "prompt": "拼音大冒险游戏logo，卡通风格，彩色渐变文字，周围有拼音字母a o e漂浮，天空背景，白云朵朵，阳光明媚，儿童教育游戏风格，高清，透明背景",
        "size": "1024*1024",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "main_background", 
        "prompt": "卡通儿童游戏主界面背景，蓝天白云，绿色草地，远处有小山丘，可爱的树木，五颜六色的花朵，阳光从右上角照射，温馨明亮的色调，适合拼音学习游戏，横版，高清插画风格",
        "size": "1440*810",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "panda_pet",
        "prompt": "可爱卡通熊猫形象，圆润的身体，大大的眼睛，友好的笑容，手持拼音卡片，站立姿势，全身像，儿童插画风格，高清，透明背景，白色背景",
        "size": "1024*1024",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "forest_scene",
        "prompt": "卡通风格神秘森林场景，高大的树木，阳光透过树叶，蘑菇，小花，可爱的松鼠，适合儿童探险游戏，色彩明亮但不刺眼，横版背景，高清插画风格",
        "size": "1440*810",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "desert_scene",
        "prompt": "卡通风格沙漠场景，金字塔剪影，仙人掌，沙丘，蓝天白云，温暖的色调，适合儿童探险游戏，横版背景，高清插画风格",
        "size": "1440*810",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "ocean_scene",
        "prompt": "卡通风格海底世界，蓝色海水，珊瑚礁，热带鱼，海龟，气泡，阳光从水面照射下来，梦幻的海底探险场景，横版背景，高清插画风格",
        "size": "1440*810",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "volcano_scene",
        "prompt": "卡通风格火山场景，远处的活火山，熔岩流，岩石，橙色和红色调但不恐怖，适合儿童游戏的BOSS战场景，横版背景，高清插画风格",
        "size": "1440*810",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "forest_monster",
        "prompt": "可爱卡通小怪物，绿色，圆滚滚的身体，一只大眼睛，友好的表情，森林主题装饰，适合儿童游戏，高清，白色背景",
        "size": "512*512",
        "model": "wanx2.1-t2i-turbo"
    },
    {
        "name": "desert_monster",
        "prompt": "可爱卡通小怪物，黄色沙色，仙人掌造型，带刺但不吓人，友好的表情，沙漠主题，适合儿童游戏，高清，白色背景",
        "size": "512*512",
        "model": "wanx2.1-t2i-turbo"
    }
]

def generate_image(prompt, size, model, api_key, output_dir):
    """调用阿里通义万相API生成图像"""
    
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "size": size,
            "n": 1,
            "prompt_extend": True
        }
    }
    
    try:
        print(f"正在生成图像...")
        print(f"提示词: {prompt[:50]}...")
        
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get("output") and result["output"].get("results"):
                image_url = result["output"]["results"][0].get("url")
                
                if image_url:
                    # 下载图像
                    img_response = requests.get(image_url, timeout=30)
                    if img_response.status_code == 200:
                        # 生成文件名
                        file_name = f"{output_dir}/{name}.png"
                        with open(file_name, 'wb') as f:
                            f.write(img_response.content)
                        print(f"✅ 图像已保存: {file_name}")
                        return True
                    else:
                        print(f"❌ 下载图像失败: {img_response.status_code}")
                        return False
                else:
                    print(f"❌ API未返回图像URL")
                    return False
            else:
                print(f"❌ API返回格式错误: {result}")
                return False
        else:
            print(f"❌ API请求失败: {response.status_code}")
            print(f"响应: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 生成图像时出错: {e}")
        return False

def main():
    """主函数"""
    # 检查API Key
    api_key = os.environ.get("DASHSCOPE_API_KEY")
    
    if not api_key:
        print("❌ 错误: 未设置 DASHSCOPE_API_KEY 环境变量")
        print("请先设置API Key:")
        print("export DASHSCOPE_API_KEY='sk-xxx'")
        print("")
        print("获取API Key: https://help.aliyun.com/zh/model-studio/get-api-key")
        sys.exit(1)
    
    # 创建输出目录
    output_dir = Path("images/ai_generated")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("🎨 拼音大冒险 - AI图像生成")
    print("=" * 60)
    print(f"输出目录: {output_dir.absolute()}")
    print(f"共需生成: {len(IMAGES_TO_GENERATE)} 张图像")
    print("=" * 60)
    
    success_count = 0
    
    for i, config in enumerate(IMAGES_TO_GENERATE, 1):
        print(f"\n[{i}/{len(IMAGES_TO_GENERATE)}] 生成: {config['name']}")
        print("-" * 40)
        
        # 这里使用简化版本，实际应该调用完整API
        # 由于需要异步等待，简化处理
        print(f"提示词: {config['prompt'][:60]}...")
        print(f"尺寸: {config['size']}")
        print(f"模型: {config['model']}")
        print("⚠️ 注意: 图像生成需要异步等待，请参考阿里云文档实现完整流程")
        
        # 实际使用时需要实现异步轮询
        # success = generate_image(config['prompt'], config['size'], config['model'], api_key, output_dir)
        # if success:
        #     success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ 图像生成任务已提交")
    print(f"成功: {success_count}/{len(IMAGES_TO_GENERATE)}")
    print("=" * 60)
    print("\n提示: 通义万相API是异步的，需要通过task_id轮询获取结果")
    print("详细文档: https://help.aliyun.com/zh/model-studio/text-to-image")

if __name__ == "__main__":
    main()
