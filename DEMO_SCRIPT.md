# Valencia School Management System: 10-Minute Live Demo Script

**Objective**: Deliver a seamless, persuasive presentation proving the platform is a genuine multi-portal system with server-enforced security, role-based boundaries, and a complete end-to-end academic result workflow across the entire academy from Daycare to SS 3.

---

## Demo Summary & Credentials Cheat Sheet

| Role | Name | Email | Password | Scope & Key Action |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. (Mrs.) Folashade Valencia | `admin@valencia.edu.ng` | `admin123` | Approves & publishes 50-student result sheets |
| **Teacher** | Mr. Babatunde Adeleke | `teacher@valencia.edu.ng` | `teacher123` | Grades JSS 2A Maths & submits all 50 scores |
| **Parent** | Alhaji Ibrahim Musa | `parent@valencia.edu.ng` | `parent123` | Wards: Zainab (JSS 2A) & Chidi (Primary 4A) |
| **Student** | Zainab Musa | `student@valencia.edu.ng` | `student123` | Views verified report card & timetable |

> [!TIP]
> **Presenter Shortcut**: You can use the top **Demo Role Switcher Bar** to jump between roles with one click during the presentation, or use the standard `/login` screen to demonstrate credential validation.

---

## The 10-Minute Script (Step-by-Step)

### Minute 0:00 – 01:30 | Introduction & Ground Rules
- **Action**: Open the landing / login screen (`http://localhost:3000/login`).
- **Talking Point**:
  > *"Welcome. Today we are demonstrating the Valencia School Management System. This is a comprehensive, full-page system spanning our entire institution from Daycare through Primary, JSS, and Senior Secondary (SS 3)—with 800 enrolled students. Today we will follow one real story from start to finish: a teacher enters examination scores, the school administration reviews and approves them, and both parent and student instantly gain access to the verified report card."*
- **Action**: Highlight the 1-click preset demo accounts on the login card.

---

### Minute 01:30 – 03:00 | Phase 1: Admin Oversight (Daycare to SS 3)
- **Action**: Log in as **Admin** (`admin@valencia.edu.ng` / `admin123`).
- **Talking Point**:
  > *"Here is Dr. Folashade Valencia’s Executive Dashboard. We see 800 total students enrolled across all 16 classroom arms: 4 Early Years & Nursery arms, 6 Primary arms, 3 Junior Secondary arms, and 3 Senior Secondary arms. In the Student Directory, we can easily toggle between sections or search any student in real time."*
- **Action**: Navigate to **Result Approvals** (`/admin/results`).
- **Talking Point**:
  > *"In our Result Queue, select JSS 2A Mathematics. Notice the status is currently `DRAFT`. Mr. Adeleke hasn't submitted his finalized scores yet, so neither the parent nor the student can view this report card. Let's step into the teacher's shoes."*

---

### Minute 03:00 – 05:30 | Phase 2: Teacher Enters & Submits Scores
- **Action**: Click **Teacher** on the top Demo Switcher (Mr. Babatunde Adeleke).
- **Talking Point**:
  > *"Notice how the navigation immediately morphs into the Teacher menu. Mr. Adeleke is restricted to his assigned classrooms—JSS 2A and SS 1 Science. He cannot tamper with Daycare or Primary records."*
- **Action**: Open **Score Entry & Submit** (`/teacher/scores`).
- **Talking Point**:
  > *"Here is the interactive score entry sheet for JSS 2A Mathematics with all 50 enrolled students. Notice how clean it is: we have live search, 15/25/50 row pagination, and a 1-click 'Auto-Fill Sample Scores' button to quickly simulate realistic grading."*
- **Action**: Click **Auto-Fill Sample Scores**, or search for **Zainab** and adjust her score to CA: 38, Exam: 58 (Total 96, Grade A, Excellent).
- **Action**: Click the wine-red button: **Submit All 50 Scores for Approval**.
- **Talking Point**:
  > *"Once submitted, the entire 50-student batch transitions to `PENDING APPROVAL` in a single high-speed transaction. The scores lock to prevent post-submission tampering. The result is now queued for executive review."*

---

### Minute 05:30 – 07:00 | Phase 3: Admin Review & Publication
- **Action**: Click **Admin** on the top switcher.
- **Talking Point**:
  > *"Back in the Admin Portal, notice the notification banner immediately lights up: '1 Result Submission Awaiting Approval'."*
- **Action**: Go to **Result Approvals** (`/admin/results`).
- **Talking Point**:
  > *"Dr. Valencia opens the JSS 2A Mathematics sheet. She can inspect every student's scores, check class averages, or request revisions. Everything checks out."*
- **Action**: Click **Approve & Publish All 50 Now**.
- **Talking Point**:
  > *"The batch transitions to `PUBLISHED` with an official cryptographic timestamp. Let's verify that the family can now see it."*

---

### Minute 07:00 – 08:45 | Phase 4: Parent Portal & Security Check
- **Action**: Click **Parent** on the top switcher (Alhaji Ibrahim Musa).
- **Talking Point**:
  > *"Alhaji Musa has two wards at Valencia: Zainab in JSS 2A and Chidi in Primary 4A. The Parent Portal includes a seamless Child Switcher."*
- **Action**: Select **Zainab Musa** and view **Report Cards** (`/parent/results`).
- **Talking Point**:
  > *"Look at that: Mathematics is now officially published on Zainab's transcript with a 96% score, Grade A, and distinction average! Prior to admin publishing, this subject was concealed under 'Awaiting Moderation'."*
- **Action**: **Demonstrate Security**: Type `http://localhost:3000/parent/results?studentId=std_ss3_1` into the browser URL bar.
- **Talking Point**:
  > *"What happens if a parent tries to inspect a senior student from SS 3 by modifying the URL ID? The server evaluates `assertStudentAccess()`, blocks the request, and safely bounces them back to their own child with an access notification. Real security, not just hidden links."*
- **Action**: Briefly click **Fee Statements** (`/parent/fees`). Show the itemized breakdown (Tuition, ICT, Labs, Sports) and clearance status.

---

### Minute 08:45 – 10:00 | Phase 5: Student Portal & Wrap-up
- **Action**: Click **Student** on the top switcher (Zainab Musa).
- **Talking Point**:
  > *"Finally, here is Zainab's Student Portal. She can view her published term results, class standing, and her Monday-to-Friday schedule under Weekly Timetable."*
- **Action**: Conclude with the summary:
  > *"In 10 minutes, we have proven:
  > 1. Full academy coverage from Daycare to SS 3 (800 students).
  > 2. Four distinct roles with tailored portals and real server sessions.
  > 3. Hardened access boundaries preventing URL tampering.
  > 4. An end-to-end academic lifecycle: Teacher grading &rarr; Admin moderation &rarr; Parent/Student live access.
  > 5. Clean architecture with zero throwaway code—ready for production PostgreSQL and Paystack integration."*
