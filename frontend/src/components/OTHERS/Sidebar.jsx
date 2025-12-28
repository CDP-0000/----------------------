import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROLE_MENUS } from '../../config/menuConfig'; // เรียกใช้ Config ที่เพิ่งสร้าง

export default function Sidebar() {
  const navigate = useNavigate();

  // 1. ดึง Role จาก LocalStorage (หรือ Context)
  const userRole = localStorage.getItem('userRole') || 'guest';
  const userData = JSON.parse(localStorage.getItem('userData')) || { firstname: 'User' };

  // 2. เลือกเมนูที่จะแสดง (ถ้าไม่เจอ Role ให้ใช้อาร์เรย์ว่าง)
  const menus = ROLE_MENUS[userRole] || [];

  const handleLogout = () => {
    localStorage.clear(); // ล้างข้อมูล
    navigate('/login');   // ดีดกลับไปหน้า Login
  };

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col shadow-xl font-sans">
      
      {/* --- ส่วนหัว (Logo) --- */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-950">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">
          MY<span className="text-white">FOUNDATION</span>
        </h1>
      </div>

      {/* --- ส่วนข้อมูลผู้ใช้ (User Profile Mini) --- */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
            {userData.firstname.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{userData.firstname}</p>
            <p className="text-xs text-slate-400 capitalize">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* --- รายการเมนู (Loop) --- */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
               ${isActive 
                 ? "bg-blue-600 text-white shadow-md shadow-blue-900/50" // สถานะ Active
                 : "text-slate-300 hover:bg-slate-800 hover:text-white"  // สถานะปกติ
               }`
            }
          >
            {/* แสดงไอคอน (ถ้ามี) หรือใช้จุดวงกลมแทน */}
            {item.icon ? item.icon : <span className="w-2 h-2 rounded-full bg-current"></span>}
            <span className="text-sm font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* --- ปุ่ม Logout (ด้านล่างสุด) --- */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          ออกจากระบบ
        </button>
      </div>

    </div>
  );
}