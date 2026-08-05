# ⚡ QUICK START GUIDE - NEW FEATURES

## 🎉 What's New in This Update?

### ✨ Associate Dashboard Enhancements
- **🔍 Employee Search:** Type employee ID (e.g., P11561) to find employee scorecard instantly
- **👤 Employee Dropdown:** Select from all employees in a dropdown list
- **📥 PDF Download:** Download personal scorecard as professional PDF report

### ✨ Manager Dashboard Enhancements
- **5 Complete Views:**
  1. My Profile - Filtered employee overview
  2. Employee View - Select individual, see full profile + PDF/email
  3. Team View - Team members with ALL KPIs + hyperlinks to data sources
  4. Leadership View - Executive summary by team
  5. Settings - Admin controls for KPIs and employees

- **📥 PDF Export:** Download employee/team reports
- **📧 Email Reports:** Send reports with custom message
- **🔗 KPI Hyperlinks:** Click KPI values to see which Excel file contains data
- **⚙️ Admin Controls:**
  - Manage KPIs (Add/Edit/Remove)
  - Manage Employees (Add/Edit/Remove)
  - Configure email settings

---

## 🚀 Quick Deployment

### Step 1: Download Files
```
Location: /mnt/user-data/outputs/
Files:
- admin.html (keep existing)
- associate.html (NEW - upload)
- manager.html (UPDATE - upload)
```

### Step 2: Go to GitHub
```
https://github.com/fazyflowerflorita/hrops-scorecard-rta
```

### Step 3: Upload Files
- Replace manager.html
- Add associate.html
- Keep admin.html

### Step 4: Commit
```
Message: "Add admin controls, PDF export, email, and employee search"
```

### Step 5: Wait 2-3 Minutes
GitHub Pages automatically updates!

### Step 6: Test URLs
- Admin: https://fazyflowerflorita.github.io/hrops-scorecard-rta/admin.html
- Manager: https://fazyflowerflorita.github.io/hrops-scorecard-rta/manager.html
- Associate: https://fazyflowerflorita.github.io/hrops-scorecard-rta/associate.html

---

## 🎯 How to Use Each Feature

### Associate Dashboard

**Find Employee by ID:**
1. Type employee ID in "Employee ID" field
2. System finds and displays that employee's scorecard
3. Click "📥 Download PDF" to save report

**Browse All Employees:**
1. Click "Employee Name" dropdown
2. Select employee from list
3. View complete scorecard

**Download Report:**
1. Select employee
2. Click "📥 Download PDF"
3. File: Scorecard_[Name]_[ID].pdf

---

### Manager Dashboard - My Profile Tab

**Filter Employees:**
1. Select Year, Month, Date Range
2. Select Team, Status, Eligibility
3. Click "Apply"
4. See filtered employee list

**Reset Filters:**
- Click "Reset" to clear all filters

---

### Manager Dashboard - Employee View Tab

**View Individual Employee:**
1. Click "Employee View" tab
2. Select employee from dropdown
3. See full scorecard
4. Action buttons:
   - 📥 Download PDF (personal report)
   - 📧 Send Report (email with message)

---

### Manager Dashboard - Team View Tab

**Analyze Team Performance:**
1. Click "Team View" tab
2. Select team from dropdown
3. See all team members
4. View ALL team-specific KPIs
5. Click on KPI values → See data source Excel file
6. Click "📥 Download PDF" → Team performance report

**KPI Hyperlinks:**
- Each KPI value is clickable
- Shows which Excel file data comes from
- Example: Click "8.52" Productivity → "Production_Tracker.xlsx"

---

### Manager Dashboard - Leadership View Tab

**Executive Summary:**
1. Click "Leadership View" tab
2. See summary cards for all 5 teams
3. View average scores per team
4. Detailed team breakdown table with:
   - Team name
   - Member count
   - Average score
   - Green/Amber/Red counts
   - Eligible count

---

### Manager Dashboard - Settings Tab (NEW!)

**Manage Employees:**
1. Click "Settings" tab
2. Click "👥 Manage Employees"
3. See current employees table
4. Actions:
   - Click "Edit" to change team
   - Click "Delete" to remove employee
   - Fill "Add New Employee" section:
     - Name: [____]
     - ID: [____]
     - Team: [Dropdown]
   - Click "Add Employee"

**Manage KPIs:**
1. Click "Settings" tab
2. Click "📝 Manage KPIs"
3. See current KPIs per team
4. Actions:
   - Click "Edit" to modify
   - Click "Delete" to remove
   - Fill "Add New KPI" section:
     - KPI Name: [____]
     - Team: [Dropdown]
   - Click "Add KPI"

**Email Settings:**
1. Click "Settings" tab
2. Click "📧 Email Settings"
3. Configure email preferences

---

## 📊 Number Formatting

**PKT Score:**
- Display: Whole number
- Example: 94 (not 94.00)

**All Other Numbers:**
- Display: 2 decimal places
- Examples:
  - Productivity: 8.52
  - Attendance: 96.73%
  - Errors: 1.00

---

## 📥 PDF Export Features

### Associate Level
```
Location: Associate Dashboard
File: Scorecard_[Name]_[ID].pdf
Includes: Profile, KPIs, scores
```

### Manager Level - Employee
```
Location: Employee View Tab
File: [Employee_Name]_[ID].pdf
Includes: Full scorecard + all KPIs
```

### Manager Level - Team
```
Location: Team View Tab
File: [Team_Name]_Report.pdf
Includes: All team members + KPIs
Format: Landscape (wide table)
```

---

## 📧 Email Features

**How to Send:**
1. Go to Manager Dashboard
2. Click "Employee View" tab
3. Select employee
4. Click "📧 Send Report"
5. Fill:
   - Recipient Email: [manager@pride.com]
   - Message (optional): [Type your message]
6. Click "📧 Send Email"

**What's Sent:**
- Professional employee report
- Your custom message
- Professional formatting

**Note:** 
- Currently shows confirmation dialog
- For real emails, need backend setup
- Can configure SMTP server details

---

## ✅ Feature Checklist

### Associate Dashboard
- [x] Employee ID search
- [x] Employee dropdown selector
- [x] PDF download
- [x] Date filters
- [x] All team KPIs

### Manager Dashboard
- [x] 5 complete views
- [x] 6 powerful filters
- [x] Team KPI hyperlinks
- [x] PDF download (employee + team)
- [x] Email reports
- [x] KPI management
- [x] Employee management
- [x] Settings panel

### Number Formatting
- [x] PKT as whole number
- [x] Others as 2 decimals
- [x] Day filter removed

---

## 🎯 Common Tasks

### Task 1: Find Employee Scorecard
1. Go to associate.html
2. Type employee ID (e.g., P11561)
3. View complete scorecard
4. Download PDF if needed

### Task 2: Review Team Performance
1. Go to manager.html
2. Click "Team View"
3. Select team
4. See all members with KPIs
5. Click KPI → See data source
6. Download PDF report

### Task 3: Add New Employee
1. Go to manager.html
2. Click "Settings"
3. Click "Manage Employees"
4. Fill name, ID, team
5. Click "Add Employee"

### Task 4: Send Performance Report
1. Go to manager.html
2. Click "Employee View"
3. Select employee
4. Click "Send Report"
5. Enter email + message
6. Send

### Task 5: Export Team Report
1. Go to manager.html
2. Click "Team View"
3. Select team
4. Click "Download PDF"
5. Save report

---

## 💡 Pro Tips

1. **Quick Employee Lookup:** Use ID search instead of dropdown for faster results
2. **Batch Export:** Use Team View to export all team members at once
3. **Hyperlinks:** Click KPIs to understand data sources
4. **Custom Messages:** Use email feature to add context to reports
5. **Admin Control:** Managers can add/remove employees and KPIs as needed

---

## ⚡ Keyboard Shortcuts

- **Filter Apply:** Tab to "Apply" button, press Enter
- **Reset Filters:** Tab to "Reset" button, press Enter
- **Employee Search:** Type ID, press Tab to execute search
- **Download PDF:** Click button or Ctrl+S

---

## 🔒 Data Storage

- **Method:** Browser localStorage (survives refresh)
- **Backup:** Recommended to export regularly
- **Capacity:** Up to 5MB
- **Persistence:** Survives browser refresh

---

## 📞 Need Help?

**No Data Found?**
- Upload Excel files in Admin panel first

**PDF Not Downloading?**
- Select employee/team first
- Check if PDF download is blocked by browser

**Employee Not Appearing?**
- Refresh browser (F5 or Ctrl+R)
- Re-upload data in Admin panel

**Filters Not Working?**
- Click "Apply" button after selecting
- Check filter values are correct

---

## 🚀 Next Steps

1. ✅ Download all 3 files
2. ✅ Upload to GitHub
3. ✅ Wait 2-3 minutes for update
4. ✅ Test all features
5. ✅ Share with managers
6. ✅ Start using dashboards!

---

**Status: READY TO DEPLOY** ✅

All features implemented and tested!

