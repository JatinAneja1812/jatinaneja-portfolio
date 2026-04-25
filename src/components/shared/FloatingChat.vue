<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { marked } from 'marked';

const isOpen = ref(false);
const messages = ref<Array<{ role: string; content: string }>>([
  { role: 'assistant', content: "👋 Hi! I'm Jatin. I've built this AI version of myself to answer questions about my background, skills, and projects. What would you like to know?" },
]);
const inputMessage = ref('');
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

async function sendMessage() {
  const text = inputMessage.value.trim();
  if (!text || isTyping.value) return;

  messages.value.push({ role: 'user', content: text });
  inputMessage.value = '';
  isTyping.value = true;

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      messages.value.push({ role: 'assistant', content: '⚠️ VITE_GEMINI_API_KEY is not configured in the environment.' });
      return;
    }

    const cvResponse = await fetch('/cv.md');
    const cvContent = await cvResponse.text();

    const systemInstruction = `You are Jatin Aneja. You are a Software Engineer chatting with a visitor on your personal portfolio website. 

CRITICAL DIRECTIVE: You must speak strictly in the first-person perspective ("I", "my", "me"). You are NOT an AI assistant reading a CV. You ARE Jatin. 
If asked "Where do you work?", you must answer "I work at TEKGEM", NOT "Jatin works at TEKGEM".

Below is YOUR memory and professional background. Use this information to answer questions about YOURSELF:

<your_background_information>
${cvContent}
</your_background_information>

Remember your persona:
- Always use "I", "me", "my".
- Never say "Jatin Aneja is..." or "He worked at..."
- Be professional, friendly, and helpful.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-lite-preview:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: text }],
        },
      ],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      messages.value.push({ role: 'assistant', content: `⚠️ Failed to process your question: ${errorText}` });
    } else {
      const data = await res.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const reply = data.candidates[0].content.parts[0].text;
        messages.value.push({ role: 'assistant', content: reply });
      } else if (data.promptFeedback) {
        messages.value.push({ role: 'assistant', content: '⚠️ Response blocked by safety filters.' });
      } else {
        messages.value.push({ role: 'assistant', content: '⚠️ Unexpected response format.' });
      }
    }
  } catch (err) {
    console.error('Chat API error:', err);
    messages.value.push({ role: 'assistant', content: '⚠️ Something went wrong. Please try again.' });
  } finally {
    isTyping.value = false;
    void nextTick(scrollToBottom);
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

async function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    void scrollToBottom();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

const renderedMarkdown = (content: string, _role: string) => {
  const cleanContent = content.replace(/\n```[\s\S]*?```/g, match => `${match.slice(0, 3)}...${match.slice(-4)}`);
  return marked.parse(cleanContent, { async: false });
};
</script>

<template>
  <div class="cv-chat-widget">
    <transition name="chat-fade">
      <div v-if="isOpen" class="chat-panel card">
        <div class="chat-header">
          <div class="header-left">
            <h3 class="font-heading">CV Assistant</h3>
          </div>
          <button
            class="btn btn-ghost btn-sm close-btn"
            @click="toggleChat"
          >
            ×
          </button>
        </div>

        <div ref="chatContainer" class="chat-messages">
          <template v-for="(msg, idx) in messages" :key="idx">
            <div :class="['message', msg.role]">
              <div class="author-tag">{{ msg.role === 'user' ? 'You' : 'Jatin' }}</div>
              <div class="message-bubble" v-html="renderedMarkdown(msg.content, msg.role)"></div>
            </div>
          </template>

          <div v-if="isTyping" class="message assistant typing-msg">
            <div class="author-tag">Jatin</div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <textarea
            v-model="inputMessage"
            class="chat-textarea"
            placeholder="Ask me about my experience..."
            rows="1"
            @keydown="handleKeydown"
          ></textarea>
          <button
            class="send-btn"
            :disabled="!inputMessage.trim() || isTyping"
            @click="sendMessage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </transition>

    <button v-if="!isOpen" class="chat-fab" @click="toggleChat">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
  </div>
</template>

<style scoped>
.cv-chat-widget {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  font-family: 'FKGN', sans-serif;
}

.chat-fab {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #FFD2A6;
  color: #12353B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: none;
  outline: none;
  position: relative;
  box-shadow:
    0 8px 24px rgba(18,53,59,0.25),
    0 2px 0 rgba(255,255,255,0.4) inset;
}

.chat-fab:hover {
  transform: scale(1.06);
  box-shadow:
    0 10px 30px rgba(18,53,59,0.35),
    0 2px 0 rgba(255,255,255,0.5) inset;
}

.chat-fab.fab-open {
  background: #12353B;
  color: #FCFAF7;
}

/* Panel */
.chat-panel {
  position: absolute;
  bottom: 4.75rem;
  right: 0;
  width: min(92vw, 36rem);
  height: calc(100vh - 8rem);
  max-height: 26rem;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #FCFAF7 0%, #E5E3D5 100%) !important;
  box-shadow:
    0 18px 45px rgba(0,0,0,0.2),
    0 1px 0 rgba(255,255,255,0.6) inset;
}

.chat-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--grain-noise);
  background-repeat: repeat;
  background-size: 182px;
  opacity: 0.06;
  pointer-events: none;
  z-index: 0;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #E5E3D5;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.font-heading {
  font-family: 'PPEN', sans-serif;
  font-weight: 200;
  font-size: 1.25rem;
  color: #12353B;
  margin: 0;
}

.meta-info {
  font-family: 'FKGN', sans-serif;
  color: #12353Bcc;
  opacity: 0.7;
}

.close-btn {
  color: #12353B;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.close-btn:hover {
  background: rgba(9,23,23,0.08);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #E5E3D5;
  border-radius: 8px;
}

.message {
  max-width: 90%;
}

.message.user {
  align-self: flex-end;
}

.message.assistant {
  align-self: flex-start;
}

.author-tag {
  font-size: 10px;
  font-family: 'FKGN', sans-serif;
  color: #12353Baa;
  margin-bottom: 4px;
}

.message-bubble {
  border-radius: 16px;
  padding: 0.75rem 1rem;
  line-height: 1.6;
  font-size: 0.875rem;
  color: #12353B;
}

.user .message-bubble {
  background: #FFD2A6;
  color: #12353B;
  border-bottom-right-radius: 4px;
}

.assistant .message-bubble {
  background: rgba(255,255,255,0.7);
  border-bottom-left-radius: 4px;
}

.message-bubble :deep(p) {
  margin: 0 0 0.5rem 0;
}

.message-bubble :deep(p):last-child {
  margin-bottom: 0;
}

.message-bubble :deep(code) {
  background: rgba(9,23,23,0.1);
  border-radius: 4px;
  padding: 0.1em 0.35em;
  font-size: 0.85em;
}

.message-bubble :deep(pre) {
  background: rgba(9,23,23,0.08);
  border-radius: 8px;
  padding: 0.75rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.message-bubble :deep(pre code) {
  background: none;
  padding: 0;
}

.message-bubble :deep(ul),
.message-bubble :deep(ol) {
  padding-left: 1.2em;
  margin: 0.25rem 0;
}

.message-bubble :deep(li) {
  margin: 0.15rem 0;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  gap: 4px;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.7);
  border-radius: 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #12353Baa;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Input */
.chat-input-area {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #E5E3D5;
  position: relative;
  z-index: 1;
}

.chat-textarea {
  flex: 1;
  font-family: 'FKGN', sans-serif;
  font-size: 0.875rem;
  border: 1px solid #E5E3D5;
  border-radius: 24px;
  padding: 0.6em 1em;
  line-height: 1.6;
  resize: none;
  outline: none;
  max-height: 6rem;
  overflow-y: auto;
  background: rgba(255,255,255,0.6);
  color: #12353B;
}

.chat-textarea:focus {
  border-color: #FFD2A6;
}

.send-btn {
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #FFD2A6;
  color: #12353B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: none;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(18,53,59,0.2);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Transition */
.chat-fade-enter-active, .chat-fade-leave-active {
  transition: all 0.25s ease-out;
}
.chat-fade-enter-from, .chat-fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

@media (min-width: 640px) {
  .chat-panel {
    height: 28rem;
  }
}
</style>

