// chat.js
document.addEventListener('DOMContentLoaded', function() {
    const chatWidget = document.querySelector('.chat-widget');
    const chatContent = chatWidget.querySelector('.chat-content');
    const chatInput = chatWidget.querySelector('.chat-input');
    const sendBtn = chatWidget.querySelector('.send-btn');
    const chatMessages = chatWidget.querySelector('.chat-messages');
    const expandBtn = chatWidget.querySelector('.expand-btn');

    // API key của Gemini
    const API_KEY = 'AIzaSyB0QAdCZ93VwEfbPE4FCd_tBDS6PPsl0nw';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // Xử lý gửi tin nhắn
    async function sendMessage(message) {
        appendMessage('user', message);
        
        try {
            showTypingIndicator();
            
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

            if (!response.ok) {
                throw new Error('Network response was not ok');
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
            appendMessage('ai', 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            removeTypingIndicator();
        }
    }

    // Hiển thị typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Xóa typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
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

    // Xử lý đóng/mở chat widget
    expandBtn.addEventListener('click', () => {
        chatContent.classList.toggle('expanded');
        const icon = expandBtn.querySelector('i');
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    });
});
