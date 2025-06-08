import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import { AIMessage } from '../../types';
import { AIIcon, SendIcon, LoadingIcon } from '../common/Icons';

interface AIChatProps {
  initialMessage?: string;
  contextData?: any;
  onRecommendationGenerated?: (recommendation: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ 
  initialMessage = "Hello! I'm your AI scheduling assistant. How can I help you today?",
  contextData,
  onRecommendationGenerated
}) => {
  const { sendAIMessage } = useApi();
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: '0', role: 'assistant', content: initialMessage, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send the user message to the API
      const response = await sendAIMessage(inputValue, contextData);
      
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If the AI provided a recommendation, notify parent component
      if (response.recommendation && onRecommendationGenerated) {
        onRecommendationGenerated(response.recommendation);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Add error message
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <AIIcon /> AI Scheduling Assistant
      </div>
      
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${message.isError ? 'error-message' : ''}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant-message typing">
            <div className="typing-indicator">
              <LoadingIcon />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Ask me about scheduling or staff optimization..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
