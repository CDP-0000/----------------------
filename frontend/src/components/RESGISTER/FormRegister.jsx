// src/pages/RegisterNewStudentForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterNewStudentForm() {
  const navigate = useNavigate();

  // --- State รวมข้อมูลฟอร์ม ---
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    nickname: "",
    birthdate: "",
    gender: "",
    grade: "",
    contact: "",
    branch: "",
    village: "",
    school: "",
  });

  // --- UI States ---
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- Mock Data ---
  const villageData = {
    "วาริน": ["001 - บ้านก่อ", "002 - บ้านเพีย", "003 - ธาตุ", "004 - หนองกินเพล"],
    "ดอนมดแดง": ["005 - ท่าเมือง", "006 - เหล่าแดง", "007 - กุดลาด", "008 - ดอนมดแดง"],
    "ป่าติ้ว": ["009 - โพธิ์ไทร", "010 - ป่าติ้ว", "011 - กระจาย", "012 - โคกนาโก"],
    "มหาชนะชัย": ["013 - ฟ้าหยาด", "014 - ม่วง", "015 - บึงแก", "016 - ผือฮี"],
  };

  const gradeOptions = [
    "ประถมศึกษาปีที่ 4", "ประถมศึกษาปีที่ 5", "ประถมศึกษาปีที่ 6",
    "มัธยมศึกษาปีที่ 1", "มัธยมศึกษาปีที่ 2", "มัธยมศึกษาปีที่ 3",
    "มัธยมศึกษาปีที่ 4", "มัธยมศึกษาปีที่ 5", "มัธยมศึกษาปีที่ 6",
    "กศน.ประถมศึกษา", "กศน.มัธยมต้น", "กศน.มัธยมปลาย",
  ];

  // --- Styles ---
  const inputClass = "mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-400";
  const labelClass = "text-sm font-semibold text-slate-700 mb-1 block";

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "branch" ? { village: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const mockLoginId = `STU${Math.floor(1000 + Math.random() * 9000)}`;
      const mockPassword = formData.birthdate.split("-").reverse().join("");
      setCreds({ loginId: mockLoginId, password: mockPassword });
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

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
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-slate-600 font-medium">ชื่อผู้ใช้</span>
                <span className="font-mono text-lg font-bold text-emerald-600 bg-white px-3 py-1 rounded shadow-sm">
                    {creds.loginId}
                </span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
                <span className="text-slate-600 font-medium">รหัสผ่าน</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-emerald-600 bg-white px-3 py-1 rounded shadow-sm">
                        {showPassword ? creds.password : "••••••••"}
                    </span>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-emerald-500">
                        {showPassword ? "ซ่อน" : "แสดง"}
                    </button>
                </div>
            </div>
          </div>

          <button onClick={() => navigate("/login")} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition shadow-lg">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // ---------------- VIEW: Form (Single Column) ----------------
  return (
    // ปรับ max-w-xl เพื่อให้เหมาะสมกับคอลัมน์เดียว
    <div className="max-w-xl mx-auto bg-white/95 border border-slate-200 rounded-2xl shadow-xl px-6 py-8 md:px-10 md:py-10 my-6">
      
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-bold mb-2">Registration</p>
        <h1 className="text-2xl font-bold text-slate-800">ลงทะเบียนนักเรียนใหม่</h1>
      </div>

      {/* ใช้ flex-col เพื่อเรียงลงมาตรงๆ */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div>
          <label htmlFor="firstname" className={labelClass}>ชื่อจริง <span className="text-red-500">*</span></label>
          <input
            id="firstname" name="firstname" type="text" 
            placeholder="ชื่อภาษาไทย" className={inputClass}
            value={formData.firstname} onChange={handleChange} required
          />
        </div>

        <div>
          <label htmlFor="surname" className={labelClass}>นามสกุล <span className="text-red-500">*</span></label>
          <input
            id="surname" name="surname" type="text" 
            placeholder="นามสกุลภาษาไทย" className={inputClass}
            value={formData.surname} onChange={handleChange} required
          />
        </div>

        <div>
          <label htmlFor="nickname" className={labelClass}>ชื่อเล่น <span className="text-red-500">*</span></label>
          <input
            id="nickname" name="nickname" type="text" 
            placeholder="ชื่อเล่น" className={inputClass}
            value={formData.nickname} onChange={handleChange} required
          />
        </div>

        <div>
          <label htmlFor="birthdate" className={labelClass}>วันเกิด <span className="text-red-500">*</span></label>
          <input
            id="birthdate" name="birthdate" type="date" 
            className={inputClass}
            value={formData.birthdate} onChange={handleChange} required
          />
        </div>

        <div>
          <label htmlFor="gender" className={labelClass}>เพศ <span className="text-red-500">*</span></label>
          <select
            id="gender" name="gender" className={inputClass}
            value={formData.gender} onChange={handleChange} required
          >
            <option value="">-- เลือกเพศ --</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>

        <div>
          <label htmlFor="grade" className={labelClass}>ระดับการศึกษา <span className="text-red-500">*</span></label>
          <select
            id="grade" name="grade" className={inputClass}
            value={formData.grade} onChange={handleChange} required
          >
            <option value="">-- เลือกระดับชั้น --</option>
            {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="contact" className={labelClass}>เบอร์โทรศัพท์ / อีเมล</label>
          <input
            id="contact" name="contact" type="text" 
            placeholder="ติดต่อได้สะดวก" className={inputClass}
            value={formData.contact} onChange={handleChange}
          />
        </div>

        {/* เส้นคั่นบางๆ */}
        <hr className="border-slate-100 my-2" />

        <div>
          <label htmlFor="branch" className={labelClass}>สาขา <span className="text-red-500">*</span></label>
          <select
            id="branch" name="branch" className={inputClass}
            value={formData.branch} onChange={handleChange} required
          >
            <option value="">-- เลือกสาขา --</option>
            {Object.keys(villageData).map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="village" className={labelClass}>หมู่บ้าน <span className="text-red-500">*</span></label>
          <select
            id="village" name="village"
            className={`${inputClass} ${!formData.branch && "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            value={formData.village} onChange={handleChange} required disabled={!formData.branch}
          >
            <option value="">{formData.branch ? "-- เลือกหมู่บ้าน --" : "เลือกสาขาก่อน"}</option>
            {formData.branch && villageData[formData.branch]?.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="school" className={labelClass}>โรงเรียน <span className="text-red-500">*</span></label>
          <input
            id="school" name="school" type="text" 
            placeholder="โรงเรียนปัจจุบัน" className={inputClass}
            value={formData.school} onChange={handleChange} required
          />
        </div>

        <div className="pt-6">
            <button
                type="submit" disabled={loading}
                className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:shadow-emerald-300 transition-all disabled:opacity-70"
            >
                {loading ? "กำลังบันทึก..." : "ลงทะเบียน"}
            </button>
            
            <div className="text-center mt-4">
                 <button type="button" onClick={() => navigate("/login")} className="text-sm text-slate-500 hover:text-emerald-600 underline">
                    ยกเลิก / กลับไปหน้าเข้าสู่ระบบ
                 </button>
            </div>
        </div>
      </form>
    </div>
  );
}