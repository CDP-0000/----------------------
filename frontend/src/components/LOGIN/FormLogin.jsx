// src/page/Login.jsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthAPI } from "../../lib/api/endpoints" // ✅ 1. เรียกใช้ API

export default function FormLogin() {
  const navigate = useNavigate()

  // State เก็บค่าต่างๆ
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // ✅ 2. ฟังก์ชัน Login ของจริง (เชื่อม Backend)
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 2.1 ยิงข้อมูลไปหา Backend
      const response = await AuthAPI.login(username, password)
      
      // ดึงข้อมูลที่ Backend ส่งกลับมา
      const { success, role, user } = response.data

      if (success) {
        console.log("Login Success:", role)

        // 2.2 บันทึกข้อมูลลงเครื่อง (เพื่อให้กด Refresh แล้วไม่หลุด)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', role)
        localStorage.setItem('userData', JSON.stringify(user))

        // 2.3 แยกทางเดินตาม Role (Redirect)
        switch (role) {
            case 'admin':
                navigate("/home") // ไปหน้า Admin Dashboard
                break
            case 'student':
                navigate("/home") // ไปหน้า Home ของนักเรียน (หรือ /student)
                break
            case 'staff':
                navigate("/staff") // (ถ้ามีหน้านี้)
                break
            case 'branch_manager':
                navigate("/manager") // (ถ้ามีหน้านี้)
                break
            case 'director':
                navigate("/director") // (ถ้ามีหน้านี้)
                break
            default:
                navigate("/") // กรณีไม่รู้ว่าเป็นใคร ให้ไปหน้าแรก
        }
      }

    } catch (err) {
      console.error("Login Error:", err)
      // 2.4 ถ้า Login พลาด ให้ดึงข้อความจาก Backend มาแสดง
      // (Backend ส่งมาว่า message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // --- ส่วน UI เหมือนเดิมเป๊ะ 100% ---
  return (
    <div className="mx-auto max-w-md w-6xl bg-white border border-gray-200 shadow-2xl rounded-2xl p-8 font-sans">
      
      {/* Style บังคับซ่อนตาของ Browser */}
      <style>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>

      <div className="text-center mb-8">
        <p className="text-3xl font-bold text-slate-800">เข้าสู่ระบบ</p>
        <p className="text-sm text-gray-400 mt-2">ระบบจัดการฐานข้อมูลมูลนิธิฯ</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 text-center">
        
        {/* Username Input */}
        <input
          type="text"
          className={`mx-5 border p-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#4000ff]/50 transition-all ${
            error ? "border-red-600 focus:ring-red-200" : "border-gray-300"
          }`}
          value={username}
          placeholder="อีเมลหรือชื่อผู้ใช้"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password Input Wrapper */}
        <div className="mx-5 relative">
          <input
            type={showPassword ? "text" : "password"}
            className={`w-full border p-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#4000ff]/50 transition-all pr-12 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
              error ? "border-red-600 focus:ring-red-200" : "border-gray-300"
            }`}
            value={password}
            placeholder="รหัสผ่าน"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {/* ปุ่มเปิด/ปิดตา */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4000ff] transition-colors p-1 cursor-pointer"
            tabIndex="-1"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg mx-5 border border-red-100">{error}</p>}

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="w-1/2 mx-auto mt-4
              text-white font-semibold
              bg-[#4000ff]
              hover:bg-[#3300cc]
              disabled:opacity-60 disabled:cursor-not-allowed
              p-4 rounded-xl
              shadow-lg shadow-indigo-200
              transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-[#4000ff]/50
              transition duration-300 ease-in-out"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              กำลังตรวจสอบ...
            </span>
          ) : "เข้าสู่ระบบ"}
        </button>

      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">หรือ</span>
        </div>
      </div>

      <h4 className="text-center text-gray-600 mb-4">สำหรับเด็กๆ โปรดลงทะเบียนที่นี่</h4>

      <div className="text-center">
        <button
          onClick={() => navigate("/register")}
          className="w-1/2 mx-auto
              text-white font-semibold
              bg-slate-900
              hover:bg-black
              focus:outline-none focus:ring-2 focus:ring-gray-400
              p-4 rounded-xl
              shadow-lg transform hover:scale-105 active:scale-95
              transition duration-300 ease-in-out"
        >
          ลงทะเบียนใหม่
        </button>
      </div>
    </div>
  )
}