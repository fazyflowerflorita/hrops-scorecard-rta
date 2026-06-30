#!/usr/bin/env python3
"""
Pride Technologies HR Operations Scorecard Portal
Unified web application for all 5 teams with role-based access
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.utils import secure_filename
import openpyxl
from datetime import datetime
import json
from pathlib import Path
from collections import defaultdict
import os

app = Flask(__name__)
app.secret_key = 'pride-tech-secure-key-2026'

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

# Employee mapping with roles
EMPLOYEE_DATA = {
    # Compliance Team
    'P11561': {'name': 'Sayee Nivas B', 'team': 'Compliance', 'role': 'Manager'},
    'P12976': {'name': 'Alan Benjamin', 'team': 'Compliance', 'role': 'Associate'},
    'P13001': {'name': 'Pavithra M', 'team': 'Compliance', 'role': 'Associate'},
    'P13005': {'name': 'Latha J', 'team': 'Compliance', 'role': 'Associate'},
    'P13082': {'name': 'Sneha Thomas', 'team': 'Compliance', 'role': 'Associate'},
    'P13315': {'name': 'Azhar Taj', 'team': 'Compliance', 'role': 'Associate'},
    'P13318': {'name': 'Rathina Sudhan K', 'team': 'Compliance', 'role': 'Associate'},
    
    # Final Clearance Team
    'P11279': {'name': 'Archana Gautam', 'team': 'Final Clearance', 'role': 'Associate'},
    'P11436': {'name': 'Aswani R', 'team': 'Final Clearance', 'role': 'Associate'},
    'P12210': {'name': 'Anubha Priyam', 'team': 'Final Clearance', 'role': 'Associate'},
    
    # HR Operations Team
    'P11969': {'name': 'Arjun MP', 'team': 'HR Operations', 'role': 'Associate'},
    'P13086': {'name': 'Ingrid Mary Pope', 'team': 'HR Operations', 'role': 'Associate'},
    'P13310': {'name': 'M Rihana', 'team': 'HR Operations', 'role': 'Associate'},
    'P11184': {'name': 'Ramesh Kumar Selvaraj', 'team': 'HR Operations', 'role': 'Manager'},
    
    # Internal Audit Team
    'P11156': {'name': 'Yogeshwaran R', 'team': 'Internal Audit', 'role': 'Associate'},
    'P11569': {'name': 'Banupriya B', 'team': 'Internal Audit', 'role': 'Manager'},
    
    # Paperwork Clearance Team
    'P11470': {'name': 'Leonie Gomes', 'team': 'Paperwork Clearance', 'role': 'Associate'},
    'P12527': {'name': 'Thirisha Manoharan', 'team': 'Paperwork Clearance', 'role': 'Associate'},
    'P12945': {'name': 'Vinish Navinkumar', 'team': 'Paperwork Clearance', 'role': 'Manager'},
}

# Admin users (hardcoded for security)
ADMIN_USERS = {
    'admin': 'pride-admin-2026'
}

# Sample scorecard data
SCORECARDS = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        password = request.form.get('password')
        
        # Admin login
        if user_id in ADMIN_USERS and ADMIN_USERS[user_id] == password:
            session['user_id'] = user_id
            session['role'] = 'admin'
            return redirect(url_for('admin_dashboard'))
        
        # Employee login
        if user_id in EMPLOYEE_DATA:
            session['user_id'] = user_id
            session['employee_name'] = EMPLOYEE_DATA[user_id]['name']
            session['team'] = EMPLOYEE_DATA[user_id]['team']
            session['role'] = 'associate'
            return redirect(url_for('employee_dashboard'))
        
        return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/admin', methods=['GET', 'POST'])
def admin_dashboard():
    if session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        uploaded_files = []
        
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                uploaded_files.append(filename)
        
        return jsonify({
            'success': True,
            'message': f'Uploaded {len(uploaded_files)} files',
            'files': uploaded_files
        })
    
    return render_template('admin_dashboard.html')

@app.route('/api/generate-scorecards', methods=['POST'])
def generate_scorecards():
    if session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        # Process all Excel files in upload folder
        scorecard_data = process_all_files()
        
        # Save to session
        session['scorecards'] = scorecard_data
        session.modified = True
        
        return jsonify({
            'success': True,
            'message': 'Scorecards generated successfully',
            'teams_processed': len(scorecard_data)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/manager/<team>')
def manager_dashboard(team):
    if session.get('role') not in ['admin', 'associate']:
        return redirect(url_for('login'))
    
    # Get team scorecard
    scorecards = session.get('scorecards', {})
    team_score = scorecards.get(team, {})
    
    return render_template('manager_dashboard.html', 
                          team=team, 
                          scorecard=team_score)

@app.route('/employee')
def employee_dashboard():
    if session.get('role') != 'associate':
        return redirect(url_for('login'))
    
    user_id = session.get('user_id')
    emp_name = session.get('employee_name')
    team = session.get('team')
    
    # Get employee-specific scorecard
    scorecards = session.get('scorecards', {})
    team_score = scorecards.get(team, {})
    
    # Filter to only this employee
    employee_score = {}
    for emp_data in team_score.get('employees', []):
        if emp_data.get('Employee Name') == emp_name:
            employee_score = emp_data
            break
    
    return render_template('employee_dashboard.html',
                          employee_name=emp_name,
                          team=team,
                          scorecard=employee_score)

@app.route('/api/scorecard/<team>')
def get_team_scorecard(team):
    scorecards = session.get('scorecards', {})
    return jsonify(scorecards.get(team, {}))

def process_all_files():
    """Process all uploaded Excel files and generate scorecards"""
    upload_path = Path(app.config['UPLOAD_FOLDER'])
    
    scorecard_data = {
        'Compliance': generate_compliance_scorecard(upload_path),
        'Final Clearance': generate_final_clearance_scorecard(upload_path),
        'HR Operations': generate_hr_operations_scorecard(upload_path),
        'Internal Audit': generate_internal_audit_scorecard(upload_path),
        'Paperwork Clearance': generate_paperwork_scorecard(upload_path)
    }
    
    return scorecard_data

def generate_compliance_scorecard(upload_path):
    """Generate compliance team scorecard"""
    # Placeholder - would call actual Compliance_Scorecard_Generator.py
    return {
        'team': 'Compliance',
        'total_members': 7,
        'employees': [],
        'summary': {}
    }

def generate_final_clearance_scorecard(upload_path):
    """Generate final clearance team scorecard"""
    return {
        'team': 'Final Clearance',
        'total_members': 3,
        'employees': [],
        'summary': {}
    }

def generate_hr_operations_scorecard(upload_path):
    """Generate HR operations team scorecard"""
    return {
        'team': 'HR Operations',
        'total_members': 19,
        'employees': [],
        'summary': {}
    }

def generate_internal_audit_scorecard(upload_path):
    """Generate internal audit team scorecard"""
    return {
        'team': 'Internal Audit',
        'total_members': 2,
        'employees': [],
        'summary': {}
    }

def generate_paperwork_scorecard(upload_path):
    """Generate paperwork clearance team scorecard"""
    return {
        'team': 'Paperwork Clearance',
        'total_members': 3,
        'employees': [],
        'summary': {}
    }

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
