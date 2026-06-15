# 🎯 Click-to-Expand Grid Design Guide

## Overview

The new scorecard uses a **two-level detail system**:
- **Level 1 (Minimal):** Summary row showing only key metrics
- **Level 2 (Detailed):** Expandable section with full breakdown on click

This design keeps dashboards clean while providing deep insights on demand.

---

## 📊 How It Works

### Visual Flow

```
┌─────────────────────────────────────────────────────────┐
│ SUMMARY VIEW (Minimal)                                  │
├─────────────────────────────────────────────────────────┤
│ Team Member  │ Main Metric │ Secondary │ Status │  ▼   │ ← Click to expand
└─────────────────────────────────────────────────────────┘
                           ↓ Click
┌─────────────────────────────────────────────────────────┐
│ DETAILED VIEW (Expands Below)                           │
├─────────────────────────────────────────────────────────┤
│  📊 Category 1          │ 📈 Category 2        │ ⚠️ Category 3      │
│  ├─ Metric A: Value     │ ├─ Metric D: Value   │ ├─ Issue 1         │
│  ├─ Metric B: Value     │ ├─ Metric E: Value   │ ├─ Issue 2         │
│  └─ Metric C: Value     │ └─ Metric F: Value   │ └─ Status: Alert   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Five Scorecard Views

### 1️⃣ **Quality & Compliance Grid**

**MINIMAL VIEW:**
```
┌──────────────────┬─────────────────┬──────────┬────────┬─────┐
│ Team Member      │ Quality Score   │ Audits   │ Errors │  ▼  │
├──────────────────┼─────────────────┼──────────┼────────┼─────┤
│ Anubha Priyam    │ 92% 🟢          │ View →   │ 2 errs │  ▼  │
│ Madhan Kumar G   │ 88% 🟡          │ View →   │ 1 errs │  ▼  │
│ Leonie Gomes     │ 95% 🟢          │ View →   │ 0 errs │  ▼  │
└──────────────────┴─────────────────┴──────────┴────────┴─────┘

CLICK ROW ↓

DETAILED VIEW (Expands):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 QUALITY METRICS
├─ Internal Quality Score: 55.2%
├─ External Quality Score: 36.8%
├─ Overall Quality: 92%
└─ Audit Errors: 2 (🔴 Alert)

📋 AUDIT DETAILS
├─ Client System Audits: 159 assigned, 159 completed ✓
├─ Internal Audits: Multiple weekly audits
├─ Compliance Status: On Track
└─ Next Audit Cycle: Week 2

⚠️ RECENT ISSUES
├─ Start date errors: 2
│  └─ WC 11th Jan: Start date incorrect (2 cases)
├─ Document issues: 1
│  └─ Missing verification docs
└─ Last error: WC 11th Jan

DATA SOURCE:
├─ Client_System_Audit_Tracker.xlsx
├─ Internal_Audit_Scores.xlsx
└─ Calculated metrics: Quality = (Internal × 0.6) + (External × 0.4)
```

---

### 2️⃣ **Attendance Grid**

**MINIMAL VIEW:**
```
┌──────────────────┬────────────────┬──────────────┬──────────┬─────┐
│ Team Member      │ Attendance (%)  │ YTD Absences │ Trend    │  ▼  │
├──────────────────┼────────────────┼──────────────┼──────────┼─────┤
│ Anubha Priyam    │ 85% 🟡         │ 12 days      │ → Stable │  ▼  │
│ Madhan Kumar G   │ 92% 🟢         │ 5 days       │ ↑ Better │  ▼  │
│ Leonie Gomes     │ 88% 🟡         │ 9 days       │ → Stable │  ▼  │
└──────────────────┴────────────────┴──────────────┴──────────┴─────┘

CLICK ROW ↓

DETAILED VIEW (Expands):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 MONTHLY BREAKDOWN (2026)
├─ January: 5 absences
├─ February: 3 absences
├─ March: 2 absences
└─ April+: No data yet

📊 STATISTICS
├─ Total YTD: 12 days absent
├─ Average/Month: 4.0 days
└─ Status: 🟡 Monitor (>3 days/month trend)

📈 TREND ANALYSIS
├─ Best Month: March (2 days)
├─ Worst Month: January (5 days)
├─ Direction: ↑ Improving
└─ Projection: 8 days by Q2

DATA SOURCE: Attendance.xlsx
Format: Team Member + Monthly Columns (Jan-Dec 2026)
```

---

### 3️⃣ **Production Tracker Grid**

**MINIMAL VIEW:**
```
┌──────────────────┬──────────────┬───────────┬────────────┬─────┐
│ Team Member      │ Current (Mo) │ YTD Total │ vs Target  │  ▼  │
├──────────────────┼──────────────┼───────────┼────────────┼─────┤
│ Anubha Priyam    │ 8 units      │ 24 units  │ 🟢 100%    │  ▼  │
│ Madhan Kumar G   │ 8 units      │ 24 units  │ 🟢 100%    │  ▼  │
│ Leonie Gomes     │ 8 units      │ 24 units  │ 🟢 100%    │  ▼  │
└──────────────────┴──────────────┴───────────┴────────────┴─────┘

CLICK ROW ↓

DETAILED VIEW (Expands):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PRODUCTION METRICS
├─ Target/Month: 100 units
├─ January: 8 units
├─ February: 8 units
└─ March: 8 units

📈 PERFORMANCE
├─ YTD Total: 24 units
├─ YTD Target: 300 units
├─ Achievement: 8% (Early stage)
└─ Trend: On Track →

⚖️ VARIANCE ANALYSIS
├─ Units vs Target: -276 units (normal for Q1)
├─ Pace: 8 units/month
├─ Projection (full year): 96 units
└─ Recommendation: Monitor pace

DATA SOURCE: Production_Tracker.xlsx
Format: Team Member + Monthly Columns (Jan-Dec 2026)
Metric: Count of production units per month
```

---

### 4️⃣ **Onboarding & Clearance Grid**

**MINIMAL VIEW:**
```
┌──────────────────┬──────────────┬──────────────┬────────────┬─────┐
│ Team Member      │ NH Pending   │ Avg Days     │ Status     │  ▼  │
├──────────────────┼──────────────┼──────────────┼────────────┼─────┤
│ Banupriya        │ 8 pending    │ 15 days avg  │ 🟡 Monitor │  ▼  │
│ Robicca          │ 3 pending    │ 8 days avg   │ 🟢 Good    │  ▼  │
│ Aswani           │ 0 pending    │ 3.5 hrs clr  │ 🟢 Fast    │  ▼  │
└──────────────────┴──────────────┴──────────────┴────────────┴─────┘

CLICK ROW ↓

DETAILED VIEW (Expands):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ PENDING CASES (8 total)
├─ Karen Papa (Start 1/5/26) - 21 days pending
│  └─ Reason: I9 correction, VMS ID needed
├─ Cameron Bruce (Start 1/5/26) - 18 days pending
│  └─ Reason: Location/work mode confirmation
├─ Meagan Campbell (Start 1/5/26) - 36 days pending ⚠️
│  └─ Reason: List B doc title, physical address
└─ [5 more cases...]

📅 TIMELINE
├─ Oldest Case: 36 days (⚠️ CRITICAL)
├─ Average: 15 days
├─ Newest: 3 days
└─ SLA Target: 10 days (2 cases overdue)

📋 FINAL CLEARANCE
├─ Cleared This Month: 12 candidates
├─ Avg Clear Time: 3.5 hours ✓ Fast
├─ Status: On pace
└─ Next Steps: Follow up on 2 critical cases

DATA SOURCES:
├─ New_NH_pending_Tracker.xlsx (New Hires)
│  └─ Columns: Start date, Pending docs, Days pending
├─ Final_Clearance_Tracker.xlsx (Clearance)
│  └─ Columns: Time Received, Time Cleared, Status
└─ Calculations: Days = Received Date - Start Date
```

---

### 5️⃣ **Process Knowledge Test Grid**

**MINIMAL VIEW:**
```
┌──────────────────┬────────────────┬──────────────┬────────────┬─────┐
│ Team Member      │ Current Score  │ Average (%)  │ Trend      │  ▼  │
├──────────────────┼────────────────┼──────────────┼────────────┼─────┤
│ Anubha Priyam    │ 95% 🟢         │ 95% 🟢       │ ✓ Excellent│  ▼  │
│ Madhan Kumar G   │ 90% 🟡         │ 90% 🟡       │ → Good     │  ▼  │
│ Leonie Gomes     │ 95% 🟢         │ 95% 🟢       │ ✓ Excellent│  ▼  │
└──────────────────┴────────────────┴──────────────┴────────────┴─────┘

CLICK ROW ↓

DETAILED VIEW (Expands):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 TEST SCORES BY MONTH
├─ January 2026: 95%
├─ February 2026: 95%
├─ March 2026: 95%
└─ April+: No data yet

📊 PERFORMANCE ANALYTICS
├─ Highest Score: 95%
├─ Lowest Score: 95%
├─ Average: 95%
└─ Consistency: Very High (0% variance)

🎯 RATING & RECOMMENDATION
├─ Performance Level: Excellent (≥90%)
├─ Competency: Mastered
├─ Next Step: Advanced training available
└─ Certification: Due Q3

DATA SOURCE: Process_Knowledge_Test.xlsx
Format: Team Member + Monthly Test Scores (Jan-Dec 2026)
Scale: 0-100% (Percentage score)
Frequency: Monthly assessments
```

---

## 🔧 Technical Implementation

### HTML Structure
```html
<!-- Summary Row (Always visible) -->
<tr class="summary-row" onclick="toggleDetail(this)">
  <td>Team Member Name</td>
  <td class="metric-column">95%</td>
  <td class="secondary-metric">Additional info</td>
  <td><span class="status-badge">Status</span></td>
  <td class="expand-icon">▼</td>  <!-- Changes to ▲ when expanded -->
</tr>

<!-- Detail Row (Hidden by default, shows on click) -->
<tr class="detail-row">
  <td colspan="5" class="detail-content">
    <div class="detail-sections">
      <!-- Multiple columns of details -->
      <div class="detail-section">
        <h4>Category 1</h4>
        <ul>
          <li><strong>Metric:</strong> Value</li>
        </ul>
      </div>
      <div class="detail-section">
        <h4>Category 2</h4>
        <ul>
          <li><strong>Metric:</strong> Value</li>
        </ul>
      </div>
    </div>
  </td>
</tr>
```

### JavaScript Toggle
```javascript
function toggleDetail(element) {
    const detailRow = element.nextElementSibling;
    if (detailRow && detailRow.classList.contains('detail-row')) {
        detailRow.classList.toggle('show');  // Show/hide
        element.style.fontWeight = detailRow.classList.contains('show') 
            ? '600'  // Bold when expanded
            : 'normal';  // Normal when collapsed
    }
}
```

### CSS Styling
```css
/* Summary rows are clickable */
tr.summary-row {
    cursor: pointer;
    transition: background-color 0.2s;
}

tr.summary-row:hover {
    background-color: #f0f4ff;  /* Light blue on hover */
}

/* Detail rows hidden by default */
tr.detail-row {
    display: none;
}

/* Show detail row when .show class added */
tr.detail-row.show {
    display: table-row;
}

/* Detail content with padding */
td.detail-content {
    padding: 24px;
    background: #f9fbfd;  /* Slightly different background */
}

/* Expand icon indicator */
.expand-icon {
    text-align: center;
    color: #2563eb;
    font-weight: bold;
}
```

---

## 💡 User Experience Flow

### Scenario 1: Quick Overview
```
User Goal: "I want to see all team members' quality scores quickly"

Action: 
1. Open Manager Dashboard
2. View Quality & Compliance tab
3. See 5 columns of minimal data
4. Takes 2 seconds to scan

Result: ✓ Clean, uncluttered view
```

### Scenario 2: Deep Dive Investigation
```
User Goal: "Why is Anubha's quality score lower than others?"

Action:
1. Open Manager Dashboard
2. View Quality & Compliance tab
3. Click on Anubha's row
4. See detailed breakdown:
   - Internal vs External scores
   - Audit cycle progress
   - Recent errors with dates
   - Comments from auditors

Result: ✓ Full context without page reload
```

### Scenario 3: Comparative Analysis
```
User Goal: "Compare two employees' performance"

Action:
1. Open Manager Dashboard
2. Expand Employee A's row (see details)
3. Expand Employee B's row (see details side-by-side)
4. Compare metrics across sections

Result: ✓ Easy comparison of detailed metrics
```

---

## 📱 Mobile Responsiveness

### Desktop (Full Screen)
```
┌─────────────┬────────┬──────────┬────────┬────┐
│ Name        │ Score  │ Metric 2 │ Status │ ▼  │
├─────────────┼────────┼──────────┼────────┼────┤
│ [Expand below]                             │
└─────────────────────────────────────────────┘

Detail view shown in 3 columns side-by-side
```

### Tablet (Medium Screen)
```
┌──────────────────┬──────────┬────────┬────┐
│ Name             │ Score    │ Status │ ▼  │
├──────────────────┼──────────┼────────┼────┤
│ [Expand below]                        │
└──────────────────────────────────────────┘

Detail view shown in 2 columns
```

### Mobile (Small Screen)
```
┌────────────────────┬────┐
│ Name               │ ▼  │
│ Score: 95%        │    │
│ Status: Good      │    │
└────────────────────┴────┘

Detail view shown in 1 column (stacked)
```

---

## 🎨 Visual Indicators Guide

### Color Coding (Score Ranges)
```
🟢 GREEN  ≥85%:    "Excellent", "On Track", "Good"
🟡 YELLOW 70-84%:  "Good", "Monitor", "Caution"
🔴 RED   <70%:    "Below Target", "Alert", "Critical"
⚪ GRAY   N/A:    "No Data", "Not Started"
```

### Status Badges
```
✓  Completed / Cleared / On Time / Excellent
✗  Failed / Blocked / Overdue / Alert
⏳ Pending / In Progress / Awaiting / Monitor
→  No Change / Stable
↑  Improved / Trending Up / Better
↓  Declined / Trending Down / Worse
```

---

## 📊 Data Aggregation Rules

### For Monthly Data (Attendance, Production, PKT)
```
CURRENT = Latest non-empty month
AVERAGE = Sum of all months / Count of non-empty months
TREND = Compare current vs previous month
YTD = Sum of all months so far
```

### For Audit/Clearance Data
```
PENDING = Count of records without completion date
COMPLETED = Count of records with completion date
COMPLETION % = (Completed / Total) * 100
AVG TIME = Sum of (Completion Date - Start Date) / Count
```

### For Score Data
```
SCORE = Average of relevant metrics
QUALITY = (Internal × 0.6) + (External × 0.4)
OVERALL = Average of (Quality + Attendance + Knowledge + Productivity) / 4
STATUS = 🟢 if ≥85%, 🟡 if 70-84%, 🔴 if <70%
```

---

## ✅ Implementation Checklist

- [x] Click-to-expand functionality
- [x] Minimal summary view
- [x] Detailed expanded view
- [x] Color-coded status badges
- [x] Multiple grid views (5 different scorecards)
- [x] Data aggregation from Excel files
- [x] Mobile responsive design
- [x] Smooth animations
- [ ] Export functionality (coming next)
- [ ] Print-friendly view (optional enhancement)

---

## 🚀 File Information

**File:** manager-v4-expandable.html
**Status:** Ready for deployment
**Grid Types:** 5 (Quality, Attendance, Production, Onboarding, Knowledge)
**Data Source:** Firebase synced from Excel files
**Features:** Click-to-expand, multi-view, color-coded, responsive

---

**Version:** 1.0
**Last Updated:** June 15, 2026

