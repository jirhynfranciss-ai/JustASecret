export const generateSessionId = (): string => {
  // Generate a random UUID-like session ID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getConversationalIntro = (index: number): string => {
  const intros = [
    "Let's start with something simple... 🌷",
    "Okay, now I'm curious... 👀",
    "I really want to know this one... 💭",
    "A little more personal this time... 🤍",
    "Okay... be honest with me. 😳",
    "We're getting to the interesting questions now... 💫",
    "Just a few more... promise. 💗",
    "Almost there! 🎉",
    "Getting closer... ✨",
    "Tell me more... 🌟",
    "This is important to me... 💕",
    "Let's go deeper... 🌙",
    "One more thing I want to know... 💌",
  ];
  return intros[index % intros.length];
};

export const calculateCompletionRate = (
  submittedCount: number,
  startedCount: number
): number => {
  if (startedCount === 0) return 0;
  return Math.round((submittedCount / startedCount) * 100);
};

export const getMostCommonAnswers = (
  answers: Record<string, string[]>,
  limit: number = 5
): Record<string, { answer: string; count: number }[]> => {
  const result: Record<string, { answer: string; count: number }[]> = {};

  Object.entries(answers).forEach(([questionId, answerArray]) => {
    const counts: Record<string, number> = {};
    answerArray.forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    result[questionId] = Object.entries(counts)
      .map(([answer, count]) => ({ answer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  });

  return result;
};
