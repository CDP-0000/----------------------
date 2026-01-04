import { Routes, Route, Navigate } from 'react-router-dom'

// Import Pages (Auth)
import LOGIN from './pages/AUTH/login'
import REGISTER from './pages/AUTH/register'
import TEST from './pages/TESTS/test'

// Import Pages (Dashboards) - **ต้องสร้างไฟล์เหล่านี้ก่อนนะครับ**
import AdminDashboard from './pages/ADMIN/Dashboard_admin';
import StudentDashboard from './pages/STUDENT/Dashboard_student';
import StaffDashboard from './pages/STAFF/Dashboard_staff';
import ManagerDashboard from './pages/MANAGER/Dashboard_manager';
import DirectorDashboard from './pages/DIRECTOR/Dashboard_director';

import AdminSchools from './pages/ADMIN/master/AdminSchool'
import AdminBranches from './pages/ADMIN/master/AdminBranches';
import AdminVillages from './pages/ADMIN/master/AdminVillages';

import AdminUsersPage from './pages/ADMIN/AdminUsersPage.jsx';

// Import Guard & Layout
import ProtectedRoute from './components/OTHERS/ProtectedRoute'
import MainLayout from './components/layouts/MainLayout'

function App() {
  return (
    <Routes>
      {/* =========================================
          1. Public Zone (ไม่ต้อง Login)
      ========================================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LOGIN />} />
      <Route path="/register" element={<REGISTER />} />

      {/* =========================================
          2. Private Zone (ต้อง Login + เช็ค Role)
      ========================================= */}

      {/* ใช้ MainLayout ครอบทั้งหมดเพื่อให้มี Sidebar/Header */}
      <Route element={<MainLayout />}>

        {/* --- A. Admin Only --- */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/home" element={<AdminDashboard />} />
          {/* เพิ่ม Route อื่นๆ ของ Admin ต่อที่นี่ได้ เช่น /admin/users */}
          <Route path="/admin/schools" element={<AdminSchools />} />
          <Route path="/admin/branches" element={<AdminBranches />} />
          <Route path="/admin/villages" element={<AdminVillages />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* --- B. Student Only --- */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        {/* --- C. Staff Only --- */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff" element={<StaffDashboard />} />
        </Route>

        {/* --- D. Manager Only --- */}
        <Route element={<ProtectedRoute allowedRoles={['branch_manager']} />}>
          <Route path="/manager" element={<ManagerDashboard />} />
        </Route>

        {/* --- E. Director Only --- */}
        <Route element={<ProtectedRoute allowedRoles={['director']} />}>
          <Route path="/director" element={<DirectorDashboard />} />
        </Route>

        {/* --- F. Shared / Others --- */}
        <Route path="/TESTER_PAGE_" element={<TEST />} />

      </Route>

      {/* ดักทาง: ถ้าพิมพ์ URL มั่วๆ ให้ดีดกลับไป Login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App