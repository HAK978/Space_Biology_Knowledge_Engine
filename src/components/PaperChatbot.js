import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import { askGemini } from '../services/geminiService';

const PaperChatbot = ({ paper }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Hi! I'm your research assistant for this paper. I can help you understand the key findings, methodology, and implications of "${paper.title.substring(0, 50)}...". What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContextPrompt = (userQuestion) => {
    return `You are an AI research assistant helping users understand a NASA space biology research paper.

Paper Title: "${paper.title}"
Category: ${paper.category}
Keywords: ${paper.keywords?.join(', ')}
Abstract: ${paper.abstract || 'Not available'}
Significance: ${paper.significance || 'Research on space biology'}

The user asks: "${userQuestion}"

Provide a clear, concise, and scientifically accurate answer based on the paper's information. If the information isn't in the paper details provided, acknowledge that and provide general scientific context about the topic. Keep responses focused and under 150 words.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const prompt = generateContextPrompt(userMessage);
      const response = await askGemini(paper.id, prompt);

      setMessages(prev => [
        ...prev,
        { type: 'bot', content: response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: "I'm sorry, I'm having trouble processing your question right now. Please try again or rephrase your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are the key findings?",
    "What methodology was used?",
    "What are the implications for space missions?",
    "How does this relate to human health in space?",
  ];

  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  return (
    <div className="bg-slate-800/50 border border-indigo-800/30 rounded-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-b border-indigo-800/30 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FaRobot className="text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Paper Research Assistant</h3>
            <p className="text-xs text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FaRobot className="text-blue-400" size={14} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-blue-600/30 text-white border border-blue-500/30'
                    : 'bg-slate-700/50 text-gray-200 border border-slate-600/30'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <FaUser className="text-indigo-400" size={14} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FaRobot className="text-blue-400" size={14} />
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin text-blue-400" size={14} />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (show if no user messages yet) */}
      {messages.filter(m => m.type === 'user').length === 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(q)}
                className="text-xs px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 rounded-full border border-slate-600/30 hover:border-blue-500/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-indigo-800/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this paper..."
            disabled={loading}
            className="flex-1 bg-slate-700/50 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaperChatbot;
