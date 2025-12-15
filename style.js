const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const centeredMessageInput = document.getElementById('centeredMessageInput');
const sendButton = document.getElementById('sendButton');
const centeredSendButton = document.getElementById('centeredSendButton');
const newChatButton = document.getElementById('newChatButton');
const footerSettingsButton = document.getElementById('footerSettingsButton');
const footerUserInfo = document.getElementById('footerUserInfo');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleCollapsed = document.getElementById('sidebarToggleCollapsed');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const welcomeContainer = document.getElementById('welcomeContainer');
const chatContainer = document.getElementById('chatContainer');
const searchInput = document.getElementById('searchInput');
const formsButton = document.getElementById('formsButton');
const formsSubmenu = document.getElementById('formsSubmenu');
const contractsButton = document.getElementById('contractsButton');
const risksButton = document.getElementById('risksButton');
const chatHistoryList = document.getElementById('chatHistoryList');
const sidebarLogo = document.getElementById('sidebarLogo');
const welcomeTitle = document.getElementById('welcomeTitle');

let messages = [];
let chatSessions = [];
let isFirstMessage = true;
let isLoggedIn = false;

const aiResponses = [
    "هذا سؤال رائع! دعني أقدم لك إجابة شاملة بناءً على أحدث المعلومات المتاحة.",
    "أفهم ما تبحث عنه. إليك تحليلي التفصيلي وتوصياتي...",
    "ممتاز! يمكنني بالتأكيد مساعدتك في ذلك. بناءً على متطلباتك، إليك ما أقترحه...",
    "شكراً على استفسارك! لقد قمت بمعالجة طلبك وإليك ما تحتاج إلى معرفته...",
    "منظور مثير للاهتمام! دعني أحلل هذا لك مع بعض الرؤى الأساسية والخطوات القابلة للتنفيذ."
];

const welcomeTitles = [
    "كيف يمكنني مساعدتك",
    "مرحباً بك في المساعد الذكي",
    "حيّاك الله، كيف أقدر أخدمك اليوم",
    "أهلًا، أنا موجود للمساعدة بأي وقت",
    "حيّاك الله، يسعدني خدمتك",
    "هلا بك، جاهز أساعدك بأي شي تحتاجه",
    "كيف أقدر أخدمك"
];

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    updateToggleIcons();
});

sidebarToggleCollapsed.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    updateToggleIcons();
});

function updateToggleIcons() {
    const isCollapsed = sidebar.classList.contains('collapsed');
    const headerIcon = sidebarToggle.querySelector('i');
    const collapsedIcon = sidebarToggleCollapsed.querySelector('i');

    if (isCollapsed) {
        headerIcon.className = 'fas fa-chevron-left';
        collapsedIcon.className = 'fas fa-chevron-left';
    } else {
        headerIcon.className = 'fas fa-chevron-right';
        collapsedIcon.className = 'fas fa-chevron-right';
    }
}

// Handle icon clicks in collapsed mode
document.querySelectorAll('.sidebar-icon-item, .collapsed-user-avatar').forEach(item => {
    item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');

        switch (action) {
            case 'new-chat':
                sidebar.classList.remove('collapsed');
                sidebarToggle.querySelector('i').className = 'fas fa-chevron-right';
                setTimeout(() => newChatButton.click(), 300);
                break;
            case 'search':
                sidebar.classList.remove('collapsed');
                sidebarToggle.querySelector('i').className = 'fas fa-chevron-right';
                setTimeout(() => searchInput.focus(), 300);
                break;
            case 'forms':
                sidebar.classList.remove('collapsed');
                sidebarToggle.querySelector('i').className = 'fas fa-chevron-right';
                setTimeout(() => formsButton.click(), 300);
                break;
            case 'history':
                sidebar.classList.remove('collapsed');
                sidebarToggle.querySelector('i').className = 'fas fa-chevron-right';
                break;
            case 'profile':
                alert('معلومات الحساب\n\nالاسم: محمد أحمد\nالبريد: mohammed@example.com');
                break;
        }
    });
});

sidebarLogo.addEventListener('click', () => {
    const randomTitle = welcomeTitles[Math.floor(Math.random() * welcomeTitles.length)];
    welcomeTitle.textContent = randomTitle;

    // Add animation effect
    welcomeTitle.style.animation = 'none';
    setTimeout(() => {
        welcomeTitle.style.animation = 'fadeIn 0.5s ease';
    }, 10);

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;

    messages.push({ content, isUser });
}

function getAIResponse() {
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
}

function transitionToChat() {
    welcomeContainer.classList.add('hidden');
    chatContainer.classList.add('active');
    messageInput.focus();
}

function sendMessage(inputElement) {
    const message = inputElement.value.trim();
    if (message === '') return;

    if (isFirstMessage) {
        transitionToChat();
        isFirstMessage = false;

        // Save chat session with first message
        const sessionTitle = message.length > 40 ? message.substring(0, 40) + '...' : message;
        chatSessions.unshift({
            title: sessionTitle,
            timestamp: new Date(),
            messages: []
        });
        updateChatHistory();
    }

    addMessage(message, true);

    // Add message to current session
    if (chatSessions.length > 0) {
        chatSessions[0].messages.push({ content: message, isUser: true });
    }

    inputElement.value = '';

    setTimeout(() => {
        const aiResponse = getAIResponse();
        addMessage(aiResponse, false);

        // Add AI response to current session
        if (chatSessions.length > 0) {
            chatSessions[0].messages.push({ content: aiResponse, isUser: false });
        }
    }, 800);
}

function updateChatHistory() {
    chatHistoryList.innerHTML = '';

    chatSessions.forEach((session, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'chat-history-item';
        historyItem.innerHTML = `<span>${session.title}</span>`;
        historyItem.addEventListener('click', () => {
            loadChatSession(index);
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }
        });
        chatHistoryList.appendChild(historyItem);
    });
}

function loadChatSession(index) {
    const session = chatSessions[index];
    chatArea.innerHTML = '';
    messages = [];

    session.messages.forEach(msg => {
        addMessage(msg.content, msg.isUser);
    });

    if (session.messages.length > 0) {
        welcomeContainer.classList.add('hidden');
        chatContainer.classList.add('active');
    }
}

centeredSendButton.addEventListener('click', () => {
    sendMessage(centeredMessageInput);
});

centeredMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(centeredMessageInput);
    }
});

sendButton.addEventListener('click', () => {
    sendMessage(messageInput);
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(messageInput);
    }
});

newChatButton.addEventListener('click', () => {
    messages = [];
    isFirstMessage = true;
    chatArea.innerHTML = '';
    chatContainer.classList.remove('active');
    welcomeContainer.classList.remove('hidden');
    centeredMessageInput.value = '';
    messageInput.value = '';
    centeredMessageInput.focus();

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

footerSettingsButton.addEventListener('click', () => {
    alert('إعدادات الحساب\n\n• الملف الشخصي\n• الاشتراكات\n• الإعدادات\n• تسجيل الخروج');

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

footerUserInfo.addEventListener('click', (e) => {
    // Don't trigger if clicking on settings button
    if (e.target.closest('.footer-settings-btn')) return;

    alert('معلومات الحساب\n\nالاسم: محمد أحمد\nالبريد: mohammed@example.com\n\nانقر على أيقونة الإعدادات لتعديل معلوماتك');

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

formsButton.addEventListener('click', () => {
    formsSubmenu.classList.toggle('active');
});

contractsButton.addEventListener('click', () => {
    alert('فتح صفحة العقود');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

risksButton.addEventListener('click', () => {
    alert('فتح صفحة المخاطر');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const chatItems = chatHistoryList.querySelectorAll('.chat-history-item');

    chatItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

centeredMessageInput.focus();