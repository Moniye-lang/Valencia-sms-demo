# Valencia School Management System: Comprehensive Roles & Operations Manual

> **Official Operating Manual & Role-Based Access Control (RBAC) Specification**  
> *Valencia Schools Lagos &bull; Daycare through Senior Secondary (SS 3) &bull; 800 Enrolled Students*

---

## Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Quick Reference & Demo Credentials](#2-quick-reference--demo-credentials)
3. [Administrator Role Manual](#3-administrator-role-manual)
4. [Teacher Role Manual](#4-teacher-role-manual)
5. [Parent & Guardian Role Manual](#5-parent--guardian-role-manual)
6. [Student Role Manual](#6-student-role-manual)
7. [Master Role Permissions Matrix](#7-master-role-permissions-matrix)
8. [End-to-End Term Result Workflow](#8-end-to-end-term-result-workflow)
9. [Anti-Tamper Security & Public Verification Registry](#9-anti-tamper-security--public-verification-registry)
10. [Troubleshooting & Frequently Asked Questions](#10-troubleshooting--frequently-asked-questions)

---

## 1. System Overview & Architecture

The **Valencia School Management System (SMS)** is an enterprise-grade multi-portal academic platform servicing Valencia Schools Lagos. It provides role-tailored dashboards and workflows spanning the entire institutional spectrum:

- **Early Years & Nursery Section (200 Students)**: Daycare & Creche, Playgroup, Nursery 1, Nursery 2 (50 students per arm).
- **Primary Section (300 Students)**: Primary 1 through Primary 6 (50 students per arm).
- **Junior Secondary School (150 Students)**: JSS 1, JSS 2A, JSS 3 (50 students per arm).
- **Senior Secondary School (150 Students)**: SS 1 Science, SS 2, SS 3 (50 students per arm).
- **Total Student Population**: 800 actively enrolled students across 16 classroom arms.
- **Faculty & Staff**: 48 teachers and administrators.

### Core Architectural Principles
1. **Hardened Role Boundaries (RBAC)**: Authentication is verified on the server via HTTP-only cryptographic session cookies. Users cannot access unauthorized classrooms, students, or administrative routes by manipulating URLs or parameters.
2. **End-to-End Moderation**: Continuous Assessment (CA) and Examination marks entered by teachers remain strictly hidden from students and parents until reviewed and formally approved by the school administrator.
3. **Anti-Tamper Verification**: Approved results and certificates are stamped with a cryptographic hash and an official QR code verifiable by third parties without logging in.

---

## 2. Quick Reference & Demo Credentials

For rapid demonstration and evaluation, the system includes pre-configured accounts representing each key persona:

| Role | Persona Name | Email | Password | Scope of Authority |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Dr. (Mrs.) Folashade Valencia | `admin@valencia.edu.ng` | `admin123` | Institutional oversight (Daycare &rarr; SS 3, 800 students, all 16 arms, 48 staff) |
| **TEACHER** | Mr. Babatunde Adeleke | `teacher@valencia.edu.ng` | `teacher123` | Assigned classes only (JSS 2A & SS 1 Science Mathematics, 100 students) |
| **PARENT** | Alhaji Ibrahim Musa | `parent@valencia.edu.ng` | `parent123` | Linked biological wards only: Zainab Musa (JSS 2A) & Chidi Musa (Primary 4A) |
| **STUDENT** | Zainab Musa | `student@valencia.edu.ng` | `student123` | Personal profile, JSS 2A transcript, and weekly timetable only |

> [!TIP]
> **1-Click Demo Switcher**: When logged into any portal, use the top **Demo Role Switcher Bar** to jump between Admin, Teacher, Parent, and Student in real time without entering passwords.

---

## 3. Administrator Role Manual

### 3.1 Role Scope & Mission
The **Administrator** holds full institutional authority. The administrator governs enrollment, oversees faculty, audits attendance across all 16 arms, broadcasts school-wide notices, and serves as the sole publishing authority for official term results.

### 3.2 Key Navigation Routes
- `/admin` &ndash; Executive Dashboard & Institutional KPIs
- `/admin/results` &ndash; Result Approvals & Moderation Queue
- `/admin/students` &ndash; Student Directory (800 Students)
- `/admin/staff` &ndash; Faculty & Staff Directory (48 Members)
- `/admin/announcements` &ndash; School Bulletins & Notice Broadcaster
- `/manual` &ndash; Interactive System & Roles Manual

---

### 3.3 How to Use the Admin Portal

#### A. Monitoring the Executive Dashboard (`/admin`)
1. Log in with admin credentials (`admin@valencia.edu.ng`).
2. Review the four primary KPI metrics:
   - **Total Students Enrolled**: 800 students.
   - **Classroom Arms**: 16 arms (Daycare to SS 3).
   - **Academic & Support Staff**: 48 faculty members.
   - **Term Attendance Rate**: Real-time average across all arms (e.g. 96.2%).
3. Inspect the **Pending Moderations Banner**: Displays how many subject result sheets are awaiting executive approval.
4. Review recent institutional activity and enrollment breakdowns by school section (Early Years, Primary, JSS, SSS).

#### B. Moderating and Publishing Academic Results (`/admin/results`)
1. Click **Result Approvals** in the sidebar.
2. Filter the queue by **Academic Section** (e.g. Junior Secondary) or **Class** (e.g. JSS 2A).
3. Select a subject sheet (e.g. **JSS 2A &bull; Mathematics** submitted by Mr. Babatunde Adeleke).
4. Review the status badge:
   - `DRAFT`: Teacher is still entering scores; cannot be approved yet.
   - `PENDING_APPROVAL`: Teacher has finalized and submitted the batch; ready for review.
   - `PUBLISHED`: Scores have been approved and are visible to parents and students.
5. In the 50-student review table:
   - Inspect individual **CA Scores (out of 40)** and **Exam Scores (out of 60)**.
   - Verify the auto-computed total, letter grade (A&ndash;F), and remark.
   - Check the overall class average and distribution of distinctions.
6. **To Approve & Publish**: Click the wine-red button: **Approve & Publish All 50 Now**.
   - *Outcome*: The entire batch is locked, stamped with an executive approval timestamp, and instantly published. Parents and students can now view the results and download certified report cards.
7. **To Request Revision**: If errors are identified, enter a moderation note and click **Return for Revision**.
   - *Outcome*: Status reverts to `DRAFT` and is sent back to the subject teacher with revision notes.

#### C. Managing the Student Directory (`/admin/students`)
1. Click **Student Directory** in the sidebar.
2. Use the section tabs to toggle between **Early Years & Nursery**, **Primary**, **Junior Secondary**, and **Senior Secondary**.
3. Use the real-time search bar to look up any student by name (e.g., *"Zainab Musa"*) or admission number (e.g., `VAL/2024/JSS2/001`).
4. Click on any student row to view full profile details, guardian contact numbers, residential address, class placement, and current fee clearance status.

#### D. Auditing Faculty & Staff (`/admin/staff`)
1. Click **Staff & Roles** in the sidebar.
2. Search through the 48 academic and administrative staff members.
3. Review their staff ID, educational qualifications, department specializations, and assigned teaching classes.

#### E. Broadcasting Announcements (`/admin/announcements`)
1. Click **Announcements** in the sidebar.
2. Click **Create Announcement**.
3. Enter the notice title, category (Academic, Administrative, Event, Sports), and priority level (Normal, High, Urgent).
4. Select the target audience:
   - `ALL` &ndash; Displays across Admin, Teacher, Parent, and Student portals.
   - `PARENTS` &ndash; Visible only within the Parent Portal.
   - `TEACHERS` &ndash; Visible only to faculty.
   - `STUDENTS` &ndash; Appears on student dashboards.
5. Publish the notice. It appears immediately in the respective portal feeds.

---

### 3.4 Admin Access Boundaries & Security Rules
- **Full Oversight**: The admin has read/write authority across all classrooms, students, staff, and records.
- **Publishing Exclusivity**: Only administrators can transition results from `PENDING_APPROVAL` to `PUBLISHED`. Teachers cannot self-publish.

---

## 4. Teacher Role Manual

### 4.1 Role Scope & Mission
The **Teacher** is responsible for curriculum delivery, Continuous Assessment (CA) tracking, examination score entry, and daily attendance register management for their specifically assigned classes and subjects.

### 4.2 Key Navigation Routes
- `/teacher` &ndash; Teacher Dashboard & Pending Tasks
- `/teacher/classes` &ndash; My Assigned Classes & Subject Registers
- `/teacher/scores` &ndash; Score Entry, Auto-Calculation & Batch Submission
- `/teacher/attendance` &ndash; Daily Classroom Attendance Roll Call
- `/manual` &ndash; Interactive System & Roles Manual

---

### 4.3 How to Use the Teacher Portal

#### A. Navigating the Teacher Dashboard (`/teacher`)
1. Log in with teacher credentials (`teacher@valencia.edu.ng`).
2. View your assigned teaching schedule:
   - **Mr. Babatunde Adeleke**: Assigned to **JSS 2A Mathematics** (50 students) and **SS 1 Science Mathematics** (50 students).
3. Check the **Action Required** card: shows pending score entry deadlines and unsubmitted attendance registers.

#### B. Entering Scores & Submitting for Approval (`/teacher/scores`)
1. Click **Score Entry & Submit** in the sidebar.
2. Select the target class and subject:
   - Class: **JSS 2A**
   - Subject: **Mathematics**
   - Session & Term: **2024/2025 &bull; 1st Term**
3. Review the 50-student class roster:
   - Columns: Admission No, Student Name, CA Score (Max 40), Exam Score (Max 60), Total Score (100), Grade, Remark, Status.
4. **Manual Entry**: Click any CA or Exam input field to update scores.
   - The total score, letter grade, and remark update instantly in real time.
5. **Demo Accelerator**: Click **Auto-Fill Sample Scores** to simulate realistic academic performance across all 50 students in a single click.
6. Verify student marks (e.g. search for **Zainab Musa**; verify CA: 38, Exam: 58 &rarr; Total: 96, Grade A, Remark: Excellent).
7. **Submit Batch for Approval**: Click the prominent wine-red button: **Submit All 50 Scores for Approval**.
   - *Outcome*: The entire class batch transitions from `DRAFT` to `PENDING_APPROVAL`.
   - *Security Lock*: Once submitted, score inputs lock to prevent accidental edits while awaiting executive review.

#### C. Taking Daily Attendance (`/teacher/attendance`)
1. Click **Daily Attendance** in the sidebar.
2. Select your assigned classroom (e.g. JSS 2A).
3. The register defaults all 50 students to `PRESENT`.
4. Click individual status pills to mark students as `ABSENT` or `LATE`.
5. Click **Save Attendance Register**.
   - *Outcome*: Attendance percentages and records update immediately across parent and administrative portals.

---

### 4.4 Teacher Access Boundaries & Security Rules
- **Class Isolation**: A teacher can *only* access classes and subjects formally assigned to them by the administration.
- **Tampering Blocked**: If a teacher attempts to access an unauthorized class URL (e.g., `/teacher/scores?classId=cls_pri_1`), the server evaluates `assertClassAccess()`, rejects the request, and redirects them to their dashboard with an **Access Denied** alert.
- **No Self-Publishing**: Teachers can submit scores for moderation, but cannot bypass executive approval to publish results directly.

---

## 5. Parent & Guardian Role Manual

### 5.1 Role Scope & Mission
The **Parent / Guardian** portal provides families with transparent, secure visibility into their enrolled wards' academic performance, attendance records, school notices, and itemized term fee statements.

### 5.2 Key Navigation Routes
- `/parent` &ndash; Parent Portal Overview & Ward Switcher
- `/parent/results` &ndash; Official Report Cards & Academic Performance
- `/parent/attendance` &ndash; Attendance History & Register Records
- `/parent/fees` &ndash; Itemized Term Fee Statements & Receipts
- `/manual` &ndash; Interactive System & Roles Manual

---

### 5.3 How to Use the Parent Portal

#### A. Switching Between Multiple Wards (`/parent`)
1. Log in with parent credentials (`parent@valencia.edu.ng`).
2. Notice the **Ward Switcher** card at the top:
   - **Alhaji Ibrahim Musa** has two children enrolled at Valencia Schools:
     1. **Zainab Musa** &ndash; Junior Secondary (JSS 2A)
     2. **Chidi Musa** &ndash; Primary Section (Primary 4A)
3. Click either child's tab to switch the active context.
   - All dashboard metrics, report cards, attendance records, and fee balances immediately update to the selected ward.

#### B. Viewing Academic Report Cards (`/parent/results`)
1. Click **Report Cards & Results** in the sidebar.
2. Select the academic session and term (e.g. 2024/2025 &bull; 1st Term).
3. **Published Results**:
   - For subjects approved by the admin (e.g. Mathematics), view the full breakdown: Continuous Assessment (40), Exam (60), Total (100), Letter Grade, Class Position, and Principal/Teacher remarks.
4. **Moderation Concealment (Privacy Guard)**:
   - If a teacher has entered draft scores that the administrator has not yet published, the subject is safely masked with a status badge: `Awaiting Moderation`. Unapproved scores are never leaked to families.
5. **Print / Export Official Report Card**:
   - Click **Print Official Report Card**.
   - The report card renders an official print-optimized layout complete with the Valencia Schools seal and a cryptographic **Anti-Tamper QR Verification Code**.

#### C. Reviewing Attendance Records (`/parent/attendance`)
1. Click **Attendance Records** in the sidebar.
2. View your ward's overall attendance rate (e.g. 98.4%), total school days, days present, and excused absences.
3. Review the monthly calendar log to verify punctuality.

#### D. Inspecting Term Fee Statements (`/parent/fees`)
1. Click **Term Fee Statements** in the sidebar.
2. Inspect the itemized tuition schedule:
   - Tuition Fee, ICT Levy, Science & Computer Labs, Sports & Library dues.
3. Review total assessed fees, amount paid, and outstanding balance.
4. Check payment status (`PAID`, `PARTIAL`, or `UNPAID`) and transaction receipt reference numbers.

---

### 5.4 Parent Access Boundaries & Security Rules
- **Biological Ward Restriction**: Parents can only access records for their verified linked children.
- **URL Tampering Protection**: If a parent attempts to manipulate the URL query to inspect an unlinked student (e.g. `http://localhost:3000/parent/results?studentId=std_ss3_1`), the server executes `assertStudentAccess()`, intercepts the intrusion, and redirects the parent back to their own child with an explicit security alert banner.

---

## 6. Student Role Manual

### 6.1 Role Scope & Mission
The **Student** portal empowers learners to monitor their personal academic trajectory, inspect published results, access their weekly class timetable, and view official school announcements.

### 6.2 Key Navigation Routes
- `/student` &ndash; Student Profile & Academic Summary
- `/student/results` &ndash; Published Term Results & Transcripts
- `/student/timetable` &ndash; Weekly Class Timetable (Monday&ndash;Friday)
- `/student/announcements` &ndash; School Notices & Examination Bulletins
- `/manual` &ndash; Interactive System & Roles Manual

---

### 6.3 How to Use the Student Portal

#### A. Checking Personal Academic Profile (`/student`)
1. Log in with student credentials (`student@valencia.edu.ng`).
2. Review your verified student profile:
   - Name: **Zainab Musa**
   - Admission No: `VAL/2024/JSS2/001`
   - Class Arm: **JSS 2A**
   - House: **Topaz House (Yellow)**
   - Cumulative Grade Point Average & Standing.

#### B. Accessing Term Results & Digital Transcript (`/student/results`)
1. Click **Academic Results** in the sidebar.
2. View subject performance breakdown, scores, grades, and teacher remarks.
3. Inspect the digital transcript badge with the anti-tamper verification seal.
4. Scan the on-screen QR code or copy the verification code to validate the transcript on the public verification portal.

#### C. Inspecting the Weekly Timetable (`/student/timetable`)
1. Click **Weekly Timetable** in the sidebar.
2. View your schedule across all 5 school days (Monday through Friday):
   - Period 1 through Period 7 (8:00 AM to 3:30 PM).
   - Subject names (Mathematics, English Language, Basic Science, ICT, Civic Education).
   - Classroom locations and assigned instructors.

#### D. Reading School Bulletins (`/student/announcements`)
1. Click **School Notices** in the sidebar.
2. Stay informed on upcoming events: mid-term assessments, inter-house athletics, science fairs, and holiday schedules.

---

### 6.4 Student Access Boundaries & Security Rules
- **Personal Scope**: Students can strictly access their own records.
- **Read-Only Access**: Students cannot edit marks, modify attendance, or tamper with transcripts.
- **Unpublished Scores Masked**: Students can only see scores once formally published by the school administration.

---

## 7. Master Role Permissions Matrix

The following matrix outlines access privileges across all modules and user roles in the Valencia SMS:

| Feature / Operation | Administrator | Teacher | Parent | Student | Public / Unauthenticated |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Access Executive Dashboard** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **View All 800 Students Across 16 Arms** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Manage Faculty & Staff Directory** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Broadcast School-Wide Announcements** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Moderate & Approve Score Sheets** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Publish Official Results to Portals** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Access Assigned Classroom Rosters** | ✅ Full | ✅ Assigned Only | ❌ | ❌ | ❌ |
| **Enter Continuous Assessment & Exam Scores** | ✅ Audit | ✅ Assigned Only | ❌ | ❌ | ❌ |
| **Batch Submit 50 Scores for Approval** | ❌ | ✅ Assigned Only | ❌ | ❌ | ❌ |
| **Mark Daily Attendance Register** | ✅ Audit | ✅ Assigned Only | ❌ | ❌ | ❌ |
| **Switch Between Enrolled Wards** | ❌ | ❌ | ✅ Linked Only | ❌ | ❌ |
| **View Published Term Report Cards** | ✅ Full | ✅ Assigned Only | ✅ Linked Only | ✅ Self Only | ❌ |
| **View Draft (Unapproved) Scores** | ✅ Audit | ✅ Author Only | ❌ Masked | ❌ Masked | ❌ |
| **View Term Fee Statements & Receipts** | ✅ Audit | ❌ | ✅ Linked Only | ❌ | ❌ |
| **View Weekly Monday&ndash;Friday Timetable** | ✅ Full | ✅ Teaching Slots | ✅ Ward Slots | ✅ Personal | ❌ |
| **Public Anti-Tamper QR Verification** | ✅ | ✅ | ✅ | ✅ | ✅ Full |
| **One-Click Demo Role Switcher** | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 8. End-to-End Term Result Workflow

The academic result lifecycle at Valencia Schools guarantees integrity through a 3-phase verification process:

```
+-----------------------------------------------------------------------------------+
|                           PHASE 1: TEACHER SCORE ENTRY                            |
|  Teacher opens assigned class (JSS 2A Maths) -> Enters CA (40) & Exam (60)        |
|  Clicks "Submit All 50 Scores for Approval" -> Status: PENDING_APPROVAL           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        PHASE 2: ADMINISTRATIVE MODERATION                         |
|  Admin receives pending approval alert -> Reviews all 50 student score entries    |
|  Clicks "Approve & Publish All 50 Now" -> Status: PUBLISHED (Timestamp Issued)    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                     PHASE 3: FAMILY ACCESS & VERIFICATION                         |
|  Parent & Student instantly view verified report cards with grades & class rank   |
|  Official anti-tamper QR code generated -> Publicly verifiable at /verify         |
+-----------------------------------------------------------------------------------+
```

### Detailed Lifecycle States
1. `DRAFT`: Scores entered by the subject teacher. Fully editable. Invisible to parents and students.
2. `PENDING_APPROVAL`: Submitted by teacher for executive review. Inputs locked against tampering.
3. `REJECTED`: Admin detected anomalies; returned to teacher with revision notes.
4. `PUBLISHED`: Approved by Dr. Valencia. Results stamped cryptographically and made live on parent and student portals.

---

## 9. Anti-Tamper Security & Public Verification Registry

### 9.1 The Problem
Traditional paper or unauthenticated digital report cards are susceptible to forgery, unauthorized grade alteration, or fraudulent credential claims.

### 9.2 The Valencia Solution
1. **Cryptographic Verification Code**: When results are published, the server generates a unique verification hash (e.g. `VAL-2024-JSS2-001-MATH`) linked to the student's identity, term, and approved score.
2. **Dynamic QR Code**: Rendered directly onto student transcripts and printable report cards.
3. **Public Registry (`/verify` & `/verify/[code]`)**:
   - Anyone (university admissions, embassies, scholarship boards) can scan the QR code or enter the code manually.
   - Requires zero login credentials.
   - Fetches and displays the tamper-evident official certification directly from the Valencia server.

---

## 10. Troubleshooting & Frequently Asked Questions

### Q1: Why can't a parent see their child's examination score?
**Answer**: The subject teacher may have entered scores in `DRAFT` or `PENDING_APPROVAL` status. Until the administrator officially approves and publishes the class result sheet, unmoderated scores remain masked to prevent premature or inaccurate disclosure.

### Q2: What happens if an unauthorized user attempts to access a student record via URL?
**Answer**: The server executes `assertStudentAccess()` on every request. If the session role lacks authorization for the requested student ID, the request is aborted and redirected to the user's dashboard with an `access_denied=1` banner.

### Q3: Can a teacher edit scores after clicking "Submit for Approval"?
**Answer**: No. Once submitted, score inputs lock to guarantee data integrity during admin review. If adjustments are needed, the admin can click "Return for Revision" to unlock the sheet for the teacher.

### Q4: How does the Demo Switcher work?
**Answer**: The top banner allows instant persona switching during evaluations and live demonstrations by calling server actions that update session cookies without requiring manual password entry.

