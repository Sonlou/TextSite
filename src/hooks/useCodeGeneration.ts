import { useState, useCallback } from 'react';
import { Message, GenerationState } from '../types';
import { generateCode } from '../services/deepseekApi';

export const useCodeGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    generatedCode: '',
    conversation: []
  });

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      conversation: [...prev.conversation, newMessage]
    }));

    return newMessage;
  }, []);

  const generateWebsite = useCallback(async (prompt: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Add user message
    addMessage({ role: 'user', content: prompt });

    try {
      const updatedConversation = [...state.conversation, {
        id: Date.now().toString(),
        role: 'user' as const,
        content: prompt,
        timestamp: new Date()
      }];

      const generatedCode = await generateCode(updatedConversation);
      
      // Add assistant message
      addMessage({ role: 'assistant', content: 'Generated website code successfully!' });

      setState(prev => ({
        ...prev,
        isLoading: false,
        generatedCode,
        error: null
      }));

      return generatedCode;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate website';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [state.conversation, addMessage]);

  const clearConversation = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      generatedCode: '',
      conversation: []
    });
  }, []);

  return {
    ...state,
    generateWebsite,
    clearConversation
  };
};