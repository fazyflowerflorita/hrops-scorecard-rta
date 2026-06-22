#!/usr/bin/env python3
"""
Custom Parser for Your Actual Excel Structure
Handles monthly time-series data format
"""

import openpyxl
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime

FIREBASE_CONFIG = {
    "projectId": "hrops-scorecard---rta",
    "databaseURL": "https://hrops-scorecard---rta.firebaseio.com"
}

class CustomExcelParser:
    """Parse your actual Excel structure"""
    
    @staticmethod
    def read_excel(file_path):
        """Read Excel file"""
        try:
            wb = openpyxl.load_workbook(file_path)
            ws = wb.active
            
            # Get all data
            data = []
            headers = []
            
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                if i == 0:
                    headers = row
                else:
                    data.append(row)
            
            wb.close()
            return data, headers
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")
            return [], []
    
    @staticmethod
    def parse_attendance(file_path):
        """Parse Attendance - 2026.xlsx (monthly format)"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = CustomExcelParser.read_excel(file_path)
        
        attendance_data = {}
        
        for row in data:
            if not row or not row[0]:
                continue
            
            emp_name = str(row[0]).strip()
            
            # Get latest attendance value (most recent month with data)
            latest_attendance = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        latest_attendance = float(row[i])
                    except:
                        pass
            
            # Generate simple employee ID from name
            emp_id = emp_name.upper().replace(" ", "_")[:15]
            
            attendance_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'attendance': latest_attendance,
                'module': 'Attendance'
            }
        
        print(f"   ✅ Parsed {len(attendance_data)} employees")
        return attendance_data
    
    @staticmethod
    def parse_process_knowledge(file_path):
        """Parse Process Knowledge Test - 2026.xlsx"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = CustomExcelParser.read_excel(file_path)
        
        knowledge_data = {}
        
        for row in data:
            if not row or not row[0]:
                continue
            
            emp_name = str(row[0]).strip()
            
            # Get latest test score
            latest_score = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        latest_score = float(row[i])
                    except:
                        pass
            
            emp_id = emp_name.upper().replace(" ", "_")[:15]
            
            knowledge_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'process_knowledge': latest_score,
                'module': 'Process Knowledge'
            }
        
        print(f"   ✅ Parsed {len(knowledge_data)} employees")
        return knowledge_data
    
    @staticmethod
    def parse_production(file_path):
        """Parse Production Tracker - 2026.xlsx"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = CustomExcelParser.read_excel(file_path)
        
        production_data = {}
        
        for row in data:
            if not row or not row[0]:
                continue
            
            emp_name = str(row[0]).strip()
            
            # Get sum of all production
            total_production = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        total_production += int(row[i])
                    except:
                        pass
            
            emp_id = emp_name.upper().replace(" ", "_")[:15]
            
            production_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'productivity': total_production,
                'module': 'Production'
            }
        
        print(f"   ✅ Parsed {len(production_data)} employees")
        return production_data
    
    @staticmethod
    def parse_nh_pending(file_path):
        """Parse New NH pending Tracker - 2026.xlsx"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = CustomExcelParser.read_excel(file_path)
        
        nh_data = {}
        processor_counts = {}
        
        for row in data:
            if len(row) < 7:
                continue
            
            # Column 6: Processor (Employee)
            processor = row[6]
            if not processor:
                continue
            
            processor = str(processor).strip()
            
            # Column 11: Status (Pending/Completed)
            status = str(row[10]).strip() if len(row) > 10 and row[10] else "Unknown"
            
            # Count pending items per processor
            if processor not in processor_counts:
                processor_counts[processor] = {'pending': 0, 'completed': 0, 'total': 0}
            
            processor_counts[processor]['total'] += 1
            if 'pending' in status.lower():
                processor_counts[processor]['pending'] += 1
            elif 'completed' in status.lower():
                processor_counts[processor]['completed'] += 1
        
        # Create NH data
        for processor, counts in processor_counts.items():
            emp_id = processor.upper().replace(" ", "_")[:15]
            nh_data[emp_id] = {
                'empId': emp_id,
                'name': processor,
                'nh_pending': counts['pending'],
                'nh_completed': counts['completed'],
                'nh_total': counts['total'],
                'module': 'NH Pending'
            }
        
        print(f"   ✅ Parsed {len(nh_data)} processors from {len(data)} records")
        return nh_data

def consolidate_data(attendance, knowledge, production, nh):
    """Merge all module data into unified employee records"""
    
    all_employees = {}
    
    # Collect all unique employee IDs
    all_ids = set(attendance.keys()) | set(knowledge.keys()) | set(production.keys()) | set(nh.keys())
    
    # Merge data
    for emp_id in all_ids:
        emp_data = {'empId': emp_id}
        
        if emp_id in attendance:
            emp_data.update(attendance[emp_id])
        if emp_id in knowledge:
            emp_data.update(knowledge[emp_id])
        if emp_id in production:
            emp_data.update(production[emp_id])
        if emp_id in nh:
            emp_data.update(nh[emp_id])
        
        # Set name from any available source
        if 'name' not in emp_data:
            emp_data['name'] = emp_id.replace("_", " ")
        
        all_employees[emp_id] = emp_data
    
    return all_employees

def main():
    print("\n╔════════════════════════════════════════════════════════════════╗")
    print("║   CUSTOM PARSER - Your Exact Excel Structure                ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")
    
    # Get folder path
    print("Enter your local folder path:")
    folder_path = input("📁 Path: ").strip().strip('"')
    
    folder = Path(folder_path)
    if not folder.exists():
        print(f"❌ Folder not found: {folder_path}")
        return
    
    # Find Excel files
    print(f"\n🔍 Searching for Excel files in: {folder_path}")
    
    attendance_file = None
    knowledge_file = None
    production_file = None
    nh_file = None
    
    # Find files by name pattern
    for file_path in folder.rglob('*.xlsx'):
        name_lower = file_path.name.lower()
        
        if 'attendance' in name_lower:
            attendance_file = file_path
        elif 'process knowledge' in name_lower or 'knowledge' in name_lower:
            knowledge_file = file_path
        elif 'production' in name_lower:
            production_file = file_path
        elif 'nh pending' in name_lower or 'pending' in name_lower:
            nh_file = file_path
    
    # Parse files
    attendance_data = {}
    knowledge_data = {}
    production_data = {}
    nh_data = {}
    
    if attendance_file:
        attendance_data = CustomExcelParser.parse_attendance(str(attendance_file))
    if knowledge_file:
        knowledge_data = CustomExcelParser.parse_process_knowledge(str(knowledge_file))
    if production_file:
        production_data = CustomExcelParser.parse_production(str(production_file))
    if nh_file:
        nh_data = CustomExcelParser.parse_nh_pending(str(nh_file))
    
    # Consolidate
    print(f"\n🔗 Consolidating data from all modules...")
    all_employees = consolidate_data(attendance_data, knowledge_data, production_data, nh_data)
    
    print(f"✅ Total employees with data: {len(all_employees)}")
    
    # Initialize Firebase
    print(f"\n☁️ Connecting to Firebase...")
    try:
        if firebase_admin._apps:
            firebase_admin.delete_app(firebase_admin.get_app())
        
        cred = credentials.Certificate("firebase-service-account.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': FIREBASE_CONFIG['databaseURL']
        })
        db_ref = db.reference()
        print("✅ Firebase connected!")
    except Exception as e:
        print(f"❌ Firebase error: {e}")
        return
    
    # Sync to Firebase
    print(f"\n📤 Syncing to Firebase...")
    try:
        db_ref.child('employee-module-data').set(all_employees)
        print(f"✅ Synced {len(all_employees)} employees to Firebase!")
        
        # Show summary
        print(f"\n📊 SUMMARY:")
        print(f"   ✅ Attendance records: {len(attendance_data)}")
        print(f"   ✅ Process Knowledge: {len(knowledge_data)}")
        print(f"   ✅ Production data: {len(production_data)}")
        print(f"   ✅ NH Pending: {len(nh_data)}")
        print(f"   ✅ Total unified: {len(all_employees)}")
        
        print(f"\n🎉 SUCCESS! Data synced to Firebase!")
        print(f"\nCheck dashboard: https://hrops-scorecard---rta.web.app/manager-v2.html")
        
    except Exception as e:
        print(f"❌ Error syncing to Firebase: {e}")

if __name__ == "__main__":
    main()
