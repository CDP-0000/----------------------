// src/pages/STAFF/DailyDuty.jsx
import React, { useState } from 'react';
import { ReportAPI } from '../../lib/api/endpoints';
import { 
  CalendarDaysIcon, 
  UserCircleIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';

export default function DailyDuty() {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ดึง user info
  const user = JSON.parse(localStorage.getItem('user')) || {}; 

  // CSS Class สำหรับ Input/Textarea ให้เหมือนหน้า Register
  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none shadow-sm";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    try {
      await ReportAPI.createDailyDuty({
        userId: user.id, 
        taskDescription: task
      });
      alert('✅ บันทึกข้อมูลเรียบร้อย!');
      setTask('');
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper สำหรับจัดรูปแบบวันที่
  const currentDate = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50/30 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
        
        {/* --- Header Section (Styled like Registration Success) --- */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10 blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-10 translate-y-10 blur-xl"></div>
          
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner ring-1 ring-white/30">
            <DocumentTextIcon className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">บันทึกหน้าที่ประจำวัน</h2>
          <p className="text-blue-100 mt-2 font-light text-sm tracking-wider uppercase">Daily Activity Log</p>
        </div>

        {/* --- Content Section --- */}
        <div className="p-8 md:p-10 space-y-8">
          
          {/* Info Cards (Grid with Hover Effects) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: วันที่ */}
            <div className="group bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CalendarDaysIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">วันที่</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{currentDate}</p>
              </div>
            </div>

            {/* Card 2: ผู้บันทึก */}
            <div className="group bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ผู้บันทึก</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {user.firstname ? `${user.firstname} ${user.lastname}` : 'ไม่ระบุตัวตน'}
                </p>
              </div>
            </div>

            {/* Card 3: สาขา */}
            <div className="group bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BuildingOfficeIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">สาขา</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{user.branchId || '-'}</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                รายละเอียดการทำงาน
                <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-slate-400 ml-auto">ระบุสิ่งที่ทำในวันนี้ให้ครบถ้วน</span>
              </label>
              
              <div className="relative">
                <textarea
                  className={inputClass}
                  rows="8"
                  placeholder="พิมพ์รายละเอียดงานที่ทำในวันนี้...&#10;เช่น&#10;• 09:00 - 10:00 : ตรวจเช็คอุปกรณ์การเรียน&#10;• 10:30 - 12:00 : สอนวิชาคณิตศาสตร์ ป.4&#10;• 13:00 - 16:00 : เตรียมเอกสารการประชุม"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
                <div className="absolute bottom-3 right-3 text-slate-300 pointer-events-none">
                    <DocumentTextIcon className="w-6 h-6 opacity-50" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังบันทึกข้อมูล...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5 -rotate-45 relative -top-0.5" />
                  ส่งรายงานประจำวัน
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}