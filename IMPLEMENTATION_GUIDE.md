# HR Operations Scorecard System - Implementation Guide

## 📋 Overview

This comprehensive guide provides step-by-step instructions to implement the HR Operations Scorecard System using the provided Python script and HTML dashboard.

---

## 🎯 What You Have

### Files Provided:

1. **REQUIREMENTS-UPDATED.md** - Complete functional requirements (17 sections)
2. **HR_Scorecard_Generator.py** - Python script to process Excel files and generate scores
3. **HR_Scorecard_Dashboard.html** - Interactive web dashboard for viewing results

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Python Dependencies

```bash
pip install openpyxl
```

### Step 2: Prepare Excel Files

Ensure you have all 8 Excel files in one folder:

```
your_folder/
├── Attendance.xlsx
├── Client_System_Audit_Tracker.xlsx
├── Data_Changes_Tracker.xlsx
├── New_NH_pending_Tracker.xlsx
├── Process_Knowledge_Test.xlsx
├── Production_Tracker.xlsx
├── Tenure_Discount_Audit_Tracker.xlsx
└── Termination_Tracker.xlsx
```

### Step 3: Run the Generator Script

```bash
python HR_Scorecard_Generator.py
```

When prompted, enter the folder path:
```
C:\path\to\your\folder
```

### Step 4: Verify Output

The script will generate:
- `hr_scorecard_report.json` - Consolidated scorecard data

### Step 5: View Dashboard

1. Open `HR_Scorecard_Dashboard.html` in a web browser
2. Update the sample data with your JSON output
3. View multiple dashboard views

---

## 📊 Dashboard Features

### 6 Main Tabs:

1. **Dashboard**
   - KPI Cards (Total Employees, Avg Score, etc.)
   - Performance Charts
   - Quick Summary

2. **Full Scorecard**
   - Complete employee metrics table
   - All 15 columns with status badges
   - Color-coded performance levels

3. **Leaderboard**
   - Ranked employee list by overall score
   - Top performers highlighted
   - Incentive eligibility status

4. **Needs Attention**
   - Employees with issues flagged
   - Low scores, pending cases
   - Action items listed

5. **Incentive Eligible**
   - Employees eligible for incentives
   - Detailed metrics display
   - Verified no pending items

6. **Analytics**
   - Performance trend charts
   - Distribution analysis
   - Advanced metrics

---

## 🔧 Python Script Details

### Class: HRScorecardGenerator

**Methods:**

```python
def __init__(folder_path)
    # Initialize with Excel folder path

def load_attendance()
    # Process Attendance.xlsx
    # Calculate: attendance %, status

def load_production()
    # Process Production_Tracker.xlsx
    # Calculate: productivity hours, status

def load_pkt()
    # Process Process_Knowledge_Test.xlsx
    # Calculate: PKT score, rating

def load_nh_pending()
    # Process New_NH_pending_Tracker.xlsx
    # Calculate: pending count, eligibility

def load_client_audit()
    # Process Client_System_Audit_Tracker.xlsx
    # Calculate: audit pending, eligibility

def load_data_changes()
    # Process Data_Changes_Tracker.xlsx
    # Calculate: completion %, status

def load_tenure_discount()
    # Process Tenure_Discount_Audit_Tracker.xlsx
    # Calculate: pending count, status

def load_termination()
    # Process Termination_Tracker.xlsx
    # Calculate: days notification taken

def calculate_overall_score()
    # Weighted calculation:
    # - PKT: 40%
    # - Attendance: 20%
    # - Productivity: 20%
    # Total: 80% (can be extended)

def generate_report()
    # Consolidate all metrics
    # Return: List of employee records

def run()
    # Execute all data loading
    # Return: Report + Employee data
```

---

## 📈 Scoring Logic

### Overall Score Calculation

```
Overall Score = (PKT×40% + Attendance×20% + Productivity×20%) / 80%
```

### Rating Classification

| Score | Rating | Status |
|-------|--------|--------|
| ≥90% | Excellent | Green |
| 80-89% | Good | Amber |
| <80% | Needs Improvement | Red |

### Incentive Eligibility

**Eligible IF:**
- NH Pending Count = 0 **AND**
- Client Audit Pending = 0

**Not Eligible IF:**
- NH Pending Count > 0 **OR**
- Client Audit Pending > 0

---

## 📋 Output Format

### JSON Structure

```json
{
  "Employee Name": "Anubha Priyam",
  "Productivity Hours": 8,
  "Productivity Status": "Green",
  "Attendance %": 95,
  "Attendance Status": "Green",
  "PKT Score": 95,
  "PKT Rating": "Excellent",
  "NH Pending": 0,
  "NH Eligibility": "Eligible for Incentive",
  "Audit Pending": 0,
  "Audit Eligibility": "Eligible for Incentive",
  "Data Changes": 5,
  "Tenure Pending": 0,
  "Overall Score": 93,
  "Overall Rating": "Excellent",
  "Incentive Eligible": "Eligible"
}
```

---

## 🔗 Integration Steps

### Step 1: Extract JSON Data

After running the Python script, parse `hr_scorecard_report.json`:

```python
import json

with open('hr_scorecard_report.json', 'r') as f:
    scorecard_data = json.load(f)
```

### Step 2: Convert to JavaScript

Create `scorecard_data.js`:

```javascript
const sampleData = {scorecard_data};
```

### Step 3: Update Dashboard

Replace `sampleData` in HTML with your data:

```html
<script src="scorecard_data.js"></script>
```

### Step 4: View Results

Open HTML in browser to see live dashboard.

---

## ⚙️ Advanced Configuration

### Customize Weightages

Edit `calculate_overall_score()` method:

```python
scores = []
weights = []

# Quality (40%)
if 'pkt_score' in emp:
    scores.append(emp['pkt_score'])
    weights.append(40)  # Change weight here

# Attendance (20%)
if 'attendance_pct' in emp:
    scores.append(emp['attendance_pct'])
    weights.append(20)  # Change weight here

# Productivity (20%)
if 'productivity_hours' in emp:
    prod_score = min((emp['productivity_hours'] / 8) * 100, 100)
    scores.append(prod_score)
    weights.append(20)  # Change weight here
```

### Add New Metrics

1. Create new `load_metric()` method
2. Add to `run()` method
3. Include in `calculate_overall_score()`
4. Update dashboard table

---

## 🐛 Troubleshooting

### Issue: "File not found"

**Solution:**
- Check exact file names match
- Verify folder path is correct
- Ensure all 8 Excel files present

### Issue: "Column not found"

**Solution:**
- Update column indices in script
- Verify Excel sheet structure matches expectations
- Check for hidden rows/columns

### Issue: "Division by zero"

**Solution:**
- Ensure data exists in all files
- Check for empty worksheets
- Verify employee names match across files

### Issue: Dashboard shows empty

**Solution:**
- Convert JSON to JavaScript format
- Verify `sampleData` is defined
- Check browser console for errors

---

## 📊 Excel File Structure

### Attendance.xlsx

```
Column A: Team Member
Column B-M: Jan-Dec (month values = unplanned leaves)
```

### Production_Tracker.xlsx

```
Column A: Team Member
Column B-M: Jan-Dec (month values = hours worked)
```

### Process_Knowledge_Test.xlsx

```
Column A: Team Member
Column B-M: Jan-Dec (month values = test scores %)
```

### New_NH_pending_Tracker.xlsx

```
Sheet: "2026 NH Pending"
Column 3: Candidate Name
Column 7: Processor
Column 8: Auditor
Column 12: Status
```

### Client_System_Audit_Tracker.xlsx

```
Sheet: "Client System Audit"
Column 3: Team Member
Column 8: Pending (count)
```

### Data_Changes_Tracker.xlsx

```
Sheet: "Data change Completed"
Column 7: Assigned to
Column 8: Data Change Completed Date
```

### Tenure_Discount_Audit_Tracker.xlsx

```
Sheet: "Tenure discount audit tracker"
Column 3: Team Member
Column 6: Pending (count)
```

### Termination_Tracker.xlsx

```
Sheets: "Termination RTA", "Termination Pnow"
Column 2: Date when HR was Notified
Column 9: End Date
```

---

## 🎯 KPIs Tracked

| KPI | Source | Formula | Target |
|-----|--------|---------|--------|
| Productivity | Production_Tracker | Hours/8 | ≥8 hrs |
| Attendance | Attendance | Working Days - Leaves | 100% |
| PKT | Process Knowledge Test | Test Score | ≥80% |
| NH Pending | NH Pending Tracker | Count of Pending | 0 |
| Audit Pending | Client Audit | Count of Pending | 0 |
| Quality | Data Changes | Completion % | ≥90% |
| Overall Score | Weighted Average | (PKT×40% + Att×20% + Prod×20%)/80% | ≥80% |

---

## 📈 Future Enhancements

1. **Database Integration**
   - Replace JSON with SQL database
   - Real-time data updates
   - Historical trending

2. **Email Automation**
   - Send scorecard to employees
   - Manager notifications
   - Alert systems

3. **Mobile App**
   - React Native mobile dashboard
   - Push notifications
   - Offline access

4. **Advanced Analytics**
   - Predictive scoring
   - Trend forecasting
   - Anomaly detection

5. **API Integration**
   - REST API for integration
   - Third-party connectors
   - Webhook support

---

## 📞 Support

For issues or questions:

1. Check Troubleshooting section
2. Verify file structure matches requirements
3. Review Python script comments
4. Check browser console for errors

---

## 📝 License & Version

**Version:** 1.0  
**Last Updated:** June 27, 2026  
**Status:** Production Ready

---

## ✅ Checklist

Before deployment:

- [ ] All 8 Excel files downloaded
- [ ] Python 3.8+ installed
- [ ] openpyxl installed (`pip install openpyxl`)
- [ ] Excel files in correct folder
- [ ] Generator script run successfully
- [ ] JSON output generated
- [ ] HTML dashboard opens in browser
- [ ] Sample data displays correctly
- [ ] All tabs functional
- [ ] Charts render properly

---

**Ready to deploy? Follow the Quick Start guide above!** 🚀
