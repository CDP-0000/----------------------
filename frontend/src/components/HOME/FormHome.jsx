// src/pages/HOME/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {

  // 1. Stats (Mockup): สถิติภาพรวมสำหรับ Admin
  const stats = [
    { title: "นักเรียนในระบบ", value: "1,254", icon: "🎓", color: "bg-blue-500", shadow: "shadow-blue-200" },
    { title: "คำขอแก้ไขข้อมูล", value: "3", icon: "🔔", color: "bg-orange-500", shadow: "shadow-orange-200" },
    { title: "รายงานวันนี้", value: "15", icon: "📊", color: "bg-emerald-500", shadow: "shadow-emerald-200" },
    { title: "ผู้ใช้งานทั้งหมด", value: "8", icon: "🛡️", color: "bg-slate-500", shadow: "shadow-slate-200" },
  ]

  // 2. Menu Groups: จัดกลุ่มเมนู 9 อย่าง ให้หาง่ายและสวยงาม
  const menuGroups = [
    {
      title: "⚡ จัดการคำร้องและงานด่วน (Action Required)",
      items: [
        { 
          name: "จัดการคำขอแก้ไขข้อมูล", 
          desc: "ตรวจสอบและอนุมัติคำร้องจาก User", 
          path: "/admin/requests", 
          // ดีไซน์สีส้ม (แจ้งเตือน)
          style: "border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-100 hover:border-orange-300" 
        },
      ]
    },
    {
      title: "📝 ข้อมูลนักเรียนและการสอน (Operations)",
      items: [
        { 
          name: "ประวัติเด็ก", desc: "จัดการข้อมูลประวัตินักเรียน", path: "/admin/students", 
          style: "border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 hover:border-blue-300" 
        },
        { 
          name: "สรุปบทเรียนประจำวัน", desc: "บันทึก/ดูสรุปบทเรียน", path: "/admin/daily-lessons", 
          style: "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300" 
        },
        { 
          name: "สรุปหน้าที่ประจำวัน", desc: "ติดตามภาระหน้าที่", path: "/admin/daily-duties", 
          style: "border-teal-200 bg-teal-50/50 text-teal-700 hover:bg-teal-100 hover:border-teal-300" 
        },
      ]
    },
    {
      title: "⚙️ จัดการข้อมูลหลัก (Master Data)",
      items: [
        { name: "ข้อมูลผู้ใช้ (Users)", desc: "จัดการ Account", path: "/admin/users", style: "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50" },
        { name: "ข้อมูลวิชาเรียน", desc: "หลักสูตร/วิชา", path: "/admin/subjects", style: "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50" },
        { name: "ข้อมูลสาขา", desc: "สาขามูลนิธิ", path: "/admin/branches", style: "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50" },
        { name: "ข้อมูลหมู่บ้าน", desc: "หมู่บ้านเครือข่าย", path: "/admin/villages", style: "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50" },
        { name: "ข้อมูลโรงเรียน", desc: "โรงเรียนเครือข่าย", path: "/admin/schools", style: "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50" },
      ]
    }
  ]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in-up">
      
      {/* --- 1. Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">ยินดีต้อนรับสู่ระบบจัดการฐานข้อมูล (ผู้ดูแลระบบ)</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
           </svg>
           {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>

      {/* --- 2. Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl ${stat.color} shadow-lg ${stat.shadow}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- 3. Menu Sections (วน Loop สร้างตามกลุ่ม) --- */}
      <div className="space-y-8">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* หัวข้อหมวดหมู่ */}
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-slate-800 rounded-full"></div>
              {group.title}
            </h2>
            
            {/* Grid การ์ดเมนู */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((item, itemIndex) => (
                <Link 
                  key={itemIndex} 
                  to={item.path}
                  className={`
                    group relative p-6 rounded-2xl border-2 transition-all duration-300 
                    flex items-center justify-between cursor-pointer hover:shadow-lg
                    ${item.style}
                  `}
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* ลูกศร (จะเลื่อนขวาตอนเอาเมาส์ชี้) */}
                  <div className="bg-white/50 p-2.5 rounded-full backdrop-blur-sm group-hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- 4. News / Logs Section --- */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                การแจ้งเตือนล่าสุด
            </h3>
            <Link to="/admin/logs" className="text-sm text-blue-600 hover:underline">ดูทั้งหมด</Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
             <div className="mt-1 p-2 bg-orange-100 text-orange-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
             </div>
             <div>
                <p className="text-sm font-bold text-slate-800">มีคำขอแก้ไขข้อมูลใหม่ 3 รายการ</p>
                <p className="text-xs text-slate-500 mt-1">รอการตรวจสอบจากคุณ • 10 นาทีที่แล้ว</p>
             </div>
             <button className="ml-auto text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">ตรวจสอบ</button>
          </div>
        </div>
      </div>

    </div>
  )
}