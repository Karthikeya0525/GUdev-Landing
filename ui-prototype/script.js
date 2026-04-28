document.addEventListener("DOMContentLoaded", function() {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const messageList = document.getElementById('messageList');
    const chatContainer = document.getElementById('chatContainer');

    // Function to handle automatic scrolling to the bottom
    const scrollToBottom = () => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    };

    // 1. Dynamic Button State (Enable/Disable based on input)
    userInput.addEventListener('input', () => {
        const hasValue = userInput.value.trim().length > 0;
        sendBtn.disabled = !hasValue;
    });

    // 2. Real-Time Message Logic
    chatForm.addEventListener('submit', function(event) {
        // Prevent page reload
        event.preventDefault();

        const text = userInput.value.trim();
        if (!text) return;

        // --- INSTANT UI UPDATE: USER MESSAGE ---
        
        // Create elements
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'message user-message';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;
        
        userMsgDiv.appendChild(bubble);
        
        // Append instantly
        messageList.appendChild(userMsgDiv);
        
        // Clear input instantly
        userInput.value = '';
        sendBtn.disabled = true;

        // Scroll instantly
        scrollToBottom();

        // --- SIMULATED INSTANT AI RESPONSE ---
        
        // Brief delay for natural feel, but logic is "on-spot"
        setTimeout(() => {
            const aiMsgDiv = document.createElement('div');
            aiMsgDiv.className = 'message ai-message';
            
            const aiBubble = document.createElement('div');
            aiBubble.className = 'bubble';
            aiBubble.textContent = `I've received your idea: "${text}". I'm now drafting your investor-ready PRD...`;
            
            aiMsgDiv.appendChild(aiBubble);
            messageList.appendChild(aiMsgDiv);
            
            scrollToBottom();
        }, 600);
    });
});
