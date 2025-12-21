
const sidebar = document.getElementById('sidebar');
const collapseBtn = document.getElementById('collapseBtn');
const expandBtn = document.getElementById('expandBtn');
const collapseIcon = document.getElementById('collapseIcon');
const newChatBtn = document.getElementById('newChatBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatScreen = document.getElementById('chatScreen');
const welcomeInput = document.getElementById('welcomeInput');
const welcomeSendBtn = document.getElementById('welcomeSendBtn');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');
const menuToggle = document.getElementById('menuToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const formsBtn = document.getElementById('formsBtn');
const formsSubmenu = document.getElementById('formsSubmenu');
const contractsBtn = document.getElementById('contractsBtn');
const risksBtn = document.getElementById('risksBtn');
const searchInput = document.getElementById('searchInput');
const collapsedSearch = document.getElementById('collapsedSearch');
const collapsedChats = document.getElementById('collapsedChats');
const collapsedForms = document.getElementById('collapsedForms');
const recentChatsList = document.getElementById('recentChatsList');
const sidebarLogo = document.getElementById('sidebarLogo');
const welcomeTitle = document.getElementById('welcomeTitle');

const welcomeMessages = [
    "مرحباً بك في المساعد الذكي",
    "كيف يمكنني مساعدتك",
    "حيّاك الله، كيف أقدر أخدمك اليوم",
    "أهلًا، أنا موجود للمساعدة بأي وقت",
    "حيّاك الله، يسعدني خدمتك",
    "هلا بك، جاهز أساعدك بأي شي تحتاجه",
    "كيف أقدر أخدمك"
];

const aiResponses = [
    "هذا سؤال رائع! دعني أقدم لك إجابة شاملة بناءً على أحدث المعلومات المتاحة.",
    "أفهم ما تبحث عنه. إليك تحليلي التفصيلي وتوصياتي...",
    "ممتاز! يمكنني بالتأكيد مساعدتك في ذلك. بناءً على متطلباتك، إليك ما أقترحه...",
    "شكراً على استفسارك! لقد قمت بمعالجة طلبك وإليك ما تحتاج إلى معرفته...",
    "منظور مثير للاهتمام! دعني أحلل هذا لك مع بعض الرؤى الأساسية."
];

localStorage.removeItem('aiConversations');
let conversations = [];
let currentConversationId = null;

renderRecentChats();

sidebarLogo.addEventListener('click', () => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    welcomeTitle.style.transform = 'scale(0.9)';
    welcomeTitle.style.opacity = '0';

    setTimeout(() => {
        welcomeTitle.textContent = randomMessage;
        welcomeTitle.style.transform = 'scale(1)';
        welcomeTitle.style.opacity = '1';
    }, 200);
});

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

collapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        collapseIcon.classList.remove('fa-solid fa-bars');
        collapseIcon.classList.add('fa-chevron-left');
    } else {
        collapseIcon.classList.remove('fa-chevron-left');
        collapseIcon.classList.add('fa-solid fa-bars');
    }
});

expandBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    collapseIcon.classList.remove('fa-chevron-left');
    collapseIcon.classList.add('fa-solid fa-bars');
});

formsBtn.addEventListener('click', () => {
    formsSubmenu.classList.toggle('active');
});

contractsBtn.addEventListener('click', () => {
    alert('فتح صفحة العقود');
});

risksBtn.addEventListener('click', () => {
    alert('فتح صفحة المخاطر');
});

collapsedSearch.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    setTimeout(() => searchInput.focus(), 300);
});

collapsedChats.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
});

collapsedForms.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    setTimeout(() => formsBtn.click(), 300);
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderRecentChats(searchTerm);
});

newChatBtn.addEventListener('click', () => {
    currentConversationId = null;
    chatScreen.classList.remove('active');
    welcomeScreen.classList.remove('hidden');
    chatMessages.innerHTML = '';
    welcomeInput.value = '';
    chatInput.value = '';

    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

function renderRecentChats(searchTerm = '') {
    recentChatsList.innerHTML = '';

    const filteredConversations = conversations.filter(conv =>
        searchTerm === '' || conv.title.toLowerCase().includes(searchTerm)
    );

    if (filteredConversations.length === 0 && searchTerm === '') {
        recentChatsList.innerHTML = '<div style="color: rgba(255,255,255,0.4); text-align: center; padding: 20px; font-size: 14px;">لا توجد محادثات سابقة</div>';
        return;
    }

    if (filteredConversations.length === 0 && searchTerm !== '') {
        recentChatsList.innerHTML = '<div style="color: rgba(255,255,255,0.4); text-align: center; padding: 20px; font-size: 14px;">لم يتم العثور على نتائج</div>';
        return;
    }

    filteredConversations.forEach(conv => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        if (conv.id === currentConversationId) {
            chatItem.classList.add('active');
        }

        chatItem.innerHTML = `
                    <i class="fas fa-message"></i>
                    <span class="chat-item-text">${conv.title}</span>
                `;

        chatItem.addEventListener('click', () => loadConversation(conv.id));
        recentChatsList.appendChild(chatItem);
    });
}

function loadConversation(id) {
    const conversation = conversations.find(conv => conv.id === id);
    if (!conversation) return;

    currentConversationId = id;
    welcomeScreen.classList.add('hidden');
    chatScreen.classList.add('active');
    chatMessages.innerHTML = '';

    conversation.messages.forEach(msg => {
        addMessage(msg.text, msg.isUser, false);
    });

    renderRecentChats();

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
}

function saveConversation(firstMessage) {
    if (currentConversationId) {
        const conversation = conversations.find(conv => conv.id === currentConversationId);
        if (conversation) {
            return;
        }
    }

    const now = new Date();
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newConversation = {
        id: Date.now(),
        title: firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : ''),
        time: time,
        messages: []
    };

    conversations.unshift(newConversation);
    currentConversationId = newConversation.id;

    if (conversations.length > 20) {
        conversations = conversations.slice(0, 20);
    }

    localStorage.setItem('aiConversations', JSON.stringify(conversations));
    renderRecentChats();
}

function updateConversationMessages(text, isUser) {
    if (!currentConversationId) return;

    const conversation = conversations.find(conv => conv.id === currentConversationId);
    if (conversation) {
        conversation.messages.push({ text, isUser });
        localStorage.setItem('aiConversations', JSON.stringify(conversations));
    }
}

function addMessage(text, isUser, saveToHistory = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (saveToHistory) {
        updateConversationMessages(text, isUser);
    }
}

function sendMessage(input) {
    const message = input.value.trim();
    if (!message) return;

    const isNewConversation = !currentConversationId;

    if (isNewConversation) {
        saveConversation(message);
    }

    welcomeScreen.classList.add('hidden');
    chatScreen.classList.add('active');

    addMessage(message, true);
    input.value = '';

    setTimeout(() => {
        const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        addMessage(response, false);
    }, 800);
}

// Event listeners for sending messages
welcomeSendBtn.addEventListener('click', () => sendMessage(welcomeInput));
welcomeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage(welcomeInput);
});

chatSendBtn.addEventListener('click', () => sendMessage(chatInput));
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage(chatInput);
});