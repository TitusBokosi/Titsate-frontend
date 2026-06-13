import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useSubmission = (lessonId: string) => {
  return useQuery({
    queryKey: ['submission', lessonId],
    queryFn: async () => {
      const res = await api.get(`/lessons/${lessonId}/submission`);
      return res.data;
    },
    enabled: !!lessonId,
  });
};

export const useSubmitProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, projectUrl }: { lessonId: string; projectUrl: string }) => {
      const res = await api.post(`/lessons/${lessonId}/submit`, { projectUrl });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submission', variables.lessonId] });
      toast.success('Project submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit project');
    },
  });
};
