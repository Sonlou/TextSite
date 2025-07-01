export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  generatedCode: string;
  conversation: Message[];
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}