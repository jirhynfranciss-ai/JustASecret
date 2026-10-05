export type QuestionType = 'TEXT' | 'LONG_TEXT' | 'YES_NO' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[];
  is_required: boolean;
  is_active: boolean;
  display_order: number;
  conditional_question_id?: string;
  conditional_value?: string;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  answer_text: string;
  created_at: string;
}

export interface Response {
  id: string;
  session_id: string;
  submitted_at?: string;
  created_at: string;
}

export interface AdminSettings {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

export interface SessionData {
  sessionId: string;
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}
