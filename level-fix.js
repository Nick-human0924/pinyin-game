// 简化版闯关逻辑修复
// 将此代码添加到index.html的<script>标签末尾

// 覆盖原来的函数
window.startLevel = function(levelId) {
    console.log('开始关卡', levelId);
    currentLevel = levelId;
    questionsInLevel = [];
    for (var i = 0; i < 3; i++) {
        var q = questionBank[Math.floor(Math.random() * questionBank.length)];
        questionsInLevel.push(q);
        console.log('题目' + (i+1), q.q);
    }
    currentQuestionInLevel = 1;
    levelAnswered = false;
    showPage('game');
    loadLevelQuestion();
};

window.loadLevelQuestion = function() {
    console.log('加载题目', currentQuestionInLevel);
    levelAnswered = false;
    
    var q = questionsInLevel[currentQuestionInLevel - 1];
    if (!q) {
        console.error('题目不存在!', currentQuestionInLevel, questionsInLevel);
        alert('加载题目失败，请返回重试');
        return;
    }
    
    document.getElementById('currentQ').textContent = currentQuestionInLevel;
    document.getElementById('totalQ').textContent = '3';
    document.getElementById('currentLevel').textContent = currentLevel;
    document.getElementById('progressFill').style.width = (currentQuestionInLevel / 3 * 100) + '%';
    document.getElementById('questionDisplay').innerHTML = q.q + '<button class="voice-btn" onclick="speakCurrent()">🔊</button>';
    
    var html = '';
    q.options.forEach(function(opt) {
        html += '<button class="option-btn" onclick="checkLevelAnswer(this, \'' + opt + '\', \'' + q.a + '\')">' + opt + '</button>';
    });
    document.getElementById('optionsGrid').innerHTML = html;
    console.log('题目已显示', q.q);
};

window.checkLevelAnswer = function(btn, selected, correct) {
    console.log('答题', selected, correct);
    if (levelAnswered) {
        console.log('已经答过了');
        return;
    }
    levelAnswered = true;
    
    var isCorrect = selected === correct;
    console.log('是否正确', isCorrect);
    
    if (isCorrect) {
        btn.classList.add('correct');
        totalCorrect++;
        coins += 5;
        speak('正确！');
    } else {
        btn.classList.add('wrong');
        totalWrong++;
        speak('错误');
        document.querySelectorAll('.option-btn').forEach(function(b) {
            if (b.textContent === correct) b.classList.add('correct');
        });
        recordError(questionsInLevel[currentQuestionInLevel - 1].q, selected, correct, 'level');
    }
    
    updateUI();
    saveGameData();
    
    setTimeout(function() {
        console.log('准备下一题', currentQuestionInLevel);
        currentQuestionInLevel++;
        console.log('新题号', currentQuestionInLevel);
        
        if (currentQuestionInLevel <= 3) {
            console.log('加载下一题');
            loadLevelQuestion();
        } else {
            console.log('关卡完成');
            completeLevel();
        }
    }, 1500);
};

console.log('闯关逻辑修复已加载');
