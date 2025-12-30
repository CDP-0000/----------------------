import React, { useState, useEffect } from "react";
import { MasterAPI } from "../../../lib/api/endpoints";
import { PencilSquareIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function AdminVillages() {
  const [villages, setVillages] = useState([]);
  const [branches, setBranches] = useState([]); // ✅ เพิ่ม State เก็บสาขา
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // ✅ เพิ่ม branchId ในฟอร์ม
  const [form, setForm] = useState({ name: "", branchId: "" });

  const fetchData = async () => {
    try {
      // ✅ โหลดทั้ง หมู่บ้าน และ สาขา มาพร้อมกัน
      const [vRes, bRes] = await Promise.all([
        MasterAPI.getVillages(),
        MasterAPI.getBranches()
      ]);
      setVillages(vRes.data);
      setBranches(bRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await MasterAPI.updateVillage(editingId, form);
      else await MasterAPI.createVillage(form);
      setIsFormOpen(false); fetchData();
    } catch (err) { alert("บันทึกไม่สำเร็จ"); }
  };

  const handleDelete = async (id) => {
    if (confirm("ยืนยันการลบ?")) {
      await MasterAPI.deleteVillage(id); fetchData();
    }
  };

  // Helper หาชื่อสาขาจาก ID
  const getBranchName = (id) => {
      const b = branches.find(x => x.id === id || x.code === id); // รองรับทั้ง id และ code
      return b ? b.name : "-";
  };

  const filtered = villages.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    getBranchName(v.branchId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-slate-50 flex flex-col animate-fade-in-up">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
            <h1 className="text-xl font-bold text-slate-800">จัดการข้อมูลหมู่บ้าน</h1>
            <p className="text-sm text-slate-500">หมู่บ้านต้องสังกัดสาขา</p>
        </div>
        <button onClick={() => { setIsFormOpen(true); setEditingId(null); setForm({name:"", branchId: ""}); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <PlusIcon className="w-5 h-5"/> เพิ่มหมู่บ้าน
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="text" placeholder="ค้นหาหมู่บ้าน หรือ สาขา..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-100"/>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                        <tr>
                            <th className="p-4">ชื่อหมู่บ้าน</th>
                            <th className="p-4">สังกัดสาขา</th>
                            <th className="p-4 text-center w-24">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan={3} className="p-8 text-center">Loading...</td></tr> : filtered.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                                    <span className="bg-green-50 p-1.5 rounded-lg text-green-600"><HomeIcon className="w-4 h-4"/></span>
                                    {item.name}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <BuildingOfficeIcon className="w-4 h-4 text-slate-400"/>
                                        {getBranchName(item.branchId)}
                                    </div>
                                </td>
                                <td className="p-4 text-center flex justify-center gap-2">
                                    <button onClick={() => { setEditingId(item.id); setForm({name: item.name, branchId: item.branchId}); setIsFormOpen(true); }} className="p-1.5 text-blue-600 bg-blue-50 rounded"><PencilSquareIcon className="w-4 h-4"/></button>
                                    <button onClick={()=>handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded"><TrashIcon className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {isFormOpen && (
            <div className="fixed inset-0 lg:static lg:inset-auto z-20 flex justify-end lg:block">
                <div className="absolute inset-0 bg-black/30 lg:hidden" onClick={() => setIsFormOpen(false)}></div>
                <div className="relative w-full max-w-xs bg-white lg:rounded-2xl shadow-2xl lg:shadow-sm border-l lg:border border-slate-200 h-full lg:h-auto flex flex-col">
                    <div className="p-4 border-b flex justify-between bg-slate-50"><h3 className="font-bold">{editingId ? 'แก้ไข' : 'เพิ่มหมู่บ้าน'}</h3><button onClick={()=>setIsFormOpen(false)}>✕</button></div>
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        
                        {/* ✅ 1. เลือกสาขา */}
                        <div>
                            <label className="text-xs font-bold text-slate-600">สังกัดสาขา *</label>
                            <select 
                                required 
                                value={form.branchId} 
                                onChange={e=>setForm({...form, branchId:e.target.value})} 
                                className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                <option value="">-- เลือกสาขา --</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* ✅ 2. ชื่อหมู่บ้าน */}
                        <div>
                            <label className="text-xs font-bold text-slate-600">ชื่อหมู่บ้าน *</label>
                            <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-green-500"/>
                        </div>
                        
                        <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">บันทึก</button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}