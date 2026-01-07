// src/pages/RegisterNewStudentForm.jsx
import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthAPI, MasterAPI } from "../../lib/api/endpoints"

export default function RegisterNewStudentForm() {
  const navigate = useNavigate()

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

  const inputClass =
    "mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-400"
  const labelClass = "text-sm font-semibold text-slate-700 mb-1 block"

  // -----------------------------
  // helper: password from birthdate
  // -----------------------------
  const birthToPassword = (birthdate) => {
    // yyyy-mm-dd -> ddmmyyyy
    if (!birthdate || !birthdate.includes("-")) return "-"
    const [y, m, d] = birthdate.split("-")
    return `${d}${m}${y}`
  }

  // helper: อ่านค่าที่ backend ส่งกลับให้ยืดหยุ่น (แก้แล้ว ✅)
  const pickLoginId = (data) =>
    data?.credentials?.loginId || // ✅ เพิ่มการเช็คตรงนี้
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
    data?.credentials?.password || // ✅ เพิ่มการเช็คตรงนี้
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

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

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
        studentType: "NoCDP",
      }

      const res = await AuthAPI.register(payload)

      // Debug ดูค่าที่ได้
      console.log("REGISTER RES:", res?.data)

      const data = res?.data || {}
      
      // ใช้ฟังก์ชันที่แก้แล้วดึงค่า
      const loginId = pickLoginId(data)
      const passwordFromBackend = pickPassword(data)

      setCreds({
        loginId: loginId || "-",
        // ถ้า Backend ส่งรหัสมาก็ใช้ ถ้าไม่ส่งก็ใช้วันเกิด
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
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up my-10">
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
                    className="text-slate-400 hover:text-emerald-500"
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

  // ---------------- VIEW: Form ----------------
  return (
    <div className="max-w-xl mx-auto bg-white/95 border border-slate-200 rounded-2xl shadow-xl px-6 py-8 md:px-10 md:py-10 my-6">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-bold mb-2">Registration</p>
        <h1 className="text-2xl font-bold text-slate-800">ลงทะเบียนนักเรียนใหม่</h1>
      </div>

      {error && (
        <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          <select
            id="gender"
            name="gender"
            className={inputClass}
            value={formData.gender}
            onChange={handleChange}
            required
          >
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
          <select
            id="grade"
            name="grade"
            className={inputClass}
            value={formData.grade}
            onChange={handleChange}
            required
          >
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
            เบอร์โทรศัพท์ / อีเมล
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            placeholder="ติดต่อได้สะดวก"
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
            className={`${inputClass} ${
              !formData.branchId ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""
            }`}
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
            className={`${inputClass} ${
              !formData.villageId ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""
            }`}
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

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:shadow-emerald-300 transition-all disabled:opacity-70"
          >
            {loading ? "กำลังบันทึก..." : "ลงทะเบียน"}
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
      </form>
    </div>
  )
}