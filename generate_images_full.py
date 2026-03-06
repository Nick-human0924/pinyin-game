#!/usr/bin/env python3
"""
阿里通义万相/千问图像生成脚本 - 完整版
用于为拼音游戏生成视觉元素

API Key: sk-7a9411d7ea414ed5851dc44b4e05d9b5
"""

import os
import sys
import requests
import json
import time
from pathlib import Path
from urllib.parse import urlparse, unquote

# API配置
API_KEY = "sk-7a9411d7ea414ed5851dc44b4e05d9b5"
BASE_URL = "https://dashscope.aliyuncs.com/api/v1"

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

def submit_task(prompt, size, model):
    """提交图像生成任务"""
    url = f"{BASE_URL}/services/aigc/text2image/image-synthesis"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
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
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        if response.status_code == 200:
            result = response.json()
            if result.get("output") and result["output"].get("task_id"):
                return result["output"]["task_id"]
            else:
                print(f"❌ 未获取到task_id: {result}")
                return None
        else:
            print(f"❌ 提交失败: {response.status_code}")
            print(f"响应: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 提交任务出错: {e}")
        return None

def check_task(task_id):
    """查询任务状态"""
    url = f"{BASE_URL}/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            print(f"❌ 查询失败: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ 查询任务出错: {e}")
        return None

def download_image(url, output_path):
    """下载图像"""
    try:
        response = requests.get(url, timeout=60)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"❌ 下载失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 下载出错: {e}")
        return False

def generate_single_image(config, output_dir):
    """生成单张图像"""
    name = config["name"]
    prompt = config["prompt"]
    size = config["size"]
    model = config["model"]
    
    print(f"\n🎨 正在生成: {name}")
    print(f"   提示词: {prompt[:50]}...")
    
    # 1. 提交任务
    task_id = submit_task(prompt, size, model)
    if not task_id:
        print(f"❌ {name}: 提交任务失败")
        return False
    
    print(f"   任务ID: {task_id}")
    
    # 2. 轮询等待结果
    max_retries = 30
    retry_interval = 2
    
    for i in range(max_retries):
        time.sleep(retry_interval)
        result = check_task(task_id)
        
        if not result:
            continue
        
        status = result.get("output", {}).get("task_status", "UNKNOWN")
        print(f"   状态: {status} ({i+1}/{max_retries})")
        
        if status == "SUCCEEDED":
            # 获取图像URL
            results = result.get("output", {}).get("results", [])
            if results and results[0].get("url"):
                image_url = results[0]["url"]
                output_path = output_dir / f"{name}.png"
                
                if download_image(image_url, output_path):
                    print(f"✅ {name}: 已保存到 {output_path}")
                    return True
                else:
                    print(f"❌ {name}: 下载图像失败")
                    return False
            else:
                print(f"❌ {name}: 未找到图像URL")
                return False
        
        elif status == "FAILED":
            print(f"❌ {name}: 任务失败")
            return False
    
    print(f"❌ {name}: 超时")
    return False

def main():
    """主函数"""
    print("=" * 60)
    print("🎨 拼音大冒险 - AI图像生成 (通义万相)")
    print("=" * 60)
    
    # 创建输出目录
    output_dir = Path("images/ai_generated")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"输出目录: {output_dir.absolute()}")
    print(f"共需生成: {len(IMAGES_TO_GENERATE)} 张图像")
    print("=" * 60)
    
    success_count = 0
    
    for i, config in enumerate(IMAGES_TO_GENERATE, 1):
        print(f"\n[{i}/{len(IMAGES_TO_GENERATE)}]")
        if generate_single_image(config, output_dir):
            success_count += 1
        
        # 每张图片之间稍作停顿
        if i < len(IMAGES_TO_GENERATE):
            time.sleep(3)
    
    print("\n" + "=" * 60)
    print(f"✅ 生成完成: {success_count}/{len(IMAGES_TO_GENERATE)}")
    print("=" * 60)
    
    if success_count > 0:
        print(f"\n图像已保存到: {output_dir.absolute()}")
        print("\n您可以使用这些图像来美化游戏界面！")

if __name__ == "__main__":
    main()
