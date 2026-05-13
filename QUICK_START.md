# 🎯 HR Ops Scorecard - Enhanced System Quick Start

## What's New? 🌟

### Landing Page
A beautiful, professional entry point with three main cards:

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│        HR Operations Scorecard                              │
│    Track performance, manage teams, recognize excellence    │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│   │   📤 Upload  │  │   👔 Manager │  │   👤 Member │    │
│   │   Center     │  │   Dashboard  │  │   Scorecard  │    │
│   │ Import data  │  │ Team view    │  │ Personal     │    │
│   │ & tasks      │  │ & analytics  │  │ metrics      │    │
│   └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Three Links to Enter

### 1️⃣ Upload Center
- **Purpose**: Import and manage performance data
- **Users**: Administrators, Data Managers
- **Workflow**:
  1. Click "Upload Center" card
  2. Modal opens showing 5 teams
  3. Select a team
  4. See team members and tasks
  5. Click "Access Upload" to go to upload.html
  6. Upload Excel files for that team

**Teams Available**:
- 🔍 Internal Audit (Banu, Yogesh)
- 🏢 HR Operations (Arjun MP, Madhan Kumar, Rihana, Ingrid Pope)
- ⚖️ Compliance (Alan Benjamin, Pavithra Mahesh, Sneha Thomas, Rathina Sudhan, Azhar Taj, Sayee B)
- 📋 Paperwork Audit (Thirisha, Vinish, Leonie)
- ✅ Final Clearance Team (Aswani, Archana, Anubha)

### 2️⃣ Manager Dashboard
- **Purpose**: View team performance, analytics, and manage feedback
- **Users**: Managers, Team Leads
- **Workflow**:
  1. Click "Manager Dashboard" card
  2. Modal opens with 5 teams
  3. Select a team
  4. See team members and KPIs
  5. Click "View Scorecard" to see analytics
  6. On manager.html: View performance metrics, add feedback, create certificates

**Dashboard Includes**:
- KPI Cards (color-coded: Green/Blue/Amber/Red)
- Performance trend charts
- Employee summary table
- Quality grid
- Pending cases grid
- Feedback section
- Certificate generator

### 3️⃣ Associate Scorecard
- **Purpose**: Employees view their personal performance data
- **Users**: All employees
- **Workflow**:
  1. Click "My Scorecard" card
  2. Modal opens with ID input field
  3. Enter Employee ID (e.g., P11561)
  4. Click "View My Scorecard"
  5. See personal metrics, feedback, certificates

**Sample Employee IDs** (for testing):
- P11561 - Banu (Internal Audit)
- P11563 - Arjun MP (HR Operations)
- P11567 - Alan Benjamin (Compliance)
- P11569 - Thirisha (Paperwork Audit)
- P11570 - Aswani (Final Clearance)

## 🎨 Visual Design

### Color Scheme

```
Primary Brand     ████ Teal (#0d7c6f)
Excellent         ████ Green (#10b981)
Good              ████ Blue (#3b82f6)
Warning           ████ Amber (#f59e0b)
Danger            ████ Red (#ef4444)
Accent            ████ Coral (#ff6b5b)
Accent            ████ Gold (#ffc857)
Accent            ████ Purple (#6c5ce7)
```

### KPI Card Themes

```
Score 90+   → Excellent   Green badge with checkmark
Score 75-89 → Good        Blue badge
Score 50-74 → Warning     Amber badge
Score <50   → Danger      Red badge with warning
```

### Module Cards

Each module displays:
- Title (e.g., "Quality Score")
- Completion status (5/10 items)
- Progress bar
- Score percentage

## 📊 Sample Flow

### Upload Center Example
```
User clicks "Upload Center"
    ↓
Modal shows 5 teams + descriptions
    ↓
User clicks "Internal Audit"
    ↓
See: Members (Banu, Yogesh) + Tasks list
    ↓
Click "Open Upload Center"
    ↓
Redirected to upload.html with team context
    ↓
Upload Excel files for Internal Audit modules
    ↓
Data saved locally in browser
```

### Manager Dashboard Example
```
Manager clicks "Manager Dashboard"
    ↓
Modal shows 5 teams
    ↓
Manager clicks "Compliance"
    ↓
See: 6 team members + Compliance tasks
    ↓
Click "View Scorecard"
    ↓
Redirected to manager.html filtered by Compliance team
    ↓
Dashboard shows:
  - KPI Cards (Overall Score, Target Achievement, etc.)
  - Performance trends (line chart)
  - Category breakdown (doughnut chart)
  - Employee table with scores
  - Quality grid
  - Feedback section
  - Certificate generator
```

### Associate Scorecard Example
```
Employee clicks "My Scorecard"
    ↓
Modal shows input field
    ↓
Employee enters: P11561
    ↓
Click "View My Scorecard"
    ↓
Redirected to associate.html?empId=P11561
    ↓
See personal dashboard:
  - Profile card with name, team, manager
  - KPI cards (Overall Score, Quality, Attendance)
  - Module progress cards
  - Quality trend chart
  - Category breakdown
  - Feedback from manager
  - Certificates earned
  - Download PDF option
```

## 🚀 Installation

### Step 1: Copy Files
```
Download these 3 files:
- landing.html
- enhanced-app.css
- enhanced-app.js
```

### Step 2: Place in Folder Structure
```
project/
├── landing.html                 ← New file
├── manager.html                 ← Existing (no changes)
├── associate.html               ← Existing (no changes)
├── upload.html                  ← Existing (no changes)
└── assets/
    ├── enhanced-app.css         ← New (replaces old app.css)
    ├── enhanced-app.js          ← New (replaces old app.js)
    └── [other files...]
```

### Step 3: Open in Browser
```
File mode:
file:///Users/yourname/project/landing.html

Server mode:
http://localhost:3000/landing.html
```

### Step 4: Test
1. Click "Upload Center" → Select "Internal Audit" → See tasks
2. Click "Manager Dashboard" → Select "Compliance" → View scorecard
3. Click "My Scorecard" → Enter "P11561" → View personal metrics

## ✨ Key Features

✅ **Three Clear Entry Points**
- Upload Center
- Manager Dashboard
- Associate Scorecard

✅ **Team-Based Navigation**
- 5 teams with predefined members
- Task listings for each team
- Context-aware views

✅ **Colorful Professional Design**
- Modern gradient backgrounds
- Color-coded KPI cards
- Beautiful module cards with progress
- Responsive on all devices

✅ **Local Storage Persistence**
- No backend required
- Data persists in browser
- Works offline

✅ **Pre-filled Sample Data**
- 10 sample employees
- 5 teams with members
- 30+ tasks per team
- Ready for testing

✅ **Print & Export**
- Download scorecards as PDF
- Generate certificates
- Export to CSV

## 📋 Team Members & Tasks

### Internal Audit 🔍
**Members**: Banu, Yogesh
**Tasks**:
- Paperwork Audit to QMG
- Quality Scorecard
- Data Change Audit
- Termination Audit
- + 8 more...

### HR Operations 🏢
**Members**: Arjun MP, Madhan Kumar, Rihana, Ingrid Pope
**Tasks**:
- HR Ops Mailbox
- Missing Timecards
- Client System Audits
- Visa Audit & Follow ups
- + 7 more...

### Compliance ⚖️
**Members**: Alan Benjamin, Pavithra Mahesh, Sneha Thomas, Rathina Sudhan, Azhar Taj, Sayee B
**Tasks**:
- Compliance Mailbox
- BG Initiation
- Client System Audit
- Daily JD Notes
- + 6 more...

### Paperwork Audit 📋
**Members**: Thirisha, Vinish, Leonie
**Tasks**:
- Compliance Mailbox
- Paperwork Clearance
- Client System Audit
- Paperwork Processing
- + 6 more...

### Final Clearance Team ✅
**Members**: Aswani, Archana, Anubha
**Tasks**:
- BG Final Clearance
- JD Notes & Screenshots
- License Verification Audit
- Conditional Clearance Follow ups
- + 9 more...

## 🔧 Customization

### Change Teams
Edit the `TEAMS` array in `landing.html`:
```javascript
const TEAMS = [
    {
        name: "Your Team Name",
        icon: "🎯",
        members: ["Person 1", "Person 2"],
        tasks: ["Task 1", "Task 2"]
    },
    // ...
];
```

### Change Colors
Edit CSS variables in `enhanced-app.css`:
```css
:root {
    --primary-teal: #0d7c6f;        /* Brand color */
    --status-excellent: #10b981;    /* Green */
    --status-good: #3b82f6;         /* Blue */
    // ...
}
```

### Change Employees
Edit prefilled data in `enhanced-app.js`:
```javascript
const PREFILLED_EMPLOYEES = [
    { employeeId: "ID", employeeName: "Name", teamName: "Team", ... },
    // ...
];
```

## 📞 Support

**Issue**: Landing page won't open
- Try: file:///path/to/landing.html
- Check browser console (F12 → Console)

**Issue**: Links don't work
- Verify files are in correct folders
- Check relative paths in HTML

**Issue**: Data not saving
- Clear browser cache
- Try incognito window
- Check localStorage in DevTools

**Issue**: Charts not showing
- Ensure internet connection (CDN links)
- Check browser console for errors

---

## 🎉 You're All Set!

Your HR Ops Scorecard system now has:
- ✨ Beautiful landing page
- 🎯 Three clear entry points
- 👥 Team-based navigation
- 📊 Colorful, professional scorecards
- 📱 Responsive on all devices
- 💾 Local data persistence

**Start here**: Open `landing.html` in your browser!

---

**Version**: 1.0.0  
**Created**: 2024  
**Status**: Production Ready ✅
