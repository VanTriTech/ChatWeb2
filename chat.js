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
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // Xử lý đóng/mở chat widget
    expandBtn.addEventListener('click', () => {
        chatContent.classList.toggle('expanded');
        const icon = expandBtn.querySelector('i');
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    });

    // Xử lý gửi tin nhắn
    async function sendMessage(message) {
        // Hiển thị tin nhắn người dùng
        appendMessage('user', message);

        try {
            // Gọi API Gemini
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Hiển thị phản hồi từ AI
            appendMessage('ai', aiResponse);
        } catch (error) {
            console.error('Error:', error);
            appendMessage('ai', 'Xin lỗi, đã có lỗi xảy ra.');
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
            'path/to/ai-avatar.jpg';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        // Cuộn xuống tin nhắn mới nhất
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
});
