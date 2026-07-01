# Integrate Excel Processor into Admin Dashboard

## What You Have

`excel-processor.js` - JavaScript file that:
- Reads Excel files when uploaded
- Processes each team's specific requirements
- Generates JSON with all 5 teams' scorecards
- Saves to Firebase

## How to Add to Your Admin Dashboard

### Step 1: Add the Script

In your `admin.html`, add these lines before closing `</body>`:

```html
<!-- SheetJS for Excel reading -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"></script>

<!-- Your Excel Processor -->
<script src="excel-processor.js"></script>
```

### Step 2: Add Upload Handler

In your admin dashboard, create an upload area:

```html
<div id="uploadArea">
  <input type="file" id="fileInput" multiple accept=".xlsx" onchange="handleUpload(event)">
  <button onclick="processAndSave()">Generate Scorecards</button>
  <button onclick="downloadResults()">Download JSON</button>
</div>
```

### Step 3: Add JavaScript Functions

```javascript
let processor;

function handleUpload(event) {
  const files = event.target.files;
  processor = new ExcelProcessor();
  processor.processFiles(files);
}

function processAndSave() {
  if (!processor) return alert('Please upload files first');
  
  // Save to Firebase
  const firebaseDb = firebase.database();
  processor.saveToFirebase(firebaseDb).then(() => {
    alert('✅ Scorecards saved to Firebase!');
    // Trigger dashboard refresh
    location.reload();
  });
}

function downloadResults() {
  if (!processor) return alert('Please generate scorecards first');
  processor.downloadJSON();
}
```

## What Happens When You Upload Files

1. **Upload Excel files** via admin dashboard
2. **JavaScript reads** each file
3. **Processes by team:**
   - Compliance: Productivity, NH Pending, Audit Errors, PKT, Attendance, Client Audit
   - Final Clearance: Productivity, Audit, SLA, Cases, PKT, Attendance, Client Audit
   - Internal Audit: Productivity, NH, QMG Errors (NCA/CA), PKT, Attendance, Client Audit
   - Paperwork: Productivity, NH, Audit, Paperwork SLA, Allocations, PKT, Attendance, Client Audit
   - HR Operations: All teams combined

4. **Generates JSON** with scorecards
5. **Saves to Firebase** at `/scorecards/{team}`
6. **Manager dashboard** automatically refreshes

## Team-Specific Processing

Each team gets processed with THEIR specific requirements:

```
Compliance Team
├── Productivity (≥8 = Green)
├── NH Pending (0 = Eligible)
├── Internal Audit Errors (QMG)
├── PKT (≥90 = Excellent)
├── Attendance %
└── Client Audit (0 = Eligible)

Final Clearance Team
├── Productivity (≥8 = Green)
├── Audit Errors
├── SLA Compliance % (2-day target)
├── Cases Completed
├── PKT (≥90 = Excellent)
├── Attendance %
└── Client Audit (0 = Eligible)

Internal Audit Team
├── Productivity (≥8 = Green)
├── NH Pending (0 = Eligible)
├── NCA Errors
├── CA Errors
├── PKT (≥90 = Excellent)
├── Attendance %
└── Client Audit (0 = Eligible)

Paperwork Clearance Team
├── Productivity (≥8 = Green)
├── NH Pending (0 = Eligible)
├── Audit Errors
├── Paperwork SLA %
├── Allocations
├── PKT (≥90 = Excellent)
├── Attendance %
└── Client Audit (0 = Eligible)

HR Operations
└── All employees, all metrics
```

## JSON Output Structure

```json
{
  "Compliance": [
    {
      "Employee Name": "Sayee Nivas B",
      "Productivity Hours": 8.2,
      "Productivity Status": "Green",
      "NH Pending Count": 0,
      "NH Eligibility": "Eligible",
      "Audit Errors": 0,
      "Audit Status": "Green",
      "PKT Score": 92,
      "PKT Rating": "Excellent",
      "Attendance %": 95,
      "Client System Pending": 0,
      "Overall Score": 92.5,
      "Overall Rating": "Excellent",
      "Incentive Eligible": "Eligible",
      "Remarks": "On Track"
    }
  ],
  "Final Clearance": [...],
  "Internal Audit": [...],
  "Paperwork Clearance": [...],
  "HR Operations": [...]
}
```

## Firebase Path

All scorecards are saved at:
```
/scorecards/Compliance
/scorecards/Final Clearance
/scorecards/Internal Audit
/scorecards/Paperwork Clearance
/scorecards/HR Operations
```

Your manager dashboard can read from these paths directly.

## That's It!

1. Add `excel-processor.js` to your project
2. Add the HTML upload area
3. Add the JavaScript functions
4. Upload Excel files in admin dashboard
5. Click "Generate Scorecards"
6. Results save to Firebase automatically

**All processing happens in browser. All calculations are team-specific. All requirements met.**

---

## Files You Need

- `excel-processor.js` - The processor (provided)
- Your existing `admin.html` - Just add the integration code above
- Excel files - Upload through the admin dashboard

That's all. No changes to your existing system structure.
