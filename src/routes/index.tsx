// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import HomePage from '@/features/home';
import { CoursesPage } from '@/features/course/pages/coursesPage';
import { CourseDetailPage } from '@/features/course/pages/CourseDetailPage';
import { TopicDetailPage } from '@/features/topic/pages/TopicDetailPage';
import { LessonDetailPage } from '@/features/lesson/pages/LessonDetailPage';
import { SignIn } from '@/features/auth/pages/signIn';
import { SignUp } from '@/features/auth/pages/signUp';
import { GuestRoute } from './GuestRoute';
import { UserDashboard } from '@/features/users';
import {
  AdminLayout,
  DashboardOverview,
  UserManagementPage,
  AdminProfilePage,
  ContentApprovalsPage,
  CategoryManagementPage,
  AnnouncementsPage,
  FeaturedContentPage,
  CoursePreviewPage,
} from '@/features/admin';
import {
  CreatorDashboardPage,
  CreatorContentPage,
  CreatorProfilePage,
  ContentManagementPage,
} from '@/features/creator';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { CreatorLayout } from '@/layouts/CreatorLayout';

const LoginPage = () => <SignIn />;
const SignupPage = () => <SignUp />;

const UnauthorizedPage = () => (
  <div className="flex items-center justify-center min-h-screen text-2xl">
    Unauthorized Access
  </div>
);
const NotFoundPage = () => (
  <div className="flex items-center justify-center min-h-screen text-2xl">
    404 Not Found
  </div>
);

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/courses',
        element: <CoursesPage />,
      },
      {
        path: '/courses/:courseId',
        element: <CourseDetailPage />,
      },
      {
        path: '/courses/:courseId/topics/:topicId',
        element: <TopicDetailPage />,
      },
      {
        path: '/courses/:courseId/topics/:topicId/lessons/:lessonId',
        element: <LessonDetailPage />,
      },
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
      },
      // Protected User Routes
      {
        element: (
          <ProtectedRoute
            allowedRoles={['STUDENT', 'CREATOR', 'SUPER_CREATOR', 'ADMIN']}
          />
        ),
        children: [
          {
            path: '/dashboard/:userId',
            element: <UserDashboard />,
          },
        ],
      },
      // Protected Admin Routes
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            element: <AdminLayout />,
            path: '/admin',
            children: [
              { index: true, element: <DashboardOverview /> },
              { path: 'users', element: <UserManagementPage /> },
              { path: 'profile', element: <AdminProfilePage /> },
              { path: 'announcements', element: <AnnouncementsPage /> },
            ],
          },
        ],
      },
      // Protected Creator Routes
      {
        element: <ProtectedRoute allowedRoles={['CREATOR', 'SUPER_CREATOR']} />,
        children: [
          {
            element: <CreatorLayout />,
            path: '/creator',
            children: [
              {
                element: <CreatorDashboardPage />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="/creator/content" replace />,
                  },
                  { path: 'content', element: <CreatorContentPage /> },
                  { path: 'profile', element: <CreatorProfilePage /> },
                  {
                    path: 'manage/:courseId',
                    element: <ContentManagementPage />,
                  },
                  {
                    element: (
                      <ProtectedRoute allowedRoles={['SUPER_CREATOR']} />
                    ),
                    children: [
                      { path: 'approvals', element: <ContentApprovalsPage /> },
                      {
                        path: 'approvals/:courseId',
                        element: <CoursePreviewPage />,
                      },
                      {
                        path: 'categories',
                        element: <CategoryManagementPage />,
                      },
                      { path: 'featured', element: <FeaturedContentPage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // Auth Layout (No Header/Footer)
  {
    element: <AuthLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/signup',
            element: <SignupPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
