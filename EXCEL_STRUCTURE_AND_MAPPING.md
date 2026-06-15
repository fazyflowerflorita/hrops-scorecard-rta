# 📊 Excel Files Structure & Scorecard Mapping

## File-by-File Column Analysis

### 1. **Attendance.xlsx**
```
Structure: Team Member + Monthly Columns (2026-01-01 to 2026-12-01)
┌─ Column: Team Member (string)
├─ Monthly Columns: 2026-01-01, 2026-02-01, ... 2026-12-01 (numeric - absence count)
└─ Total Rows: 23 employees

Sample Data:
  Anubha Priyam: Jan=5, Feb=3, Mar=2, Apr=1, May=0, Jun=1 (future months = empty)
  Madhan Kumar G: Jan=1, Feb=0, Mar=5, Apr=3, May=2, Jun=0

SCORECARD MAPPING:
├─ Summary Grid: Team Member | Attendance Score (%) | Avg Absences | Current Month Absences
├─ Click to Expand: Detailed Monthly Breakdown
├─ Formula: Score = 100 - (Total Absences / Expected Days * 100)
└─ Visual: Progress bar (0-100%)
```

---

### 2. **Client_System_Audit_Tracker.xlsx**
```
Structure: Detailed Audit Records per Employee
┌─ Columns:
│  ├─ S.No (numeric)
│  ├─ Audit Cycle (string: "01-15 Jan", "16-31 Jan")
│  ├─ Team Member (string)
│  ├─ Audits Assigned Count (numeric)
│  ├─ Assigned Date (date)
│  ├─ Due Date (date)
│  ├─ Audits Completed Date (date)
│  ├─ Pending (Yes/No string)
│  ├─ Status (string: "Completed", "Pending")
│  └─ Remarks (text)
└─ Total Rows: 55 records

Sample Data:
  Alan: 147 audits assigned, completed 1/12/2026, Status: Completed
  Anubha: 159 audits assigned, completed 1/12/2026, Status: Completed

SCORECARD MAPPING:
├─ Summary Grid: Team Member | Total Audits | Completed | Pending | Completion %
├─ Click to Expand: Cycle-by-cycle breakdown with dates and status
├─ Formula: Completion % = (Completed Count / Total Audits * 100)
└─ Visual: Progress bar (0-100%)
```

---

### 3. **Internal_Audit_Scores.xlsx**
```
Structure: Weekly QMG Error Tracking
┌─ Columns:
│  ├─ Week (string: "WC 28th Dec", "WC 04th Jan")
│  ├─ QMG error (numeric or string)
│  ├─ Auditor who made the error (string: comma-separated)
│  ├─ CA/NCA (string: "CA" or "NCA")
│  └─ Error Description (text)
└─ Total Rows: 24 weekly records

Sample Data:
  WC 28th Dec: 0 errors, NA
  WC 11th Jan: 14 NCA errors, Multiple auditors (Arjun-05, Banu-02, Yogesh-06, Compliance-01)

SCORECARD MAPPING:
├─ Summary Grid: Team Member (extracted from auditor column) | Error Count | Error Rate
├─ Click to Expand: Detailed error breakdown by week with error types
├─ Calculation: Extract auditor names and count errors attributed to each
├─ Note: Auditor names are embedded in comma-separated text - needs parsing
└─ Visual: Badge (Red if errors > 0, Green if 0)
```

---

### 4. **New_NH_pending_Tracker.xlsx**
```
Structure: New Hire Onboarding Tracking (Large dataset)
┌─ Columns:
│  ├─ Week ending (string: "01/05/2026 TO 01/11/2026")
│  ├─ Launch (numeric: Job ID)
│  ├─ Candidate Name (string)
│  ├─ Client Name (string)
│  ├─ DOJO (string: "RTA US", etc.)
│  ├─ Start date (date)
│  ├─ Processor (string: Name)
│  ├─ Auditor (string: Name)
│  ├─ Pending doc's from our end (text)
│  ├─ Pending doc's from the candidate's end (text)
│  ├─ All documents , Received Date (date)
│  ├─ Status (string)
│  └─ Comments (text)
└─ Total Rows: 428 NH records

Sample Data:
  Karen Papa: Start 1/5/2026, Processor: Robicca, Auditor: Banupriya, Pending: I9 correction
  Cameron Bruce: Start 1/5/2026, Pending docs received 1/22/2026

SCORECARD MAPPING:
├─ Summary Grid: Team Member (Processor/Auditor) | Pending Count | Avg Days to Clear
├─ Click to Expand: Individual NH case details with pending reasons
├─ Calculation: Days to Clear = Documents Received Date - Start Date
├─ Status: Filter by "Pending" status to get active cases
└─ Visual: Count badge, Red if pending > 10 days, Yellow if < 10 days
```

---

### 5. **Process_Knowledge_Test.xlsx**
```
Structure: Team Member + Monthly Test Scores
┌─ Column: Team Member (string)
├─ Monthly Columns: 2026-01-01, 2026-02-01, ... 2026-12-01 (numeric - score 0-100)
└─ Total Rows: 22 employees

Sample Data:
  Anubha Priyam: Jan=95, Feb=95, Mar=95 (future = empty)
  Madhan Kumar G: Jan=90, Feb=90, Mar=90
  Leonie Gomes: Jan=95, Feb=95, Mar=95

SCORECARD MAPPING:
├─ Summary Grid: Team Member | Current Score | Average Score | Trend (↑/↓/→)
├─ Click to Expand: Detailed monthly breakdown with trend visualization
├─ Formula: Average = Sum(all test scores) / Count(non-empty)
├─ Trend: Compare current month vs previous month
└─ Visual: Progress bar (0-100%) with color: Green ≥85, Yellow 70-84, Red <70
```

---

### 6. **Production_Tracker.xlsx**
```
Structure: Team Member + Monthly Production Counts
┌─ Column: Team Member (string)
├─ Monthly Columns: 2026-01-01, 2026-02-01, ... 2026-12-01 (numeric - count)
└─ Total Rows: 23 employees

Sample Data:
  Anubha Priyam: Jan=8, Feb=8, Mar=8 (units per month)
  Madhan Kumar G: Jan=8, Feb=8, Mar=8

SCORECARD MAPPING:
├─ Summary Grid: Team Member | Current Month Count | Total YTD | Average Per Month
├─ Click to Expand: Detailed monthly breakdown
├─ Formula: YTD = Sum(all months), Average = YTD / Count(non-empty months)
├─ Target: (Define based on job level)
└─ Visual: Progress bar (0-100% vs target) with color: Green if ≥target, Yellow if 80-99% of target
```

---

### 7. **Final_Clearance_Tracker.xlsx**
```
Structure: Detailed Clearance Records (Large dataset)
┌─ Columns:
│  ├─ Date Received (date)
│  ├─ Time Received from OB Team (time string)
│  ├─ Time Received from compliance Team (time string)
│  ├─ Date Audited (date)
│  ├─ Job Diva ID (numeric)
│  ├─ Candidate Name (string)
│  ├─ Client Name (string)
│  ├─ OB Team/Compliance team Name (string: Processor Name)
│  ├─ Audited By (string: Auditor Name)
│  ├─ Audit Status (string: "Cleared", "Conditionally Cleared")
│  ├─ First response (time)
│  ├─ Time Cleared (time string)
│  ├─ Conditionally Cleared Date (date)
│  ├─ Fully Clearance Date (date)
│  ├─ Date Documents Uploaded (date)
│  ├─ Findings (if any) (text)
│  ├─ Comments (if any) (text)
│  └─ Reasons for Delay (text)
└─ Total Rows: 879 clearance records

Sample Data:
  Zachary Barker: Received 12/31/2025, Audited 1/2/2026, Status: Cleared, First response: 7:12 AM
  Clear time: 11:47 AM, Documents uploaded 1/2/2026

SCORECARD MAPPING:
├─ Summary Grid: Team Member (Audited By) | Total Cleared | Avg Clear Time (hours) | Current Status
├─ Click to Expand: Individual clearance records with timeline
├─ Calculation: Clear Time = Time Cleared - Time Received; Count cleared vs total
├─ Formula: Avg Clear Time = Sum(Time Cleared - Time Received) / Count(Cleared)
└─ Visual: Timer badge showing average hours to clear
```

---

### 8. **Data_Changes_Tracker.xlsx**
```
Structure: Data Change Requests
┌─ Columns:
│  ├─ Data Changes Received Date (date)
│  ├─ Start ID/VMS (numeric)
│  ├─ Candidate Name (string)
│  ├─ Client (string)
│  ├─ DOJO (string)
│  ├─ Data Change Type (string: "Address Change", "DD change", etc.)
│  ├─ Assigned to (string: Team Member Name)
│  ├─ Data Change Completed Date (date)
│  ├─ P3 Raised Date (date)
│  ├─ P3# (string: "P3 number")
│  ├─ Comments (text)
│  ├─ 1st Followup to 5th follow up (dates)
│  └─ (Columns 1st-5th Followup)
└─ Total Rows: 246 data change records

Sample Data:
  Zahira Samalot: Received 1/8/2026, Completed 1/8/2026, Address Change (same day)
  Nicholas Dillon: Received 1/16/2026, Completed 1/16/2026

SCORECARD MAPPING:
├─ Summary Grid: Team Member | Total Changes | Completed | Pending | Avg Completion Time
├─ Click to Expand: Breakdown by change type with followup history
├─ Formula: Completion Time = Completed Date - Received Date
├─ Status: Show pending if no completion date
└─ Visual: Count badge
```

---

### 9. **Tenure_Discount_Audit_Tracker.xlsx**
```
Structure: Audit Cycles with Pending Counts
┌─ Columns:
│  ├─ S.No (numeric)
│  ├─ Audit Cycle (string: "Jan - Week 1", "Jan - Week 2", etc.)
│  ├─ Team Member (string: "Arjun/Ingrid" - multiple people)
│  ├─ Audits Assigned Count (numeric)
│  ├─ Audits Completed Date (date)
│  ├─ Pending (numeric)
│  ├─ Status (string: "Pending", "Completed")
│  └─ Remarks (text: reason for pending)
└─ Total Rows: 17 audit cycle records

Sample Data:
  Arjun/Ingrid: Cycle 1 (Jan W1) - 4 assigned, 7 pending, Status: Pending, Remarks: No response
  Arjun/Ingrid: Cycle 2 (Jan W2) - 47 assigned, 14 pending, Status: Pending

SCORECARD MAPPING:
├─ Summary Grid: Team Member (split Arjun/Ingrid) | Total Pending | Pending % | Status
├─ Click to Expand: Cycle-by-cycle breakdown with remarks
├─ Calculation: Pending % = (Pending / Assigned * 100)
├─ Note: Team Member column contains multiple people - need to split
└─ Visual: Badge showing pending count and percentage
```

---

### 10. **Termination_Tracker.xlsx**
```
Structure: Employee Terminations (Large dataset)
┌─ Columns:
│  ├─ Term Tracker Updated (date)
│  ├─ Date when HR was Notified (date)
│  ├─ GP ID (numeric)
│  ├─ Benefit status (string)
│  ├─ Payroll (string)
│  ├─ P3 (string: P3 ticket number)
│  ├─ Candidate Name (string)
│  ├─ Hire Type (string: "W2", "C2C")
│  ├─ End Date (date)
│  ├─ Term Status (string: "Assignment Ended", "Resigned with notice", etc.)
│  ├─ Worker Pay Company (string: "RTA US")
│  ├─ Work Location State (string: "Atlanta, GA")
│  ├─ Job Title (string)
│  ├─ Client Name (string)
│  └─ Placement # (numeric)
└─ Total Rows: 738 termination records

Sample Data:
  DayVon Burton: End Date 12/31/2025, Assignment Ended, Atlanta, GA
  Yongdong Zhang: End Date 1/2/2026, Resigned (Better Opportunity), Jersey City, NJ

SCORECARD MAPPING:
├─ Summary Grid: Team (by processing team) | Total Terminations | Pending HR Process | Avg Days to Process
├─ Click to Expand: Termination details by reason and location
├─ Calculation: Days to Process = HR Notified Date - Term Tracker Updated
├─ Status: Track benefit/payroll/P3 status for completion
└─ Visual: Count badge
```

---

### 11. **Internal_Audit_Tracker.xlsx** ⚠️
```
⚠️ STATUS: File appears to be corrupted or empty
- No column headers detected
- 1145 rows but no data structure
- RECOMMENDATION: Skip or re-upload clean version
```

---

### 12. **QMG_Error_Tracker.xlsx** ⚠️
```
⚠️ STATUS: File structure issue
- Only 1 column: "Noncustomer affecting error"
- Appears to be malformed data (S.No, 1, 2 as data instead of headers)
- RECOMMENDATION: Check if file was exported correctly
```

---

### 13. **Internal_Audit_Master_file.xlsx**
```
Structure: Master Audit Schedule
┌─ Columns:
│  ├─ Internal Audits (string: Audit name)
│  ├─ Frequency (string: "Bi-Weekly", "Weekly")
│  ├─ Auditor Name (string)
│  └─ Monthly Columns: 2026-01-01 to 2026-12-01 (Yes/No/- status)
└─ Total Rows: 14 audit types

Sample Data:
  Min wage Audit: Bi-Weekly, Auditor: Banupriya, Jan: No, Feb: -, Mar: -, Apr: Yes
  Mark Audit: Weekly, Auditor: Banupriya, Jan: Yes, Feb: No, Mar: No, Apr: Yes

SCORECARD MAPPING:
├─ Summary Grid: Auditor Name | Audit Types Assigned | Completion Rate | Current Status
├─ Click to Expand: Monthly completion schedule by audit type
├─ Calculation: Completion Rate = Count(Yes) / Count(scheduled)
└─ Visual: Status indicator (Yes/No/-)
```

---

## 📋 Scorecard Grid Layout Design

### Grid 1: Quality Score (Multiple Sources)
```
SUMMARY VIEW (Minimal - Single Row):
┌──────────────────┬────────────────┬─────────────┬──────────┐
│ Team Member      │ Quality Score  │ Audits Done │ Errors   │
├──────────────────┼────────────────┼─────────────┼──────────┤
│ Anubha Priyam    │ 92% (🟢)       │ 159/159     │ 2 (WC11) │
└──────────────────┴────────────────┴─────────────┴──────────┘

CLICK ROW → DETAILED VIEW:
┌─ Client System Audits
│  ├─ Cycle 01-15 Jan: 159 assigned, 159 completed ✓
│  ├─ Cycle 16-31 Jan: [pending data]
│  └─ Completion Rate: 100%
│
├─ Internal Audit Errors
│  ├─ WC 11th Jan: 2 NCA errors (Start date incorrect)
│  ├─ WC 18th Jan: [pending data]
│  └─ Error Details: [expandable]
│
└─ Overall Quality Score = 92%
   Formula: (Audits Completed % * 0.6) + (100 - Error Rate * 0.4)
```

---

### Grid 2: NH/BG Pending
```
SUMMARY VIEW (Minimal - Single Row):
┌──────────────────┬──────────────┬─────────────┬──────────────┐
│ Team Member      │ NH Pending   │ Avg Days    │ Status       │
├──────────────────┼──────────────┼─────────────┼──────────────┤
│ Banupriya        │ 8 pending    │ 15 days avg │ 🔴 > 10 days │
└──────────────────┴──────────────┴─────────────┴──────────────┘

CLICK ROW → DETAILED VIEW:
┌─ Pending Cases (8 total)
│  ├─ Karen Papa (Start 1/5/26) - 21 days pending
│  │  └─ Reason: I9 correction, VMS ID
│  ├─ Cameron Bruce (Start 1/5/26) - 18 days pending
│  │  └─ Reason: Location/work mode, fed start date
│  ├─ Meagan Campbell (Start 1/5/26) - 36 days pending
│  │  └─ Reason: List B doc title, physical address
│  └─ [5 more cases...]
│
└─ Timeline View
   Oldest: 36 days (Meagan Campbell)
   Average: 15 days
   Newest: 3 days
```

---

### Grid 3: Process Knowledge Tests
```
SUMMARY VIEW (Minimal - Single Row):
┌──────────────────┬─────────────┬──────────────┬──────────┐
│ Team Member      │ Current (%) │ Average (%)  │ Trend    │
├──────────────────┼─────────────┼──────────────┼──────────┤
│ Anubha Priyam    │ 95% (🟢)    │ 95% (🟢)     │ → Stable │
└──────────────────┴─────────────┴──────────────┴──────────┘

CLICK ROW → DETAILED VIEW:
┌─ Monthly Test Scores
│  ├─ Jan 2026: 95%  (Excellent)
│  ├─ Feb 2026: 95%  (Excellent)
│  ├─ Mar 2026: 95%  (Excellent)
│  └─ Trend: Consistent high performance
│
└─ Performance Rating: Excellent (≥90%)
   Average Score: 95%
   Consistency: Very High (0% variance)
```

---

### Grid 4: Additional Modules (Summary Cards)

```
ATTENDANCE MODULE:
┌──────────────┬──────────┬─────────────┬─────────────────┐
│ Team Member  │ Current  │ YTD Average │ Status          │
├──────────────┼──────────┼─────────────┼─────────────────┤
│ Anubha       │ 1 abs    │ 2.2 abs/mo  │ 🟡 Monitoring   │
└──────────────┴──────────┴─────────────┴─────────────────┘
🔍 Click: View detailed monthly breakdown

PRODUCTION TRACKER:
┌──────────────┬──────────┬─────────────┬──────────────────┐
│ Team Member  │ Current  │ YTD Total   │ vs Target        │
├──────────────┼──────────┼─────────────┼──────────────────┤
│ Anubha       │ 8 units  │ 24 units    │ 🟢 100% (target) │
└──────────────┴──────────┴─────────────┴──────────────────┘
🔍 Click: View monthly breakdown

FINAL CLEARANCE:
┌──────────────┬──────────┬─────────────┬──────────────────┐
│ Team Member  │ Cleared  │ Avg Time    │ Status           │
├──────────────┼──────────┼─────────────┼──────────────────┤
│ Aswani       │ 142      │ 3.5 hours   │ 🟢 Fast          │
└──────────────┴──────────┴─────────────┴──────────────────┘
🔍 Click: View clearance timeline

DATA CHANGES:
┌──────────────┬──────────┬─────────────┬──────────────────┐
│ Team Member  │ Pending  │ Completion  │ Avg Days         │
├──────────────┼──────────┼─────────────┼──────────────────┤
│ Arjun        │ 2        │ 2 completed │ Same day         │
└──────────────┴──────────┴─────────────┴──────────────────┘
🔍 Click: View pending items with details
```

---

## 🔢 Data Aggregation Logic

### For Team Members (Multiple Data Sources)
```
Some columns have composite team member names like "Arjun/Ingrid"
SOLUTION: 
1. Parse by "/" delimiter
2. Create separate records for each person
3. Aggregate metrics by individual

Example:
"Arjun/Ingrid" with Pending: 7
→ Creates two records if not found elsewhere
→ Distributes pending count or marks both as involved
```

### For Monthly Data (Attendance, Production, PKT)
```
Column Structure: Team Member | Jan | Feb | Mar | ... | Dec

SUMMARY CALCULATION:
- Current Month: Latest non-empty value
- YTD Total: Sum of all non-empty months
- Average: Sum / Count of non-empty months
- Trend: Compare current to previous month

EMPTY CELLS:
- Represented as None/null
- Skip in calculations
- Indicates future months (not yet data)
```

### For Date-Based Data (Clearance, Changes, NH)
```
SUMMARY CALCULATION:
- Count Total: Sum of all records for team member
- Count Completed: Sum of records with completion date
- Days to Complete: Average of (Completion Date - Start Date)
- Pending: Count of records without completion date

COLOR CODING:
- 🟢 Green: ≥ Target or Good performance
- 🟡 Yellow: 80-99% of target or Caution
- 🔴 Red: < 80% of target or Alert
```

---

## 📱 UI Components for Click-to-Expand

### Summary Row (Always Visible)
```html
<tr class="summary-row" onclick="toggleDetails(this)">
  <td class="team-member">👤 Team Member Name</td>
  <td class="metric-1">📊 Main Score/Count</td>
  <td class="metric-2">📈 Secondary Metric</td>
  <td class="metric-3">⚠️ Status Badge</td>
  <td class="expand-icon">▼</td>
</tr>
```

### Detailed Row (Hidden, Expands on Click)
```html
<tr class="detail-row" style="display: none;">
  <td colspan="5" class="detail-content">
    <div class="detail-section">
      <h4>Audit Breakdown</h4>
      <ul>
        <li>Cycle 1: 159/159 completed ✓</li>
        <li>Cycle 2: [pending]</li>
      </ul>
    </div>
    <div class="detail-section">
      <h4>Timeline</h4>
      <p>Avg completion: 3 days</p>
    </div>
  </td>
</tr>
```

---

## 🎨 Visual Indicators

### Score Badges
```
🟢 GREEN  (≥85%):  "Excellent" / "On Track"
🟡 YELLOW (70-84%): "Good" / "Monitor" / "Caution"
🔴 RED    (<70%):  "Below Target" / "Alert"
⚪ GRAY   (N/A):   "No Data" / "Not Applicable"
```

### Status Icons
```
✓  Completed / Cleared / On Time
✗  Failed / Blocked / Overdue
⏳ Pending / In Progress / Awaiting
→  No Change / Stable
↑  Improved / Trending Up
↓  Declined / Trending Down
```

---

## 📊 Recommended Scorecard Structure

### Tab 1: Manager Overview
- KPI Cards (Overall Score, Target %, Meeting Target, Below Target)
- Summary Grid: All team members with main metrics
- Charts: Trend lines and category breakdown

### Tab 2: Quality & Compliance
- Quality Score Grid (from Client Audit + Internal Errors)
- Click for detailed audit history
- Error breakdown by type and auditor

### Tab 3: Onboarding & Clearance
- NH Pending Cases Grid
- Final Clearance Metrics
- Timeline visualization

### Tab 4: Operational Metrics
- Process Knowledge Tests
- Production Tracker
- Data Changes
- Attendance

### Tab 5: Audit Schedule
- Internal Audit Master (scheduled audits)
- Tenure Discount Audits (pending counts)
- Audit completion status by auditor

---

## 🔗 Data Relationships

```
Files with Employee Names:
├─ Attendance.xlsx → "Team Member" (direct)
├─ Process_Knowledge_Test.xlsx → "Team Member" (direct)
├─ Production_Tracker.xlsx → "Team Member" (direct)
├─ Client_System_Audit_Tracker.xlsx → "Team Member" (direct)
├─ New_NH_pending_Tracker.xlsx → "Processor", "Auditor" (roles)
├─ Final_Clearance_Tracker.xlsx → "Audited By", "OB Team Name" (roles)
├─ Data_Changes_Tracker.xlsx → "Assigned to" (direct)
├─ Tenure_Discount_Audit_Tracker.xlsx → "Team Member" (composite: "Arjun/Ingrid")
├─ Termination_Tracker.xlsx → "Candidate Name" (not team, skip)
├─ Internal_Audit_Scores.xlsx → "Auditor who made error" (parse from text)
└─ Internal_Audit_Master_file.xlsx → "Auditor Name" (direct)

RECOMMENDATION: 
Map role-based columns (Processor, Auditor, Assigned to) to team member names
for aggregated scorecard view
```

---

**Document Status:** Complete
**Ready for:** Scorecard Implementation
**Last Updated:** June 15, 2026

