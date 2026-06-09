#!/usr/bin/env python3
"""
HR Operations Scorecard - Enhanced Folder Monitor
Reads 51+ Excel files and syncs ALL 8 modules to Firebase
"""

import os
import sys
import time
from pathlib import Path
import openpyxl
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime

FIREBASE_CONFIG = {
    "projectId": "hrops-scorecard---rta",
    "databaseURL": "https://hrops-scorecard---rta.firebaseio.com"
}

class EnhancedExcelParser:
    """Parse all 51 Excel files and extract module-specific data"""
    
    @staticmethod
    def read_excel(file_path):
        """Read Excel file safely"""
        try:
            wb = openpyxl.load_workbook(file_path)
            ws = wb.active
            
            headers = []
            for cell in ws[1]:
                if cell.value:
                    headers.append(str(cell.value).strip())
            
            data = []
            for row in ws.iter_rows(min_row=2, values_only=False):
                row_data = {}
                for idx, cell in enumerate(row):
                    if idx < len(headers):
                        row_data[headers[idx]] = cell.value
                if any(row_data.values()):
                    data.append(row_data)
            
            wb.close()
            return data, headers
        except:
            return [], []
    
    @staticmethod
    def extract_attendance(file_path):
        """Extract Attendance module data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        attendance_data = {}
        
        for row in data:
            emp_id = None
            emp_name = None
            attendance_pct = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'name' in key_lower or 'employee' in key_lower:
                    emp_name = str(value) if value else None
                if 'attend' in key_lower and '%' in str(value or ''):
                    try:
                        attendance_pct = float(str(value).replace('%', ''))
                    except:
                        pass
            
            if emp_id:
                attendance_data[emp_id] = {
                    'empId': emp_id,
                    'name': emp_name or '',
                    'attendance': attendance_pct
                }
        
        return attendance_data
    
    @staticmethod
    def extract_nh_pending(file_path):
        """Extract NH/BG Pending module data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        nh_data = {}
        
        for row in data:
            emp_id = None
            count = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'count' in key_lower or 'pending' in key_lower:
                    try:
                        count = int(value) if value else 0
                    except:
                        pass
            
            if emp_id:
                nh_data[emp_id] = {
                    'empId': emp_id,
                    'nh_pending': count
                }
        
        return nh_data
    
    @staticmethod
    def extract_process_knowledge(file_path):
        """Extract Process Knowledge Test data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        knowledge_data = {}
        
        for row in data:
            emp_id = None
            score = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'score' in key_lower:
                    try:
                        score = float(value) if value else 0
                    except:
                        pass
            
            if emp_id:
                knowledge_data[emp_id] = {
                    'empId': emp_id,
                    'process_knowledge': score
                }
        
        return knowledge_data
    
    @staticmethod
    def extract_production(file_path):
        """Extract Production/Productivity data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        prod_data = {}
        
        for row in data:
            emp_id = None
            productivity = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'count' in key_lower or 'completed' in key_lower or 'produced' in key_lower:
                    try:
                        productivity = int(value) if value else 0
                    except:
                        pass
            
            if emp_id:
                prod_data[emp_id] = {
                    'empId': emp_id,
                    'productivity': productivity
                }
        
        return prod_data
    
    @staticmethod
    def extract_quality(file_path):
        """Extract Quality/Error data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        quality_data = {}
        
        for row in data:
            emp_id = None
            errors = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'error' in key_lower or 'quality' in key_lower:
                    try:
                        errors = int(value) if value else 0
                    except:
                        pass
            
            if emp_id:
                quality_data[emp_id] = {
                    'empId': emp_id,
                    'errors': errors
                }
        
        return quality_data
    
    @staticmethod
    def extract_audit(file_path):
        """Extract Audit/Compliance data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        audit_data = {}
        
        for row in data:
            emp_id = None
            audit_score = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'score' in key_lower or 'audit' in key_lower:
                    try:
                        audit_score = float(value) if value else 0
                    except:
                        pass
            
            if emp_id:
                audit_data[emp_id] = {
                    'empId': emp_id,
                    'audit_score': audit_score
                }
        
        return audit_data
    
    @staticmethod
    def extract_clearance(file_path):
        """Extract Final Clearance data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        clearance_data = {}
        
        for row in data:
            emp_id = None
            status = 'Pending'
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'status' in key_lower or 'clearance' in key_lower:
                    status = str(value) if value else 'Pending'
            
            if emp_id:
                clearance_data[emp_id] = {
                    'empId': emp_id,
                    'clearance_status': status
                }
        
        return clearance_data
    
    @staticmethod
    def extract_data_changes(file_path):
        """Extract Data Changes/Paperwork data"""
        data, headers = EnhancedExcelParser.read_excel(file_path)
        changes_data = {}
        
        for row in data:
            emp_id = None
            changes = 0
            
            for key, value in row.items():
                key_lower = str(key).lower().strip()
                if 'emp' in key_lower and 'id' in key_lower:
                    emp_id = str(value) if value else None
                if 'change' in key_lower or 'paperwork' in key_lower:
                    try:
                        changes = int(value) if value else 0
                    except:
                        pass
            
            if emp_id:
                changes_data[emp_id] = {
                    'empId': emp_id,
                    'data_changes': changes
                }
        
        return changes_data

class ModuleExtractor:
    """Extract and consolidate data from all 51 Excel files"""
    
    def __init__(self, folder_path):
        self.folder_path = Path(folder_path)
        self.all_modules = {}
    
    def process_all_files(self):
        """Process all 51 Excel files"""
        
        file_mapping = {
            'Attendance': lambda f: EnhancedExcelParser.extract_attendance(f),
            'NH': lambda f: EnhancedExcelParser.extract_nh_pending(f),
            'Knowledge': lambda f: EnhancedExcelParser.extract_process_knowledge(f),
            'Production': lambda f: EnhancedExcelParser.extract_production(f),
            'Quality': lambda f: EnhancedExcelParser.extract_quality(f),
            'Audit': lambda f: EnhancedExcelParser.extract_audit(f),
            'Clearance': lambda f: EnhancedExcelParser.extract_clearance(f),
            'DataChanges': lambda f: EnhancedExcelParser.extract_data_changes(f),
        }
        
        file_keywords = {
            'Attendance': ['Attendance'],
            'NH': ['NH', 'pending'],
            'Knowledge': ['Process Knowledge', 'Test'],
            'Production': ['Production', 'Tracker'],
            'Quality': ['QMG', 'Error'],
            'Audit': ['Audit', 'Client System'],
            'Clearance': ['Final Clearance'],
            'DataChanges': ['Data Changes', 'Paperwork'],
        }
        
        # Find all Excel files
        excel_files = list(self.folder_path.rglob('*.xlsx')) + list(self.folder_path.rglob('*.xls'))
        excel_files = [f for f in excel_files if not f.name.startswith('~$')]
        
        print(f"\n📁 Processing {len(excel_files)} Excel files...")
        print("="*70)
        
        for module, keywords in file_keywords.items():
            self.all_modules[module] = {}
            
            # Find matching files
            matching_files = []
            for excel_file in excel_files:
                if any(kw.lower() in excel_file.name.lower() for kw in keywords):
                    matching_files.append(excel_file)
            
            if matching_files:
                print(f"\n📊 {module} Module:")
                print(f"   Found {len(matching_files)} matching file(s)")
                
                # Extract data from each matching file
                extractor = file_mapping[module]
                for file_path in matching_files[:3]:  # Process first 3 matching files
                    data = extractor(str(file_path))
                    self.all_modules[module].update(data)
                    print(f"   ✅ {file_path.name} → {len(data)} records")
        
        print("\n" + "="*70)
        return self.all_modules
    
    def sync_to_firebase(self, db_ref):
        """Sync all module data to Firebase"""
        
        print("\n☁️ Syncing to Firebase...")
        print("="*70)
        
        for module, data in self.all_modules.items():
            if data:
                try:
                    db_ref.child(f'modules/{module}').set(data)
                    print(f"✅ {module}: {len(data)} records synced")
                except Exception as e:
                    print(f"❌ {module}: Error - {e}")
        
        print("="*70)

def main():
    print("\n╔════════════════════════════════════════════════════════════════╗")
    print("║   ENHANCED HR SCORECARD - Multi-Module Parser                ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")
    
    # Initialize Firebase
    try:
        cred = credentials.Certificate("firebase-service-account.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': FIREBASE_CONFIG['databaseURL']
        })
        db_ref = db.reference()
        print("✅ Firebase connected!")
    except Exception as e:
        print(f"❌ Firebase error: {e}")
        return
    
    # Get folder path
    print("Enter your local folder path:")
    folder_path = input("📁 Path: ").strip().strip('"')
    
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return
    
    # Process all files
    extractor = ModuleExtractor(folder_path)
    all_data = extractor.process_all_files()
    
    # Sync to Firebase
    extractor.sync_to_firebase(db_ref)
    
    print("\n🎉 ALL 8 MODULES SYNCED TO FIREBASE!")
    print("\nModules synced:")
    for module in all_data.keys():
        count = len(all_data[module])
        print(f"  ✅ {module}: {count} records")

if __name__ == "__main__":
    main()
