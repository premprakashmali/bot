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
const sidebarToggle = document.getElementById('sidebarToggle');
const collapsedNewChat = document.getElementById('collapsedNewChat');
const collapsedSearch = document.getElementById('collapsedSearch');
const collapsedForms = document.getElementById('collapsedForms');
const collapsedHistory = document.getElementById('collapsedHistory');
const collapsedSettings = document.getElementById('collapsedSettings');

let messages = [];
let chatSessions = [];
let isFirstMessage = true;
let isSidebarCollapsed = false;


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

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

// Sidebar collapse toggle for desktop
sidebarToggle.addEventListener('click', () => {
    isSidebarCollapsed = !isSidebarCollapsed;
    sidebar.classList.toggle('collapsed');
    sidebarToggle.classList.toggle('collapsed');
    const icon = sidebarToggle.querySelector('i');
    icon.className = isSidebarCollapsed ? 'fas fa-chevron-left' : 'fas fa-bars';
});


// Collapsed menu interactions
collapsedNewChat.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    setTimeout(() => {
        newChatButton.click();
    }, 300);
});

collapsedSearch.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    setTimeout(() => {
        searchInput.focus();
    }, 300);
});

collapsedForms.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    setTimeout(() => {
        formsButton.click();
    }, 300);
});

collapsedHistory.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
});

collapsedSettings.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    setTimeout(() => {
        footerSettingsButton.click();
    }, 300);
});

sidebarLogo.addEventListener('click', () => {
    const randomTitle = welcomeTitles[Math.floor(Math.random() * welcomeTitles.length)];
    welcomeTitle.textContent = randomTitle;

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

        const sessionTitle = message.length > 40 ? message.substring(0, 40) + '...' : message;
        chatSessions.unshift({
            title: sessionTitle,
            timestamp: new Date(),
            messages: []
        });
        updateChatHistory();
    }

    addMessage(message, true);

    if (chatSessions.length > 0) {
        chatSessions[0].messages.push({ content: message, isUser: true });
    }

    inputElement.value = '';

    setTimeout(() => {
        const aiResponse = getAIResponse();
        addMessage(aiResponse, false);

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

function expandSidebarAndClick(callback) {
    if (isSidebarCollapsed) {
        isSidebarCollapsed = false; // update state
        sidebar.classList.remove('collapsed');
        sidebarToggle.classList.remove('collapsed');
        const icon = sidebarToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }
    setTimeout(callback, 300);
}

collapsedNewChat.addEventListener('click', () => {
    expandSidebarAndClick(() => newChatButton.click());
});

collapsedSearch.addEventListener('click', () => {
    expandSidebarAndClick(() => searchInput.focus());
});

collapsedForms.addEventListener('click', () => {
    expandSidebarAndClick(() => formsButton.click());
});

collapsedHistory.addEventListener('click', () => {
    expandSidebarAndClick(() => { });
});

collapsedSettings.addEventListener('click', () => {
    expandSidebarAndClick(() => footerSettingsButton.click());
});


centeredMessageInput.focus();