import React from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/Button';

interface ReviewProps {
  questions: Question[];
  answers: Record<string, string | string[]>;
  onEdit: (questionIndex: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const Review: React.FC<ReviewProps> = ({
  questions,
  answers,
  onEdit,
  onSubmit,
  isLoading,
}) => {
  const getDisplayAnswer = (answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-lavender-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-20 h-20 bg-rose-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-5 w-32 h-32 bg-lavender-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <p className="text-sm text-rose-500 font-medium">One last look...</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            💌
          </h1>
        </div>

        {/* Review Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border-2 border-rose-100 shadow-xl p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = answers[question.id];
              if (answer === undefined || answer === '') return null;

              return (
                <div
                  key={question.id}
                  className="border-b border-rose-100 pb-4 last:border-b-0"
                >
                  <p className="text-sm text-rose-600 font-medium mb-2">
                    {question.question_text}
                  </p>
                  <p className="text-slate-700 text-base leading-relaxed">
                    {getDisplayAnswer(answer)}
                  </p>
                  <button
                    onClick={() => onEdit(index)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium mt-2 hover:underline transition-colors"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-rose-100">
            <Button
              onClick={onSubmit}
              isLoading={isLoading}
              size="lg"
              className="flex-1"
            >
              Send My Answers 💗
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
