'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { Role, UserSession } from '@/lib/types';
import { switchDemoRoleAction } from '@/lib/actions';
import {
  Shield,
  GraduationCap,
  Users,
  UserCheck,
  Search,
  Check,
  X,
  ArrowRight,
  Lock,
  FileCheck2,
  BookOpen,
  Award,
  CalendarCheck2,
  Receipt,
  CalendarDays,
  Bell,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Layers,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface ManualClientProps {
  currentSession?: UserSession | null;
}

type TabType = 'OVERVIEW' | 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' | 'WORKFLOW' | 'MATRIX' | 'SECURITY';

const rolesData = [
  {
    role: 'ADMIN' as Role,
    tab: 'ADMIN' as TabType,
    title: 'Executive Administrator',
    persona: 'Dr. (Mrs.) Folashade Valencia',
    email: 'admin@valencia.edu.ng',
    pass: 'admin123',
    scope: 'Full Academy (Daycare to SS 3 &bull; 800 Students &bull; 16 Arms &bull; 48 Staff)',
    icon: <Shield className="w-5 h-5 text-[#FF1313]" />,
    badgeColor: 'bg-red-50 dark:bg-red-950/50 text-[#FF1313] border-red-200 dark:border-red-900/50',
    tagline: 'Institutional governance, student directory oversight, faculty management, and final result publishing authority.',
    primaryUrl: '/admin',
    features: [
      {
        name: 'Executive Dashboard',
        url: '/admin',
        icon: <Layers className="w-4 h-4 text-blue-500" />,
        summary: 'Institutional bird’s-eye view of enrollment, attendance velocity, and real-time approval queues.',
        steps: [
          'Log in with admin credentials (or use 1-click Demo Switcher).',
          'Review key KPIs: 800 enrolled students, 16 classroom arms, 48 staff members, and 96.2% term attendance rate.',
          'Check the Pending Moderations alert banner for subject sheets awaiting executive sign-off.',
          'Filter quick enrollment breakdowns across Early Years, Primary, JSS, and SSS sections.',
        ],
        proTip: 'The dashboard highlights classroom arms requiring administrative attention with color-coded status badges.',
      },
      {
        name: 'Result Approvals & Moderation Queue',
        url: '/admin/results',
        icon: <FileCheck2 className="w-4 h-4 text-emerald-500" />,
        summary: 'Review, moderate, and publish 50-student class score sheets submitted by subject teachers.',
        steps: [
          'Navigate to "Result Approvals" from the sidebar.',
          'Filter by Academic Section (e.g. Junior Secondary) or Class Arm (e.g. JSS 2A).',
          'Select a submitted subject sheet (e.g. JSS 2A &bull; Mathematics).',
          'Inspect individual CA scores (max 40) and Exam scores (max 60) for all 50 students.',
          'Click "Approve & Publish All 50 Now" to transition the batch from PENDING_APPROVAL to PUBLISHED.',
          'Alternatively, click "Return for Revision" if marks require teacher correction.',
        ],
        proTip: 'Once published, results become instantly accessible to parents and students, and cryptographic QR verification hashes are generated.',
      },
      {
        name: 'Student Directory (800 Students)',
        url: '/admin/students',
        icon: <GraduationCap className="w-4 h-4 text-purple-500" />,
        summary: 'Comprehensive searchable database of all enrolled learners from Daycare through SS 3.',
        steps: [
          'Open "Student Directory" to browse the complete 800-student registry.',
          'Switch between section tabs: Early Years & Nursery (200), Primary (300), JSS (150), and SSS (150).',
          'Use the live search bar to query by student name (e.g. "Zainab") or admission number ("VAL/2024/JSS2/001").',
          'Click on any student row to review linked guardians, fee balances, and academic progress.',
        ],
        proTip: 'Every classroom arm maintains an even cohort of 50 students with authentic Nigerian names and registry numbers.',
      },
      {
        name: 'Staff & Roles Management',
        url: '/admin/staff',
        icon: <Users className="w-4 h-4 text-amber-500" />,
        summary: 'Audit 48 faculty and administrative staff assignments, qualifications, and role access privileges.',
        steps: [
          'Navigate to "Staff & Roles".',
          'Inspect faculty directory listings with assigned classroom arms and subjects.',
          'Review educational qualifications (e.g. B.Ed, M.Sc, Ph.D) and department specializations.',
          'Audit role permissions to ensure RBAC segregation of duties is maintained.',
        ],
        proTip: 'Teachers can only grade subjects formally linked to their staff ID in this directory.',
      },
      {
        name: 'School Announcements Broadcaster',
        url: '/admin/announcements',
        icon: <Bell className="w-4 h-4 text-rose-500" />,
        summary: 'Draft and publish targeted announcements across specific portals or the whole school.',
        steps: [
          'Click "Announcements" in the sidebar.',
          'Click "Create Announcement" and enter notice headline and body.',
          'Select target audience: All School, Parents Only, Teachers Only, or Students Only.',
          'Set category tag (Academic, Event, Sports, Administrative) and priority flag (Normal, Urgent).',
          'Save to broadcast the bulletin immediately to target dashboards.',
        ],
        proTip: 'Urgent notices pin to the top of parent and student portal feeds with priority color coding.',
      },
    ],
    rbacRules: {
      canDo: [
        'Approve, reject, and publish academic score sheets.',
        'View and search all 800 students across all 16 classroom arms.',
        'Audit all faculty assignments and system activity logs.',
        'Broadcast announcements to any or all user audiences.',
        'Access student fee statements and institutional billing summaries.',
      ],
      cannotDo: [
        'Directly override teacher score inputs without reverting to draft (preserves audit integrity).',
        'Impersonate bank payment gateways (billing records are read/status managed).',
      ],
    },
  },
  {
    role: 'TEACHER' as Role,
    tab: 'TEACHER' as TabType,
    title: 'Academic Faculty / Teacher',
    persona: 'Mr. Babatunde Adeleke',
    email: 'teacher@valencia.edu.ng',
    pass: 'teacher123',
    scope: 'Assigned Classrooms Only (JSS 2A Mathematics & SS 1 Science Mathematics &bull; 100 Students)',
    icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
    badgeColor: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    tagline: 'Classroom curriculum delivery, Continuous Assessment tracking, score entry, and daily attendance registers.',
    primaryUrl: '/teacher',
    features: [
      {
        name: 'Teacher Dashboard',
        url: '/teacher',
        icon: <Layers className="w-4 h-4 text-blue-500" />,
        summary: 'Personalized command center showing assigned classes, teaching schedule, and pending tasks.',
        steps: [
          'Log in with teacher credentials.',
          'Review assigned teaching allocation: JSS 2A Mathematics (50 students) and SS 1 Science Mathematics (50 students).',
          'Check the "Action Required" panel for grading deadlines and unsubmitted daily registers.',
          'View recent school announcements targeted to academic faculty.',
        ],
        proTip: 'The dashboard only displays data relevant to your assigned subjects and classrooms.',
      },
      {
        name: 'Score Entry & Batch Submission',
        url: '/teacher/scores',
        icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
        summary: 'Enter Continuous Assessment (40) and Exam (60) scores with real-time grade calculations and 1-click batch submit.',
        steps: [
          'Open "Score Entry & Submit" from the teacher menu.',
          'Select the target class and subject (e.g. JSS 2A &bull; Mathematics).',
          'Input CA scores (0–40) and Exam scores (0–60) for individual students.',
          'Total score (100), letter grade (A–F), and academic remark compute automatically on the fly.',
          'Shortcut: Click "Auto-Fill Sample Scores" to populate realistic grading for all 50 students in 1 click.',
          'Click "Submit All 50 Scores for Approval" to lock inputs and send the batch to the Admin queue.',
        ],
        proTip: 'After submission, score fields lock against edits to prevent post-submission tampering while awaiting admin review.',
      },
      {
        name: 'My Classes & Subject Registers',
        url: '/teacher/classes',
        icon: <BookOpen className="w-4 h-4 text-purple-500" />,
        summary: 'Inspect enrolled student rosters, syllabus milestones, and class performance distribution.',
        steps: [
          'Click "My Classes & Subjects".',
          'Select an assigned class arm to view the complete 50-student roster.',
          'Inspect individual student admission numbers, gender, and current term standing.',
          'Review curriculum progress and scheme of work benchmarks.',
        ],
        proTip: 'Teachers cannot browse classrooms outside their official assigned arms.',
      },
      {
        name: 'Daily Attendance Register',
        url: '/teacher/attendance',
        icon: <CalendarCheck2 className="w-4 h-4 text-amber-500" />,
        summary: 'Take daily roll call for assigned homerooms with 1-click status toggles.',
        steps: [
          'Navigate to "Daily Attendance".',
          'Select the assigned classroom register.',
          'Roster defaults all 50 students to "Present" for quick workflows.',
          'Click status badges to flag students who are "Absent" or "Late".',
          'Click "Save Attendance Register" to sync attendance metrics with parent and admin portals.',
        ],
        proTip: 'Attendance rates update in real-time on parent and student report cards.',
      },
    ],
    rbacRules: {
      canDo: [
        'Enter and adjust CA and Exam marks for assigned subjects prior to submission.',
        'Use the 1-click Auto-Fill accelerator for 50-student demo simulations.',
        'Batch submit finalized score sheets for administrative moderation.',
        'Take and record daily attendance for assigned classrooms.',
        'View class rosters and student profiles within assigned arms.',
      ],
      cannotDo: [
        'Publish scores directly to parents or students without administrative approval.',
        'Access or modify marks for unassigned classes (e.g. Daycare, Primary, or unlinked subjects).',
        'Edit score sheets once submitted (requires Admin to return for revision).',
        'View financial fee statements or parent billing records.',
      ],
    },
  },
  {
    role: 'PARENT' as Role,
    tab: 'PARENT' as TabType,
    title: 'Parent / Guardian',
    persona: 'Alhaji Ibrahim Musa',
    email: 'parent@valencia.edu.ng',
    pass: 'parent123',
    scope: 'Linked Wards Only (Zainab Musa &bull; JSS 2A & Chidi Musa &bull; Primary 4A)',
    icon: <Users className="w-5 h-5 text-teal-500" />,
    badgeColor: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/50',
    tagline: 'Multi-ward switching, certified report card downloads, attendance monitoring, and itemized fee tracking.',
    primaryUrl: '/parent',
    features: [
      {
        name: 'Multi-Ward Child Switcher',
        url: '/parent',
        icon: <Users className="w-4 h-4 text-teal-500" />,
        summary: 'Seamless 1-click switching between multiple enrolled children across different school sections.',
        steps: [
          'Log in with parent credentials.',
          'Notice the Ward Switcher card at the top of the portal.',
          'Select Zainab Musa (JSS 2A) or Chidi Musa (Primary 4A).',
          'The entire portal context—report cards, attendance, and fee invoices—immediately re-keys to the selected ward.',
        ],
        proTip: 'Parents with wards in both Primary and Secondary can monitor both from a single portal session.',
      },
      {
        name: 'Academic Report Cards & QR Verification',
        url: '/parent/results',
        icon: <Award className="w-4 h-4 text-emerald-500" />,
        summary: 'Inspect verified term report cards with subject scores, class positions, remarks, and anti-tamper QR code.',
        steps: [
          'Click "Report Cards & Results".',
          'Select academic session (2024/2025) and term (1st Term).',
          'View published subject grades, Continuous Assessment scores, Exam scores, and remarks.',
          'Privacy Guard: Subjects in draft or awaiting moderation are safely masked with an "Awaiting Moderation" notice.',
          'Click "Print Official Report Card" to generate an official certified document complete with QR verification code.',
        ],
        proTip: 'Scanning the QR code on any printed report card verifies its authenticity directly against the school registry.',
      },
      {
        name: 'Attendance Records & Punctuality',
        url: '/parent/attendance',
        icon: <CalendarCheck2 className="w-4 h-4 text-blue-500" />,
        summary: 'Track term attendance percentage, total school days, and verified absences.',
        steps: [
          'Open "Attendance Records" from the parent menu.',
          'Check overall term attendance score (e.g. 98.4%).',
          'Inspect the monthly attendance calendar to confirm days present, excused absences, or tardiness.',
        ],
        proTip: 'Attendance records synchronize automatically whenever the homeroom teacher saves the register.',
      },
      {
        name: 'Term Fee Statements & Receipts',
        url: '/parent/fees',
        icon: <Receipt className="w-4 h-4 text-amber-500" />,
        summary: 'Itemized breakdown of tuition, ICT levies, lab charges, payment status, and official receipt numbers.',
        steps: [
          'Navigate to "Term Fee Statements".',
          'Review the itemized invoice: Tuition, ICT Levy, Science & Computer Lab Fees, Sports & Library dues.',
          'Verify payment status: Paid, Partial, or Unpaid.',
          'View transaction references and official receipt clearance stamps.',
        ],
        proTip: 'Fee clearance status is linked directly to report card release authorization.',
      },
    ],
    rbacRules: {
      canDo: [
        'Switch seamlessly between verified biological/legal wards.',
        'View and print published academic report cards with QR verification seals.',
        'Track ward attendance histories and daily roll call status.',
        'Inspect itemized tuition fee statements and payment clearance receipts.',
      ],
      cannotDo: [
        'View unmoderated draft marks entered by teachers before administrative approval.',
        'Access records for children not linked to the parent account.',
        'Bypass security via URL tampering (server intercepts and bounces unauthorized requests).',
        'Edit any academic or attendance data.',
      ],
    },
  },
  {
    role: 'STUDENT' as Role,
    tab: 'STUDENT' as TabType,
    title: 'Student',
    persona: 'Zainab Musa',
    email: 'student@valencia.edu.ng',
    pass: 'student123',
    scope: 'Personal Record Only (Zainab Musa &bull; Admission No: VAL/2024/JSS2/001 &bull; JSS 2A)',
    icon: <UserCheck className="w-5 h-5 text-purple-500" />,
    badgeColor: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
    tagline: 'Personal academic performance, weekly timetable schedule, digital transcript verification, and school notices.',
    primaryUrl: '/student',
    features: [
      {
        name: 'Student Profile & Academic Summary',
        url: '/student',
        icon: <Layers className="w-4 h-4 text-purple-500" />,
        summary: 'Personalized dashboard displaying student details, enrolled arm, house affiliation, and cumulative GPA.',
        steps: [
          'Log in with student credentials.',
          'Verify personal profile information: Admission Number, Class Arm (JSS 2A), House (Topaz Yellow).',
          'Review academic summary metrics: Term Average, Class Rank, and Attendance Rating.',
          'Check recent school announcements and examination schedules.',
        ],
        proTip: 'All academic credentials and records are strictly scoped to the student’s own profile.',
      },
      {
        name: 'Academic Results & Digital Transcript',
        url: '/student/results',
        icon: <Award className="w-4 h-4 text-emerald-500" />,
        summary: 'Access verified term results with teacher remarks and cryptographic QR anti-tamper verification.',
        steps: [
          'Click "Academic Results".',
          'Inspect published subject scores, grades, and teacher recommendations.',
          'View the verified digital transcript badge and term average.',
          'Scan or share the on-screen QR code to validate results on the public registry.',
        ],
        proTip: 'Unapproved teacher drafts remain invisible until Dr. Valencia officially approves them.',
      },
      {
        name: 'Weekly Monday–Friday Timetable',
        url: '/student/timetable',
        icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
        summary: 'Interactive daily class schedule showing periods, subject names, classroom venues, and teachers.',
        steps: [
          'Click "Weekly Timetable" in the sidebar.',
          'Navigate across Monday through Friday period allocations.',
          'Review period times (8:00 AM to 3:30 PM), subject titles, and designated classroom rooms.',
        ],
        proTip: 'Timetable slots automatically reflect class changes and teacher allocations.',
      },
      {
        name: 'School Notices & Examination Bulletins',
        url: '/student/announcements',
        icon: <Bell className="w-4 h-4 text-amber-500" />,
        summary: 'Stay informed on institutional events, sports competitions, science fairs, and holiday calendars.',
        steps: [
          'Open "School Notices" from the student menu.',
          'Read published school announcements targeted to learners.',
          'Track upcoming examination schedules and club activities.',
        ],
        proTip: 'High-priority academic bulletins appear with warning badges to ensure timely attention.',
      },
    ],
    rbacRules: {
      canDo: [
        'View personal published term report cards and grade history.',
        'Inspect personal weekly class timetable schedule.',
        'Generate and display anti-tamper QR verification codes.',
        'Read school announcements targeted to the student body.',
      ],
      cannotDo: [
        'View other students’ scores, records, or fee balances.',
        'View unapproved or draft results.',
        'Edit any grades, profile fields, or attendance markers.',
      ],
    },
  },
];

const permissionsMatrix = [
  { feature: 'Access Executive School Dashboard', admin: 'Full', teacher: 'None', parent: 'None', student: 'None' },
  { feature: 'View All 800 Students Across 16 Arms', admin: 'Full', teacher: 'None', parent: 'None', student: 'None' },
  { feature: 'Manage Faculty & Staff Assignments', admin: 'Full', teacher: 'None', parent: 'None', student: 'None' },
  { feature: 'Moderate & Approve Score Sheets', admin: 'Full', teacher: 'None', parent: 'None', student: 'None' },
  { feature: 'Publish Results to Portals', admin: 'Full', teacher: 'None', parent: 'None', student: 'None' },
  { feature: 'Broadcast School Announcements', admin: 'Full', teacher: 'None', parent: 'None', student: 'None' },
  { feature: 'Access Assigned Classroom Rosters', admin: 'Full', teacher: 'Assigned Only', parent: 'None', student: 'None' },
  { feature: 'Enter CA (40) & Exam (60) Marks', admin: 'Audit', teacher: 'Assigned Only', parent: 'None', student: 'None' },
  { feature: '1-Click Auto-Fill Demo Accelerator', admin: 'None', teacher: 'Assigned Only', parent: 'None', student: 'None' },
  { feature: 'Batch Submit 50 Scores for Approval', admin: 'None', teacher: 'Assigned Only', parent: 'None', student: 'None' },
  { feature: 'Mark Daily Attendance Register', admin: 'Audit', teacher: 'Assigned Only', parent: 'None', student: 'None' },
  { feature: 'Switch Between Enrolled Wards', admin: 'None', teacher: 'None', parent: 'Linked Only', student: 'None' },
  { feature: 'View Published Term Report Cards', admin: 'Full', teacher: 'Assigned Only', parent: 'Linked Only', student: 'Self Only' },
  { feature: 'View Draft (Unapproved) Marks', admin: 'Audit', teacher: 'Author Only', parent: 'Masked', student: 'Masked' },
  { feature: 'View Itemized Term Fee Statements', admin: 'Audit', teacher: 'None', parent: 'Linked Only', student: 'None' },
  { feature: 'Access Weekly Monday–Friday Timetable', admin: 'Full', teacher: 'Assigned Only', parent: 'Ward Schedule', student: 'Personal' },
  { feature: 'Public QR Anti-Tamper Verification', admin: 'Full', teacher: 'Full', parent: 'Full', student: 'Full' },
  { feature: '1-Click Demo Persona Switcher', admin: 'Full', teacher: 'Full', parent: 'Full', student: 'Full' },
];

export default function ManualClient({ currentSession }: ManualClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>(currentSession?.role || 'OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleRoleJump = (role: Role) => {
    startTransition(async () => {
      await switchDemoRoleAction(role);
    });
  };

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return rolesData;
    const q = searchQuery.toLowerCase();
    return rolesData.map((role) => {
      const matchedFeatures = role.features.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.summary.toLowerCase().includes(q) ||
          f.steps.some((s) => s.toLowerCase().includes(q))
      );
      return {
        ...role,
        features: matchedFeatures,
        isRoleMatched:
          role.title.toLowerCase().includes(q) ||
          role.persona.toLowerCase().includes(q) ||
          role.tagline.toLowerCase().includes(q) ||
          matchedFeatures.length > 0,
      };
    });
  }, [searchQuery]);

  const filteredMatrix = useMemo(() => {
    if (!searchQuery.trim()) return permissionsMatrix;
    const q = searchQuery.toLowerCase();
    return permissionsMatrix.filter((item) => item.feature.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF1313]/10 text-[#FF1313] border border-[#FF1313]/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Comprehensive Role Manual
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Daycare to SS 3 &bull; 800 Students
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
              Valencia SMS Operations &amp; Role Guide
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Step-by-step operational manual, permissions matrix, and role-based access control specifications for
              Administrators, Academic Faculty, Parents, and Students.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shrink-0">
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
              <span className="block text-base font-bold text-slate-900 dark:text-white">4</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Portals</span>
            </div>
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
              <span className="block text-base font-bold text-slate-900 dark:text-white">16</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Class Arms</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-base font-bold text-emerald-600 dark:text-emerald-400">100%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">RBAC Hardened</span>
            </div>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter workflows, roles, permissions (e.g., 'approve', 'scores', 'attendance', 'fees', 'ward', 'qr')..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF1313] focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {[
          { id: 'OVERVIEW' as TabType, label: 'All Roles Overview', icon: <Layers className="w-4 h-4" /> },
          { id: 'ADMIN' as TabType, label: 'Administrator', icon: <Shield className="w-4 h-4 text-[#FF1313]" /> },
          { id: 'TEACHER' as TabType, label: 'Teacher / Faculty', icon: <GraduationCap className="w-4 h-4 text-blue-500" /> },
          { id: 'PARENT' as TabType, label: 'Parent / Guardian', icon: <Users className="w-4 h-4 text-teal-500" /> },
          { id: 'STUDENT' as TabType, label: 'Student', icon: <UserCheck className="w-4 h-4 text-purple-500" /> },
          { id: 'WORKFLOW' as TabType, label: 'End-to-End Workflow', icon: <Clock className="w-4 h-4 text-amber-500" /> },
          { id: 'MATRIX' as TabType, label: 'Permissions Matrix', icon: <FileCheck2 className="w-4 h-4 text-emerald-500" /> },
          { id: 'SECURITY' as TabType, label: 'Anti-Tamper & Security', icon: <ShieldCheck className="w-4 h-4 text-rose-500" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FF1313] text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Persona Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rolesData.map((role) => (
              <div
                key={role.role}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-[#FF1313]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                        {role.icon}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{role.title}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{role.persona}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${role.badgeColor}`}>
                      {role.role}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{role.tagline}</p>

                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Scope of Authority:</span>
                      <span className="text-slate-900 dark:text-white font-medium">{role.scope}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Demo Credentials:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {role.email} &bull; <strong className="text-slate-900 dark:text-white">{role.pass}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Primary Workflows:
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {role.features.slice(0, 3).map((f) => (
                        <li key={f.name} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{f.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveTab(role.tab)}
                    className="text-xs font-bold text-[#FF1313] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Full Role Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRoleJump(role.role)}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#FF1313] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Test as {role.role}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links Callout */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Offline Documentation &amp; Printable Manual
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                The repository also includes <code className="font-mono font-bold">ROLES_MANUAL.md</code> in the project root,
                containing the complete offline specification and printable cheat sheets for stakeholder reviews.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('WORKFLOW')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              View End-to-End Workflow &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2, 3, 4, 5: SPECIFIC ROLE GUIDES */}
      {(['ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] as TabType[]).includes(activeTab) && (
        <div>
          {filteredRoles
            .filter((r) => r.tab === activeTab)
            .map((role) => (
              <div key={role.role} className="space-y-8">
                {/* Role Header Banner */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        {role.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                            {role.title} Operations Manual
                          </h2>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${role.badgeColor}`}>
                            {role.role} PORTAL
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Assigned Persona: <strong className="text-slate-900 dark:text-white">{role.persona}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRoleJump(role.role)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF1313] hover:bg-[#D60A0A] text-white shadow-xs transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Launch {role.title} Portal</span>
                      </button>
                    </div>
                  </div>

                  {/* Scope & Credentials */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Institutional Authority
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold">{role.scope}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Login Email &amp; Password
                      </span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        {role.email} &bull; <strong className="text-slate-900 dark:text-white">{role.pass}</strong>
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 sm:col-span-2 lg:col-span-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Primary Route
                      </span>
                      <Link
                        href={role.primaryUrl}
                        className="text-[#FF1313] hover:underline font-mono font-bold flex items-center gap-1"
                      >
                        <span>{role.primaryUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Feature-by-Feature Operational Guides */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#FF1313]" />
                      <span>Operational Features &amp; Step-by-Step Instructions</span>
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {role.features.length} core modules available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {role.features.map((feature) => (
                      <div
                        key={feature.name}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              {feature.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{feature.name}</h4>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  {feature.url}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feature.summary}</p>
                            </div>
                          </div>

                          <Link
                            href={feature.url}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-[#FF1313] hover:text-white text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <span>Open Page</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Step-by-step numbered instructions */}
                        <div className="mt-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                            Step-by-Step Procedure:
                          </span>
                          <div className="space-y-2">
                            {feature.steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                                <span className="w-5 h-5 rounded-full bg-[#FF1313]/10 text-[#FF1313] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pro-Tip callout */}
                        {feature.proTip && (
                          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Pro-Tip:</strong> {feature.proTip}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RBAC Boundaries & Security Matrix */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Role Boundaries &amp; Hardened RBAC Rules</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Authorized Actions (Permitted)
                      </span>
                      <ul className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1.5 pt-1">
                        {role.rbacRules.canDo.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 space-y-2">
                      <span className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                        <X className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        Restricted Actions (Server-Blocked)
                      </span>
                      <ul className="text-xs text-rose-800 dark:text-rose-200 space-y-1.5 pt-1">
                        {role.rbacRules.cannotDo.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <span className="text-rose-600 dark:text-rose-400 font-bold">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB CONTENT 6: WORKFLOW */}
      {activeTab === 'WORKFLOW' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              End-to-End Academic Result Moderation Story
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              How a single grade entry transitions seamlessly and securely across all 4 roles from classroom entry to
              executive sign-off and instant family access.
            </p>

            {/* 3-Stage Workflow Cards */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              {/* Stage 1 */}
              <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                      Phase 1: Faculty Entry
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Status: DRAFT</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Teacher Enters &amp; Submits</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Mr. Babatunde Adeleke opens JSS 2A Mathematics. He inputs CA (40) and Exam (60) marks across all 50
                    students, or uses the 1-click Auto-Fill accelerator.
                  </p>
                  <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200/80 dark:border-blue-800 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Trigger Action:
                    </span>
                    <p className="text-[#FF1313] font-semibold">&ldquo;Submit All 50 Scores for Approval&rdquo;</p>
                    <p className="text-[11px] text-slate-500">Status transitions to PENDING_APPROVAL. Inputs lock.</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-900/40">
                  <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                    &bull; Parent/Student visibility: <strong>Strictly Masked</strong>
                  </span>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                      Phase 2: Moderation
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Status: PENDING</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin Reviews &amp; Publishes</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Dr. Folashade Valencia receives the pending notification in her queue. She inspects score distributions,
                    class averages, and distinctions.
                  </p>
                  <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-800 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Trigger Action:
                    </span>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">&ldquo;Approve &amp; Publish All 50 Now&rdquo;</p>
                    <p className="text-[11px] text-slate-500">Cryptographic approval timestamp and QR hash generated.</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-900/40">
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    &bull; Status becomes: <strong>PUBLISHED</strong>
                  </span>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      Phase 3: Live Access
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Status: PUBLISHED</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Family Access &amp; Verification</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Parent (Alhaji Musa) and Student (Zainab Musa) immediately view the updated 96% Mathematics score,
                    Grade A, class rank, and download the official report card.
                  </p>
                  <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Public Validation:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">Official QR Code Active</p>
                    <p className="text-[11px] text-slate-500">Verifiable by tertiary schools or embassies at /verify.</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-900/40">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                    &bull; End-to-End Cycle: <strong>Fully Completed</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Test The Story Interactive Box */}
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Try This Live in 2 Minutes</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click below to switch to Teacher &bull; Enter scores &bull; Switch to Admin &bull; Approve &bull; Switch to Parent &bull; View report card.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRoleJump('TEACHER')}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF1313] hover:bg-[#D60A0A] text-white shadow-xs transition-colors cursor-pointer"
                >
                  Step 1: Start as Teacher &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: MATRIX */}
      {activeTab === 'MATRIX' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                  Master Role Permissions Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Side-by-side RBAC privilege comparison across all 4 portals.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {filteredMatrix.length} Operations Evaluated
              </span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">System Operation</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-[#FF1313]">Administrator</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-blue-500">Teacher</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-teal-600 dark:text-teal-400">Parent</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-purple-500">Student</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMatrix.map((item, mIdx) => (
                    <tr
                      key={mIdx}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{item.feature}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            item.admin.includes('Full') || item.admin.includes('Audit')
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.admin.includes('Full') || item.admin.includes('Audit') ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                          <span>{item.admin}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            item.teacher.includes('Assigned') || item.teacher.includes('Full')
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.teacher !== 'None' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>{item.teacher}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            item.parent.includes('Linked') || item.parent.includes('Full')
                              ? 'text-teal-600 dark:text-teal-400'
                              : item.parent.includes('Masked')
                              ? 'text-amber-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.parent !== 'None' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>{item.parent}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            item.student.includes('Self') || item.student.includes('Personal') || item.student.includes('Full')
                              ? 'text-purple-600 dark:text-purple-400'
                              : item.student.includes('Masked')
                              ? 'text-amber-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.student !== 'None' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>{item.student}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: SECURITY */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Anti-Tamper Security Architecture &amp; QR Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              How the Valencia SMS defends against grade alteration, URL manipulation, unauthorized access, and credential
              forgery.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1: QR Registry */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Public QR Registry (/verify)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every published report card generates a unique verification hash code. External verifiers (universities,
                  embassies, employers) can scan the QR code or enter the code at{' '}
                  <code className="font-mono font-bold text-emerald-700 dark:text-emerald-400">/verify</code> with zero login
                  credentials.
                </p>
                <div className="pt-2">
                  <Link
                    href="/verify"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <span>Open Public QR Registry</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feature 2: URL Tampering Protection */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">URL Tampering Defense</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The server evaluates <code className="font-mono font-bold">assertStudentAccess()</code> and{' '}
                  <code className="font-mono font-bold">assertClassAccess()</code> on every single request. If a parent or
                  teacher manipulates query IDs in the URL bar, the server immediately blocks the request and redirects them safely.
                </p>
                <div className="pt-2 text-xs text-slate-500 font-mono">
                  Test URL: /parent/results?studentId=std_ss3_1 &rarr; Redirects with Access Denied banner.
                </div>
              </div>

              {/* Feature 3: Moderation Masking */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy Guard (Score Masking)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Teacher Continuous Assessment and Exam scores remain strictly concealed under an{' '}
                  <strong>&ldquo;Awaiting Moderation&rdquo;</strong> badge until Dr. Valencia executes the publishing action. Families never
                  see unverified or preliminary calculations.
                </p>
              </div>

              {/* Feature 4: Session Security */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">HTTP-Only Server Sessions</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sessions are stored in server-side HTTP-only cookies with cryptographic base64 serialization, SameSite
                  protection, and automatic expiration. Client-side scripts cannot steal or tamper with the session payload.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
