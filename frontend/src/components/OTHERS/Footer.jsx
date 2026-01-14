import React from 'react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                
                {/* ข้อมูลติดต่อ */}
                <div className="mb-6 space-y-2">
                    <h2 className="text-lg font-bold text-white mb-3">ติดต่อเรา</h2>
                    <p className="text-sm md:text-base leading-relaxed">
                        91/47 หมู่ 3 หมู่บ้านบัวทอง ตำบลขามใหญ่ <br className="hidden md:block"/> 
                        อำเภอเมืองอุบลราชธานี จังหวัดอุบลราชธานี 34000
                    </p>
                    <div className="flex justify-center gap-4 text-sm font-medium text-emerald-400 pt-1">
                        <a href="tel:021234567" className="hover:text-emerald-300 transition">โทร: 02-123-4567</a>
                        <span className="text-slate-600">|</span>
                        <a href="mailto:cdp@cdp.org" className="hover:text-emerald-300 transition">อีเมล: cdp@cdp.org</a>
                    </div>
                </div>

                {/* ปุ่ม Facebook */}
                <div className="flex justify-center mb-0">
                    <a
                        href="https://www.facebook.com/profile.php?id=100080718971575"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800 rounded-full hover:bg-slate-700 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#1877F2"
                            className="w-8 h-8 group-hover:scale-110 transition-transform"
                        >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="font-medium text-slate-300 group-hover:text-white transition-colors">
                            ติดตามมูลนิธิ ซีดีพี เพื่อการพัฒนาทักษะเด็กไทย 
                        </span>
                    </a>
                </div>

                {/* เส้นคั่นบางๆ */}
                <div className="border-t border-slate-800 w-2/3 mx-auto mb-6 mt-6"></div>

                {/* Copyright */}
                <div className="space-y-1">
                    <p className="text-sm">
                        &copy; {currentYear} <span className="text-white font-semibold">MY UNIVERSITY Project</span>. All Rights Reserved.
                    </p>
                    <p className="text-xs text-slate-500">
                        Developed by CDP_Foundation_Web_Application Team
                    </p>
                </div>
            </div>
        </footer>
    )
}