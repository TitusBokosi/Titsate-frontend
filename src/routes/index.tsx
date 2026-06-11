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
import { UserDashboard, SharedProfilePage } from '@/features/users';
import {
  DashboardOverview,
  UserManagementPage,
  ContentApprovalsPage,
  CategoryManagementPage,
  AnnouncementsPage,
  FeaturedContentPage,
  CoursePreviewPage,
} from '@/features/admin';
import {
  CreatorContentPage,
  ContentManagementPage,
} from '@/features/creator';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import AboutUsPage from '@/features/home/pages/AboutUsPage';

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
        path: '/about',
        element: <AboutUsPage />,
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
    ],
  },
  // Unified Dashboard Routes
  {
    element: <DashboardLayout />,
    children: [
      // Shared Profile Route
      {
        element: (
          <ProtectedRoute
            allowedRoles={['STUDENT', 'CREATOR', 'SUPER_CREATOR', 'ADMIN']}
          />
        ),
        children: [{ path: '/profile', element: <SharedProfilePage /> }],
      },
      // Protected User Routes
      {
        element: (
          <ProtectedRoute
            allowedRoles={['STUDENT', 'CREATOR', 'SUPER_CREATOR', 'ADMIN']}
          />
        ),
        path: '/dashboard/:userId',
        children: [
          { index: true, element: <Navigate to="learning" replace /> },
          { path: 'learning', element: <UserDashboard /> },
          { path: 'progress', element: <UserDashboard /> },
        ],
      },
      // Protected Admin Routes
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        path: '/admin',
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: 'users', element: <UserManagementPage /> },
          { path: 'announcements', element: <AnnouncementsPage /> },
        ],
      },
      // Protected Creator Routes
      {
        element: <ProtectedRoute allowedRoles={['CREATOR', 'SUPER_CREATOR']} />,
        path: '/creator',
        children: [
          {
            index: true,
            element: <Navigate to="/creator/content" replace />,
          },
          { path: 'content', element: <CreatorContentPage /> },
          {
            path: 'manage/:courseId',
            element: <ContentManagementPage />,
          },
          {
            element: <ProtectedRoute allowedRoles={['SUPER_CREATOR']} />,
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
  {
    element: <MainLayout />, // Catch-all or other standalone pages if needed, but usually MainLayout wraps the main app
    children: [
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
