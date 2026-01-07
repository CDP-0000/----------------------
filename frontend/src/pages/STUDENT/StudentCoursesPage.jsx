// src/pages/STUDENT/StudentCoursesPage.jsx
import React, { useEffect, useMemo, useState } from "react"
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"

// ✅ ใช้ API จริงของคุณ (ตามที่คุณใช้ในหน้า AdminSubjects)
import { SubjectAPI } from "../../lib/api/endpoints"

// -------------------------
// helpers: localStorage
// -------------------------
const LS_PREF = "studentPreferences"
const LS_EVENTS = "recEvents"
const LS_LIKES = "courseLikes"

function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function logEvent(type, payload = {}) {
  const events = readJSON(LS_EVENTS, [])
  events.push({ type, payload, ts: Date.now() })
  writeJSON(LS_EVENTS, events.slice(-500)) // กันโตเกิน
}

// -------------------------
// normalize: แปลงข้อมูลวิชาจากระบบ -> ให้หน้าใช้ได้ทันที
// -------------------------
function normalizeCourse(raw) {
  return {
    id: raw?.id ?? raw?.courseId ?? raw?._id ?? String(Math.random()),
    title: raw?.title ?? raw?.name ?? raw?.subjectName ?? "-",
    category: raw?.category ?? "ไม่ระบุ",
    level: raw?.level ?? raw?.gradeLevel ?? "เริ่มต้น",

    // สาขา: ถ้ามีชื่อใช้ชื่อ ถ้ามีแต่ id ก็โชว์เป็น id ไปก่อน
    branch:
      raw?.branchName ??
      raw?.branch?.name ??
      raw?.branch ??
      raw?.branchId ??
      "-",

    tags:
      raw?.tags ??
      (raw?.category ? [raw.category] : []) ??
      [],

    code: raw?.code,
    status: raw?.status,
    maxStudents: raw?.maxStudents,
    instructorId: raw?.instructorId,
    description: raw?.description ?? "",
  }
}

// -------------------------
// Survey (30 sec) component
// -------------------------
function QuickSurvey({ defaultValue, onSubmit, onSkip }) {
  const [form, setForm] = useState(() => ({
    interests: defaultValue?.interests || [],
    goal: defaultValue?.goal || "สนุก",
    level: defaultValue?.level || "เริ่มต้น",
    time: defaultValue?.time || "เสาร์-อาทิตย์",
  }))

  const toggle = (arr, v) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const submit = (e) => {
    e.preventDefault()
    const interests = form.interests.slice(0, 3)
    onSubmit({ ...form, interests, updatedAt: Date.now() })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            ตอบสั้น ๆ 30 วินาที เพื่อแนะนำวิชาที่เหมาะกับคุณ
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            เลือกแบบง่าย ๆ ระบบจะช่วยคัด “วิชาแนะนำ” ให้ก่อน แล้วคุณยังเลือกวิชาอื่นได้เหมือนเดิม
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        {/* Q1 */}
        <div>
          <div className="text-sm font-bold text-slate-800 mb-2">
            1) สนใจอะไรบ้าง (เลือกได้ไม่เกิน 3)
          </div>
          <div className="flex flex-wrap gap-2">
            {["กีฬา", "ดนตรีและศิลป์", "การเรียน"].map((v) => {
              const active = form.interests.includes(v)
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setForm((s) => ({ ...s, interests: toggle(s.interests, v) }))
                  }
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition
                    ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {v}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Q2 */}
          <div className="sm:col-span-1">
            <div className="text-sm font-bold text-slate-800 mb-2">
              2) อยากเรียนเพื่อ
            </div>
            <select
              value={form.goal}
              onChange={(e) =>
                setForm((s) => ({ ...s, goal: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            >
              <option value="สนุก">สนุก</option>
              <option value="เก่งขึ้น">เก่งขึ้น</option>
              <option value="แข่งขัน">แข่งขัน</option>
            </select>
          </div>

          {/* Q3 */}
          <div className="sm:col-span-1">
            <div className="text-sm font-bold text-slate-800 mb-2">
              3) ระดับของฉัน
            </div>
            <select
              value={form.level}
              onChange={(e) =>
                setForm((s) => ({ ...s, level: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            >
              <option value="เริ่มต้น">เริ่มต้น</option>
              <option value="กลาง">กลาง</option>
              <option value="ค่อนข้างเก่ง">ค่อนข้างเก่ง</option>
            </select>
          </div>

          {/* Q4 */}
          <div className="sm:col-span-1">
            <div className="text-sm font-bold text-slate-800 mb-2">
              4) วัน/เวลาที่สะดวก
            </div>
            <select
              value={form.time}
              onChange={(e) =>
                setForm((s) => ({ ...s, time: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            >
              <option value="เสาร์-อาทิตย์">เสาร์-อาทิตย์</option>
              <option value="วันธรรมดา">วันธรรมดา</option>
              <option value="ได้หมด">ได้หมด</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition"
          >
            ข้ามไปเลือกเอง
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
          >
            เสร็จแล้ว ไปเลือกวิชา
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

// -------------------------
// Recommend scoring
// -------------------------
function scoreCourse(course, pref, liked = false) {
  let s = 0
  if (!pref) return liked ? 1 : 0

  if (pref.interests?.includes(course.category)) s += 3
  if (pref.level && course.level === pref.level) s += 1

  if (pref.goal === "แข่งขัน" && course.category === "กีฬา") s += 1
  if (pref.goal === "เก่งขึ้น" && course.category === "การเรียน") s += 1
  if (pref.goal === "สนุก" && course.category === "ดนตรีและศิลป์") s += 1

  // ให้หัวใจช่วยดันขึ้นมานิด
  if (liked) s += 2

  return s
}

// -------------------------
// Main page
// -------------------------
export default function StudentCoursesPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [courses, setCourses] = useState([])
  const [q, setQ] = useState("")
  const [cat, setCat] = useState("")

  const [likes, setLikes] = useState(() => readJSON(LS_LIKES, {}))

  // อ่าน pref ครั้งแรก (ถ้ามี จะไม่เด้ง survey)
  const pref = useMemo(() => readJSON(LS_PREF, null), [])
  const needSurvey = useMemo(() => !pref, [pref])

  // ✅ โหลดวิชาจากระบบจริง
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError("")
      try {
        const res = await SubjectAPI.getAll()

        const rows = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        const normalized = rows
          .map(normalizeCourse)
          // ✅ ถ้าระบบมี status ให้โชว์เฉพาะ Active
          .filter((c) => !c.status || c.status === "Active")

        setCourses(normalized)
        logEvent("courses_loaded", { count: normalized.length })
      } catch (e) {
        console.error(e)
        setCourses([])
        setError("โหลดรายวิชาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    setStep(needSurvey ? 1 : 2)
  }, [needSurvey])

  const submitSurvey = (data) => {
    writeJSON(LS_PREF, data)
    logEvent("survey_submit", { data })
    setStep(2)
  }

  const skipSurvey = () => {
    writeJSON(LS_PREF, {
      interests: [],
      goal: "สนุก",
      level: "เริ่มต้น",
      time: "ได้หมด",
      skipped: true,
      updatedAt: Date.now(),
    })
    logEvent("survey_skip", {})
    setStep(2)
  }

  const toggleLike = (courseId) => {
    setLikes((prev) => {
      const next = { ...prev, [courseId]: !prev[courseId] }
      writeJSON(LS_LIKES, next)
      logEvent("course_like_toggle", { courseId, like: next[courseId] })
      return next
    })
  }

  const registerCourse = (course) => {
    // ✅ TODO: เปลี่ยนเป็น API สมัครจริง เช่น StudentAPI.registerCourse(course.id)
    logEvent("course_register_click", { courseId: course.id })
    alert(`สมัครเรียน: ${course.title} (ตัวอย่าง)`)
  }

  const recommended = useMemo(() => {
    const p = readJSON(LS_PREF, null)
    const l = readJSON(LS_LIKES, {})
    const scored = (courses || []).map((c) => ({
      ...c,
      _score: scoreCourse(c, p, !!l[c.id]),
    }))
    return scored
      .filter((c) => c._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 6)
  }, [courses])

  const filteredAll = useMemo(() => {
    const query = q.trim().toLowerCase()
    return (courses || [])
      .filter((c) => (cat ? c.category === cat : true))
      .filter((c) => {
        if (!query) return true
        const hay = `${c.title} ${c.category} ${c.level} ${c.branch} ${(c.tags || []).join(" ")} ${c.code || ""}`
          .toLowerCase()
        return hay.includes(query)
      })
  }, [courses, q, cat])

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ลงทะเบียนวิชาเสริมทักษะ
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {step === 1
                ? "ตอบคำถามสั้น ๆ ก่อน (ไม่เกิน 30 วิ)"
                : "เลือกจาก “วิชาแนะนำ” หรือค้นหาวิชาอื่น ๆ ได้เลย"}
            </p>
          </div>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition inline-flex items-center gap-2 w-fit"
            >
              <FunnelIcon className="w-5 h-5" />
              ปรับความสนใจใหม่
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <QuickSurvey defaultValue={pref} onSubmit={submitSurvey} onSkip={skipSurvey} />
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-7">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  ค้นหาวิชา
                </label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ค้นหาจากชื่อวิชา/รหัส/หมวด/ระดับ/สาขา..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="text-sm font-bold text-slate-800 mb-1 block">
                  หมวด
                </label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="กีฬา">กีฬา</option>
                  <option value="ดนตรีและศิลป์">ดนตรีและศิลป์</option>
                  <option value="การเรียน">การเรียน</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setQ("")
                    setCat("")
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition"
                >
                  ล้าง
                </button>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-extrabold text-slate-900">
                วิชาแนะนำสำหรับคุณ
              </h2>
              <span className="text-xs text-slate-500">(เลือกได้เหมือนวิชาปกติ)</span>
            </div>

            {loading ? (
              <div className="mt-3 text-sm text-slate-600">กำลังโหลด...</div>
            ) : recommended.length === 0 ? (
              <div className="mt-3 text-sm text-slate-600">
                ยังไม่มีข้อมูลพอสำหรับแนะนำ (ลองกด “ปรับความสนใจใหม่” หรือกดหัวใจ ❤️ ในวิชาที่สนใจ)
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommended.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    liked={!!likes[c.id]}
                    onLike={() => toggleLike(c.id)}
                    onRegister={() => registerCourse(c)}
                    recommended
                  />
                ))}
              </div>
            )}
          </div>

          {/* All courses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-slate-900">วิชาทั้งหมด</h2>
              <div className="text-sm text-slate-600">
                {loading ? "กำลังโหลด..." : `พบ ${filteredAll.length} รายการ`}
              </div>
            </div>

            {loading ? (
              <div className="mt-3 text-sm text-slate-600">กำลังโหลด...</div>
            ) : filteredAll.length === 0 ? (
              <div className="mt-3 text-sm text-slate-600">ไม่พบวิชาที่ตรงกับเงื่อนไข</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAll.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    liked={!!likes[c.id]}
                    onLike={() => toggleLike(c.id)}
                    onRegister={() => registerCourse(c)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// -------------------------
// Course Card UI
// -------------------------
function CourseCard({ course, recommended = false, liked, onLike, onRegister }) {
  return (
    <div
      className={`rounded-2xl border shadow-sm p-4 transition bg-white
      ${recommended ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200 hover:shadow-md"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-500">
            {course.category} • {course.level}
            {course.code ? ` • ${course.code}` : ""}
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-1 truncate">
            {course.title}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            สาขา: {course.branch}
          </div>
          {course.description ? (
            <div className="text-xs text-slate-500 mt-2 line-clamp-2">
              {course.description}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onLike}
          className={`p-2 rounded-xl border transition
            ${liked ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
          title={liked ? "ยกเลิกสนใจ" : "กดสนใจ"}
        >
          {liked ? (
            <HeartSolidIcon className="w-5 h-5" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(course.tags || []).slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700"
          >
            {t}
          </span>
        ))}

        {recommended && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-600 text-white inline-flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" />
            แนะนำ
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onRegister}
        className="mt-4 w-full px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        เลือกวิชานี้
      </button>
    </div>
  )
}
