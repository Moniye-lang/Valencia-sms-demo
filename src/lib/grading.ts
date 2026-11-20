// Pure grading calculation helper for client & server

export function calculateGrade(totalScore: number): {
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: 'Excellent' | 'Very Good' | 'Credit' | 'Pass' | 'Fail';
} {
  if (totalScore >= 75) return { grade: 'A', remark: 'Excellent' };
  if (totalScore >= 65) return { grade: 'B', remark: 'Very Good' };
  if (totalScore >= 50) return { grade: 'C', remark: 'Credit' };
  if (totalScore >= 40) return { grade: 'D', remark: 'Pass' };
  return { grade: 'F', remark: 'Fail' };
}
