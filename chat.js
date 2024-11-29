// chat.js
document.addEventListener('DOMContentLoaded', function() {
    const chatWidget = document.querySelector('.chat-widget');
    const chatContent = chatWidget.querySelector('.chat-content');
    const chatInput = chatWidget.querySelector('.chat-input');
    const sendBtn = chatWidget.querySelector('.send-btn');
    const chatMessages = chatWidget.querySelector('.chat-messages');
    const expandBtn = chatWidget.querySelector('.expand-btn');

    // API key của Gemini
    const API_KEY = 'AIzaSyDC2eRlff09hopH0Wb_j62ECNkwWpwgzVQ';

    // Xử lý đóng/mở chat widget
    expandBtn.addEventListener('click', () => {
        chatContent.classList.toggle('expanded');
        const icon = expandBtn.querySelector('i');
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    });

    // Xử lý gửi tin nhắn với retry và timeout
    async function sendMessage(message) {
        appendMessage('user', message);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                appendMessage('ai', aiResponse);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error:', error);
            if (error.name === 'AbortError') {
                appendMessage('ai', 'Xin lỗi, yêu cầu đã hết thời gian chờ. Vui lòng thử lại.');
            } else {
                appendMessage('ai', 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        }
    }

    // Thêm tin nhắn vào khung chat
    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.src = sender === 'user' ? 
            document.querySelector('.profile-avatar img').src :
            'https://raw.githubusercontent.com/VanTriTech/ChatWeb2/main/ai-avatar.jpg';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Lưu tin nhắn vào localStorage
        saveMessage({
            sender,
            message,
            timestamp: new Date().toISOString()
        });
    }

    // Lưu tin nhắn vào localStorage
    function saveMessage(messageObj) {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push(messageObj);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    // Load tin nhắn từ localStorage
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.forEach(msg => {
            appendMessage(msg.sender, msg.message);
        });
    }

    // Xử lý sự kiện gửi tin nhắn
    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // Load tin nhắn khi khởi động
    loadMessages();
});
