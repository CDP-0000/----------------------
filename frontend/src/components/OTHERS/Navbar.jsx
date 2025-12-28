// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  // --- Mock Logout Function ---
  const handleLogout = () => {
    // จำลองการ Logout
    const confirmLogout = window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?");
    if (confirmLogout) {
      console.log("Mock Logout Success");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="bg-[#1E00FF] w-full h-20 flex items-center justify-between px-6 shadow-md sticky top-0 z-50">
      
      {/* --- ส่วนที่ 1: โลโก้ (ใช้ Icon แทนรูปภาพเพื่อให้แสดงผลได้เลย) --- */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
        onClick={() => navigate("/home")}
      >
        <div className=" text-[#1E00FF] p-2 rounded-lg">
           {/* Icon จำลอง */}
           <div className="text-white m2-0">
        <img
          src={logo}
          alt="Logo"
          className="h-12 cursor-pointer hover:scale-105 transition duration-300"
          onClick={() => navigate("/home")}
        />
      </div>
        </div>
        <span className="text-white font-bold text-xl tracking-wide">
            Child Development Programs
        </span>
      </div>

      {/* --- ส่วนที่ 2: เมนูหลัก --- */}
      <div className="hidden md:flex flex-grow justify-center gap-8 text-white font-medium">
        <button
          onClick={() => navigate("/home")}
          className="hover:text-yellow-300 hover:scale-105 transition duration-200"
        >
          หน้าหลัก
        </button>
        <button
          onClick={() => navigate("/menu")}
          className="hover:text-yellow-300 hover:scale-105 transition duration-200"
        >
          เมนูระบบ
        </button>
        <button
          onClick={() => navigate("/profile")} // สมมติว่ามีหน้า Profile
          className="hover:text-yellow-300 hover:scale-105 transition duration-200"
        >
          ข้อมูลส่วนตัว
        </button>
      </div>

      {/* --- ส่วนที่ 3: ปุ่มออกจากระบบ --- */}
      <div className="flex items-center gap-4">
        {/* ชื่อ User จำลอง */}
        <span className="hidden lg:block text-white text-sm opacity-80">
            สวัสดี, Admin
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-red-500 hover:border-red-500 hover:shadow-lg transition duration-300 ease-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>

    </nav>
  );
}