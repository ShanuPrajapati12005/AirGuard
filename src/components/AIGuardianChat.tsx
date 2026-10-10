import React, { useState } from 'react';
import {
  Send,
  Bot,
  Sparkles,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { queryAIGuardian } from '../services/aiService';
import { ChatMessage } from '../types';
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
      content: `Hello ${userProfile.name}! ðŸ‘‹ I am **AirGuard Guardian**, your personal atmospheric health copilot.\n\nCurrent ambient telemetry reflects **${airData.aqi} AQI (${airData.categoryLabel})** at ${airData.locationName}. How can I assist with your routine transit or outdoor exposure schedule today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    'Can I run outdoors right now?',
    'What is the cleanest window today?',
    'Which route minimizes PM2.5?',
    'Why is smog elevated this afternoon?',
    'Advice for mild asthma profile',
    'Is school commute safe for kids today?',
    'N95 vs surgical mask filtration efficiency',
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
        content: `âš ï¸ Note: The assistant encountered a temporary connectivity delay. Please retry your inquiry or verify credentials in Preferences.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="card flex flex-col h-[600px] border border-[var(--line)] shadow-[var(--sh)] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[var(--card)] border-b border-[var(--line)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center font-bold shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-medium tracking-tight text-[var(--ink)] flex items-center gap-2">
              AirGuard Copilot
              <Badge variant="accent" className="text-[10px] uppercase font-semibold">
                AI Synthesis
              </Badge>
            </h3>
            <p className="text-[11px] text-[var(--mut)]">Personalized respiratory decision support</p>
          </div>
        </div>

        <div className="text-right text-[11px] text-[var(--mut)] hidden sm:block bg-[var(--bg)] px-3 py-1.5 rounded-[8px] border border-[var(--line)] font-mono">
          <div>Current AQI: <strong className="text-[var(--ac)]">{airData.aqi}</strong></div>
          <div>User: <span className="text-[var(--ink)]">{userProfile.name}</span></div>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="bg-[var(--bg)] border-b border-[var(--line)] px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
        <Sparkles className="w-3.5 h-3.5 text-[var(--ac2)] shrink-0" />
        <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider shrink-0">Prompts:</span>
        {suggestedQuestions.map((sq) => (
          <Button
            key={sq}
            variant="outline"
            size="sm"
            onClick={() => handleSend(sq)}
            className="h-7 px-2.5 rounded-full text-[11px] font-normal text-[var(--ink)] hover:border-[var(--ac)] hover:bg-[var(--card)] whitespace-nowrap"
          >
            {sq}
          </Button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[var(--bg)]/40">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-[7px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center shrink-0 text-xs font-bold mt-1 border border-[var(--ac)]/20 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-[12px] px-4 py-3 text-xs leading-relaxed",
                  isUser
                    ? "bg-[var(--ink)] text-white shadow-xs"
                    : "card bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] shadow-2xs"
                )}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {m.content.split('\n').map((line, idx) => {
                    if (line.startsWith('â€¢ ') || line.startsWith('- ')) {
                      return (
                        <div key={idx} className="ml-2 my-1 flex items-start gap-1.5">
                          <span className={cn("font-bold", isUser ? "text-white/60" : "text-[var(--ac)]")}>â€¢</span>
                          <span>{line.replace(/^[â€¢-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className={isUser ? "text-white font-semibold" : "text-[var(--ink)] font-semibold"}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
                <div className={cn("text-[9px] mt-1.5 font-mono text-right", isUser ? "text-white/60" : "text-[var(--mut)]")}>
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-[7px] bg-[var(--ink)] text-white flex items-center justify-center shrink-0 text-xs font-medium mt-1">
                  {userProfile.name[0]}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 items-center text-xs text-[var(--mut)] italic">
            <div className="w-7 h-7 rounded-[7px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center shrink-0 text-xs border border-[var(--ac)]/20 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="card bg-[var(--card)] border border-[var(--line)] rounded-[12px] px-3.5 py-2.5 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-[var(--mut)] ml-2">AirGuard synthesis in progress...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3.5 bg-[var(--card)] border-t border-[var(--line)] flex items-center gap-2.5">
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask anything (e.g. Can I walk outside with asthma today?)"
          className="flex-1 bg-[var(--bg)] border-[var(--line)] h-9 text-xs rounded-[9px] focus-visible:ring-[var(--ac)]"
        />
        <Button
          variant="primary"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="h-9 px-4 text-xs font-semibold rounded-[9px]"
        >
          Send
          <Send className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};

