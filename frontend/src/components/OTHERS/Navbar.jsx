// src/components/Navbar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import logo from "../../assets/logo.png"

// 1) Home path ตาม Role
const ROLE_HOME = {
  admin: "/home",
  student: "/student",
  staff: "/staff",
  branch_manager: "/manager",
  director: "/director",
}

// 2) เมนูทั้งหมดตาม Role
const ROLE_MENUS = {
  admin: [
    { label: "หน้าหลัก", to: "/home" },
    { label: "จัดการผู้ใช้", to: "/admin/users" },
    { label: "จัดการโรงเรียน", to: "/admin/schools" },
    { label: "จัดการสาขา", to: "/admin/branches" },
    { label: "จัดการหมู่บ้าน", to: "/admin/villages" },
    { label: "จัดการคำร้อง", to: "/admin/requests" },
    { label: "สรุปจำนวนประจำวัน", to: "/admin/daily-summary" },
    { label: "สรุปหน้าที่ประจำวัน", to: "/admin/daily-career" },
    { label: "จัดการประวัติเด็ก", to: "/admin/child-history" },
  ],
  student: [
    { label: "หน้าหลัก", to: "/student" },
    { label: "ลงทะเบียน", to: "/student/register" },
    { label: "โปรไฟล์", to: "/student/profile" },
  ],
  staff: [
    { label: "หน้าหลัก", to: "/staff" },
    { label: "สรุปจำนวนประจำวัน", to: "/staff/daily-summary" },
    { label: "สรุปหน้าที่ประจำวัน", to: "/staff/daily-career" },
    { label: "จัดการประวัติเด็ก", to: "/staff/child-history" },
    { label: "จัดรายชื่อเด็กประจำวิชา", to: "/staff/child-list" },
    { label: "คำร้อง", to: "/staff/requests" },
    { label: "โปรไฟล์", to: "/staff/profile" },
  ],
  branch_manager: [
    { label: "หน้าหลัก", to: "/manager" },
    { label: "จัดสรุปจำนวนประจำวัน", to: "/manager/daily-summary" },
    { label: "จัดสรุปหน้าที่ประจำวัน", to: "/manager/daily-career" },
    { label: "จัดการประวัติเด็ก", to: "/manager/child-history" },
    { label: "จัดรายชื่อเด็กประจำวิชา", to: "/manager/child-list" },
    { label: "คำร้อง", to: "/manager/requests" },
    { label: "โปรไฟล์", to: "/manager/profile" },
  ],
  director: [
    { label: "หน้าหลัก", to: "/director" },
    { label: "คำร้อง", to: "/director/requests" },
    { label: "สรุปจำนวนประจำวัน", to: "/director/daily-summary" },
    { label: "สรุปหน้าที่ประจำวัน", to: "/director/daily-career" },
    { label: "จัดการประวัติเด็ก", to: "/director/child-history" },
    { label: "โปรไฟล์", to: "/director/profile" },
  ],
}

const cx = (...c) => c.filter(Boolean).join(" ")

function splitMenus(menus) {
  const home = menus.find((m) => m.label === "หน้าหลัก") || menus[0]
  const profile = menus.find((m) => m.label.includes("โปรไฟล์"))

  const main = []
  if (home) main.push(home)
  if (profile && profile.to !== home?.to) main.push(profile)

  if (main.length < 2) {
    const next = menus.find((m) => !main.some((x) => x.to === m.to))
    if (next) main.push(next)
  }

  const main3 = main.slice(0, 3)
  const mainSet = new Set(main3.map((m) => m.to))
  const more = menus.filter((m) => !mainSet.has(m.to))

  return { main: main3, more }
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const dropdownRef = useRef(null)

  const role = localStorage.getItem("userRole") || ""
  const homePath = ROLE_HOME[role] || "/login"
  const menus = ROLE_MENUS[role] || []

  const { main, more } = useMemo(() => splitMenus(menus), [menus])

  const isActive = (to) => location.pathname === to

  // ✅ ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setMoreOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  // ✅ ปิด “เพิ่มเติม” เมื่อคลิกนอก (ไม่ใช้ overlay → ไม่มีอะไรทับ dropdown อีกแล้ว)
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!moreOpen) return
      const el = dropdownRef.current
      if (el && !el.contains(e.target)) setMoreOpen(false)
    }
    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [moreOpen])

  // ✅ ปิดด้วย ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMoreOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const handleLogout = () => {
    const ok = window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")
    if (!ok) return
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    navigate("/login", { replace: true })
  }

  return (
    <>
      <nav className="bg-[#1E00FF] w-full h-20 flex items-center justify-between px-4 sm:px-6 shadow-md sticky top-0 z-50">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          onClick={() => navigate(homePath)}
        >
          <img src={logo} alt="Logo" className="h-12 hover:scale-105 transition duration-300" />
          <span className="text-white font-bold text-lg sm:text-xl tracking-wide hidden sm:block">
            Child Development Programs
          </span>
        </div>

        {/* Center: Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-3 text-white font-medium">
          {main.map((m) => (
            <button
              key={m.to}
              type="button"
              onClick={() => navigate(m.to)}
              className={cx(
                "px-3 py-2 rounded-xl transition duration-200",
                isActive(m.to)
                  ? "bg-white/15 text-yellow-300 scale-[1.02]"
                  : "hover:text-yellow-300 hover:bg-white/10 hover:scale-[1.02]"
              )}
            >
              {m.label}
            </button>
          ))}

          {/* Desktop: More Dropdown */}
          {more.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={cx(
                  "px-3 py-2 rounded-xl transition duration-200",
                  moreOpen ? "bg-white/15 text-yellow-300" : "hover:text-yellow-300 hover:bg-white/10"
                )}
              >
                เพิ่มเติม ▾
              </button>

              {moreOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl overflow-hidden ring-1 ring-black/10 z-10">
                  {more.map((m) => (
                    <button
                      key={m.to}
                      type="button"
                      onClick={() => {
                        navigate(m.to)
                        setMoreOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-100 transition"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-white text-sm opacity-80">สวัสดี, {role || "-"}</span>

          <button
            onClick={handleLogout}
            type="button"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-white/10 text-white border border-white/20
                       hover:bg-red-500 hover:border-red-500 hover:shadow-lg
                       transition duration-300"
          >
            <span className="hidden md:inline">ออกจากระบบ</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[70]" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[80] shadow-2xl">
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200">
              <div className="font-bold text-slate-900">เมนู</div>
              <button className="p-2 rounded-xl hover:bg-slate-100" onClick={() => setMobileOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="text-sm text-slate-600 mb-3">
                เข้าสู่ระบบเป็น: <b>{role || "-"}</b>
              </div>

              <div className="space-y-2">
                {[...main, ...more].map((m) => (
                  <button
                    key={m.to}
                    type="button"
                    onClick={() => {
                      navigate(m.to)
                      setMobileOpen(false)
                    }}
                    className={cx(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition",
                      isActive(m.to)
                        ? "bg-[#1E00FF]/10 text-[#1E00FF] ring-1 ring-[#1E00FF]/20"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
