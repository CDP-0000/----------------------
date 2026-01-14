import React, { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { SubjectAPI, ReviewAPI } from "../../lib/api/endpoints";

export default function StudentRatePage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ Modal
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ดึงข้อมูล User จาก LocalStorage
  const userStr = localStorage.getItem("userData"); // หรือ key ที่คุณใช้เก็บ user object
  const user = userStr ? JSON.parse(userStr) : {};

  // 1. โหลดรายวิชาทั้งหมด
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      // จริงๆ ควรดึงเฉพาะวิชาที่นักเรียนลงทะเบียน (Enrolled) 
      // แต่ในที่นี้ดึงวิชาทั้งหมดมาโชว์ก่อนครับ
      const res = await SubjectAPI.getAll(); 
      setSubjects(res.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ฟังก์ชันเปิด Modal
  const openRateModal = (subject) => {
    setSelectedSubject(subject);
    setRating(0);
    setComment("");
  };

  // 3. ฟังก์ชันปิด Modal
  const closeModal = () => {
    setSelectedSubject(null);
  };

  // 4. ฟังก์ชันบันทึกรีวิว
  const handleSubmit = async () => {
    if (rating === 0) {
      alert("กรุณาให้ดาวอย่างน้อย 1 ดวงครับ");
      return;
    }

    setSubmitting(true);
    try {
      await ReviewAPI.create({
        studentId: user.id || "unknown-id",
        studentName: user.firstname || "Student",
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name, // สมมติ field ชื่อวิชาคือ name
        rating: rating,
        comment: comment
      });
      
      alert("ขอบคุณสำหรับการรีวิวครับ! 🎉");
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSubmitting(false);
    }
  };

  // --- UI Components ---
  
  // Component ดาวสำหรับกดเลือก
  const StarRater = () => {
    return (
      <div className="flex gap-1 justify-center py-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition transform hover:scale-110 focus:outline-none"
          >
            {star <= rating ? (
              <StarIcon className="w-10 h-10 text-yellow-400" />
            ) : (
              <StarOutline className="w-10 h-10 text-slate-300 hover:text-yellow-200" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <div className="p-10 text-center">กำลังโหลดรายวิชา...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">ประเมินความพึงพอใจรายวิชา</h1>
        <p className="text-slate-500 mb-8">เลือกวิชาที่เรียนในเทอมนี้เพื่อแชร์ประสบการณ์และให้คะแนน</p>

        {/* Grid แสดงวิชา */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">
                    {sub.code || "CODE"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{sub.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{sub.description || "ไม่มีคำอธิบายรายวิชา"}</p>
              </div>
              
              <button
                onClick={() => openRateModal(sub)}
                className="mt-4 w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition flex items-center justify-center gap-2"
              >
                <StarIcon className="w-4 h-4 text-yellow-400" />
                ให้คะแนน
              </button>
            </div>
          ))}
        </div>

        {/* MODAL Popup */}
        {selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
              
              {/* Header */}
              <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">ให้คะแนนวิชา</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold text-slate-800">{selectedSubject.name}</h4>
                  <p className="text-sm text-slate-500">คุณรู้สึกอย่างไรกับการเรียนวิชานี้?</p>
                </div>

                {/* Rating Stars */}
                <StarRater />
                <div className="text-center text-sm font-bold text-yellow-500 mb-4 h-5">
                   {rating === 1 && "ควรปรับปรุง"}
                   {rating === 2 && "พอใช้"}
                   {rating === 3 && "ปานกลาง"}
                   {rating === 4 && "ดี"}
                   {rating === 5 && "ดีเยี่ยม!"}
                </div>

                {/* Comment Area */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">ความคิดเห็นเพิ่มเติม (ไม่บังคับ)</label>
                  <textarea
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                    rows="4"
                    placeholder="เล่าให้ฟังหน่อย... ครูสอนเป็นไง? เนื้อหายากไหม?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 disabled:opacity-70 shadow-lg shadow-emerald-200"
                >
                  {submitting ? "กำลังส่ง..." : "ยืนยันการให้คะแนน"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}