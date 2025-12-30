import React, { useState, useEffect } from "react";
import { MasterAPI } from "../../../lib/api/endpoints";
import { PencilSquareIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]); // ✅ เพิ่ม
  const [villages, setVillages] = useState([]); // ✅ เพิ่ม
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // ✅ Form เก็บ branchId และ villageId
  const [form, setForm] = useState({
    name: "",
    branchId: "", 
    villageId: ""
  });

  const fetchData = async () => {
    try {
      // ✅ โหลด 3 อย่างพร้อมกัน
      const [sRes, bRes, vRes] = await Promise.all([
        MasterAPI.getSchools(),
        MasterAPI.getBranches(),
        MasterAPI.getVillages()
      ]);
      setSchools(sRes.data);
      setBranches(bRes.data);
      setVillages(vRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await MasterAPI.updateSchool(editingId, form);
      else await MasterAPI.createSchool(form);
      setIsFormOpen(false); fetchData();
    } catch (err) { alert("บันทึกไม่สำเร็จ"); }
  };

  const handleDelete = async (id) => {
    if (confirm("ยืนยันการลบ?")) {
      await MasterAPI.deleteSchool(id); fetchData();
    }
  };

  // Helper Functions
  const getBranchName = (id) => branches.find(b => b.id === id)?.name || "-";
  const getVillageName = (id) => villages.find(v => v.id === id)?.name || "-";

  // ✅ Logic กรองหมู่บ้าน ตามสาขาที่เลือกในฟอร์ม
  const filteredVillagesForForm = villages.filter(v => v.branchId === form.branchId);

  const filteredList = schools.filter(s => 
    (s.name + getVillageName(s.villageId)).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-slate-50 flex flex-col animate-fade-in-up">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div><h1 className="text-xl font-bold text-slate-800">จัดการข้อมูลโรงเรียน</h1><p className="text-sm text-slate-500">โรงเรียนอยู่ในหมู่บ้าน หมู่บ้านอยู่ในสาขา</p></div>
        <button onClick={() => { setIsFormOpen(true); setEditingId(null); setForm({name:"", branchId:"", villageId:""}); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"><PlusIcon className="w-5 h-5"/> เพิ่มโรงเรียน</button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="text" placeholder="ค้นหาโรงเรียน..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"/>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0"><tr><th className="p-4">ชื่อโรงเรียน</th><th className="p-4">ที่ตั้ง (หมู่บ้าน/สาขา)</th><th className="p-4 text-center w-24">จัดการ</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan={3} className="p-8 text-center">Loading...</td></tr> : filteredList.map(item => (
                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-4 font-medium text-slate-800">{item.name}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-slate-700"><MapPinIcon className="w-4 h-4 text-slate-400"/> {getVillageName(item.villageId)}</div>
                                    <div className="text-xs text-slate-400 ml-5">สาขา: {getBranchName(item.branchId)}</div>
                                </td>
                                <td className="p-4 text-center flex justify-center gap-2">
                                    <button onClick={() => { setEditingId(item.id); setForm({name: item.name, branchId: item.branchId, villageId: item.villageId}); setIsFormOpen(true); }} className="p-1.5 text-blue-600 bg-blue-50 rounded"><PencilSquareIcon className="w-4 h-4"/></button>
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
                <div className="relative w-full max-w-sm bg-white lg:rounded-2xl shadow-2xl lg:shadow-sm border-l lg:border border-slate-200 h-full lg:h-auto flex flex-col">
                    <div className="p-4 border-b flex justify-between bg-slate-50"><h3 className="font-bold">{editingId ? 'แก้ไข' : 'เพิ่มโรงเรียน'}</h3><button onClick={()=>setIsFormOpen(false)}>✕</button></div>
                    <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 overflow-y-auto">
                        
                        {/* 1. เลือกสาขา */}
                        <div>
                            <label className="text-xs font-bold text-slate-600">สังกัดสาขา *</label>
                            <select 
                                required 
                                value={form.branchId} 
                                onChange={e => setForm({...form, branchId: e.target.value, villageId: ""})} // เปลี่ยนสาขา -> ล้างหมู่บ้าน
                                className="w-full border rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">-- เลือกสาขา --</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>

                        {/* 2. เลือกหมู่บ้าน (กรองตามสาขา) */}
                        <div>
                            <label className="text-xs font-bold text-slate-600">ตั้งอยู่ที่หมู่บ้าน *</label>
                            <select 
                                required 
                                value={form.villageId} 
                                onChange={e => setForm({...form, villageId: e.target.value})} 
                                disabled={!form.branchId} // ห้ามเลือกถ้ายังไม่เลือกสาขา
                                className="w-full border rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                <option value="">-- เลือกหมู่บ้าน --</option>
                                {filteredVillagesForForm.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                            {!form.branchId && <p className="text-[10px] text-red-400 mt-1">* กรุณาเลือกสาขาก่อน</p>}
                        </div>

                        {/* 3. ชื่อโรงเรียน */}
                        <div>
                            <label className="text-xs font-bold text-slate-600">ชื่อโรงเรียน *</label>
                            <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                    </form>
                    <div className="p-4 border-t bg-slate-50 flex gap-2">
                        <button onClick={() => setIsFormOpen(false)} className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-white">ยกเลิก</button>
                        <button onClick={handleSubmit} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm">บันทึก</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}