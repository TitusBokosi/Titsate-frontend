import { useCreatorCourses } from "../hooks/useCreator"
import { useCreatorActions } from "../hooks/useCreator"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, LayoutGrid, MoreVertical, Edit, Trash, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export function CreatorDashboardPage() {
  const { data: courses, isLoading } = useCreatorCourses()
  const navigate = useNavigate()
  const { createCourse, isProcessing, deleteCourse } = useCreatorActions()

  const handleCreateCourse = async () => {
    try {
      const newCourse = await createCourse({
        courseName: "Untitled Course",
        description: "Add a description for your course here.",
      })
      if (newCourse && 'id' in newCourse) {
        navigate(`/creator/manage/${newCourse.id}`)
      }
    } catch (error) {
      // Error handled in hook
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'PENDING_DELETE': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="container mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your courses and track their approval status.
          </p>
        </div>
        <Button 
          className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full px-6" 
          size="lg"
          onClick={handleCreateCourse}
          disabled={isProcessing}
        >
          <Plus className="size-5 mr-2" /> Create New Course
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : courses?.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20 py-16 flex flex-col items-center justify-center rounded-3xl">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <LayoutGrid className="size-10 text-primary opacity-50" />
          </div>
          <h3 className="text-2xl font-bold">No courses yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-center">
            You haven't created any courses yet. Start by creating your first course and sharing your knowledge.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <Card key={course.id} className="group overflow-hidden rounded-2xl border-none shadow-xl ring-1 ring-white/10 bg-card/60 backdrop-blur-xl hover:translate-y-[-4px] transition-all duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={course.imageUrl || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={course.courseName}
                />
                <div className="absolute top-4 left-4">
                  <Badge className={cn("font-bold border-none shadow-sm", getStatusColor(course.status))}>
                    {course.status}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold line-clamp-1">{course.courseName}</CardTitle>
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
                <CardDescription className="line-clamp-2 mt-2 h-10">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                {course.status === 'REJECTED' && course.feedback && (
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex gap-3 text-sm text-red-500 animate-in zoom-in-95 duration-500">
                    <AlertCircle className="size-4 shrink-0" />
                    <div>
                      <p className="font-bold">Rejection Reason:</p>
                      <p className="mt-1 opacity-90">{course.feedback}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-6 pt-4 flex gap-3">
                <Link to={`/creator/manage/${course.id}`} className="flex-1">
                  <Button variant="outline" className="w-full font-bold rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                    <Edit className="size-4 mr-2" /> Manage Content
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-xl opacity-80 hover:opacity-100"
                  onClick={() => deleteCourse(course.id)}
                  disabled={course.status === 'PENDING_DELETE'}
                >
                  <Trash className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
