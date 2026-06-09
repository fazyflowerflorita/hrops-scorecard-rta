#!/usr/bin/env python3
"""
Verify Firebase Sync Status
"""

import firebase_admin
from firebase_admin import credentials, db
import json

# Firebase config
FIREBASE_CONFIG = {
    "projectId": "hrops-scorecard---rta",
    "databaseURL": "https://hrops-scorecard---rta.firebaseio.com"
}

def check_firebase_data():
    """Check what data is in Firebase"""
    try:
        # Initialize Firebase
        cred = credentials.Certificate("firebase-service-account.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': FIREBASE_CONFIG['databaseURL']
        })
        
        db_ref = db.reference()
        
        print("\n" + "="*70)
        print("🔍 CHECKING FIREBASE DATABASE")
        print("="*70 + "\n")
        
        # Check employee-master
        print("📋 EMPLOYEE MASTER DATA:")
        emp_ref = db_ref.child('employee-master').get()
        if emp_ref.val():
            emps = emp_ref.val()
            emp_count = len(emps) if isinstance(emps, dict) else 0
            print(f"   ✅ Found {emp_count} employees")
            
            # Show first 3 employees
            if isinstance(emps, dict):
                for i, (emp_id, emp_data) in enumerate(list(emps.items())[:3]):
                    print(f"   - {emp_id}: {emp_data.get('name', 'N/A')}")
                if emp_count > 3:
                    print(f"   ... and {emp_count - 3} more")
        else:
            print("   ❌ No employee data found")
        
        print()
        
        # Check performance-data
        print("📊 PERFORMANCE DATA:")
        perf_ref = db_ref.child('performance-data').get()
        if perf_ref.val():
            perfs = perf_ref.val()
            perf_count = len(perfs) if isinstance(perfs, dict) else 0
            print(f"   ✅ Found {perf_count} performance records")
            
            # Show first 3
            if isinstance(perfs, dict):
                for i, (emp_id, perf_data) in enumerate(list(perfs.items())[:3]):
                    score = perf_data.get('overall_score', 0)
                    print(f"   - {emp_id}: Score {score}%")
                if perf_count > 3:
                    print(f"   ... and {perf_count - 3} more")
        else:
            print("   ❌ No performance data found")
        
        print()
        
        # Summary
        print("="*70)
        print("📈 SUMMARY:")
        emp_count = len(emp_ref.val()) if emp_ref.val() and isinstance(emp_ref.val(), dict) else 0
        perf_count = len(perf_ref.val()) if perf_ref.val() and isinstance(perf_ref.val(), dict) else 0
        
        if emp_count > 0 and perf_count > 0:
            print(f"✅ SUCCESS! Firebase is synced with:")
            print(f"   - {emp_count} employees")
            print(f"   - {perf_count} performance records")
        elif emp_count == 0 and perf_count == 0:
            print("❌ No data in Firebase yet")
            print("   The Python script detected files but didn't sync data")
            print("   This means the Excel parsing needs enhancement")
        else:
            print(f"⚠️  Partial data:")
            print(f"   - Employees: {emp_count}")
            print(f"   - Performance: {perf_count}")
        
        print("="*70 + "\n")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure firebase-service-account.json is in this folder!")

if __name__ == "__main__":
    check_firebase_data()
