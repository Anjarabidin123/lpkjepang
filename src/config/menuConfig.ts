import {
  Home,
  BarChart3,
  Database,
  GraduationCap,
  Users,
  Building2,
  Factory,
  BookOpen,
  Briefcase,
  MapPin,
  ClipboardList,
  FileText,
  UserCog,
  Settings,
  Monitor,
  School,
  DollarSign,
  TrendingUp,
  Shield,
  Calendar,
  CheckSquare,
  Activity,
  UserCheck,
  Map,
  FileStack,
  FileSearch
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface MenuItem {
  id: string;
  title: string;
  url?: string;
  icon: LucideIcon;
  children?: MenuItem[];
  isCollapsible?: boolean;
  allowedRoles?: string[]; // Jika kosong, berarti semua role boleh akses
}

export const menuConfig: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/",
    icon: Home,
    allowedRoles: [], // Semua role bisa akses
  },
  {
    id: "monitoring",
    title: "Monitoring",
    url: "/monitoring",
    icon: Monitor,
    allowedRoles: ['super_admin', 'admin', 'finance', 'instructor'],
  },
  {
    id: "student-menu",
    title: "Menu Saya",
    icon: GraduationCap,
    isCollapsible: true,
    allowedRoles: ['student'],
    children: [
      {
        id: "my-profile",
        title: "Profil Saya",
        url: "/profile",
        icon: Users,
      },
      {
        id: "my-schedule",
        title: "Absensi & Nilai",
        url: "/education",
        icon: GraduationCap,
      },
      {
        id: "my-documents",
        title: "Dokumen Saya",
        url: "/document-tracking",
        icon: FileStack,
      },
      {
        id: "learning-modules",
        title: "Materi Belajar",
        url: "/learning-modules",
        icon: BookOpen,
      },
    ]
  },
  {
    id: "master-data",
    title: "Master Data",
    icon: Database,
    isCollapsible: true,
    allowedRoles: ['super_admin', 'admin', 'instructor'], // Finance tidak bisa akses
    children: [
      {
        id: "doc-tracking",
        title: "Tracking Dokumen",
        url: "/document-tracking",
        icon: FileSearch,
        allowedRoles: ['super_admin', 'admin'],
      },
      {
        id: "doc-templates",
        title: "Template Dokumen",
        url: "/document-templates",
        icon: FileText,
        allowedRoles: ['super_admin', 'admin'],
      },
      {
        id: "doc-variables",
        title: "Variabel Dokumen",
        url: "/document-variables",
        icon: Settings,
        allowedRoles: ['super_admin', 'admin'],
      },
      {
        id: "siswa-magang",
        title: "Siswa Magang",
        url: "/siswa-reguler",
        icon: Users,
      },
      {
        id: "siswa",
        title: "Siswa",
        url: "/siswa",
        icon: GraduationCap,
      },
      {
        id: "kumiai",
        title: "Kumiai",
        url: "/kumiai",
        icon: Building2,
      },
      {
        id: "perusahaan-master",
        title: "Perusahaan",
        url: "/perusahaan",
        icon: Factory,
      },
      {
        id: "lpk-mitra-master",
        title: "LPK Mitra",
        url: "/lpk-mitra",
        icon: School,
      },
      {
        id: "program-master",
        title: "Program",
        url: "/program",
        icon: BookOpen,
      },
      {
        id: "jenis-kerja-master",
        title: "Jenis Kerja",
        url: "/jenis-kerja",
        icon: Briefcase,
      },
      {
        id: "posisi-kerja-master",
        title: "Posisi Kerja",
        url: "/posisi-kerja",
        icon: MapPin,
      },
    ]
  },
  {
    id: "operasional",
    title: "Operasional",
    icon: Activity,
    isCollapsible: true,
    allowedRoles: ['super_admin', 'admin', 'instructor'],
    children: [
      {
        id: "job-order",
        title: "Job Order",
        url: "/job-order",
        icon: ClipboardList,
      },
      {
        id: "tugas",
        title: "Tugas",
        url: "/task-management",
        icon: CheckSquare,
      },
      {
        id: "rekrutment",
        title: "Rekrutment",
        url: "/rekrutmen",
        icon: Briefcase,
      },
      {
        id: "document",
        title: "Dokumen",
        url: "/document",
        icon: FileStack,
      },
    ]
  },
  {
    id: "pendidikan-menu",
    title: "Pendidikan",
    icon: GraduationCap,
    isCollapsible: true,
    allowedRoles: ['super_admin', 'admin', 'instructor'],
    children: [
      {
        id: "absensi-siswa",
        title: "Absensi Harian",
        url: "/education/attendance",
        icon: CheckSquare,
      },
      {
        id: "nilai-siswa",
        title: "Penilaian Ujian",
        url: "/education/grades",
        icon: FileText,
      },
      {
        id: "materi-belajar",
        title: "Materi Belajar",
        url: "/learning-modules",
        icon: BookOpen,
      },
    ]
  },
  {
    id: "transaksi",
    title: "Transaksi",
    icon: DollarSign,
    isCollapsible: true,
    allowedRoles: ['super_admin', 'finance'],
    children: [
      {
        id: "internal-payment-trans",
        title: "Biaya Pelatihan",
        url: "/internal-payment",
        icon: DollarSign,
      },
      {
        id: "invoice-trans",
        title: "Invoice",
        url: "/invoice",
        icon: FileText,
      },
      {
        id: "arus-kas-trans",
        title: "Arus Kas",
        url: "/arus-kas",
        icon: TrendingUp,
      },
      {
        id: "pengaturan-trans",
        title: "Pengaturan",
        url: "/pengaturan",
        icon: Settings,
      },
      {
        id: "laporan-keuangan",
        title: "Laporan Keuangan",
        url: "/report-finance",
        icon: BarChart3,
      },
    ]
  },
  {
    id: "system-management",
    title: "System Management",
    icon: Shield,
    isCollapsible: true,
    allowedRoles: ['super_admin'],
    children: [
      {
        id: "user-management-rbac",
        title: "User Management",
        url: "/user-management-rbac",
        icon: Users,
      },
      {
        id: "role-management-rbac",
        title: "Role Management",
        url: "/role-management-rbac",
        icon: UserCheck,
      },
      {
        id: "demografi-sys",
        title: "Demografi",
        url: "/demografi",
        icon: Map,
      },
      {
        id: "profil-lpk-sys",
        title: "Profil LPK",
        url: "/user-management",
        icon: UserCog,
      },
      {
        id: "settings-sys",
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ]
  },
];
