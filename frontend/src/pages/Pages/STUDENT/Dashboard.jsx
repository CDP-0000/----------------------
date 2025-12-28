// src/pages/STUDENT/Dashboard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  // ไม่ต้อง import Navbar แล้ว!
  // ไม่ต้อง import Footer แล้ว!
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
       <h1 className="text-2xl font-bold text-blue-600">
          ยินดีต้อนรับ, ด.ช.เรียนดี
       </h1>
       <p className="mt-2 text-gray-600">
          สถานะ: <span className="text-green-600 font-bold">ทุนการศึกษา CDP</span>
       </p>

       <div className="mt-6 flex gap-4">
          <Link to="/student/register" className="btn-primary">
             ลงทะเบียนเรียน
          </Link>
          <Link to="/student/history" className="btn-secondary">
             ดูผลการเรียน
          </Link>
       </div>
    </div>
  )
}