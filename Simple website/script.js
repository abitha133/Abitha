let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let isLoggedIn = false;

function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    authLink.textContent = isLoggedIn ? 'Logout' : 'Login';
    authLink.onclick = isLoggedIn ? logout : showLogin;
}

function showLogin() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.style.opacity = '0';
    setTimeout(() => {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('quiz-list-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('login-container').classList.add('active');
        document.getElementById('signup-container').classList.remove('active');
        document.getElementById('quiz-list-container').classList.remove('active');
        document.getElementById('quiz-container').classList.remove('active');
        mainContent.style.opacity = '1';
    }, 500);
}

function showSignup() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.style.opacity = '0';
    setTimeout(() => {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'block';
        document.getElementById('quiz-list-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('login-container').classList.remove('active');
        document.getElementById('signup-container').classList.add('active');
        document.getElementById('quiz-list-container').classList.remove('active');
        document.getElementById('quiz-container').classList.remove('active');
        mainContent.style.opacity = '1';
    }, 500);
}

function showQuizList() {
    if (!isLoggedIn) {
        showLogin();
        return;
    }
    if (!quizzes || quizzes.length === 0) {
        console.error('Quizzes data is not loaded');
        alert('Error: Quiz data not available. Please check if questions.js is loaded.');
        return;
    }
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.style.opacity = '0';
    setTimeout(() => {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('quiz-list-container').style.display = 'block';
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('login-container').classList.remove('active');
        document.getElementById('signup-container').classList.remove('active');
        document.getElementById('quiz-list-container').classList.add('active');
        document.getElementById('quiz-container').classList.remove('active');
        
        const quizList = document.getElementById('quiz-list');
        if (!quizList) return;
        quizList.innerHTML = '';
        quizzes.forEach(quiz => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="return startQuiz(${quiz.id});">${quiz.title}</a>`;
            quizList.appendChild(li);
        });
        mainContent.style.opacity = '1';
    }, 500);
}

function startQuiz(quizId) {
    if (!isLoggedIn) {
        showLogin();
        return false;
    }
    currentQuiz = quizzes.find(quiz => quiz.id === quizId);
    if (!currentQuiz) {
        console.error('Quiz not found:', quizId);
        alert('Error: Selected quiz not found.');
        return false;
    }
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return false;
    mainContent.style.opacity = '0';
    setTimeout(() => {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('quiz-list-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('login-container').classList.remove('active');
        document.getElementById('signup-container').classList.remove('active');
        document.getElementById('quiz-list-container').classList.remove('active');
        document.getElementById('quiz-container').classList.add('active');
        
        document.getElementById('quiz-title').textContent = currentQuiz.title;
        mainContent.style.opacity = '1';
        displayQuestion();
    }, 500);
    return false;
}

function displayQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) {
        console.error('Quiz container not found');
        return;
    }
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const explanationEl = document.getElementById('explanation');
    const imageEl = document.getElementById('image');
    const nextButton = document.getElementById('next-button');
    if (!questionEl || !optionsEl || !explanationEl || !imageEl || !nextButton) {
        console.error('Quiz elements not found');
        return;
    }

    if (currentQuestionIndex >= currentQuiz.questions.length) {
        showResults();
        return;
    }

    quizContainer.style.opacity = '0';
    setTimeout(() => {
        const question = currentQuiz.questions[currentQuestionIndex];
        questionEl.textContent = question.question;
        optionsEl.innerHTML = '';
        explanationEl.textContent = '';
        explanationEl.className = '';
        imageEl.innerHTML = `<img src="${question.image}" alt="Medical Image">`;

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.type = 'button';
            button.onclick = () => selectOption(index);
            optionsEl.appendChild(button);
        });

        nextButton.disabled = true;
        quizContainer.style.opacity = '1';
    }, 500);
}

function selectOption(index) {
    const question = currentQuiz.questions[currentQuestionIndex];
    const explanationEl = document.getElementById('explanation');
    const nextButton = document.getElementById('next-button');
    if (!explanationEl || !nextButton) return;

    userAnswers.push(index);
    if (index === question.correct) {
        score++;
        explanationEl.textContent = `Correct! ${question.explanation}`;
        explanationEl.className = 'correct';
    } else {
        explanationEl.textContent = `Incorrect. ${question.explanation}`;
        explanationEl.className = 'incorrect';
    }

    document.querySelectorAll('#options button').forEach(button => {
        button.disabled = true;
    });
    nextButton.disabled = false;
}

function showResults() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.style.opacity = '0';
    setTimeout(() => {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('quiz-list-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('quiz-container').innerHTML = `
            <h2>Quiz Completed!</h2>
            <p>Your Score: ${score} / ${currentQuiz.questions.length}</p>
            <a href="#" id="back-to-home" aria-label="Back to Quiz List">Back to Home</a>
        `;
        document.getElementById('back-to-home').addEventListener('click', (e) => {
            e.preventDefault();
            showQuizList();
        });
        mainContent.style.opacity = '1';
    }, 500);
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
        isLoggedIn = true;
        updateAuthLink();
        showQuizList();
    } else {
        alert('Invalid username or password');
    }
}

function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        alert('Username already exists');
        return;
    }
    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login.');
    showLogin();
}

function logout() {
    isLoggedIn = false;
    updateAuthLink();
    showLogin();
}

// Event listeners
window.addEventListener('load', () => {
    if (typeof quizzes === 'undefined') {
        console.error('Quizzes data is not defined');
        alert('Error: Quiz data not loaded. Please check if questions.js is included correctly.');
    } else {
        updateAuthLink();
        showLogin();
    }

    // Add event listeners for buttons and links
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const showSignupLink = document.getElementById('show-signup-link');
    const showLoginLink = document.getElementById('show-login-link');
    const nextButton = document.getElementById('next-button');

    if (loginButton) loginButton.addEventListener('click', login);
    if (signupButton) signupButton.addEventListener('click', signup);
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });
    if (nextButton) nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    // Handle form submission with Enter key
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm) {
        loginForm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                login();
            }
        });
    }
    if (signupForm) {
        signupForm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                signup();
            }
        });
    }
});