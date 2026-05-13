# 📊 System Architecture & Flow Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   LANDING PAGE (landing.html)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    HERO SECTION                          │  │
│  │  "HR Operations Scorecard - Track performance..."       │  │
│  │                                                          │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │  │
│  │  │   📤 UPLOAD    │  │    👔 MANAGER  │  │ 👤 MEMBER  │ │  │
│  │  │    CENTER      │  │   DASHBOARD    │  │ SCORECARD  │ │  │
│  │  └────────┬───────┘  └────────┬───────┘  └────────┬───┘ │  │
│  └───────────┼────────────────────┼────────────────────┼─────┘  │
│              │                    │                    │        │
│              ↓                    ↓                    ↓        │
│  ┌───────────────────┐ ┌──────────────────┐ ┌──────────────┐  │
│  │ Team Selection    │ │ Team Selection   │ │ ID Input     │  │
│  │ Modal opens       │ │ Modal opens      │ │ Modal opens  │  │
│  │ 5 Teams listed    │ │ 5 Teams listed   │ │ P11561-P11570│  │
│  │ with tasks        │ │ with tasks       │ │ (examples)   │  │
│  └────────┬──────────┘ └─────────┬────────┘ └──────┬───────┘  │
│           │                      │                 │           │
│           ↓                      ↓                 ↓           │
│  ┌──────────────┐      ┌──────────────┐   ┌──────────────┐   │
│  │ upload.html  │      │ manager.html  │   │associate.html│   │
│  │              │      │               │   │              │   │
│  │ Team: Audit  │      │ Team: Compl.  │   │ EmpId:P11561 │   │
│  └──────────────┘      └──────────────┘   └──────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey Flows

### Journey 1: Upload Center

```
LANDING PAGE
     │
     ├─→ User sees three cards
     │    (Upload, Manager, Associate)
     │
     ├─→ Clicks "📤 Upload Center"
     │
     ├─→ Modal opens with team list
     │    • Internal Audit 🔍
     │    • HR Operations 🏢
     │    • Compliance ⚖️
     │    • Paperwork Audit 📋
     │    • Final Clearance ✅
     │
     ├─→ Selects "Internal Audit"
     │
     ├─→ Modal updates showing:
     │    Members: Banu, Yogesh
     │    Tasks: 9 items listed
     │
     ├─→ Clicks "Open Upload Center"
     │
     └─→ REDIRECTS TO: upload.html
          (with team context)
          
          UPLOAD PAGE displays:
          ├─ Module upload sections
          ├─ Employee master upload
          ├─ Upload history
          └─ Associate management
```

### Journey 2: Manager Dashboard

```
LANDING PAGE
     │
     ├─→ Clicks "👔 Manager Dashboard"
     │
     ├─→ Modal opens with team list
     │
     ├─→ Selects "Compliance"
     │
     ├─→ Modal shows:
     │    Members: 6 employees
     │    Tasks: Compliance items
     │
     ├─→ Clicks "View Scorecard"
     │
     └─→ REDIRECTS TO: manager.html?team=Compliance
          
          MANAGER DASHBOARD displays:
          ├─ Filters (Team: Compliance selected)
          ├─ KPI Cards:
          │  • Overall Score: 82%
          │  • Target Achievement: 65%
          │  • Employees Meeting Target: 4
          │  • Employees Below Target: 2
          │  • Total Employees: 6
          ├─ Charts:
          │  • Score Trend (Line chart)
          │  • Category Breakdown (Doughnut)
          ├─ Tables:
          │  • Employee Summary
          │  • Quality Grid
          │  • Pending Cases
          │  • Process Knowledge
          ├─ Feedback Section
          ├─ Certificate Generator
          ├─ Associate Maintenance
          └─ Version History
```

### Journey 3: Associate View

```
LANDING PAGE
     │
     ├─→ Clicks "👤 My Scorecard"
     │
     ├─→ Modal opens with ID input
     │    "Enter your Employee ID"
     │
     ├─→ Types: P11561
     │    (or any other ID)
     │
     ├─→ Clicks "View My Scorecard"
     │
     └─→ REDIRECTS TO: associate.html?empId=P11561
          
          ASSOCIATE PAGE displays:
          ├─ Profile Card:
          │  • Name: Banu
          │  • Team: Internal Audit
          │  • Manager: [Manager name]
          ├─ KPI Cards:
          │  • Overall Score: 78%
          │  • Target Achievement: 91%
          │  • Quality Score: 85
          │  • Pending Items: 2
          ├─ Module Cards:
          │  • Attendance: 5/10 (50%)
          │  • Productivity: 8/10 (80%)
          │  • Quality: 85%
          ├─ Charts:
          │  • Quality Trend
          │  • Category Breakdown
          ├─ Feedback List
          │  (from managers)
          ├─ Certificates
          │  (earned achievements)
          └─ Download PDF Option
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER                                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         LANDING PAGE (landing.html)                 │  │
│  │  • Hero section with cards                          │  │
│  │  • Team selection modals                            │  │
│  │  • Task display per team                            │  │
│  │  • Navigation to other pages                        │  │
│  └────────────────┬─────────────────┬────────────────┬──┘  │
│                   │                 │                │      │
│      ┌────────────┘                 │                └──────┐
│      │                              │                      │
│      ↓                              ↓                      ↓
│  ┌─────────────┐              ┌──────────────┐      ┌──────────┐
│  │ upload.html │              │manager.html  │      │associate │
│  │             │              │              │      │.html     │
│  │ File Upload │              │ Analytics    │      │          │
│  │ & Management│              │ & Feedback   │      │Personal  │
│  └──────┬──────┘              └──────┬───────┘      │Scorecard │
│         │                            │              └─────┬────┘
│         └────────────┬────────────────┴──────────────────┘
│                      ↓
│    ┌─────────────────────────────────────┐
│    │    BROWSER LOCAL STORAGE (localStorage) │
│    │                                       │
│    │ Keys:                               │
│    │ • srp-employees      (List)         │
│    │ • srp-uploads        (Object)       │
│    │ • srp-feedback       (List)         │
│    │ • srp-certificates   (List)         │
│    │ • srp-history        (List)         │
│    └─────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │      ENHANCED APP MODULE (enhanced-app.js)      │
    │                                                 │
    │ Functions:                                     │
    │ • initializeLocalStorage()                     │
    │ • getScorecardEmployees()                      │
    │ • getScorecardUploads()                        │
    │ • getFeedback(empId)                          │
    │ • getCertificates(empId)                      │
    │ • saveEmployeeList()                          │
    │ • updateEmployee()                            │
    │ • deleteEmployee()                            │
    │ • addFeedback()                               │
    │ • addCertificate()                            │
    │ • createKpiCards()                            │
    │ • renderTable()                               │
    │ • buildManagerSnapshot()                      │
    │ • buildAssociateSnapshot()                    │
    │ • ...and more                                 │
    └─────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────┐
    │     PROFESSIONAL STYLING (enhanced-app.css)     │
    │                                                 │
    │ Includes:                                      │
    │ • Color scheme variables                       │
    │ • KPI card themes                              │
    │ • Status badges                                │
    │ • Responsive grid layouts                      │
    │ • Animations & transitions                     │
    │ • Print styles                                 │
    └─────────────────────────────────────────────────┘
```

---

## Team Navigation Structure

```
LANDING PAGE (landing.html)
          │
          ├─→ Upload Center Modal
          │        │
          │        ├─→ Internal Audit 🔍
          │        │   Members: Banu, Yogesh
          │        │   Tasks: [9 items]
          │        │   → upload.html
          │        │
          │        ├─→ HR Operations 🏢
          │        │   Members: Arjun MP, Madhan Kumar, Rihana, Ingrid Pope
          │        │   Tasks: [7 items]
          │        │   → upload.html
          │        │
          │        ├─→ Compliance ⚖️
          │        │   Members: [6 employees]
          │        │   Tasks: [6 items]
          │        │   → upload.html
          │        │
          │        ├─→ Paperwork Audit 📋
          │        │   Members: Thirisha, Vinish, Leonie
          │        │   Tasks: [6 items]
          │        │   → upload.html
          │        │
          │        └─→ Final Clearance ✅
          │            Members: Aswani, Archana, Anubha
          │            Tasks: [13 items]
          │            → upload.html
          │
          ├─→ Manager Dashboard Modal
          │        │
          │        ├─→ Internal Audit 🔍
          │        │   → manager.html?team=Internal Audit
          │        │
          │        ├─→ HR Operations 🏢
          │        │   → manager.html?team=HR Operations
          │        │
          │        ├─→ Compliance ⚖️
          │        │   → manager.html?team=Compliance
          │        │
          │        ├─→ Paperwork Audit 📋
          │        │   → manager.html?team=Paperwork Audit
          │        │
          │        └─→ Final Clearance ✅
          │            → manager.html?team=Final Clearance
          │
          └─→ Associate Modal
                   │
                   └─→ ID Input (P11561, P11562, etc.)
                       → associate.html?empId=XXXXX
```

---

## Color-Coded KPI Scoring

```
Score Value          Color         Badge Style       Icon
─────────────────────────────────────────────────────────
90 - 100 (Excellent) Green #10b981  ████ Bright      ✓ Check
75 - 89  (Good)      Blue  #3b82f6  ████ Bright      → Arrow
50 - 74  (Warning)   Amber #f59e0b  ████ Caution     ⚠ Warning
0  - 49  (Danger)    Red   #ef4444  ████ Alert       ✗ Cross
```

### KPI Card Display

```
┌─────────────────────────────────┐
│  ▓▓▓ (Color bar at top)          │
│                                  │
│  Overall Score %                │
│  ┌──────────────────────────────┐│
│  │        82                     ││
│  └──────────────────────────────┘│
│                                  │
│  Average overall score across    │
│  the filtered employees.         │
│                                  │
└─────────────────────────────────┘
```

---

## State Management Flow

```
User Action              Effect                 Storage Update
─────────────────────────────────────────────────────────────
Upload Employee File  → Parse Excel           → srp-employees
                      → Normalize names       → srp-history
                      → Save to localStorage

Upload Module Data    → Parse Excel rows      → srp-uploads
                      → Extract by employee   → srp-history
                      → Calculate scores

Add Feedback         → Create feedback object → srp-feedback
                     → Timestamp it           → srp-history
                     → Store locally

Create Certificate   → Generate PDF           → srp-certificates
                     → Store record           → srp-history

Edit Associate       → Update employee record → srp-employees
                     → Log change             → srp-history

Delete Associate     → Remove from list       → srp-employees
                     → Log removal            → srp-history
```

---

## Module Relationships

```
┌──────────────────────────────────────────────────────────┐
│              ENHANCED APP MODULE EXPORTS                  │
│                                                           │
│  ├─ TEAM_RULES                                          │
│  │  └─ 5 Teams with tasks & modules                     │
│  │                                                       │
│  ├─ UPLOAD_SLOT_DEFINITIONS                            │
│  │  └─ 13 Module types with labels                      │
│  │                                                       │
│  ├─ Storage Functions                                   │
│  │  ├─ getScorecardEmployees()                         │
│  │  ├─ getScorecardUploads()                           │
│  │  ├─ getFeedback(empId)                              │
│  │  ├─ getCertificates(empId)                          │
│  │  ├─ getHistory()                                     │
│  │  └─ [and save/update variants]                      │
│  │                                                       │
│  ├─ Rendering Functions                                │
│  │  ├─ createKpiCards()                                │
│  │  ├─ renderTable()                                    │
│  │  ├─ renderFeed()                                     │
│  │  ├─ renderModuleCards()                             │
│  │  └─ createOrUpdateChart()                           │
│  │                                                       │
│  ├─ Parsing Functions                                  │
│  │  ├─ parseEmployeeWorkbook()                         │
│  │  └─ parseUploadSlotWorkbook()                       │
│  │                                                       │
│  ├─ Analytics Functions                                │
│  │  ├─ buildManagerSnapshot()                          │
│  │  └─ buildAssociateSnapshot()                        │
│  │                                                       │
│  └─ Utility Functions                                  │
│     ├─ downloadCertificate()                           │
│     ├─ exportManagerCsv()                              │
│     └─ [others]                                         │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

```
Desktop (1024px+)
┌─────────────────────────────────────────┐
│  Landing Hero Section                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Upload  │  │ Manager │  │ Member  │  │
│  │ Card    │  │ Card    │  │ Card    │  │
│  └─────────┘  └─────────┘  └─────────┘  │
└─────────────────────────────────────────┘

Tablet (768px - 1024px)
┌──────────────────┐
│ Landing Hero     │
│ ┌──────────────┐ │
│ │Upload Card   │ │
│ ├──────────────┤ │
│ │Manager Card  │ │
│ ├──────────────┤ │
│ │Member Card   │ │
│ └──────────────┘ │
└──────────────────┘

Mobile (<768px)
┌──────────────┐
│ Landing Hero │
│ ┌──────────┐ │
│ │Card      │ │
│ ├──────────┤ │
│ │Card      │ │
│ ├──────────┤ │
│ │Card      │ │
│ └──────────┘ │
└──────────────┘
```

---

## File Organization

```
project/
├── landing.html                    ← START HERE
│   └─ Entry point with 3 cards
│      └─ Uses enhanced-app.js
│         └─ Populates TEAMS array
│
├── manager.html                    ← For team managers
│   └─ Dashboard with analytics
│      └─ Uses enhanced-app.js
│         └─ Calls buildManagerSnapshot()
│
├── associate.html                  ← For employees
│   └─ Personal scorecard view
│      └─ Uses enhanced-app.js
│         └─ Calls buildAssociateSnapshot()
│
├── upload.html                     ← For uploads
│   └─ Module upload interface
│      └─ Uses enhanced-app.js
│         └─ Calls parseUploadSlotWorkbook()
│
├── server.js                       ← Optional backend
│   └─ Express server (if used)
│      └─ Serves public folder
│
├── assets/
│   ├── enhanced-app.css
│   │   └─ All styling & themes
│   ├── enhanced-app.js
│   │   └─ Core functionality
│   └── [other files]
│
└── public/ (if using server)
    └─ [all HTML & assets]
```

---

## Loading Sequence

```
1. User opens: landing.html
   │
   ├─→ HTML loads
   │   ├─ <link rel="stylesheet"> enhanced-app.css loads
   │   │   └─ Colors, animations, layouts defined
   │   │
   │   ├─ <script> enhanced-app.js loads
   │   │   ├─ Window.ScorecardApp created
   │   │   ├─ localStorage initialized
   │   │   ├─ TEAMS array defined
   │   │   └─ Functions available globally
   │   │
   │   └─ <script> inline JavaScript
   │       ├─ TEAMS initialized in landing.html
   │       ├─ Event listeners attached
   │       ├─ Modal functions created
   │       └─ Navigation ready
   │
   └─→ Landing page renders
       ├─ Beautiful gradient background
       ├─ Three interactive cards
       ├─ Smooth animations
       └─ Ready for user interaction
```

---

This gives you a complete visual understanding of how all the pieces fit together!

**Key Takeaways:**
- 🎯 Landing page is the hub
- 🔀 Team selection determines context
- 📱 System is fully responsive
- 💾 Data lives in localStorage
- 🎨 Colors indicate performance status
- 🔄 All functions centralized in enhanced-app.js
- 🎪 Styling managed in enhanced-app.css
