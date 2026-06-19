import { useCreatorCourses, useCreatorActions } from '../hooks/useCreator';
import { useNavigate } from 'react-router-dom';
import CreatorHeader from '../components/CreatorHeader';
import CoursesGrid from '../components/CoursesGrid';

export function CreatorContentPage() {
  const { data: courses, isLoading } = useCreatorCourses();
  const navigate = useNavigate();
  const { createCourse, isProcessing, deleteCourse } = useCreatorActions();

  const handleCreateCourse = async (
    title?: string,
    description?: string,
    categoryId?: string | null,
    benefits?: string[],
  ) => {
    if (!title || title.trim() === '') return;
    try {
      const newCourse = await createCourse({
        courseName: title,
        description: description ?? 'Add a description for your course here.',
        ...(categoryId ? { categoryId } : {}),
        ...(benefits ? { benefits } : {}),
      });
      if (newCourse && 'id' in newCourse) {
        navigate(`/creator/manage/${newCourse.id}`);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <CreatorHeader
        onCreate={handleCreateCourse}
        isProcessing={isProcessing}
      />
      <CoursesGrid
        courses={courses}
        isLoading={isLoading}
        onDelete={deleteCourse}
      />
    </div>
  );
}

export default CreatorContentPage;
