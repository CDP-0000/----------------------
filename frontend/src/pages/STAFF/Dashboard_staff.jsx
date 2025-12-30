import React from 'react';
import { 
  ClipboardDocumentCheckIcon, 
  UserPlusIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('userData')) || { firstname: 'สมหญิง', branchId: 'BRANCH_01' };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">แดชบอร์ดเจ้าหน้าที่</h1>
          <p className="text-slate-500">สาขา: {user.branchId} | ยินดีต้อนรับคุณครู {user.firstname}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2">
          <UserPlusIcon className="w-4 h-4" /> ลงทะเบียนเด็กใหม่
        </button>
      </div>

      {/* Quick Actions (งานประจำวันที่ต้องทำ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ClipboardDocumentCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700">บันทึกการสอน</h3>
          </div>
          <p className="text-sm text-slate-500">บันทึกพัฒนาการเด็กรายวัน / กิจกรรมกลุ่ม</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-green-400 cursor-pointer transition-all">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <span className="text-xl">🏠</span>
            </div>
            <h3 className="font-bold text-slate-700">บันทึกเยี่ยมบ้าน</h3>
          </div>
          <p className="text-sm text-slate-500">กรอกข้อมูลสภาพความเป็นอยู่ครอบครัว</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-orange-400 cursor-pointer transition-all">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700">ปรึกษา/ส่งต่อ</h3>
          </div>
          <p className="text-sm text-slate-500">แจ้งปัญหาถึงผู้จัดการสาขา</p>
        </div>
      </div>

      {/* Table: เด็กในความดูแลล่าสุด */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700">📋 รายชื่อเด็กที่อัปเดตล่าสุด</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="p-4">ชื่อ-นามสกุล</th>
              <th className="p-4">ประเภท</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Mock Data Row */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-800">ด.ช. กล้าหาญ ชาญชัย</td>
              <td className="p-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">โครงการ</span></td>
              <td className="p-4"><span className="text-green-600">● ปกติ</span></td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">แก้ไข</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-800">ด.ญ. ใจดี มีสุข</td>
              <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">ทั่วไป</span></td>
              <td className="p-4"><span className="text-orange-500">● ขาดเรียน</span></td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">แก้ไข</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}