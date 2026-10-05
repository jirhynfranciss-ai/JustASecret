import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Question } from '@/types';

export const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setQuestions((data || []) as Question[]);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (questionId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ is_active: !isActive })
        .eq('id', questionId);

      if (error) throw error;
      loadQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Questions</h1>
        <p className="text-slate-600 mt-1">Manage your questionnaire questions</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-600">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">No questions yet</p>
          <Button>Create Question</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-start justify-between"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{question.question_text}</p>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {question.question_type}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Order: {question.display_order} | Required: {question.is_required ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleToggleActive(question.id, question.is_active)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    question.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {question.is_active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
