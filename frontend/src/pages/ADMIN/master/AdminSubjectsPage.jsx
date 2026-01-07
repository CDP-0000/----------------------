import React, { useEffect, useMemo, useState } from "react"
import { SubjectAPI, MasterAPI, AdminAPI } from "../../../lib/api/endpoints"
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  const [branches, setBranches] = useState([])
  const [instructors, setInstructors] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  const initialForm = {
    name: "",
    branchId: "",
    instructorId: "",
    category: "การเรียน",
    description: "",
    status: "Active",
  }
  const [formData, setFormData] = useState(initialForm)

  // 🔍 Search / Filter states
  const [q, setQ] = useState("")
  const [filterCategory, setFilterCategory] = useState("") // "" = all
  const [filterBranchId, setFilterBranchId] = useState("") // "" = all
  const [filterStatus, setFilterStatus] = useState("") // "" = all

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [resSub, resBr, resUsers] = await Promise.all([
        SubjectAPI.getAll(),
        MasterAPI.getBranches().catch(() => ({ data: [] })),
        AdminAPI.getAllUsers().catch(() => ({ data: [] })),
      ])

      setSubjects(Array.isArray(resSub.data) ? resSub.data : resSub.data?.items || [])
      setBranches(Array.isArray(resBr.data) ? resBr.data : [])

      const allUsers = Array.isArray(resUsers.data) ? resUsers.data : []
      setInstructors(allUsers.filter((u) => ["staff", "branch_manager"].includes(u.role)))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ ESC + lock scroll modal
  useEffect(() => {
    if (!isModalOpen) return
    const onKey = (e) => e.key === "Escape" && setIsModalOpen(false)
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isModalOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await SubjectAPI.update(currentId, formData)
        alert("แก้ไขวิชาสำเร็จ")
      } else {
        await SubjectAPI.create(formData)
        alert("เพิ่มวิชาสำเร็จ (ระบบสร้างรหัสวิชาให้แล้ว)")
      }
      setIsModalOpen(false)
      fetchInitialData()
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบวิชานี้?")) return
    try {
      await SubjectAPI.delete(id)
      fetchInitialData()
    } catch (error) {
      alert("ลบไม่สำเร็จ")
    }
  }

  const openModal = (subject = null) => {
    if (subject) {
      setEditMode(true)
      setCurrentId(subject.id)
      setFormData({
        name: subject.name,
        branchId: String(subject.branchId || ""),
        instructorId: String(subject.instructorId || ""),
        category: subject.category || "การเรียน",
        description: subject.description || "",
        status: subject.status || "Active",
      })
    } else {
      setEditMode(false)
      setCurrentId(null)
      setFormData(initialForm)
    }
    setIsModalOpen(true)
  }

  // helpers (กัน string/number id mismatch)
  const getBranchName = (id) => branches.find((b) => String(b.id) === String(id))?.name || "-"
  const getInstructorName = (id) => {
    const u = instructors.find((x) => String(x.id) === String(id))
    return u ? `${u.firstname} ${u.lastname}` : "-"
  }

  // 🔍 Filtered list (search + filters)
  const filteredSubjects = useMemo(() => {
    const query = q.trim().toLowerCase()

    return (subjects || [])
      .filter((s) => {
        if (!query) return true
        const hay = `${s.code || ""} ${s.name || ""} ${s.description || ""}`.toLowerCase()
        return hay.includes(query)
      })
      .filter((s) => (filterCategory ? String(s.category || "") === String(filterCategory) : true))
      .filter((s) => (filterBranchId ? String(s.branchId || "") === String(filterBranchId) : true))
      .filter((s) => (filterStatus ? String(s.status || "") === String(filterStatus) : true))
  }, [subjects, q, filterCategory, filterBranchId, filterStatus])

  const clearFilters = () => {
    setQ("")
    setFilterCategory("")
    setFilterBranchId("")
    setFilterStatus("")
  }

  // หมวดหมู่ที่มีในระบบ (สำหรับ filter)
  const CATEGORY_OPTIONS = ["การเรียน", "กีฬา", "ดนตรีและศิลป์"]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-blue-600/10">
              <BookOpenIcon className="w-7 h-7 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">จัดการรายวิชาเสริมทักษะ</h1>
              <p className="text-sm text-slate-500">
                แสดงผล {loading ? "..." : filteredSubjects.length} รายการ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            เพิ่มวิชาใหม่
          </button>
        </div>

        {/* Toolbar (Search + Filters) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Search */}
            <div className="lg:col-span-5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <MagnifyingGlassIcon className="w-4 h-4" />
                ค้นหา
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหาจากรหัสวิชา / ชื่อวิชา / คำอธิบาย..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Category filter */}
            <div className="lg:col-span-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <FunnelIcon className="w-4 h-4" />
                หมวดหมู่
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="">ทั้งหมด</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch filter */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-1 block">สาขา</label>
              <select
                value={filterBranchId}
                onChange={(e) => setFilterBranchId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="">ทั้งหมด</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-1 block">สถานะ</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="">ทั้งหมด</option>
                <option value="Active">เปิดสอน</option>
                <option value="Inactive">ปิดชั่วคราว</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-500">
              เคล็ดลับ: พิมพ์ “ฟุตบอล”, “กีตาร์”, “คณิต”, หรือรหัสวิชาเพื่อค้นหาเร็วๆ
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">รหัส</th>
                  <th className="px-5 py-3 text-left font-semibold">ชื่อวิชา</th>
                  <th className="px-5 py-3 text-left font-semibold">หมวด</th>
                  <th className="px-5 py-3 text-left font-semibold">สาขา</th>
                  <th className="px-5 py-3 text-left font-semibold">ผู้รับผิดชอบ</th>
                  <th className="px-5 py-3 text-left font-semibold">สถานะ</th>
                  <th className="px-5 py-3 text-center font-semibold">จัดการ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="text-slate-700 font-semibold">ไม่พบข้อมูล</div>
                      <div className="text-sm text-slate-500 mt-1">
                        ลองเปลี่ยนคำค้นหาหรือกด “ล้างตัวกรอง”
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">{sub.code}</td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{sub.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[420px]">{sub.description}</div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1">
                          {sub.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-700">{getBranchName(sub.branchId)}</td>

                      <td className="px-5 py-4 text-slate-700">{getInstructorName(sub.instructorId)}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-1
                          ${sub.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                        >
                          {sub.status === "Active" ? "เปิดสอน" : "ปิดชั่วคราว"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openModal(sub)}
                            className="p-2 rounded-xl hover:bg-yellow-50 text-yellow-700 transition"
                            title="แก้ไข"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sub.id)}
                            className="p-2 rounded-xl hover:bg-rose-50 text-rose-700 transition"
                            title="ลบ"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="flex justify-between items-center p-5 border-b border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {editMode ? "แก้ไขรายวิชา" : "เพิ่มวิชาใหม่"}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
                  <XMarkIcon className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* ชื่อวิชา */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">ชื่อวิชา</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                               focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* สาขา */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-700">สาขา</label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                                 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
                    >
                      <option value="">-- เลือกสาขา --</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* หมวดหมู่ */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-700">หมวดหมู่</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                                 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ผู้รับผิดชอบ */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">ผู้รับผิดชอบวิชา</label>
                  <select
                    value={formData.instructorId}
                    onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                               focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
                  >
                    <option value="">-- เลือกผู้รับผิดชอบ (Staff/Manager) --</option>
                    {instructors.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstname} {u.lastname} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* คำอธิบาย */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">คำอธิบายวิชา</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                               focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>

                {/* สถานะ */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">สถานะการเปิดสอน</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                               focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
                  >
                    <option value="Active">เปิดสอน (Active)</option>
                    <option value="Inactive">ปิดชั่วคราว (Inactive)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSubjects
