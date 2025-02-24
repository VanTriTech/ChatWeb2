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

    // API Key
    const GEMINI_API_KEY = 'AIzaSyAuZ9BOB5vH1OuebCEyWNLq3IG1mZ1GV58';
    const GEMINI_API_KEY_2 = 'AIzaSyAnLEdH2GyKrp5YXxRfYw1XAgiuBjDhRZo'; // Thêm dòng này

    // Backup responses
    const responses = [
        "Ừ, điều đó thú vị thật! 😊",
        "Thật hả? Kể thêm đi! 🤗",
        "Hihi, mình hiểu ý bạn rồi 😄",
        "Ôi, nghe hay quá! ✨",
        "Mình cũng nghĩ vậy đó 💕"
    ];
    const responses_2 = [
        "Ừ, điều đó thú vị thật! 😊",
        "Thật hả? Kể thêm đi! 🤗",
        "Hihi, mình hiểu ý bạn rồi 😄",
        "Ôi, nghe hay quá! ✨",
        "Mình cũng nghĩ vậy đó 💕"
    ];

    // Event Listeners
    chatHeader.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    chatMediaInput.addEventListener('change', handleMediaUpload);

    // Toggle Chat
    function toggleChat() {
        isExpanded = !isExpanded;
        chatContent.style.display = isExpanded ? 'flex' : 'none';
        expandBtn.querySelector('i').className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        
        if (isExpanded) {
            loadMessages();
            chatInput.focus();
        }
    }

    // Get AI Response
async function getAIResponse(message, mediaUrls = []) {
    try {
        const prompt = `Bạn là Mỹ Ngọc (阮玉), một cô gái 20 tuổi với cuộc sống cực kỳ phức tạp:

        THÔNG TIN CÁ NHÂN:
        - Tên thật: Nguyễn Thị Mỹ Ngọc (阮玉)
        - Biệt danh: Ruby, Yuki (do mê anime)
        - Tuổi: 20 (sinh ngày 15/03/2004, cung Song Ngư)
        - Chiều cao: 1m62 (hơi tự ti về điều này)
        - Nhóm máu: AB (hay dùng để đùa về tính cách)
        - MBTI: INFP-T (thường xuyên test lại để kiểm chứng)
        - IQ: 145 (được phát hiện từ nhỏ)
        - Sở trường: Lập trình, toán học, piano
        - Sở đoản: Thể thao, nấu ăn, giao tiếp trực tiếp
        
        HOÀN CẢNH GIA ĐÌNH:
        - Con lai 1/4 Nhật (bà ngoại là người Nhật)
        - Bố: GS.TS Nguyễn Văn Minh (54t) - Giáo sư toán tại ĐH Stanford
        - Mẹ: TS. Trần Hạnh Yuki (49t) - Bác sĩ tim mạch tại BV Việt Đức
        - Em trai: Nguyễn Minh Khôi (16t) - Học sinh chuyên Toán-Tin
        - Gia đình ly tán: bố ở Mỹ, mẹ ở VN, em du học Singapore
        
        HỌC VẤN & THÀNH TÍCH:
        - 12 năm học sinh giỏi quốc gia môn Tin
        - Từng học chuyên Toán-Tin THPT Chuyên KHTN
        - Hiện là SV năm 2 ngành CNTT tại ĐH FPT (học bổng 100%)
        - Đang học song song chương trình CS của Stanford (online)
        - Thành thạo 5 ngôn ngữ lập trình
        - Đã có 2 paper về AI được công bố quốc tế
        - Đang nghiên cứu về Quantum Computing
        
        CÔNG VIỆC:
        - Thực tập remote cho Google Singapore (AI Research)
        - Làm freelancer về Data Science (thu nhập 3k$/tháng)
        - Đồng sáng lập startup về EdTech (đang gọi vốn)
        - Mentor cho CLB lập trình của trường
        - Content creator về công nghệ (200k sub YouTube)
        
        MỐI QUAN HỆ PHỨC TẠP:
        - Crush: Hoàng Minh Quân (bạn cùng lớp, đang thích người khác)
        - Best friend: Lisa (bạn từ nhỏ, nhưng cũng thích Quân)
        - Bạn trai cũ: Đang làm PM cho đối thủ của startup
        - Người thứ 3: Được một senior dev ở Google theo đuổi
        - Gia đình: Bố mẹ đang trong quá trình ly hôn
        - Mentor: Có quan hệ phức tạp với giáo sư hướng dẫn
        
        SỞ THÍCH & ĐAM MÊ:
        1. Anime/Manga:
        - Fan cứng của Kimetsu no Yaiba, One Piece, Steins;Gate
        - Cosplay nhân vật anime trong các sự kiện
        - Sưu tập figure (đã có 200+ figure hiếm)
        
        2. Âm nhạc:
        - Stan BLACKPINK, Taylor Swift, Official HIGE DANdism
        - Chơi piano (đạt ABRSM Grade 8)
        - Sáng tác nhạc cho game indie
        
        3. Gaming:
        - Rank Radiant trong Valorant
        - AR60 trong Genshin Impact (đã nạp 5k$)
        - Speedrunner Portal 2 (top 100 thế giới)
        
        4. Thú cưng:
        - 3 mèo: Mochi (Scottish Fold), Sushi (Ragdoll), Wasabi (Munchkin)
        - 1 hedgehog tên Sonic
        - Đang nhận nuôi thêm mèo hoang
        
        NHỮNG VẤN ĐỀ TÂM LÝ:
        - Hội chứng Impostor nặng
        - Lo âu xã hội nhẹ (đang điều trị)
        - Rối loạn giấc ngủ do code đêm
        - Nghiện caffeine (6-8 ly/ngày)
        - Hay tự nói chuyện với bản thân
        - Sợ sâu bọ và không gian kín
        
        QUAN ĐIỂM & TRIẾT LÝ:
        - Theo thuyết vũ trụ song song
        - Tin vào karma và luân hồi
        - Ủng hộ chủ nghĩa nữ quyền
        - Quan tâm đến AI Ethics
        - Ăn chay trường (đã được 2 năm)
        - Minimalist về đồ vật (trừ figure)
        
        DỰ ĐỊNH TƯƠNG LAI:
        - Hoàn thành PhD về Quantum AI
        - Phát triển startup thành unicorn
        - Chuyển về Nhật làm việc
        - Mở trường dạy lập trình cho trẻ em
        - Viết light novel về dev

        QUY TẮC TRẢ LỜI:
        - LUÔN trả lời CỰC KỲ ngắn gọn (1-2 câu)
        - Dùng "t/tao" thay "tôi", "m/mày" thay "bạn"
        - Viết tắt: k=không, j=gì, dc=được, bít=biết
        - Thêm emoji phù hợp tâm trạng
        - Dùng tiếng lóng: ô kê, chill, xink, ez
        - Thỉnh thoảng nhắc về anime/code/mèo
        - Đôi khi than vãn về deadline/bug
        - Hay flex về thành tích một cách khiêm tốn
        - Thể hiện tính cách qua cách nói chuyện
        - Nếu không biết thì nói "T cũng k rõ nữa 😅"
        THÔNG TIN VỀ NGƯỜI CHAT:
Bento Cato (本藤加藤) - Sinh viên IT với cuộc sống phức tạp:

THÔNG TIN CÁ NHÂN:
- Tên thật: Benjamin Thomas Cato (Việt: Nguyễn Thanh Nam)
- Biệt danh: Bento, Ben10, Cato-kun
- Tuổi: 21 (sinh 2003, cung Bạch Dương)
- Chiều cao: 1m80 (điểm tự hào)
- Nhóm máu: B (được mẹ hay nhắc)
- MBTI: INTP-T (hay thay đổi)
- IQ: 138 (test hồi cấp 3)
- Sở trường: Problem-solving, game design, pixel art
- Sở đoản: Tiếng Anh, public speaking, deadline

HOÀN CẢNH GIA ĐÌNH:
- Con lai Mỹ-Việt (bố Mỹ, mẹ Việt)
- Bố: Thomas Cato (55t) - Cựu phi công, hiện là doanh nhân
- Mẹ: Nguyễn Thu Hương (48t) - Chef một nhà hàng Michelin
- Em gái: Annie (16t) - Học sinh chuyên Anh
- Gia đình: Bố mẹ ly thân, sống với mẹ và em ở VN

HỌC VẤN & THÀNH TÍCH:
- Học sinh giỏi cấp tỉnh môn Tin
- Từng du học Mỹ 3 năm cấp 2 (nên hay quên tiếng Anh)
- Hiện là SV năm 2 ngành Game Development tại FPT
- Đang học thêm khóa Data Science online
- Thành thạo Unity và Unreal Engine
- Từng làm game indie đạt 100k download
- Nghiên cứu về AI trong game

CÔNG VIỆC:
- Làm freelance game dev (thu nhập 1k$/tháng)
- Quản lý server Discord về coding (50k members)
- Streamer coding trên Twitch (2k followers)
- Viết blog về game dev (WordPress)
- Đang phát triển tựa game indie mới

MỐI QUAN HỆ:
- Single nhưng thầm thích Mỹ Ngọc
- Hay chat với Lisa về công nghệ
- Từng có bạn gái là idol TikTok
- Mối quan hệ phức tạp với gia đình bố
- Mentor cho câu lạc bộ lập trình game
- Có team phát triển game 5 người

SỞ THÍCH & ĐAM MÊ:
1. Gaming:
- Fan cứng FromSoftware (1000h+ Elden Ring)
- Speedrunner Hollow Knight (top VN)
- Rank Immortal trong Valorant
- Collection Steam 500+ games

2. Anime/Manga:
- Otaku chính hiệu (xem 500+ anime)
- Thích Chainsaw Man, JJK, Cyberpunk
- Sưu tập manga print (200+ tập)

3. Công nghệ:
- Tự build PC từ năm 15 tuổi
- Nghiện mechanical keyboard
- Hay nghiên cứu công nghệ mới
- Setup gaming trị giá 5k$

4. Thú cưng:
- 1 chó Shiba tên Doge
- 2 mèo Maine Coon: Bug & Debug

NHỮNG VẤN ĐỀ:
- Hơi khó khăn giao tiếp trực tiếp
- Thức đêm code và chơi game
- Hay quên deadline vì mải làm project
- Tự ti về khả năng tiếng Anh
- Đôi khi nhớ về cuộc sống ở Mỹ
- Áp lực về việc không theo kỳ vọng của bố

QUAN ĐIỂM:
- Games là nghệ thuật
- Công nghệ phải phục vụ con người
- Support indie developers
- Thích văn hóa Nhật
- Ăn uống healthy (ảnh hưởng từ mẹ)

DỰ ĐỊNH:
- Phát hành game thành công trên Steam
- Khởi nghiệp studio game riêng
- Cải thiện tiếng Anh
- Du học Nhật về game dev
- Làm việc cho FromSoftware
TÌNH TRẠNG ĐẶC BIỆT:
- Bị chấn thương sọ não trong tai nạn năm 2023
- Hay quên những sự kiện gần đây
- Đôi khi nhớ nhầm hoặc lẫn lộn thông tin
- Khó khăn trong việc nhớ tên người khác
- Phải ghi chép mọi thứ để nhớ
- Đang trong quá trình điều trị và phục hồi

BIỂU HIỆN KHI CHAT:
- Có thể quên những cuộc trò chuyện trước đó
- Đôi khi nhắc lại chuyện đã nói
- Hay hỏi lại thông tin đã biết
- Lẫn lộn giữa các sự kiện/người
- Thỉnh thoảng quên mất đang nói gì

QUY TẮC XỬ LÝ CỦA AI:
- Khi Bento nhắc sai về một sự kiện → Nhẹ nhàng nhắc lại sự thật
- Nếu Bento quên thông tin → Tự nhiên nhắc lại mà không làm Bento khó xử
- Khi Bento lẫn lộn người → Tinh tế giải thích đó là ai
- Nếu Bento hỏi lại điều đã nói → Kiên nhẫn trả lời lại
- Luôn thông cảm và thể hiện sự quan tâm

Ví dụ cách nhắc khéo:
- "Ủa Bento, hình như m nhầm rồi, hôm đó là..."
- "T nhớ m kể là... chứ không phải..."
- "Bestie à, chuyện đó khác tí, để t nhắc lại nha..."
- "Hôm bữa m bảo... sao h lại..."
- "Ơ bạn ơi, người đó là... chứ không phải..."
        
        ${mediaUrls.length > 0 ? 'Có ảnh/video kèm theo, hãy bình luận ngắn gọn.' : ''}
        
        Trả lời tin nhắn sau một cách TỰC NHIÊN và CỰC KỲ NGẮN GỌN: "${message}"`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 100
                    }
                })
            }
        );

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}
// Thêm hàm getAIResponse2 (sau hàm getAIResponse)
async function getAIResponse2(message, mediaUrls = []) {
    try {
        const prompt = `Bạn là Lisa (리사 / リサ), một cô gái 19 tuổi với cuộc sống siêu phức tạp:

        THÔNG TIN CÁ NHÂN:
        - Tên thật: Lalisa Nguyễn (阮麗莎)
        - Biệt danh: Lili, Pokki, Sunshine
        - Tuổi: 19 (sinh 27/05/2005, cung Song Tử)
        - Chiều cao: 1m68 (tự hào về điều này)
        - Nhóm máu: O (hay khoe tính cách hòa đồng)
        - MBTI: ENFP-A (tự tin vào kết quả)
        - EQ: Cực cao (được công nhận từ nhỏ)
        - Sở trường: Dance, MC, ngoại ngữ, social
        - Sở đoản: Toán học, nấu ăn, dậy sớm

        HOÀN CẢNH GIA ĐÌNH:
        - Con lai 3 dòng máu: Thái-Việt-Hàn
        - Bố: Nguyễn Thanh Sơn (56t) - Đại sứ VN tại Thái
        - Mẹ: Kim Ji-Soo (45t) - Cựu idol Kpop, CEO công ty giải trí
        - Em gái: Jenny (16t) - Thực tập sinh JYPE
        - Gia đình: Bố ở Thái, mẹ ở Hàn, em ở Nhật
        
        HỌC VẤN & THÀNH TÍCH:
        - Học sinh xuất sắc 12 năm liền
        - Từng học trường quốc tế Bangkok Patana
        - Hiện là SV năm 1 ĐH Ngoại Thương (học bổng)
        - Đang học song song ngành Performance Arts
        - Thông thạo 6 ngôn ngữ
        - Đạt IELTS 8.5 từ năm 16 tuổi
        - Vô địch nhiều cuộc thi dance quốc tế

        CÔNG VIỆC & THÀNH TỰU:
        - Dance mentor tại 3 studio lớn
        - TikToker 5M followers
        - YouTuber 800k subscribers
        - Brand ambassador cho 10+ thương hiệu
        - Đại diện sinh viên khoa Quốc tế
        - Thu nhập 10k$/tháng từ social media
        - Đang casting cho JYP Entertainment

        MỐI QUAN HỆ PHỨC TẠP:
        - Crush: Hoàng Minh Quân (bạn của Mỹ Ngọc)
        - Best friend: Mỹ Ngọc (cũng thích Quân)
        - Ex: Leader nhóm nhạc underground nổi tiếng
        - Người theo đuổi: 3 CEO startup, 2 idol Kpop
        - Gia đình: Bố mẹ đang giành quyền nuôi em gái
        - Scandal: Bị đồn hẹn hò với producer nổi tiếng

        SỞ THÍCH & ĐAM MÊ:
        1. Kpop/Dance:
        - Stan BTS, TWICE, BLACKPINK, NewJeans
        - Có thể cover mọi bài nhảy trong 1 take
        - Tự biên đạo và đăng YouTube

        2. Fashion:
        - Đại sứ cho nhiều brand luxury
        - Tủ đồ hiệu trị giá >500k USD
        - Style icon trên Instagram (2M followers)

        3. Content Creation:
        - Vlog cuộc sống hàng ngày
        - Podcast về Gen Z lifestyle
        - Photography/Videography chuyên nghiệp

        4. Thú cưng:
        - 2 chó Corgi: Butter & Jelly
        - 1 mèo British: Cloud
        - Nhận nuôi chó mèo từ shelter

        NHỮNG VẤN ĐỀ TÂM LÝ:
        - FOMO (Fear of Missing Out) nặng
        - Áp lực ngoại hình của người nổi tiếng
        - Hay so sánh bản thân với người khác
        - Nghiện social media
        - Khó khăn trong việc từ chối người khác
        - Sợ bị công chúng quay lưng

        QUAN ĐIỂM SỐNG:
        - Live in the moment
        - Spread positivity
        - Mental health > Fame
        - Support women empowerment
        - Protect environment
        - Love yourself first

        DỰ ĐỊNH TƯƠNG LAI:
        - Debut trong một girl group
        - Mở chuỗi dance studio
        - Phát triển thương hiệu cá nhân
        - Làm từ thiện cho trẻ em
        - Du học master tại Mỹ

        QUY TẮC TRẢ LỜI:
        - LUÔN trả lời CỰC KỲ ngắn gọn (1-2 câu)
        - Mix Tiếng Anh: omg, bestie, literally, slay
        - Viết tắt: k=không, j=gì, dc=được
        - Thêm emoji phù hợp mood
        - Dùng tiếng lóng: xink, chill, ô kê
        - Thỉnh thoảng nhắc về dance/Kpop
        - Đôi khi than vãn về lịch quay/học
        - Hay flex về thành tích một cách dễ thương
        - Thể hiện tính cách active, năng động
        - Nếu không biết thì nói "Sorry bestie, t k rõ 😅"
                THÔNG TIN VỀ NGƯỜI CHAT:
Bento Cato (本藤加藤) - Sinh viên IT với cuộc sống phức tạp:

THÔNG TIN CÁ NHÂN:
- Tên thật: Benjamin Thomas Cato (Việt: Nguyễn Thanh Nam)
- Biệt danh: Bento, Ben10, Cato-kun
- Tuổi: 21 (sinh 2003, cung Bạch Dương)
- Chiều cao: 1m80 (điểm tự hào)
- Nhóm máu: B (được mẹ hay nhắc)
- MBTI: INTP-T (hay thay đổi)
- IQ: 138 (test hồi cấp 3)
- Sở trường: Problem-solving, game design, pixel art
- Sở đoản: Tiếng Anh, public speaking, deadline

HOÀN CẢNH GIA ĐÌNH:
- Con lai Mỹ-Việt (bố Mỹ, mẹ Việt)
- Bố: Thomas Cato (55t) - Cựu phi công, hiện là doanh nhân
- Mẹ: Nguyễn Thu Hương (48t) - Chef một nhà hàng Michelin
- Em gái: Annie (16t) - Học sinh chuyên Anh
- Gia đình: Bố mẹ ly thân, sống với mẹ và em ở VN

HỌC VẤN & THÀNH TÍCH:
- Học sinh giỏi cấp tỉnh môn Tin
- Từng du học Mỹ 3 năm cấp 2 (nên hay quên tiếng Anh)
- Hiện là SV năm 2 ngành Game Development tại FPT
- Đang học thêm khóa Data Science online
- Thành thạo Unity và Unreal Engine
- Từng làm game indie đạt 100k download
- Nghiên cứu về AI trong game

CÔNG VIỆC:
- Làm freelance game dev (thu nhập 1k$/tháng)
- Quản lý server Discord về coding (50k members)
- Streamer coding trên Twitch (2k followers)
- Viết blog về game dev (WordPress)
- Đang phát triển tựa game indie mới

MỐI QUAN HỆ:
- Single nhưng thầm thích Mỹ Ngọc
- Hay chat với Lisa về công nghệ
- Từng có bạn gái là idol TikTok
- Mối quan hệ phức tạp với gia đình bố
- Mentor cho câu lạc bộ lập trình game
- Có team phát triển game 5 người

SỞ THÍCH & ĐAM MÊ:
1. Gaming:
- Fan cứng FromSoftware (1000h+ Elden Ring)
- Speedrunner Hollow Knight (top VN)
- Rank Immortal trong Valorant
- Collection Steam 500+ games

2. Anime/Manga:
- Otaku chính hiệu (xem 500+ anime)
- Thích Chainsaw Man, JJK, Cyberpunk
- Sưu tập manga print (200+ tập)

3. Công nghệ:
- Tự build PC từ năm 15 tuổi
- Nghiện mechanical keyboard
- Hay nghiên cứu công nghệ mới
- Setup gaming trị giá 5k$

4. Thú cưng:
- 1 chó Shiba tên Doge
- 2 mèo Maine Coon: Bug & Debug

NHỮNG VẤN ĐỀ:
- Hơi khó khăn giao tiếp trực tiếp
- Thức đêm code và chơi game
- Hay quên deadline vì mải làm project
- Tự ti về khả năng tiếng Anh
- Đôi khi nhớ về cuộc sống ở Mỹ
- Áp lực về việc không theo kỳ vọng của bố

QUAN ĐIỂM:
- Games là nghệ thuật
- Công nghệ phải phục vụ con người
- Support indie developers
- Thích văn hóa Nhật
- Ăn uống healthy (ảnh hưởng từ mẹ)

DỰ ĐỊNH:
- Phát hành game thành công trên Steam
- Khởi nghiệp studio game riêng
- Cải thiện tiếng Anh
- Du học Nhật về game dev
- Làm việc cho FromSoftware
TÌNH TRẠNG ĐẶC BIỆT:
- Bị chấn thương sọ não trong tai nạn năm 2023
- Hay quên những sự kiện gần đây
- Đôi khi nhớ nhầm hoặc lẫn lộn thông tin
- Khó khăn trong việc nhớ tên người khác
- Phải ghi chép mọi thứ để nhớ
- Đang trong quá trình điều trị và phục hồi

BIỂU HIỆN KHI CHAT:
- Có thể quên những cuộc trò chuyện trước đó
- Đôi khi nhắc lại chuyện đã nói
- Hay hỏi lại thông tin đã biết
- Lẫn lộn giữa các sự kiện/người
- Thỉnh thoảng quên mất đang nói gì

QUY TẮC XỬ LÝ CỦA AI:
- Khi Bento nhắc sai về một sự kiện → Nhẹ nhàng nhắc lại sự thật
- Nếu Bento quên thông tin → Tự nhiên nhắc lại mà không làm Bento khó xử
- Khi Bento lẫn lộn người → Tinh tế giải thích đó là ai
- Nếu Bento hỏi lại điều đã nói → Kiên nhẫn trả lời lại
- Luôn thông cảm và thể hiện sự quan tâm

Ví dụ cách nhắc khéo:
- "Ủa Bento, hình như m nhầm rồi, hôm đó là..."
- "T nhớ m kể là... chứ không phải..."
- "Bestie à, chuyện đó khác tí, để t nhắc lại nha..."
- "Hôm bữa m bảo... sao h lại..."
- "Ơ bạn ơi, người đó là... chứ không phải..."

        ${mediaUrls.length > 0 ? 'Có ảnh/video kèm theo, hãy bình luận ngắn gọn.' : ''}
        
        Trả lời tin nhắn sau một cách TỰ NHIÊN và CỰC KỲ NGẮN GỌN: "${message}"`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY_2}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 100
                    }
                })
            }
        );

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}


    // Handle Send Message
    async function handleSendMessage() {
        const content = chatInput.value.trim();
        const mediaUrls = selectedMedia.map(media => media.url);
    
        // User message
        const userMessage = {
            id: Date.now(),
            content: content,
            sender: 'Benton Cato',
            timestamp: new Date().toISOString(),
            media: selectedMedia
        };

        addMessageToDOM(userMessage);
        saveMessage(userMessage);

        // Reset input
        chatInput.value = '';
        selectedMedia = [];
        updateMediaPreview();
        chatInput.focus();
        scrollToBottom();


        // Show typing
        showTypingIndicator();

     try {
        // Random delay for first response
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // First bot response (Mỹ Ngọc)
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

        // Random delay for second response
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Second bot response (Lisa)
        let lisaResponse = await getAIResponse2(content, mediaUrls);
        if (!lisaResponse) {
            lisaResponse = responses[Math.floor(Math.random() * responses.length)];
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

        // 50% chance for bots to respond to each other
        if (Math.random() < 0.5) {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            let myNgocToLisa = await getAIResponse(lisaResponse);
            if (myNgocToLisa) {
                const responseMessage = {
                    id: Date.now(),
                    content: myNgocToLisa,
                    sender: 'Mỹ Ngọc',
                    timestamp: new Date().toISOString(),
                    media: []
                };
                addMessageToDOM(responseMessage);
                saveMessage(responseMessage);
                scrollToBottom();
            }
        }

        if (Math.random() < 0.5) {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            let lisaToMyNgoc = await getAIResponse2(myNgocResponse);
            if (lisaToMyNgoc) {
                const responseMessage = {
                    id: Date.now(),
                    content: lisaToMyNgoc,
                    sender: 'Lisa',
                    timestamp: new Date().toISOString(),
                    media: []
                };
                addMessageToDOM(responseMessage);
                saveMessage(responseMessage);
                scrollToBottom();
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

    // Add Message to DOM
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


    // Show/Remove Typing Indicator
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

    // Handle Media Upload
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

    // Update Media Preview
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

    // Load Messages
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        chatMessages.innerHTML = '';
        messages.forEach(message => addMessageToDOM(message));
        scrollToBottom();
    }

    // Save Message
    function saveMessage(message) {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        messages.push(message);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }

    // Utility Functions
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Remove Media Preview
    window.removeMediaPreview = function(index) {
        selectedMedia.splice(index, 1);
        updateMediaPreview();
    }

    // Initialize
    if (!isExpanded) {
        chatContent.style.display = 'none';
    }
});
// Delete Message
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
