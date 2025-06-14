import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toast } from './components/common/Toast';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import Login from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectEditor as ProjectEditorPage } from './pages/ProjectEditor';
import { ProjectWorkspace } from './components/projects/ProjectWorkspace';
import { Challenges } from './pages/Challenges';
import { Community } from './pages/Community';
import { Messages } from './pages/Messages';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import Admin from './pages/Admin';

function AppContent() {
  const { user, isGuest, isLoading } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/projects" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <MainLayout>
              <Projects />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/project/:id" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <MainLayout>
              <ProjectEditorPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/project-standalone/:id" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <div className="min-h-screen bg-gray-900 p-6">
              <ProjectWorkspace standalone={true} />
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/challenges" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <MainLayout>
              <Challenges />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/community" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <MainLayout>
              <Community />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/messages" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (user || isGuest) ? (
            <MainLayout>
              <Messages />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={
          isLoading ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : user && !isGuest && user.is_admin ? (
            <div className="min-h-screen bg-gray-900">
              <Admin />
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;