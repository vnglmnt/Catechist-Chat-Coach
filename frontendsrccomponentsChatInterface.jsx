import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState('teen');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: input,
        context: { ageGroup }
      });

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-catholic-blue text-white">
          <h2 className="text-2xl font-bold">AI Chat Mentor</h2>
          <p className="text-blue-100">Get guidance on catechetical methods and teaching strategies</p>
          
          <div className="mt-4 flex items-center space-x-4">
            <label className="text-sm font-medium">Teaching Age Group:</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="bg-white text-gray-800 px-3 py-1 rounded border"
            >
              <option value="preschool">Preschool (3-5)</option>
              <option value="elementary">Elementary (6-11)</option>
              <option value="teen">Teen (12-17)</option>
              <option value="adult">Adult (18+)</option>
            </select>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg mb-2">Welcome, Catechist!</p>
              <p>Ask me about lesson planning, teaching strategies, or any catechetical question.</p>
              <p className="mt-4 text-sm">Examples:</p>
              <ul className="text-sm text-gray-600 mt-2">
                <li>• How do I teach the Trinity to 10-year-olds?</li>
                <li>• What activities work well for teaching prayer to teens?</li>
                <li>• How can I handle difficult behavior in class?</li>
              </ul>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-50 ml-8 border-l-4 border-blue-500'
                    : 'bg-gray-50 mr-8 border-l-4 border-gray-400'
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {msg.role === 'user' ? 'You' : 'ChatCoach'}
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="p-4 bg-gray-50 mr-8 rounded-lg border-l-4 border-gray-400">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your catechetical question..."
              className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-catholic-blue text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            All responses are generated based on Catholic Church teaching and catechetical best practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;