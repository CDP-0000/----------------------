import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // ดึงข้อมูลจาก LocalStorage (ตามที่คุณบันทึกไว้ในหน้า Login)
  const token = localStorage.getItem('token'); // อย่าลืมแก้หน้า Login ให้เซฟ token ด้วยนะครับ
  const userRole = localStorage.getItem('userRole');

  // 1. ถ้าไม่มี Token หรือยังไม่ได้ Login -> ดีดไป Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. ถ้า Role ไม่ตรงกับที่อนุญาต -> ดีดไปหน้า Unauthorized หรือ Login
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // เช่น Admin พยายามเข้าหน้า Student หรือ Student พยายามเข้าหน้า Admin
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. ผ่านฉลุย -> แสดงหน้าข้างใน
  return <Outlet />;
};

export default ProtectedRoute;