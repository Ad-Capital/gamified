const questions = [
    {
        question: "How do you manage sales?",
        options: [
            { text: "Advanced CRM with automation", value: 10 },
            { text: "Basic CRM system", value: 7 },
            { text: "Spreadsheets & manual tracking", value: 4 },
            { text: "No formal system", value: 1 }
        ]
    },
    {
        question: "How do you handle customer support?",
        options: [
            { text: "Dedicated team with SLAs", value: 10 },
            { text: "Structured email/phone support", value: 7 },
            { text: "Ad-hoc support", value: 4 },
            { text: "No formal process", value: 1 }
        ]
    },
    {
        question: "How do you manage finances?",
        options: [
            { text: "Professional accounting software", value: 10 },
            { text: "Basic bookkeeping", value: 7 },
            { text: "Manual tracking", value: 4 },
            { text: "No formal system", value: 1 }
        ]
    },
    {
        question: "How do you plan for growth?",
        options: [
            { text: "Formal strategic planning", value: 10 },
            { text: "Annual goal setting", value: 7 },
            { text: "Informal planning", value: 4 },
            { text: "No planning process", value: 1 }
        ]
    },
    {
        question: "How do you acquire customers?",
        options: [
            { text: "Multi-channel marketing with ROI tracking", value: 10 },
            { text: "Consistent marketing efforts", value: 7 },
            { text: "Basic marketing activities", value: 4 },
            { text: "No marketing strategy", value: 1 }
        ]
    }
];

let currentIndex = 0;
let score = 0;
let maxScore = questions.length * 10;

const progress = document.getElementById('progress');
const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const finalScore = document.getElementById('final-score');
const email = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');

function showQuestion() {
    const q = questions[currentIndex];

    questionContainer.innerHTML = `
        <div class="question-title">${q.question}</div>
        ${q.options.map((option, i) => `
            <div class="option" data-value="${option.value}">
                <input type="radio" name="q${currentIndex}" value="${option.value}" id="opt${i}">
                <span class="option-text">${option.text}</span>
            </div>
        `).join('')}
    `;

    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input').checked = true;
            nextBtn.disabled = false;
        });
    });

    progress.style.setProperty('--progress', `${((currentIndex + 1) / questions.length) * 100}%`);
    nextBtn.disabled = true;
    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Continue';
}

function showResults() {
    const percentage = Math.round((score / maxScore) * 100);

    quizPage.style.display = 'none';
    resultsPage.style.display = 'block';

    finalScore.innerHTML = `
        <div class="score-number">${percentage}</div>
        <div class="score-label">Business Health Score</div>
    `;
}

nextBtn.addEventListener('click', () => {
    const selected = document.querySelector('input[name="q' + currentIndex + '"]:checked');
    if (selected) {
        score += parseInt(selected.value);
        currentIndex++;

        if (currentIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }
});

submitBtn.addEventListener('click', () => {
    if (email.value) {
        console.log('Email:', email.value, 'Score:', score);
        submitBtn.textContent = 'Sent';
        submitBtn.disabled = true;
    }
});

progress.style.setProperty('--progress', '0%');
document.documentElement.style.setProperty('--progress', '0%');

const style = document.createElement('style');
style.textContent = `
    .progress::after { width: var(--progress, 0%); }
`;
document.head.appendChild(style);

showQuestion();