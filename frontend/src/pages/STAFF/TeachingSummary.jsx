// src/pages/STAFF/TeachingSummary.jsx
import React, { useState, useEffect } from 'react';
import { MasterAPI, ReportAPI } from '../../lib/api/endpoints';
import { 
  ChartBarIcon, 
  BuildingLibraryIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function TeachingSummary() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branchId: '',
    teacherId: '',
    subjectId: '', 
    studentCount: '',
    description: ''
  });

  // CSS Classes ให้เหมือนหน้าอื่นๆ
  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MasterAPI.getBranches();
        setBranches(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ReportAPI.createTeachingSummary(formData);
      alert('✅ บันทึกข้อมูลเรียบร้อย!');
      // Reset form logic if needed
      setFormData({
        branchId: '',
        teacherId: '',
        subjectId: '', 
        studentCount: '',
        description: ''
      });
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50/30 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
        
        {/* --- Header Section (Emerald Gradient) --- */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10 blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-10 translate-y-10 blur-xl"></div>
          
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner ring-1 ring-white/30">
            <ChartBarIcon className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">สรุปจำนวนนักเรียนประจำวัน</h2>
          <p className="text-emerald-100 mt-2 font-light text-sm tracking-wider uppercase">Daily Teaching Summary</p>
        </div>

        {/* --- Content --- */}
        <div className="p-8 md:p-10 space-y-6">
          
          {/* Date Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               {currentDate}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* เลือกสาขา */}
              <div>
                <label className={labelClass}>
                  <BuildingLibraryIcon className="w-4 h-4 text-emerald-500" />
                  สาขา <span className="text-red-500">*</span>
                </label>
                <select 
                  name="branchId" 
                  className={inputClass}
                  onChange={handleChange}
                  value={formData.branchId}
                  required
                >
                  <option value="">-- เลือกสาขา --</option>
                  {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* เลือกครู */}
              <div>
                <label className={labelClass}>
                  <AcademicCapIcon className="w-4 h-4 text-emerald-500" />
                  ครูผู้สอน <span className="text-red-500">*</span>
                </label>
                <select 
                  name="teacherId" 
                  className={inputClass} 
                  onChange={handleChange}
                  value={formData.teacherId}
                  required
                >
                   <option value="">-- เลือกครู --</option>
                   {/* Mock Data */}
                   <option value="T001">ครูสมชาย (Mock)</option>
                   <option value="T002">ครูสมหญิง (Mock)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* เลือกวิชา */}
              <div>
                <label className={labelClass}>
                  <BookOpenIcon className="w-4 h-4 text-emerald-500" />
                  วิชาที่สอน <span className="text-red-500">*</span>
                </label>
                <select 
                  name="subjectId" 
                  className={inputClass} 
                  onChange={handleChange}
                  value={formData.subjectId}
                  required
                >
                   <option value="">-- เลือกวิชา --</option>
                   <option value="SUB01">คณิตศาสตร์</option>
                   <option value="SUB02">ภาษาอังกฤษ</option>
                </select>
              </div>

              {/* จำนวนนักเรียน */}
              <div>
                <label className={labelClass}>
                  <UserGroupIcon className="w-4 h-4 text-emerald-500" />
                  จำนวนนักเรียน (คน) <span className="text-red-500">*</span>
                </label>
                <input 
                    type="number" 
                    name="studentCount"
                    className={inputClass}
                    onChange={handleChange}
                    value={formData.studentCount}
                    placeholder="0"
                    min="0"
                    required
                />
              </div>
            </div>

            {/* รายละเอียด */}
            <div>
                <label className={labelClass}>
                   รายละเอียดการสอน
                   <span className="text-xs font-normal text-slate-400 ml-auto">บันทึกเนื้อหาที่สอนพอสังเขป</span>
                </label>
                <textarea 
                    name="description"
                    className={inputClass}
                    rows="4"
                    onChange={handleChange}
                    value={formData.description}
                    placeholder="เช่น สอนเรื่องสมการเชิงเส้น บทที่ 2..."
                ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-6 h-6" />
                  บันทึกข้อมูล
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}