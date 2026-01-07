import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  StarIcon,
  BookOpenIcon,
  TrashIcon,
  TrophyIcon,
  SparklesIcon,
  PencilSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid"

export default function StudentDashboard() {
  const navigate = useNavigate()

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData")) || {}
    } catch {
      return {}
    }
  }, [])

  const firstname = user.firstname || "น้องรักเรียน"
  const studentType = user.studentType || "NoCDP" // "CDP" | "NoCDP"
  const isCDP = studentType === "CDP"

  // ถ้าคุณมีการเก็บ preferences แล้ว เช่น localStorage.setItem("studentPreferences", JSON.stringify(...))
  // ก็ใช้คีย์นี้เช็คได้
  const hasPreferences = useMemo(() => {
    try {
      const p = JSON.parse(localStorage.getItem("studentPreferences"))
      // ปรับเงื่อนไขได้ตามโครงของคุณ
      return !!p && (Array.isArray(p.interests) ? p.interests.length > 0 : true)
    } catch {
      return false
    }
  }, [])

  // label สั้นๆ
  const typeBadge = isCDP
    ? { text: "เด็กในโครงการ (CDP)", cls: "bg-emerald-50 text-emerald-700" }
    : { text: "เด็กนอกโครงการ (NoCDP)", cls: "bg-slate-100 text-slate-700" }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* 1) Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              สวัสดีครับ, {firstname}! 👋
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeBadge.cls}`}>
              {typeBadge.text}
            </span>
          </div>

          <p className="opacity-90 text-sm sm:text-base">
            {isCDP
              ? "ข้อมูลเด็กในโครงการจะอัปเดตตามรอบ มี.ค. และ ก.ย. (แต่ความสนใจของเราปรับได้ตลอด)"
              : "เริ่มต้นตั้งค่าความสนใจสั้นๆ เพื่อให้ระบบแนะนำวิชาที่เหมาะกับคุณได้"}
          </p>

          {/* CTA สำหรับระบบแนะนำ */}
          {!hasPreferences ? (
            <button
              type="button"
              onClick={() => navigate("/student/preferences")}
              className="mt-2 inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2.5 rounded-2xl shadow-sm hover:bg-blue-50 transition w-fit"
            >
              <SparklesIcon className="w-5 h-5" />
              ตั้งค่าความสนใจ (60 วินาที)
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/student/recommend")}
              className="mt-2 inline-flex items-center gap-2 bg-white/15 text-white font-semibold px-4 py-2.5 rounded-2xl border border-white/20 hover:bg-white/20 transition w-fit"
            >
              <SparklesIcon className="w-5 h-5" />
              ดูวิชาที่แนะนำสำหรับฉัน
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Decorative */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white opacity-10 rounded-full" />
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full" />
      </div>

      {/* 2) Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
            <StarIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">แต้มความดีสะสม</p>
            <p className="text-2xl font-extrabold text-slate-900">
              1,250 <span className="text-xs font-normal text-slate-500">แต้ม</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <TrophyIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">ระดับ (Level)</p>
            <p className="text-2xl font-extrabold text-slate-900">
              Gold <span className="text-xs font-normal text-slate-500">User</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3) Recommendation Hint Card (แตกต่างตาม CDP/NoCDP) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">ระบบแนะนำวิชาเสริมทักษะ</h3>
              <p className="text-sm text-slate-600">
                {hasPreferences
                  ? "ระบบจะเรียนรู้จากการดูวิชา/ลงทะเบียน/กดสนใจ เพื่อแนะนำให้แม่นขึ้น"
                  : isCDP
                    ? "คุณมีข้อมูลจากโครงการอยู่แล้ว แต่ตั้งค่าความสนใจเพิ่ม จะช่วยให้แนะนำตรงใจขึ้น"
                    : "คุณยังไม่มีข้อมูลความสนใจ แนะนำให้ตั้งค่า 60 วินาทีก่อนลงทะเบียน"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigate("/student/courses")}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              <BookOpenIcon className="w-5 h-5" />
              ลงทะเบียนวิชา
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/preferences")}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition inline-flex items-center gap-2"
            >
              <PencilSquareIcon className="w-5 h-5" />
              อัปเดตความสนใจ
            </button>
          </div>
        </div>
      </div>

      {/* 4) เมนูหลัก (Action Menu) */}
      <h3 className="text-lg font-extrabold text-slate-800 mt-2">เมนูของฉัน</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* เวรประจำวัน */}
        <button
          type="button"
          onClick={() => navigate("/student/duty")}
          className="text-left bg-white p-6 rounded-2xl border-2 border-dashed border-pink-200 hover:border-pink-400 cursor-pointer transition-all hover:bg-pink-50 group"
        >
          <TrashIcon className="w-10 h-10 text-pink-500 group-hover:scale-110 transition-transform mb-2" />
          <h4 className="font-bold text-slate-800">เวรประจำวัน</h4>
          <p className="text-xs text-slate-500">เช็ครายการที่ต้องทำวันนี้</p>
        </button>

        {/* ผลการเรียน */}
        <button
          type="button"
          onClick={() => navigate("/student/grades")}
          className="text-left bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md cursor-pointer transition-all group"
        >
          <BookOpenIcon className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform mb-2" />
          <h4 className="font-bold text-slate-800">ผลการเรียน</h4>
          <p className="text-xs text-slate-500">ดูเกรดและพัฒนาการ</p>
        </button>

        {/* ข้อมูลส่วนตัว */}
        <button
          type="button"
          onClick={() => navigate("/student/profile")}
          className="text-left bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-2 font-bold group-hover:scale-110 transition-transform">
            👤
          </div>
          <h4 className="font-bold text-slate-800">ข้อมูลของฉัน</h4>
          <p className="text-xs text-slate-500">แก้ไขประวัติส่วนตัว</p>
        </button>
      </div>

      {/* 5) Small footer note */}
      <div className="text-xs text-slate-500">
        หมายเหตุ: ระบบจะใช้ข้อมูลจากการใช้งานจริง (ดู/สนใจ/ลงทะเบียน) เพื่อปรับคำแนะนำให้ดีขึ้นเรื่อยๆ
      </div>
    </div>
  )
}
