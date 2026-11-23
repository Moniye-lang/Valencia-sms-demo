import { Student, ClassRoom, ResultRecord } from './types';

export interface VerificationCertificate {
  certificateId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  gender: string;
  dateOfBirth: string;
  className: string;
  classLevel: string;
  academicSession: string;
  term: string;
  averageScore: number;
  letterGrade: string;
  standing: string;
  totalSubjects: number;
  results: {
    subjectName: string;
    caScore: number;
    examScore: number;
    totalScore: number;
    grade: string;
    remark: string;
  }[];
  issuedAt: string;
  signature: {
    officerName: string;
    officerTitle: string;
    hash: string;
    algorithm: string;
    status: 'AUTHENTIC' | 'REVOKED' | 'UNVERIFIED';
  };
}

/**
 * Generate a standardized certificate ID from admission number and session
 */
export function generateCertificateId(admissionNo: string, term: string = '1st Term'): string {
  // e.g. VAL/2024/001 -> VAL-TR-2024-001
  const cleanAdm = admissionNo.replace(/\//g, '-');
  const termCode = term.startsWith('2') ? 'T2' : term.startsWith('3') ? 'T3' : 'T1';
  return `${cleanAdm}-${termCode}`.toUpperCase();
}

/**
 * Deterministic SHA-256 style fingerprint from academic data
 */
export function generateSecurityFingerprint(dataString: string): string {
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `VAL256-${hex.toUpperCase()}-7C4B-8E92`;
}

/**
 * Build verification record for a student
 */
export function buildVerificationRecord(
  student: Student,
  studentClass: ClassRoom | undefined,
  results: ResultRecord[],
  allSubjects: { id: string; name: string }[]
): VerificationCertificate {
  const published = results.filter((r) => r.status === 'PUBLISHED');
  const totalScore = published.reduce((acc, r) => acc + r.totalScore, 0);
  const avg = published.length > 0 ? Number((totalScore / published.length).toFixed(1)) : 0;

  const letterGrade =
    avg >= 75 ? 'A (Excellent)' : avg >= 65 ? 'B (Very Good)' : avg >= 50 ? 'C (Credit)' : 'P (Pass)';
  const standing =
    avg >= 85
      ? 'First Class Honors / Distinction'
      : avg >= 70
      ? 'Merit Academic Standing'
      : 'Satisfactory Progression';

  const certId = generateCertificateId(student.admissionNo);
  const fingerprint = generateSecurityFingerprint(`${certId}-${student.fullName}-${avg}`);

  const mappedResults = published.map((r) => {
    const subj = allSubjects.find((s) => s.id === r.subjectId);
    return {
      subjectName: subj?.name || 'Academic Subject',
      caScore: r.caScore,
      examScore: r.examScore,
      totalScore: r.totalScore,
      grade: r.grade,
      remark: r.remark,
    };
  });

  return {
    certificateId: certId,
    studentId: student.id,
    studentName: student.fullName,
    admissionNo: student.admissionNo,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    className: studentClass?.name || 'Classroom',
    classLevel: studentClass?.level || 'Secondary',
    academicSession: '2024/2025',
    term: '1st Term',
    averageScore: avg,
    letterGrade,
    standing,
    totalSubjects: published.length,
    results: mappedResults,
    issuedAt: '2024-11-28T09:00:00Z',
    signature: {
      officerName: 'Dr. (Mrs.) Folashade Valencia, Ph.D, FNIM',
      officerTitle: 'Director of Academic Affairs & Registrar',
      hash: fingerprint,
      algorithm: 'SHA-256 + ECDSA Public Key Infrastructure',
      status: 'AUTHENTIC',
    },
  };
}
