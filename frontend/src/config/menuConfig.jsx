import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline' 

// กำหนดเมนูสำหรับแต่ละ Role
export const ROLE_MENUS = {
  
  // 1. ผู้ดูแลระบบ (Admin)
  admin: [
    { 
      title: "ภาพรวม (Dashboard)", 
      path: "/admin", 
      icon: <HomeIcon className="w-5 h-5"/> 
    },
    { 
      title: "จัดการผู้ใช้งาน", 
      path: "/admin/users", 
      icon: <UserGroupIcon className="w-5 h-5"/> 
    },
    { 
      title: "ข้อมูล Master Data", 
      path: "/admin/master", 
      icon: <ChartBarIcon className="w-5 h-5"/> 
    },
    { 
      title: "ตรวจสอบ Log", 
      path: "/admin/logs", 
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5"/> 
    },
  ],

  // 2. ผู้จัดการสาขา (Branch Manager)
  branch_manager: [
    { 
      title: "แดชบอร์ดสาขา", 
      path: "/manager", 
      icon: <HomeIcon className="w-5 h-5"/> 
    },
    { 
      title: "อนุมัติคำร้อง", 
      path: "/manager/approvals", 
      icon: <CheckBadgeIcon className="w-5 h-5"/> 
    },
    { 
      title: "ข้อมูลนักเรียนในสาขา", 
      path: "/manager/students", 
      icon: <UserGroupIcon className="w-5 h-5"/> 
    },
  ],

  // 3. เจ้าหน้าที่ (Staff)
  staff: [
    { 
      title: "หน้าหลัก", 
      path: "/staff", 
      icon: <HomeIcon className="w-5 h-5"/> 
    },
    { 
      title: "นักเรียนของฉัน", 
      path: "/staff/my-students", 
      icon: <AcademicCapIcon className="w-5 h-5"/> 
    },
    { 
      title: "บันทึกงานประจำวัน", 
      path: "/staff/daily-duty", 
      icon: <DocumentTextIcon className="w-5 h-5"/> 
    },
    { 
      title: "สรุปยอดสอน", 
      path: "/staff/teaching-summary", 
      icon: <ChartBarIcon className="w-5 h-5"/> 
    },
  ],

  // 4. ผู้อำนวยการ (Director)
  director: [
    { 
      title: "Executive Dashboard", 
      path: "/director", 
      icon: <ChartBarIcon className="w-5 h-5"/> 
    },
    { 
      title: "รายงานภาพรวม", 
      path: "/director/reports", 
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5"/> 
    },
  ],

  // 5. นักเรียน (Student)
  student: [
    { 
      title: "หน้าแรก", 
      path: "/student", 
      icon: <HomeIcon className="w-5 h-5"/> 
    },
    { 
      title: "ลงทะเบียนเรียน", 
      path: "/student/register", 
      icon: <DocumentTextIcon className="w-5 h-5"/> 
    },
  ]
};