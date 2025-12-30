import React, { useState, useEffect } from "react";
import { MasterAPI } from "../../../lib/api/endpoints";
import { PencilSquareIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AdminBranches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // ข้อมูลสาขา: รหัสสาขา, ชื่อสาขา
  const [form, setForm] = useState({ code: "", name: "" });

  const fetchData = async () => {
    try {
      const res = await MasterAPI.getBranches();
      setData(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await MasterAPI.updateBranch(editingId, form);
      else await MasterAPI.createBranch(form);
      setIsFormOpen(false); fetchData();
    } catch (err) { alert("บันทึกไม่สำเร็จ"); }
  };

  const handleDelete = async (id) => {
    if (confirm("ยืนยันการลบ?")) {
      await MasterAPI.deleteBranch(id); fetchData();
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ code: item.code, name: item.name });
    setIsFormOpen(true);
  };

  const filtered = data.filter(d => (d.name+d.code).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-screen bg-slate-50 flex flex-col animate-fade-in-up">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div><h1 className="text-xl font-bold text-slate-800">จัดการข้อมูลสาขา</h1></div>
        <button onClick={() => { setIsFormOpen(true); setEditingId(null); setForm({code:"", name:""}); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"><PlusIcon className="w-5 h-5"/> เพิ่มสาขา</button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <input type="text" placeholder="ค้นหา..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0"><tr><th className="p-4">รหัสสาขา</th><th className="p-4">ชื่อสาขา</th><th className="p-4 text-center">จัดการ</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr> : filtered.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono font-bold text-blue-600">{item.code}</td>
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4 text-center flex justify-center gap-2">
                                    <button onClick={()=>handleEdit(item)} className="p-1.5 text-blue-600 bg-blue-50 rounded"><PencilSquareIcon className="w-4 h-4"/></button>
                                    <button onClick={()=>handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded"><TrashIcon className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {isFormOpen && (
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col">
                <div className="p-4 border-b flex justify-between bg-slate-50"><h3 className="font-bold">{editingId ? 'แก้ไข' : 'เพิ่มสาขา'}</h3><button onClick={()=>setIsFormOpen(false)}>✕</button></div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div><label className="text-xs font-bold">รหัสสาขา</label><input required value={form.code} onChange={e=>setForm({...form, code:e.target.value})} className="w-full border rounded-lg p-2 mt-1"/></div>
                    <div><label className="text-xs font-bold">ชื่อสาขา</label><input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-lg p-2 mt-1"/></div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">บันทึก</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}