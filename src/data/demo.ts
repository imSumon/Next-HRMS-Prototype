import type { Role } from '../types'

export const roleLabels: Record<Role, string> = {
  employee: 'Employee',
  hr: 'HR Manager',
  manager: 'Department Manager',
  company: 'Company Admin',
  superadmin: 'Platform Superadmin',
}

export const roleMenus: Record<Role, string[]> = {
  employee: ['dashboard', 'profile', 'attendance', 'leave', 'payroll', 'roster', 'documents', 'pms', 'recruitment', 'pf', 'bills', 'probation'],
  hr: ['dashboard', 'employees', 'shifts', 'attendance', 'leave', 'payroll', 'settings', 'audit'],
  manager: ['dashboard', 'employees', 'attendance', 'leave'],
  company: ['dashboard', 'employees', 'shifts', 'attendance', 'leave', 'payroll', 'settings', 'audit'],
  superadmin: ['dashboard', 'settings', 'audit'],
}

export const pageLabels: Record<string, string> = {
  legacy: 'Full Functional Workspace',
  dashboard: 'Dashboard', profile: 'My Profile', attendance: 'Attendance', leave: 'Leave',
  payroll: 'Payroll & Payslips', roster: 'My Roster', documents: 'Personal Files',
  pms: 'Performance (PMS)', recruitment: 'Recruitment', pf: 'PF Management',
  bills: 'Bill Management', probation: 'Probation', employees: 'Employees',
  shifts: 'Shifts & Rosters', settings: 'Settings', audit: 'Audit Trail',
}

export const serviceStatus: Record<string, 'Available' | 'Planned'> = {
  dashboard: 'Available', profile: 'Available', roster: 'Available',
  attendance: 'Planned', leave: 'Planned', payroll: 'Planned', documents: 'Planned',
  pms: 'Planned', recruitment: 'Planned', pf: 'Planned', bills: 'Planned', probation: 'Planned',
}