// ============================================
// SCORECARD ENGINE - Core Business Logic
// ============================================

class ScoreCardEngine {
    constructor() {
        this.employees = {};
        this.teams = {
            'Compliance': [],
            'Final Clearance': [],
            'Internal Audit': [],
            'Paperwork Clearance': [],
            'HR Operations': []
        };
        this.rawData = {};
        this.history = {};
    }

    // Employee roster - hardcoded from requirements
    getEmployeeRoster() {
        return {
            'P11561': { name: 'Sayee Nivas B', team: 'Compliance' },
            'P12976': { name: 'Alan Benjamin', team: 'Compliance' },
            'P13001': { name: 'Pavithra M', team: 'Compliance' },
            'P13005': { name: 'Latha J', team: 'Compliance' },
            'P13082': { name: 'Sneha Thomas', team: 'Compliance' },
            'P13315': { name: 'Azhar Taj', team: 'Compliance' },
            'P13318': { name: 'Rathina Sudhan K', team: 'Compliance' },
            'P11279': { name: 'Archana Gautam', team: 'Final Clearance' },
            'P11436': { name: 'Aswani R', team: 'Final Clearance' },
            'P12210': { name: 'Anubha Priyam', team: 'Final Clearance' },
            'P11969': { name: 'Arjun MP', team: 'HR Operations' },
            'P13086': { name: 'Ingrid Mary Pope', team: 'HR Operations' },
            'P13310': { name: 'M Rihana', team: 'HR Operations' },
            'P11184': { name: 'Ramesh Kumar Selvaraj', team: 'HR Operations' },
            'P11156': { name: 'Yogeshwaran R', team: 'Internal Audit' },
            'P11569': { name: 'Banupriya B', team: 'Internal Audit' },
            'P11470': { name: 'Leonie Gomes', team: 'Paperwork Clearance' },
            'P12527': { name: 'Thirisha Manoharan', team: 'Paperwork Clearance' },
            'P12945': { name: 'Vinish Navinkumar', team: 'Paperwork Clearance' }
        };
    }

    // Parse Excel files and extract data
    async processExcelFiles(fileList) {
        const results = {
            success: true,
            processed: 0,
            errors: [],
            data: {}
        };

        for (const file of fileList) {
            try {
                const arrayBuffer = await this.readFile(file);
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                results.data[file.name] = this.parseWorkbook(workbook, file.name);
                results.processed++;
            } catch (error) {
                results.errors.push({ file: file.name, error: error.message });
            }
        }

        this.rawData = results.data;
        await this.calculateScores();
        return results;
    }

    // Read file as ArrayBuffer
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Parse workbook and extract data by file type
    parseWorkbook(workbook, fileName) {
        const data = {};

        if (fileName.includes('Attendance')) {
            data.attendance = this.parseAttendance(workbook);
        }
        if (fileName.includes('Client_System_Audit')) {
            data.clientAudit = this.parseClientAudit(workbook);
        }
        if (fileName.includes('Internal_Audit_Scores')) {
            data.auditScores = this.parseAuditScores(workbook);
        }
        if (fileName.includes('NH_pending')) {
            data.nhPending = this.parseNHPending(workbook);
        }
        if (fileName.includes('Process_Knowledge')) {
            data.pkt = this.parsePKT(workbook);
        }
        if (fileName.includes('Production')) {
            data.productivity = this.parseProductivity(workbook);
        }
        if (fileName.includes('Final_Clearance')) {
            data.finalClearance = this.parseFinalClearance(workbook);
        }
        if (fileName.includes('Paperwork_Clearance')) {
            data.paperworkClearance = this.parsePaperworkClearance(workbook);
        }
        if (fileName.includes('QMG_Error')) {
            data.qmgErrors = this.parseQMGErrors(workbook);
        }

        return data;
    }

    // ===== PARSER FUNCTIONS =====

    parseAttendance(workbook) {
        // Column A: Names, Cols B-M: Jan-Dec
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = Object.values(row)[0];
            const empId = this.findEmployeeId(name);
            if (empId) {
                result[empId] = {
                    name,
                    monthly: {
                        Jan: row['January'] || 0,
                        Feb: row['February'] || 0,
                        Mar: row['March'] || 0,
                        Apr: row['April'] || 0,
                        May: row['May'] || 0,
                        Jun: row['June'] || 0,
                        Jul: row['July'] || 0,
                        Aug: row['August'] || 0,
                        Sep: row['September'] || 0,
                        Oct: row['October'] || 0,
                        Nov: row['November'] || 0,
                        Dec: row['December'] || 0
                    }
                };
            }
        });

        return result;
    }

    parseClientAudit(workbook) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Member'] || row['Employee'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                result[empId] = {
                    name,
                    pending: row['Pending'] || row['Pending Count'] || 0
                };
            }
        });

        return result;
    }

    parseAuditScores(workbook) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Employee'] || row['Name'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                result[empId] = {
                    name,
                    score: row['Score'] || row['QMG Score'] || 0,
                    errors: row['Errors'] || 0
                };
            }
        });

        return result;
    }

    parseNHPending(workbook) {
        const sheet = workbook.Sheets['2026 NH Pending'] || workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Processor'] || row['Name'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                result[empId] = {
                    name,
                    pending: row['Status'] === 'Pending' ? 1 : 0
                };
            }
        });

        return result;
    }

    parsePKT(workbook) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Employee'] || row['Name'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                result[empId] = {
                    name,
                    score: row['Score'] || row['PKT Score'] || 0
                };
            }
        });

        return result;
    }

    parseProductivity(workbook) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Employee'] || row['Name'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                result[empId] = {
                    name,
                    daily: row['Hours'] || 8,
                    monthly: (row['Hours'] || 8) * 20 // assume 20 working days
                };
            }
        });

        return result;
    }

    parseFinalClearance(workbook) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Auditor'] || row['Name'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                const receivedDate = new Date(row['Received Date'] || new Date());
                const clearanceDate = new Date(row['Clearance Date'] || new Date());
                const slaDays = Math.ceil((clearanceDate - receivedDate) / (1000 * 60 * 60 * 24));

                if (!result[empId]) {
                    result[empId] = { name, count: 0, avgSLA: 0, totalSLA: 0 };
                }
                result[empId].count++;
                result[empId].totalSLA += slaDays;
                result[empId].avgSLA = Math.round(result[empId].totalSLA / result[empId].count);
            }
        });

        return result;
    }

    parsePaperworkClearance(workbook) {
        const sheet = workbook.Sheets['Clearance Tracker'] || workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const result = {};

        data.forEach(row => {
            const name = row['Coordinator'] || row['Name'];
            const empId = this.findEmployeeId(name);
            if (empId) {
                const receivedDate = new Date(row['Received Date'] || new Date());
                const auditedDate = new Date(row['Audited Date'] || new Date());
                const slaDays = Math.ceil((auditedDate - receivedDate) / (1000 * 60 * 60 * 24));

                if (!result[empId]) {
                    result[empId] = { name, count: 0, avgSLA: 0, totalSLA: 0 };
                }
                result[empId].count++;
                result[empId].totalSLA += slaDays;
                result[empId].avgSLA = Math.round(result[empId].totalSLA / result[empId].count);
            }
        });

        return result;
    }

    parseQMGErrors(workbook) {
        const result = {};
        const roster = this.getEmployeeRoster();

        ['NCA errors', 'CA errors'].forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            if (sheet) {
                const data = XLSX.utils.sheet_to_json(sheet);
                data.forEach(row => {
                    const name = row['Employee'] || row['Name'];
                    const empId = Object.keys(roster).find(id => roster[id].name === name);
                    if (empId) {
                        if (!result[empId]) {
                            result[empId] = { name, ncaErrors: 0, caErrors: 0 };
                        }
                        if (sheetName === 'NCA errors') {
                            result[empId].ncaErrors += row['Count'] || 1;
                        } else {
                            result[empId].caErrors += row['Count'] || 1;
                        }
                    }
                });
            }
        });

        return result;
    }

    // ===== CALCULATIONS =====

    async calculateScores() {
        const roster = this.getEmployeeRoster();
        
        // Initialize employees
        Object.keys(roster).forEach(empId => {
            this.employees[empId] = {
                id: empId,
                name: roster[empId].name,
                team: roster[empId].team,
                kpis: {},
                score: 0,
                status: 'Green',
                eligibility: 'Eligible'
            };
        });

        // Calculate KPIs per employee
        Object.keys(this.employees).forEach(empId => {
            const emp = this.employees[empId];
            this.calculateEmployeeKPIs(emp);
            this.calculateFinalScore(emp);
            this.checkEligibility(emp);
        });

        // Aggregate team data
        this.aggregateTeams();
    }

    calculateEmployeeKPIs(emp) {
        const data = this.rawData;

        // Productivity (average hours per day)
        if (data.productivity && data.productivity[emp.id]) {
            emp.kpis.productivity = data.productivity[emp.id].daily || 8;
        } else {
            emp.kpis.productivity = 8;
        }

        // PKT Score (0-100)
        if (data.pkt && data.pkt[emp.id]) {
            emp.kpis.pkt = data.pkt[emp.id].score || 0;
        } else {
            emp.kpis.pkt = 0;
        }

        // Attendance (monthly average leaves)
        if (data.attendance && data.attendance[emp.id]) {
            const leaves = Object.values(data.attendance[emp.id].monthly || {});
            const avgLeaves = leaves.length > 0 ? leaves.reduce((a, b) => a + b, 0) / leaves.length : 0;
            emp.kpis.attendance = Math.max(0, 100 - (avgLeaves * 2)); // 2% per leave
        } else {
            emp.kpis.attendance = 95;
        }

        // Audit Quality (inverse of errors)
        if (data.auditScores && data.auditScores[emp.id]) {
            const errors = data.auditScores[emp.id].errors || 0;
            emp.kpis.auditQuality = Math.max(0, 100 - (errors * 10));
        } else {
            emp.kpis.auditQuality = 90;
        }

        // NH Pending
        if (data.nhPending && data.nhPending[emp.id]) {
            emp.kpis.nhPending = data.nhPending[emp.id].pending;
        } else {
            emp.kpis.nhPending = 0;
        }

        // Client System Pending
        if (data.clientAudit && data.clientAudit[emp.id]) {
            emp.kpis.clientPending = data.clientAudit[emp.id].pending;
        } else {
            emp.kpis.clientPending = 0;
        }

        // QMG Errors (Internal Audit team)
        if (data.qmgErrors && data.qmgErrors[emp.id]) {
            emp.kpis.qmgErrors = (data.qmgErrors[emp.id].ncaErrors || 0) + (data.qmgErrors[emp.id].caErrors || 0);
        } else {
            emp.kpis.qmgErrors = 0;
        }

        // SLA Compliance (Final & Paperwork Clearance)
        if (data.finalClearance && data.finalClearance[emp.id]) {
            const sla = data.finalClearance[emp.id].avgSLA || 0;
            emp.kpis.fcSLA = sla <= 2 ? 100 : Math.max(0, 100 - (sla - 2) * 10);
        }

        if (data.paperworkClearance && data.paperworkClearance[emp.id]) {
            const sla = data.paperworkClearance[emp.id].avgSLA || 0;
            emp.kpis.pcSLA = sla <= 3 ? 100 : Math.max(0, 100 - (sla - 3) * 10);
        }
    }

    calculateFinalScore(emp) {
        // Team-specific scoring
        const team = emp.team;
        const kpis = emp.kpis;

        let score = 0;

        if (team === 'Compliance') {
            score = (kpis.pkt * 0.4) + (kpis.attendance * 0.2) + (Math.min(10, kpis.productivity) * 10 * 0.2) + (kpis.auditQuality * 0.2);
        } else if (team === 'Final Clearance') {
            const sla = kpis.fcSLA || 90;
            score = (kpis.pkt * 0.3) + (sla * 0.3) + (kpis.attendance * 0.2) + (kpis.auditQuality * 0.2);
        } else if (team === 'Internal Audit') {
            score = (kpis.auditQuality * 0.4) + (kpis.attendance * 0.2) + (Math.min(10, kpis.productivity) * 10 * 0.2) + (kpis.pkt * 0.2);
        } else if (team === 'Paperwork Clearance') {
            const sla = kpis.pcSLA || 90;
            score = (sla * 0.3) + (kpis.pkt * 0.25) + (kpis.attendance * 0.25) + (kpis.auditQuality * 0.2);
        } else {
            // HR Operations (average)
            score = (kpis.pkt * 0.3) + (kpis.attendance * 0.3) + (Math.min(10, kpis.productivity) * 10 * 0.2) + (kpis.auditQuality * 0.2);
        }

        emp.score = Math.round(score);

        // Status color coding
        if (emp.score >= 90) {
            emp.status = 'Green';
        } else if (emp.score >= 80) {
            emp.status = 'Amber';
        } else {
            emp.status = 'Red';
        }
    }

    checkEligibility(emp) {
        if (emp.kpis.nhPending > 0 || emp.kpis.clientPending > 0) {
            emp.eligibility = 'Not Eligible';
            emp.ineligibilityReason = [];
            if (emp.kpis.nhPending > 0) emp.ineligibilityReason.push('NH Pending');
            if (emp.kpis.clientPending > 0) emp.ineligibilityReason.push('Client System Pending');
        } else {
            emp.eligibility = 'Eligible';
        }
    }

    aggregateTeams() {
        Object.keys(this.teams).forEach(team => {
            this.teams[team] = [];
        });

        Object.values(this.employees).forEach(emp => {
            this.teams[emp.team].push(emp);
        });

        // Sort each team by score descending
        Object.keys(this.teams).forEach(team => {
            this.teams[team].sort((a, b) => b.score - a.score);
        });
    }

    // Find employee ID by name
    findEmployeeId(name) {
        if (!name) return null;
        const roster = this.getEmployeeRoster();
        return Object.keys(roster).find(id => 
            roster[id].name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(roster[id].name.toLowerCase())
        );
    }

    // Get summary statistics
    getSummary() {
        const allEmps = Object.values(this.employees);
        const eligible = allEmps.filter(e => e.eligibility === 'Eligible');
        const green = allEmps.filter(e => e.status === 'Green');
        const amber = allEmps.filter(e => e.status === 'Amber');
        const red = allEmps.filter(e => e.status === 'Red');

        return {
            totalEmployees: allEmps.length,
            avgScore: Math.round(allEmps.reduce((sum, e) => sum + e.score, 0) / allEmps.length),
            avgProductivity: (allEmps.reduce((sum, e) => sum + (e.kpis.productivity || 0), 0) / allEmps.length).toFixed(1),
            avgPKT: Math.round(allEmps.reduce((sum, e) => sum + (e.kpis.pkt || 0), 0) / allEmps.length),
            avgAttendance: Math.round(allEmps.reduce((sum, e) => sum + (e.kpis.attendance || 0), 0) / allEmps.length),
            eligible: { count: eligible.length, pct: Math.round((eligible.length / allEmps.length) * 100) },
            green: { count: green.length, pct: Math.round((green.length / allEmps.length) * 100) },
            amber: { count: amber.length, pct: Math.round((amber.length / allEmps.length) * 100) },
            red: { count: red.length, pct: Math.round((red.length / allEmps.length) * 100) }
        };
    }

    // Save to localStorage
    saveToStorage() {
        const data = {
            timestamp: new Date().toISOString(),
            employees: this.employees,
            teams: this.teams,
            summary: this.getSummary()
        };
        localStorage.setItem('hrops_scorecard_data', JSON.stringify(data));
        return data;
    }

    // Load from localStorage
    loadFromStorage() {
        const data = localStorage.getItem('hrops_scorecard_data');
        if (data) {
            const parsed = JSON.parse(data);
            this.employees = parsed.employees || {};
            this.teams = parsed.teams || {};
            return parsed;
        }
        return null;
    }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.ScoreCardEngine = ScoreCardEngine;
}

