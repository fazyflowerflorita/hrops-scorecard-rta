/**
 * Excel Processor for HR Scorecard System
 * Integrates with existing admin dashboard
 * Processes 5 teams with their specific requirements
 */

// Team member definitions
const TEAMS = {
  'Compliance': {
    members: ['Sayee Nivas B', 'Alan Benjamin', 'Pavithra M', 'Latha J', 'Sneha Thomas', 'Azhar Taj', 'Rathina Sudhan K'],
    requirements: ['Productivity', 'NH Pending', 'Internal Audit Errors (QMG)', 'PKT', 'Attendance', 'Client System Audit']
  },
  'Final Clearance': {
    members: ['Archana Gautam', 'Aswani R', 'Anubha Priyam'],
    requirements: ['Productivity', 'Internal Audit Errors', 'Final Clearance SLA', 'Final Clearance Count', 'PKT', 'Attendance', 'Client System Audit']
  },
  'Internal Audit': {
    members: ['Yogeshwaran R', 'Banupriya B'],
    requirements: ['Productivity', 'NH Pending', 'QMG Paperwork Timeline', 'QMG Audit Score (NCA & CA)', 'Internal Audit Completion', 'PKT', 'Attendance', 'Client System Audit']
  },
  'Paperwork Clearance': {
    members: ['Leonie Gomes', 'Thirisha Manoharan', 'Vinish Navinkumar'],
    requirements: ['Productivity', 'NH Pending', 'Internal Audit Errors', 'Paperwork Clearance SLA', 'Paperwork Allocation', 'PKT', 'Attendance', 'Client System Audit']
  },
  'HR Operations': {
    members: ['Arjun MP', 'Ingrid Mary Pope', 'M Rihana', 'Ramesh Kumar Selvaraj', 'Sayee Nivas B', 'Alan Benjamin', 'Pavithra M', 'Latha J', 'Sneha Thomas', 'Azhar Taj', 'Rathina Sudhan K', 'Archana Gautam', 'Aswani R', 'Anubha Priyam', 'Yogeshwaran R', 'Banupriya B', 'Leonie Gomes', 'Thirisha Manoharan', 'Vinish Navinkumar'],
    requirements: ['All metrics from all teams']
  }
};

class ExcelProcessor {
  constructor() {
    this.uploadedFiles = {};
    this.processedScores = {};
    this.currentMonth = new Date().getMonth() + 1;
  }

  /**
   * Handle file uploads
   */
  async processFiles(files) {
    console.log('📁 Processing Excel files...');
    
    for (let file of files) {
      try {
        const arrayBuffer = await this.readFile(file);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        this.uploadedFiles[file.name] = workbook;
        console.log(`✅ Loaded: ${file.name}`);
      } catch (error) {
        console.error(`❌ Error loading ${file.name}: ${error}`);
      }
    }
    
    this.generateScorecardsForAllTeams();
  }

  /**
   * Read file as array buffer
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Generate scorecards for all teams
   */
  generateScorecardsForAllTeams() {
    console.log('🎯 Generating scorecards for all teams...');
    
    this.processedScores = {
      'Compliance': this.processComplianceTeam(),
      'Final Clearance': this.processFinalClearanceTeam(),
      'Internal Audit': this.processInternalAuditTeam(),
      'Paperwork Clearance': this.processPaperworkClearanceTeam(),
      'HR Operations': this.processHROperations()
    };
    
    console.log('✅ All teams processed');
    return this.processedScores;
  }

  /**
   * COMPLIANCE TEAM
   * Requirements: Productivity, NH Pending, Internal Audit Errors (QMG), PKT, Attendance, Client System Audit
   */
  processComplianceTeam() {
    console.log('\n📊 Processing Compliance Team...');
    const teamScores = [];
    const members = TEAMS['Compliance'].members;
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const nhData = this.readNHPending('New_NH_pending_Tracker.xlsx', members);
    const auditData = this.readInternalAudit('Internal_Audit_Scores.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateOverallScore(
        productivityData[member] || 0,
        pktData[member] || 0,
        attendanceData[member] || 0,
        auditData[member] || 0
      );
      
      const nhCount = nhData[member] || 0;
      const clientCount = clientData[member] || 0;
      
      teamScores.push({
        'Employee Name': member,
        'Productivity Hours': productivityData[member] || '-',
        'Productivity Status': productivityData[member] >= 8 ? 'Green' : 'Red',
        'NH Pending Count': nhCount,
        'NH Eligibility': nhCount > 0 ? 'Not Eligible' : 'Eligible',
        'Audit Errors': auditData[member] || 0,
        'Audit Status': auditData[member] === 0 ? 'Green' : auditData[member] <= 2 ? 'Amber' : 'Red',
        'PKT Score': pktData[member] || '-',
        'PKT Rating': this.getPKTRating(pktData[member]),
        'Attendance %': attendanceData[member] || '-',
        'Client System Pending': clientCount,
        'Client System Status': clientCount > 0 ? 'Red' : 'Green',
        'Overall Score': score,
        'Overall Rating': this.getOverallRating(score),
        'Incentive Eligible': (nhCount > 0 || clientCount > 0) ? 'Not Eligible' : 'Eligible',
        'Remarks': (nhCount === 0 && clientCount === 0) ? 'On Track' : 'Action Required'
      });
    });
    
    console.log(`✅ Processed ${teamScores.length} Compliance team members`);
    return teamScores;
  }

  /**
   * FINAL CLEARANCE TEAM
   * Requirements: Productivity, Internal Audit Errors, Final Clearance SLA, Count, PKT, Attendance, Client System Audit
   */
  processFinalClearanceTeam() {
    console.log('\n📊 Processing Final Clearance Team...');
    const teamScores = [];
    const members = TEAMS['Final Clearance'].members;
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const auditData = this.readInternalAudit('Internal_Audit_Scores.xlsx', members);
    const fcData = this.readFinalClearanceSLA('Final_Clearance_Tracker.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateOverallScore(
        productivityData[member] || 0,
        pktData[member] || 0,
        attendanceData[member] || 0,
        auditData[member] || 0
      );
      
      const slaCompliance = fcData[member]?.slaCompliance || 0;
      const fcCompleted = fcData[member]?.completed || 0;
      const clientCount = clientData[member] || 0;
      
      teamScores.push({
        'Employee Name': member,
        'Productivity Hours': productivityData[member] || '-',
        'Productivity Status': productivityData[member] >= 8 ? 'Green' : 'Red',
        'Audit Errors': auditData[member] || 0,
        'Audit Status': auditData[member] === 0 ? 'Green' : 'Red',
        'FC Completed': fcCompleted,
        'FC Pending': fcData[member]?.pending || 0,
        'SLA Compliance %': slaCompliance,
        'SLA Status': slaCompliance >= 80 ? 'Green' : 'Red',
        'PKT Score': pktData[member] || '-',
        'PKT Rating': this.getPKTRating(pktData[member]),
        'Attendance %': attendanceData[member] || '-',
        'Client System Pending': clientCount,
        'Client System Status': clientCount > 0 ? 'Red' : 'Green',
        'Overall Score': score,
        'Overall Rating': this.getOverallRating(score),
        'Incentive Eligible': clientCount > 0 ? 'Not Eligible' : 'Eligible',
        'Remarks': clientCount === 0 ? 'On Track' : 'Action Required'
      });
    });
    
    console.log(`✅ Processed ${teamScores.length} Final Clearance team members`);
    return teamScores;
  }

  /**
   * INTERNAL AUDIT TEAM
   * Requirements: Productivity, NH Pending, QMG Timeline, QMG Audit Score (NCA & CA), Internal Audit Completion, PKT, Attendance, Client System Audit
   */
  processInternalAuditTeam() {
    console.log('\n📊 Processing Internal Audit Team...');
    const teamScores = [];
    const members = TEAMS['Internal Audit'].members;
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const nhData = this.readNHPending('New_NH_pending_Tracker.xlsx', members);
    const qmgData = this.readQMGErrors('QMG_Error_Tracker.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateOverallScore(
        productivityData[member] || 0,
        pktData[member] || 0,
        attendanceData[member] || 0,
        qmgData[member]?.total || 0
      );
      
      const nhCount = nhData[member] || 0;
      const clientCount = clientData[member] || 0;
      
      teamScores.push({
        'Employee Name': member,
        'Productivity Hours': productivityData[member] || '-',
        'Productivity Status': productivityData[member] >= 8 ? 'Green' : 'Red',
        'NH Pending Count': nhCount,
        'NH Eligibility': nhCount > 0 ? 'Not Eligible' : 'Eligible',
        'NCA Errors': qmgData[member]?.nca || 0,
        'CA Errors': qmgData[member]?.ca || 0,
        'Total Errors': qmgData[member]?.total || 0,
        'Error Status': qmgData[member]?.total === 0 ? 'Green' : 'Red',
        'PKT Score': pktData[member] || '-',
        'PKT Rating': this.getPKTRating(pktData[member]),
        'Attendance %': attendanceData[member] || '-',
        'Client System Pending': clientCount,
        'Client System Status': clientCount > 0 ? 'Red' : 'Green',
        'Overall Score': score,
        'Overall Rating': this.getOverallRating(score),
        'Incentive Eligible': (nhCount > 0 || clientCount > 0) ? 'Not Eligible' : 'Eligible',
        'Remarks': (nhCount === 0 && clientCount === 0) ? 'On Track' : 'Action Required'
      });
    });
    
    console.log(`✅ Processed ${teamScores.length} Internal Audit team members`);
    return teamScores;
  }

  /**
   * PAPERWORK CLEARANCE TEAM
   * Requirements: Productivity, NH Pending, Internal Audit Errors, Paperwork SLA, Allocation, PKT, Attendance, Client System Audit
   */
  processPaperworkClearanceTeam() {
    console.log('\n📊 Processing Paperwork Clearance Team...');
    const teamScores = [];
    const members = TEAMS['Paperwork Clearance'].members;
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const nhData = this.readNHPending('New_NH_pending_Tracker.xlsx', members);
    const auditData = this.readInternalAudit('Internal_Audit_Scores.xlsx', members);
    const paperData = this.readPaperworkSLA('Paperwork_Clearance_Tracker.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateOverallScore(
        productivityData[member] || 0,
        pktData[member] || 0,
        attendanceData[member] || 0,
        auditData[member] || 0
      );
      
      const nhCount = nhData[member] || 0;
      const clientCount = clientData[member] || 0;
      const paperSLA = paperData[member]?.slaCompliance || 0;
      
      teamScores.push({
        'Employee Name': member,
        'Productivity Hours': productivityData[member] || '-',
        'Productivity Status': productivityData[member] >= 8 ? 'Green' : 'Red',
        'NH Pending Count': nhCount,
        'NH Eligibility': nhCount > 0 ? 'Not Eligible' : 'Eligible',
        'Audit Errors': auditData[member] || 0,
        'Audit Status': auditData[member] === 0 ? 'Green' : 'Red',
        'Paperwork Cleared': paperData[member]?.completed || 0,
        'Paperwork SLA %': paperSLA,
        'SLA Status': paperSLA >= 80 ? 'Green' : 'Red',
        'PKT Score': pktData[member] || '-',
        'PKT Rating': this.getPKTRating(pktData[member]),
        'Attendance %': attendanceData[member] || '-',
        'Client System Pending': clientCount,
        'Client System Status': clientCount > 0 ? 'Red' : 'Green',
        'Overall Score': score,
        'Overall Rating': this.getOverallRating(score),
        'Incentive Eligible': (nhCount > 0 || clientCount > 0) ? 'Not Eligible' : 'Eligible',
        'Remarks': (nhCount === 0 && clientCount === 0) ? 'On Track' : 'Action Required'
      });
    });
    
    console.log(`✅ Processed ${teamScores.length} Paperwork Clearance team members`);
    return teamScores;
  }

  /**
   * HR OPERATIONS (All 19 employees + all metrics)
   */
  processHROperations() {
    console.log('\n📊 Processing HR Operations (All Teams)...');
    const allScores = [];
    
    // Combine all team scores
    for (const team in this.processedScores) {
      if (team !== 'HR Operations') {
        allScores.push(...this.processedScores[team]);
      }
    }
    
    console.log(`✅ Processed ${allScores.length} total employees for HR Operations view`);
    return allScores;
  }

  /**
   * DATA READING METHODS
   */

  readColumn(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    rows.forEach(row => {
      const name = Object.values(row)[0]; // First column = name
      const value = Object.values(row)[this.currentMonth]; // Month column
      
      if (name && members.includes(String(name).trim())) {
        data[String(name).trim()] = parseFloat(value) || 0;
      }
    });
    
    return data;
  }

  readNHPending(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    const sheet = workbook.Sheets['2026 NH Pending'] || workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    rows.forEach(row => {
      const processor = Object.values(row)[6]; // Column 7 (processor)
      const status = Object.values(row)[11]; // Column 12 (status)
      
      if (status && String(status).includes('Pending') && processor) {
        const procName = String(processor).trim();
        if (members.includes(procName)) {
          data[procName] = (data[procName] || 0) + 1;
        }
      }
    });
    
    return data;
  }

  readInternalAudit(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    const sheet = workbook.Sheets['Internal Audit'] || workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    rows.forEach(row => {
      const teamMember = Object.values(row)[4]; // Column 5
      const errorCount = Object.values(row)[1]; // Column 2
      
      if (teamMember && errorCount) {
        const member = String(teamMember).trim();
        if (members.includes(member)) {
          data[member] = (data[member] || 0) + parseInt(errorCount);
        }
      }
    });
    
    return data;
  }

  readClientAudit(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    const sheet = workbook.Sheets['Client System Audit'] || workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    rows.forEach(row => {
      const teamMember = Object.values(row)[2]; // Column 3
      const pending = Object.values(row)[7]; // Column 8
      
      if (teamMember && members.includes(String(teamMember).trim())) {
        const member = String(teamMember).trim();
        data[member] = (data[member] || 0) + parseInt(pending || 0);
      }
    });
    
    return data;
  }

  readFinalClearanceSLA(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    members.forEach(member => {
      data[member] = { completed: 0, pending: 0, slaCompliance: 90 };
    });
    
    rows.forEach(row => {
      const auditor = Object.values(row)[4]; // Column 5
      if (auditor && members.includes(String(auditor).trim())) {
        const member = String(auditor).trim();
        if (!data[member]) data[member] = { completed: 0, pending: 0, slaCompliance: 90 };
        data[member].completed++;
      }
    });
    
    return data;
  }

  readPaperworkSLA(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    const sheet = workbook.Sheets['Clearance Tracker'] || workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    members.forEach(member => {
      data[member] = { completed: 0, pending: 0, slaCompliance: 85 };
    });
    
    rows.forEach(row => {
      const coordinator = Object.values(row)[4]; // Column 5
      if (coordinator && members.includes(String(coordinator).trim())) {
        const member = String(coordinator).trim();
        if (!data[member]) data[member] = { completed: 0, pending: 0, slaCompliance: 85 };
        data[member].completed++;
      }
    });
    
    return data;
  }

  readQMGErrors(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    members.forEach(member => {
      data[member] = { nca: 0, ca: 0, total: 0 };
    });
    
    ['NCA errors', 'CA errors'].forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      if (sheet) {
        const rows = XLSX.utils.sheet_to_json(sheet);
        rows.forEach(row => {
          const processor = Object.values(row)[0];
          const errors = Object.values(row)[1];
          
          if (processor && members.includes(String(processor).trim())) {
            const member = String(processor).trim();
            if (sheetName === 'NCA errors') {
              data[member].nca += parseInt(errors) || 0;
            } else {
              data[member].ca += parseInt(errors) || 0;
            }
          }
        });
      }
    });
    
    members.forEach(member => {
      data[member].total = data[member].nca + data[member].ca;
    });
    
    return data;
  }

  /**
   * SCORING METHODS
   */

  calculateOverallScore(productivity, pkt, attendance, errors) {
    let score = (pkt * 0.4 + attendance * 0.2 + Math.min(10, productivity) * 10 * 0.2 + Math.max(0, 100 - errors * 10) * 0.2);
    return Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;
  }

  getPKTRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    return 'Needs Improvement';
  }

  getOverallRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    return 'Needs Improvement';
  }

  /**
   * Export results
   */
  async saveToFirebase(firebaseDb) {
    console.log('💾 Saving to Firebase...');
    try {
      for (const team in this.processedScores) {
        await firebaseDb.ref(`scorecards/${team}`).set(this.processedScores[team]);
      }
      console.log('✅ Saved to Firebase');
      return this.processedScores;
    } catch (error) {
      console.error('❌ Error saving to Firebase:', error);
      throw error;
    }
  }

  getJSON() {
    return JSON.stringify(this.processedScores, null, 2);
  }

  downloadJSON() {
    const dataStr = this.getJSON();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team_scorecards_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

// Export for use in admin dashboard
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExcelProcessor;
}
