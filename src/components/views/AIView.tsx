import React, { useState } from 'react';

const AIView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual AI integration
      // This is a placeholder response
      setTimeout(() => {
        setResponse('This is a placeholder response. AI integration coming soon!');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Ask me anything about your tours, staff, or schedule
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., What's the best time to schedule tours next week?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Response</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{response}</p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Suggested Questions</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={() => setPrompt('What are the most popular tour times?')}
              className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              What are the most popular tour times?
            </button>
            <button
              onClick={() => setPrompt('Which staff members are available next week?')}
              className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              Which staff members are available next week?
            </button>
            <button
              onClick={() => setPrompt('How can I optimize the tour schedule?')}
              className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              How can I optimize the tour schedule?
            </button>
            <button
              onClick={() => setPrompt('What are the peak booking hours?')}
              className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              What are the peak booking hours?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIView; 