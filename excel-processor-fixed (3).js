/**
 * Excel Processor for HR Scorecard System - FIXED
 * Processes uploaded Excel files by team with their specific requirements
 */

class ExcelProcessor {
  constructor() {
    this.uploadedFiles = {};
    this.processedScores = {};
    this.currentMonth = new Date().getMonth() + 1;
    this.fileProgressCallback = null;
  }

  /**
   * Set callback for file progress updates
   */
  setFileProgressCallback(callback) {
    this.fileProgressCallback = callback;
  }

  /**
   * Process uploaded files
   */
  async processFiles(fileList) {
    console.log('📁 Processing Excel files...');
    
    // Clear previous files
    this.uploadedFiles = {};
    this.processedScores = {};
    
    // Read each file
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        // Update progress callback
        if (this.fileProgressCallback) {
          this.fileProgressCallback(i + 1, fileList.length, file.name);
        }
        
        const arrayBuffer = await this.readFile(file);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        this.uploadedFiles[file.name] = workbook;
        console.log(`✅ Loaded: ${file.name}`);
      } catch (error) {
        console.error(`❌ Error loading ${file.name}:`, error);
      }
    }
    
    // Generate scorecards
    this.generateScorecardsForAllTeams();
    return this.processedScores;
  }

  /**
   * Read file as array buffer
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Generate scorecards for all teams
   */
  generateScorecardsForAllTeams() {
    console.log('🎯 Generating scorecards for all teams...');
    
    try {
      this.processedScores = {
        'Compliance': this.processComplianceTeam(),
        'Final Clearance': this.processFinalClearanceTeam(),
        'Internal Audit': this.processInternalAuditTeam(),
        'Paperwork Clearance': this.processPaperworkClearanceTeam(),
        'HR Operations': this.processHROperations()
      };
      
      console.log('✅ All teams processed');
      return this.processedScores;
    } catch (error) {
      console.error('❌ Error generating scorecards:', error);
      throw error;
    }
  }

  /**
   * COMPLIANCE TEAM
   */
  processComplianceTeam() {
    console.log('\n📊 Processing Compliance Team...');
    const teamScores = [];
    const members = ['Sayee Nivas B', 'Alan Benjamin', 'Pavithra M', 'Latha J', 'Sneha Thomas', 'Azhar Taj', 'Rathina Sudhan K'];
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const nhData = this.readNHPending('New_NH_pending_Tracker.xlsx', members);
    const auditData = this.readInternalAudit('Internal_Audit_Scores.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateScore(
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
        'Productivity Status': (productivityData[member] || 0) >= 8 ? 'Green' : 'Red',
        'NH Pending Count': nhCount,
        'NH Eligibility': nhCount > 0 ? 'Not Eligible' : 'Eligible',
        'Audit Errors': auditData[member] || 0,
        'Audit Status': (auditData[member] || 0) === 0 ? 'Green' : (auditData[member] || 0) <= 2 ? 'Amber' : 'Red',
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
   */
  processFinalClearanceTeam() {
    console.log('\n📊 Processing Final Clearance Team...');
    const teamScores = [];
    const members = ['Archana Gautam', 'Aswani R', 'Anubha Priyam'];
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const auditData = this.readInternalAudit('Internal_Audit_Scores.xlsx', members);
    const fcData = this.readFinalClearanceSLA('Final_Clearance_Tracker.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateScore(
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
        'Productivity Status': (productivityData[member] || 0) >= 8 ? 'Green' : 'Red',
        'Audit Errors': auditData[member] || 0,
        'Audit Status': (auditData[member] || 0) === 0 ? 'Green' : 'Red',
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
   */
  processInternalAuditTeam() {
    console.log('\n📊 Processing Internal Audit Team...');
    const teamScores = [];
    const members = ['Yogeshwaran R', 'Banupriya B'];
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const nhData = this.readNHPending('New_NH_pending_Tracker.xlsx', members);
    const qmgData = this.readQMGErrors('QMG_Error_Tracker.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateScore(
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
        'Productivity Status': (productivityData[member] || 0) >= 8 ? 'Green' : 'Red',
        'NH Pending Count': nhCount,
        'NH Eligibility': nhCount > 0 ? 'Not Eligible' : 'Eligible',
        'NCA Errors': qmgData[member]?.nca || 0,
        'CA Errors': qmgData[member]?.ca || 0,
        'Total Errors': qmgData[member]?.total || 0,
        'Error Status': (qmgData[member]?.total || 0) === 0 ? 'Green' : 'Red',
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
   */
  processPaperworkClearanceTeam() {
    console.log('\n📊 Processing Paperwork Clearance Team...');
    const teamScores = [];
    const members = ['Leonie Gomes', 'Thirisha Manoharan', 'Vinish Navinkumar'];
    
    const productivityData = this.readColumn('Production_Tracker.xlsx', members);
    const attendanceData = this.readColumn('Attendance.xlsx', members);
    const pktData = this.readColumn('Process_Knowledge_Test.xlsx', members);
    const nhData = this.readNHPending('New_NH_pending_Tracker.xlsx', members);
    const auditData = this.readInternalAudit('Internal_Audit_Scores.xlsx', members);
    const paperData = this.readPaperworkSLA('Paperwork_Clearance_Tracker.xlsx', members);
    const clientData = this.readClientAudit('Client_System_Audit_Tracker.xlsx', members);
    
    members.forEach(member => {
      const score = this.calculateScore(
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
        'Productivity Status': (productivityData[member] || 0) >= 8 ? 'Green' : 'Red',
        'NH Pending Count': nhCount,
        'NH Eligibility': nhCount > 0 ? 'Not Eligible' : 'Eligible',
        'Audit Errors': auditData[member] || 0,
        'Audit Status': (auditData[member] || 0) === 0 ? 'Green' : 'Red',
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
   * HR OPERATIONS (All employees)
   */
  processHROperations() {
    console.log('\n📊 Processing HR Operations (All Teams)...');
    let allScores = [];
    
    for (const team in this.processedScores) {
      if (team !== 'HR Operations') {
        allScores = allScores.concat(this.processedScores[team] || []);
      }
    }
    
    console.log(`✅ Processed ${allScores.length} total employees`);
    return allScores;
  }

  /**
   * DATA READING METHODS
   */

  readColumn(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) {
      console.warn(`⚠️ File not found: ${filename}`);
      return data;
    }
    
    try {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) return data;
      
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      rows.forEach(row => {
        const keys = Object.keys(row);
        const nameKey = keys[0]; // First column = name
        const name = String(row[nameKey]).trim();
        
        if (members.includes(name)) {
          // Get month column (typically column B which is index 1)
          const monthKey = keys[this.currentMonth];
          const value = row[monthKey];
          data[name] = parseFloat(value) || 0;
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error reading ${filename}:`, error.message);
    }
    
    return data;
  }

  readNHPending(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    try {
      const sheetName = '2026 NH Pending' in workbook.Sheets ? '2026 NH Pending' : workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return data;
      
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      rows.forEach(row => {
        const keys = Object.keys(row);
        const statusValue = Object.values(row)[11]; // Column 12 (status)
        const processorValue = Object.values(row)[6]; // Column 7 (processor)
        
        if (statusValue && String(statusValue).includes('Pending') && processorValue) {
          const procName = String(processorValue).trim();
          if (members.includes(procName)) {
            data[procName] = (data[procName] || 0) + 1;
          }
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error reading NH Pending:`, error.message);
    }
    
    return data;
  }

  readInternalAudit(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    try {
      const sheetName = 'Internal Audit' in workbook.Sheets ? 'Internal Audit' : workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return data;
      
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      rows.forEach(row => {
        const keys = Object.keys(row);
        const memberValue = Object.values(row)[4]; // Column 5
        const errorValue = Object.values(row)[1]; // Column 2
        
        if (memberValue && errorValue) {
          const member = String(memberValue).trim();
          if (members.includes(member)) {
            const errors = parseInt(String(errorValue).split()[0]) || 0;
            data[member] = (data[member] || 0) + errors;
          }
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error reading Internal Audit:`, error.message);
    }
    
    return data;
  }

  readClientAudit(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    if (!workbook) return data;
    
    try {
      const sheetName = 'Client System Audit' in workbook.Sheets ? 'Client System Audit' : workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return data;
      
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      rows.forEach(row => {
        const keys = Object.keys(row);
        const memberValue = Object.values(row)[2]; // Column 3
        const pendingValue = Object.values(row)[7]; // Column 8
        
        if (memberValue && members.includes(String(memberValue).trim())) {
          const member = String(memberValue).trim();
          const pending = parseInt(pendingValue) || 0;
          data[member] = (data[member] || 0) + pending;
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error reading Client Audit:`, error.message);
    }
    
    return data;
  }

  readFinalClearanceSLA(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    
    members.forEach(member => {
      data[member] = { completed: 0, pending: 0, slaCompliance: 90 };
    });
    
    if (!workbook) return data;
    
    try {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) return data;
      
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      rows.forEach(row => {
        const keys = Object.keys(row);
        const auditorValue = Object.values(row)[4]; // Column 5
        
        if (auditorValue) {
          const member = String(auditorValue).trim();
          if (members.includes(member)) {
            if (!data[member]) data[member] = { completed: 0, pending: 0, slaCompliance: 90 };
            data[member].completed++;
          }
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error reading FC SLA:`, error.message);
    }
    
    return data;
  }

  readPaperworkSLA(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    
    members.forEach(member => {
      data[member] = { completed: 0, pending: 0, slaCompliance: 85 };
    });
    
    if (!workbook) return data;
    
    try {
      const sheetName = 'Clearance Tracker' in workbook.Sheets ? 'Clearance Tracker' : workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return data;
      
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      rows.forEach(row => {
        const keys = Object.keys(row);
        const coordinatorValue = Object.values(row)[4]; // Column 5
        
        if (coordinatorValue) {
          const member = String(coordinatorValue).trim();
          if (members.includes(member)) {
            if (!data[member]) data[member] = { completed: 0, pending: 0, slaCompliance: 85 };
            data[member].completed++;
          }
        }
      });
    } catch (error) {
      console.warn(`⚠️ Error reading Paperwork SLA:`, error.message);
    }
    
    return data;
  }

  readQMGErrors(filename, members) {
    const data = {};
    const workbook = this.uploadedFiles[filename];
    
    members.forEach(member => {
      data[member] = { nca: 0, ca: 0, total: 0 };
    });
    
    if (!workbook) return data;
    
    try {
      ['NCA errors', 'CA errors'].forEach(sheetName => {
        if (sheetName in workbook.Sheets) {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet);
          
          rows.forEach(row => {
            const keys = Object.keys(row);
            const processorValue = Object.values(row)[0]; // Column 1
            const errorsValue = Object.values(row)[1]; // Column 2
            
            if (processorValue && members.includes(String(processorValue).trim())) {
              const member = String(processorValue).trim();
              const errors = parseInt(errorsValue) || 0;
              
              if (sheetName === 'NCA errors') {
                data[member].nca += errors;
              } else {
                data[member].ca += errors;
              }
            }
          });
        }
      });
      
      members.forEach(member => {
        data[member].total = data[member].nca + data[member].ca;
      });
    } catch (error) {
      console.warn(`⚠️ Error reading QMG Errors:`, error.message);
    }
    
    return data;
  }

  /**
   * SCORING
   */

  calculateScore(productivity, pkt, attendance, errors) {
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
   * Export to Firebase
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
