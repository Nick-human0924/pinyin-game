// ============================================
// 拼音大冒险 - 拼音数据
// 包含上海版和人教版拼音内容
// ============================================

const pinyinData = {
    // 上海版拼音数据
    shanghai: {
        name: "上海版",
        levels: [
            {
                id: 1,
                name: "单韵母乐园",
                description: "学习 a o e i u ü",
                items: [
                    { char: "a", word: "阿姨", emoji: "👩" },
                    { char: "o", word: "喔喔", emoji: "🐓" },
                    { char: "e", word: "白鹅", emoji: "🦢" },
                    { char: "i", word: "衣服", emoji: "👕" },
                    { char: "u", word: "乌龟", emoji: "🐢" },
                    { char: "ü", word: "小鱼", emoji: "🐟" }
                ]
            },
            {
                id: 2,
                name: "声母城堡",
                description: "学习 b p m f d t n l",
                items: [
                    { char: "b", word: "波浪", emoji: "🌊" },
                    { char: "p", word: "爬坡", emoji: "⛰️" },
                    { char: "m", word: "摸门", emoji: "🚪" },
                    { char: "f", word: "佛像", emoji: "🧘" },
                    { char: "d", word: "马蹄", emoji: "🐴" },
                    { char: "t", word: "雨伞", emoji: "☂️" },
                    { char: "n", word: "哪吒", emoji: "👶" },
                    { char: "l", word: "快乐", emoji: "😊" }
                ]
            },
            {
                id: 3,
                name: "声母王国",
                description: "学习 g k h j q x",
                items: [
                    { char: "g", word: "鸽子", emoji: "🕊️" },
                    { char: "k", word: "蝌蚪", emoji: "🐸" },
                    { char: "h", word: "喝水", emoji: "💧" },
                    { char: "j", word: "公鸡", emoji: "🐓" },
                    { char: "q", word: "气球", emoji: "🎈" },
                    { char: "x", word: "西瓜", emoji: "🍉" }
                ]
            },
            {
                id: 4,
                name: "声母世界",
                description: "学习 z c s zh ch sh r",
                items: [
                    { char: "z", word: "写字", emoji: "✍️" },
                    { char: "c", word: "刺猬", emoji: "🦔" },
                    { char: "s", word: "蚕丝", emoji: "🧵" },
                    { char: "zh", word: "蜘蛛", emoji: "🕷️" },
                    { char: "ch", word: "吃饭", emoji: "🍚" },
                    { char: "sh", word: "狮子", emoji: "🦁" },
                    { char: "r", word: "红日", emoji: "☀️" }
                ]
            },
            {
                id: 5,
                name: "复韵母天地",
                description: "学习 ai ei ui ao ou iu",
                items: [
                    { char: "ai", word: "白菜", emoji: "🥬" },
                    { char: "ei", word: "梅花", emoji: "🌸" },
                    { char: "ui", word: "围巾", emoji: "🧣" },
                    { char: "ao", word: "棉袄", emoji: "🧥" },
                    { char: "ou", word: "海鸥", emoji: "🐦" },
                    { char: "iu", word: "朋友", emoji: "👫" }
                ]
            },
            {
                id: 6,
                name: "鼻韵母星球",
                description: "学习 an en in un ün ang eng ing ong",
                items: [
                    { char: "an", word: "天安门", emoji: "🏛️" },
                    { char: "en", word: "恩情", emoji: "❤️" },
                    { char: "in", word: "树荫", emoji: "🌳" },
                    { char: "un", word: "白云", emoji: "☁️" },
                    { char: "ün", word: "运动", emoji: "🏃" },
                    { char: "ang", word: "小羊", emoji: "🐑" },
                    { char: "eng", word: "台灯", emoji: "💡" },
                    { char: "ing", word: "老鹰", emoji: "🦅" },
                    { char: "ong", word: "闹钟", emoji: "⏰" }
                ]
            },
            {
                id: 7,
                name: "整体认读岛",
                description: "学习 zhi chi shi ri zi ci si yi wu yu",
                items: [
                    { char: "zhi", word: "蜘蛛", emoji: "🕷️" },
                    { char: "chi", word: "吃饭", emoji: "🍚" },
                    { char: "shi", word: "狮子", emoji: "🦁" },
                    { char: "ri", word: "红日", emoji: "☀️" },
                    { char: "zi", word: "写字", emoji: "✍️" },
                    { char: "ci", word: "刺猬", emoji: "🦔" },
                    { char: "si", word: "蚕丝", emoji: "🧵" },
                    { char: "yi", word: "衣服", emoji: "👕" },
                    { char: "wu", word: "乌龟", emoji: "🐢" },
                    { char: "yu", word: "小鱼", emoji: "🐟" }
                ]
            },
            {
                id: 8,
                name: "整体认读王国",
                description: "学习 ye yue yuan yin yun ying",
                items: [
                    { char: "ye", word: "树叶", emoji: "🍃" },
                    { char: "yue", word: "月亮", emoji: "🌙" },
                    { char: "yuan", word: "公园", emoji: "🏞️" },
                    { char: "yin", word: "树荫", emoji: "🌳" },
                    { char: "yun", word: "白云", emoji: "☁️" },
                    { char: "ying", word: "老鹰", emoji: "🦅" }
                ]
            }
        ]
    },
    
    // 人教版拼音数据
    renjiao: {
        name: "人教版",
        levels: [
            {
                id: 1,
                name: "单韵母",
                description: "a o e i u ü",
                items: [
                    { char: "a", word: "阿姨", emoji: "👩" },
                    { char: "o", word: "公鸡", emoji: "🐓" },
                    { char: "e", word: "白鹅", emoji: "🦢" },
                    { char: "i", word: "衣服", emoji: "👕" },
                    { char: "u", word: "乌鸦", emoji: "🐦‍⬛" },
                    { char: "ü", word: "小鱼", emoji: "🐟" }
                ]
            },
            {
                id: 2,
                name: "声母（一）",
                description: "b p m f",
                items: [
                    { char: "b", word: "广播", emoji: "📻" },
                    { char: "p", word: "爬山", emoji: "⛰️" },
                    { char: "m", word: "摸门", emoji: "🚪" },
                    { char: "f", word: "扶拐", emoji: "🦯" }
                ]
            },
            {
                id: 3,
                name: "声母（二）",
                description: "d t n l",
                items: [
                    { char: "d", word: "马蹄", emoji: "🐴" },
                    { char: "t", word: "雨伞", emoji: "☂️" },
                    { char: "n", word: "门洞", emoji: "🚪" },
                    { char: "l", word: "小棍", emoji: "🪄" }
                ]
            },
            {
                id: 4,
                name: "声母（三）",
                description: "g k h",
                items: [
                    { char: "g", word: "鸽子", emoji: "🕊️" },
                    { char: "k", word: "蝌蚪", emoji: "🐸" },
                    { char: "h", word: "喝水", emoji: "💧" }
                ]
            },
            {
                id: 5,
                name: "声母（四）",
                description: "j q x",
                items: [
                    { char: "j", word: "母鸡", emoji: "🐔" },
                    { char: "q", word: "气球", emoji: "🎈" },
                    { char: "x", word: "西瓜", emoji: "🍉" }
                ]
            },
            {
                id: 6,
                name: "声母（五）",
                description: "z c s",
                items: [
                    { char: "z", word: "写字", emoji: "✍️" },
                    { char: "c", word: "刺猬", emoji: "🦔" },
                    { char: "s", word: "春蚕", emoji: "🐛" }
                ]
            },
            {
                id: 7,
                name: "声母（六）",
                description: "zh ch sh r",
                items: [
                    { char: "zh", word: "织毛衣", emoji: "🧶" },
                    { char: "ch", word: "吃饭", emoji: "🍚" },
                    { char: "sh", word: "狮子", emoji: "🦁" },
                    { char: "r", word: "红日", emoji: "☀️" }
                ]
            },
            {
                id: 8,
                name: "复韵母",
                description: "ai ei ui ao ou iu ie üe er",
                items: [
                    { char: "ai", word: "白菜", emoji: "🥬" },
                    { char: "ei", word: "梅花", emoji: "🌸" },
                    { char: "ui", word: "围巾", emoji: "🧣" },
                    { char: "ao", word: "棉袄", emoji: "🧥" },
                    { char: "ou", word: "海鸥", emoji: "🐦" },
                    { char: "iu", word: "邮票", emoji: "📮" },
                    { char: "ie", word: "椰子", emoji: "🥥" },
                    { char: "üe", word: "月亮", emoji: "🌙" },
                    { char: "er", word: "耳朵", emoji: "👂" }
                ]
            },
            {
                id: 9,
                name: "前鼻韵母",
                description: "an en in un ün",
                items: [
                    { char: "an", word: "天安门", emoji: "🏛️" },
                    { char: "en", word: "恩情", emoji: "❤️" },
                    { char: "in", word: "树荫", emoji: "🌳" },
                    { char: "un", word: "白云", emoji: "☁️" },
                    { char: "ün", word: "运动", emoji: "🏃" }
                ]
            },
            {
                id: 10,
                name: "后鼻韵母",
                description: "ang eng ing ong",
                items: [
                    { char: "ang", word: "小羊", emoji: "🐑" },
                    { char: "eng", word: "台灯", emoji: "💡" },
                    { char: "ing", word: "老鹰", emoji: "🦅" },
                    { char: "ong", word: "闹钟", emoji: "⏰" }
                ]
            },
            {
                id: 11,
                name: "整体认读音节（一）",
                description: "zhi chi shi ri zi ci si",
                items: [
                    { char: "zhi", word: "蜘蛛", emoji: "🕷️" },
                    { char: "chi", word: "吃饭", emoji: "🍚" },
                    { char: "shi", word: "狮子", emoji: "🦁" },
                    { char: "ri", word: "红日", emoji: "☀️" },
                    { char: "zi", word: "写字", emoji: "✍️" },
                    { char: "ci", word: "刺猬", emoji: "🦔" },
                    { char: "si", word: "蚕丝", emoji: "🧵" }
                ]
            },
            {
                id: 12,
                name: "整体认读音节（二）",
                description: "yi wu yu ye yue yuan yin yun ying",
                items: [
                    { char: "yi", word: "衣服", emoji: "👕" },
                    { char: "wu", word: "乌龟", emoji: "🐢" },
                    { char: "yu", word: "小鱼", emoji: "🐟" },
                    { char: "ye", word: "树叶", emoji: "🍃" },
                    { char: "yue", word: "月亮", emoji: "🌙" },
                    { char: "yuan", word: "公园", emoji: "🏞️" },
                    { char: "yin", word: "树荫", emoji: "🌳" },
                    { char: "yun", word: "白云", emoji: "☁️" },
                    { char: "ying", word: "老鹰", emoji: "🦅" }
                ]
            }
        ]
    }
};

// 获取当前版本的拼音数据
function getPinyinData(version) {
    return pinyinData[version] || pinyinData.shanghai;
}

// 获取所有拼音字符（用于生成干扰项）
function getAllPinyinChars(version) {
    const data = getPinyinData(version);
    const chars = [];
    data.levels.forEach(level => {
        level.items.forEach(item => {
            chars.push(item.char);
        });
    });
    return [...new Set(chars)];
}
