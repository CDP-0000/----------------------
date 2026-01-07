import React, { useMemo, useState, useEffect } from 'react'
import { AdminAPI, MasterAPI } from '../../lib/api/endpoints'
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Master Data
  const [branches, setBranches] = useState([])
  const [villages, setVillages] = useState([])
  const [schools, setSchools] = useState([])

  // 🔍 Search / Filter
  const [q, setQ] = useState('')
  const [filterRole, setFilterRole] = useState('')      // "" = all
  const [filterBranchId, setFilterBranchId] = useState('') // "" = all

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Form Data
  const initialForm = {
    targetRole: 'student',
    firstname: '', lastname: '', age: '', gender: 'ชาย',
    username: '', password: '',
    educationLevel: '', studentType: 'NoCDP',
    branchId: '', villageId: '', schoolId: ''
  }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [resUsers, resBr, resVil, resSch] = await Promise.all([
        AdminAPI.getAllUsers(),
        MasterAPI.getBranches().catch(() => ({ data: [] })),
        MasterAPI.getVillages().catch(() => ({ data: [] })),
        MasterAPI.getSchools().catch(() => ({ data: [] })),
      ])

      setUsers(Array.isArray(resUsers.data) ? resUsers.data : (resUsers.data?.items || []))
      setBranches(Array.isArray(resBr.data) ? resBr.data : (resBr.data || []))
      setVillages(Array.isArray(resVil.data) ? resVil.data : (resVil.data || []))
      setSchools(Array.isArray(resSch.data) ? resSch.data : (resSch.data || []))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Logic 1: handle form input change + clear cascade
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      if (name === 'branchId') {
        newData.villageId = ''
        newData.schoolId = ''
      } else if (name === 'villageId') {
        newData.schoolId = ''
      }
      return newData
    })
  }

  const openCreateModal = () => {
    setEditMode(false)
    setCurrentId(null)
    setFormData(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditMode(true)
    setCurrentId(user.id)
    setFormData({
      targetRole: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      gender: user.gender,
      username: user.loginId,
      password: user.password,
      educationLevel: user.educationLevel || '',
      studentType: user.studentType || 'NoCDP',
      branchId: String(user.branchId || ''),
      villageId: String(user.villageId || ''),
      schoolId: String(user.schoolId || '')
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await AdminAPI.updateUser(currentId, formData)
        alert("แก้ไขข้อมูลสำเร็จ")
      } else {
        await AdminAPI.createUser(formData)
        alert("เพิ่มผู้ใช้สำเร็จ")
      }
      setIsModalOpen(false)
      fetchInitialData()
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบข้อมูล?")) return
    try {
      await AdminAPI.deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch {
      alert("ลบไม่สำเร็จ")
    }
  }

  // Helpers
  const needsLocation = ['student', 'staff', 'branch_manager'].includes(formData.targetRole)
  const needsStudentInfo = formData.targetRole === 'student'

  // filter villages/schools in modal (กัน string/number mismatch)
  const filteredVillages = useMemo(() => {
    return villages.filter(v => String(v.branchId) === String(formData.branchId))
  }, [villages, formData.branchId])

  const filteredSchools = useMemo(() => {
    return schools.filter(s => String(s.villageId) === String(formData.villageId))
  }, [schools, formData.villageId])

  const getRoleName = (r) => {
    const map = {
      student: 'นักเรียน',
      staff: 'พนักงาน',
      branch_manager: 'ผจก.สาขา',
      director: 'ผอ./ผจก.ใหญ่',
      admin: 'ผู้ดูแลระบบ'
    }
    return map[r] || r
  }

  const getBranchName = (id) =>
    branches.find(b => String(b.id) === String(id))?.name || (id || '-')

  // 🔍 ค้นหา + กรอง
  const filteredUsers = useMemo(() => {
    const query = q.trim().toLowerCase()

    return (users || [])
      .filter(u => {
        if (!query) return true
        const branchName = getBranchName(u.branchId)
        const hay = `${u.id ?? ''} ${u.firstname ?? ''} ${u.lastname ?? ''} ${u.loginId ?? ''} ${branchName ?? ''}`
          .toLowerCase()
        return hay.includes(query)
      })
      .filter(u => (filterRole ? String(u.role) === String(filterRole) : true))
      .filter(u => (filterBranchId ? String(u.branchId) === String(filterBranchId) : true))
  }, [users, q, filterRole, filterBranchId, branches])

  const clearFilters = () => {
    setQ('')
    setFilterRole('')
    setFilterBranchId('')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              จัดการผู้ใช้งาน (User Management)
            </h1>
            <p className="text-sm text-slate-500">
              แสดงผล {loading ? '...' : filteredUsers.length} รายการ
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5
                       text-white font-medium shadow-sm hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            เพิ่มผู้ใช้งาน
          </button>
        </div>

        {/* 🔍 Toolbar Search/Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Search */}
            <div className="lg:col-span-6">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <MagnifyingGlassIcon className="w-4 h-4" />
                ค้นหา
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหาจาก ID, ชื่อ-นามสกุล, Login, สาขา..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Role filter */}
            <div className="lg:col-span-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <FunnelIcon className="w-4 h-4" />
                Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="">ทั้งหมด</option>
                <option value="student">นักเรียน</option>
                <option value="staff">พนักงาน</option>
                <option value="branch_manager">ผจก.สาขา</option>
                <option value="director">ผอ./ผจก.ใหญ่</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>

            {/* Branch filter */}
            <div className="lg:col-span-3">
              <label className="text-sm font-medium text-slate-700 mb-1 block">สาขา</label>
              <select
                value={filterBranchId}
                onChange={(e) => setFilterBranchId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="">ทั้งหมด</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-xs text-slate-500">
              เคล็ดลับ: พิมพ์ชื่อ/นามสกุล หรือ login เช่น “admin”, “ครู”, “don”
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-3 font-semibold">ไอดี (ID)</th>
                  <th className="px-6 py-3 font-semibold">ชื่อ - นามสกุล</th>
                  <th className="px-6 py-3 font-semibold">สาขา</th>
                  <th className="px-6 py-3 font-semibold">ชื่อผู้ใช้ (Login)</th>
                  <th className="px-6 py-3 font-semibold">รหัสผ่าน</th>
                  <th className="px-6 py-3 font-semibold">สิทธิ์ (Role)</th>
                  <th className="px-6 py-3 font-semibold text-center">จัดการ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="text-slate-700 font-semibold">ไม่พบข้อมูล</div>
                      <div className="text-sm text-slate-500 mt-1">
                        ลองเปลี่ยนคำค้นหาหรือกด “ล้างตัวกรอง”
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 text-slate-800">{user.firstname} {user.lastname}</td>
                      <td className="px-6 py-4 text-slate-700">{getBranchName(user.branchId)}</td>
                      <td className="px-6 py-4 text-blue-700 font-medium">{user.loginId}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono bg-slate-50 border border-slate-200 px-2 py-1 rounded select-all">
                          {user.password}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold
                          ${user.role === 'admin'
                            ? 'bg-rose-50 text-rose-700'
                            : user.role === 'student'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="p-2 rounded-xl hover:bg-yellow-50 text-yellow-700 transition"
                            title="แก้ไข"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="flex justify-between items-center p-5 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">
                  {editMode ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <XMarkIcon className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 1. เลือก Role */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-900">
                    เลือกสิทธิ์การใช้งาน (Role)
                  </label>
                  <select
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-xl
                               focus:ring-2 focus:ring-blue-200 focus:border-blue-400 block w-full p-2.5"
                  >
                    <option value="student">นักเรียน (Student)</option>
                    <option value="staff">พนักงาน (Staff)</option>
                    <option value="branch_manager">ผู้จัดการสาขา (Branch Manager)</option>
                    <option value="director">ผอ./ผู้จัดการใหญ่ (Director)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>

                {/* 2. ข้อมูลพื้นฐาน */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">ชื่อจริง</label>
                    <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-xl"/>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">นามสกุล</label>
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-xl"/>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">อายุ</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 rounded-xl"/>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">เพศ</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white">
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>
                </div>

                {/* 3. เฉพาะนักเรียน */}
                {needsStudentInfo && (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-2">ข้อมูลการศึกษา (เฉพาะนักเรียน)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm">ระดับการศึกษา</label>
                        <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} placeholder="เช่น ป.1, ม.3" className="w-full border border-slate-300 p-2.5 rounded-xl bg-white"/>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm">สถานะ CDP</label>
                        <select name="studentType" value={formData.studentType} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white">
                          <option value="CDP">CDP</option>
                          <option value="NoCDP">NoCDP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ที่ตั้ง */}
                {needsLocation && (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">ข้อมูลสังกัด/ที่อยู่</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-sm">สาขา</label>
                        <select name="branchId" value={formData.branchId} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white">
                          <option value="">-- เลือกสาขา --</option>
                          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm">หมู่บ้าน</label>
                        <select
                          name="villageId"
                          value={formData.villageId}
                          onChange={handleInputChange}
                          className={`w-full border border-slate-300 p-2.5 rounded-xl bg-white ${!formData.branchId ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                          disabled={!formData.branchId}
                        >
                          <option value="">-- เลือกหมู่บ้าน --</option>
                          {filteredVillages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm">โรงเรียน</label>
                        <select
                          name="schoolId"
                          value={formData.schoolId}
                          onChange={handleInputChange}
                          className={`w-full border border-slate-300 p-2.5 rounded-xl bg-white ${!formData.villageId ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                          disabled={!formData.villageId}
                        >
                          <option value="">-- เลือกโรงเรียน --</option>
                          {filteredSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ข้อมูลเข้าระบบ */}
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <h4 className="font-semibold text-slate-800 mb-2">ข้อมูลเข้าสู่ระบบ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">ชื่อผู้ใช้ (Login ID)</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!editMode}
                        className="w-full border border-slate-300 p-2.5 rounded-xl bg-white"
                      />
                      <p className="text-xs text-slate-500 mt-1">*ถ้าไม่กรอกระบบจะสร้างให้</p>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">รหัสผ่าน</label>
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={editMode ? "เว้นว่างถ้าไม่เปลี่ยน" : "เว้นว่างเพื่อสุ่ม"}
                        className="w-full border border-slate-300 p-2.5 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 font-medium">
                    ยกเลิก
                  </button>
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium">
                    บันทึกข้อมูล
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

export default AdminUsers
