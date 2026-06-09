// Enhanced Scorecard App - Main Module
window.ScorecardApp = (() => {
    // ============ CONFIGURATION ============
    const SCORECARD_TEAMS = [
        "Internal Audit",
        "HR Operations",
        "Compliance",
        "Paperwork Audit",
        "Final Clerance Team",
    ];

    const UPLOAD_SLOT_DEFINITIONS = {
        attendance: { label: "Attendance", team: "All Teams", moduleId: "attendance" },
        productivity: { label: "Productivity", team: "All Teams", moduleId: "productivity" },
        processKnowledge: { label: "Process Knowledge Test", team: "All Teams", moduleId: "processKnowledge" },
        nhPending: { label: "NH / BG Pending", team: "All Teams", moduleId: "nhPending" },
        clientSystemAudit: { label: "Client System Audit", team: "All Teams", moduleId: "clientSystemAudit" },
        internalAudit: { label: "Internal Audit", team: "All Teams", moduleId: "internalAudit" },
        qmgErrors: { label: "QMG Error Tracker", team: "All Teams", moduleId: "qmgErrors" },
        dataChanges: { label: "Data Changes / Paperwork", team: "All Teams", moduleId: "dataChanges" },
        termination: { label: "Termination", team: "All Teams", moduleId: "termination" },
        tenureDiscountAudit: { label: "Tenure Discount Audit", team: "All Teams", moduleId: "tenureDiscountAudit" },
        finalClearance: { label: "Final Clearance", team: "All Teams", moduleId: "finalClearance" },
        paperworkAllocation: { label: "Paperwork Allocation", team: "All Teams", moduleId: "paperworkAllocation" },
        paperworkClearance: { label: "Paperwork Clearance", team: "All Teams", moduleId: "paperworkClearance" },
    };

    // Prefilled employee data
    const PREFILLED_EMPLOYEES = [
        { employeeId: "P11561", employeeName: "Banu", teamName: "Internal Audit", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11562", employeeName: "Yogesh", teamName: "Internal Audit", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11563", employeeName: "Arjun MP", teamName: "HR Operations", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11564", employeeName: "Madhan Kumar", teamName: "HR Operations", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11565", employeeName: "Rihana", teamName: "HR Operations", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11566", employeeName: "Ingrid Pope", teamName: "HR Operations", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11567", employeeName: "Alan Benjamin", teamName: "Compliance", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11568", employeeName: "Pavithra Mahesh", teamName: "Compliance", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11569", employeeName: "Thirisha", teamName: "Paperwork Audit", reportingManager: "Manager", department: "HR Operations" },
        { employeeId: "P11570", employeeName: "Aswani", teamName: "Final Clerance Team", reportingManager: "Manager", department: "HR Operations" },
    ];

    // ============ LOCAL STORAGE MANAGEMENT ============
    function initializeLocalStorage() {
        if (!localStorage.getItem('srp-employees')) {
            localStorage.setItem('srp-employees', JSON.stringify(PREFILLED_EMPLOYEES));
        }
        if (!localStorage.getItem('srp-uploads')) {
            localStorage.setItem('srp-uploads', JSON.stringify({}));
        }
        if (!localStorage.getItem('srp-feedback')) {
            localStorage.setItem('srp-feedback', JSON.stringify([]));
        }
        if (!localStorage.getItem('srp-certificates')) {
            localStorage.setItem('srp-certificates', JSON.stringify([]));
        }
        if (!localStorage.getItem('srp-history')) {
            localStorage.setItem('srp-history', JSON.stringify([]));
        }
    }

    function getScorecardEmployees() {
        return JSON.parse(localStorage.getItem('srp-employees') || '[]');
    }

    function getScorecardUploads() {
        return JSON.parse(localStorage.getItem('srp-uploads') || '{}');
    }

    function getFeedback(empId = null) {
        const feedback = JSON.parse(localStorage.getItem('srp-feedback') || '[]');
        if (!empId) return feedback;
        return feedback.filter(f => f.employeeId === empId);
    }

    function getCertificates(empId = null) {
        const certificates = JSON.parse(localStorage.getItem('srp-certificates') || '[]');
        if (!empId) return certificates;
        return certificates.filter(c => c.employeeId === empId);
    }

    function getHistory() {
        return JSON.parse(localStorage.getItem('srp-history') || '[]');
    }

    function saveEmployeeList(employees, fileName) {
        localStorage.setItem('srp-employees', JSON.stringify(employees));
        appendHistory({
            action: 'employee_upload',
            entityType: 'employee_master',
            message: `Employee master uploaded: ${fileName}`,
            details: { fileName, employeesImported: employees.length },
        });
    }

    function saveUploadSlotRows(slotId, parsed) {
        const uploads = getScorecardUploads();
        uploads[slotId] = {
            moduleId: slotId,
            fileName: parsed.fileName || slotId,
            uploadedAt: new Date().toISOString(),
            rows: parsed.rows || [],
            meta: parsed.meta || {},
        };
        localStorage.setItem('srp-uploads', JSON.stringify(uploads));
        appendHistory({
            action: 'module_upload',
            entityType: slotId,
            message: `${UPLOAD_SLOT_DEFINITIONS[slotId]?.label || slotId} uploaded`,
            details: { fileName: parsed.fileName, rowsImported: parsed.rows?.length || 0 },
        });
    }

    function updateEmployee(employeeId, payload) {
        const employees = getScorecardEmployees();
        const index = employees.findIndex(e => e.employeeId === employeeId);
        if (index === -1) throw new Error('Employee not found');

        const before = { ...employees[index] };
        employees[index] = { ...employees[index], ...payload };
        localStorage.setItem('srp-employees', JSON.stringify(employees));
        appendHistory({
            action: 'employee_update',
            entityType: 'employee',
            entityId: employeeId,
            message: `Employee updated: ${before.employeeName}`,
            details: { before, after: employees[index] },
        });
    }

    function deleteEmployee(employeeId) {
        const employees = getScorecardEmployees();
        const index = employees.findIndex(e => e.employeeId === employeeId);
        if (index === -1) throw new Error('Employee not found');

        const [removed] = employees.splice(index, 1);
        localStorage.setItem('srp-employees', JSON.stringify(employees));
        appendHistory({
            action: 'employee_delete',
            entityType: 'employee',
            entityId: employeeId,
            message: `Employee removed: ${removed.employeeName}`,
            details: removed,
        });
    }

    function addFeedback(payload) {
        const feedback = getFeedback();
        const entry = {
            id: `fb-${Date.now()}`,
            ...payload,
            date: new Date().toISOString(),
        };
        feedback.unshift(entry);
        localStorage.setItem('srp-feedback', JSON.stringify(feedback));
        appendHistory({
            action: 'feedback_create',
            entityType: 'feedback',
            entityId: payload.employeeId,
            message: `Feedback saved for ${payload.employeeId}`,
            details: entry,
        });
    }

    function addCertificate(payload) {
        const certificates = getCertificates();
        const entry = {
            id: `cert-${Date.now()}`,
            ...payload,
            date: new Date().toISOString(),
        };
        certificates.unshift(entry);
        localStorage.setItem('srp-certificates', JSON.stringify(certificates));
        appendHistory({
            action: 'certificate_create',
            entityType: 'certificate',
            entityId: payload.employeeId,
            message: `Certificate created for ${payload.employeeId}`,
            details: entry,
        });
    }

    function appendHistory(entry) {
        const history = getHistory();
        history.unshift({
            id: `hist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...entry,
        });
        localStorage.setItem('srp-history', JSON.stringify(history.slice(0, 100)));
    }

    function resetState() {
        localStorage.setItem('srp-employees', JSON.stringify(PREFILLED_EMPLOYEES));
        localStorage.setItem('srp-uploads', JSON.stringify({}));
        localStorage.setItem('srp-feedback', JSON.stringify([]));
        localStorage.setItem('srp-certificates', JSON.stringify([]));
        localStorage.setItem('srp-history', JSON.stringify([]));
    }

    // ============ RENDERING FUNCTIONS ============
    function createKpiCards(container, kpis) {
        const scoreThemes = {
            excellent: (value) => value >= 90,
            good: (value) => value >= 75,
            warning: (value) => value >= 50,
            danger: (value) => value < 50,
        };

        container.innerHTML = kpis.map(kpi => {
            let theme = 'danger';
            const numValue = parseFloat(kpi.value);
            if (scoreThemes.excellent(numValue)) theme = 'excellent';
            else if (scoreThemes.good(numValue)) theme = 'good';
            else if (scoreThemes.warning(numValue)) theme = 'warning';

            return `
                <div class="kpi-card theme-${theme}">
                    <p class="kpi-label">${kpi.label}</p>
                    <div class="kpi-value">${kpi.value}${kpi.suffix || ''}</div>
                    <p class="kpi-description">${kpi.description || ''}</p>
                </div>
            `;
        }).join('');
    }

    function renderTable(container, columns, rows) {
        const headerHtml = columns.map(col => `<th>${col.label}</th>`).join('');
        const bodyHtml = rows.map(row => {
            const cells = columns.map(col => {
                const value = row[col.key] || '-';
                if (col.key.includes('Score') && !isNaN(value)) {
                    let badge = '';
                    const numValue = parseFloat(value);
                    if (numValue >= 90) badge = 'excellent';
                    else if (numValue >= 75) badge = 'good';
                    else if (numValue >= 50) badge = 'warning';
                    else badge = 'danger';
                    return `<td><span class="score-badge ${badge}">${value}</span></td>`;
                }
                return `<td>${value}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        container.innerHTML = `
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
        `;
    }

    function renderFeed(container, items, type = 'feedback') {
        if (!items.length) {
            container.innerHTML = '<div class="feed-item" style="text-align: center; color: var(--text-muted);">No items yet</div>';
            return;
        }

        container.innerHTML = items.map(item => {
            if (type === 'certificate') {
                return `
                    <div class="feed-item">
                        <strong>${item.title || 'Certificate'}</strong>
                        <p>${item.message || ''}</p>
                        <small style="color: var(--text-muted);">${new Date(item.date).toLocaleDateString()}</small>
                        <br>
                        <button data-download-certificate='${JSON.stringify(item).replace(/'/g, "&apos;")}' class="primary-btn" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.85rem;">Download PDF</button>
                    </div>
                `;
            }
            return `
                <div class="feed-item">
                    <strong>${item.appreciation || item.message || 'Item'}</strong>
                    ${item.improvement ? `<p>${item.improvement}</p>` : ''}
                    <small style="color: var(--text-muted);">${new Date(item.date || item.timestamp).toLocaleDateString()}</small>
                </div>
            `;
        }).join('');
    }

    function renderModuleCards(container, cards) {
        container.innerHTML = cards.map(card => `
            <div class="module-card" style="--card-bg-start: #0d7c6f; --card-bg-end: #14a596;">
                <h3>${card.label}</h3>
                <p>${card.completed || 0} / ${card.totalItems || 0} completed</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(card.completed / (card.totalItems || 1)) * 100}%"></div>
                </div>
                <div class="score">${card.score || 0}%</div>
            </div>
        `).join('');
    }

    function createOrUpdateChart(canvasElement, config, existingChart) {
        if (!window.Chart) return null;
        if (existingChart) existingChart.destroy();
        return new Chart(canvasElement, config);
    }

    async function downloadCertificate(certData) {
        if (!window.html2pdf) {
            alert('PDF library not available');
            return;
        }
        const html = `
            <div class="certificate-sheet">
                <h1>Certificate of Achievement</h1>
                <h2>${certData.title}</h2>
                <p>This certificate is proudly presented to</p>
                <h2 style="margin: 1rem 0; color: #d6b46c;">${certData.employeeName || certData.employeeId}</h2>
                <p>${certData.message}</p>
                <p style="margin-top: 3rem;">Date: ${new Date(certData.date).toLocaleDateString()}</p>
            </div>
        `;
        await window.html2pdf().set({
            margin: 10,
            filename: `certificate-${certData.employeeId}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        }).from(html).save();
    }

    function createUploadCenterMarkup() {
        return Object.entries(UPLOAD_SLOT_DEFINITIONS).map(([slotId, def]) => `
            <div class="team-upload-panel">
                <form class="team-upload-form" data-slot-id="${slotId}">
                    <div class="panel-head">
                        <h3 style="margin: 0; font-size: 1.1rem;">${def.label}</h3>
                    </div>
                    <label style="display: flex; gap: 0.5rem; align-items: center; cursor: pointer;">
                        <input type="file" name="file" accept=".xlsx,.xls" required />
                        <span>Choose File</span>
                    </label>
                    <button class="primary-btn" type="submit">Upload ${def.label}</button>
                </form>
            </div>
        `).join('');
    }

    async function parseEmployeeWorkbook(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(worksheet);
                    const employees = rows.map(row => ({
                        employeeId: String(row['E. ID'] || row['Employee ID'] || '').trim(),
                        employeeName: normalizeName(row['Names'] || row['Employee Name'] || ''),
                        teamName: normalizeTeam(row['Team Name'] || row['Process'] || ''),
                        reportingManager: String(row['Reporting Manager'] || '').trim(),
                        department: String(row['Department'] || '').trim(),
                    })).filter(e => e.employeeId && e.employeeName);
                    resolve(employees);
                } catch (err) {
                    reject(new Error(`Failed to parse Excel: ${err.message}`));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    async function parseUploadSlotWorkbook(slotId, file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const rows = [];
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const sheetRows = XLSX.utils.sheet_to_json(worksheet);
                        rows.push(...sheetRows.map(row => ({ ...row, sheetName })));
                    });
                    resolve({ rows, fileName: file.name, meta: { sheets: workbook.SheetNames.length } });
                } catch {
                    resolve({ rows: [], fileName: file.name, meta: { error: true } });
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    function buildManagerSnapshot(filters) {
        const employees = getScorecardEmployees();
        const uploads = getScorecardUploads();

        const filtered = employees.filter(emp => {
            if (filters.team && emp.teamName !== filters.team) return false;
            if (filters.employeeId && emp.employeeId !== filters.employeeId) return false;
            return true;
        });

        return {
            filters,
            kpis: {
                overallScore: 82,
                targetAchievement: 65,
                employeesMeetingTarget: filtered.length * 0.65 | 0,
                employeesBelowTarget: filtered.length * 0.35 | 0,
                totalEmployees: filtered.length,
            },
            tables: {
                employeeRows: filtered.map(emp => ({
                    employeeId: emp.employeeId,
                    employeeName: emp.employeeName,
                    teamName: emp.teamName,
                    overallScore: (Math.random() * 40 + 70) | 0,
                    targetAchievement: (Math.random() * 100) | 0,
                })),
                qualityGrid: [],
                pendingGrid: [],
                processKnowledgeGrid: [],
            },
            charts: {
                trend: Array.from({ length: 12 }, (_, i) => ({
                    date: `Day ${i + 1}`,
                    score: (Math.random() * 40 + 60) | 0,
                })),
                categoryBreakdown: {
                    Quality: 85,
                    Productivity: 78,
                    Audit: 72,
                    Attendance: 88,
                },
            },
            employees: filtered.map(emp => ({
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                teamName: emp.teamName,
                overallScore: (Math.random() * 40 + 70) | 0,
                targetAchievement: (Math.random() * 100) | 0,
                quality: { summary: { score: 80 } },
                cards: {},
                pendingSummary: { openCount: 0 },
            })),
        };
    }

    function buildAssociateSnapshot(empId, filters) {
        const employees = getScorecardEmployees();
        const employee = employees.find(e => e.employeeId === empId);
        if (!employee) return null;

        return {
            employee: {
                employeeId: employee.employeeId,
                employeeName: employee.employeeName,
                teamName: employee.teamName,
                reportingManager: employee.reportingManager,
                tasks: ['Task 1', 'Task 2'],
                visibleModules: ['quality', 'attendance'],
                overallScore: (Math.random() * 40 + 70) | 0,
                targetAchievement: (Math.random() * 100) | 0,
                quality: { summary: { score: 85 } },
                cards: {},
                pendingSummary: { openCount: 0 },
            },
            charts: {
                trend: Array.from({ length: 12 }, (_, i) => ({ date: `Day ${i + 1}`, score: (Math.random() * 40 + 60) | 0 })),
                categoryBreakdown: { Quality: 85, Productivity: 78 },
            },
        };
    }

    function getManagerOptions() {
        const employees = getScorecardEmployees();
        const teams = [...new Set(employees.map(e => e.teamName))].sort();
        return { teams, employees };
    }

    function exportManagerCsv(snapshot) {
        const lines = [['Employee ID', 'Name', 'Team', 'Overall Score'].join(',')];
        snapshot.employees.forEach(emp => {
            lines.push([emp.employeeId, emp.employeeName, emp.teamName, emp.overallScore].join(','));
        });
        const csv = lines.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scorecard-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function normalizeName(value) {
        return String(value || '').trim().replace(/\s+/g, ' ');
    }

    function normalizeTeam(value) {
        return String(value || '').trim();
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLocalStorage);
    } else {
        initializeLocalStorage();
    }

    // ============ PUBLIC API ============
    return {
        SCORECARD_TEAMS,
        UPLOAD_SLOT_DEFINITIONS,
        createKpiCards,
        renderTable,
        renderFeed,
        renderModuleCards,
        createOrUpdateChart,
        downloadCertificate,
        createUploadCenterMarkup,
        parseEmployeeWorkbook,
        parseUploadSlotWorkbook,
        buildManagerSnapshot,
        buildAssociateSnapshot,
        getManagerOptions,
        exportManagerCsv,
        getScorecardEmployees,
        getFeedback,
        getCertificates,
        getHistory,
        saveEmployeeList,
        saveUploadSlotRows,
        updateEmployee,
        deleteEmployee,
        addFeedback,
        addCertificate,
        resetState,
    };
})();
