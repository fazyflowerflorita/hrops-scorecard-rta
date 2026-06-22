#!/usr/bin/env python3
"""
Custom Parser for Your Actual Excel Structure - FIXED WITH TEAM MAPPING
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

# Team mapping based on your Excel data
EMPLOYEE_TEAMS = {
    'Anubha Priyam': 'Final Clearance Team',
    'Madhan Kumar G': 'Compliance',
    'Leonie Gomes': 'Paperwork Audit',
    'Robicca': 'Paperwork Audit',
    'Banupriya': 'Internal Audit Team',
    'Pavithra': 'HR Operations',
    'Pavithra Mahesh': 'HR Operations',
}

class CustomExcelParser:
    """Parse your actual Excel structure"""
    
    @staticmethod
    def read_excel(file_path):
        """Read Excel file"""
        try:
            wb = openpyxl.load_workbook(file_path)
            ws = wb.active
            
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
    def get_team(emp_name):
        """Get team for employee"""
        if not emp_name:
            return 'Unassigned'
        
        emp_name_clean = str(emp_name).strip().lower()
        
        for known_name, team in EMPLOYEE_TEAMS.items():
            if known_name.lower() in emp_name_clean or emp_name_clean.find(known_name.lower()) >= 0:
                return team
        
        return 'Unassigned'
    
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
            team = CustomExcelParser.get_team(emp_name)
            
            # Get latest attendance value
            latest_attendance = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        latest_attendance = float(row[i])
                    except:
                        pass
            
            emp_id = emp_name.upper().replace(" ", "_")[:15]
            
            attendance_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'team': team,
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
            team = CustomExcelParser.get_team(emp_name)
            
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
                'team': team,
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
            team = CustomExcelParser.get_team(emp_name)
            
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
                'team': team,
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
            
            processor = row[6]
            if not processor:
                continue
            
            processor = str(processor).strip()
            
            status = str(row[10]).strip() if len(row) > 10 and row[10] else "Unknown"
            
            if processor not in processor_counts:
                processor_counts[processor] = {'pending': 0, 'completed': 0, 'total': 0}
            
            processor_counts[processor]['total'] += 1
            if 'pending' in status.lower():
                processor_counts[processor]['pending'] += 1
            elif 'completed' in status.lower():
                processor_counts[processor]['completed'] += 1
        
        # Create NH data
        for processor, counts in processor_counts.items():
            team = CustomExcelParser.get_team(processor)
            emp_id = processor.upper().replace(" ", "_")[:15]
            nh_data[emp_id] = {
                'empId': emp_id,
                'name': processor,
                'team': team,
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
    all_ids = set(attendance.keys()) | set(knowledge.keys()) | set(production.keys()) | set(nh.keys())
    
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
        
        if 'name' not in emp_data:
            emp_data['name'] = emp_id.replace("_", " ")
        
        if 'team' not in emp_data:
            emp_data['team'] = 'Unassigned'
        
        all_employees[emp_id] = emp_data
    
    return all_employees

def main():
    print("\n╔════════════════════════════════════════════════════════════════╗")
    print("║   CUSTOM PARSER - WITH TEAM MAPPING                          ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")
    
    folder_path = input("📁 Enter folder path: ").strip().strip('"')
    
    folder = Path(folder_path)
    if not folder.exists():
        print(f"❌ Folder not found: {folder_path}")
        return
    
    print(f"\n🔍 Searching for Excel files...")
    
    attendance_file = None
    knowledge_file = None
    production_file = None
    nh_file = None
    
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
    attendance_data = CustomExcelParser.parse_attendance(str(attendance_file)) if attendance_file else {}
    knowledge_data = CustomExcelParser.parse_process_knowledge(str(knowledge_file)) if knowledge_file else {}
    production_data = CustomExcelParser.parse_production(str(production_file)) if production_file else {}
    nh_data = CustomExcelParser.parse_nh_pending(str(nh_file)) if nh_file else {}
    
    # Consolidate
    print(f"\n🔗 Consolidating data...")
    all_employees = consolidate_data(attendance_data, knowledge_data, production_data, nh_data)
    
    # Show teams found
    teams = set()
    for emp in all_employees.values():
        if emp.get('team'):
            teams.add(emp['team'])
    
    print(f"\n📊 Teams found:")
    for team in sorted(teams):
        team_emps = [e for e in all_employees.values() if e.get('team') == team]
        print(f"   ✅ {team}: {len(team_emps)} employees")
    
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
        
        print(f"\n🎉 SUCCESS! Data synced with teams!")
        print(f"Check dashboard: https://hrops-scorecard---rta.web.app/manager-dashboard-enhanced.html")
        
    except Exception as e:
        print(f"❌ Error syncing to Firebase: {e}")

if __name__ == "__main__":
    main()
