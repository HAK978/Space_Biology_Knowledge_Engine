import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaFlask, FaUser, FaTimes, FaGraduationCap } from 'react-icons/fa';
import { askGemini } from '../services/geminiService';

const Chatbot = ({ paperId, paperTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: `AI Research Analysis Assistant\n\nI can help you analyze and understand: "${paperTitle}"\n\nAsk me about methodology, findings, implications, or related research.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await askGemini(paperId, input);
      setMessages(prev => [...prev, { role: 'system', content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setError("Failed to get a response. Please try again.");
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: "I'm sorry, I couldn't process your request at this time. Please try asking in a different way." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-center shadow-2xl shadow-purple-900/50 hover:shadow-purple-600/50 transition-all z-50 border border-purple-500/30"
      >
        {isOpen ? <FaTimes size={20} /> : <FaFlask size={28} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[450px] h-[550px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-purple-600/40 rounded-xl shadow-2xl shadow-purple-900/30 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-md p-4 border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                  <FaGraduationCap className="text-purple-300" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">AI Research Analyst</h3>
                  <p className="text-purple-300 text-xs">Academic Paper Analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-grow p-5 overflow-y-auto space-y-5 bg-slate-950/80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'system' && (
                  <div className="flex items-start space-x-3 max-w-[90%]">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-lg border border-purple-500/40">
                      <FaGraduationCap className="text-purple-300" size={16} />
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 border border-purple-500/20 text-gray-100 rounded-xl rounded-tl-sm py-3 px-4 shadow-lg">
                      <div className="flex items-center mb-2 text-xs text-purple-300 font-semibold">
                        <span>AI Analyst</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                )}
                {message.role === 'user' && (
                  <div className="flex items-start space-x-3 max-w-[90%]">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 text-white rounded-xl rounded-tr-sm py-3 px-4 shadow-lg">
                      <div className="flex items-center justify-end mb-2 text-xs text-blue-200 font-semibold">
                        <span>You</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-lg border border-blue-400/40">
                      <FaUser className="text-blue-300" size={16} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[90%]">
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-lg border border-purple-500/40">
                    <FaGraduationCap className="text-purple-300" size={16} />
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 border border-purple-500/20 text-gray-100 rounded-xl rounded-tl-sm py-3 px-4 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                      <span className="text-xs text-purple-300 ml-2">Analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-t border-purple-500/30 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Ask about methodology, findings, implications..."
                className="flex-grow py-3 px-4 bg-slate-800/80 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-600/30 placeholder-gray-500 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-5 rounded-lg flex items-center justify-center transition-all shadow-lg disabled:shadow-none border border-purple-500/30"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
