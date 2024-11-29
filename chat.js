document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatWidget = document.querySelector('.chat-widget');
    const chatHeader = document.querySelector('.chat-header');
    const expandBtn = document.querySelector('.expand-btn');
    const chatContent = document.querySelector('.chat-content');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMediaInput = document.getElementById('chat-media');
    const chatMessages = document.querySelector('.chat-messages');

    // Chat State
    let isExpanded = false;
    let selectedMedia = [];
    let messageTimeout;
    let lastMessageTime = Date.now();
    let autoMessageTimeout;
    
    // Mảng chủ đề cho tin nhắn tự động
    const autoTopics = [
        "Ê m, dạo này học hành thế nào?",
        "Hôm nay t mới học được cái hay lắm",
        "M có xem phim mới k?",
        "Cuối tuần này đi chơi k?",
        "T vừa nghĩ ra một ý tưởng hay",
        "M ăn cơm chưa?",
        "Dạo này m code project nào k?",
        "T vừa học xong một bài khó vcl"
    ];

    // Hàm tạo tin nhắn tự động
    async function generateAutoMessage() {
        try {
            const randomTopic = autoTopics[Math.floor(Math.random() * autoTopics.length)];
            
            if (Math.random() < 0.5) {
                let myNgocResponse = await getAIResponse(randomTopic);
                if (myNgocResponse) {
                    const myNgocMessage = {
                        id: Date.now(),
                        content: myNgocResponse,
                        sender: 'Mỹ Ngọc',
                        timestamp: new Date().toISOString(),
                        media: []
                    };
                    addMessageToDOM(myNgocMessage);
                    saveMessage(myNgocMessage);
                }
            } else {
                let lisaResponse = await getAIResponse2(randomTopic);
                if (lisaResponse) {
                    const lisaMessage = {
                        id: Date.now(),
                        content: lisaResponse,
                        sender: 'Lisa',
                        timestamp: new Date().toISOString(),
                        media: []
                    };
                    addMessageToDOM(lisaMessage);
                    saveMessage(lisaMessage);
                }
            }
            
            scrollToBottom();
            scheduleNextAutoMessage();
        } catch (error) {
            console.error('Auto message error:', error);
        }
    }

    // Hàm lên lịch tin nhắn tự động
    function scheduleNextAutoMessage() {
        if (autoMessageTimeout) {
            clearTimeout(autoMessageTimeout);
        }
        
        // Random 3-10 phút
        const delay = (3 + Math.random() * 7) * 60 * 1000;
        
        autoMessageTimeout = setTimeout(() => {
            const timeSinceLastMessage = Date.now() - lastMessageTime;
            // Chỉ gửi nếu im lặng > 3 phút và chat đang mở
            if (timeSinceLastMessage > 3 * 60 * 1000 && isExpanded) {
                generateAutoMessage();
            }
        }, delay);
    }

    // Cập nhật hàm handleSendMessage
    async function handleSendMessage() {
        const content = chatInput.value.trim();
        const mediaUrls = selectedMedia.map(media => media.url);
    
        if (!content && mediaUrls.length === 0) return;

        lastMessageTime = Date.now();
        scheduleNextAutoMessage();

        const userMessage = {
            id: Date.now(),
            content: content,
            sender: 'Benton Cato',
            timestamp: new Date().toISOString(),
            media: selectedMedia
        };

        addMessageToDOM(userMessage);
        saveMessage(userMessage);

        chatInput.value = '';
        selectedMedia = [];
        updateMediaPreview();
        chatInput.focus();
        scrollToBottom();

        showTypingIndicator();

        try {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            let myNgocResponse = await getAIResponse(content, mediaUrls);
            if (!myNgocResponse) {
                myNgocResponse = responses[Math.floor(Math.random() * responses.length)];
            }

            const myNgocMessage = {
                id: Date.now(),
                content: myNgocResponse,
                sender: 'Mỹ Ngọc',
                timestamp: new Date().toISOString(),
                media: []
            };

            addMessageToDOM(myNgocMessage);
            saveMessage(myNgocMessage);
            scrollToBottom();

            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            let lisaResponse = await getAIResponse2(content, mediaUrls);
            if (!lisaResponse) {
                lisaResponse = responses_2[Math.floor(Math.random() * responses_2.length)];
            }

            const lisaMessage = {
                id: Date.now(),
                content: lisaResponse,
                sender: 'Lisa',
                timestamp: new Date().toISOString(),
                media: []
            };

            addMessageToDOM(lisaMessage);
            saveMessage(lisaMessage);
            scrollToBottom();

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Cập nhật hàm toggleChat
    function toggleChat() {
        isExpanded = !isExpanded;
        chatContent.style.display = isExpanded ? 'flex' : 'none';
        expandBtn.querySelector('i').className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        
        if (isExpanded) {
            loadMessages();
            chatInput.focus();
            scheduleNextAutoMessage();
        } else {
            if (autoMessageTimeout) {
                clearTimeout(autoMessageTimeout);
            }
        }
    }

    // Các hàm cần giữ nguyên từ code gốc:

    // 1. Hàm xử lý hiển thị typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'message received typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // 2. Hàm xử lý media
    function handleMediaUpload(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
                selectedMedia.push({
                    type: mediaType,
                    url: e.target.result
                });
                updateMediaPreview();
            }
            reader.readAsDataURL(file);
        });
    }

    // 3. Hàm cập nhật preview media
    function updateMediaPreview() {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'media-preview';
        
        selectedMedia.forEach((media, index) => {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.innerHTML = `
                ${media.type === 'image' 
                    ? `<img src="${media.url}" alt="Preview">`
                    : `<video src="${media.url}" controls></video>`
                }
                <button class="remove-preview" onclick="removeMediaPreview(${index})">×</button>
            `;
            previewContainer.appendChild(preview);
        });

        const existingPreview = chatInput.parentElement.querySelector('.media-preview');
        if (existingPreview) existingPreview.remove();
        
        if (selectedMedia.length) {
            chatInput.parentElement.insertBefore(previewContainer, chatInput);
        }
    }

    // 4. Các hàm xử lý tin nhắn
    function addMessageToDOM(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === 'Tôi' ? 'sent' : 'received'}`;
        messageElement.setAttribute('data-message-id', message.id);
        
        const mediaHTML = message.media ? message.media.map(media => `
            <div class="message-media">
                ${media.type === 'image' 
                    ? `<img src="${media.url}" alt="Media">`
                    : `<video src="${media.url}" controls></video>`
                }
            </div>
        `).join('') : '';

        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${message.sender}</span>
                    <span class="message-time">${formatTime(message.timestamp)}</span>
                    <button class="delete-btn" onclick="deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="message-text">${message.content}</div>
                ${mediaHTML}
            </div>
        `;

        chatMessages.appendChild(messageElement);
    }

    // 5. Hàm load tin nhắn
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        chatMessages.innerHTML = '';
        messages.forEach(message => addMessageToDOM(message));
        scrollToBottom();
    }

    // 6. Hàm lưu tin nhắn
    function saveMessage(message) {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        messages.push(message);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }

    // 7. Các hàm tiện ích
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // 8. Hàm xóa media preview
    window.removeMediaPreview = function(index) {
        selectedMedia.splice(index, 1);
        updateMediaPreview();
    }

    // 9. Hàm xóa tin nhắn
    window.deleteMessage = function(messageId) {
        if (confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
            const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
            const updatedMessages = messages.filter(m => m.id !== messageId);
            localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
            
            const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
            if (messageElement) {
                messageElement.remove();
            }
        }
    }

    // Khởi tạo
    if (isExpanded) {
        scheduleNextAutoMessage();
    }
});
