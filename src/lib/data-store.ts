import fs from 'fs';
import path from 'path';
import {
  User,
  Teacher,
  Parent,
  Student,
  ClassRoom,
  Subject,
  AttendanceRecord,
  ResultRecord,
  Announcement,
  FeeStatement,
  TimetableSlot,
} from './types';
import { calculateGrade } from './grading';
export { calculateGrade };

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'valencia_db.json');

export interface DatabaseSchema {
  users: User[];
  teachers: Teacher[];
  parents: Parent[];
  students: Student[];
  classes: ClassRoom[];
  subjects: Subject[];
  attendances: AttendanceRecord[];
  results: ResultRecord[];
  announcements: Announcement[];
  fees: FeeStatement[];
  timetables: TimetableSlot[];
}

// 50 Nigerian first names & last names
const FIRST_NAMES_FEMALE = [
  'Zainab', 'Amina', 'Chioma', 'Fatima', 'Ngozi', 'Chidinma', 'Blessing', 'Mercy', 'Grace', 'Joy',
  'Esther', 'Faith', 'Miracle', 'Peace', 'Rejoice', 'Treasure', 'Bolanle', 'Favour', 'Precious', 'Goodness',
  'Yetunde', 'Folashade', 'Maryam', 'Halima', 'Aisha', 'Simisola', 'Olamide', 'Omotola', 'Damilola', 'Funmilayo'
];

const FIRST_NAMES_MALE = [
  'Chidi', 'Chukwudi', 'Oluwaseun', 'Emeka', 'Babatunde', 'Somtochukwu', 'Alabi', 'Danjuma', 'Efe', 'Kalu',
  'Sanusi', 'Adeyemi', 'Victor', 'Emmanuel', 'Samuel', 'David', 'Daniel', 'Joshua', 'Caleb', 'Michael',
  'Gabriel', 'Destiny', 'Promise', 'Prosper', 'Marvelous', 'Tunde', 'Kunle', 'Ifeanyi', 'Femi', 'Tochukwu'
];

const LAST_NAMES = [
  'Musa', 'Okafor', 'Adeleke', 'Bello', 'Balogun', 'Amadi', 'Eze', 'Danjuma', 'Chukwu', 'Sanusi',
  'Okonkwo', 'Adeyemi', 'Ibrahim', 'Nwosu', 'Alabi', 'Ojo', 'Lawal', 'Briggs', 'Nnamdi', 'Yusuf',
  'Salami', 'Ogbonna', 'Akintola', 'Momoh', 'Uche', 'Dauda', 'Tijani', 'Bassey', 'Henshaw', 'Giwa',
  'Mohammed', 'Oladipo', 'Igwe', 'Afolabi', 'Anikulapo', 'Sowore', 'Jibril', 'Garba', 'Okereke', 'Ekwueme',
  'Ubani', 'Martins', 'Agbaje', 'Fashola', 'Tinuke', 'Bamidele', 'Dokubo', 'Jumbo', 'Igbinedion', 'Osagie'
];

// All 16 Classes from Daycare to SS 3
export const ALL_CLASSES_CONFIG = [
  { id: 'cls_daycare', name: 'Daycare & Creche', level: 'EARLY_YEARS' as const, arm: 'Infants', room: 'Early Years Wing A1', prefix: 'DC', year: '2024', teacherId: 'tch_alao', fee: 220000 },
  { id: 'cls_playgroup', name: 'Playgroup', level: 'EARLY_YEARS' as const, arm: 'Teddies', room: 'Early Years Wing A2', prefix: 'PG', year: '2024', teacherId: 'tch_alao', fee: 240000 },
  { id: 'cls_nur1', name: 'Nursery 1', level: 'NURSERY' as const, arm: 'A', room: 'Kinder Block Room 1', prefix: 'NUR1', year: '2023', teacherId: 'tch_kalu', fee: 260000 },
  { id: 'cls_nur2', name: 'Nursery 2', level: 'NURSERY' as const, arm: 'A', room: 'Kinder Block Room 2', prefix: 'NUR2', year: '2023', teacherId: 'tch_kalu', fee: 260000 },
  { id: 'cls_pri1', name: 'Primary 1', level: 'PRIMARY' as const, arm: 'A', room: 'Junior Block Room 1', prefix: 'PRI1', year: '2022', teacherId: 'tch_nwachukwu', fee: 280000 },
  { id: 'cls_pri2', name: 'Primary 2', level: 'PRIMARY' as const, arm: 'A', room: 'Junior Block Room 2', prefix: 'PRI2', year: '2022', teacherId: 'tch_nwachukwu', fee: 280000 },
  { id: 'cls_pri3', name: 'Primary 3', level: 'PRIMARY' as const, arm: 'A', room: 'Junior Block Room 3', prefix: 'PRI3', year: '2021', teacherId: 'tch_nwachukwu', fee: 280000 },
  { id: 'cls_pri4a', name: 'Primary 4A', level: 'PRIMARY' as const, arm: 'A', room: 'Junior Block Room 12', prefix: 'PRI4', year: '2025', teacherId: 'tch_adeleke', fee: 280000 },
  { id: 'cls_pri5', name: 'Primary 5', level: 'PRIMARY' as const, arm: 'A', room: 'Junior Block Room 5', prefix: 'PRI5', year: '2020', teacherId: 'tch_nwachukwu', fee: 290000 },
  { id: 'cls_pri6', name: 'Primary 6', level: 'PRIMARY' as const, arm: 'A', room: 'Junior Block Room 6', prefix: 'PRI6', year: '2019', teacherId: 'tch_giwa', fee: 300000 },
  { id: 'cls_jss1', name: 'JSS 1', level: 'JSS' as const, arm: 'A', room: 'Block B Room 101', prefix: 'JSS1', year: '2024', teacherId: 'tch_giwa', fee: 345000 },
  { id: 'cls_jss2a', name: 'JSS 2A', level: 'JSS' as const, arm: 'A', room: 'Block B Room 204', prefix: 'JSS2', year: '2023', teacherId: 'tch_adeleke', fee: 345000 },
  { id: 'cls_jss3', name: 'JSS 3', level: 'JSS' as const, arm: 'A', room: 'Block B Room 301', prefix: 'JSS3', year: '2022', teacherId: 'tch_amadi', fee: 360000 },
  { id: 'cls_ss1sci', name: 'SS 1 Science', level: 'SSS' as const, arm: 'Science', room: 'Block C Lab Wing 101', prefix: 'SS1', year: '2022', teacherId: 'tch_adeleke', fee: 375000 },
  { id: 'cls_ss2', name: 'SS 2', level: 'SSS' as const, arm: 'Senior A', room: 'Block C Room 201', prefix: 'SS2', year: '2021', teacherId: 'tch_amadi', fee: 375000 },
  { id: 'cls_ss3', name: 'SS 3', level: 'SSS' as const, arm: 'Graduating', room: 'Executive Wing Room 301', prefix: 'SS3', year: '2020', teacherId: 'usr_admin', fee: 395000 },
];

function generateStudentsForClass(
  cfg: (typeof ALL_CLASSES_CONFIG)[0],
  count: number,
  primaryParentId: string
): { students: Student[]; users: User[]; fees: FeeStatement[] } {
  const students: Student[] = [];
  const users: User[] = [];
  const fees: FeeStatement[] = [];

  for (let i = 1; i <= count; i++) {
    const isFemale = i % 2 !== 0;
    const pool = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;

    // Preserve demo wards
    const firstName =
      i === 1 && cfg.id === 'cls_jss2a'
        ? 'Zainab'
        : i === 1 && cfg.id === 'cls_pri4a'
        ? 'Chidi'
        : pool[(i - 1) % pool.length];

    const lastName =
      i === 1 && (cfg.id === 'cls_jss2a' || cfg.id === 'cls_pri4a')
        ? 'Musa'
        : i === 2 && cfg.id === 'cls_jss2a'
        ? 'Okafor'
        : LAST_NAMES[(i - 1 + ALL_CLASSES_CONFIG.indexOf(cfg) * 3) % LAST_NAMES.length];

    const fullName = `${firstName} ${lastName}`;
    const studentId = `std_${cfg.id.replace('cls_', '')}_${i}`;
    const userId = `usr_${studentId}`;
    const admissionNo = `VAL/${cfg.prefix}/${i.toString().padStart(3, '0')}`;
    const parentId =
      i === 1 && (cfg.id === 'cls_jss2a' || cfg.id === 'cls_pri4a')
        ? primaryParentId
        : i === 2 && cfg.id === 'cls_jss2a'
        ? 'par_okafor'
        : primaryParentId;

    const email =
      i === 1 && cfg.id === 'cls_jss2a'
        ? 'student@valencia.edu.ng'
        : `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cfg.prefix.toLowerCase()}${i}@valencia.edu.ng`;

    users.push({
      id: userId,
      email,
      password: 'student123',
      name: fullName,
      role: 'STUDENT',
      createdAt: '2024-02-10T08:30:00Z',
    });

    students.push({
      id: studentId,
      userId,
      admissionNo,
      firstName,
      lastName,
      fullName,
      gender: isFemale ? 'Female' : 'Male',
      dateOfBirth: `201${1 + (i % 4)}-0${(i % 9) + 1}-${10 + (i % 18)}`,
      classId: cfg.id,
      parentId,
      emergencyContact: `+234 80${(i % 9) + 1} ${100 + i} ${2000 + i}`,
      stateOfOrigin:
        ['Lagos', 'Kano', 'Anambra', 'Ogun', 'Rivers', 'Kaduna', 'Oyo', 'Edo', 'Delta', 'Enugu'][i % 10] + ' State',
    });

    const isPaid = i % 3 !== 0;
    const billed = cfg.fee;
    const paid = isPaid ? billed : Math.round(billed * 0.6);
    const balance = billed - paid;

    fees.push({
      id: `fee_${studentId}`,
      studentId,
      session: '2024/2025',
      term: '1st Term',
      title: `${cfg.name} Comprehensive Term Fees`,
      totalAmount: billed,
      amountPaid: paid,
      balance,
      status: balance === 0 ? 'PAID' : 'PARTIAL',
      dueDate: '2024-09-30',
      invoiceNumber: `INV/2024/${admissionNo.replace(/\//g, '-')}`,
      items: [
        { description: 'Tuition & Instructional Materials', amount: Math.round(billed * 0.72) },
        { description: 'ICT, Coding, Robotics & Digital Learning', amount: 35000 },
        { description: 'Laboratories, Sports & Facilities', amount: 30000 },
        { description: 'PTA & Medical Development Levies', amount: Math.round(billed * 0.08) },
      ],
    });
  }

  return { students, users, fees };
}

function getInitialSeedData(): DatabaseSchema {
  const users: User[] = [
    {
      id: 'usr_admin',
      email: 'admin@valencia.edu.ng',
      password: 'admin123',
      name: 'Dr. (Mrs.) Folashade Valencia',
      role: 'ADMIN',
      phone: '+234 803 234 5678',
      createdAt: '2024-01-15T08:00:00Z',
    },
    {
      id: 'usr_teacher_1',
      email: 'teacher@valencia.edu.ng',
      password: 'teacher123',
      name: 'Mr. Babatunde Adeleke',
      role: 'TEACHER',
      phone: '+234 802 345 6789',
      createdAt: '2024-01-16T09:30:00Z',
    },
    {
      id: 'usr_teacher_2',
      email: 'mrs.amadi@valencia.edu.ng',
      password: 'teacher123',
      name: 'Mrs. Ngozi Amadi',
      role: 'TEACHER',
      phone: '+234 805 678 1234',
      createdAt: '2024-01-18T10:00:00Z',
    },
    {
      id: 'usr_teacher_3',
      email: 'mrs.alao@valencia.edu.ng',
      password: 'teacher123',
      name: 'Mrs. Funke Alao',
      role: 'TEACHER',
      phone: '+234 806 123 4567',
      createdAt: '2024-01-19T08:00:00Z',
    },
    {
      id: 'usr_teacher_4',
      email: 'miss.kalu@valencia.edu.ng',
      password: 'teacher123',
      name: 'Miss Chidinma Kalu',
      role: 'TEACHER',
      phone: '+234 807 234 5678',
      createdAt: '2024-01-20T08:00:00Z',
    },
    {
      id: 'usr_teacher_5',
      email: 'mr.nwachukwu@valencia.edu.ng',
      password: 'teacher123',
      name: 'Mr. Jude Nwachukwu',
      role: 'TEACHER',
      phone: '+234 808 345 6789',
      createdAt: '2024-01-21T08:00:00Z',
    },
    {
      id: 'usr_teacher_6',
      email: 'mr.giwa@valencia.edu.ng',
      password: 'teacher123',
      name: 'Mr. Sunday Giwa',
      role: 'TEACHER',
      phone: '+234 809 456 7890',
      createdAt: '2024-01-22T08:00:00Z',
    },
    {
      id: 'usr_parent_1',
      email: 'parent@valencia.edu.ng',
      password: 'parent123',
      name: 'Alhaji Ibrahim Musa',
      role: 'PARENT',
      phone: '+234 809 456 7890',
      createdAt: '2024-02-01T11:15:00Z',
    },
    {
      id: 'usr_parent_2',
      email: 'dr.okafor@valencia.edu.ng',
      password: 'parent123',
      name: 'Dr. Emeka Okafor',
      role: 'PARENT',
      phone: '+234 807 890 1234',
      createdAt: '2024-02-03T14:20:00Z',
    },
  ];

  const classes: ClassRoom[] = ALL_CLASSES_CONFIG.map((c) => ({
    id: c.id,
    name: c.name,
    level: c.level,
    arm: c.arm,
    classTeacherId: c.teacherId,
    roomNumber: c.room,
  }));

  const teachers: Teacher[] = [
    {
      id: 'tch_adeleke',
      userId: 'usr_teacher_1',
      staffId: 'VAL/STF/2019/014',
      fullName: 'Mr. Babatunde Adeleke',
      qualification: 'B.Sc. (Ed) Mathematics, UNILAG',
      specialization: 'Pure Mathematics & Further Maths',
      email: 'teacher@valencia.edu.ng',
      phone: '+234 802 345 6789',
      assignedClassIds: ['cls_jss2a', 'cls_ss1sci', 'cls_pri4a', 'cls_ss2'],
      assignedSubjectIds: ['subj_math_jss2', 'subj_math_ss1', 'subj_math_pri4'],
    },
    {
      id: 'tch_amadi',
      userId: 'usr_teacher_2',
      staffId: 'VAL/STF/2021/042',
      fullName: 'Mrs. Ngozi Amadi',
      qualification: 'B.A. (Ed) English Language, UNN',
      specialization: 'English Grammar & Literature',
      email: 'mrs.amadi@valencia.edu.ng',
      phone: '+234 805 678 1234',
      assignedClassIds: ['cls_jss2a', 'cls_jss3', 'cls_ss1sci', 'cls_ss2'],
      assignedSubjectIds: ['subj_eng_jss2', 'subj_eng_jss3', 'subj_eng_ss1'],
    },
    {
      id: 'tch_alao',
      userId: 'usr_teacher_3',
      staffId: 'VAL/STF/2020/008',
      fullName: 'Mrs. Funke Alao',
      qualification: 'B.Ed Early Childhood Education, OAU',
      specialization: 'Early Childhood & Montessori Play',
      email: 'mrs.alao@valencia.edu.ng',
      phone: '+234 806 123 4567',
      assignedClassIds: ['cls_daycare', 'cls_playgroup'],
      assignedSubjectIds: ['subj_ey_sensory', 'subj_ey_phonics'],
    },
    {
      id: 'tch_kalu',
      userId: 'usr_teacher_4',
      staffId: 'VAL/STF/2022/019',
      fullName: 'Miss Chidinma Kalu',
      qualification: 'B.Sc (Ed) Elementary Education, UNIBEN',
      specialization: 'Nursery Phonics & Numeracy',
      email: 'miss.kalu@valencia.edu.ng',
      phone: '+234 807 234 5678',
      assignedClassIds: ['cls_nur1', 'cls_nur2'],
      assignedSubjectIds: ['subj_nur_letter', 'subj_nur_number'],
    },
    {
      id: 'tch_nwachukwu',
      userId: 'usr_teacher_5',
      staffId: 'VAL/STF/2018/005',
      fullName: 'Mr. Jude Nwachukwu',
      qualification: 'B.Sc Basic Science & Tech, UI',
      specialization: 'Primary Science & Quantitative Reasoning',
      email: 'mr.nwachukwu@valencia.edu.ng',
      phone: '+234 808 345 6789',
      assignedClassIds: ['cls_pri1', 'cls_pri2', 'cls_pri3', 'cls_pri5'],
      assignedSubjectIds: ['subj_pri_sci', 'subj_pri_math'],
    },
    {
      id: 'tch_giwa',
      userId: 'usr_teacher_6',
      staffId: 'VAL/STF/2017/003',
      fullName: 'Mr. Sunday Giwa',
      qualification: 'B.A History & Civic Studies, LASU',
      specialization: 'Civic Education & Social Studies',
      email: 'mr.giwa@valencia.edu.ng',
      phone: '+234 809 456 7890',
      assignedClassIds: ['cls_pri6', 'cls_jss1', 'cls_ss3'],
      assignedSubjectIds: ['subj_jss_civic', 'subj_sss_econ'],
    },
  ];

  const parents: Parent[] = [
    {
      id: 'par_musa',
      userId: 'usr_parent_1',
      fullName: 'Alhaji Ibrahim Musa',
      email: 'parent@valencia.edu.ng',
      phone: '+234 809 456 7890',
      address: 'Plot 14, Victoria Garden Estate, Lekki, Lagos',
      occupation: 'Chief Executive Officer, Musa Logistics Ltd',
      childrenStudentIds: ['std_jss2a_1', 'std_pri4a_1'],
    },
    {
      id: 'par_okafor',
      userId: 'usr_parent_2',
      fullName: 'Dr. Emeka Okafor',
      email: 'dr.okafor@valencia.edu.ng',
      phone: '+234 807 890 1234',
      address: '22 Admiralty Way, Lekki Phase 1, Lagos',
      occupation: 'Consultant Orthopedic Surgeon',
      childrenStudentIds: ['std_jss2a_2'],
    },
  ];

  // Generate 50 students for EVERY class from Daycare to SS3! (16 classes x 50 = 800 students)
  const allStudents: Student[] = [];
  const allUsers: User[] = [...users];
  const allFees: FeeStatement[] = [];

  for (const cfg of ALL_CLASSES_CONFIG) {
    const classGen = generateStudentsForClass(cfg, 50, 'par_musa');
    allStudents.push(...classGen.students);
    allUsers.push(...classGen.users);
    allFees.push(...classGen.fees);
  }

  const subjects: Subject[] = [
    // Early Years
    { id: 'subj_ey_sensory', name: 'Sensory Play & Motor Skills', code: 'EY-101', classId: 'cls_daycare', teacherId: 'tch_alao' },
    { id: 'subj_ey_phonics', name: 'Phonics & Rhymes', code: 'EY-102', classId: 'cls_playgroup', teacherId: 'tch_alao' },
    // Nursery
    { id: 'subj_nur_letter', name: 'Letter Work & Handwriting', code: 'NUR-201', classId: 'cls_nur1', teacherId: 'tch_kalu' },
    { id: 'subj_nur_number', name: 'Number Work & Concepts', code: 'NUR-202', classId: 'cls_nur2', teacherId: 'tch_kalu' },
    // Primary
    { id: 'subj_math_pri4', name: 'Primary Mathematics', code: 'MTH-P4', classId: 'cls_pri4a', teacherId: 'tch_adeleke' },
    { id: 'subj_pri_sci', name: 'Basic Science & Nature', code: 'SCI-P1', classId: 'cls_pri1', teacherId: 'tch_nwachukwu' },
    { id: 'subj_pri_math', name: 'Primary Mathematics', code: 'MTH-P2', classId: 'cls_pri2', teacherId: 'tch_nwachukwu' },
    // JSS 2A Demo Subjects
    { id: 'subj_math_jss2', name: 'Mathematics', code: 'MTH-201', classId: 'cls_jss2a', teacherId: 'tch_adeleke' },
    { id: 'subj_eng_jss2', name: 'English Studies', code: 'ENG-201', classId: 'cls_jss2a', teacherId: 'tch_amadi' },
    { id: 'subj_sci_jss2', name: 'Basic Science & Tech', code: 'BST-201', classId: 'cls_jss2a', teacherId: 'tch_adeleke' },
    { id: 'subj_jss_civic', name: 'Civic Education', code: 'CIV-101', classId: 'cls_jss1', teacherId: 'tch_giwa' },
    // SSS
    { id: 'subj_math_ss1', name: 'General Mathematics', code: 'MTH-301', classId: 'cls_ss1sci', teacherId: 'tch_adeleke' },
    { id: 'subj_eng_ss1', name: 'English Language', code: 'ENG-301', classId: 'cls_ss1sci', teacherId: 'tch_amadi' },
    { id: 'subj_sss_econ', name: 'Economics', code: 'ECN-301', classId: 'cls_ss3', teacherId: 'tch_giwa' },
  ];

  // Generate scores for JSS 2A
  const results: ResultRecord[] = [];
  const jss2Students = allStudents.filter((s) => s.classId === 'cls_jss2a');

  // English Studies (50 students published)
  jss2Students.forEach((st, idx) => {
    const ca = Math.min(40, 28 + (idx % 12));
    const exam = Math.min(60, 42 + (idx % 18));
    const total = ca + exam;
    const { grade, remark } = calculateGrade(total);

    results.push({
      id: `res_eng_${st.id}`,
      studentId: st.id,
      subjectId: 'subj_eng_jss2',
      classId: 'cls_jss2a',
      session: '2024/2025',
      term: '1st Term',
      caScore: ca,
      examScore: exam,
      totalScore: total,
      grade,
      remark,
      status: 'PUBLISHED',
      teacherId: 'tch_amadi',
      approvedBy: 'Dr. (Mrs.) Folashade Valencia',
      approvedAt: '2024-11-20T14:00:00Z',
      publishedAt: '2024-11-20T14:30:00Z',
      updatedAt: '2024-11-20T14:30:00Z',
    });
  });

  // Mathematics for JSS 2A: 50 students in DRAFT for Mr. Adeleke's demo
  jss2Students.forEach((st, idx) => {
    const ca = idx === 0 ? 38 : Math.min(40, 24 + ((idx * 7) % 16));
    const exam = idx === 0 ? 58 : Math.min(60, 36 + ((idx * 11) % 24));
    const total = ca + exam;
    const { grade, remark } = calculateGrade(total);

    results.push({
      id: `res_math_${st.id}`,
      studentId: st.id,
      subjectId: 'subj_math_jss2',
      classId: 'cls_jss2a',
      session: '2024/2025',
      term: '1st Term',
      caScore: ca,
      examScore: exam,
      totalScore: total,
      grade,
      remark,
      status: 'DRAFT',
      teacherId: 'tch_adeleke',
      updatedAt: '2024-11-22T10:00:00Z',
    });
  });

  // Attendance for JSS 2A
  const attendances: AttendanceRecord[] = [];
  const dates = ['2024-11-25', '2024-11-26', '2024-11-27'];

  dates.forEach((date) => {
    jss2Students.forEach((st, idx) => {
      const isLate = idx === 4 || idx === 19;
      const isAbsent = idx === 12 || idx === 37;
      const status = isAbsent ? 'ABSENT' : isLate ? 'LATE' : 'PRESENT';

      attendances.push({
        id: `att_${st.id}_${date}`,
        studentId: st.id,
        classId: 'cls_jss2a',
        date,
        status,
        remarks: isLate ? 'Traffic hold-up' : isAbsent ? 'Medical leave' : undefined,
      });
    });
  });

  const announcements: Announcement[] = [
    {
      id: 'anc_1',
      title: 'First Term 2024/2025 Mid-Term Break Notice',
      content:
        'All parents and students from Daycare to SS 3 are hereby informed that the mid-term break commences on Friday 1st November and resumes on Monday 4th November.',
      targetAudience: 'ALL',
      priority: 'HIGH',
      authorName: 'Dr. (Mrs.) Folashade Valencia (Principal)',
      createdAt: '2024-10-25T09:00:00Z',
      category: 'Academic',
    },
    {
      id: 'anc_2',
      title: 'Teacher Score Entry Deadline across Early Years, Primary, JSS & SSS',
      content:
        'All subject teachers are reminded that continuous assessment and exam score portals will be locked on Friday 29th November for administrative verification.',
      targetAudience: 'TEACHERS',
      priority: 'URGENT',
      authorName: 'Academic Directorate',
      createdAt: '2024-11-15T11:00:00Z',
      category: 'Administrative',
    },
    {
      id: 'anc_3',
      title: 'Annual Inter-House Athletics Championship 2024',
      content:
        'Inter-House Sports heats will commence next Wednesday. Blue, Gold, Emerald, and Sapphire house masters should ensure athlete kits are verified.',
      targetAudience: 'ALL',
      priority: 'NORMAL',
      authorName: 'Sports Department',
      createdAt: '2024-11-18T15:30:00Z',
      category: 'Sports',
    },
    {
      id: 'anc_4',
      title: 'Parent-Teacher Association (PTA) General Meeting',
      content:
        'The termly PTA interactive session is scheduled for Saturday 7th December at 10:00 AM prompt in the Valencia Multipurpose Hall.',
      targetAudience: 'PARENTS',
      priority: 'HIGH',
      authorName: 'PTA Executive Secretariat',
      createdAt: '2024-11-20T08:00:00Z',
      category: 'Event',
    },
  ];

  const PERIODS_DEF = [
    { period: 1, time: '08:00 - 08:45 AM' },
    { period: 2, time: '08:45 - 09:30 AM' },
    { period: 3, time: '09:30 - 10:15 AM' },
    { period: 4, time: '10:45 - 11:30 AM' },
    { period: 5, time: '11:30 - 12:15 PM' },
    { period: 6, time: '01:00 - 01:45 PM' },
    { period: 7, time: '01:45 - 02:30 PM' },
  ];

  const SCHEDULE_MAP: Record<string, { subject: string; teacher: string; room: string }[]> = {
    Monday: [
      { subject: 'Mathematics', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'Mathematics', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'English Studies', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Basic Science & Tech', teacher: 'Mr. Babatunde Adeleke', room: 'Science Lab 2' },
      { subject: 'Computer Studies / ICT', teacher: 'Engr. D. Balogun', room: 'ICT Hub' },
      { subject: 'Social Studies', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Physical & Health Edu', teacher: 'Coach K. Eze', room: 'Sports Complex' },
    ],
    Tuesday: [
      { subject: 'English Studies', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Mathematics', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'Business Studies', teacher: 'Mr. O. Salami', room: 'Room 204' },
      { subject: 'Civic Education', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Agricultural Science', teacher: 'Mr. Babatunde Adeleke', room: 'School Farm' },
      { subject: 'French Language', teacher: 'Mme. C. Bello', room: 'Language Lab' },
      { subject: 'Cultural & Creative Arts', teacher: 'Mr. T. Alabi', room: 'Art Studio' },
    ],
    Wednesday: [
      { subject: 'Civic Education', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Basic Science & Tech', teacher: 'Mr. Babatunde Adeleke', room: 'Science Lab 2' },
      { subject: 'Mathematics', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'English Literature', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Computer Studies / ICT', teacher: 'Engr. D. Balogun', room: 'ICT Hub' },
      { subject: 'Religious Studies (CRS/IRS)', teacher: 'Pastor David / Ustaz Bello', room: 'Room 204' },
      { subject: 'Library & Reading Period', teacher: 'Mrs. M. Ubani', room: 'Central Library' },
    ],
    Thursday: [
      { subject: 'Basic Science & Tech', teacher: 'Mr. Babatunde Adeleke', room: 'Science Lab 2' },
      { subject: 'English Studies', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Mathematics', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'Agricultural Science', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'Social Studies', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Business Studies', teacher: 'Mr. O. Salami', room: 'Room 204' },
      { subject: 'Nigerian Languages (Yoruba/Igbo/Hausa)', teacher: 'Language Dept', room: 'Room 204' },
    ],
    Friday: [
      { subject: 'Agricultural Science', teacher: 'Mr. Babatunde Adeleke', room: 'School Farm' },
      { subject: 'Mathematics', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
      { subject: 'English Studies', teacher: 'Mrs. Ngozi Amadi', room: 'Room 204' },
      { subject: 'Physical & Health Edu', teacher: 'Coach K. Eze', room: 'Sports Field' },
      { subject: 'Music & Performing Arts', teacher: 'Mr. T. Alabi', room: 'Music Hall' },
      { subject: 'Clubs & Societies (Jets / Debate / Red Cross)', teacher: 'Faculty Patrons', room: 'Activity Wing' },
      { subject: 'Weekly Homeroom Review', teacher: 'Mr. Babatunde Adeleke', room: 'Room 204' },
    ],
  };

  const timetables: TimetableSlot[] = [];
  let ttCounter = 1;

  for (const [day, slots] of Object.entries(SCHEDULE_MAP)) {
    slots.forEach((s, idx) => {
      const p = PERIODS_DEF[idx];
      timetables.push({
        id: `tt_${ttCounter++}`,
        classId: 'cls_jss2a',
        day: day as any,
        time: p.time,
        period: p.period,
        subjectName: s.subject,
        teacherName: s.teacher,
        room: s.room,
      });
    });
  }

  return {
    users: allUsers,
    teachers,
    parents,
    students: allStudents,
    classes,
    subjects,
    attendances,
    results,
    announcements,
    fees: allFees,
    timetables,
  };
}

let memoryDb: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure dataset has all 16 classes and ~800 students
      if (parsed.classes && parsed.classes.length >= 16 && parsed.students && parsed.students.length >= 700) {
        memoryDb = parsed;
        return memoryDb!;
      }
    }
  } catch (err) {
    console.error('Failed reading database file, using fresh seed:', err);
  }

  // Seed with all 16 classes (Daycare to SS3) & 800 students
  memoryDb = getInitialSeedData();
  saveDatabase(memoryDb);
  return memoryDb;
}

export function saveDatabase(db: DatabaseSchema): void {
  try {
    memoryDb = db;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

export function resetDatabaseToSeed(): DatabaseSchema {
  memoryDb = getInitialSeedData();
  saveDatabase(memoryDb);
  return memoryDb;
}
