# HR Ops Scorecard System - Enhanced Landing Page

## Overview

The enhanced HR Ops Scorecard System now features a professional, colorful landing page with three main entry points and team-based navigation. This guide explains how to set up and use the new system.

## New Files

### 1. **landing.html**
The main entry point featuring:
- Beautiful hero section with gradient background
- Three interactive cards for Upload Center, Manager View, and Associate View
- Modal dialogs with team selection
- Task listing for each team
- Direct navigation to respective pages with team context

### 2. **enhanced-app.css**
Professional stylesheet including:
- Modern color scheme (teal, coral, purple, cyan accents)
- Responsive grid layouts
- Colorful KPI cards with status indicators
- Beautiful module cards with gradients
- Smooth animations and transitions
- Print-friendly styles

### 3. **enhanced-app.js**
Core application module providing:
- Local storage management for browser-only mode
- Prefilled employee data (10 sample employees)
- KPI rendering with color-coded themes
- Table rendering with score badges
- Module card generation
- Certificate PDF generation
- Excel file parsing
- Manager and Associate snapshot builders

## Getting Started

### Option A: Direct Browser Mode (No Backend Required)

1. **Place files in your public folder:**
   ```
   public/
   ├── landing.html
   ├── manager.html
   ├── associate.html
   ├── upload.html
   ├── assets/
   │   ├── enhanced-app.css
   │   └── enhanced-app.js
   ```

2. **Open in browser:**
   ```
   Open: file:///path/to/landing.html
   ```

3. **Navigate:**
   - Click "Upload Center" → Select a team → View upload tasks
   - Click "Manager Dashboard" → Select a team → View scorecard
   - Click "My Scorecard" → Enter Employee ID (e.g., P11561) → View personal scorecard

### Option B: With Express Backend

1. **Update your server.js to include:**
   ```javascript
   app.use(express.static(path.join(__dirname, "public")));
   ```

2. **Access via:**
   ```
   http://localhost:3000/landing.html
   ```

## Features

### 🎨 Three Entry Points

#### 📤 Upload Center
- Select team to upload performance data
- View team members and tasks
- Upload Excel files with scorecard modules
- Track upload history
- Manage associate records

**Sample Modules:**
- Attendance
- Productivity
- Process Knowledge Test
- NH/BG Pending Cases
- Client System Audit
- Internal Audit
- QMG Error Tracker
- Data Changes
- Termination
- And more...

#### 👔 Manager Dashboard
- Select team to view performance analytics
- KPI summary with color-coded cards
- Employee performance table
- Quality, Pending, and Process Knowledge grids
- Performance trend charts
- Category breakdown analytics
- Add feedback and appreciation notes
- Create recognition certificates
- Edit and manage associate records
- Track version history

#### 👤 Associate View
- Enter Employee ID to access personal scorecard
- View overall score and target achievement
- Quality trend analysis
- Category breakdown
- Visible module cards
- Manager feedback
- Certificates
- Download scorecard as PDF

### 🎯 Team Navigation

The system includes 5 teams with predefined members and tasks:

1. **Internal Audit** 🔍
   - Members: Banu, Yogesh
   - Focus: Audits, Quality, Data Quality

2. **HR Operations** 🏢
   - Members: Arjun MP, Madhan Kumar, Rihana, Ingrid Pope
   - Focus: Operations, Compliance, Extensions

3. **Compliance** ⚖️
   - Members: Alan Benjamin, Pavithra Mahesh, Sneha Thomas, Rathina Sudhan, Azhar Taj, Sayee B
   - Focus: BG Processing, Compliance, Paperwork

4. **Paperwork Audit** 📋
   - Members: Thirisha, Vinish, Leonie
   - Focus: Document Audit, Clearance

5. **Final Clearance Team** ✅
   - Members: Aswani, Archana, Anubha
   - Focus: Final approvals, Adverse action

### 🎨 Design System

#### Colors
- **Primary Teal**: #0d7c6f (brand color)
- **Status Excellent**: #10b981 (green)
- **Status Good**: #3b82f6 (blue)
- **Status Warning**: #f59e0b (amber)
- **Status Danger**: #ef4444 (red)
- **Accent Coral**: #ff6b5b
- **Accent Gold**: #ffc857
- **Accent Purple**: #6c5ce7
- **Accent Cyan**: #00d9ff

#### KPI Cards
Cards automatically change color based on score:
- **90+**: Excellent (Green)
- **75-89**: Good (Blue)
- **50-74**: Warning (Amber)
- **<50**: Danger (Red)

#### Module Cards
- Gradient backgrounds
- Progress bars
- Score displays
- Hover effects with elevation

### 📊 KPI Rendering

KPI cards automatically theme based on value:

```javascript
createKpiCards(container, [
  { 
    label: "Overall Score %", 
    value: 85, 
    description: "Average across all employees" 
  },
  { 
    label: "Target Achievement %", 
    value: 72, 
    description: "Share meeting target" 
  },
]);
```

### 📋 Prefilled Employees

Sample data for testing:

| ID | Name | Team | Manager |
|----|------|------|---------|
| P11561 | Banu | Internal Audit | Manager |
| P11562 | Yogesh | Internal Audit | Manager |
| P11563 | Arjun MP | HR Operations | Manager |
| P11564 | Madhan Kumar | HR Operations | Manager |
| P11565 | Rihana | HR Operations | Manager |
| P11566 | Ingrid Pope | HR Operations | Manager |
| P11567 | Alan Benjamin | Compliance | Manager |
| P11568 | Pavithra Mahesh | Compliance | Manager |
| P11569 | Thirisha | Paperwork Audit | Manager |
| P11570 | Aswani | Final Clerance Team | Manager |

**Try:** Open Associate View, enter "P11561" to see the demo scorecard.

## Integration Steps

### Step 1: Copy Enhanced Assets
Replace your CSS and JS files with:
- `enhanced-app.css` → `public/assets/app.css`
- `enhanced-app.js` → `public/assets/app.js`
- `landing.html` → `public/index.html`

### Step 2: Update HTML Links
Your existing HTML files (manager.html, associate.html, upload.html) already reference:
```html
<link rel="stylesheet" href="./assets/app.css" />
<script src="./assets/app.js"></script>
```

No changes needed!

### Step 3: Add Data
The system uses browser localStorage by default. Data persists locally until:
- Browser cache is cleared
- Explicit "Reset Data" button is clicked
- User accesses from a private/incognito window

### Step 4: Optional - Connect Backend
If using Express backend, the API endpoints remain the same:
- `POST /api/upload/employees`
- `POST /api/upload/module`
- `GET /api/dashboard/manager`
- `GET /api/dashboard/associate/:empId`
- `POST /api/feedback`
- `POST /api/certificates`

## Responsive Design

### Desktop (1024px+)
- Multi-column grids
- Full dashboard display
- Side-by-side panels

### Tablet (768px - 1024px)
- Stacked columns
- Adjusted card sizes
- Touch-friendly buttons

### Mobile (< 768px)
- Single column layouts
- Full-width inputs
- Optimized fonts
- Hamburger navigation (if applicable)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features Roadmap

### Implemented ✅
- Landing page with three entry points
- Team-based navigation
- Colorful, professional scorecard design
- Local storage data persistence
- Prefilled employee data
- KPI cards with color themes
- Manager and associate views
- Feedback and certificates
- PDF download capability

### Coming Soon 🚀
- Real-time Excel upload parsing
- Advanced analytics charts
- Performance badges
- Automated alerts
- Team-based filtering
- Custom thresholds per team

## Troubleshooting

### Data Not Persisting
**Issue**: Data disappears after refresh
**Solution**: Clear browser cache, reload page. Data is stored in localStorage.

### Charts Not Displaying
**Issue**: "Chart.js is not defined"
**Solution**: Ensure CDN links are loaded. Check `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`

### Excel Upload Failed
**Issue**: "XLSX is not defined"
**Solution**: Add `<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>`

### Modal Not Opening
**Issue**: Click button but nothing happens
**Solution**: Check browser console for JS errors. Ensure `landing.html` is served over HTTP/HTTPS.

## File Structure

```
project/
├── landing.html                 # New entry point
├── manager.html                 # Existing, works as-is
├── associate.html               # Existing, works as-is
├── upload.html                  # Existing, works as-is
├── assets/
│   ├── enhanced-app.css         # Enhanced styling
│   ├── enhanced-app.js          # Enhanced JS module
│   └── [other assets...]
└── server.js                    # Optional Express backend
```

## Support

For issues or questions:
1. Check browser console (F12 → Console tab)
2. Verify all CDN links are accessible
3. Clear localStorage if data issues occur
4. Test in incognito window to rule out cache issues

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**License**: Proprietary
