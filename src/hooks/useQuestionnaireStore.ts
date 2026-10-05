import { create } from 'zustand';
import { Question } from '@/types';

interface QuestionnaireState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  sessionId: string;
  isLoading: boolean;
  error: string | null;
  
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  getAnswer: (questionId: string) => string | string[] | undefined;
  setSessionId: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  getCurrentQuestion: () => Question | undefined;
  getProgress: () => { current: number; total: number; percentage: number };
}

export const useQuestionnaireStore = create<QuestionnaireState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  sessionId: '',
  isLoading: false,
  error: null,

  setQuestions: (questions) => set({ questions }),
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  getAnswer: (questionId) => get().answers[questionId],
  setSessionId: (id) => set({ sessionId: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      currentQuestionIndex: 0,
      answers: {},
      sessionId: '',
      isLoading: false,
      error: null,
    }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      ),
    })),
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex];
  },
  getProgress: () => {
    const state = get();
    const current = state.currentQuestionIndex + 1;
    const total = state.questions.length;
    return {
      current,
      total,
      percentage: (current / total) * 100,
    };
  },
}));
