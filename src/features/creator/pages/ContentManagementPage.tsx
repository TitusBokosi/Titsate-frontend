import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import * as courseApi from "@/features/course/api/course"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  Plus, 
  BookOpen, 
  FileText, 
  Video, 
  Trash, 
  GripVertical,
  Clock,
  AlertCircle,
  Send,
  Edit2,
  Check,
  X,
  Type
} from "lucide-react"
import { useContentManagementActions, useCreatorActions } from "../hooks/useCreator"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ContentManagementPage() {
  const { courseId } = useParams()
  const { data: courseData, isLoading, refetch } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => courseApi.getCourseById(courseId as string)
  })

  const { 
    createTopic, updateTopic, deleteTopic,
    createLesson, updateLesson, deleteLesson 
  } = useContentManagementActions(courseId as string)
  const { updateCourse } = useCreatorActions()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [editContent, setEditContent] = useState("")
  const [isEditingCourse, setIsEditingCourse] = useState(false)

  const course = courseData?.data

  const handleSubmitForReview = async () => {
    if (!course) return
    await updateCourse({ id: course.id, data: { status: 'PENDING' } })
    refetch()
  }

  const handleUpdateCourseName = async () => {
    if (!course) return
    await updateCourse({ id: course.id, data: { courseName: editValue } })
    setIsEditingCourse(false)
    refetch()
  }

  const handleUpdateTopic = async (topicId: string) => {
    await updateTopic({ topicId, data: { topicName: editValue } })
    setEditingId(null)
    refetch()
  }

  const handleUpdateLesson = async (topicId: string, lessonId: string) => {
    await updateLesson({ topicId, lessonId, data: { lessonName: editValue, content: editContent } })
    setEditingId(null)
    refetch()
  }

  if (isLoading) return <div className="p-10 text-center">Loading content...</div>

  return (
    <div className="container mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link to="/creator">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="size-6" />
          </Button>
        </Link>
        <div className="flex-1">
          {isEditingCourse ? (
            <div className="flex items-center gap-2">
              <Input 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)}
                className="text-2xl font-bold h-12 max-w-md"
              />
              <Button size="icon" onClick={handleUpdateCourseName}><Check className="size-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditingCourse(false)}><X className="size-4" /></Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h1 className="text-3xl font-bold">{course?.courseName}</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
                onClick={() => {
                  setEditValue(course?.courseName || "")
                  setIsEditingCourse(true)
                }}
              >
                <Edit2 className="size-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="font-bold border-primary/20 text-primary">
              {course?.category?.categoryName}
            </Badge>
            <Badge className={cn("font-bold border-none", 
               course?.status === 'APPROVED' ? "bg-green-500/10 text-green-500" : 
               course?.status === 'REJECTED' ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
            )}>
              {course?.status}
            </Badge>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Button 
            className="font-bold rounded-full px-6 shadow-lg shadow-primary/20"
            onClick={handleSubmitForReview}
            disabled={course?.status === 'PENDING'}
          >
            <Send className="size-4 mr-2" />
            {course?.status === 'REJECTED' ? 'Resubmit for Review' : 'Submit for Review'}
          </Button>
        </div>
      </div>

      {course?.status === 'REJECTED' && course?.feedback && (
        <Card className="border-red-500/20 bg-red-500/5 shadow-none overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 py-4">
            <AlertCircle className="size-6 text-red-500" />
            <div>
              <CardTitle className="text-lg text-red-500">Rejection Feedback</CardTitle>
              <CardDescription className="text-red-500/80">
                Please address the following issues before resubmitting.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="p-4 rounded-xl bg-background/50 text-foreground/90 font-medium border border-red-500/10">
              "{course.feedback}"
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            Curriculum
          </h2>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => createTopic({ topicName: 'New Topic' })}>
            <Plus className="size-4 mr-2" /> Add Topic
          </Button>
        </div>

        <div className="space-y-6">
          {course?.topics?.map((topic: any, index: number) => (
            <Card key={topic.id} className="border-none shadow-md ring-1 ring-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 flex flex-row items-center gap-4 border-b border-white/5">
                <GripVertical className="size-5 text-muted-foreground/30" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Topic {index + 1}</span>
                  </div>
                  {editingId === topic.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-9 font-bold"
                      />
                      <Button size="sm" onClick={() => handleUpdateTopic(topic.id)}><Check className="size-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="size-3" /></Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/topic">
                      <CardTitle className="text-lg font-bold">{topic.topicName}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover/topic:opacity-100 transition-opacity h-6 w-6 rounded-full"
                        onClick={() => {
                          setEditingId(topic.id)
                          setEditValue(topic.topicName)
                        }}
                      >
                        <Edit2 className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full opacity-50 hover:opacity-100"
                    onClick={() => deleteTopic(topic.id)}
                  >
                    <Trash className="size-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {topic.lessons?.map((lesson: any) => (
                    <div key={lesson.id} className="flex flex-col border-b border-white/5 bg-black/5 last:border-0 hover:bg-white/5 transition-colors">
                      <div className="p-4 flex items-center gap-4 group/lesson">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          {lesson.lessonType === 'VIDEO' ? <Video className="size-5" /> : <FileText className="size-5" />}
                        </div>
                        <div className="flex-1">
                          {editingId === lesson.id ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editValue} 
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 text-sm font-bold"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm">{lesson.lessonName}</h4>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="opacity-0 group-hover/lesson:opacity-100 transition-opacity h-6 w-6 rounded-full"
                                onClick={() => {
                                  setEditingId(lesson.id)
                                  setEditValue(lesson.lessonName)
                                  setEditContent(lesson.content || "")
                                }}
                              >
                                <Edit2 className="size-3" />
                              </Button>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">{lesson.lessonType}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full opacity-50 hover:opacity-100"
                            onClick={() => deleteLesson({ topicId: topic.id, lessonId: lesson.id })}
                          >
                            <Trash className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      {editingId === lesson.id && (
                        <div className="px-14 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <Type className="size-3" /> Lesson Content (Markdown/Text)
                            </Label>
                            <Textarea 
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              placeholder="Write your lesson content here..."
                              className="min-h-[200px] text-sm bg-background/50 border-white/10"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button size="sm" onClick={() => handleUpdateLesson(topic.id, lesson.id)}>Save Changes</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="p-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full border-dashed border border-primary/20 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl py-6"
                        onClick={() => createLesson({ topicId: topic.id, data: { lessonName: 'New Lesson', lessonType: 'TEXT' } })}
                    >
                      <Plus className="size-4 mr-2" /> Add Lesson to this Topic
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!course?.topics || course.topics.length === 0) && (
            <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
              <Clock className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Your curriculum is empty</h3>
              <p className="text-muted-foreground mt-2">Start by adding a topic to organize your lessons.</p>
              <Button className="mt-6 rounded-full px-8" onClick={() => createTopic({ topicName: 'Getting Started' })}>
                <Plus className="size-4 mr-2" /> Add Your First Topic
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
