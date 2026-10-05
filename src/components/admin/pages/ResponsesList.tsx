import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Response, Answer } from '@/types';

export const ResponsesList: React.FC = () => {
  const [responses, setResponses] = useState<(Response & { answers_count?: number })[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [responseAnswers, setResponseAnswers] = useState<(Answer & { question_text?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses((data || []) as Response[]);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadResponseDetails = async (responseId: string) => {
    try {
      const { data, error } = await supabase
        .from('answers')
        .select('*, questions(question_text)')
        .eq('response_id', responseId);

      if (error) throw error;

      const enrichedAnswers = (data || []).map((answer) => ({
        ...answer,
        question_text: (answer.questions as { question_text: string }).question_text,
      }));

      setResponseAnswers(enrichedAnswers);
    } catch (error) {
      console.error('Error loading response details:', error);
    }
  };

  const handleSelectResponse = (responseId: string) => {
    setSelectedResponse(responseId);
    loadResponseDetails(responseId);
  };

  const handleDelete = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;

    try {
      const { error } = await supabase
        .from('responses')
        .delete()
        .eq('id', responseId);

      if (error) throw error;
      setResponses(responses.filter((r) => r.id !== responseId));
      setSelectedResponse(null);
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const { data, error } = await supabase
        .from('answers')
        .select('*, responses(session_id), questions(question_text)')
        .order('response_id');

      if (error) throw error;

      let csv = 'Response ID,Submitted Date,Question,Answer\n';
      (data || []).forEach((answer) => {
        const responseId = (answer.responses as { session_id: string }).session_id;
        const question = (answer.questions as { question_text: string }).question_text;
        csv += `"${responseId}","${new Date().toISOString()}","${question}","${answer.answer_text.replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `responses_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const filteredResponses = responses.filter((r) =>
    r.session_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Responses</h1>
          <p className="text-slate-600 mt-1">View and manage questionnaire responses</p>
        </div>
        <Button onClick={handleExportCSV} variant="secondary">
          Export CSV
        </Button>
      </div>

      <div className="flex gap-6">
        {/* List side */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <Input
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-600">Loading responses...</div>
          ) : filteredResponses.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No responses yet 💌</div>
          ) : (
            <div className="overflow-y-auto flex-1">
              {filteredResponses.map((response) => (
                <button
                  key={response.id}
                  onClick={() => handleSelectResponse(response.id)}
                  className={`w-full px-4 py-3 border-b border-slate-100 text-left transition-colors ${
                    selectedResponse === response.id
                      ? 'bg-rose-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {response.session_id}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(response.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details side */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {selectedResponse ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Response Details</h2>
                <button
                  onClick={() => handleDelete(selectedResponse)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {responseAnswers.map((answer) => (
                  <div key={answer.id} className="pb-4 border-b border-slate-100">
                    <p className="text-sm font-medium text-rose-600 mb-1">
                      {answer.question_text}
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {answer.answer_text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600">
              Select a response to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
