import { useState, useEffect } from 'react';

export const useProgress = () => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('titsate_progress');
    if (saved) setCompletedLessons(JSON.parse(saved));
  }, []);

  const completeLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      localStorage.setItem('titsate_progress', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    completedLessons,
    completeLesson,
    isCompleted: (id: string) => completedLessons.includes(id),
  };
};
