import { useUserProgress } from '@/features/progress/hooks/useProgress'
import { useUserEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle2, Loader2, BookOpen, GraduationCap, ChevronRight, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function UserProgress({ userId }: { userId: string }) {
  const { data: progressRes, isLoading: isLoadingProgress } = useUserProgress(userId)
  const { data: enrollmentRes, isLoading: isLoadingEnrollments } = useUserEnrollments(userId)

  if (isLoadingProgress || isLoadingEnrollments) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    )
  }

  const enrollments = enrollmentRes?.data || []
  const completedLessonIds = new Set(progressRes?.data?.map((p: any) => p.lessonid) || [])

  const courseProgressData = enrollments.map((enrollment: any) => {
    const course = enrollment.course
    const topics = course.topics || []
    
    const topicsWithProgress = topics.map((topic: any) => {
      const lessons = topic.lessons || []
      const completedTopicLessons = lessons.filter((l: any) => completedLessonIds.has(l.id))
      const isCompleted = lessons.length > 0 && completedTopicLessons.length === lessons.length
      const progressPercent = lessons.length > 0 ? Math.round((completedTopicLessons.length / lessons.length) * 100) : 0
      
      return {
        ...topic,
        lessons,
        completedLessons: completedTopicLessons,
        isCompleted,
        progressPercent
      }
    })

    const completedTopics = topicsWithProgress.filter((t: any) => t.isCompleted)
    const courseProgressPercent = topics.length > 0 ? Math.round((completedTopics.length / topics.length) * 100) : 0

    return {
      id: course.id,
      courseName: course.courseName,
      topics: topicsWithProgress,
      completedTopicsCount: completedTopics.length,
      totalTopicsCount: topics.length,
      progressPercent: courseProgressPercent,
      project: course.project
    }
  })

  return (
    <div className="mt-4 md:mt-6">
      <div className="mb-8 text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight">Learning Progress</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Detailed breakdown of your course completion and projects.
        </p>
      </div>

      {courseProgressData.length === 0 ? (
        <div className="bg-muted/30 border border-dashed rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center">
          <BookOpen className="size-10 md:size-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium">No active courses </p>
          <p className="text-muted-foreground text-sm">Enroll in a course to see your progress here.</p>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-12 pb-20">
          {courseProgressData.map((course) => (
            <Card key={course.id} className="overflow-hidden border-none shadow-xl bg-secondary/5 ring-1 ring-white/5">
              <CardHeader className="bg-secondary/10 pb-6 md:pb-8 px-5 md:px-8 pt-6 md:pt-8 border-b border-white/5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                      <GraduationCap className="size-6 md:size-8 text-primary" />
                    </div>
                    <div>
                      <Link to={`/courses/${course.id}`} className="hover:text-primary transition-colors block group">
                        <CardTitle className="text-lg md:text-2xl font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
                          {course.courseName}
                          <ChevronRight className="size-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:block" />
                        </CardTitle>
                      </Link>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-xs md:text-sm font-medium">
                        <span className="flex items-center gap-1">
                           <CheckCircle2 className="size-3.5" />
                           {course.completedTopicsCount}/{course.totalTopicsCount} topics completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center lg:items-end gap-2 w-full lg:w-auto lg:min-w-[200px]">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                      <span className="text-xs md:text-sm font-black text-primary">{course.progressPercent}%</span>
                    </div>
                    <Progress value={course.progressPercent} className="h-2 md:h-2.5 w-full bg-primary/10" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-5 md:p-8 space-y-10">
                {/* Curriculum Section */}
                <div>
                  <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center justify-center md:justify-start gap-2">
                    <BookOpen className="size-3.5 md:size-4" />
                    Curriculum Progress
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {course.topics.map((topic: any) => (
                      <Accordion key={topic.id} className="w-full">
                        <AccordionItem value={topic.id} className="border rounded-xl px-3 md:px-4 bg-background/40 hover:bg-background/60 transition-colors border-white/5 overflow-hidden">
                          <AccordionTrigger className="hover:no-underline py-3 md:py-4">
                            <div className="flex items-center gap-3 md:gap-4 w-full text-left">
                              <div className={cn(
                                "p-1.5 rounded-full shrink-0",
                                topic.isCompleted ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground font-bold"
                              )}>
                                {topic.isCompleted ? <CheckCircle2 className="size-3.5 md:size-4" /> : <PlayCircle className="size-3.5 md:size-4" />}
                              </div>
                              <div className="flex-1 pr-2 md:pr-4 min-w-0">
                                <div className="flex items-center justify-between mb-1.5 gap-2">
                                  <span className={cn("font-bold text-xs md:text-sm truncate", topic.isCompleted && "text-green-500")}>
                                    {topic.topicName}
                                  </span>
                                  <span className="text-[9px] md:text-[10px] bg-secondary/30 px-2 py-0.5 rounded-full font-bold shrink-0">
                                    {topic.progressPercent}%
                                  </span>
                                </div>
                                <Progress value={topic.progressPercent} className="h-1 bg-primary/5" />
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                             <div className="space-y-1 pl-6 md:pl-10 border-l-2 border-primary/10 ml-[14px] md:ml-[18px]">
                                {topic.lessons.map((lesson: any) => {
                                  const isDone = completedLessonIds.has(lesson.id)
                                  return (
                                    <Link 
                                      key={lesson.id}
                                      to={`/courses/${course.id}/topics/${topic.id}/lessons/${lesson.id}`}
                                      className={cn(
                                        "flex items-center justify-between p-2 md:p-2.5 rounded-lg text-xs md:text-sm group transition-all",
                                        isDone ? "text-green-500 bg-green-500/5" : "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
                                      )}
                                    >
                                      <div className="flex items-center gap-2 md:gap-3">
                                        {isDone ? (
                                          <CheckCircle2 className="size-3 md:size-3.5 shrink-0" />
                                        ) : (
                                          <div className="size-3 md:size-3.5 border-2 rounded-full border-zinc-700 shrink-0" />
                                        )}
                                        <span className="font-medium line-clamp-1">{lesson.lessonName}</span>
                                      </div>
                                      <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all text-primary" />
                                    </Link>
                                  )
                                })}
                             </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </div>

                {/* Projects Section */}
                {course.project && (
                  <div>
                    <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center justify-center md:justify-start gap-2">
                      <CheckCircle2 className="size-4" />
                      Course Projects
                    </h4>
                    <div className={cn(
                      "p-5 md:p-6 rounded-2xl border-2 border-dashed transition-all",
                      course.progressPercent === 100 
                        ? "bg-green-500/5 border-green-500/30" 
                        : "bg-muted/10 border-white/5"
                    )}>
                      <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 text-center md:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className={cn(
                            "p-3 rounded-xl shrink-0",
                            course.progressPercent === 100 ? "bg-green-500/20 text-green-500" : "bg-primary/10 text-primary"
                          )}>
                             <BookOpen className="size-5 md:size-6" />
                          </div>
                          <div>
                            <h5 className="font-bold text-base md:text-lg mb-1">{course.project.title}</h5>
                            <p className="text-muted-foreground text-xs md:text-sm max-w-xl">
                              {course.project.description}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {course.progressPercent === 100 ? (
                            <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase">
                              <CheckCircle2 className="size-3 md:size-4" />
                              Completed
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-zinc-500/10 text-zinc-500 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase">
                              <PlayCircle className="size-3 md:size-4" />
                              Yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {course.progressPercent < 100 && (
                <CardFooter className="bg-secondary/5 border-t border-white/5 p-4 md:p-6 flex justify-center md:justify-end">
                   <Link 
                    to={`/courses/${course.id}/topics/${course.topics.find((t: any) => !t.isCompleted)?.id || course.topics[0]?.id}`}
                    className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto gap-2 font-bold group shadow-lg shadow-primary/10")}
                   >
                     Continue Learning
                     <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

