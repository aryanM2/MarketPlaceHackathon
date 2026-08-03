import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight, Eye, RefreshCw } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Recommend breathable cotton for summer shirts',
  'Waterproof technical nylon for outerwear',
  'Compare Silk vs Linen for luxury dresses',
  'Wholesale fabrics under $10 per meter',
];

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your TexTrade B2B AI Assistant. Ask me to recommend fabrics, compare GSM weights, or suggest alternatives for your garments.',
      products: [],
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    // Append user message
    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');

    setLoading(true);
    try {
      const res = await API.post('/ai/chat', { message: query });
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.message,
            products: res.data.products || [],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'I can help answer questions about our fabric catalog. Try asking for Organic Cotton, Silk, or Technical Nylon!',
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          <span className="hidden sm:inline-block font-bold text-xs">AI Fabric Assistant</span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[520px] flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-brand-500/20 text-brand-300 rounded-lg border border-brand-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">TexTrade AI Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>Online • Catalog Intelligence</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Embedded Product Cards inside AI Message */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod._id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'}
                              alt=""
                              className="w-9 h-9 object-cover rounded-md border flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-[11px] line-clamp-1">{prod.name}</div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                ${prod.price?.toFixed(2)} / {prod.unit} • {prod.gsm} GSM
                              </div>
                            </div>
                          </div>

                          <Link
                            to={`/products/${prod._id}`}
                            onClick={() => setIsOpen(false)}
                            className="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 text-[10px] font-bold rounded-md transition-colors flex items-center space-x-0.5 flex-shrink-0"
                          >
                            <span>Inspect</span>
                            <Eye className="w-3 h-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs italic bg-white p-2.5 rounded-xl border border-slate-200 w-max">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                <span>AI analyzing fabric database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pill Container */}
          <div className="bg-slate-100 p-2 border-t border-slate-200 flex space-x-1.5 overflow-x-auto scrollbar-none">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-600 rounded-full border border-slate-200 text-[10px] font-semibold whitespace-nowrap transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about GSM, fabric composition, MOQ..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || loading}
              className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default AIChatWidget;
