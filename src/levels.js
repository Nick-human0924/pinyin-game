/**
 * 拼音探险岛 - 完整关卡数据
 * Level 1: 声母听音辨形
 * Level 2: 韵母听音辨形
 * Level 3: 声调辨别
 * Level 4: 简单拼读
 * Level 5: 词语拼读
 */

const LEVEL_DATA = {
    // Level 1: 声母（10题）
    1: [
        { sound: 'b', options: ['b', 'd', 'p'], correct: 0, hint: '双唇紧闭，突然放开，不送气', type: 'initial' },
        { sound: 'p', options: ['b', 'p', 'm'], correct: 1, hint: '双唇紧闭，突然放开，送气', type: 'initial' },
        { sound: 'm', options: ['m', 'n', 'l'], correct: 0, hint: '双唇紧闭，气流从鼻腔出', type: 'initial' },
        { sound: 'f', options: ['h', 'f', 's'], correct: 1, hint: '上齿咬下唇，气流从缝隙出', type: 'initial' },
        { sound: 'd', options: ['d', 'b', 't'], correct: 0, hint: '舌尖抵上齿龈，突然放开，不送气', type: 'initial' },
        { sound: 't', options: ['d', 't', 'n'], correct: 1, hint: '舌尖抵上齿龈，突然放开，送气', type: 'initial' },
        { sound: 'n', options: ['m', 'n', 'l'], correct: 1, hint: '舌尖抵上齿龈，气流从鼻腔出', type: 'initial' },
        { sound: 'l', options: ['n', 'l', 'r'], correct: 1, hint: '舌尖抵上齿龈，气流从两边出', type: 'initial' },
        { sound: 'g', options: ['g', 'k', 'h'], correct: 0, hint: '舌根抵软腭，突然放开，不送气', type: 'initial' },
        { sound: 'k', options: ['g', 'k', 'h'], correct: 1, hint: '舌根抵软腭，突然放开，送气', type: 'initial' }
    ],
    
    // Level 2: 韵母（10题）
    2: [
        { sound: 'a', options: ['a', 'o', 'e'], correct: 0, hint: '张大嘴巴，声音响亮', type: 'final' },
        { sound: 'o', options: ['o', 'u', 'e'], correct: 0, hint: '圆圆嘴巴，像吹口哨', type: 'final' },
        { sound: 'e', options: ['e', 'a', 'o'], correct: 0, hint: '扁扁嘴巴，像微笑', type: 'final' },
        { sound: 'i', options: ['i', 'u', 'ü'], correct: 0, hint: '牙齿对齐，嘴角向两边', type: 'final' },
        { sound: 'u', options: ['u', 'o', 'ü'], correct: 0, hint: '圆圆嘴巴，嘴唇向前突', type: 'final' },
        { sound: 'ü', options: ['ü', 'u', 'i'], correct: 0, hint: '嘴唇向前突，像小鱼嘴', type: 'final' },
        { sound: 'ai', options: ['ai', 'ei', 'ui'], correct: 0, hint: '从a滑到i，嘴巴由大变小', type: 'final' },
        { sound: 'ei', options: ['ai', 'ei', 'ui'], correct: 1, hint: '从e滑到i，像说"诶"', type: 'final' },
        { sound: 'ui', options: ['ai', 'ei', 'ui'], correct: 2, hint: '从u滑到i，像说"威"', type: 'final' },
        { sound: 'ao', options: ['ao', 'ou', 'iu'], correct: 0, hint: '从a滑到o，像说"袄"', type: 'final' }
    ],
    
    // Level 3: 声调（8题）
    3: [
        { sound: 'ā', options: ['ā', 'á', 'ǎ', 'à'], correct: 0, hint: '一声平，高平调，像平地', type: 'tone' },
        { sound: 'á', options: ['ā', 'á', 'ǎ', 'à'], correct: 1, hint: '二声扬，升调，像上坡', type: 'tone' },
        { sound: 'ǎ', options: ['ā', 'á', 'ǎ', 'à'], correct: 2, hint: '三声拐弯，先降后升，像山谷', type: 'tone' },
        { sound: 'à', options: ['ā', 'á', 'ǎ', 'à'], correct: 3, hint: '四声降，降调，像下坡', type: 'tone' },
        { sound: 'ō', options: ['ō', 'ó', 'ǒ', 'ò'], correct: 0, hint: '一声平，高而平', type: 'tone' },
        { sound: 'ó', options: ['ō', 'ó', 'ǒ', 'ò'], correct: 1, hint: '二声扬，由低到高', type: 'tone' },
        { sound: 'ě', options: ['ē', 'é', 'ě', 'è'], correct: 2, hint: '三声拐弯，先降后升', type: 'tone' },
        { sound: 'è', options: ['ē', 'é', 'ě', 'è'], correct: 3, hint: '四声降，急降调', type: 'tone' }
    ],
    
    // Level 4: 简单拼读（8题）
    4: [
        { sound: 'ba', display: 'b + a = ?', options: ['ba', 'pa', 'ma'], correct: 0, hint: 'b和a快速连读', type: 'blend' },
        { sound: 'pa', display: 'p + a = ?', options: ['ba', 'pa', 'fa'], correct: 1, hint: 'p和a快速连读', type: 'blend' },
        { sound: 'ma', display: 'm + a = ?', options: ['ma', 'na', 'la'], correct: 0, hint: 'm和a快速连读', type: 'blend' },
        { sound: 'fa', display: 'f + a = ?', options: ['ha', 'fa', 'sa'], correct: 1, hint: 'f和a快速连读', type: 'blend' },
        { sound: 'da', display: 'd + a = ?', options: ['da', 'ba', 'ta'], correct: 0, hint: 'd和a快速连读', type: 'blend' },
        { sound: 'ta', display: 't + a = ?', options: ['da', 'ta', 'na'], correct: 1, hint: 't和a快速连读', type: 'blend' },
        { sound: 'na', display: 'n + a = ?', options: ['ma', 'na', 'la'], correct: 1, hint: 'n和a快速连读', type: 'blend' },
        { sound: 'la', display: 'l + a = ?', options: ['na', 'la', 'ra'], correct: 1, hint: 'l和a快速连读', type: 'blend' }
    ],
    
    // Level 5: 词语拼读（6题）
    5: [
        { sound: 'baba', display: '爸 爸', options: ['baba', 'papa', 'mama'], correct: 0, hint: '爸爸 - 声母b，韵母a，轻声', type: 'word' },
        { sound: 'mama', display: '妈 妈', options: ['baba', 'papa', 'mama'], correct: 2, hint: '妈妈 - 声母m，韵母a，轻声', type: 'word' },
        { sound: 'dadi', display: '大 地', options: ['dadi', 'tadi', 'nadi'], correct: 0, hint: '大地 - d+a，d+i', type: 'word' },
        { sound: 'taitai', display: '太 太', options: ['daitai', 'taitai', 'naitai'], correct: 1, hint: '太太 - t+a，t+ai', type: 'word' },
        { sound: 'nainai', display: '奶 奶', options: ['nainai', 'lailai', 'maimai'], correct: 0, hint: '奶奶 - n+ai，n+ai，轻声', type: 'word' },
        { sound: 'lala', display: '拉 拉', options: ['nana', 'lala', 'rara'], correct: 1, hint: '拉拉 - l+a，l+a，轻声', type: 'word' }
    ]
};

// 关卡配置
const LEVEL_CONFIG = {
    1: { name: '声母岛', description: '听音辨形 - 认识声母', totalQuestions: 10, theme: 'island' },
    2: { name: '韵母岛', description: '听音辨形 - 认识韵母', totalQuestions: 10, theme: 'island' },
    3: { name: '声调谷', description: '辨别声调 - 一声到四声', totalQuestions: 8, theme: 'valley' },
    4: { name: '拼读森林', description: '简单拼读 - 声母+韵母', totalQuestions: 8, theme: 'forest' },
    5: { name: '词语城堡', description: '词语拼读 - 完整音节', totalQuestions: 6, theme: 'castle' }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVEL_DATA, LEVEL_CONFIG };
}
