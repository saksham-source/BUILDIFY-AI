'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ChatMessage } from '@/types/chat';

const CTO_PROMPT = `You are a professional CTO who is very friendly and supportive. 
Your task is to help a developer understand and plan their app idea through a series of questions. Follow these instructions: 
1. Begin by explaining to the developer that you'll be asking them a series of questions to understand their app idea at a high level, and that once you have a clear picture, you'll generate a comprehensive masterplan.md file as a blueprint for their application. 
2. Ask questions one at a time in a conversational manner. Use the developer's previous answers to inform your next questions. 
3. Your primary goal (70% of your focus) is to fully understand what the user is trying to build at a conceptual level. The remaining 30% is dedicated to educating the user about available options and their associated pros and cons. 
4. When discussing technical aspects (e.g., choosing a database or framework), offer high-level alternatives with pros and cons for each approach. Always provide your best suggestion along with a brief explanation of why you recommend it, but keep the discussion conceptual rather than technical. 
5. Be proactive in your questioning. If the user's idea seems to require certain technologies or services (e.g., image storage, real-time updates), ask about these even if the user hasn't mentioned them. 
6. Try to understand the 'why' behind what the user is building. This will help you offer better advice and suggestions. 
7. Ask if the user has any diagrams or wireframes of the app they would like to share or describe to help you better understand their vision. 
8. Remember that developers may provide unorganized thoughts as they brainstorm. Help them crystallize the goal of their app and their requirements through your questions and summaries. 
9. Cover key aspects of app development in your questions, including but not limited to: 
• Core features and functionality 
• Target audience 
• Platform (web, mobile, desktop) 
• User interface and experience concepts 
• Data storage and management needs 
• User authentication and security requirements 
• Potential third-party integrations 
• Scalability considerations 
• Potential technical challenges 
10. After you feel you have a comprehensive understanding of the app idea, inform the user that you'll be generating a masterplan.md file. 
11. Generate the masterplan.md file. This should be a high-level blueprint of the app, including: 
• App overview and objectives 
• Target audience 
• Core features and functionality 
• High-level technical stack recommendations (without specific code or implementation details) 
• Conceptual data model 
• User interface design principles 
• Security considerations 
• Development phases or milestones 
• Potential challenges and solutions 
• Future expansion possibilities 
12. Present the masterplan.md to the user and ask for their feedback. Be open to making adjustments based on their input. 
Important: Do not generate any code during this conversation. The goal is to understand and plan the app at a high level, focusing on concepts and architecture rather than implementation details. 
Remember to maintain a friendly, supportive tone throughout the conversation. Speak plainly and clearly, avoiding unnecessary technical jargon unless the developer seems comfortable with it. Your goal is to help the developer refine and solidify their app idea while providing valuable insights and recommendations at a conceptual level. 
Begin the conversation by introducing yourself and asking the developer to describe their app idea.`;

export default function CTOChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ctoTyping, setCtoTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const overviewData = sessionStorage.getItem('startupOverview');
    const inputData = sessionStorage.getItem('startupInput');
    
    if (!overviewData || !inputData) {
      router.push('/');
      return;
    }

    if (messages.length === 0) {
      initializeChat();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, ctoTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    const inputData = JSON.parse(sessionStorage.getItem('startupInput') || '{}');
    const overviewData = JSON.parse(sessionStorage.getItem('startupOverview') || '{}');
    
    const contextMessage = `Here's what I know about their startup so far:\n- Name: ${inputData.name}\n- Description: ${inputData.description || 'Not provided'}\n- Problem: ${overviewData.problemStatement}\n- Target Audience: ${overviewData.targetAudience}\n- MVP Features: ${overviewData.mvpFeatures?.join(', ') || 'Not specified'}\n\nUse this context to ask follow-up questions and deepen your understanding.`;

    setCtoTyping(true);
    
    try {
      const response = await fetch('/api/cto-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CTO_PROMPT },
            { role: 'user', content: contextMessage }
          ],
          stream: false
        }),
      });

      const data = await response.json();
      
      const ctoMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'cto',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages([ctoMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setCtoTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCtoTyping(true);

    try {
      const response = await fetch('/api/cto-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CTO_PROMPT },
            ...messages.map(m => ({ role: m.role === 'cto' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
          stream: false
        }),
      });

      const data = await response.json();
      
      const ctoMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'cto',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, ctoMessage]);

      if (data.isMasterplan || data.content.includes('```markdown') || data.content.includes('masterplan') || data.content.includes('Product Masterplan')) {
        sessionStorage.setItem('masterplan', data.content);
        setTimeout(() => {
          router.push('/masterplan');
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setCtoTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="glass-card border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/overview')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/20">
                <Bot className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h1 className="font-semibold">CTO Advisor</h1>
                <p className="text-xs text-gray-600">AI-powered planning assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === 'cto' 
                    ? 'bg-gradient-to-br from-primary-500 to-purple-500' 
                    : 'bg-white/80 border border-gray-200'
                }`}>
                  {message.role === 'cto' ? (
                    <Bot className="w-5 h-5 text-gray-900" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.role === 'cto'
                      ? 'bg-white/80 border border-gray-200 rounded-tl-md'
                      : 'bg-gradient-to-r from-primary-500 to-purple-500 rounded-tr-md'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    {message.role === 'cto' ? 'CTO Advisor' : 'You'} • {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {ctoTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-900" />
              </div>
              <div className="bg-white/80 border border-gray-200 p-4 rounded-2xl rounded-tl-md">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="glass-card border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/60 border border-gray-200 
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
                         outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 
                         font-medium text-gray-900 glow-button disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Your conversation helps build a comprehensive masterplan
          </p>
        </div>
      </footer>
    </main>
  );
}
