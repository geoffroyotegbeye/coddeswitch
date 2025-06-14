import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminProjects } from '../components/admin/AdminProjects';
import { AdminBlog } from '../components/admin/AdminBlog';
import { AdminCommunity } from '../components/admin/AdminCommunity';
import { AdminSettings } from '../components/admin/AdminSettings';
import { UserProgress } from '../components/admin/users/UserProgress';

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/progress/:userId" element={<UserProgress />} />
        <Route path="projects/*" element={<AdminProjects />} />
        <Route path="blog/*" element={<AdminBlog />} />
        <Route path="community/*" element={<AdminCommunity />} />
        <Route path="settings/*" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
}