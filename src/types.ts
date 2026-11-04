export type Role = 'employee' | 'hr' | 'manager' | 'company' | 'superadmin'
export type Page = 'legacy' | 'dashboard' | 'profile' | 'attendance' | 'leave' | 'payroll' | 'roster' | 'documents' | 'pms' | 'recruitment' | 'pf' | 'bills' | 'probation' | 'employees' | 'shifts' | 'settings' | 'audit'

export interface Employee {
  id: string
  name: string
  designation: string
  department: string
  branch: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  joiningDate: string
  employmentType: string
  status: string
  presentAddress: string
  permanentAddress: string
  emergencyContact: string
  emergencyPhone: string
  punchCard: string
}