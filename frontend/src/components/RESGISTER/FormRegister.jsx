// src/pages/RegisterNewStudentForm.jsx
import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthAPI, MasterAPI } from "../../lib/api/endpoints"

const INTEREST_TAGS = [
  "กีฬา",
  "ดนตรี",
  "ศิลปะ",
  "คอมพิวเตอร์",
  "ภาษา",
  "วิทยาศาสตร์",
  "ทำอาหาร",
  "ช่าง/งานประดิษฐ์",
  "การแสดง/พูด",
  "ถ่ายภาพ/วิดีโอ",
  "อ่านหนังสือ",
  "เกม/อีสปอร์ต",
]

const GOAL_TAGS = [
  "อยากเก่งขึ้น",
  "อยากลองของใหม่",
  "อยากมีเพื่อน",
  "อยากกล้าแสดงออก",
  "อยากสุขภาพแข็งแรง",
]

export default function RegisterNewStudentForm() {
  const navigate = useNavigate()

  // -----------------------------
  // Step state
  // -----------------------------
  const [step, setStep] = useState(1) // 1=basic, 2=profile
  const interestLimit = 5
  const goalLimit = 2

  // -----------------------------
  // Form state
  // -----------------------------
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    nickname: "",
    birthdate: "",
    gender: "",
    grade: "",
    contact: "",

    branchId: "",
    villageId: "",
    schoolId: "",

    // ✅ initial profile for first-time analysis
    interests: [], // 3–5
    goals: [], // 1–2
    healthStatus: "no", // no | yes | unsure
    healthNote: "", // only when yes
  })

  // -----------------------------
  // UI state
  // -----------------------------
  const [loading, setLoading] = useState(false)
  const [creds, setCreds] = useState(null) // { loginId, password, note }
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // -----------------------------
  // Master data
  // -----------------------------
  const [branches, setBranches] = useState([])
  const [villages, setVillages] = useState([])
  const [schools, setSchools] = useState([])
  const [loadingMaster, setLoadingMaster] = useState(true)

  const gradeOptions = [
    "ประถมศึกษาปีที่ 4",
    "ประถมศึกษาปีที่ 5",
    "ประถมศึกษาปีที่ 6",
    "มัธยมศึกษาปีที่ 1",
    "มัธยมศึกษาปีที่ 2",
    "มัธยมศึกษาปีที่ 3",
    "มัธยมศึกษาปีที่ 4",
    "มัธยมศึกษาปีที่ 5",
    "มัธยมศึกษาปีที่ 6",
    "กศน.ประถมศึกษา",
    "กศน.มัธยมต้น",
    "กศน.มัธยมปลาย",
  ]

  // -----------------------------
  // helper: password from birthdate
  // -----------------------------
  const birthToPassword = (birthdate) => {
    if (!birthdate || !birthdate.includes("-")) return "-"
    const [y, m, d] = birthdate.split("-")
    return `${d}${m}${y}`
  }

  // helper: อ่านค่าที่ backend ส่งกลับให้ยืดหยุ่น
  const pickLoginId = (data) =>
    data?.credentials?.loginId ||
    data?.credentials?.loginID ||
    data?.loginId ||
    data?.loginID ||
    data?.user?.loginId ||
    data?.user?.loginID ||
    data?.created?.loginId ||
    data?.created?.loginID ||
    data?.username ||
    data?.user?.username ||
    data?.created?.username ||
    data?.user?.login ||
    data?.login

  const pickPassword = (data) =>
    data?.credentials?.password ||
    data?.credentials?.pass ||
    data?.password ||
    data?.pass ||
    data?.user?.password ||
    data?.created?.password ||
    data?.user?.pass ||
    data?.created?.pass

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ""))
      alert("คัดลอกแล้ว ✅")
    } catch {
      alert("คัดลอกไม่สำเร็จ (ลองคัดลอกเองด้วยมือ)")
    }
  }

  // -----------------------------
  // Load Master Data
  // -----------------------------
  useEffect(() => {
    ;(async () => {
      setLoadingMaster(true)
      setError("")
      try {
        const [resBr, resVil, resSch] = await Promise.all([
          MasterAPI.getBranches().catch(() => ({ data: [] })),
          MasterAPI.getVillages().catch(() => ({ data: [] })),
          MasterAPI.getSchools().catch(() => ({ data: [] })),
        ])
        setBranches(resBr?.data || [])
        setVillages(resVil?.data || [])
        setSchools(resSch?.data || [])
      } catch (e) {
        console.error(e)
        setError("โหลดข้อมูลสาขา/หมู่บ้าน/โรงเรียนไม่สำเร็จ")
      } finally {
        setLoadingMaster(false)
      }
    })()
  }, [])

  // -----------------------------
  // Filter cascading dropdowns
  // -----------------------------
  const filteredVillages = useMemo(() => {
    return villages.filter((v) => String(v.branchId) === String(formData.branchId))
  }, [villages, formData.branchId])

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => String(s.villageId) === String(formData.villageId))
  }, [schools, formData.villageId])

  // -----------------------------
  // Validation per step
  // -----------------------------
  const step1Ok = useMemo(() => {
    return (
      formData.firstname.trim() &&
      formData.surname.trim() &&
      formData.nickname.trim() &&
      formData.birthdate &&
      formData.gender &&
      formData.grade &&
      formData.branchId &&
      formData.villageId &&
      formData.schoolId
    )
  }, [formData])

  const step2Ok = useMemo(() => {
    return formData.interests.length >= 3 && formData.goals.length >= 1
  }, [formData.interests.length, formData.goals.length])

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (name === "branchId") {
        next.villageId = ""
        next.schoolId = ""
      }
      if (name === "villageId") {
        next.schoolId = ""
      }
      return next
    })
  }

  const toggleTag = (key, tag, limit) => {
    setFormData((prev) => {
      const list = prev[key] || []
      const exists = list.includes(tag)
      if (exists) return { ...prev, [key]: list.filter((x) => x !== tag) }
      if (list.length >= limit) return prev
      return { ...prev, [key]: [...list, tag] }
    })
  }

  // -----------------------------
  // Step controls
  // -----------------------------
  const goNext = () => {
    setError("")
    if (!step1Ok) {
      setError("กรอกข้อมูลพื้นฐานให้ครบก่อนนะครับ")
      return
    }
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setError("")
    setStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!step2Ok) {
      setLoading(false)
      setError("เลือกความสนใจอย่างน้อย 3 ข้อ และเลือกเป้าหมายอย่างน้อย 1 ข้อก่อนนะครับ")
      return
    }

    const defaultPassword = birthToPassword(formData.birthdate)

    try {
      const payload = {
        role: "student",
        firstname: formData.firstname,
        lastname: formData.surname,
        nickname: formData.nickname,
        birthdate: formData.birthdate,
        gender: formData.gender,
        educationLevel: formData.grade,
        contact: formData.contact,
        branchId: formData.branchId,
        villageId: formData.villageId,
        schoolId: formData.schoolId,

        // ✅ สำหรับเด็กนอกโครงการ
        studentType: "NoCDP",

        // ✅ ข้อมูลพื้นฐานสำหรับ “วิเคราะห์ตั้งแต่สมัครครั้งแรก”
        initialProfile: {
          interests: formData.interests, // tags
          goals: formData.goals, // tags
          health: {
            status: formData.healthStatus, // no | yes | unsure
            note: formData.healthStatus === "yes" ? (formData.healthNote || "").trim() : "",
          },
        },
      }

      const res = await AuthAPI.register(payload)

      console.log("REGISTER RES:", res?.data)
      const data = res?.data || {}

      const loginId = pickLoginId(data)
      const passwordFromBackend = pickPassword(data)

      setCreds({
        loginId: loginId || "-",
        password: passwordFromBackend || defaultPassword || "-",
        note: loginId
          ? ""
          : "สมัครสำเร็จแล้ว ✅ แต่ระบบไม่สามารถดึงชื่อผู้ใช้ได้\nโปรดตรวจสอบในหน้า Admin Users",
      })

      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || err?.message || "สมัครไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  // ---------------- VIEW: Success ----------------
  if (creds) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-10">
        <div className="bg-emerald-500 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">ลงทะเบียนสำเร็จ!</h2>
          <p className="text-emerald-100">บัญชีของคุณพร้อมใช้งานแล้ว</p>
        </div>

        <div className="p-8 space-y-6">
          {creds.note && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm whitespace-pre-line">
              {creds.note}
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <span className="text-slate-600 font-medium">ชื่อผู้ใช้</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-emerald-600 bg-white px-3 py-1 rounded shadow-sm select-all">
                  {creds.loginId}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(creds.loginId)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black transition"
                  disabled={creds.loginId === "-" || !creds.loginId}
                >
                  คัดลอก
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-slate-600 font-medium">รหัสผ่าน</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-emerald-600 bg-white px-3 py-1 rounded shadow-sm select-all">
                  {creds.password === "-" ? "-" : showPassword ? creds.password : "••••••••"}
                </span>
                {creds.password !== "-" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-emerald-600 text-sm font-semibold"
                  >
                    {showPassword ? "ซ่อน" : "แสดง"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copyText(creds.password)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black transition"
                  disabled={creds.password === "-" || !creds.password}
                >
                  คัดลอก
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 pt-2">
              *โปรดบันทึกข้อมูลนี้ไว้เพื่อใช้ในการเข้าสู่ระบบครั้งถัดไป
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition shadow-lg"
          >
            เข้าสู่ระบบ
          </button>

          {creds.loginId === "-" && (
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-lg"
            >
              ไปดูชื่อผู้ใช้ในหน้า Admin Users
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---------------- small components ----------------
  const StepPill = ({ n, title, active }) => (
    <div
      className={[
        "flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-semibold",
        active ? "border-emerald-300 bg-emerald-50 text-slate-900" : "border-slate-200 bg-white text-slate-500",
      ].join(" ")}
    >
      <span
        className={[
          "w-7 h-7 rounded-full flex items-center justify-center font-bold",
          active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700",
        ].join(" ")}
      >
        {n}
      </span>
      {title}
    </div>
  )

  const Chip = ({ active, disabled, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "px-3 py-2 rounded-full border text-sm font-semibold transition select-none",
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm",
      ].join(" ")}
    >
      {children}
    </button>
  )

  const inputClass =
    "mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-400"
  const labelClass = "text-sm font-semibold text-slate-700 mb-1 block"

  // ---------------- VIEW: Form ----------------
  return (
    <div className="max-w-2xl mx-auto bg-white/95 border border-slate-200 rounded-2xl shadow-xl px-6 py-8 md:px-10 md:py-10 my-6">
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-bold mb-2">Registration</p>
        <h1 className="text-2xl font-bold text-slate-800">ลงทะเบียนนักเรียนใหม่</h1>
        <p className="text-sm text-slate-500 mt-2">
          สมัครครั้งแรกเก็บข้อมูล “พอวิเคราะห์ได้” แล้วค่อยเรียนรู้จากพฤติกรรมการใช้งานภายหลัง
        </p>
      </div>

      {/* Step header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <StepPill n={1} title="ข้อมูลพื้นฐาน" active={step === 1} />
        <div className="h-[2px] w-10 bg-slate-200 rounded-full" />
        <StepPill n={2} title="ความสนใจ/เป้าหมาย" active={step === 2} />
      </div>

      {error && (
        <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="firstname" className={labelClass}>
              ชื่อจริง <span className="text-red-500">*</span>
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="ชื่อภาษาไทย"
              className={inputClass}
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="surname" className={labelClass}>
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              placeholder="นามสกุลภาษาไทย"
              className={inputClass}
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="nickname" className={labelClass}>
              ชื่อเล่น <span className="text-red-500">*</span>
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="ชื่อเล่น"
              className={inputClass}
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="birthdate" className={labelClass}>
              วันเกิด <span className="text-red-500">*</span>
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              className={inputClass}
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
            {formData.birthdate && (
              <p className="text-xs text-slate-500 mt-2">
                รหัสผ่านมาตรฐาน (วันเกิด): <b>{birthToPassword(formData.birthdate)}</b>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className={labelClass}>
              เพศ <span className="text-red-500">*</span>
            </label>
            <select id="gender" name="gender" className={inputClass} value={formData.gender} onChange={handleChange} required>
              <option value="">-- เลือกเพศ --</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label htmlFor="grade" className={labelClass}>
              ระดับการศึกษา <span className="text-red-500">*</span>
            </label>
            <select id="grade" name="grade" className={inputClass} value={formData.grade} onChange={handleChange} required>
              <option value="">-- เลือกระดับชั้น --</option>
              {gradeOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact" className={labelClass}>
              เบอร์โทรศัพท์ / อีเมล (ไม่บังคับ)
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              placeholder="ติดต่อผู้ปกครองได้สะดวก"
              className={inputClass}
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <hr className="border-slate-100 my-2" />

          <div>
            <label htmlFor="branchId" className={labelClass}>
              สาขา <span className="text-red-500">*</span>
            </label>
            <select
              id="branchId"
              name="branchId"
              className={`${inputClass} ${loadingMaster ? "opacity-70" : ""}`}
              value={formData.branchId}
              onChange={handleChange}
              required
              disabled={loadingMaster}
            >
              <option value="">{loadingMaster ? "กำลังโหลดสาขา..." : "-- เลือกสาขา --"}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="villageId" className={labelClass}>
              หมู่บ้าน <span className="text-red-500">*</span>
            </label>
            <select
              id="villageId"
              name="villageId"
              className={`${inputClass} ${!formData.branchId ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
              value={formData.villageId}
              onChange={handleChange}
              required
              disabled={!formData.branchId || loadingMaster}
            >
              <option value="">{!formData.branchId ? "เลือกสาขาก่อน" : "-- เลือกหมู่บ้าน --"}</option>
              {filteredVillages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="schoolId" className={labelClass}>
              โรงเรียน <span className="text-red-500">*</span>
            </label>
            <select
              id="schoolId"
              name="schoolId"
              className={`${inputClass} ${!formData.villageId ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
              value={formData.schoolId}
              onChange={handleChange}
              required
              disabled={!formData.villageId || loadingMaster}
            >
              <option value="">{!formData.villageId ? "เลือกหมู่บ้านก่อน" : "-- เลือกโรงเรียน --"}</option>
              {filteredSchools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={goNext}
              disabled={!step1Ok}
              className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:shadow-emerald-300 transition-all disabled:opacity-70"
            >
              ถัดไป (ความสนใจ/เป้าหมาย)
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-slate-500 hover:text-emerald-600 underline"
              >
                ยกเลิก / กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interests */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-base font-extrabold text-slate-800">1) ความสนใจ (เลือก 3–5 ข้อ)</h2>
              <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                {formData.interests.length}/{interestLimit}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const active = formData.interests.includes(tag)
                const disabled = !active && formData.interests.length >= interestLimit
                return (
                  <Chip
                    key={tag}
                    active={active}
                    disabled={disabled}
                    onClick={() => toggleTag("interests", tag, interestLimit)}
                  >
                    {tag}
                  </Chip>
                )
              })}
            </div>

            <p className="text-xs text-slate-500 mt-3">
              *ข้อมูลนี้ใช้สร้างโปรไฟล์เริ่มต้น (initial user profile) เพื่อแนะนำครั้งแรกได้ทันที
            </p>
          </div>

          {/* Goals */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-base font-extrabold text-slate-800">2) เป้าหมาย (เลือก 1–2 ข้อ)</h2>
              <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                {formData.goals.length}/{goalLimit}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {GOAL_TAGS.map((tag) => {
                const active = formData.goals.includes(tag)
                const disabled = !active && formData.goals.length >= goalLimit
                return (
                  <Chip
                    key={tag}
                    active={active}
                    disabled={disabled}
                    onClick={() => toggleTag("goals", tag, goalLimit)}
                  >
                    {tag}
                  </Chip>
                )
              })}
            </div>
          </div>

          {/* Health */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-base font-extrabold text-slate-800 mb-3">3) สุขภาพ/การแพ้ (สั้น ๆ)</h2>

            <div className="flex flex-wrap gap-2">
              {[
                { v: "no", label: "ไม่มีข้อจำกัด" },
                { v: "yes", label: "มีโรค/แพ้ (ระบุได้)" },
                { v: "unsure", label: "ไม่แน่ใจ" },
              ].map((x) => {
                const active = formData.healthStatus === x.v
                return (
                  <button
                    key={x.v}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        healthStatus: x.v,
                        healthNote: x.v === "yes" ? p.healthNote : "",
                      }))
                    }
                    className={[
                      "px-3 py-2 rounded-full border text-sm font-semibold transition",
                      active
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white",
                    ].join(" ")}
                  >
                    {x.label}
                  </button>
                )
              })}
            </div>

            {formData.healthStatus === "yes" && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">
                  ระบุสั้น ๆ (ไม่บังคับ)
                </label>
                <input
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-400"
                  value={formData.healthNote}
                  onChange={(e) => setFormData((p) => ({ ...p, healthNote: e.target.value }))}
                  placeholder="เช่น หอบหืด / แพ้อาหารทะเล / แพ้ถั่ว"
                />
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              *ใช้เพื่อความปลอดภัยและการคัดกรองกิจกรรมเท่านั้น (เลือกไม่ตอบได้)
            </p>
          </div>

          {/* actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={goBack}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
            >
              ย้อนกลับ
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:shadow-emerald-300 transition-all disabled:opacity-70"
            >
              {loading ? "กำลังบันทึก..." : "ลงทะเบียน"}
            </button>
          </div>

          {/* hint */}
          {!step2Ok && (
            <div className="text-xs text-slate-500">
              ต้องเลือกความสนใจอย่างน้อย <b>3</b> ข้อ และเลือกเป้าหมายอย่างน้อย <b>1</b> ข้อ เพื่อให้ระบบวิเคราะห์และแนะนำครั้งแรกได้
            </div>
          )}
        </form>
      )}
    </div>
  )
}
