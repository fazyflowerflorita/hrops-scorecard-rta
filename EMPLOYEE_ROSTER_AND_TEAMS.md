# 👥 Employee Roster - Team Assignments

## Employee Database with Team Mapping

```javascript
const employeeRoster = {
  // COMPLIANCE TEAM (7 members)
  "P11561": { name: "Sayee Nivas B", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },
  "P12976": { name: "Alan Benjamin", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13001": { name: "Pavithra M", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13005": { name: "Latha J", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13082": { name: "Sneha Thomas", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13315": { name: "Azhar Taj", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13318": { name: "Rathina Sudhan K", team: "Compliance", manager: "Hariharan A", department: "Operations", status: "active" },

  // FINAL CLEARANCE TEAM (3 members)
  "P11279": { name: "Archana Gautam", team: "Final Clearance Team", manager: "Hariharan A", department: "Operations", status: "active" },
  "P11436": { name: "Aswani R", team: "Final Clearance Team", manager: "Hariharan A", department: "Operations", status: "active" },
  "P12210": { name: "Anubha Priyam", team: "Final Clearance Team", manager: "Hariharan A", department: "Operations", status: "active" },

  // HR OPERATIONS (3 members)
  "P11969": { name: "Arjun MP", team: "HR Operations", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13086": { name: "Ingrid Mary Pope", team: "HR Operations", manager: "Hariharan A", department: "Operations", status: "active" },
  "P13310": { name: "M Rihana", team: "HR Operations", manager: "Hariharan A", department: "Operations", status: "active" },

  // INTERNAL AUDIT TEAM (2 members)
  "P11156": { name: "Yogeshwaran R", team: "Internal Audit Team", manager: "Hariharan A", department: "Operations", status: "active" },
  "P11569": { name: "Banupriya B", team: "Internal Audit Team", manager: "Hariharan A", department: "Operations", status: "active" },

  // PAPERWORK AUDIT (3 members)
  "P11470": { name: "Leonie Gomes", team: "Paperwork Audit", manager: "Hariharan A", department: "Operations", status: "active" },
  "P12527": { name: "Shirisha Manobaran", team: "Paperwork Audit", manager: "Hariharan A", department: "Operations", status: "active" },
  "P12945": { name: "Vinish Navinukmar", team: "Paperwork Audit", manager: "Hariharan A", department: "Operations", status: "active" },

  // TEAM LEADS
  "P11184": { name: "Ramesh Kumar Selvaraj", team: "HR Operations", role: "Team Lead", manager: "Hariharan A", department: "Operations", status: "active" }
};
```

---

## Team Definitions with Trackers

```javascript
const teamDefinitions = {
  "Internal Audit Team": {
    displayName: "Internal Audit Team",
    color: "#6366f1",
    trackers: [
      "Productivity Tracker",
      "NH Pending",
      "SCP Expenditure Timeline",
      "QMG Audit Score",
      "Audits of Internal Audit Team",
      "Process Knowledge Test",
      "Attendance Tracker",
      "Client System Audit"
    ],
    members: ["P11156", "P11569"]
  },
  
  "HR Operations": {
    displayName: "HR Operations",
    color: "#10b981",
    trackers: [
      "Productivity Tracker",
      "NH Pending",
      "Data Changes Tracker",
      "Termination Tracker",
      "Tenure Discount Tracker",
      "Process Knowledge Test",
      "Attendance Tracker",
      "Client System Audit"
    ],
    members: ["P11969", "P13086", "P13310", "P11184"]
  },
  
  "Compliance": {
    displayName: "Compliance",
    color: "#f59e0b",
    trackers: [
      "Productivity Tracker",
      "NH Pending",
      "Internal Audit Tracker",
      "Process Knowledge Test",
      "Attendance Tracker",
      "Client System Audit"
    ],
    members: ["P11561", "P12976", "P13001", "P13005", "P13082", "P13315", "P13318"]
  },
  
  "Paperwork Audit": {
    displayName: "Paperwork Audit",
    color: "#8b5cf6",
    trackers: [
      "Productivity Tracker",
      "NH Pending",
      "Internal Audit Tracker",
      "Paperwork Clearance SLA & Count",
      "Paperwork allocation Tracker",
      "Process Knowledge Test",
      "Attendance Tracker",
      "Client System Audit"
    ],
    members: ["P11470", "P12527", "P12945"]
  },
  
  "Final Clearance Team": {
    displayName: "Final Clearance Team",
    color: "#ef4444",
    trackers: [
      "Productivity Tracker",
      "BG Pending",
      "Internal Audit Tracker",
      "Final Clearance SLA & Count",
      "Process Knowledge test",
      "Attendance Tracker",
      "Client System Audit"
    ],
    members: ["P11279", "P11436", "P12210"]
  }
};
```

---

## Team Member Operations

### 1. Get Team Members
```javascript
function getTeamMembers(teamName) {
  return teamDefinitions[teamName]?.members || [];
}
```

### 2. Add Member to Team
```javascript
function addMemberToTeam(teamName, employeeId) {
  // Validate employee exists
  if (!employeeRoster[employeeId]) {
    return { success: false, error: "Employee not found" };
  }
  
  // Check if already in team
  if (teamDefinitions[teamName].members.includes(employeeId)) {
    return { success: false, error: "Employee already in this team" };
  }
  
  // Remove from old team if assigned
  const oldTeam = employeeRoster[employeeId].team;
  if (oldTeam && teamDefinitions[oldTeam]) {
    const oldMembers = teamDefinitions[oldTeam].members;
    oldMembers.splice(oldMembers.indexOf(employeeId), 1);
  }
  
  // Add to new team
  teamDefinitions[teamName].members.push(employeeId);
  employeeRoster[employeeId].team = teamName;
  
  // Log change
  logAuditChange("ADD_MEMBER", teamName, employeeId, employeeRoster[employeeId].name);
  
  return { success: true, message: "Member added successfully" };
}
```

### 3. Remove Member from Team
```javascript
function removeMemberFromTeam(teamName, employeeId) {
  // Validate
  if (!teamDefinitions[teamName].members.includes(employeeId)) {
    return { success: false, error: "Employee not in this team" };
  }
  
  // Remove from team
  const members = teamDefinitions[teamName].members;
  members.splice(members.indexOf(employeeId), 1);
  employeeRoster[employeeId].team = null;
  
  // Log change
  logAuditChange("REMOVE_MEMBER", teamName, employeeId, employeeRoster[employeeId].name);
  
  return { success: true, message: "Member removed successfully" };
}
```

### 4. Edit Member Details
```javascript
function editMemberDetails(employeeId, updateData) {
  if (!employeeRoster[employeeId]) {
    return { success: false, error: "Employee not found" };
  }
  
  const oldData = { ...employeeRoster[employeeId] };
  employeeRoster[employeeId] = { 
    ...employeeRoster[employeeId], 
    ...updateData 
  };
  
  // Log change
  logAuditChange("EDIT_MEMBER", employeeRoster[employeeId].team, employeeId, employeeRoster[employeeId].name, oldData);
  
  return { success: true, message: "Member details updated" };
}
```

---

## Team Trackers Mapping

Each team has specific metrics that will be displayed in their scorecard:

| Team | Trackers | Unique Features |
|------|----------|-----------------|
| **Internal Audit Team** | 8 trackers | QMG Audit Score, SCP Timeline |
| **HR Operations** | 8 trackers | Data Changes, Termination tracking |
| **Compliance** | 6 trackers | Focused on core compliance metrics |
| **Paperwork Audit** | 8 trackers | Paperwork Clearance SLA & Count |
| **Final Clearance Team** | 7 trackers | BG Pending, Final Clearance SLA |

---

## Scorecard Generation Rules

### When Team Membership Changes:

1. **Member Added to Team:**
   - Load member data from all team-specific trackers
   - Calculate metrics based on available data
   - Display scorecard in team view

2. **Member Removed from Team:**
   - Archive scorecard
   - Remove from team view
   - Update team statistics

3. **Member Transferred to Different Team:**
   - Archive old team scorecard
   - Generate new scorecard with new team's trackers
   - Update member's team assignment

---

## Data Isolation for Associates

Each associate can ONLY see:
- ✅ Their own employee ID (must match)
- ✅ Their personal scores
- ✅ Their team assignment
- ✅ Their manager
- ✅ Their metrics only

Associates CANNOT see:
- ❌ Other employees' scores
- ❌ Team members' details
- ❌ Colleague performance
- ❌ Other team data

---

**Status:** Ready to implement in v5 dashboard
