import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Star, StarOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import type { Course } from '@/features/course/api/course'
import { cn } from '@/lib/utils'

export function FeaturedContentPage() {
  const queryClient = useQueryClient()

  const { data: allCoursesData, isLoading } = useQuery({
    queryKey: ['admin', 'all-courses'],
    queryFn: async () => {
      const res = await api.get('/courses', { params: { limit: 100, skip: 0 } })
      return res.data.data as Course[]
    }
  })

  const toggleFeatured = useMutation({
    mutationFn: (courseId: string) => api.patch(`/admin/courses/${courseId}/toggle-featured`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'all-courses'] })
      toast.success('Featured status updated')
    },
    onError: () => toast.error('Failed to update featured status')
  })

  const courses = allCoursesData || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Featured Content</h1>
        <p className="text-muted-foreground">Highlight selected courses on the homepage for maximum visibility.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl text-muted-foreground">
          <Star className="size-12 mx-auto mb-3 opacity-20" />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isFeatured = (course as any).isFeatured
            return (
              <div
                key={course.id}
                className={cn(
                  "group rounded-xl overflow-hidden border shadow-sm transition-all duration-300",
                  isFeatured
                    ? "border-yellow-500/40 bg-yellow-500/5 ring-1 ring-yellow-500/20"
                    : "border-white/5 bg-card/50"
                )}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={course.courseName}
                  />
                  {isFeatured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 text-black font-bold">
                        <Star className="size-3 mr-1 fill-black" /> Featured
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1 mb-1">{course.courseName}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                  <Button
                    variant={isFeatured ? "destructive" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => toggleFeatured.mutate(course.id)}
                    disabled={toggleFeatured.isPending}
                  >
                    {isFeatured
                      ? <><StarOff className="size-4 mr-2" /> Remove from Featured</>
                      : <><Star className="size-4 mr-2" /> Add to Featured</>}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
