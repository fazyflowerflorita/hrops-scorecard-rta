# 🏢 Team Management & Scorecard Structure

## Team Configuration

### 5 Teams with Their Trackers

```
INTERNAL AUDIT TEAM
├─ Trackers:
│  ├─ Productivity Tracker
│  ├─ NH Pending
│  ├─ SCP Expenditure Timeline
│  ├─ QMG Audit Score
│  ├─ Audits of Internal Audit Team
│  ├─ Process Knowledge Test
│  ├─ Attendance Tracker
│  └─ Client System Audit
└─ Members: [Employee IDs]

HR OPERATIONS
├─ Trackers:
│  ├─ Productivity Tracker
│  ├─ NH Pending
│  ├─ Data Changes Tracker
│  ├─ Termination Tracker
│  ├─ Tenure Discount Tracker
│  ├─ Process Knowledge Test
│  ├─ Attendance Tracker
│  └─ Client System Audit
└─ Members: [Employee IDs]

COMPLIANCE
├─ Trackers:
│  ├─ Productivity Tracker
│  ├─ NH Pending
│  ├─ Internal Audit Tracker
│  ├─ Process Knowledge Test
│  ├─ Attendance Tracker
│  └─ Client System Audit
└─ Members: [Employee IDs]

PAPERWORK AUDIT
├─ Trackers:
│  ├─ Productivity Tracker
│  ├─ NH Pending
│  ├─ Internal Audit Tracker
│  ├─ Paperwork Clearance SLA & Count
│  ├─ Paperwork allocation Tracker
│  ├─ Process Knowledge Test
│  ├─ Attendance Tracker
│  └─ Client System Audit
└─ Members: [Employee IDs]

FINAL CLEARANCE TEAM
├─ Trackers:
│  ├─ Productivity Tracker
│  ├─ BG Pending
│  ├─ Internal Audit Tracker
│  ├─ Final Clearance SLA & Count
│  ├─ Process Knowledge test
│  ├─ Attendance Tracker
│  └─ Client System Audit
└─ Members: [Employee IDs]
```

---

## Firebase Data Structure

### 1. Teams Collection

```json
{
  "teams": {
    "internal-audit-team": {
      "displayName": "Internal Audit Team",
      "description": "Internal audit and quality management",
      "trackers": [
        "Productivity Tracker",
        "NH Pending",
        "SCP Expenditure Timeline",
        "QMG Audit Score",
        "Audits of Internal Audit Team",
        "Process Knowledge Test",
        "Attendance Tracker",
        "Client System Audit"
      ],
      "members": [
        "P11569",  // Yogeshwaran R
        "P11569",  // Banupriya B
        "P13310"   // M Rihana
      ],
      "created": "2026-01-01T00:00:00Z",
      "updated": "2026-06-15T12:30:00Z"
    },
    
    "hr-operations": {
      "displayName": "HR Operations",
      "description": "HR operations and onboarding",
      "trackers": [
        "Productivity Tracker",
        "NH Pending",
        "Data Changes Tracker",
        "Termination Tracker",
        "Tenure Discount Tracker",
        "Process Knowledge Test",
        "Attendance Tracker",
        "Client System Audit"
      ],
      "members": [
        "P11969",  // Arjun MP
        "P13086",  // Ingrid Mary Pope
        "P13310"   // M Rihana
      ],
      "created": "2026-01-01T00:00:00Z",
      "updated": "2026-06-15T12:30:00Z"
    },
    
    "compliance": {
      "displayName": "Compliance",
      "description": "Compliance and audit operations",
      "trackers": [
        "Productivity Tracker",
        "NH Pending",
        "Internal Audit Tracker",
        "Process Knowledge Test",
        "Attendance Tracker",
        "Client System Audit"
      ],
      "members": [
        "P11561",  // Sayee Nivas B
        "P12976",  // Alan Benjamin
        "P13001"   // Pavithra M
      ],
      "created": "2026-01-01T00:00:00Z",
      "updated": "2026-06-15T12:30:00Z"
    },
    
    "paperwork-audit": {
      "displayName": "Paperwork Audit",
      "description": "Paperwork audit and clearance",
      "trackers": [
        "Productivity Tracker",
        "NH Pending",
        "Internal Audit Tracker",
        "Paperwork Clearance SLA & Count",
        "Paperwork allocation Tracker",
        "Process Knowledge Test",
        "Attendance Tracker",
        "Client System Audit"
      ],
      "members": [
        "P11470",  // Leonie Gomes
        "P12527",  // Shirisha Manobaran
        "P12945"   // Vinish Navinukmar
      ],
      "created": "2026-01-01T00:00:00Z",
      "updated": "2026-06-15T12:30:00Z"
    },
    
    "final-clearance-team": {
      "displayName": "Final Clearance Team",
      "description": "Final clearance operations",
      "trackers": [
        "Productivity Tracker",
        "BG Pending",
        "Internal Audit Tracker",
        "Final Clearance SLA & Count",
        "Process Knowledge test",
        "Attendance Tracker",
        "Client System Audit"
      ],
      "members": [
        "P11279",  // Archana Gautam
        "P11436",  // Aswani R
        "P12210"   // Anubha Priyam
      ],
      "created": "2026-01-01T00:00:00Z",
      "updated": "2026-06-15T12:30:00Z"
    }
  }
}
```

---

### 2. Employees Collection

```json
{
  "employees": {
    "P11561": {
      "name": "Sayee Nivas B",
      "employeeId": "P11561",
      "department": "Operations",
      "team": "Compliance",
      "reportingManager": "Hariharan A",
      "email": "sayee.nivas@pride.com",
      "phone": "+91-XXXXXXXXXX",
      "status": "active",
      "joinDate": "2024-01-15",
      "lastUpdated": "2026-06-15T12:30:00Z"
    },
    
    "P12976": {
      "name": "Alan Benjamin",
      "employeeId": "P12976",
      "department": "Operations",
      "team": "Compliance",
      "reportingManager": "Hariharan A",
      "email": "alan.benjamin@pride.com",
      "phone": "+91-XXXXXXXXXX",
      "status": "active",
      "joinDate": "2024-02-10",
      "lastUpdated": "2026-06-15T12:30:00Z"
    },
    
    "P13001": {
      "name": "Pavithra M",
      "employeeId": "P13001",
      "department": "Operations",
      "team": "Compliance",
      "reportingManager": "Hariharan A",
      "email": "pavithra.m@pride.com",
      "phone": "+91-XXXXXXXXXX",
      "status": "active",
      "joinDate": "2024-01-20",
      "lastUpdated": "2026-06-15T12:30:00Z"
    },
    
    // ... more employees
  }
}
```

---

### 3. Team Audit Log

```json
{
  "team-audit-log": {
    "log-2026-06-15-001": {
      "timestamp": "2026-06-15T12:30:00Z",
      "action": "ADD_MEMBER",
      "teamId": "compliance",
      "teamName": "Compliance",
      "employeeId": "P13005",
      "employeeName": "Latha J",
      "changedBy": "admin@pride.com",
      "reason": "New hire onboarding"
    },
    
    "log-2026-06-15-002": {
      "timestamp": "2026-06-15T13:45:00Z",
      "action": "REMOVE_MEMBER",
      "teamId": "paperwork-audit",
      "teamName": "Paperwork Audit",
      "employeeId": "P12945",
      "employeeName": "Vinish Navinukmar",
      "changedBy": "admin@pride.com",
      "reason": "Transfer to different team"
    },
    
    "log-2026-06-15-003": {
      "timestamp": "2026-06-15T14:15:00Z",
      "action": "EDIT_MEMBER",
      "teamId": "hr-operations",
      "teamName": "HR Operations",
      "employeeId": "P11969",
      "employeeName": "Arjun MP",
      "changes": {
        "reportingManager": "Hariharan A -> New Manager"
      },
      "changedBy": "admin@pride.com",
      "reason": "Reporting manager change"
    }
  }
}
```

---

## Team Member Management Operations

### Operation 1: Add Member to Team

```javascript
async addMemberToTeam(teamId, employeeId) {
  // 1. Validate employee exists
  // 2. Check if already in team
  // 3. Add to team members array
  // 4. Update employee's team field
  // 5. Log change to audit log
  // 6. Sync scorecard
}
```

**Firebase Update:**
```
teams/{teamId}/members → ADD employeeId
employees/{employeeId}/team → UPDATE to teamId
team-audit-log/{logId} → CREATE audit entry
```

---

### Operation 2: Remove Member from Team

```javascript
async removeMemberFromTeam(teamId, employeeId) {
  // 1. Validate member exists in team
  // 2. Remove from team members array
  // 3. Clear employee's team field (or set to null)
  // 4. Log change to audit log
  // 5. Archive associated scorecards
}
```

**Firebase Update:**
```
teams/{teamId}/members → REMOVE employeeId
employees/{employeeId}/team → UPDATE to null
team-audit-log/{logId} → CREATE audit entry
```

---

### Operation 3: Edit Member Details

```javascript
async editMemberDetails(employeeId, updateData) {
  // 1. Validate employee exists
  // 2. Update fields (name, phone, email, reportingManager)
  // 3. Log change to audit log
  // 4. Update in scorecard if necessary
}
```

**Firebase Update:**
```
employees/{employeeId} → UPDATE fields
team-audit-log/{logId} → CREATE audit entry
```

---

### Operation 4: Transfer Member to Different Team

```javascript
async transferMemberToTeam(employeeId, fromTeamId, toTeamId) {
  // 1. Remove from current team
  // 2. Add to new team
  // 3. Update employee team field
  // 4. Archive old scorecards
  // 5. Generate new scorecards
  // 6. Log change
}
```

**Firebase Updates:**
```
teams/{fromTeamId}/members → REMOVE employeeId
teams/{toTeamId}/members → ADD employeeId
employees/{employeeId}/team → UPDATE to toTeamId
team-audit-log/{logId} → CREATE audit entry
scorecard-archive/{oldScorecards} → ARCHIVE
scorecard-details/{employeeId} → REGENERATE
```

---

## Scorecard Generation Flow

### When Team Changes

```
Team Assignment Updates
        ↓
Trigger Scorecard Regeneration
        ↓
Fetch Team-Specific Trackers
        ↓
Load Employee Data from Excel Files
        ↓
Match Data to Team's Trackers
        ↓
Calculate Metrics
        ↓
Generate New Scorecard
        ↓
Update Dashboard in Real-Time
```

---

### Team-Specific Scorecard Example

**COMPLIANCE Team Scorecard:**
```
Trackers Available:
├─ Productivity Tracker ✓
├─ NH Pending ✓
├─ Internal Audit Tracker ✓
├─ Process Knowledge Test ✓
├─ Attendance Tracker ✓
└─ Client System Audit ✓

NOT AVAILABLE FOR THIS TEAM:
├─ Data Changes Tracker (HR Operations only)
├─ Termination Tracker (HR Operations only)
├─ Paperwork Clearance (Paperwork Audit only)
└─ Final Clearance (Final Clearance Team only)
```

---

## Team Member List Structure

```json
{
  "teamId": "compliance",
  "teamName": "Compliance",
  "totalMembers": 3,
  "members": [
    {
      "employeeId": "P11561",
      "name": "Sayee Nivas B",
      "status": "active",
      "joinDate": "2024-01-15",
      "reportingManager": "Hariharan A",
      "metrics": {
        "overallScore": 92,
        "attendance": 85,
        "productivity": 95,
        "knowledge": 90
      }
    },
    {
      "employeeId": "P12976",
      "name": "Alan Benjamin",
      "status": "active",
      "joinDate": "2024-02-10",
      "reportingManager": "Hariharan A",
      "metrics": {
        "overallScore": 88,
        "attendance": 88,
        "productivity": 92,
        "knowledge": 88
      }
    },
    {
      "employeeId": "P13001",
      "name": "Pavithra M",
      "status": "active",
      "joinDate": "2024-01-20",
      "reportingManager": "Hariharan A",
      "metrics": {
        "overallScore": 91,
        "attendance": 90,
        "productivity": 94,
        "knowledge": 91
      }
    }
  ]
}
```

---

## UI Components for Team Management

### 1. Team Selection Dropdown
```html
<label>Team
  <select id="teamSelect" onchange="loadTeamMembers()">
    <option value="">All Teams</option>
    <option value="internal-audit-team">Internal Audit Team</option>
    <option value="hr-operations">HR Operations</option>
    <option value="compliance">Compliance</option>
    <option value="paperwork-audit">Paperwork Audit</option>
    <option value="final-clearance-team">Final Clearance Team</option>
  </select>
</label>
```

### 2. Team Members Section
```html
<section class="team-members-section">
  <div class="section-header">
    <h2>Team Members (3)</h2>
    <button onclick="openAddMemberModal()">➕ Add Member</button>
  </div>
  
  <div class="members-grid">
    <!-- Team member cards -->
    <div class="member-card">
      <div class="member-header">
        <h3>Sayee Nivas B (P11561)</h3>
        <span class="status-badge active">Active</span>
      </div>
      <div class="member-info">
        <p><strong>Manager:</strong> Hariharan A</p>
        <p><strong>Joined:</strong> 2024-01-15</p>
      </div>
      <div class="member-actions">
        <button onclick="editMember('P11561')">✏️ Edit</button>
        <button onclick="removeMember('P11561')">🗑️ Remove</button>
      </div>
    </div>
  </div>
</section>
```

### 3. Add/Edit Member Modal
```html
<div id="memberModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Add Team Member</h2>
      <button onclick="closeMemberModal()">×</button>
    </div>
    
    <form id="memberForm">
      <label>Employee ID
        <input type="text" id="employeeId" placeholder="e.g., P11561" required>
      </label>
      
      <label>Employee Name
        <input type="text" id="employeeName" placeholder="Full name" required>
      </label>
      
      <label>Reporting Manager
        <select id="reportingManager" required>
          <option value="">Select Manager</option>
          <option value="Hariharan A">Hariharan A</option>
          <option value="Other Manager">Other Manager</option>
        </select>
      </label>
      
      <label>Status
        <select id="status" required>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select>
      </label>
      
      <div class="modal-buttons">
        <button type="submit" class="btn-primary">Save Member</button>
        <button type="button" class="btn-secondary" onclick="closeMemberModal()">Cancel</button>
      </div>
    </form>
  </div>
</div>
```

### 4. Confirm Remove Modal
```html
<div id="removeModal" class="modal">
  <div class="modal-content">
    <h2>Remove Member?</h2>
    <p>Are you sure you want to remove <strong id="memberNameToRemove"></strong> from this team?</p>
    <p style="font-size: 12px; color: #666;">This action cannot be undone.</p>
    
    <div class="modal-buttons">
      <button onclick="confirmRemoveMember()" class="btn-danger">Remove Member</button>
      <button onclick="closeRemoveModal()" class="btn-secondary">Cancel</button>
    </div>
  </div>
</div>
```

---

## Scorecard Sync Flow

```
TEAM MEMBER CHANGES
        ↓
Update Firebase (teams, employees)
        ↓
Log to audit log
        ↓
Trigger scorecard regeneration
        ↓
Fetch team-specific data:
├─ Productivity from Production_Tracker.xlsx
├─ Attendance from Attendance.xlsx
├─ Knowledge from Process_Knowledge_Test.xlsx
├─ Quality from Client_System_Audit_Tracker.xlsx
└─ Other team-specific trackers
        ↓
Calculate metrics for each member
        ↓
Store in Firebase scorecard-details
        ↓
Update manager dashboard in real-time
```

---

## Summary of New Features

✅ **Team Management UI**
- View all team members
- Add new member to team
- Remove member from team
- Edit member details
- Transfer member to different team

✅ **Team-Specific Scorecards**
- Each team has unique trackers
- Scorecard regenerates on team changes
- Only relevant metrics shown per team

✅ **Audit Logging**
- All changes logged with timestamp
- Track who made changes and why
- Maintain compliance records

✅ **Real-Time Sync**
- Firebase updates trigger scorecard refresh
- Dashboard updates automatically
- No manual refresh needed

✅ **Employee Directory**
- View all team members
- See member metrics
- Track team composition changes

---

**Status:** Ready to implement in manager dashboard
**Next Step:** Create manager-v5 with team management UI

