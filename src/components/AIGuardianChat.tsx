import React, { useState } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { queryAIGuardian } from '../services/aiService';
import { ChatMessage } from '../types';

export const AIGuardianChat: React.FC = () => {
  const { airData, userProfile, apiKey } = useAirGuard();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      content: `Hello ${userProfile.name}! 👋 I'm **AirGuard Guardian**, your personal air-pollution assistant.\n\nToday's ambient AQI is **${airData.aqi} (${airData.categoryLabel})** at ${airData.locationName}. How can I help you navigate your activities or minimize your exposure today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    'Can I go running now?',
    "What's the safest time to go outside?",
    'Which route should I take?',
    'Why is pollution high today?',
    'Is my college area safe?',
    'Compare today with yesterday.',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setIsTyping(true);

    try {
      const response = await queryAIGuardian(textToSend, airData, userProfile, apiKey);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        content: `⚠️ Sorry, I encountered a temporary error while processing that question. Please try asking again or check your network connection.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
              Ask AirGuard
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Powered by Gemini / LangChain
              </span>
            </h3>
            <p className="text-xs text-slate-400">Your personal environmental health decision assistant</p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400 hidden sm:block">
          <div>Current AQI: <strong className="text-emerald-400">{airData.aqi}</strong></div>
          <div>User: <strong className="text-slate-200">{userProfile.name} ({userProfile.age}y)</strong></div>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-slate-400 text-[11px] font-bold uppercase shrink-0">Try Asking:</span>
        {suggestedQuestions.map((sq) => (
          <button
            key={sq}
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {/* Render markdown-style bold and bullet points cleanly */}
                <div className="whitespace-pre-wrap font-sans">
                  {m.content.split('\n').map((line, idx) => {
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={idx} className="ml-2 my-0.5 flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={idx} className="my-1">{line}</p>;
                  })}
                </div>
                <div
                  className={`text-[9px] mt-1.5 font-medium ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  {userProfile.name[0]}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-500 italic">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs">
              🤖
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-400 font-sans ml-1">AirGuard is synthesizing sensor data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask anything (e.g. Can I walk outside with asthma? Should I wear N95?)"
          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
