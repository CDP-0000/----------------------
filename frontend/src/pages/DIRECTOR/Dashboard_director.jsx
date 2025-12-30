import React from 'react';
import { 
  GlobeAsiaAustraliaIcon, 
  PresentationChartLineIcon, 
  BanknotesIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function DashboardDirector() {
  const user = JSON.parse(localStorage.getItem('userData')) || { firstname: 'ท่านประธาน' };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* 1. Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
          <p className="text-slate-400">ภาพรวมการดำเนินงานมูลนิธิฯ (ระดับประเทศ)</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-slate-400">ยินดีต้อนรับ</p>
            <p className="text-xl font-bold">{user.firstname} {user.lastname}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-gold-400">
                <span>👑 Executive Director</span>
            </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <GlobeAsiaAustraliaIcon className="w-6 h-6"/>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+2 สาขา</span>
            </div>
            <p className="text-slate-500 text-sm">สาขาทั้งหมด</p>
            <h3 className="text-3xl font-bold text-slate-800">12 <span className="text-sm font-normal text-slate-400">แห่ง</span></h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <UserGroupIcon className="w-6 h-6"/>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+15%</span>
            </div>
            <p className="text-slate-500 text-sm">นักเรียนในโครงการ</p>
            <h3 className="text-3xl font-bold text-slate-800">2,540 <span className="text-sm font-normal text-slate-400">คน</span></h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <BanknotesIcon className="w-6 h-6"/>
                </div>
                <span className="text-xs text-slate-500">Q4/2025</span>
            </div>
            <p className="text-slate-500 text-sm">งบประมาณคงเหลือ</p>
            <h3 className="text-3xl font-bold text-slate-800">1.2 <span className="text-sm font-normal text-slate-400">ล้านบาท</span></h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <PresentationChartLineIcon className="w-6 h-6"/>
                </div>
            </div>
            <p className="text-slate-500 text-sm">อัตราความสำเร็จ</p>
            <h3 className="text-3xl font-bold text-slate-800">92.5%</h3>
        </div>
      </div>

      {/* 3. Reports & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: รายงานสรุปจากสาขา */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6">📊 รายงานสรุปประจำไตรมาส</h3>
            <div className="space-y-4">
                {[
                    { branch: 'สาขาเชียงใหม่', status: 'Exceed', score: '98%', manager: 'สมชาย' },
                    { branch: 'สาขาขอนแก่น', status: 'On Track', score: '85%', manager: 'วิชัย' },
                    { branch: 'สาขาภูเก็ต', status: 'Attention', score: '60%', manager: 'มานี' },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                {idx + 1}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{item.branch}</p>
                                <p className="text-xs text-slate-500">ผู้จัดการ: {item.manager}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{item.score}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === 'Exceed' ? 'bg-green-100 text-green-700' :
                                item.status === 'Attention' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: อนุมัติงบประมาณ/โครงการใหญ่ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6">🖋️ รอการอนุมัติ (3)</h3>
            <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold bg-white px-2 py-1 rounded border">งบประมาณ</span>
                        <span className="text-xs text-slate-500">วันนี้</span>
                    </div>
                    <p className="font-bold text-sm mb-1">ขอจัดซื้อรถตู้รับส่งนักเรียนใหม่ (สาขาอุบลฯ)</p>
                    <p className="text-xs text-slate-500 mb-3">ยอดเงิน: 1,200,000 บาท</p>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-slate-900 text-white text-xs py-2 rounded-lg hover:bg-black">อนุมัติ</button>
                        <button className="flex-1 bg-white border text-slate-600 text-xs py-2 rounded-lg hover:bg-slate-50">ดูรายละเอียด</button>
                    </div>
                </div>
            </div>
            <button className="w-full mt-4 text-center text-sm text-blue-600 hover:underline">ดูรายการทั้งหมด</button>
        </div>
      </div>

    </div>
  );
}

// Icon ที่ต้องใช้เพิ่ม (อย่าลืม import หรือเปลี่ยนเป็น icon อื่นที่มี)
import { UserGroupIcon } from '@heroicons/react/24/outline';