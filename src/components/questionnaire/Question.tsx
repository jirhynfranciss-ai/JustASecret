import React, { useState, useEffect } from 'react';
import { Question as QuestionType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { getConversationalIntro } from '@/utils/helpers';

interface QuestionProps {
  question: QuestionType;
  index: number;
  total: number;
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentAnswer?: string | string[];
  isPreviousDisabled?: boolean;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  index,
  total,
  onAnswer,
  onNext,
  onPrevious,
  currentAnswer = '',
  isPreviousDisabled = false,
}) => {
  const [answer, setAnswer] = useState<string | string[]>(currentAnswer || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setAnswer(currentAnswer || '');
    setError('');
  }, [question.id, currentAnswer]);

  const handleSubmitAnswer = () => {
    setError('');

    // Validation
    if (question.is_required) {
      if (typeof answer === 'string' && !answer.trim()) {
        setError('This field is required');
        return;
      }
      if (Array.isArray(answer) && answer.length === 0) {
        setError('Please select at least one option');
        return;
      }
    }

    onAnswer(answer);
    onNext();
  };

  const renderInput = () => {
    switch (question.question_type) {
      case 'TEXT':
        return (
          <Input
            placeholder={question.options?.[0] || 'Your answer...'}
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={200}
            autoFocus
          />
        );

      case 'LONG_TEXT':
        return (
          <Textarea
            placeholder={question.options?.[0] || 'Tell me...'}
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={1000}
            autoFocus
          />
        );

      case 'YES_NO':
      case 'SINGLE_CHOICE':
        return (
          <div className="space-y-2 w-full">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => setAnswer(option)}
                className={`w-full px-4 py-3 rounded-2xl border-2 text-sm md:text-base font-medium transition-all duration-200 ${
                  answer === option
                    ? 'border-rose-400 bg-rose-100 text-rose-900 shadow-lg shadow-rose-200'
                    : 'border-rose-100 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'MULTIPLE_CHOICE':
        const selectedArray = Array.isArray(answer) ? answer : [];
        return (
          <div className="space-y-2 w-full">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  if (selectedArray.includes(option)) {
                    setAnswer(selectedArray.filter((a) => a !== option));
                  } else {
                    setAnswer([...selectedArray, option]);
                  }
                }}
                className={`w-full px-4 py-3 rounded-2xl border-2 text-sm md:text-base font-medium transition-all duration-200 ${
                  selectedArray.includes(option)
                    ? 'border-rose-400 bg-rose-100 text-rose-900 shadow-lg shadow-rose-200'
                    : 'border-rose-100 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                {selectedArray.includes(option) ? '✓ ' : ''}{option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-lavender-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-20 h-20 bg-rose-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-5 w-32 h-32 bg-lavender-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-sm text-rose-600">
            <span className="font-medium">Getting to know you... 💗</span>
            <span className="text-xs text-slate-500">
              {index + 1} of {total}
            </span>
          </div>
          <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border-2 border-rose-100 shadow-xl p-6 md:p-8 space-y-6 animate-fadeIn">
          {/* Conversational intro */}
          <p className="text-sm text-rose-500 font-medium text-center">
            {getConversationalIntro(index)}
          </p>

          {/* Question text */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center leading-snug">
            {question.question_text}
          </h2>

          {/* Input area */}
          <div className="space-y-3">
            {renderInput()}
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onPrevious}
              variant="secondary"
              size="md"
              disabled={isPreviousDisabled}
              className="flex-1 md:flex-none"
            >
              ← Back
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              size="md"
              className="flex-1"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};
