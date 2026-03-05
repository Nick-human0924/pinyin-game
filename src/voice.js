/**
 * 拼音语音合成模块
 * 使用 Web Speech API 实现拼音朗读
 */

class PinyinVoice {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.chineseVoice = null;
        this.rate = 0.8; // 默认语速稍慢，适合儿童
        this.pitch = 1.0;
        this.volume = 1.0;
        
        this.init();
    }
    
    init() {
        // 加载可用语音
        this.loadVoices();
        
        // 监听语音列表变化（某些浏览器异步加载）
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }
    
    loadVoices() {
        this.voices = this.synth.getVoices();
        
        // 优先选择中文语音
        this.chineseVoice = this.voices.find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
        
        // 如果没有中文语音，使用默认语音
        if (!this.chineseVoice && this.voices.length > 0) {
            this.chineseVoice = this.voices[0];
        }
        
        console.log('语音加载完成:', this.chineseVoice ? this.chineseVoice.name : '默认语音');
    }
    
    /**
     * 朗读拼音
     * @param {string} pinyin - 要朗读的拼音
     * @param {boolean} slow - 是否慢速朗读
     */
    speak(pinyin, slow = false) {
        if (!this.synth) {
            console.error('浏览器不支持语音合成');
            return false;
        }
        
        // 取消当前朗读
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(pinyin);
        
        // 设置语音
        if (this.chineseVoice) {
            utterance.voice = this.chineseVoice;
        }
        
        // 设置语言
        utterance.lang = 'zh-CN';
        
        // 设置语速（慢速模式更慢）
        utterance.rate = slow ? 0.5 : this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;
        
        // 开始朗读
        this.synth.speak(utterance);
        
        return true;
    }
    
    /**
     * 朗读提示文本
     * @param {string} text - 提示文本
     */
    speakHint(text) {
        if (!this.synth) return false;
        
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.chineseVoice) {
            utterance.voice = this.chineseVoice;
        }
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        utterance.pitch = 1.1; // 提示音稍高
        
        this.synth.speak(utterance);
        return true;
    }
    
    /**
     * 朗读鼓励语句
     * @param {boolean} isCorrect - 是否答对
     */
    speakFeedback(isCorrect) {
        const correctPhrases = [
            '真棒！答对了！',
            '太厉害了！',
            '非常好！',
            '你真聪明！',
            '答对啦！继续加油！'
        ];
        
        const wrongPhrases = [
            '没关系，再试一次！',
            '加油，你可以的！',
            '再想想看！',
            '别灰心，继续学习！'
        ];
        
        const phrases = isCorrect ? correctPhrases : wrongPhrases;
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        this.speakHint(randomPhrase);
    }
    
    /**
     * 停止朗读
     */
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
    
    /**
     * 检查是否支持语音
     */
    isSupported() {
        return 'speechSynthesis' in window;
    }
    
    /**
     * 获取语音状态
     */
    isSpeaking() {
        return this.synth ? this.synth.speaking : false;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PinyinVoice;
}
