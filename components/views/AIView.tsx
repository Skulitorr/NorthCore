import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { AIRecommendation, AIMessage } from '../../types';
import Icons from '../common/Icons';

interface AIViewProps {
  staffCount?: number;
  tourCount?: number;
}

const AIView: React.FC<AIViewProps> = ({ staffCount = 0, tourCount = 0 }) => {
  const { fetchAIRecommendations, sendAIMessage } = useApi();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [processingMessage, setProcessingMessage] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await fetchAIRecommendations();
      setRecommendations(data);
      setError(null);
      
      // Add welcome message if no messages exist
      if (messages.length === 0) {
        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `Hello! I'm your AI scheduling assistant. I can help you optimize your scheduling, analyze workloads, and find efficient solutions for your staff and tours. How can I assist you today?`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      setError('Failed to load AI recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || processingMessage) return;
    
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setProcessingMessage(true);
    
    try {
      // Send message to AI and get response
      const response = await sendAIMessage(inputMessage);
      
      const assistantMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If AI provided a recommendation, update recommendations
      if (response.recommendation) {
        const newRecommendation: AIRecommendation = {
          id: `rec-${Date.now()}`,
          title: 'New Recommendation',
          description: response.recommendation,
          type: 'general',
          timestamp: new Date().toISOString()
        };
        setRecommendations(prev => [...prev, newRecommendation]);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setProcessingMessage(false);
    }
  };

  const handleRecommendationClick = (recommendation: AIRecommendation) => {
    // Add the recommendation to messages as if the user asked about it
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: `Tell me more about: ${recommendation.title}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setProcessingMessage(true);
    
    // Simulate AI response about the recommendation
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: recommendation.details || recommendation.description,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setProcessingMessage(false);
    }, 500);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Hello! I'm your AI scheduling assistant. I can help you optimize your scheduling, analyze workloads, and find efficient solutions for your staff and tours. How can I assist you today?`,
        timestamp: new Date()
      }
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="Loading AI assistant..." />;
  }

  return (
    <div className="ai-view">
      <div className="ai-header">
        <h2><Icons.Brain /> AI Scheduling Assistant</h2>
        <button className="new-conversation-button" onClick={startNewConversation}>
          <Icons.Plus /> New Conversation
        </button>
      </div>

      {error && (
        <div className="error-message">
          <Icons.AlertCircle /> {error}
        </div>
      )}

      <div className="ai-content">
        <div className="ai-chat">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            ))}
            {processingMessage && (
              <div className="message assistant-message typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <textarea
              className="message-input"
              placeholder="Ask me about scheduling, staff optimization, tour planning..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={processingMessage}
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || processingMessage}
            >
              <Icons.Send />
            </button>
          </div>
        </div>

        <div className="ai-recommendations">
          <h3>Recommended Actions</h3>
          <div className="recommendations-list">
            {recommendations.length > 0 ? (
              recommendations.map((recommendation, index) => (
                <div 
                  key={index} 
                  className="recommendation-card"
                  onClick={() => handleRecommendationClick(recommendation)}
                >
                  <h4>{recommendation.title}</h4>
                  <p>{recommendation.description}</p>
                  {recommendation.priority && (
                    <span className={`priority-tag priority-${recommendation.priority.toLowerCase()}`}>
                      {recommendation.priority}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="no-recommendations">
                No recommendations available at this time.
              </p>
            )}
          </div>

          <div className="ai-stats">
            <h3>System Stats</h3>
            <ul>
              <li>Staff Members: {staffCount}</li>
              <li>Tours: {tourCount}</li>
              <li>Optimization Score: 87%</li>
              <li>Last Update: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIView;
