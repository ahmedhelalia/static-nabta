

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll for sections
const sections = document.querySelectorAll('section');

function checkSections() {
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {
            section.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', checkSections);
checkSections(); // Check on initial load

// Mobile navigation toggle
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navItems = document.querySelector('.nav_items');
const mobile_overlay = document.createElement('div');
mobile_overlay.className = 'nav-overlay';
document.body.appendChild(mobile_overlay);

mobileNavToggle.addEventListener('click', () => {
    navItems.classList.toggle('active');
    const icon = mobileNavToggle.querySelector('i');
    icon.classList.toggle('uil-bars');
    icon.classList.toggle('uil-times');
    mobile_overlay.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navItems.contains(e.target) &&
        !mobileNavToggle.contains(e.target) &&
        navItems.classList.contains('active')) {
        navItems.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        icon.classList.remove('uil-times');
        icon.classList.add('uil-bars');
        mobile_overlay.classList.remove('active');
    }
});
// Dashboard sidebar toggle
const showSidebarBtn = document.querySelector('#show__sidebar-btn');
const hideSidebarBtn = document.querySelector('#hide__sidebar-btn');
const sidebar = document.querySelector('.dashboard aside');
let sidebarState = localStorage.getItem('sidebarState') === 'open';

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

function openSidebar() {
    sidebar.classList.add('show');
    overlay.classList.add('show');
    showSidebarBtn.style.display = 'none';
    hideSidebarBtn.style.display = 'flex';
    localStorage.setItem('sidebarState', 'open');

    // Focus on first interactive element in sidebar
    const firstLink = sidebar.querySelector('a');
    if (firstLink) firstLink.focus();
}

function closeSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    showSidebarBtn.style.display = 'flex';
    hideSidebarBtn.style.display = 'none';
    localStorage.setItem('sidebarState', 'closed');
}

// Initialize sidebar state
if (sidebarState && window.innerWidth >= 992) {
    openSidebar();
}

if (showSidebarBtn) {
    showSidebarBtn.addEventListener('click', openSidebar);
}

if (hideSidebarBtn) {
    hideSidebarBtn.addEventListener('click', closeSidebar);
}

// Handle overlay click
overlay.addEventListener('click', closeSidebar);

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('show')) {
        closeSidebar();
    }
});

// Update sidebar state on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 992) {
            overlay.classList.remove('show');
        }
    }, 250);
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth < 992) {
        if (!sidebar.contains(e.target) &&
            !showSidebarBtn.contains(e.target) &&
            !hideSidebarBtn.contains(e.target)) {
            closeSidebar();
        }
    }
});
// chat bot
document.addEventListener('DOMContentLoaded', function () {

    // Enhanced conversation context with better state management
    let conversationContext = {
        lastCategory: null,
        conversationHistory: [],
        userPreferences: {},
        sessionStartTime: Date.now(),
        messageCount: 0,
        waitingForResponse: false,
        lastBotResponse: null
    };

    // Enhanced bot responses with better categorization and natural flow
    const botResponses = {
        greeting: {
            keywords: ['مرحبا', 'السلام', 'اهلا', 'صباح الخير', 'مساء الخير', 'السلام عليكم', 'أهلاً', 'هلا'],
            responses: [
                'مرحباً بك في نبتة!  أنا هنا لمساعدتك في رحلتك نحو حياة أسرية سعيدة. كيف يمكنني مساعدتك اليوم؟',
                'أهلاً وسهلاً!  نبتة هي منصتك المتخصصة في الاستشارات الأسرية والزوجية. ما الذي تبحث عنه تحديداً؟',
                'مرحباً! سعيد بلقائك في نبتة  سواء كنت مقبلاً على الزواج أو تبحث عن نصائح في التربية، أنا هنا لمساعدتك!'
            ],
            followUp: null
        },

        marriage_prep: {
            keywords: ['خطوبة', 'زواج', 'مقبل', 'عريس', 'عروس', 'قبل الزواج', 'خاطب', 'مخطوبة', 'عقد', 'قران'],
            responses: [
                'مبروك! مرحلة ما قبل الزواج مهمة جداً في بناء أساس قوي لحياتك الزوجية. يمكنك الاطلاع على دليلنا الشامل في <a href="stage1.html">قسم ما قبل الزواج</a>',
                'رائع! الاستعداد للزواج خطوة ذكية. نقدم استشارات متخصصة للمقبلين على الزواج مع خبراء معتمدين. تصفح <a href="stage1.html#v4">قائمة مستشارينا</a>',
                'تهانينا على هذه الخطوة المهمة!  لدينا برامج متخصصة للتأهيل للزواج تغطي جميع الجوانب المهمة لحياة زوجية ناجحة'
            ],
            followUp: ['هل تحتاج نصائح حول التواصل مع شريك حياتك؟', 'هل تريد معرفة كيفية التعامل مع ضغوط التحضير للزواج؟', 'هل لديك استفسارات حول الاستعداد النفسي للزواج؟']
        },

        family_issues: {
            keywords: ['مشكلة', 'خلاف', 'صعوبة', 'زوجية', 'عائلية', 'مشاكل', 'نزاع', 'خصام', 'سوء تفاهم', 'تفاهم'],
            responses: [
                'أتفهم ما تمر به، والمشاكل الأسرية طبيعية في كل بيت. المهم هو كيفية التعامل معها بحكمة. يمكنك التحدث مع أحد مستشارينا المتخصصين <a href="consultations.html">احجز استشارة الآن</a>',
                'لا تقلق، معظم العائلات تواجه تحديات. نحن هنا لمساعدتك في إيجاد حلول عملية. خبراؤنا متخصصون في حل المشكلات الأسرية <a href="consultations.html#experts-section">اختر مستشارك</a>',
                'كل أسرة لها تحدياتها، والمهم هو التعامل معها بطريقة إيجابية.  نقدم استشارات متخصصة تساعدك في تجاوز هذه المرحلة'
            ],
            followUp: ['هل المشكلة تتعلق بالتواصل أم بموضوع آخر؟', 'هل تحتاج للتحدث مع مستشار مختص الآن؟', 'هل تريد نصائح عملية للتعامل مع الموقف؟']
        },

        children: {
            keywords: ['طفل', 'اطفال', 'ابن', 'ابناء', 'تربية', 'مراهق', 'بنت', 'ولد', 'اولاد', 'صغار'],
            responses: [
                'تربية الأطفال فن وعلم!  نقدم نصائح وإرشادات متخصصة تساعدك في تربية أطفالك بطريقة صحية. زر <a href="stage3.html">قسم مرحلة الأبناء</a>',
                'الأطفال هم زهور الحياة وتربيتهم مسؤولية كبيرة. لدينا خبراء متخصصون في التربية الإيجابية والتعامل مع المراحل العمرية المختلفة',
                'كل مرحلة من مراحل نمو الطفل لها خصائصها وتحدياتها.  نساعدك في فهم طفلك وتطوير مهاراتك التربوية'
            ],
            followUp: ['ما هي المرحلة العمرية لطفلك؟', 'هل تواجه تحدي معين في التربية؟', 'هل تريد نصائح حول التعامل مع سلوك معين؟']
        },

        courses: {
            keywords: ['دورة', 'تدريب', 'تعلم', 'ورشة', 'كورس', 'دورات', 'تأهيل', 'شهادة'],
            responses: [
                'ممتاز! التعلم المستمر مفتاح النجاح في الحياة الأسرية.  نقدم دورات متخصصة في التطوير الأسري والزوجي <a href="courses.html">تصفح دوراتنا</a>',
                'الاستثمار في تطوير الذات والمهارات الأسرية استثمار رائع! اكتسب مهارات جديدة مع دوراتنا التدريبية المتخصصة <a href="courses.html">اكتشف الدورات المتاحة</a>',
                'لدينا برامج تدريبية شاملة تغطي جميع جوانب الحياة الأسرية والزوجية.  من التأهيل للزواج إلى فنون التربية'
            ],
            followUp: ['هل تبحث عن دورة في مجال معين؟', 'هل تفضل الدورات الحضورية أم الأونلاين؟', 'هل تريد معرفة مواعيد الدورات القادمة؟']
        },

        psychological: {
            keywords: ['نفسي', 'اكتئاب', 'قلق', 'توتر', 'ضغط', 'نفسية', 'مزاج', 'حزن', 'سعادة', 'راحة'],
            responses: [
                'الصحة النفسية أساس الحياة السعيدة والأسرة المستقرة.  يمكنك استشارة متخصصينا النفسيين <a href="consultations.html">من هنا</a>',
                'اهتمامك بصحتك النفسية خطوة مهمة جداً. نقدم دعماً نفسياً متخصصاً للأزواج والعائلات <a href="consultations.html#experts-section">تحدث مع مستشارينا</a>',
                'الحالة النفسية تؤثر على كل جوانب الحياة الأسرية.  لدينا متخصصون في الصحة النفسية يساعدونك في التعامل مع التحديات'
            ],
            followUp: ['هل تحتاج دعم نفسي فوري؟', 'هل تريد نصائح للتعامل مع الضغوط اليومية؟', 'هل تفضل جلسة استشارة فردية أم جماعية؟']
        },

        community: {
            keywords: ['مجتمع', 'منتدى', 'تجارب', 'مشاركة', 'نقاش', 'أعضاء', 'مجموعة'],
            responses: [
                'المجتمع قوة!  شارك تجاربك واستفد من تجارب الآخرين في <a href="community.html">منتدى نبتة</a>',
                'التعلم من تجارب الآخرين يثري خبراتك الشخصية. انضم لمجتمعنا الداعم <a href="community.html">زر المنتدى</a>',
                'في نبتة، نؤمن بقوة المجتمع الداعم.  شارك واستفد من خبرات مجتمعنا المتميز'
            ],
            followUp: ['هل تريد مشاركة تجربة معينة؟', 'هل تبحث عن نصائح في موضوع محدد؟', 'هل تريد التواصل مع أعضاء لديهم تجارب مشابهة؟']
        },
        help: {
            keywords: ['مساعدة', 'ساعدني', 'محتاج', 'عايز', 'ممكن', 'كيف', 'ازاي', 'وين'],
            responses: [
                'بالطبع! أنا هنا لمساعدتك.  يمكنك أن تسألني عن أي شيء يتعلق بالحياة الأسرية والزوجية',
                'أكيد راح أساعدك! وضح لي إيش تحتاج وراح أوجهك للمكان الصحيح',
                'لا تتردد في السؤال!  نبتة هنا لدعمك في كل خطوة'
            ],
            followUp: null
        },
        thanks: {
            keywords: ['شكرا', 'شكراً', 'مشكور', 'يعطيك العافية', 'جزاك الله', 'الله يعطيك'],
            responses: [
                'العفو! سعيد إني قدرت أساعدك  لا تتردد في السؤال أي وقت',
                'أهلاً وسهلاً! دايماً في الخدمة',
                'من دواعي سروري! أتمنى لك حياة أسرية سعيدة '
            ],
            followUp: null
        },
        about: {
            keywords: ['ما هو', 'عن الموقع', 'هدف', 'الغرض', 'لماذا', 'تعريف', 'نبتة', 'موقع نبتة', 'نبذة', 'معلومات عن الموقع'],
            responses: [
                'موقع نبتة هو منصة متخصصة لدعم الأسر والأزواج في العالم العربي، من خلال تقديم استشارات أسرية وزوجية، دورات تدريبية، ومجتمع تفاعلي لتبادل الخبرات.',
                'هدف نبتة هو تعزيز جودة الحياة الأسرية عبر محتوى موثوق، استشارات مع خبراء، ودعم نفسي وتربوي للأسر والأفراد.',
                'نبتة تجمع بين الخبرة العلمية والدعم المجتمعي لتقديم حلول عملية لمشاكل الحياة الأسرية والزوجية، وتوفير بيئة آمنة للنقاش والتعلم.'
            ],
            followUp: null
        }
    };

    // Enhanced keyword matching with Arabic language considerations
    const arabicTextProcessor = {
        normalize: function (text) {
            // Normalize Arabic text for better matching
            return text
                .replace(/[أإآ]/g, 'ا')
                .replace(/[ة]/g, 'ه')
                .replace(/[ى]/g, 'ي')
                .toLowerCase()
                .trim();
        },

        hasKeyword: function (text, keywords) {
            const normalizedText = this.normalize(text);
            return keywords.some(keyword =>
                normalizedText.includes(this.normalize(keyword))
            );
        }
    };

    // Enhanced response system with better context awareness
    const responseSystem = {
        findBestMatch: function (message) {
            let bestMatch = null;
            let highestScore = 0;

            for (const [category, data] of Object.entries(botResponses)) {
                if (arabicTextProcessor.hasKeyword(message, data.keywords)) {
                    // Calculate relevance score based on keyword matches
                    let score = data.keywords.filter(keyword =>
                        arabicTextProcessor.hasKeyword(message, [keyword])
                    ).length;

                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = { category, data };
                    }
                }
            }

            return bestMatch;
        },

        getSmartResponse: function (category, responses, isFollowUp = false) {
            // Avoid repeating the same response
            let availableResponses = responses.filter(response =>
                response !== conversationContext.lastBotResponse
            );

            if (availableResponses.length === 0) {
                availableResponses = responses;
            }

            const baseResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
            conversationContext.lastBotResponse = baseResponse;

            return baseResponse;
        },

        getContextualFollowUp: function (category, followUps) {
            if (!followUps || followUps.length === 0) return null;

            // Don't always show follow-up to avoid being pushy
            if (Math.random() < 0.7) {
                return followUps[Math.floor(Math.random() * followUps.length)];
            }
            return null;
        }
    };

    // DOM elements
    const chatButton = document.querySelector('.chat-button');
    const chatContainer = document.querySelector('.chat-container');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    // Initialize chat with welcome message
    function initializeChat() {
        const welcomeMessage = 'مرحباً بك في نبتة! أنا مساعدك الذكي للاستشارات الأسرية والزوجية. كيف يمكنني مساعدتك اليوم؟';
        addMessage(welcomeMessage, 'bot-message');
    }

    // Enhanced message sending with better error handling
    function sendMessage(message) {
        if (conversationContext.waitingForResponse) {
            return; // Prevent multiple messages while processing
        }

        conversationContext.waitingForResponse = true;
        conversationContext.messageCount++;

        // Add user message
        addMessage(message, 'user-message');

        // Add to conversation history
        conversationContext.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: Date.now()
        });

        // Show enhanced typing indicator
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();

        // Process bot response with realistic delay
        const responseDelay = Math.random() * 1000 + 1000; // 1-2 seconds
        setTimeout(() => {
            typingIndicator.remove();

            const response = generateBotResponse(message);
            addMessage(response, 'bot-message');

            // Add to conversation history
            conversationContext.conversationHistory.push({
                type: 'bot',
                message: response,
                timestamp: Date.now()
            });

            conversationContext.waitingForResponse = false;
            scrollToBottom();
        }, responseDelay);
    }

    // Enhanced bot response generation
    function generateBotResponse(message) {
        const match = responseSystem.findBestMatch(message);

        if (match) {
            const { category, data } = match;
            conversationContext.lastCategory = category;

            const baseResponse = responseSystem.getSmartResponse(category, data.responses);
            const followUp = responseSystem.getContextualFollowUp(category, data.followUp);

            if (followUp) {
                return `${baseResponse}\n\n${followUp}`;
            }
            return baseResponse;
        }

        // Enhanced fallback responses
        return getIntelligentFallback(message);
    }

    // Intelligent fallback for unmatched messages
    function getIntelligentFallback(message) {
        const fallbackResponses = [
            'أعتذر، لم أفهم سؤالك تماماً. هل يمكنك توضيحه أكثر؟ أو اختر من المواضيع التالية: الزواج، التربية، الاستشارات، الدورات',
            'ممكن تعيد صياغة سؤالك بطريقة أخرى؟  أنا متخصص في المساعدة بالمواضيع الأسرية والزوجية',
            'لم أتمكن من فهم طلبك بوضوح. هل تقصد شيئاً متعلقاً بالحياة الأسرية أو الزوجية؟ '
        ];

        // If user seems frustrated, offer direct help
        if (conversationContext.messageCount > 3 &&
            arabicTextProcessor.hasKeyword(message, ['مش فاهم', 'ما بعرف', 'صعب', 'مو واضح'])) {
            return 'أعتذر للالتباس!  دعني أساعدك بطريقة أفضل. يمكنك التواصل مباشرة مع أحد مستشارينا <a href="consultations.html">من هنا</a> أو تصفح أقسام الموقع الرئيسية للحصول على المعلومات التي تحتاجها.';
        }

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // Enhanced message display with better formatting
    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;

        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
        `;

        // Enhanced link handling
        const links = messageDiv.getElementsByTagName('a');
        Array.from(links).forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Add a small delay to show the click was registered
                link.style.opacity = '0.7';
                setTimeout(() => {
                    window.location.href = link.href;
                }, 200);
            });
        });

        chatMessages.appendChild(messageDiv);

        // Add entrance animation
        setTimeout(() => {
            messageDiv.classList.add('message-entered');
        }, 50);
    }

    // Enhanced typing indicator
    function createTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        return typingIndicator;
    }

    // Smooth scrolling
    function scrollToBottom() {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Enhanced event listeners
    chatButton.addEventListener('click', () => {
        const isVisible = chatContainer.style.display === 'block';
        chatContainer.style.display = isVisible ? 'none' : 'block';

        if (!isVisible && conversationContext.messageCount === 0) {
            initializeChat();
        }
    });

    chatSend.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message && !conversationContext.waitingForResponse) {
            sendMessage(message);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message && !conversationContext.waitingForResponse) {
                sendMessage(message);
                chatInput.value = '';
            }
        }
    });

    // Enhanced input handling
    chatInput.addEventListener('input', () => {
        // Auto-resize input if needed
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // Prevent chat from closing when clicking inside
    chatContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatContainer.contains(e.target) && !chatButton.contains(e.target)) {
            if (chatContainer.style.display === 'block') {
                chatContainer.style.display = 'none';
            }
        }
    });

    // Session management
    window.addEventListener('beforeunload', () => {
        // Save conversation context if needed
        localStorage.setItem('nabta_chat_context', JSON.stringify({
            lastCategory: conversationContext.lastCategory,
            messageCount: conversationContext.messageCount,
            sessionDuration: Date.now() - conversationContext.sessionStartTime
        }));
    });

});