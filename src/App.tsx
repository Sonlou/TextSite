import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Code, Trash2, Sparkles } from 'lucide-react';
import { useCodeGeneration } from './hooks/useCodeGeneration';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { LivePreview } from './components/LivePreview';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { conversation, isLoading, error, generatedCode, generateWebsite, clearConversation } = useCodeGeneration();
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<'chat' | 'preview'>('chat');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSendMessage = async (message: string) => {
    try {
      await generateWebsite(message);
      toast.success('Website generated successfully!');
      if (isMobile) {
        setActivePanel('preview');
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleClearConversation = () => {
    clearConversation();
    toast.success('Conversation cleared');
    if (isMobile) {
      setActivePanel('chat');
    }
  };

  const examplePrompts = [
    "Create a modern landing page for a tech startup",
    "Build a portfolio website for a graphic designer",
    "Make a dashboard for an e-commerce admin panel",
    "Design a blog homepage with clean typography",
    "Create a restaurant website with online menu"
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">DeepSeek Coding Agent</h1>
                  <p className="text-sm text-gray-600">AI-powered website generator</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isMobile && (
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActivePanel('chat')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activePanel === 'chat'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setActivePanel('preview')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activePanel === 'preview'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleClearConversation}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`grid gap-6 h-[calc(100vh-8rem)] ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Chat Panel */}
            <div className={`${isMobile ? (activePanel === 'chat' ? 'block' : 'hidden') : 'block'} bg-white rounded-lg shadow-lg flex flex-col`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>Chat with AI</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Describe the website you want to create
                </p>
              </div>
              
              {conversation.length === 0 && (
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Try these example prompts:</p>
                  <div className="space-y-2">
                    {examplePrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt)}
                        disabled={isLoading}
                        className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <ChatHistory messages={conversation} />
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>

            {/* Preview Panel */}
            <div className={`${isMobile ? (activePanel === 'preview' ? 'block' : 'hidden') : 'block'} bg-white rounded-lg shadow-lg`}>
              <LivePreview code={generatedCode} isLoading={isLoading} />
            </div>
          </div>
        </main>

        {/* API Key Notice */}
        {!import.meta.env.VITE_DEEPSEEK_API_KEY && (
          <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:w-96 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
                <p className="text-xs text-yellow-600 mt-1">
                  Add your DeepSeek API key to <code className="bg-yellow-100 px-1 rounded">VITE_DEEPSEEK_API_KEY</code> for full functionality.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;