import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // ✅ แก้จุดที่ 1: เปลี่ยนมาดึงค่า 'isLoggedIn' แทน 'token'
  const isLoggedIn = localStorage.getItem('isLoggedIn'); 
  const userRole = localStorage.getItem('userRole');

  // ✅ แก้จุดที่ 2: เช็คว่าถ้าไม่มี 'isLoggedIn' ให้ดีดออก
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. เช็ค Role (ส่วนนี้ถูกต้องแล้ว)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // ⚠️ หมายเหตุ: ตรวจสอบว่าใน App.jsx มี Route path="/unauthorized" หรือยัง?
    // ถ้าไม่มี ให้เปลี่ยนเป็น navigate ไป "/" หรือ "/login" แทนก็ได้ครับ
    return <Navigate to="/login" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;