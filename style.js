const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const centeredMessageInput = document.getElementById('centeredMessageInput');
const sendButton = document.getElementById('sendButton');
const centeredSendButton = document.getElementById('centeredSendButton');
const newChatButton = document.getElementById('newChatButton');
const checkoutButton = document.getElementById('checkoutButton');
const settingsButton = document.getElementById('settingsButton');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const welcomeContainer = document.getElementById('welcomeContainer');
const chatContainer = document.getElementById('chatContainer');
const searchInput = document.getElementById('searchInput');

let messages = [];
let isFirstMessage = true;

const aiResponses = [
    "هذا سؤال رائع! دعني أقدم لك إجابة شاملة بناءً على أحدث المعلومات المتاحة.",
    "أفهم ما تبحث عنه. إليك تحليلي التفصيلي وتوصياتي...",
    "ممتاز! يمكنني بالتأكيد مساعدتك في ذلك. بناءً على متطلباتك، إليك ما أقترحه...",
    "شكراً على استفسارك! لقد قمت بمعالجة طلبك وإليك ما تحتاج إلى معرفته...",
    "منظور مثير للاهتمام! دعني أحلل هذا لك مع بعض الرؤى الأساسية والخطوات القابلة للتنفيذ."
];

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
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
    }

    addMessage(message, true);
    inputElement.value = '';

    setTimeout(() => {
        const aiResponse = getAIResponse();
        addMessage(aiResponse, false);
    }, 800);
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

checkoutButton.addEventListener('click', () => {
    alert('فتح الدفع والإعدادات...\nهذا هو المكان الذي يمكن للمستخدمين إدارة حساباتهم واشتراكاتهم وتفضيلاتهم فيه.');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

settingsButton.addEventListener('click', () => {
    alert('فتح الإعدادات...\nقم بتكوين تفضيلاتك والسمات وإعدادات الحساب هنا.');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

document.querySelectorAll('.chat-history-item').forEach(item => {
    item.addEventListener('click', () => {
        const text = item.querySelector('span').textContent;
        alert('تحميل المحادثة السابقة: ' + text);
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        }
    });
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-history-item');

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