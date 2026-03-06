#!/usr/bin/env python3
# 批量生成拼音游戏素材

import requests
import os
import time
from pathlib import Path

API_KEY = "sk-7a9411d7ea414ed5851dc44b4e05d9b5"
OUTPUT_DIR = Path("images/ai_generated")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

IMAGES = [
    ("game_logo", "Chinese pinyin learning game logo, colorful text '拼音大冒险', floating letters a o e, blue sky background, white clouds, sunshine, children's education style, cartoon, high quality", "1024*1024"),
    ("main_bg", "Cartoon children's game background, blue sky with white clouds, green grassland, small hills, cute trees, colorful flowers, sunshine from top right, warm and bright, horizontal layout, children's illustration style", "1440*810"),
    ("forest_bg", "Cartoon mysterious forest scene, tall trees with sunlight through leaves, mushrooms, small flowers, cute squirrel, bright colors for children, horizontal background, children's illustration", "1440*810"),
    ("desert_bg", "Cartoon desert scene with pyramid silhouette, cacti, sand dunes, blue sky and white clouds, warm tones, children's adventure game style, horizontal background", "1440*810"),
    ("ocean_bg", "Cartoon underwater world, blue water, coral reef, tropical fish, sea turtle, bubbles, sunlight from water surface, dreamy underwater adventure, horizontal background", "1440*810"),
    ("volcano_bg", "Cartoon volcano scene with distant active volcano, lava flow, rocks, orange and red tones but not scary, children's game BOSS battle scene, horizontal background", "1440*810"),
]

def generate(name, prompt, size):
    print(f"\n🎨 {name}...")
    
    # 提交任务
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable'
    }
    data = {
        "model": "wanx-v1",
        "input": {"prompt": prompt},
        "parameters": {"size": size, "n": 1}
    }
    
    resp = requests.post(url, headers=headers, json=data, timeout=30)
    result = resp.json()
    
    if resp.status_code != 200 or 'output' not in result:
        print(f"❌ 提交失败: {result}")
        return False
    
    task_id = result['output'].get('task_id')
    print(f"  Task: {task_id}")
    
    # 轮询
    for i in range(30):
        time.sleep(1)
        query = requests.get(
            f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}",
            headers={'Authorization': f'Bearer {API_KEY}'},
            timeout=10
        ).json()
        
        status = query.get('output', {}).get('task_status')
        
        if status == 'SUCCEEDED':
            img_url = query['output']['results'][0]['url']
            img_data = requests.get(img_url, timeout=60).content
            
            output_path = OUTPUT_DIR / f"{name}.png"
            with open(output_path, 'wb') as f:
                f.write(img_data)
            
            print(f"✅ 完成: {output_path}")
            return True
        elif status == 'FAILED':
            print(f"❌ 失败")
            return False
    
    print(f"⏱️ 超时")
    return False

def main():
    print("="*50)
    print("🎮 拼音大冒险 - AI素材生成")
    print("="*50)
    
    success = 0
    for name, prompt, size in IMAGES:
        if generate(name, prompt, size):
            success += 1
        time.sleep(2)  # 避免限流
    
    print(f"\n{'='*50}")
    print(f"✅ 完成: {success}/{len(IMAGES)}")
    print(f"📁 目录: {OUTPUT_DIR.absolute()}")

if __name__ == '__main__':
    main()
