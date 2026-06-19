import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ExternalLink, FolderKanban, Calendar, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function UserProjects({ userId }: { userId: string }) {
  const { data: submissionsRes, isLoading } = useQuery({
    queryKey: ['user-submissions', userId],
    queryFn: async () => {
      const res = await api.get('/submissions', { params: { userId } });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const submissions = submissionsRes?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Project Submissions</h2>
          <p className="text-muted-foreground">All the projects you've submitted across your courses.</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <FolderKanban className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects submitted yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              Once you submit projects for your courses, they will appear here for easy access.
            </p>
            <Link to="/courses">
              <Button className="gap-2">
                Browse Courses <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission: any) => (
            <Card key={submission.id} className="group hover:shadow-xl transition-all duration-300 border-white/5 bg-card/50 backdrop-blur-sm ring-1 ring-white/5">
              <CardHeader className="pb-3 pt-6 px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <FolderKanban className="size-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary border-primary/20">
                    Project
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                  {submission.lesson?.lessonName || 'Project Submission'}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <BookOpen className="size-3" />
                  <span>{submission.lesson?.topic?.course?.courseName || 'Course'}</span>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>Submitted on {new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-2">
                    <a 
                      href={submission.projectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group/link"
                    >
                      View Live Project
                      <ExternalLink className="size-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  <Link 
                    to={`/courses/${submission.lesson?.topic?.course?.id}/topics/${submission.lesson?.topic?.id}/lessons/${submission.lesson?.id}`}
                    className="block pt-2"
                  >
                    <Button variant="secondary" size="sm" className="w-full text-xs font-bold gap-2 bg-secondary/50 hover:bg-secondary">
                      Go to Lesson
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
