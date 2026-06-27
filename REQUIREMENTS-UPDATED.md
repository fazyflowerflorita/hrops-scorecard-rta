# HR Operations Scorecard System – Updated Requirements
## Based on Questionnaire Analysis & Excel Data Structure

---

# 1. 🎯 Objective

To design and develop a web-based HR Operations Scorecard System that enables:

- **Centralized performance tracking** across 5 teams with team-specific weightages
- **Monthly performance calculation** leading to Quarterly and Annual aggregation
- **Multi-team employee assignment** (employees can perform multiple roles/teams)
- **Role-based dashboards** (Manager & Associate views)
- **Performance analytics** with trend analysis and category breakdowns
- **Feedback & recognition** (Appreciation, Areas of Improvement)
- **Downloadable reports and certificates** (PDF/Excel)

---

# 2. 👥 User Roles & Access

## 👨‍💼 Manager View

**URL:** `/manager.html`

**Access Level:** All team members & aggregated team data

**Capabilities:**
- Filter by Team (5 teams)
- Filter by Employee
- Select time period (Day/Week/Month/Year)
- View individual and team performance
- Add Appreciation notes
- Add Areas of Improvement notes
- Generate certificates (PDF)
- Export scorecard (Excel/PDF)
- View trend analysis

---

## 👩‍💼 Associate View

**URL:** `/associate.html?empId=XXXX`

**Access Level:** Individual performance only

**Capabilities:**
- View personal scorecard
- View performance trends
- Read Appreciation feedback
- Read Improvement feedback
- View certificates
- Download certificates (PDF)
- View personal trends

---

# 3. 🧩 Overall Score Calculation

## 3.1 Score Components

The **Overall Score** is calculated from **5 key metrics:**

1. **Quality Score** (Internal + External QMG)
2. **Attendance Score** (Planned leaves only)
3. **Productivity Score** (8 hrs/day × working days)
4. **Process Knowledge Test (PKT)** (Monthly test %)
5. **NH/BG Pending Cases** (Count-based penalty)

---

## 3.2 Team-Specific Weightages

**Weightages vary by team and target bands:**

| Target Band | Classification | Attendance Weight | Quality Weight | Productivity Weight | PKT Weight | NH/BG Weight |
|---|---|---|---|---|---|---|
| <70% | Data Management Entry (DME) | 25% | 30% | 25% | 15% | 5% |
| 70-90% | Management Entry (ME) | 20% | 35% | 20% | 15% | 10% |
| 90-95% | Senior Entry (SE) | 15% | 40% | 15% | 20% | 10% |
| >95% | Expert (EP) | 10% | 45% | 10% | 20% | 15% |

**Team Assignment:**
- Compliance Team: Based on role complexity
- Final Clearance Team: Based on role complexity
- HR Operations Team: Based on role complexity
- Internal Audit Team: Based on role complexity
- Paperwork Audit Team: Based on role complexity

---

## 3.3 Performance Target Classification

| Score Range | Classification | Status | Color |
|---|---|---|---|
| ≥95% | Excellent (EP) | Meeting Target | Green |
| 90-94% | Very Good (SE) | Meeting Target | Green |
| 70-89% | Good (ME) | Meeting Target | Blue |
| <70% | Below Target (DME) | Below Target | Red |

---

# 4. 📊 Detailed Metric Requirements

## 4.1 Quality Score (40% weightage for SE)

### Data Sources:
- **Internal Quality:** Internal Audit Tracker.xlsx (98.50% target)
- **External Quality:** QMG Error Tracker.xlsx (99.50% target)

### Components:

**Internal Quality Calculation:**
- Source: Internal Audit Master File & Internal Audit Scores.xlsx
- Based on: Audit completion & accuracy
- SLA: 98.50% target

**External Quality Calculation:**
- Source: QMG Error Tracker.xlsx
- Error Categories:
  - **CA (Customer Affecting):** Higher weightage
  - **NCA (Non-Customer Affecting):** Lower weightage
- Error Penalties:
  - First occurrence: -1 point
  - Repeated errors: -2 points (leads to PIP)
- SLA: 99.50% target

### Formula:
```
Quality Score = (Internal Quality Score × 50%) + (External Quality Score × 50%)
```

### Dashboard Display:
- Quality Score (%)
- No. of Audits (completed/assigned)
- Error Count (CA vs NCA breakdown)
- Comments: Error % for week, month, quarter, and annually
- Trend: Monthly quality progression

---

## 4.2 Attendance Score (20% weightage for ME)

### Data Source:
- Attendance - 2026.xlsx

### Rules:
- **Tracked Metric:** Unplanned leaves only
- **Planned Leaves:** Excluded (approved leaves not counted against score)
- **Calculation Method:** No unplanned leaves = 100%
- **Penalty Per Unplanned Leave:** Deduct % based on total working days

### Formula:
```
Attendance % = (Working Days - Unplanned Leaves) ÷ Total Working Days × 100
```

### Target:
- 100% (zero unplanned leaves)

### Dashboard Display:
- Attendance %
- Unplanned Leaves Count (monthly)
- Trend: Monthly attendance tracking
- Status: On-track / At-risk

---

## 4.3 Productivity Score (20% weightage for ME)

### Data Source:
- Production Tracker - 2026.xlsx

### Rules:
- **Daily Target:** 8 hours per day
- **Monthly Target:** 8 hrs/day × number of working days
- **Calculation:** Actual Production ÷ Target × 100
- **Cap:** Maximum 100% (no excess credit)

### Formula:
```
Productivity % = (Actual Hours Worked) ÷ (8 × Working Days) × 100
Capped at 100%
```

### Dashboard Display:
- Productivity Score (%)
- Units Produced (monthly)
- Monthly breakdown
- Trend: Month-over-month productivity

---

## 4.4 Process Knowledge Test (PKT) (15% weightage)

### Data Source:
- Process Knowledge Test - 2026.xlsx

### Rules:
- **Frequency:** 1 test per month
- **Values:** Already percentages (0-100%)
- **Passing Score:** 80%
- **Failed Tests:** Treated as 0%
- **Multiple Tests in Month:** Not applicable (only 1 per month)
- **Missed Tests:** Treated as 0%

### Dashboard Display:
- Latest PKT Score (%)
- Monthly average
- Year-to-date average
- Pass/Fail status
- Trend: Monthly test progression
- Alert: Red flag if <80%

---

## 4.5 NH/BG Pending Cases (5-15% weightage by role)

### Data Source:
- New NH Pending Tracker _ 2026.xlsx

### Rules:
- **Assignment:** Both Processor AND Auditor (dual responsibility)
- **Pending Definition:** Cases in "Pending" status in NH tracker
- **Aging Penalty:** Older pending cases carry higher penalty
- **Start Date:** Used as pending start reference
- **Separate Reporting:** Pending from our end vs candidate's end NOT separated
- **Historical Tracking:** Completed cases remain in trends

### Scoring Logic:
```
NH/BG Score = 100 - (Pending Count × Aging Factor)
Aging Factor increases with days pending:
  0-7 days: -1 point per case
  8-14 days: -2 points per case
  15-30 days: -3 points per case
  30+ days: -5 points per case
```

### Dashboard Display:
- Pending Count
- Completed Count
- Pending Duration (oldest first)
- Weekly/Monthly pending rate
- Trend: Pending vs Completed progression

---

# 5. 🧩 Dashboard Layout Requirements

## 5.1 Header Section

**Components:**
- Title: "HR Operations Scorecard"
- Filters (Manager only):
  - Team selector (5 teams)
  - Employee selector (from selected team)
- Date Selector:
  - Daily View
  - Weekly View
  - Monthly View
  - Yearly/Annual View

---

## 5.2 KPI Summary Cards

**Display:**
- **Total Employees** (in selected filter)
- **Average Overall Score** (%)
- **Employees Meeting Target** (count)
- **Employees Below Target** (count)

---

## 5.3 Scorecard Grid Sections

### Grid 1: Quality Score Card
| Team Member | Internal Quality | External Quality | Overall Quality | No. of Audits | CA Errors | NCA Errors | Status |
|---|---|---|---|---|---|---|---|
| Name | % | % | % | Count | Count | Count | Color |

**Additional Display:** Error % breakdown (weekly, monthly, quarterly, annually)

---

### Grid 2: Attendance Card
| Team Member | Working Days | Unplanned Leaves | Attendance % | Status | Trend |
|---|---|---|---|---|---|
| Name | Count | Count | % | On-track/Risk | ↑/↓ |

---

### Grid 3: Productivity Card
| Team Member | Target (8hrs/day) | Actual Hours | Productivity % | Units Produced | Status |
|---|---|---|---|---|---|
| Name | Hours | Hours | % | Count | Color |

**Cap at 100%**

---

### Grid 4: Process Knowledge Test Card
| Team Member | Latest Score | Monthly Avg | YTD Avg | Status | Trend |
|---|---|---|---|---|---|
| Name | % | % | % | Pass/Fail | ↑/↓ |

**Alert:** Red flag if score <80%

---

### Grid 5: NH/BG Pending Card
| Team Member | Total Pending | Oldest Pending (Days) | Completed | Pending % | Status |
|---|---|---|---|---|---|
| Name | Count | Days | Count | % | Color |

**Aging Penalty Applied**

---

## 5.4 Overall Score Display

**Format:**
- Large card with overall score (%)
- Color coding (Green/Blue/Red)
- Classification badge (EP/SE/ME/DME)
- Components breakdown:
  - Quality: XX%
  - Attendance: XX%
  - Productivity: XX%
  - PKT: XX%
  - NH/BG: XX%

---

# 6. 📉 Analytics & Visualization

## 6.1 Trend Charts (Required)

**Line Chart:**
- **Title:** "Performance Trend"
- **Y-axis:** Score (%)
- **X-axis:** Time (Day/Week/Month/Year)
- **Lines:** Overall Score, Quality, Attendance, Productivity, PKT
- **Legend:** Color-coded per metric

---

## 6.2 Category Breakdown Charts (Required)

**Bar/Donut Chart:**
- **Title:** "Score Distribution"
- **Categories:**
  - Quality (40%)
  - Attendance (20%)
  - Productivity (20%)
  - PKT (15%)
  - NH/BG (5-15%)
- **Display:** % contribution to overall score

---

## 6.3 Team Comparison (Optional)

**Bar Chart:**
- Compare average scores across 5 teams
- Identify high/low performing teams

---

# 7. 💬 Feedback Module

## Manager Input
**For each employee:**

| Field | Requirement |
|---|---|
| Appreciation | Text (250 char max) |
| Areas of Improvement | Text (250 char max) |
| Date | Auto-populated (current date) |

**Storage:** Firebase Realtime DB at `/feedback/{empId}`

---

## Associate View
**Read-only display:**
- Appreciation notes
- Improvement notes
- Date of feedback

---

# 8. 🏆 Certificate Module

## Manager Capabilities
**To generate certificate:**
- Select Employee
- Enter Certificate Title
- Enter Custom Message
- Generate PDF

**Format:**
- Professional certificate layout
- Employee Name
- Team
- Achievement Date
- Manager Signature area
- Company Logo

---

## Associate Capabilities
- View generated certificates
- Download certificate (PDF)

---

# 9. 📤 Data Management

## Data Upload (Manager only)

**Upload Method:**
- Excel file upload per module:
  - Quality (Internal Audit + QMG)
  - Attendance
  - Productivity
  - Process Knowledge Test
  - NH/BG Pending

**Processing Flow:**
```
Upload Excel → Parse Data → Validate → Store in Firebase → 
Calculate Monthly Scores → Update Dashboard → Generate Trends
```

---

## Data Validation

**Rules:**
- Employee name matching across files (use Emp ID where available)
- Handle spelling variations (first name matching)
- Exclude missing metrics from calculation
- Monthly data aggregation only
- Values capped at 100% where applicable

---

# 10. 📊 Time-Based Aggregation

**System Support:**

| Period | Calculation | Usage |
|---|---|---|
| Daily | Real-time (if applicable) | For live updates |
| Weekly | 7-day rolling average | Quick trends |
| Monthly | Month-end aggregation | Primary metric |
| Quarterly | 3-month average | Mid-year review |
| Annual | 12-month average | Year-end assessment |

---

# 11. 📥 Export & Download

**Users can export:**

1. **Scorecard (Excel)**
   - Individual employee scorecard
   - Team scorecard
   - All metrics included

2. **Scorecard (PDF)**
   - Individual/Team summary
   - Charts included
   - Print-ready format

3. **Certificates (PDF)**
   - Generated certificates
   - Downloadable per employee

---

# 12. 🔐 Access Method

**No authentication system**

**Access via:**

**Manager:**
```
/manager.html
```

**Associate (Employee-specific):**
```
/associate.html?empId=XXXX
```

---

# 13. 🎨 UI/UX Requirements

## Layout
- Grid-based responsive design
- Card-style containers
- Rounded corners (8px)
- Soft shadows (0 2px 8px rgba)
- Modern, clean appearance

---

## Color Coding

| Status | Color | Score Range |
|---|---|---|
| Excellent | Green (#10b981) | ≥90% |
| Good | Blue (#3b82f6) | 70-89% |
| Warning | Yellow (#f59e0b) | 50-69% |
| Below Target | Red (#ef4444) | <50% |

---

## Responsive Design
- Desktop: Full layout
- Tablet: Adjusted grid (2 columns)
- Mobile: Single column, stacked cards

---

# 14. 👨‍💻 Employee Identification & Multi-Team Assignment

## Rules

**Employee Matching:**
- Primary: Employee ID (Emp ID)
- Secondary: First name + Last name matching
- Handle capitalization & spelling variations

**Multi-Team Assignment:**
- Employees CAN belong to multiple teams
- Scorecard shows metrics from ALL teams where they worked
- Aggregated score reflects total contribution
- Each team has its own performance grid

**Example:**
```
Anubha Priyam:
- Final Clearance Team (Primary)
- Quality Audit (Secondary)
→ Shows combined metrics from both teams
```

---

# 15. 🚀 Implementation Phases

## Phase 1: MVP (Current)
- Basic scorecard display
- 5 metrics calculation
- Team filtering
- Export functionality

---

## Phase 2: Enhanced
- Feedback module
- Certificate generation
- Advanced analytics
- Trend charts

---

## Phase 3: Future
- Performance badges
- Automated alerts
- Predictive analytics
- Mobile app

---

# 16. 📋 Data Sources & File Mappings

| Metric | Excel File | Sheet | Key Columns |
|---|---|---|---|
| Quality (Internal) | Internal Audit Scores.xlsx | Active | Employee, Score, Date |
| Quality (External) | QMG Error Tracker.xlsx | Active | Employee, Error Type, Date |
| Attendance | Attendance - 2026.xlsx | Monthly | Team Member, Unplanned Leaves |
| Productivity | Production Tracker - 2026.xlsx | Monthly | Team Member, Hours/Units |
| PKT | Process Knowledge Test - 2026.xlsx | Monthly | Team Member, Score, Date |
| NH/BG Pending | New NH pending Tracker _ 2026.xlsx | Active | Processor, Auditor, Status, Date |

---

# 17. ⚠️ Business Rules Summary

1. **Weightages are team-specific** – No one-size-fits-all
2. **Monthly calculation** → Quarterly & Annual aggregation
3. **Quality = Internal + External (50-50)** with CA errors weighted higher
4. **Attendance = No unplanned leaves** (planned leaves excluded)
5. **Productivity = Capped at 100%** (8 hrs/day × working days)
6. **PKT = Monthly test, <80% is failure** (treated as 0%)
7. **NH/BG = Aging penalty** (older cases penalized more)
8. **Multi-team employees** show combined metrics
9. **Missing metrics excluded** from overall calculation
10. **Scores capped at 100%** maximum

---

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Status:** Approved for Development
