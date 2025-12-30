import React from 'react';
import { 
  StarIcon, 
  BookOpenIcon, 
  TrashIcon, // แทนหน้าที่เวร
  TrophyIcon 
} from '@heroicons/react/24/solid'; // ใช้ Solid ให้ดูเด่น

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('userData')) || { firstname: 'น้องรักเรียน' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-20">
      
      {/* 1. Welcome Card แบบเด็กๆ */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">สวัสดีครับ, {user.firstname}! 👋</h1>
          <p className="opacity-90">วันนี้อย่าลืมทำหน้าที่เวรประจำวันนะครับ</p>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* 2. Gamification Stats (แต้มความดี) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-500 rounded-full">
            <StarIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500">แต้มความดีสะสม</p>
            <p className="text-2xl font-bold text-slate-800">1,250 <span className="text-xs font-normal">แต้ม</span></p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-500 rounded-full">
            <TrophyIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500">ระดับ (Level)</p>
            <p className="text-2xl font-bold text-slate-800">Gold <span className="text-xs font-normal">User</span></p>
          </div>
        </div>
      </div>

      {/* 3. เมนูหลัก (Action Menu) */}
      <h3 className="text-lg font-bold text-slate-700 mt-4">เมนูของฉัน</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* การ์ดหน้าที่เวร */}
        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-pink-200 hover:border-pink-400 cursor-pointer transition-all hover:bg-pink-50 group">
          <TrashIcon className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform mb-2" />
          <h4 className="font-bold text-slate-700">เวรประจำวัน</h4>
          <p className="text-xs text-slate-500">เช็ครายการที่ต้องทำวันนี้</p>
        </div>

        {/* การ์ดประวัติการเรียน */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md cursor-pointer transition-all group">
          <BookOpenIcon className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform mb-2" />
          <h4 className="font-bold text-slate-700">ผลการเรียน</h4>
          <p className="text-xs text-slate-500">ดูเกรดและพัฒนาการ</p>
        </div>

        {/* การ์ดข้อมูลส่วนตัว */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md cursor-pointer transition-all group">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2 font-bold group-hover:scale-110 transition-transform">
            👤
          </div>
          <h4 className="font-bold text-slate-700">ข้อมูลของฉัน</h4>
          <p className="text-xs text-slate-500">แก้ไขประวัติส่วนตัว</p>
        </div>

      </div>
    </div>
  );
}