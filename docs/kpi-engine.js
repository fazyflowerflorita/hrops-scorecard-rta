class TeamKPIEngine {
            constructor() {
                this.employees = {};
                this.teams = {};
                this.excelData = {};
            }

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
                    'P13310': { name: 'Rihana Hussain', team: 'HR Operations' },
                    'P11156': { name: 'Yogeshwaran R', team: 'Internal Audit' },
                    'P11569': { name: 'Banupriya B', team: 'Internal Audit' },
                    'P11470': { name: 'Leonie Gomes', team: 'Paperwork Clearance' },
                    'P12527': { name: 'Thirisha Manoharan', team: 'Paperwork Clearance' },
                    'P12945': { name: 'Vinish Navinkumar', team: 'Paperwork Clearance' }
                };
            }

            // Parse Excel files
            async processExcelFiles(fileList) {
                for (const file of fileList) {
                    try {
                        const arrayBuffer = await this.readFile(file);
                        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                        this.parseFile(workbook, file.name);
                    } catch (e) {
                        console.log(`File ${file.name}: ${e.message}`);
                    }
                }

                // Initialize all employees with team-specific KPIs
                this.initializeEmployees();
                
                // Extract KPIs from parsed data
                this.extractKPIs();
                
                // Calculate team-specific scores
                this.calculateTeamScores();
                
                return { success: true };
            }

            readFile(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(file);
                });
            }

            parseSheetToJson(sheet) {
                if (!sheet) return [];
                // Get all rows with proper handling of datetime headers
                const rows = [];
                let headers = [];

                for (let row = sheet['!ref'].split(':')[0].charCodeAt(0) - 65, col = 1; col <= sheet['!ref'].split('!')[1].split(':')[1].charCodeAt(0) - 64; col++) {
                    const cell = sheet[XLSX.utils.encode_cell({r: 0, c: col - 1})];
                    headers.push(cell ? cell.v : `Col${col}`);
                }

                // Simpler approach - just use sheet_to_json but handle the result
                const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                return data;
            }

            parseSheetRows(sheet) {
                if (!sheet || !sheet['!ref']) return [];
                try {
                    const data = XLSX.utils.sheet_to_json(sheet, {
                        header: 1, // Return array of arrays instead of objects first
                        defval: ''
                    });

                    if (!data || data.length < 2) return [];

                    // Some trackers have a merged title row above the real headers
                    // (e.g. "Noncustomer affecting error"). Find the first row that
                    // actually looks like a header row (2+ non-empty cells) instead
                    // of always assuming row 0.
                    let headerIdx = 0;
                    for (let i = 0; i < Math.min(data.length, 5); i++) {
                        const nonEmpty = data[i].filter(c => c !== '' && c !== null && c !== undefined).length;
                        if (nonEmpty >= 2) { headerIdx = i; break; }
                    }

                    const headers = data[headerIdx];
                    const rows = [];

                    for (let i = headerIdx + 1; i < data.length; i++) {
                        const row = data[i];
                        // Some sheets report a used-range extending to 1M+ rows
                        // even though only the first ~50 have real data - skip
                        // fully-blank rows instead of building a giant array.
                        if (row.every(c => c === '' || c === undefined || c === null)) continue;
                        const obj = {};
                        for (let j = 0; j < headers.length; j++) {
                            if (headers[j] === '' || headers[j] === undefined || headers[j] === null) continue;
                            obj[headers[j]] = row[j] !== undefined ? row[j] : '';
                        }
                        rows.push(obj);
                    }

                    console.log(`✓ Parsed sheet: ${rows.length} rows, ${headers.length} columns (header row ${headerIdx})`);
                    return rows;
                } catch (e) {
                    console.error('Parse error:', e.message);
                    return [];
                }
            }

            // "Internal Audit Master file.xlsx" has a two-row header (month
            // date-serial on row 0, "Week1".."Week4" sub-labels on row 1) and
            // one row per audit-type-per-auditor with Yes/No/"-" per week -
            // doesn't fit the generic single-header-row parser.
            parseAuditMasterSheet(sheet) {
                if (!sheet || !sheet['!ref']) return [];
                try {
                    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                    if (!data || data.length < 3) return [];

                    // Row 0 has one date-serial per month, but it's only set on
                    // the FIRST of that month's 4 "Week" sub-columns (the other
                    // 3 are blank) - forward-fill it across those blanks so
                    // every result column knows its real date.
                    const dateRow = data[0];
                    const colDates = [];
                    let lastDate = null;
                    for (let c = 0; c < dateRow.length; c++) {
                        if (typeof dateRow[c] === 'number') lastDate = dateRow[c];
                        colDates[c] = lastDate;
                    }

                    const rows = [];
                    for (let i = 2; i < data.length; i++) {
                        const row = data[i];
                        const auditName = row[0];
                        const auditorName = row[2];
                        if (!auditName && !auditorName) continue;
                        const results = [];
                        for (let c = 3; c < row.length; c++) {
                            if (row[c] === 'Yes' || row[c] === 'No') {
                                results.push({ date: colDates[c], value: row[c] });
                            }
                        }
                        if (results.length === 0) continue;
                        rows.push({ auditName, auditorName, results });
                    }
                    return rows;
                } catch (e) {
                    console.error('Parse error (audit master):', e.message);
                    return [];
                }
            }

            // ===== Fuzzy name matching helpers =====
            // Excel trackers spell the same person's name differently across files
            // (missing middle names, nicknames like "Banu" for "Banupriya",
            // occasional typos). These helpers match names tolerantly instead of
            // requiring an exact string match, while still refusing to guess-match
            // names that are genuinely different.
            levenshtein(a, b) {
                const m = a.length, n = b.length;
                if (!m) return n;
                if (!n) return m;
                const dp = new Array(n + 1);
                for (let j = 0; j <= n; j++) dp[j] = j;
                for (let i = 1; i <= m; i++) {
                    let prev = dp[0];
                    dp[0] = i;
                    for (let j = 1; j <= n; j++) {
                        const temp = dp[j];
                        dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
                        prev = temp;
                    }
                }
                return dp[n];
            }

            normalizeName(s) {
                return (s || '').toString().trim().toLowerCase()
                    .replace(/[\/,&]+/g, ' ')
                    .replace(/\band\b/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            }

            // Extract every "Name (count)" / "Name(count)" / "Name - count"
            // occurrence from a free-text tracker cell, e.g.
            // "Arjun- 05/Banu- 02/Yogesh-6" or
            // "Alan(1), Latha( 2), sneha( 1)" or
            // "Alan(1)  Leonie( 1) Sayee( 1)" (no separators at all).
            // Scanning for the pattern directly - rather than splitting on a
            // delimiter - handles all of these inconsistent formats at once.
            extractNameCounts(text) {
                const out = [];
                const str = (text || '').toString();
                const re = /([A-Za-z][A-Za-z]*)\s*(?:\(\s*(\d+)\s*\)|-\s*(\d+))/g;
                let m;
                while ((m = re.exec(str)) !== null) {
                    const count = parseInt(m[2] !== undefined ? m[2] : m[3], 10);
                    if (m[1] && !isNaN(count)) out.push({ name: m[1].trim(), count });
                }
                return out;
            }

            tokenMatch(a, b) {
                if (a === b) return true;
                if (a.length >= 3 && b.length >= 3 && (a.startsWith(b) || b.startsWith(a))) return true;
                if (a.length >= 4 && b.length >= 4 && this.levenshtein(a, b) <= 1) return true;
                return false;
            }

            nameMatches(candidate, target) {
                const a = this.normalizeName(candidate);
                const b = this.normalizeName(target);
                if (!a || !b) return false;
                if (a === b) return true;

                // Ignore bare initials ("B" in "Sayee Nivas B") when requiring
                // every token to match - informal name fields (like a
                // multi-person tracker cell) usually drop middle initials
                // entirely rather than misspelling them.
                const aTokens = a.split(' ').filter(t => t.length > 1);
                const bTokens = b.split(' ').filter(t => t.length > 1);
                const shorter = aTokens.length <= bTokens.length ? aTokens : bTokens;
                const longer = aTokens.length <= bTokens.length ? bTokens : aTokens;

                // Every token of the shorter name must fuzzy-match some token in the longer name
                const allMatch = shorter.length > 0 && shorter.every(t => longer.some(lt => this.tokenMatch(t, lt)));
                if (allMatch) return true;

                // Whole-string fallback catches typos that cross word boundaries
                const maxLen = Math.max(a.length, b.length);
                if (maxLen >= 6) {
                    const dist = this.levenshtein(a, b);
                    if (1 - dist / maxLen >= 0.82) return true;
                }
                return false;
            }

            // Uploading the whole "Score Card" folder means every team
            // subfolder contributes a file with the same name (e.g.
            // "Attendance.xlsx"), but those files are NOT identical copies -
            // each team's copy has its own rows. Merge them (de-duplicating
            // exact repeats, since some trackers like Production Tracker
            // genuinely are the same master file duplicated in every folder)
            // instead of letting the last-processed team silently overwrite
            // every other team's data.
            mergeIntoExcelData(key, newRows) {
                if (!this.excelData[key]) this.excelData[key] = [];
                this._seenRows = this._seenRows || {};
                this._seenRows[key] = this._seenRows[key] || new Set();
                const seen = this._seenRows[key];
                newRows.forEach(row => {
                    const hash = JSON.stringify(row);
                    if (!seen.has(hash)) {
                        seen.add(hash);
                        this.excelData[key].push(row);
                    }
                });
            }

            // Excel stores dates as a day-serial number (e.g. 46024 = a day in
            // 2026), not a JS timestamp. `new Date(46024)` silently treats it
            // as 46024 MILLISECONDS after 1970-01-01 - a nonsense date that
            // still "works" arithmetically (differences come out as tiny
            // fractions of a day, rounding every real gap down to ~0-1 via
            // Math.ceil), which is exactly the kind of wrong-but-plausible
            // number this pipeline must never produce silently.
            excelDateToJSDate(value) {
                if (value === null || value === undefined || value === '') return null;
                if (typeof value === 'number') {
                    const utcDays = Math.floor(value - 25569);
                    return new Date(utcDays * 86400 * 1000);
                }
                const d = new Date(value);
                return isNaN(d.getTime()) ? null : d;
            }

            // Look up a field by header name, tolerant of trailing/leading spaces
            // in the Excel header (e.g. "Audit Status " vs "Audit Status").
            getField(row, key) {
                if (!row) return undefined;
                if (row[key] !== undefined) return row[key];
                const normKey = key.trim().toLowerCase();
                const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === normKey);
                return foundKey !== undefined ? row[foundKey] : undefined;
            }

            parseFile(workbook, fileName) {
                if (fileName.includes('Attendance')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('attendance', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Production')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('production', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Process_Knowledge') || fileName.includes('Process Knowledge')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('pkt', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('NH_pending') || fileName.includes('NH pending')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('nhPending', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Client_System_Audit') || fileName.includes('Client System Audit')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('clientAudit', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Internal_Audit_Scores') || fileName.includes('Internal Audit Scores')) {
                    // The current tracker has 3 named tabs: "Internal Audit"
                    // (Compliance team's weekly error log, Team Member column
                    // packs multiple names like "Sayee (1) & Pavithra (1)"),
                    // "QMG Scores" (Internal Audit team's NCA/CA error log,
                    // similar free-text format), and "Error Tracker" (per-case
                    // rows used for QMG Timeline). Older exports only have one
                    // unnamed sheet shaped like "QMG Scores".
                    const iaSheetName = workbook.SheetNames.find(s => s.trim().toLowerCase() === 'internal audit');
                    const qmgSheetName = workbook.SheetNames.find(s => s.trim().toLowerCase() === 'qmg scores');
                    const errTrackerSheetName = workbook.SheetNames.find(s => s.trim().toLowerCase() === 'error tracker');
                    if (iaSheetName) {
                        this.mergeIntoExcelData('internalAuditWeekly', this.parseSheetRows(workbook.Sheets[iaSheetName]));
                    }
                    if (qmgSheetName) {
                        this.mergeIntoExcelData('qmgScores', this.parseSheetRows(workbook.Sheets[qmgSheetName]));
                    } else if (!iaSheetName && !errTrackerSheetName) {
                        this.mergeIntoExcelData('qmgScores', this.parseSheetRows(workbook.Sheets[workbook.SheetNames[0]]));
                    }
                    if (errTrackerSheetName) {
                        this.mergeIntoExcelData('qmgTimelineData', this.parseSheetRows(workbook.Sheets[errTrackerSheetName]));
                    }
                }
                else if (fileName.includes('Data Changes') || fileName.includes('Data_Changes')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('dataChanges', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Tenure Discount') || fileName.includes('Tenure_Discount')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('tenureDiscount', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Termination')) {
                    const sheetName = workbook.SheetNames.find(s => s.includes('RTA')) || workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    this.mergeIntoExcelData('termination', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Final Clearance') || fileName.includes('Final_Clearance')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('finalClearance', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Internal Audit Master') || fileName.includes('Internal_Audit_Master')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('auditMaster', this.parseAuditMasterSheet(sheet));
                }
                else if (fileName.includes('Internal Audit Tracker') || fileName.includes('Internal_Audit_Tracker')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('internalAuditTracker', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('QMG Error') || fileName.includes('QMG_Error')) {
                    // Exact-match sheet names: "NCA errors".includes('CA errors') is
                    // true (substring match), so a loose includes() check would grab
                    // the wrong sheet for CA errors.
                    const ncaSheetName = workbook.SheetNames.find(s => s.trim().toLowerCase() === 'nca errors') || workbook.SheetNames[1];
                    const caSheetName = workbook.SheetNames.find(s => s.trim().toLowerCase() === 'ca errors');
                    if (ncaSheetName) this.mergeIntoExcelData('qmgErrors', this.parseSheetRows(workbook.Sheets[ncaSheetName]));
                    if (caSheetName) this.mergeIntoExcelData('qmgCAErrorsData', this.parseSheetRows(workbook.Sheets[caSheetName]));
                }
                else if (fileName.includes('Paperwork Allocation') || fileName.includes('Paperwork_Allocation')) {
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.mergeIntoExcelData('paperworkAllocation', this.parseSheetRows(sheet));
                }
                else if (fileName.includes('Paperwork Clearance') || fileName.includes('Paperwork_Clearance')) {
                    // The current file spells it "Clerance Tracker" (typo) and
                    // has both a main and an "MS -" sheet - merge whichever
                    // clearance-tracker-shaped sheets exist rather than only
                    // matching the correctly-spelled name.
                    const clearanceSheets = workbook.SheetNames.filter(s => /clea?rance tracker/i.test(s));
                    const sheetNames = clearanceSheets.length > 0 ? clearanceSheets : [workbook.SheetNames[0]];
                    sheetNames.forEach(sn => {
                        this.mergeIntoExcelData('paperworkClearance', this.parseSheetRows(workbook.Sheets[sn]));
                    });
                }
                else if (fileName.includes('Incentive')) {
                    // Load Roles sheet for incentive role mapping
                    const rolesSheet = workbook.Sheets['Roles'];
                    if (rolesSheet) {
                        this.mergeIntoExcelData('roles', this.parseSheetRows(rolesSheet));
                    }
                }
            }

            initializeEmployees() {
                const roster = this.getEmployeeRoster();
                const teams = {
                    'HR Operations': [],
                    'Compliance': [],
                    'Final Clearance': [],
                    'Internal Audit': [],
                    'Paperwork Clearance': []
                };

                Object.entries(roster).forEach(([empId, info]) => {
                    // Get role from Excel Roles sheet if available
                    let role = 'Auditor'; // default
                    if (this.excelData.roles) {
                        const roleRow = this.excelData.roles.find(r => {
                            const idCol = Object.keys(r)[0];
                            return r[idCol] && r[idCol].toString().includes(empId);
                        });
                        if (roleRow) {
                            const roleCol = roleRow['Role'] || Object.values(roleRow)[Object.keys(roleRow).length - 1];
                            role = roleCol || 'Auditor';
                        }
                    }

                    const emp = {
                        id: empId,
                        name: info.name,
                        team: info.team,
                        role: role,
                        kpis: {},
                        scores: {},
                        status: 'Red',
                        eligibility: 'Eligible'
                    };
                    this.employees[empId] = emp;
                    teams[info.team].push(empId);
                });

                this.teams = teams;
            }

            extractKPIs() {
                Object.entries(this.employees).forEach(([empId, emp]) => {
                    const team = emp.team;

                    // COMMON KPIs (All Teams)
                    emp.kpis.productivity = this.getProductivity(emp.name);
                    emp.kpis.productivityStatus = emp.kpis.productivity === null ? 'Blue' : emp.kpis.productivity >= 8 ? 'Green' : 'Red';

                    emp.kpis.pkt = this.getPKT(emp.name);
                    emp.kpis.pktStatus = emp.kpis.pkt === null ? 'Blue' : emp.kpis.pkt >= 90 ? 'Green' : emp.kpis.pkt >= 80 ? 'Amber' : 'Red';

                    emp.kpis.attendance = this.getAttendance(emp.name);
                    emp.kpis.attendanceStatus = emp.kpis.attendance === null ? 'Blue' : emp.kpis.attendance >= 90 ? 'Green' : emp.kpis.attendance >= 75 ? 'Amber' : 'Red';

                    emp.kpis.clientPending = this.getClientPending(emp.name);
                    emp.kpis.nhPending = this.getNHPending(emp.name);

                    // TEAM-SPECIFIC KPIs
                    if (team === 'HR Operations') {
                        emp.kpis.dataChanges = this.getDataChanges(emp.name);
                        emp.kpis.dataChangesPending = this.getDataChangesPending(emp.name);
                        emp.kpis.terminationStatus = this.getTerminationStatus(emp.name);
                        emp.kpis.tenureDiscount = this.getTenureDiscount(emp.name);
                    }
                    else if (team === 'Compliance') {
                        emp.kpis.internalAuditErrors = this.getInternalAuditErrors(emp.name);
                        emp.kpis.auditStatus = emp.kpis.internalAuditErrors === null ? 'Blue' : emp.kpis.internalAuditErrors === 0 ? 'Green' : emp.kpis.internalAuditErrors <= 3 ? 'Amber' : 'Red';
                    }
                    else if (team === 'Final Clearance') {
                        emp.kpis.internalAuditErrors = this.getInternalAuditErrors(emp.name);
                        emp.kpis.auditStatus = emp.kpis.internalAuditErrors === null ? 'Blue' : emp.kpis.internalAuditErrors === 0 ? 'Green' : emp.kpis.internalAuditErrors <= 3 ? 'Amber' : 'Red';
                        emp.kpis.clearanceSLA = this.getClearanceSLA(emp.name);
                        emp.kpis.clearanceCount = this.getClearanceCount(emp.name);
                        emp.kpis.slaStatus = emp.kpis.clearanceSLA === null ? 'Blue' : emp.kpis.clearanceSLA >= 90 ? 'Green' : emp.kpis.clearanceSLA >= 75 ? 'Amber' : 'Red';
                    }
                    else if (team === 'Internal Audit') {
                        emp.kpis.nhPending = this.getNHPending(emp.name);
                        emp.kpis.qmgTimeline = this.getQMGTimeline(emp.name);
                        emp.kpis.timelineStatus = emp.kpis.qmgTimeline === null ? 'Blue' : emp.kpis.qmgTimeline >= 90 ? 'Green' : emp.kpis.qmgTimeline >= 75 ? 'Amber' : 'Red';
                        emp.kpis.qmgNCAErrors = this.getQMGErrors(emp.name);
                        emp.kpis.qmgCAErrors = this.getQMGCAErrors(emp.name);
                        emp.kpis.auditCompletion = this.getAuditCompletion(emp.name);
                    }
                    else if (team === 'Paperwork Audit' || team === 'Paperwork Clearance') {
                        emp.kpis.nhPending = this.getNHPending(emp.name);
                        emp.kpis.internalAuditErrors = this.getInternalAuditErrors(emp.name);
                        emp.kpis.auditStatus = emp.kpis.internalAuditErrors === null ? 'Blue' : emp.kpis.internalAuditErrors === 0 ? 'Green' : emp.kpis.internalAuditErrors <= 3 ? 'Amber' : 'Red';
                        emp.kpis.paperworkSLA = this.getPaperworkSLA(emp.name);
                        emp.kpis.slaStatus = emp.kpis.paperworkSLA === null ? 'Blue' : emp.kpis.paperworkSLA >= 90 ? 'Green' : emp.kpis.paperworkSLA >= 75 ? 'Amber' : 'Red';
                        emp.kpis.allocationCompletion = this.getAllocationCompletion(emp.name);
                    }
                });
            }

            calculateTeamScores() {
                Object.entries(this.employees).forEach(([empId, emp]) => {
                    const team = emp.team;
                    let score = 0;

                    // TEAM-SPECIFIC SCORING FORMULAS
                    if (team === 'HR Operations') {
                        score = (emp.kpis.productivity !== null && emp.kpis.productivity >= 8 ? 20 : 0) +
                                (emp.kpis.pkt !== null && emp.kpis.pkt >= 90 ? 25 : emp.kpis.pkt !== null && emp.kpis.pkt >= 80 ? 20 : 15) +
                                (emp.kpis.attendance !== null && emp.kpis.attendance >= 90 ? 25 : emp.kpis.attendance !== null && emp.kpis.attendance >= 75 ? 20 : 15) +
                                (emp.kpis.dataChanges !== null && emp.kpis.dataChanges >= 0.9 ? 15 : 0) +
                                (emp.kpis.clientPending === null || emp.kpis.clientPending === 0 ? 15 : 0);
                    }
                    else if (team === 'Compliance') {
                        score = (emp.kpis.productivity !== null && emp.kpis.productivity >= 8 ? 20 : 0) +
                                (emp.kpis.pkt !== null && emp.kpis.pkt >= 90 ? 30 : emp.kpis.pkt !== null && emp.kpis.pkt >= 80 ? 20 : 10) +
                                (emp.kpis.internalAuditErrors !== null && emp.kpis.internalAuditErrors === 0 ? 30 : emp.kpis.internalAuditErrors !== null && emp.kpis.internalAuditErrors <= 3 ? 20 : 10) +
                                (emp.kpis.attendance !== null && emp.kpis.attendance >= 90 ? 20 : 0);
                    }
                    else if (team === 'Final Clearance') {
                        score = (emp.kpis.productivity !== null && emp.kpis.productivity >= 8 ? 15 : 0) +
                                (emp.kpis.pkt !== null && emp.kpis.pkt >= 90 ? 20 : 10) +
                                (emp.kpis.clearanceSLA !== null && emp.kpis.clearanceSLA >= 90 ? 30 : 15) +
                                (emp.kpis.internalAuditErrors !== null && emp.kpis.internalAuditErrors === 0 ? 20 : 10) +
                                (emp.kpis.attendance !== null && emp.kpis.attendance >= 90 ? 15 : 0);
                    }
                    else if (team === 'Internal Audit') {
                        score = (emp.kpis.productivity !== null && emp.kpis.productivity >= 8 ? 15 : 0) +
                                (emp.kpis.pkt !== null && emp.kpis.pkt >= 90 ? 20 : 10) +
                                (emp.kpis.qmgTimeline !== null && emp.kpis.qmgTimeline >= 90 ? 25 : 15) +
                                ((emp.kpis.qmgNCAErrors !== null ? emp.kpis.qmgNCAErrors : 0) + (emp.kpis.qmgCAErrors !== null ? emp.kpis.qmgCAErrors : 0) === 0 ? 25 : 15) +
                                (emp.kpis.attendance !== null && emp.kpis.attendance >= 90 ? 15 : 0);
                    }
                    else if (team === 'Paperwork Audit' || team === 'Paperwork Clearance') {
                        score = (emp.kpis.productivity !== null && emp.kpis.productivity >= 8 ? 15 : 0) +
                                (emp.kpis.pkt !== null && emp.kpis.pkt >= 90 ? 20 : 10) +
                                (emp.kpis.paperworkSLA !== null && emp.kpis.paperworkSLA >= 90 ? 30 : 15) +
                                (emp.kpis.allocationCompletion !== null && emp.kpis.allocationCompletion >= 0.9 ? 20 : 10) +
                                (emp.kpis.attendance !== null && emp.kpis.attendance >= 90 ? 15 : 0);
                    }

                    emp.scores.teamScore = score;

                    if (score >= 90) emp.status = 'Green';
                    else if (score >= 80) emp.status = 'Amber';
                    else emp.status = 'Red';

                    // ELIGIBILITY CHECK - Team-specific logic
                    let isEligible = true;

                    // All teams except Final Clearance check NH Pending
                    if (team !== 'Final Clearance') {
                        const nhCount = emp.kpis.nhPending === null ? 0 : emp.kpis.nhPending;
                        if (nhCount > 0) isEligible = false;
                    }

                    // All teams check Client System Audit
                    const clientCount = emp.kpis.clientPending === null ? 0 : emp.kpis.clientPending;
                    if (clientCount > 0) isEligible = false;

                    emp.eligibility = isEligible ? 'Eligible' : 'Not Eligible';
                });
            }

            // Helper functions to extract KPIs from Excel data
            findEmployeeRow(data, name) {
                if (!data || !Array.isArray(data)) return null;
                // NOTE: do not use Object.values(r)[0] to find the name column.
                // These sheets have datetime-serial numbers (e.g. 46023) as
                // column headers, and JS always enumerates integer-like object
                // keys before string keys regardless of insertion order - so
                // "Team Member" silently ends up last in Object.values(), not
                // first. Look the name column up explicitly by header instead.
                return data.find(r => {
                    const nameVal = r['Team Member'] !== undefined ? r['Team Member']
                        : Object.keys(r).find(k => isNaN(Number(k))) ? r[Object.keys(r).find(k => isNaN(Number(k)))]
                        : undefined;
                    return nameVal && this.nameMatches(nameVal, name);
                });
            }

            getAverageFromMonthColumns(row) {
                if (!row) return null;
                // Exclude the name column by key, not by position - month
                // columns are the datetime-serial keys, which (see note above)
                // do not reliably sit at a fixed position in Object.values().
                const values = Object.entries(row)
                    .filter(([k, v]) => k !== 'Team Member' && typeof v === 'number' && v > 0)
                    .map(([k, v]) => v);
                if (values.length === 0) return null;
                return values.reduce((a, b) => a + b, 0) / values.length;
            }

            getProductivity(name) {
                if (!this.excelData.production) return null;
                const row = this.findEmployeeRow(this.excelData.production, name);
                if (row) {
                    const avg = this.getAverageFromMonthColumns(row);
                    return avg > 0 ? avg : null;
                }
                return null;
            }

            getPKT(name) {
                if (!this.excelData.pkt) return null;
                const row = this.findEmployeeRow(this.excelData.pkt, name);
                if (row) {
                    const avg = this.getAverageFromMonthColumns(row);
                    return avg > 0 ? avg : null;
                }
                return null;
            }

            getAttendance(name) {
                if (!this.excelData.attendance) return null;
                const row = this.findEmployeeRow(this.excelData.attendance, name);
                if (row) {
                    const leaves = Object.entries(row)
                        .filter(([k, v]) => k !== 'Team Member' && typeof v === 'number')
                        .map(([k, v]) => v);
                    if (leaves.length > 0) {
                        const avgLeaves = leaves.reduce((a, b) => a + b, 0) / leaves.length;
                        const result = Math.max(0, 100 - (avgLeaves * 5));
                        return result > 0 ? result : null;
                    }
                }
                return null;
            }

            getNHPending(name) {
                if (!this.excelData.nhPending) return null;
                // Target = 0 pending: count any record not yet Completed/Cleared,
                // not just ones literally marked "Pending".
                const pendingCount = this.excelData.nhPending.filter(row => {
                    const auditor = row['Auditor'] || row['Processor'];
                    const status = (row['Status'] || '').toString().trim().toLowerCase();
                    if (!auditor || !this.nameMatches(auditor, name)) return false;
                    if (!status) return false;
                    return !status.includes('completed') && !status.includes('cleared');
                }).length;
                return pendingCount > 0 ? 1 : 0;
            }

            getClientPending(name) {
                if (!this.excelData.clientAudit) return null;
                // Status = "Completed" -> full amount (eligible); anything
                // else -> pending, no amount.
                let found = false;
                let pendingCount = 0;
                this.excelData.clientAudit.forEach(row => {
                    const member = row['Team Member'];
                    if (member && this.nameMatches(member, name)) {
                        found = true;
                        const status = (row['Status'] || '').toString().trim().toLowerCase();
                        if (status !== 'completed') pendingCount++;
                    }
                });
                return found ? pendingCount : null;
            }

            getInternalAuditErrors(name) {
                // "Error Tracker" tab of Internal Audit Scores.xlsx: sum of
                // Error Count for rows where Processor matches this employee.
                if (!this.excelData.qmgTimelineData) return null;
                let totalErrors = 0;
                this.excelData.qmgTimelineData.forEach(row => {
                    const processor = row['Processor'];
                    if (!processor || !this.nameMatches(processor, name)) return;
                    const errCount = parseFloat(row['Error Count']);
                    if (!isNaN(errCount)) totalErrors += errCount;
                });
                return totalErrors;
            }

            // HR Operations specific KPIs
            getDataChanges(name) {
                if (!this.excelData.dataChanges) return null;
                // % of this employee's received data-change requests that have
                // a Data Change Completed Date populated.
                const received = this.excelData.dataChanges.filter(row => {
                    const assignedTo = row['Assigned to'];
                    return assignedTo && this.nameMatches(assignedTo, name);
                }).length;
                if (received === 0) return null;
                const completed = this.excelData.dataChanges.filter(row => {
                    const assignedTo = row['Assigned to'];
                    const completedDate = row['Data Change Completed Date'];
                    return assignedTo && this.nameMatches(assignedTo, name) && completedDate;
                }).length;
                return completed / received;
            }

            // Companion to getDataChanges() - the raw pending count, since a
            // single completion % hides whether "pending" means 1 case or 50.
            getDataChangesPending(name) {
                if (!this.excelData.dataChanges) return null;
                return this.excelData.dataChanges.filter(row => {
                    const assignedTo = row['Assigned to'];
                    const completedDate = row['Data Change Completed Date'];
                    return assignedTo && this.nameMatches(assignedTo, name) && !completedDate;
                }).length;
            }

            getTenureDiscount(name) {
                if (!this.excelData.tenureDiscount) return null;
                // "Team Member" can list more than one name (e.g. "Arjun/Ingrid");
                // normalizeName() splits on "/" so nameMatches still works per-token.
                const pending = this.excelData.tenureDiscount.filter(row => {
                    const teamMember = row['Team Member'];
                    const status = (row['Status'] || '').toString().toLowerCase();
                    return teamMember && this.nameMatches(teamMember, name) && status.includes('pending');
                }).length;
                return pending;
            }

            getTerminationStatus(name) {
                if (!this.excelData.termination) return null;
                const row = this.excelData.termination.find(r => {
                    const candName = r['Candidate Name'];
                    return candName && this.nameMatches(candName, name);
                });
                return row ? row['Term Status'] || 'Active' : 'Active';
            }

            // "First response" / "Time Cleared" store a time-of-day, but
            // inconsistently: sometimes a raw Excel time fraction (e.g. 0.3),
            // sometimes text like "08.02 AM" or "06.46AM" (dot instead of
            // colon, inconsistent spacing). Returns minutes since midnight.
            parseTimeOfDayToMinutes(value) {
                if (value === null || value === undefined || value === '') return null;
                if (typeof value === 'number') {
                    const frac = value - Math.floor(value);
                    return Math.round(frac * 1440);
                }
                const str = value.toString().trim();
                const m = str.match(/^(\d{1,2})[.:](\d{2})\s*(AM|PM)$/i);
                if (!m) return null;
                let hours = parseInt(m[1], 10);
                const minutes = parseInt(m[2], 10);
                const ampm = m[3].toUpperCase();
                if (ampm === 'PM' && hours !== 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;
                return hours * 60 + minutes;
            }

            // Final Clearance specific KPIs
            getClearanceSLA(name) {
                if (!this.excelData.finalClearance) return null;
                // Clearance SLA % = cases where Time Cleared - First response
                // is within the 30-minute SLA target, over applicable cases.
                const rows = this.excelData.finalClearance.filter(r => {
                    const auditor = r['Audited By'];
                    return auditor && this.nameMatches(auditor, name);
                });

                if (rows.length === 0) return null;

                let applicable = 0;
                let withinSLA = 0;
                rows.forEach(row => {
                    const firstResponse = this.parseTimeOfDayToMinutes(row['First response']);
                    const timeCleared = this.parseTimeOfDayToMinutes(row['Time Cleared']);
                    if (firstResponse !== null && timeCleared !== null) {
                        applicable++;
                        let diff = timeCleared - firstResponse;
                        if (diff < 0) diff += 1440;
                        if (diff <= 30) withinSLA++;
                    }
                });

                return applicable > 0 ? Math.round((withinSLA / applicable) * 100) : null;
            }

            getClearanceCount(name) {
                if (!this.excelData.finalClearance) return null;
                // A case is cleared once it has a Fully Clearance Date; an
                // employee with none this period genuinely has a count of 0.
                return this.excelData.finalClearance.filter(r => {
                    const auditor = r['Audited By'];
                    const fullyCleared = r['Fully Clearance Date'];
                    return auditor && this.nameMatches(auditor, name) && fullyCleared && fullyCleared.toString().trim().toUpperCase() !== 'NA';
                }).length;
            }

            // Internal Audit specific KPIs
            getQMGTimeline(name) {
                // "Error Tracker" tab: Processed to QMG - Start date, per case.
                // QMG Timeline = % of this employee's cases processed within 8 days.
                if (!this.excelData.qmgTimelineData) return null;
                const rows = this.excelData.qmgTimelineData.filter(r => {
                    const auditor = r['Auditor'];
                    return auditor && this.nameMatches(auditor, name);
                });
                if (rows.length === 0) return null;

                let applicable = 0;
                let onTime = 0;
                rows.forEach(row => {
                    const start = this.excelDateToJSDate(row['Start date']);
                    const processedQMG = this.excelDateToJSDate(row['Processed to QMG']);
                    if (start && processedQMG) {
                        applicable++;
                        const days = Math.ceil((processedQMG - start) / (1000 * 60 * 60 * 24));
                        if (days <= 8) onTime++;
                    }
                });
                return applicable > 0 ? Math.round((onTime / applicable) * 100) : null;
            }

            // "QMG Scores" tab: same free-text "Name (count)" / "Name- count"
            // format as the Internal Audit tab, but classified by a CA/NCA
            // column - NCA and CA errors are separate KPIs.
            getQMGErrorsByType(name, type) {
                if (!this.excelData.qmgScores) return null;
                let total = 0;
                this.excelData.qmgScores.forEach(row => {
                    const caNca = (row['CA/NCA'] || '').toString().trim().toUpperCase();
                    if (caNca !== type) return;
                    const auditorField = row['Auditor who made the error'];
                    this.extractNameCounts(auditorField).forEach(({ name: segName, count }) => {
                        if (this.nameMatches(segName, name)) total += count;
                    });
                });
                return total;
            }

            getQMGErrors(name) {
                return this.getQMGErrorsByType(name, 'NCA');
            }

            getQMGCAErrors(name) {
                return this.getQMGErrorsByType(name, 'CA');
            }

            getAuditCompletion(name) {
                // "Internal Audit Master file.xlsx": one row per audit-type per
                // auditor (auditorName can list more than one, e.g. "Banupriya
                // and Yogesh"), with a Yes/No per week. Completion % = Yes count
                // over all applicable (Yes+No) weeks across every audit type
                // this employee is responsible for.
                if (!this.excelData.auditMaster) return null;
                let yes = 0, total = 0;
                this.excelData.auditMaster.forEach(entry => {
                    if (entry.auditorName && this.nameMatches(entry.auditorName, name)) {
                        entry.results.forEach(r => {
                            total++;
                            if (r.value === 'Yes') yes++;
                        });
                    }
                });
                return total > 0 ? (yes / total) : null;
            }

            // Paperwork Clearance specific KPIs
            getPaperworkSLA(name) {
                if (!this.excelData.paperworkAllocation) return null;
                // Paperwork SLA % = cases with Completed Date - Allocated On
                // within the 1-day SLA target, over applicable cases.
                const rows = this.excelData.paperworkAllocation.filter(r => {
                    const processor = r['Processor'];
                    return processor && this.nameMatches(processor, name);
                });

                if (rows.length === 0) return null;

                let applicable = 0;
                let withinSLA = 0;
                rows.forEach(row => {
                    const allocatedOn = this.excelDateToJSDate(row['Allocated On']);
                    const completedDate = this.excelDateToJSDate(row['Completed Date']);
                    if (allocatedOn && completedDate) {
                        applicable++;
                        const days = Math.ceil((completedDate - allocatedOn) / (1000 * 60 * 60 * 24));
                        if (days <= 1) withinSLA++;
                    }
                });

                return applicable > 0 ? Math.round((withinSLA / applicable) * 100) : null;
            }

            getAllocationCompletion(name) {
                if (!this.excelData.paperworkAllocation) return null;
                // Completed Allocations / Total Allocated - a record is
                // completed when "Completed Date" is populated (not
                // "Allocated On", which is populated for every assigned record
                // regardless of completion).
                const assigned = this.excelData.paperworkAllocation.filter(r => {
                    const processor = r['Processor'];
                    return processor && this.nameMatches(processor, name);
                }).length;
                if (assigned === 0) return null;
                const completed = this.excelData.paperworkAllocation.filter(r => {
                    const processor = r['Processor'];
                    const completedDate = r['Completed Date'];
                    return processor && this.nameMatches(processor, name) && completedDate;
                }).length;
                return completed / assigned;
            }

            getSummary() {
                const allEmps = Object.values(this.employees);
                return {
                    totalEmployees: allEmps.length,
                    avgScore: Math.round(allEmps.reduce((sum, e) => sum + (e.scores.teamScore || 0), 0) / allEmps.length),
                    avgProductivity: (allEmps.reduce((sum, e) => sum + (e.kpis.productivity || 0), 0) / allEmps.length).toFixed(1),
                    avgPKT: Math.round(allEmps.reduce((sum, e) => sum + (e.kpis.pkt || 0), 0) / allEmps.length),
                    eligible: { count: allEmps.filter(e => e.eligibility === 'Eligible').length, pct: Math.round((allEmps.filter(e => e.eligibility === 'Eligible').length / allEmps.length) * 100) },
                    green: { count: allEmps.filter(e => e.status === 'Green').length, pct: Math.round((allEmps.filter(e => e.status === 'Green').length / allEmps.length) * 100) },
                    amber: { count: allEmps.filter(e => e.status === 'Amber').length, pct: Math.round((allEmps.filter(e => e.status === 'Amber').length / allEmps.length) * 100) },
                    red: { count: allEmps.filter(e => e.status === 'Red').length, pct: Math.round((allEmps.filter(e => e.status === 'Red').length / allEmps.length) * 100) }
                };
            }

            // ===== Date-range filtering =====
            // The dashboards need real filtering (only count rows that
            // actually fall in the selected period), not a fake multiplier
            // applied to the lifetime total. This filters the RAW rows for
            // each source, then the existing extractKPIs/calculateTeamScores
            // pipeline re-aggregates from that filtered subset - no getter
            // needs to know about date ranges.
            //
            // Some sources have no reliable per-row date (free-text "Week"
            // labels like "WC 28th Dec" with an ambiguous year, or no date
            // column at all) - filtering those would either silently drop
            // real data or require guessing a date. They are intentionally
            // left unfiltered (always full-history) rather than guessed.
            filterRowsByDate(rows, dateFields, dateFrom, dateTo) {
                if (!dateFrom && !dateTo) return rows;
                return rows.filter(row => {
                    for (const field of dateFields) {
                        const d = this.excelDateToJSDate(row[field]);
                        if (d) {
                            if (dateFrom && d < dateFrom) return false;
                            if (dateTo && d > dateTo) return false;
                            return true;
                        }
                    }
                    return false;
                });
            }

            // Sources not filterable by date at all - kept as full history
            // regardless of the selected range (see note above).
            static get UNFILTERABLE_SOURCES() {
                return new Set(['tenureDiscount', 'internalAuditWeekly', 'qmgScores', 'roles', 'qmgErrors', 'qmgCAErrorsData']);
            }

            static get DATE_FIELD_MAP() {
                return {
                    clientAudit: ['Assigned Date'],
                    nhPending: ['Start date', 'Week ending'],
                    dataChanges: ['Data Changes Received Date'],
                    finalClearance: ['Date Received'],
                    paperworkClearance: ['Received Date'],
                    paperworkAllocation: ['Start Date'],
                    qmgTimelineData: ['Start date'],
                    termination: ['Date when HR was Notified', 'Term Tracker Updated']
                };
            }

            buildFilteredExcelData(dateFrom, dateTo) {
                if (!dateFrom && !dateTo) return this.excelData;
                const filtered = {};
                const unfilterable = TeamKPIEngine.UNFILTERABLE_SOURCES;
                const dateFieldMap = TeamKPIEngine.DATE_FIELD_MAP;

                Object.keys(this.excelData).forEach(key => {
                    const rows = this.excelData[key];
                    if (unfilterable.has(key)) {
                        // Can't verify these rows belong to the selected
                        // period (no reliable per-row date) - showing the
                        // full-history total under a specific period label
                        // would be misleading, so treat as "no data" for any
                        // active filter rather than guess.
                        filtered[key] = [];
                    } else if (key === 'production' || key === 'pkt' || key === 'attendance') {
                        // Wide format: one column per month (date-serial key).
                        // Keep the row but drop out-of-range month columns.
                        filtered[key] = rows.map(row => {
                            const newRow = {};
                            Object.entries(row).forEach(([k, v]) => {
                                if (k === 'Team Member') { newRow[k] = v; return; }
                                const num = Number(k);
                                if (!isNaN(num)) {
                                    const d = this.excelDateToJSDate(num);
                                    if (d && (!dateFrom || d >= dateFrom) && (!dateTo || d <= dateTo)) newRow[k] = v;
                                }
                            });
                            return newRow;
                        });
                    } else if (key === 'auditMaster') {
                        // Each result already carries its own real date (from
                        // the sheet's month-header row) - filter per-result,
                        // not per-row, since one row spans many weeks/months.
                        filtered[key] = rows
                            .map(row => {
                                const results = row.results.filter(r => {
                                    const d = this.excelDateToJSDate(r.date);
                                    if (!d) return false;
                                    if (dateFrom && d < dateFrom) return false;
                                    if (dateTo && d > dateTo) return false;
                                    return true;
                                });
                                return { ...row, results };
                            })
                            .filter(row => row.results.length > 0);
                    } else if (dateFieldMap[key]) {
                        filtered[key] = this.filterRowsByDate(rows, dateFieldMap[key], dateFrom, dateTo);
                    } else {
                        filtered[key] = rows;
                    }
                });
                return filtered;
            }

            // Recompute employees/scores against only the rows that fall in
            // [dateFrom, dateTo], without mutating this engine's live state.
            computeForDateRange(dateFrom, dateTo) {
                const savedExcelData = this.excelData;
                const savedEmployees = this.employees;
                const savedTeams = this.teams;
                try {
                    this.excelData = this.buildFilteredExcelData(dateFrom, dateTo);
                    this.initializeEmployees();
                    this.extractKPIs();
                    this.calculateTeamScores();
                    return JSON.parse(JSON.stringify(this.employees));
                } finally {
                    this.excelData = savedExcelData;
                    this.employees = savedEmployees;
                    this.teams = savedTeams;
                }
            }

            saveToStorage() {
                const data = {
                    timestamp: new Date().toISOString(),
                    employees: this.employees,
                    teams: this.teams,
                    summary: this.getSummary(),
                    excelData: this.excelData
                };
                localStorage.setItem('hrops_scorecard_data', JSON.stringify(data));
                return data;
            }
        }
