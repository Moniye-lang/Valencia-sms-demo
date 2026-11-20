# Valencia School Management System: Demo Scope & Specification

**Demo Objective**: Demonstrate a live, functional, and secure multi-portal school management platform for Valencia Schools. One story runs completely end-to-end across multiple roles: **A Teacher enters term scores and submits them &rarr; Admin reviews and approves/publishes &rarr; Parent & Student instantly access the approved report card.**

---

## 1. What the Demo Shows (Core Scope)

### 1. Four Distinct Portals & Role-Based Access Control (RBAC)
- **Admin Portal**: Executive overview of all 16 classroom arms (Daycare to SS 3), student directory of 800 enrolled students, staff & role management, result approval queue, and school-wide announcements.
- **Teacher Portal**: Assigned classes and subjects, interactive score entry (Continuous Assessment + Exam), bulk attendance marking, and 1-click 50-student batch score submission.
- **Parent Portal**: Child switcher (for parents with multiple enrolled wards), academic report cards, attendance records, and term fee statements.
- **Student Portal**: Personalized profile, daily timetable schedule, published academic performance, and notice board.

### 2. Comprehensive Academy Roster (Daycare to SS 3 &bull; 800 Students)
- **Early Years & Nursery (200 Students)**: Daycare & Creche, Playgroup, Nursery 1, Nursery 2
- **Primary Section (300 Students)**: Primary 1 through Primary 6
- **Junior Secondary School (150 Students)**: JSS 1, JSS 2A, JSS 3
- **Senior Secondary School (150 Students)**: SS 1 Science, SS 2, SS 3
- 50 enrolled students per classroom arm with authentic Nigerian names, admission numbers, fee assessments, and attendance registers.

### 3. Real Authentication & Server-Enforced Security
- **Secure Email/Password Login**: Genuine server-side session handling (HTTP-only cookies / encrypted session token).
- **Hardened Permission Enforcement**:
  - Teachers can *only* view/grade their assigned subjects & classes.
  - Parents can *only* access their linked children.
  - Students can *only* see their own records.
  - Admin has full oversight and approval control.
- **URL Tampering Protection**: Accessing unauthorized student IDs or classes via direct URL redirects with an access-denied security notice.
- **One-Click Demo Switcher**: Instant switching between Admin, Teacher, Parent, and Student demo accounts for rapid presentation.

### 4. The End-to-End Result Approval Story
1. **Teacher Action**: Teacher (*Mr. Babatunde Adeleke*) opens JSS 2A Mathematics, enters scores (CA: 40, Exam: 60, total 100 with auto-calculated grades & remarks), and clicks **Submit All 50 Scores for Approval**. Status changes to `PENDING_APPROVAL`.
2. **Admin Action**: Admin (*Dr. Mrs. Folashade Valencia*) receives the pending submission notification, reviews the scores, and clicks **Approve & Publish All 50 Now**. Status becomes `PUBLISHED`.
3. **Parent & Student Access**: Parent (*Alhaji Ibrahim Musa*) switches to ward (*Zainab Musa*), and Student (*Zainab Musa*) logs in. Both immediately see the verified report card with class position, average, and remarks. (Unpublished results remain strictly hidden).

---

## 2. Design System & Brand Identity

- **Full-Page Edge-to-Edge Layout**: `w-full` expansive dashboard design responsive to widescreen laptops and mobile devices.
- **Bright & Crisp Modern Palette**: Clean Slate-50 background (`#F8FAFC`), crisp white cards (`#FFFFFF`), vibrant Valencia red branding (`#FF1313`), and gold accents.
- **Simpler User Experience**: Live search filters, 15/25/50 row pagination, and 1-click **Auto-Fill Sample Scores** to prevent manual typing during demos.

---

## 3. Preset Demo Accounts

| Role | Name | Email | Password | Scope / Ward |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. (Mrs) Folashade Valencia | `admin@valencia.edu.ng` | `admin123` | Full School Oversight (Daycare to SS 3) |
| **Teacher** | Mr. Babatunde Adeleke | `teacher@valencia.edu.ng` | `teacher123` | JSS 2A & SS 1 Science Mathematics |
| **Parent** | Alhaji Ibrahim Musa | `parent@valencia.edu.ng` | `parent123` | Wards: Zainab Musa (JSS 2A), Chidi Musa (Primary 4A) |
| **Student** | Zainab Musa | `student@valencia.edu.ng` | `student123` | JSS 2A Student Profile |
