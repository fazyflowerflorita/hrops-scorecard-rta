#!/usr/bin/env python3
"""
Find all unique employees from Excel files
Creates a team mapping file for you to fill in
"""

import openpyxl
from pathlib import Path

def find_all_employees(folder_path):
    """Find all unique employees from all Excel files"""
    
    all_employees = set()
    
    folder = Path(folder_path)
    
    # Read all Excel files
    for file_path in folder.rglob('*.xlsx'):
        try:
            wb = openpyxl.load_workbook(file_path)
            ws = wb.active
            
            print(f"\n📄 Scanning: {file_path.name}")
            
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                if i == 0:
                    continue
                
                # First column is usually employee name
                if row and row[0]:
                    emp_name = str(row[0]).strip()
                    if emp_name and len(emp_name) > 2 and emp_name.lower() != 'name':
                        all_employees.add(emp_name)
            
            wb.close()
        except Exception as e:
            print(f"Error reading {file_path.name}: {e}")
    
    return sorted(list(all_employees))

def main():
    print("\n╔════════════════════════════════════════════════════════════════╗")
    print("║   FIND ALL EMPLOYEES - Create Team Mapping File              ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")
    
    folder_path = input("📁 Enter folder path: ").strip().strip('"')
    
    if not Path(folder_path).exists():
        print(f"❌ Folder not found: {folder_path}")
        return
    
    print(f"\n🔍 Scanning all Excel files...")
    employees = find_all_employees(folder_path)
    
    print(f"\n✅ Found {len(employees)} unique employees:\n")
    
    # Show teams available
    print("Available Teams:")
    print("  1. Compliance Team")
    print("  2. Final Clearance Team")
    print("  3. HR Operations Team")
    print("  4. Internal Audit Team")
    print("  5. Paperwork Audit Team")
    print("  6. MSD Data Management")
    print("  7. Requisitions and Submissions")
    print("  8. Unassigned\n")
    
    # Create mapping
    print("📋 EMPLOYEE TEAM MAPPING")
    print("=" * 70)
    
    team_mapping = {}
    
    for emp in employees:
        print(f"\nEmployee: {emp}")
        team_mapping[emp] = input("Enter team (1-8 or team name): ").strip()
    
    # Convert numbers to team names
    team_names = {
        '1': 'Compliance Team',
        '2': 'Final Clearance Team',
        '3': 'HR Operations Team',
        '4': 'Internal Audit Team',
        '5': 'Paperwork Audit Team',
        '6': 'MSD Data Management',
        '7': 'Requisitions and Submissions',
        '8': 'Unassigned'
    }
    
    # Create mapping config file
    config_content = "# Employee to Team Mapping\n"
    config_content += "# Format: 'Employee Name': 'Team Name'\n\n"
    config_content += "EMPLOYEE_TEAMS = {\n"
    
    for emp, team in team_mapping.items():
        # Replace numbers with team names
        team_final = team_names.get(team, team)
        config_content += f"    '{emp}': '{team_final}',\n"
    
    config_content += "}\n"
    
    # Save to file
    with open('team_mapping.py', 'w') as f:
        f.write(config_content)
    
    print(f"\n✅ Saved mapping to: team_mapping.py")
    print(f"\n📊 Summary:")
    for emp, team in team_mapping.items():
        team_final = team_names.get(team, team)
        print(f"  {emp} → {team_final}")

if __name__ == "__main__":
    main()
