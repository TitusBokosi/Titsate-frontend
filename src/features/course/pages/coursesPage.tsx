import { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useCategories } from '../hooks/useCategories';
import { CourseCard } from '../components/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMyEnrollments } from '@/features/enrollments/hooks/useEnrollments';
import { useMyProgress } from '@/features/progress/hooks/useProgress';
import { useAuthContext } from '@/providers/AuthProvider';

const ITEMS_PER_PAGE = 9;

export function CoursesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  useAuthContext();

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data: coursesData, isLoading: isLoadingCourses, isError: isErrorCourses } = useCourses({ 
    limit: ITEMS_PER_PAGE, 
    skip 
  });
  
  const { data: categoriesData } = useCategories();
  const { isAuthenticated } = useAuthContext();
  const { data: enrollmentsRes } = useMyEnrollments({ enabled: isAuthenticated });
  const { data: progressRes } = useMyProgress({ enabled: isAuthenticated });

  const totalPages = coursesData?.metadata?.totalPages || 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const enrollments = enrollmentsRes?.data || [];
  const completedLessonIds = new Set(progressRes?.data?.map((p: any) => p.lessonid) || []);

  const filteredCourses = coursesData?.data?.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? course.category?.categoryid === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative py-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute inset-0   rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Explore our <span className="text-primary bg-clip-text"> Courses</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock your potential with industry-leading courses designed to help you master new skills and accelerate your career.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md shadow-xl">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10 h-11 bg-background/50 border-white/10 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full px-4"
            >
              All
            </Button>
            {categoriesData?.data?.map((category) => (
              <Button
                key={category.categoryid}
                variant={selectedCategory === category.categoryid ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.categoryid)}
                className="rounded-full px-4 whitespace-nowrap"
              >
                {category.categoryName}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {isLoadingCourses ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="size-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading amazing courses for you...</p>
          </div>
        ) : isErrorCourses ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold mb-2 text-destructive">Oops! Something went wrong</h3>
            <p className="text-muted-foreground">We couldn't load the courses. Please try again later.</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-24">
            <Search className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const isEnrolled = isAuthenticated && enrollments.some((e: any) => e.courseid === course.id);
              const courseLessons = course.topics?.flatMap((t: any) => t.lessons) || [];
              const totalCount = courseLessons.length;
              const completedCount = courseLessons.filter((l: any) => completedLessonIds.has(l.id)).length;

              return (
                <CourseCard
                  key={course.id}
                  courseId={course.id}
                  courseName={course.courseName}
                  description={course.description}
                  imageUrl={course.imageUrl}
                  categoryName={course.category?.categoryName}
                  status={course.status}
                  isEnrolled={isEnrolled}
                  totalLessonsCount={totalCount}
                  completedLessonsCount={completedCount}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!search && !selectedCategory && totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}
