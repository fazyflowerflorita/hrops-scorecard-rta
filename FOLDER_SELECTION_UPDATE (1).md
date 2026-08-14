# ✅ Folder Selection Now Enabled

## What Changed

The updated `admin-with-folder.html` now supports **both**:

1. ✅ **Individual File Selection** - Select specific .xlsx files
2. ✅ **Folder Selection** - Select the entire folder with all files

---

## How to Use

### **Option 1: Select Individual Files**
```
1. Click "Choose Individual Files" button
2. Browse to your Excel files
3. Select one or more .xlsx files
4. Click "Open"
5. Selected files appear below
```

### **Option 2: Select Entire Folder** ⭐ NEW
```
1. Click "Choose Entire Folder" button (green box)
2. Browse to your folder containing Excel files
3. Click "Select Folder"
4. All .xlsx files from that folder are selected
5. All files appear below
```

---

## Browser Support

| Browser | Folder Selection |
|---------|------------------|
| Chrome | ✅ Yes |
| Firefox | ✅ Yes |
| Edge | ✅ Yes |
| Safari | ⚠️ Limited |

**Note**: Folder selection works best in Chrome, Firefox, and Edge.

---

## File Structure

Works with any folder structure:
```
Your Folder/
├── Production_Tracker.xlsx
├── Attendance.xlsx
├── Process_Knowledge_Test.xlsx
├── Internal_Audit_Scores.xlsx
├── New_NH_pending_Tracker.xlsx
├── Client_System_Audit_Tracker.xlsx
├── Final_Clearance_Tracker.xlsx
├── Paperwork_Clearance_Tracker.xlsx
├── QMG_Error_Tracker.xlsx
└── (any other files)
```

**System will:**
- ✅ Extract only .xlsx files
- ✅ Ignore subfolders
- ✅ Ignore other file types
- ✅ Process all Excel files found

---

## Steps to Deploy

### **Replace `admin.html`**

1. **Download**: `admin-with-folder.html` from `/outputs/`
2. **Rename**: to `admin.html`
3. **Upload**: to your GitHub repo `hrops-scorecard-rta`
4. **Commit & Push**: Changes

That's it! Now you have **both folder and file selection**.

---

## UI Changes

**Before:**
- One button "Choose Excel Files"

**After:**
- Two buttons side by side:
  - "Choose Individual Files" (left)
  - "Choose Entire Folder" (right, green)

---

## What Happens

### When You Select Individual Files:
```
1. File picker opens
2. Browse and select specific files
3. Only selected files processed
```

### When You Select a Folder:
```
1. Folder picker opens
2. Browse and select entire folder
3. All .xlsx files in folder selected
4. All .xlsx files processed automatically
```

---

## Same Processing

**Regardless of how you select files**, the processing is identical:

✅ All 5 teams processed  
✅ Team-specific columns extracted  
✅ Scores calculated  
✅ Firebase saved  
✅ Manager dashboard updates  

---

## Examples

### Example 1: OneDrive Folder
```
C:\Users\FazyFlowerFlorita\OneDrive - Pride Technologies\Documents\NNN\NHR\firebase-hosting-complete\

1. Click "Choose Entire Folder"
2. Navigate to above folder
3. Click "Select Folder"
4. All Excel files selected automatically
5. Click "Generate Scorecards"
6. Done! ✅
```

### Example 2: Desktop Folder
```
C:\Users\FazyFlowerFlorita\Desktop\HR-Files\

1. Click "Choose Entire Folder"
2. Navigate to Desktop → HR-Files
3. Click "Select Folder"
4. All Excel files selected
5. Click "Generate Scorecards"
6. Done! ✅
```

### Example 3: Specific Files Only
```
Need only 3 specific files:

1. Click "Choose Individual Files"
2. Select Production_Tracker.xlsx
3. Hold Ctrl + Click Attendance.xlsx
4. Hold Ctrl + Click Process_Knowledge_Test.xlsx
5. Click "Open"
6. Only those 3 files selected
7. Click "Generate Scorecards"
8. Done! ✅
```

---

## Key Features

✅ **Folder Selection** - Choose entire folder at once  
✅ **Individual Selection** - Pick specific files  
✅ **File Filtering** - Only .xlsx files processed  
✅ **Visual Feedback** - Shows all selected files  
✅ **Remove Option** - Remove individual files before processing  
✅ **Clear Button** - Clear all selections  

---

## The File You Need

📥 **Download**: `admin-with-folder.html`  
📝 **Rename to**: `admin.html`  
📤 **Upload to**: Your GitHub `hrops-scorecard-rta` repo  

That's all! You now have folder selection. 🎉

---

## Test It

1. Open new `admin.html`
2. See two buttons at top
3. Click green "Choose Entire Folder"
4. Select your Excel folder
5. Files appear below
6. Click "Generate Scorecards"
7. Manager dashboard updates

**Everything works!** ✅

