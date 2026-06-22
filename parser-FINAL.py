#!/usr/bin/env python3
"""
Final Parser with Complete Team Mapping
Syncs all data with correct teams to Firebase
"""

import openpyxl
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, db

FIREBASE_CONFIG = {
    "projectId": "hrops-scorecard---rta",
    "databaseURL": "https://hrops-scorecard---rta.firebaseio.com"
}

# COMPLETE TEAM MAPPING
EMPLOYEE_TEAMS = {
    # Compliance Team
    'Sayee Nivas B': 'Compliance Team',
    'Alan Benjamin': 'Compliance Team',
    'Pavithra M': 'Compliance Team',
    'Latha J': 'Compliance Team',
    'Sneha Thomas': 'Compliance Team',
    'Azhar Taj': 'Compliance Team',
    'Rathina Sudhan K': 'Compliance Team',
    
    # Final Clearance Team
    'Archana Gautam': 'Final Clearance Team',
    'Aswani R': 'Final Clearance Team',
    'Anubha Priyam': 'Final Clearance Team',
    
    # HR Operations Team
    'Arjun MP': 'HR Operations Team',
    'Ingrid Mary Pope': 'HR Operations Team',
    'M Rihana': 'HR Operations Team',
    'Ramesh Kumar Selvaraj': 'HR Operations Team',
    
    # Internal Audit Team
    'Yogeshwaran R': 'Internal Audit Team',
    'Banupriya B': 'Internal Audit Team',
    
    # Paperwork Audit Team
    'Leonie Gomes': 'Paperwork Audit Team',
    'Thirisha Manoharan': 'Paperwork Audit Team',
    'Vinish Navinkumar': 'Paperwork Audit Team',
}

class FinalParser:
    """Parse Excel files with complete team mapping"""
    
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
        """Get team for employee from mapping"""
        if not emp_name:
            return 'Unassigned'
        
        emp_name_clean = str(emp_name).strip()
        
        for known_name, team in EMPLOYEE_TEAMS.items():
            if known_name.lower() in emp_name_clean.lower() or emp_name_clean.lower().find(known_name.lower()) >= 0:
                return team
        
        return 'Unassigned'
    
    @staticmethod
    def parse_attendance(file_path):
        """Parse Attendance"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = FinalParser.read_excel(file_path)
        
        attendance_data = {}
        for row in data:
            if not row or not row[0]:
                continue
            
            emp_name = str(row[0]).strip()
            team = FinalParser.get_team(emp_name)
            
            latest_attendance = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        latest_attendance = float(row[i])
                    except:
                        pass
            
            emp_id = emp_name.upper().replace(" ", "_")[:20]
            attendance_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'team': team,
                'attendance': latest_attendance,
            }
        
        print(f"   ✅ Parsed {len(attendance_data)} employees")
        return attendance_data
    
    @staticmethod
    def parse_process_knowledge(file_path):
        """Parse Process Knowledge"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = FinalParser.read_excel(file_path)
        
        knowledge_data = {}
        for row in data:
            if not row or not row[0]:
                continue
            
            emp_name = str(row[0]).strip()
            team = FinalParser.get_team(emp_name)
            
            latest_score = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        latest_score = float(row[i])
                    except:
                        pass
            
            emp_id = emp_name.upper().replace(" ", "_")[:20]
            knowledge_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'team': team,
                'process_knowledge': latest_score,
            }
        
        print(f"   ✅ Parsed {len(knowledge_data)} employees")
        return knowledge_data
    
    @staticmethod
    def parse_production(file_path):
        """Parse Production"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = FinalParser.read_excel(file_path)
        
        production_data = {}
        for row in data:
            if not row or not row[0]:
                continue
            
            emp_name = str(row[0]).strip()
            team = FinalParser.get_team(emp_name)
            
            total_production = 0
            for i in range(1, len(row)):
                if row[i] is not None:
                    try:
                        total_production += int(row[i])
                    except:
                        pass
            
            emp_id = emp_name.upper().replace(" ", "_")[:20]
            production_data[emp_id] = {
                'empId': emp_id,
                'name': emp_name,
                'team': team,
                'productivity': total_production,
            }
        
        print(f"   ✅ Parsed {len(production_data)} employees")
        return production_data
    
    @staticmethod
    def parse_nh_pending(file_path):
        """Parse NH Pending"""
        print(f"\n📊 Parsing: {Path(file_path).name}")
        data, headers = FinalParser.read_excel(file_path)
        
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
        
        for processor, counts in processor_counts.items():
            team = FinalParser.get_team(processor)
            emp_id = processor.upper().replace(" ", "_")[:20]
            nh_data[emp_id] = {
                'empId': emp_id,
                'name': processor,
                'team': team,
                'nh_pending': counts['pending'],
                'nh_completed': counts['completed'],
                'nh_total': counts['total'],
            }
        
        print(f"   ✅ Parsed {len(nh_data)} processors")
        return nh_data

def consolidate_data(attendance, knowledge, production, nh):
    """Merge all module data"""
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
    print("║   FINAL PARSER - Complete Data Sync with Teams                ║")
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
    attendance_data = FinalParser.parse_attendance(str(attendance_file)) if attendance_file else {}
    knowledge_data = FinalParser.parse_process_knowledge(str(knowledge_file)) if knowledge_file else {}
    production_data = FinalParser.parse_production(str(production_file)) if production_file else {}
    nh_data = FinalParser.parse_nh_pending(str(nh_file)) if nh_file else {}
    
    # Consolidate
    print(f"\n🔗 Consolidating data...")
    all_employees = consolidate_data(attendance_data, knowledge_data, production_data, nh_data)
    
    # Show teams
    teams = {}
    for emp in all_employees.values():
        team = emp.get('team', 'Unassigned')
        if team not in teams:
            teams[team] = 0
        teams[team] += 1
    
    print(f"\n📊 Teams Found:")
    for team, count in sorted(teams.items()):
        print(f"   ✅ {team}: {count} employees")
    
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
        
        print(f"\n🎉 SUCCESS! Data synced with correct teams!")
        print(f"\n📋 Summary:")
        print(f"   Total employees: {len(all_employees)}")
        for team, count in sorted(teams.items()):
            print(f"   {team}: {count}")
        
        print(f"\n🌐 Visit dashboard:")
        print(f"   https://hrops-scorecard---rta.web.app/manager-dashboard-fixed.html")
        
    except Exception as e:
        print(f"❌ Error syncing to Firebase: {e}")

if __name__ == "__main__":
    main()
