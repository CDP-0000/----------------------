import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../OTHERS/Navbar'; // เรียก Navbar ของเดิมที่คุณมี
import Footer from '../OTHERS/Footer'; // เรียก Footer ของเดิมที่คุณมี

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ส่วนหัว */}
      <Navbar />

      {/* ส่วนเนื้อหา (เจาะช่องตรงนี้) */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      {/* ส่วนท้าย */}
      <Footer />
    </div>
  );
}