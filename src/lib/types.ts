// Data Types for Valencia School Management System

export type Role = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

export type ResultStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export type FeeStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  associatedId?: string; // teacherId, parentId, or studentId
}

export interface User {
  id: string;
  email: string;
  password: string; // Plaintext or hashed for demo simplicity & verification
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  staffId: string;
  fullName: string;
  qualification: string;
  specialization: string;
  email: string;
  phone: string;
  assignedClassIds: string[];
  assignedSubjectIds: string[];
}

export interface Parent {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  childrenStudentIds: string[];
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "JSS 2A", "Primary 4B", "SS 1 Science"
  level: 'EARLY_YEARS' | 'NURSERY' | 'PRIMARY' | 'JSS' | 'SSS';
  arm: string;
  classTeacherId: string;
  roomNumber: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
}

export interface Student {
  id: string;
  userId: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  classId: string;
  parentId: string;
  photo?: string;
  emergencyContact?: string;
  stateOfOrigin?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface ResultRecord {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  session: string; // "2024/2025"
  term: '1st Term' | '2nd Term' | '3rd Term';
  caScore: number; // Continuous Assessment (max 40)
  examScore: number; // Examination (max 60)
  totalScore: number; // ca + exam (max 100)
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: 'Excellent' | 'Very Good' | 'Credit' | 'Pass' | 'Fail';
  status: ResultStatus;
  teacherId: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'TEACHERS' | 'PARENTS' | 'STUDENTS';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  authorName: string;
  createdAt: string;
  category: 'Academic' | 'Administrative' | 'Sports' | 'Event';
}

export interface FeeItem {
  description: string;
  amount: number;
}

export interface FeeStatement {
  id: string;
  studentId: string;
  session: string;
  term: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: FeeStatus;
  dueDate: string;
  items: FeeItem[];
  invoiceNumber: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  period: number;
  subjectName: string;
  teacherName: string;
  room: string;
}
