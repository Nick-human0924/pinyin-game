#!/usr/bin/env python3
"""
阿里通义万相 - 异步图像生成
API Key: sk-7a9411d7ea414ed5851dc44b4e05d9b5
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

API_KEY = "sk-7a9411d7ea414ed5851dc44b4e05d9b5"
BASE_URL = "https://dashscope.aliyuncs.com/api/v1"

# 简化版 - 先生成1张测试
IMAGES = [
    {
        "name": "panda_hero",
        "prompt": "A cute cartoon panda holding a pinyin flashcard, friendly smile, round body, big eyes, children's game character, colorful, transparent background, white background, high quality",
        "size": "1024*1024"
    }
]

def submit_task(prompt, size):
    """提交异步任务"""
    url = f"{BASE_URL}/services/aigc/text2image/image-synthesis"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "wanx2.1-t2i-turbo",
        "input": {"prompt": prompt},
        "parameters": {"size": size, "n": 1}
    }
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        data = resp.json()
        if resp.status_code == 200:
            return data.get("output", {}).get("task_id")
        else:
            print(f"提交失败: {data}")
            return None
    except Exception as e:
        print(f"错误: {e}")
        return None

def check_task(task_id):
    """查询任务状态"""
    url = f"{BASE_URL}/tasks/{task_id}"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        return resp.json()
    except Exception as e:
        print(f"查询错误: {e}")
        return None

def download(url, path):
    """下载图像"""
    try:
        resp = requests.get(url, timeout=60)
        if resp.status_code == 200:
            with open(path, 'wb') as f:
                f.write(resp.content)
            return True
    except Exception as e:
        print(f"下载错误: {e}")
    return False

def main():
    output_dir = Path("images/ai_generated")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for img in IMAGES:
        print(f"\n🎨 生成: {img['name']}")
        
        # 提交任务
        task_id = submit_task(img['prompt'], img['size'])
        if not task_id:
            continue
        
        print(f"任务ID: {task_id}")
        
        # 轮询等待
        for i in range(30):
            time.sleep(2)
            result = check_task(task_id)
            
            if not result:
                continue
            
            status = result.get("output", {}).get("task_status", "UNKNOWN")
            print(f"  状态: {status} ({i+1}/30)")
            
            if status == "SUCCEEDED":
                url = result.get("output", {}).get("results", [{}])[0].get("url")
                if url:
                    path = output_dir / f"{img['name']}.png"
                    if download(url, path):
                        print(f"✅ 已保存: {path}")
                    else:
                        print(f"❌ 下载失败")
                break
            elif status == "FAILED":
                print(f"❌ 任务失败")
                break
        else:
            print(f"⏱️ 超时")

if __name__ == "__main__":
    main()
