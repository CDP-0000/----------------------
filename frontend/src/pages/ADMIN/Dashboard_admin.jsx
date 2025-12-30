import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ExclamationTriangleIcon, 
  DocumentChartBarIcon,
  // เพิ่ม Icon สำหรับตกแต่งส่วนหัวใหม่
  ClipboardDocumentCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'; 

export default function AdminDashboard() {
  
  // 1. Mock Data: สถิติภาพรวม
  const stats = [
    { title: 'ผู้ใช้งานทั้งหมด', value: '128', icon: <UsersIcon className="w-8 h-8"/>, color: 'bg-blue-500', link: '/admin/users' },
    { title: 'นักเรียนในระบบ', value: '1,254', icon: <AcademicCapIcon className="w-8 h-8"/>, color: 'bg-emerald-500', link: '/admin/students' },
    { title: 'คำร้องรอตรวจสอบ', value: '5', icon: <DocumentChartBarIcon className="w-8 h-8"/>, color: 'bg-orange-500', link: '/admin/requests' },
    { title: 'แจ้งเตือนนอกเวลา', value: '2', icon: <ExclamationTriangleIcon className="w-8 h-8"/>, color: 'bg-red-500', link: '/admin/logs' },
  ];

  // 2. Mock Data: รายการแจ้งเตือนล่าสุด
  const recentLogs = [
    { id: 1, user: 'สมหญิง (Staff)', action: 'แก้ไขเกรดเฉลี่ย', time: '23:45 น.', status: 'warning', branch: 'สาขาอุบลฯ' },
    { id: 2, user: 'สมชาย (Manager)', action: 'ลบข้อมูลนักเรียน', time: '10:30 น.', status: 'normal', branch: 'สาขากรุงเทพฯ' },
    { id: 3, user: 'Admin System', action: 'เพิ่มรายวิชาใหม่', time: '09:15 น.', status: 'normal', branch: '-' },
  ];

  // 3. New Data: เมนูจัดการงานประจำวัน (Daily & Student Management)
  const academicMenu = [
    { 
      name: 'จัดการประวัติเด็ก', 
      desc: 'ข้อมูลส่วนตัว, ครอบครัว, สุขภาพ',
      path: '/admin/students/history', 
      img: '👦',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    { 
      name: 'สรุปหน้าที่ประจำวัน', 
      desc: 'เวรทำความสะอาด, ความรับผิดชอบ',
      path: '/admin/daily/duties', 
      img: '🧹',
      color: 'bg-pink-50 text-pink-600 border-pink-200'
    },
    { 
      name: 'สรุปการสอนประจำวัน', 
      desc: 'บันทึกการสอน, พัฒนาการรายวัน',
      path: '/admin/daily/teaching', 
      img: '📝',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">ภาพรวมระบบและการจัดการข้อมูลศูนย์</p>
        </div>
        <div className="text-sm bg-white border px-4 py-2 rounded-lg shadow-sm text-slate-600">
          📅 {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}
        </div>
      </div>

      {/* --- Section 1: Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link 
            key={index} 
            to={stat.link}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group"
          >
            <div>
              <p className="text-slate-500 text-sm mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {stat.value}
              </h3>
            </div>
            <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg opacity-90 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* --- Section 2: Quick Actions & Alerts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: รวมเมนูจัดการทั้งหมด */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 2.1 ✅ NEW SECTION: จัดการผู้เรียนและกิจกรรม (Daily Ops) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                        <UserGroupIcon className="w-5 h-5"/>
                    </span>
                    การจัดการผู้เรียนและกิจกรรม (Daily Operations)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {academicMenu.map((item, idx) => (
                        <Link 
                            key={idx} 
                            to={item.path}
                            className={`flex flex-col p-4 border rounded-xl hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer ${item.color.replace('text-', 'border-').replace('bg-', 'hover:bg-opacity-80 ')} bg-white`}
                        >
                            <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mb-3 font-bold text-2xl shadow-sm`}>
                                {item.img}
                            </div>
                            <span className="text-base font-bold text-slate-700">{item.name}</span>
                            <span className="text-xs text-slate-500 mt-1">{item.desc}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 2.2 Existing Section: จัดการข้อมูลหลัก (Master Data) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <ClipboardDocumentCheckIcon className="w-5 h-5"/>
                    </span>
                    ตั้งค่าข้อมูลหลัก (Master Data)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                    { name: 'โรงเรียน', path: '/admin/master/schools' ,img:'🏫' },
                    { name: 'หมู่บ้าน', path: '/admin/master/villages' ,img:'🏘️' },
                    { name: 'สาขา', path: '/admin/master/branches', img:'🏢' },
                    { name: 'วิชาเรียน', path: '/admin/master/subjects', img:'📚' },
                    ].map((item, idx) => (
                    <Link 
                        key={idx} 
                        to={item.path}
                        className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer text-center group"
                    >
                        <div className="w-10 h-10 bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-full flex items-center justify-center mb-2 font-bold text-lg transition-colors">
                        {item.img || '📁'}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </Link>
                    ))}
                </div>
            </div>

        </div>

        {/* Right Column: การแจ้งเตือน (เหมือนเดิม) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              🛡️ การใช้งานล่าสุด
            </h3>
            <Link to="/admin/logs" className="text-xs text-blue-600 hover:underline">ดูทั้งหมด</Link>
          </div>
          
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className={`p-3 rounded-lg border flex items-start gap-3 ${
                log.status === 'warning' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  log.status === 'warning' ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    {log.user} <span className="text-xs font-normal text-slate-500">({log.branch})</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{log.action}</p>
                  {log.status === 'warning' && (
                    <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">
                      ⚠️ ทำรายการนอกเวลางาน
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}