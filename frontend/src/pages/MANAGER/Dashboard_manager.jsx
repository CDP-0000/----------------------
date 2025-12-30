import React from 'react';
import { 
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function ManagerDashboard() {
  const user = JSON.parse(localStorage.getItem('userData')) || { firstname: 'สมชาย', branchId: 'สาขาเชียงใหม่' };

  return (
    <div className="space-y-6 animate-fade-in-up">
       {/* Header */}
       <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold">ผู้จัดการสาขา ({user.branchId})</h1>
           <p className="text-slate-300">ภาพรวมการดำเนินงานประจำเดือน</p>
         </div>
         <div className="bg-white/10 p-3 rounded-lg">
           <BuildingOfficeIcon className="w-8 h-8 text-white" />
         </div>
       </div>

       {/* Branch Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm">จำนวนเด็กในสาขา</p>
           <div className="flex justify-between items-end mt-2">
             <h3 className="text-3xl font-bold text-slate-800">450 <span className="text-sm font-normal text-slate-400">คน</span></h3>
             <UsersIcon className="w-8 h-8 text-blue-500 opacity-50" />
           </div>
         </div>
         
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm">งบประมาณคงเหลือ</p>
           <div className="flex justify-between items-end mt-2">
             <h3 className="text-3xl font-bold text-slate-800">12,500 <span className="text-sm font-normal text-slate-400">บาท</span></h3>
             <CurrencyDollarIcon className="w-8 h-8 text-green-500 opacity-50" />
           </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm">Staff เข้างานวันนี้</p>
           <div className="flex justify-between items-end mt-2">
             <h3 className="text-3xl font-bold text-slate-800">8/10 <span className="text-sm font-normal text-slate-400">คน</span></h3>
             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
           </div>
         </div>
       </div>

       {/* Approve Requests Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* รายการรออนุมัติ */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4">📝 คำร้องรออนุมัติ</h3>
           <div className="space-y-4">
             {[1,2].map((i) => (
               <div key={i} className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
                 <div>
                   <p className="font-bold text-sm">เบิกอุปกรณ์การเรียน (สมุด 50 เล่ม)</p>
                   <p className="text-xs text-slate-500">โดย: ครูสมหญิง | เมื่อ: 10 นาทีที่แล้ว</p>
                 </div>
                 <div className="flex gap-2">
                   <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">อนุมัติ</button>
                   <button className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200">ปฏิเสธ</button>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* ประกาศภายในสาขา */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">📢 ประกาศภายในสาขา</h3>
            <textarea 
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              rows="4"
              placeholder="พิมพ์ข้อความประกาศถึง Staff..."
            ></textarea>
            <button className="mt-2 w-full bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-black">โพสต์ประกาศ</button>
         </div>
       </div>
    </div>
  );
}