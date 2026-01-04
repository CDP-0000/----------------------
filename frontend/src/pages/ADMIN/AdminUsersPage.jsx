import React, { useState, useEffect } from 'react';
import { AdminAPI, MasterAPI } from '../../lib/api/endpoints'; 
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Master Data
  const [branches, setBranches] = useState([]);
  const [villages, setVillages] = useState([]);
  const [schools, setSchools] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Data
  const initialForm = {
    targetRole: 'student', 
    firstname: '', lastname: '', age: '', gender: 'ชาย',
    username: '', password: '', 
    educationLevel: '', studentType: 'NoCDP',
    branchId: '', villageId: '', schoolId: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resUsers, resBr, resVil, resSch] = await Promise.all([
        AdminAPI.getAllUsers(),
        MasterAPI.getBranches().catch(() => ({ data: [] })), 
        MasterAPI.getVillages().catch(() => ({ data: [] })),
        MasterAPI.getSchools().catch(() => ({ data: [] }))
      ]);

      setUsers(resUsers.data);
      setBranches(resBr.data || []);
      setVillages(resVil.data || []);
      setSchools(resSch.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logic 1: การจัดการเปลี่ยนค่าในฟอร์ม (พร้อมเคลียร์ค่าลูกโซ่)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // ถ้าเปลี่ยน "สาขา" -> ล้างค่า "หมู่บ้าน" และ "โรงเรียน"
      if (name === 'branchId') {
        newData.villageId = '';
        newData.schoolId = '';
      }
      // ถ้าเปลี่ยน "หมู่บ้าน" -> ล้างค่า "โรงเรียน"
      else if (name === 'villageId') {
        newData.schoolId = '';
      }

      return newData;
    });
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setCurrentId(user.id);
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
      branchId: user.branchId || '',
      villageId: user.villageId || '',
      schoolId: user.schoolId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await AdminAPI.updateUser(currentId, formData);
        alert("แก้ไขข้อมูลสำเร็จ");
      } else {
        await AdminAPI.createUser(formData);
        alert("เพิ่มผู้ใช้สำเร็จ");
      }
      setIsModalOpen(false);
      fetchInitialData(); 
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ยืนยันการลบข้อมูล?")) {
      try {
        await AdminAPI.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  // Helper Variables
  const needsLocation = ['student', 'staff', 'branch_manager'].includes(formData.targetRole);
  const needsStudentInfo = formData.targetRole === 'student';

  // ✅ Logic 2: ตัวแปรสำหรับกรอง Dropdown ตามลำดับชั้น
  // กรองหมู่บ้าน: ต้องมี branchId ตรงกับที่เลือก
  const filteredVillages = villages.filter(v => v.branchId === formData.branchId);
  // กรองโรงเรียน: ต้องมี villageId ตรงกับที่เลือก
  const filteredSchools = schools.filter(s => s.villageId === formData.villageId);

  const getRoleName = (r) => {
    const map = { student: 'นักเรียน', staff: 'พนักงาน', branch_manager: 'ผจก.สาขา', director: 'ผอ./ผจก.ใหญ่', admin: 'ผู้ดูแลระบบ' };
    return map[r] || r;
  };

  const getBranchName = (id) => branches.find(b => b.id === id)?.name || id || '-';

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">จัดการผู้ใช้งาน (User Management)</h1>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          <PlusIcon className="w-5 h-5" /> เพิ่มผู้ใช้งาน
        </button>
      </div>

      {/* ตารางแสดงผล */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">ไอดี (ID)</th>
                <th className="px-6 py-3">ชื่อ - นามสกุล</th>
                <th className="px-6 py-3">สาขา</th>
                <th className="px-6 py-3">ชื่อผู้ใช้ (Login)</th>
                <th className="px-6 py-3">รหัสผ่าน</th>
                <th className="px-6 py-3">สิทธิ์ (Role)</th>
                <th className="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4">{user.firstname} {user.lastname}</td>
                  <td className="px-6 py-4">{getBranchName(user.branchId)}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{user.loginId}</td>
                  <td className="px-6 py-4 font-mono bg-gray-50 rounded select-all">{user.password}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold 
                      ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        user.role === 'student' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button onClick={() => openEditModal(user)} className="text-yellow-500 hover:text-yellow-700">
                        <PencilSquareIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ฟอร์มเพิ่ม/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {editMode ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 1. เลือก Role */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">เลือกสิทธิ์การใช้งาน (Role)</label>
                <select name="targetRole" value={formData.targetRole} onChange={handleInputChange} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="student">นักเรียน (Student)</option>
                  <option value="staff">พนักงาน (Staff)</option>
                  <option value="branch_manager">ผู้จัดการสาขา (Branch Manager)</option>
                  <option value="director">ผอ./ผู้จัดการใหญ่ (Director)</option>
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                </select>
              </div>

              {/* 2. ข้อมูลพื้นฐาน */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">ชื่อจริง</label>
                  <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} required className="w-full border p-2 rounded"/>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">นามสกุล</label>
                  <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required className="w-full border p-2 rounded"/>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">อายุ</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full border p-2 rounded"/>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">เพศ</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border p-2 rounded">
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>

              {/* 3. ส่วนข้อมูลเฉพาะนักเรียน */}
              {needsStudentInfo && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">ข้อมูลการศึกษา (เฉพาะนักเรียน)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">ระดับการศึกษา</label>
                      <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} placeholder="เช่น ป.1, ม.3" className="w-full border p-2 rounded"/>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">สถานะ CDP</label>
                      <select name="studentType" value={formData.studentType} onChange={handleInputChange} className="w-full border p-2 rounded">
                        <option value="CDP">CDP</option>
                        <option value="NoCDP">NoCDP</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ส่วนข้อมูลที่ตั้ง (Dropdown สัมพันธ์กัน) */}
              {needsLocation && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">ข้อมูลสังกัด/ที่อยู่</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* เลือกสาขา */}
                    <div>
                      <label className="block mb-1 text-sm">สาขา</label>
                      <select name="branchId" value={formData.branchId} onChange={handleInputChange} className="w-full border p-2 rounded">
                        <option value="">-- เลือกสาขา --</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>

                    {/* เลือกหมู่บ้าน (แสดงเฉพาะของสาขาที่เลือก) */}
                    <div>
                      <label className="block mb-1 text-sm">หมู่บ้าน</label>
                      <select 
                        name="villageId" 
                        value={formData.villageId} 
                        onChange={handleInputChange} 
                        className={`w-full border p-2 rounded ${!formData.branchId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        disabled={!formData.branchId}
                      >
                        <option value="">-- เลือกหมู่บ้าน --</option>
                        {filteredVillages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>

                    {/* เลือกโรงเรียน (แสดงเฉพาะของหมู่บ้านที่เลือก) */}
                    <div>
                      <label className="block mb-1 text-sm">โรงเรียน</label>
                      <select 
                        name="schoolId" 
                        value={formData.schoolId} 
                        onChange={handleInputChange} 
                        className={`w-full border p-2 rounded ${!formData.villageId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">ข้อมูลเข้าสู่ระบบ</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">ชื่อผู้ใช้ (Login ID)</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} required={!editMode} 
                      className="w-full border p-2 rounded bg-white"/>
                    <p className="text-xs text-gray-500 mt-1">*ถ้าไม่กรอกระบบจะสร้างให้</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">รหัสผ่าน</label>
                    <input type="text" name="password" value={formData.password} onChange={handleInputChange} placeholder={editMode ? "เว้นว่างถ้าไม่เปลี่ยน" : "เว้นว่างเพื่อสุ่ม"}
                      className="w-full border p-2 rounded bg-white"/>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium">ยกเลิก</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;