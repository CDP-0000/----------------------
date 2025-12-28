import { Routes, Route, Navigate } from 'react-router-dom'

// Import Pages
import LOGIN from './pages/LOGIN/login_page'
import HOME from './pages/HOME/home_page'
import REGISTER from './pages/RESGISTER/register_students_page'

// Import Guard
import ProtectedRoute from './components/OTHERS/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* --- 1. Public Zone (เข้าได้ทุกคน) --- */}
      {/* หน้าแรกให้เป็น Login */}
      <Route path="/" element={<Navigate to="/login" replace />} /> 
      <Route path="/login" element={<LOGIN />} />
      
      {/* หน้าลงทะเบียน (ปกติเด็กๆ ต้องเข้าได้โดยไม่ต้อง Login) */}
      <Route path="/register" element={<REGISTER />} />


      {/* --- 2. Private Zone (ต้อง Login เท่านั้น) --- */}
      
      {/* ตัวอย่าง: ถ้าหน้า Home นี้สำหรับ Admin เท่านั้น */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
         <Route path="/home" element={<HOME />} />
      </Route>

      {/* (Optional) ถ้าหน้า Home นี้เข้าได้ทั้ง Admin และ User */}
      {/* <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
         <Route path="/home" element={<HOME />} />
      </Route> */}

      {/* ดักทาง: ถ้าพิมพ์ URL มั่วๆ ให้ดีดกลับไป Login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App