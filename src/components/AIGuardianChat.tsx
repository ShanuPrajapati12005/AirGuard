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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    <Card className="bg-white border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
              Ask AirGuard
              <Badge variant="outline" className="text-[10px] font-semibold bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border-slate-700 hover:bg-slate-800">
                AI Powered
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Your personal environmental health decision assistant</p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400 hidden sm:block bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <div className="mb-0.5">Current AQI: <strong className="text-emerald-400">{airData.aqi}</strong></div>
          <div>User: <strong className="text-slate-200">{userProfile.name} ({userProfile.age}y)</strong></div>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider shrink-0">Try Asking:</span>
        {suggestedQuestions.map((sq) => (
          <Button
            key={sq}
            variant="outline"
            size="sm"
            onClick={() => handleSend(sq)}
            className="h-7 px-2.5 rounded-lg border-slate-200 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 whitespace-nowrap transition-colors shadow-none"
          >
            {sq}
          </Button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-sm border border-emerald-200">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm",
                  isUser
                    ? "bg-slate-900 text-white rounded-tr-sm"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm"
                )}
              >
                {/* Render markdown-style bold and bullet points cleanly */}
                <div className="whitespace-pre-wrap font-sans">
                  {m.content.split('\n').map((line, idx) => {
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={idx} className="ml-2 my-1 flex items-start gap-1.5">
                          <span className={cn("font-bold", isUser ? "text-slate-400" : "text-emerald-600")}>•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    // Simple bold parser
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                        {parts.map((part, pIdx) => {
                           if (part.startsWith('**') && part.endsWith('**')) {
                             return <strong key={pIdx} className={isUser ? "text-white" : "text-slate-900"}>{part.slice(2, -2)}</strong>;
                           }
                           return part;
                        })}
                      </p>
                    );
                  })}
                </div>
                <div
                  className={cn(
                    "text-[9px] mt-2 font-medium text-right",
                    isUser ? "text-slate-400" : "text-slate-400"
                  )}
                >
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-sm border border-indigo-700">
                  {userProfile.name[0]}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-500 italic mt-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs shadow-sm border border-emerald-200">
               <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-500 font-sans ml-2 font-medium">AirGuard is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask anything (e.g. Can I walk outside with asthma?)"
          className="flex-1 bg-slate-50 border-slate-200 h-10 text-xs rounded-xl focus-visible:ring-emerald-500/30"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Send
          <Send className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
};
