import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../OTHERS/Sidebar'; // เรียก Sidebar ที่เพิ่งสร้าง

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* --- 1. Sidebar (Fixed Left) --- */}
      <aside className="hidden md:flex flex-shrink-0">
         <Sidebar />
      </aside>

      {/* --- 2. Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* (Optional) Topbar สำหรับมือถือ ไว้กดเปิด Sidebar ได้ */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
            <span className="font-bold">MY FOUNDATION</span>
            <button>☰ เมนู</button>
        </header>

        {/* เนื้อหาหลักที่จะเปลี่ยนไปเรื่อยๆ */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           <Outlet />
        </main>
      </div>

    </div>
  );
}