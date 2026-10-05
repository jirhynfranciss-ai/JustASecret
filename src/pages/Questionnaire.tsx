import React, { useEffect, useState } from 'react';
import { Landing } from '@/components/questionnaire/Landing';
import { Question } from '@/components/questionnaire/Question';
import { Review } from '@/components/questionnaire/Review';
import { Success } from '@/components/questionnaire/Success';
import { useQuestionnaireStore } from '@/hooks/useQuestionnaireStore';
import { supabase } from '@/lib/supabase';
import { generateSessionId } from '@/utils/helpers';
import { Question as QuestionType } from '@/types';

type PageState = 'landing' | 'question' | 'review' | 'success';

export const QuestionnairePageComponent: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('landing');
  const {
    questions,
    currentQuestionIndex,
    answers,
    sessionId,
    isLoading,
    error,
    setQuestions,
    setSessionId,
    setAnswer,
    setCurrentQuestion,
    getAnswer,
    setIsLoading,
    setError,
    reset,
  } = useQuestionnaireStore();

  // Load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (fetchError) throw fetchError;
        setQuestions((data || []) as QuestionType[]);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [setQuestions, setIsLoading, setError]);

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(generateSessionId());
    }
  }, [sessionId, setSessionId]);

  const handleStart = () => {
    setPageState('question');
  };

  const handleAnswerQuestion = (answer: string | string[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswer(currentQuestion.id, answer);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
    } else {
      // Move to review
      setPageState('review');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    }
  };

  const handleEditQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    setPageState('question');
  };

  const handleSubmitAnswers = async () => {
    setIsLoading(true);
    try {
      // Create response record
      const { data: responseData, error: responseError } = await supabase
        .from('responses')
        .insert({
          session_id: sessionId,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Insert all answers
      const answersToInsert = questions
        .filter((q) => answers[q.id] !== undefined && answers[q.id] !== '')
        .map((q) => ({
          response_id: responseData.id,
          question_id: q.id,
          answer_text: Array.isArray(answers[q.id])
            ? (answers[q.id] as string[]).join(', ')
            : String(answers[q.id]),
        }));

      if (answersToInsert.length > 0) {
        const { error: answersError } = await supabase
          .from('answers')
          .insert(answersToInsert);

        if (answersError) throw answersError;
      }

      setPageState('success');
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError('Failed to submit answers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    reset();
    setPageState('landing');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = getAnswer(currentQuestion?.id || '');

  if (error && pageState !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-lavender-50">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border-2 border-rose-100 shadow-xl p-8 text-center max-w-md">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {pageState === 'landing' && (
        <Landing onStart={handleStart} isLoading={isLoading} />
      )}
      {pageState === 'question' && currentQuestion && (
        <Question
          question={currentQuestion}
          index={currentQuestionIndex}
          total={questions.length}
          onAnswer={handleAnswerQuestion}
          onNext={handleNextQuestion}
          onPrevious={handlePreviousQuestion}
          currentAnswer={currentAnswer}
          isPreviousDisabled={currentQuestionIndex === 0}
        />
      )}
      {pageState === 'review' && (
        <Review
          questions={questions}
          answers={answers}
          onEdit={handleEditQuestion}
          onSubmit={handleSubmitAnswers}
          isLoading={isLoading}
        />
      )}
      {pageState === 'success' && <Success onRestart={handleRestart} />}
    </>
  );
};
