import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import type { ReactNode } from 'react'
import { Alert, Avatar, Badge, Button, Card, Col, Descriptions, Empty, Form, Input, Layout, Menu, Modal, Progress, Row, Select, Space, Statistic, Steps, Switch, Table, Tabs, Tag, Typography, message } from 'antd'
import type { MenuProps, TableColumnsType } from 'antd'
import { AppstoreOutlined, AuditOutlined, BankOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloudUploadOutlined, DashboardOutlined, DatabaseOutlined, FileTextOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import initialData from './data/demo.json'
import { buildFullDemoDataset } from './data/fullDemoDataset'
import AttendanceLab from './AttendanceLab'
import PayrollDemo from './PayrollDemo'
import LeaveOtUat from './LeaveOtUat'
import './styles.css'

type Role = 'superadmin' | 'company' | 'hr' | 'manager' | 'employee'
type Page = string
type DemoData = Omit<typeof initialData, 'leave' | 'audit' | 'companies' | 'employees' | 'punches' | 'policies' | 'leaveBalances'> & { companies: any[]; employees: any[]; punches: any[]; policies: any[]; leave: any[]; leaveBalances: any[]; audit: any[] }
const APP_VERSION = '0.9.55'
const legacyPath = '/legacy-prototype/Next-HRMS-Prototype-v0.8.9/'
const TEST_DATA_KEY = 'next-hrms-react-v0.9.24-test-data'
const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const SHIFT_TIME_OPTIONS = Array.from({length:1440},(_,i)=>{const time=`${String(Math.floor(i/60)).padStart(2,'0')}:${String(i%60).padStart(2,'0')}`;return {value:time,label:time}})
const ShiftTimeSelect = ({value,onChange}:{value?:string,onChange?:(value:string)=>void}) => <Select
  showSearch value={value} onChange={onChange} placeholder="Select time" optionFilterProp="label"
  options={SHIFT_TIME_OPTIONS} style={{width:'100%'}} size="large"
  suffixIcon={<ClockCircleOutlined />} listHeight={256} virtual
/>


// Prototype-only ELM field catalogue; requires source mapping before production use.
// Field catalogue: screenshot-referenced candidates + proposed extensions; not a verified DB inventory.
const ELM_FIELDS = [
  {
    "key": "employeeCode",
    "name": "Employee ID / code",
    "group": "Identity",
    "protected": true,
    "origin": "Legacy screenshot reference",
    "review": "Protected baseline; validate schema"
  },
  {
    "key": "name",
    "name": "Employee full name",
    "group": "Identity",
    "protected": true,
    "origin": "Legacy screenshot reference",
    "review": "Protected baseline; validate schema"
  },
  {
    "key": "companyId",
    "name": "Company reference",
    "group": "Identity",
    "protected": true,
    "origin": "Legacy screenshot reference",
    "review": "Protected baseline; validate schema"
  },
  {
    "key": "status",
    "name": "Employment status",
    "group": "Identity",
    "protected": true,
    "origin": "Legacy screenshot reference",
    "review": "Protected baseline; validate schema"
  },
  {
    "key": "legacyEmpId",
    "name": "Legacy employee ID",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "firstName",
    "name": "First name",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "middleName",
    "name": "Middle name",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "lastName",
    "name": "Last name",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "oldId",
    "name": "Old employee ID",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "nid",
    "name": "National ID",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "passport",
    "name": "Passport number",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "birthDate",
    "name": "Date of birth",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "sex",
    "name": "Gender / sex",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "bloodGroup",
    "name": "Blood group",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "religion",
    "name": "Religion",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "maritalStatus",
    "name": "Marital status",
    "group": "Identity",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "email",
    "name": "Email",
    "group": "Contact",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "mobile",
    "name": "Mobile number",
    "group": "Contact",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "presentAddress",
    "name": "Present address",
    "group": "Contact",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "permanentAddress",
    "name": "Permanent address",
    "group": "Contact",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "emergencyPhone",
    "name": "Emergency contact number",
    "group": "Contact",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "fatherName",
    "name": "Father name",
    "group": "Family & nominee",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "motherName",
    "name": "Mother name",
    "group": "Family & nominee",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "grandfatherName",
    "name": "Grandfather name",
    "group": "Family & nominee",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "childrenCount",
    "name": "Number of children",
    "group": "Family & nominee",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "nominee",
    "name": "Nominee information",
    "group": "Family & nominee",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "dept",
    "name": "Department",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "branch",
    "name": "Branch / workplace",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "unit",
    "name": "Unit",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "floor",
    "name": "Floor",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "section",
    "name": "Section",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "subSection",
    "name": "Subsection",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "line",
    "name": "Production line",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "costCenter",
    "name": "Cost center",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "jobLocation",
    "name": "Job location",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "team",
    "name": "Team",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "manager",
    "name": "Reporting manager / boss",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "managementLevel",
    "name": "Management level",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "businessDept",
    "name": "Bdepartment (legacy)",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "businessDesignation",
    "name": "Bdesignation (legacy)",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "businessUnit",
    "name": "Bname / business unit (legacy)",
    "group": "Organization",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "title",
    "name": "Designation / job title",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "joiningDate",
    "name": "Joining date",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "employeeType",
    "name": "Employee type",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "grade",
    "name": "Grade",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "band",
    "name": "Band",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "confirmationDate",
    "name": "Confirmation date",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "probationPeriod",
    "name": "Probation period",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "experienceYears",
    "name": "Years of experience",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "discontinueDate",
    "name": "Discontinue date",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "discontinueType",
    "name": "Discontinue type",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "discontinueDescription",
    "name": "Discontinue description",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "employmentEffectiveFrom",
    "name": "Employment effective-from date",
    "group": "Employment",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "basicSalary",
    "name": "Basic salary",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "grossSalary",
    "name": "Gross salary",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "salaryGroup",
    "name": "Salary group",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "bankAccount",
    "name": "Bank account",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "bankBranch",
    "name": "Bank branch",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "routingNo",
    "name": "Bank routing number",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "taxNumber",
    "name": "Tax identifier",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "taxLocation",
    "name": "Tax location",
    "group": "Compensation & bank",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "otEligible",
    "name": "Overtime eligibility",
    "group": "Attendance & schedule",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "weeklyHours",
    "name": "Working hours per week",
    "group": "Attendance & schedule",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "weeklyHoliday",
    "name": "Weekly holiday",
    "group": "Attendance & schedule",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "multipleWeeklyHoliday",
    "name": "Multiple weekly holidays",
    "group": "Attendance & schedule",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "shiftId",
    "name": "Shift ID",
    "group": "Attendance & schedule",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "shiftSchedule",
    "name": "Shift schedule",
    "group": "Attendance & schedule",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "pfMemberId",
    "name": "PF member ID",
    "group": "Provident fund",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "pfConfirmationDate",
    "name": "PF confirmation date",
    "group": "Provident fund",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Review legacy DB mapping"
  },
  {
    "key": "legacyActive",
    "name": "Active flag (legacy)",
    "group": "Legacy review",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Potential overlap; do not merge until legacy schema verified"
  },
  {
    "key": "legacyEmpDepartment",
    "name": "Emp Department (legacy)",
    "group": "Legacy review",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Potential overlap; do not merge until legacy schema verified"
  },
  {
    "key": "legacyEmpDesignation",
    "name": "Emp Designation (legacy)",
    "group": "Legacy review",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Potential overlap; do not merge until legacy schema verified"
  },
  {
    "key": "legacyEmpUnit",
    "name": "Emp Unit (legacy)",
    "group": "Legacy review",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Potential overlap; do not merge until legacy schema verified"
  },
  {
    "key": "legacyCompanyBranch",
    "name": "Company Branch (legacy)",
    "group": "Legacy review",
    "protected": false,
    "origin": "Legacy screenshot reference",
    "review": "Potential overlap; do not merge until legacy schema verified"
  },
  {
    "key": "transferEffectiveDate",
    "name": "Transfer effective date",
    "group": "Lifecycle additions",
    "protected": false,
    "origin": "Proposed extension",
    "review": "Not verified in legacy screenshot; approval required"
  },
  {
    "key": "promotionEffectiveDate",
    "name": "Promotion effective date",
    "group": "Lifecycle additions",
    "protected": false,
    "origin": "Proposed extension",
    "review": "Not verified in legacy screenshot; approval required"
  },
  {
    "key": "separationReason",
    "name": "Separation reason",
    "group": "Lifecycle additions",
    "protected": false,
    "origin": "Proposed extension",
    "review": "Not verified in legacy screenshot; approval required"
  },
  {
    "key": "rehireDate",
    "name": "Rehire date",
    "group": "Lifecycle additions",
    "protected": false,
    "origin": "Proposed extension",
    "review": "Not verified in legacy screenshot; approval required"
  },
  {
    "key": "employmentHistory",
    "name": "Employment history reference",
    "group": "Lifecycle additions",
    "protected": false,
    "origin": "Proposed extension",
    "review": "Not verified in legacy screenshot; approval required"
  },
  {
    "key": "documentExpiry",
    "name": "Document expiry date",
    "group": "Lifecycle additions",
    "protected": false,
    "origin": "Proposed extension",
    "review": "Not verified in legacy screenshot; approval required"
  }
] as const
const FIELD_MODULES = ['Employee Lifecycle Management (ELM)', 'Recruitment', 'Attendance', 'Leave', 'Payroll', 'Performance Management (PMS)']
const FIELD_SCREENS: Record<string,string[]> = {
  'Employee Lifecycle Management (ELM)': ['Employee Registration','Employee Profile','Employee Directory'],
  'Recruitment': ['Candidate Registration'],
  'Attendance': ['Attendance Record'],
  'Leave': ['Leave Application'],
  'Payroll': ['Employee Payroll Information'],
  'Performance Management (PMS)': ['Performance Review'],
}
type FieldSetting = { enabled:boolean; visible:boolean; required:boolean; editable:boolean; exportable:boolean }
type FieldConfig = { fields: Record<string,FieldSetting>; delegated: { company:boolean; hr:boolean } }
const DEFAULT_FIELD = { enabled:true, visible:true, required:false, editable:true, exportable:true }
const fieldConfigKey = 'next-hrms-react-v0.9.25-elm-field-config' // retain persisted v0.9.25 settings

const platformMenu = [
  { key: 'overview', icon: <DashboardOutlined />, label: 'Platform Overview' },
  { key: 'superadmin', icon: <AppstoreOutlined />, label: 'Superadmin' },
  { key: 'enrollment', icon: <PlusOutlined />, label: 'Company Enrollment' },
  { key: 'companies', icon: <BankOutlined />, label: 'Companies' },
  { key: 'access', icon: <TeamOutlined />, label: 'Users & Roles' },
  { key: 'audit', icon: <AuditOutlined />, label: 'Audit Trail' },
  { key: 'fieldconfig', icon: <SettingOutlined />, label: 'Field Configuration' },
]
const hrMenu = [
  { key: 'hrhome', icon: <DashboardOutlined />, label: 'HR Manager Dashboard' },
  { key: 'employees', icon: <TeamOutlined />, label: 'ELM — Employee Lifecycle' },
  { key: 'fieldconfig', icon: <SettingOutlined />, label: 'Field Configuration' },
  { key: 'shifts', icon: <ClockCircleOutlined />, label: 'Shift & Roster Overview' },
  { key: 'shiftsetup', icon: <SettingOutlined />, label: 'Shift & Policy Setup' },
  { key: 'shiftassign', icon: <TeamOutlined />, label: 'Employee Shift Assignment' },
  { key: 'rosterplanning', icon: <CalendarOutlined />, label: 'Monthly Roster Planning' },
  { key: 'rosterpublish', icon: <CheckCircleOutlined />, label: 'Roster Review & Publish' },
  { key: 'rosterreport', icon: <FileTextOutlined />, label: 'Roster Reports' },
  { key: 'attendance', icon: <ClockCircleOutlined />, label: 'Attendance' },
  { key: 'leave', icon: <CheckCircleOutlined />, label: 'Leave Management' },
  { key: 'ot', icon: <ClockCircleOutlined />, label: 'OT Management' },
  { key: 'payroll', icon: <DatabaseOutlined />, label: 'Payroll & Reports' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Company Setup' },
]
const companyMenu = [
  { key: 'companydashboard', icon: <DashboardOutlined />, label: 'Company Dashboard' },
  ...hrMenu.filter(x => x.key !== 'hrhome'),
  { key: 'access', icon: <TeamOutlined />, label: 'Users & Roles' },
  { key: 'audit', icon: <AuditOutlined />, label: 'Audit Trail' },
]
const managerMenu = [
  { key: 'managerhome', icon: <DashboardOutlined />, label: 'Manager Dashboard' },
  { key: 'employees', icon: <TeamOutlined />, label: 'My Team' },
  { key: 'attendance', icon: <ClockCircleOutlined />, label: 'Team Attendance' },
  { key: 'leave', icon: <CheckCircleOutlined />, label: 'Leave Approvals' },
]
const employeeMenu = [
  { key: 'employeehome', icon: <DashboardOutlined />, label: 'My Dashboard' },
  { key: 'employeeprofile', icon: <UserOutlined />, label: 'My Profile' },
  { key: 'myattendance', icon: <ClockCircleOutlined />, label: 'My Attendance' },
  { key: 'myleave', icon: <CheckCircleOutlined />, label: 'My Leave' },
  { key: 'myroster', icon: <CalendarOutlined />, label: 'My Monthly Roster' },
]
const titleMap: Record<string, string> = Object.fromEntries([...platformMenu, ...hrMenu, ...companyMenu, ...managerMenu, ...employeeMenu].map(x => [x.key, String(x.label)]))

export default function App() {
  const [auth, setAuth] = useState<{ role: Role; email: string; companyId: string; persona: string } | null>(null)
  const [page, setPage] = useState<Page>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [data, setData] = useState<DemoData>(() => { try { const saved = localStorage.getItem(TEST_DATA_KEY); return saved ? ({ ...structuredClone(initialData), ...JSON.parse(saved) } as DemoData) : (structuredClone(initialData) as DemoData) } catch { return structuredClone(initialData) as DemoData } })
  const [configCompanyId, setConfigCompanyId] = useState('')
  const [configModule, setConfigModule] = useState(FIELD_MODULES[0])
  const [configScreen, setConfigScreen] = useState(FIELD_SCREENS[FIELD_MODULES[0]][0])
  const [fieldConfigs, setFieldConfigs] = useState<Record<string, FieldConfig>>(() => { try { return JSON.parse(localStorage.getItem(fieldConfigKey) || '{}') } catch { return {} } })
  const [companySearch, setCompanySearch] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  // v0.9.32: company-scoped, browser-local lifecycle requests; no production authorization.
  const [lifecycleRequests, setLifecycleRequests] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:lifecycle`) || '[]') } catch { return [] } })
  const [lifecycleEmployeeId, setLifecycleEmployeeId] = useState('')
  const [lifecycleForm] = Form.useForm()
  const [lifecycleType, setLifecycleType] = useState('Confirmation')

  const [enrollOpen, setEnrollOpen] = useState(false)
  const [form] = Form.useForm()
  const [employeeForm] = Form.useForm()
    const [enrollmentTab, setEnrollmentTab] = useState('Identity')
  const [importRows, setImportRows] = useState<any[]>([])
  const [importErrors, setImportErrors] = useState<Record<number,string[]>>({})
  const [photoRows, setPhotoRows] = useState<{name:string;employeeCode:string;status:string;dataUrl?:string}[]>([])
  const [photoBusy, setPhotoBusy] = useState(false)
  const photoFileRef = useRef<HTMLInputElement>(null)
  const [photoProcessed, setPhotoProcessed] = useState(0)
  const [photoRevision, setPhotoRevision] = useState(0)
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('All')
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState('All')
  const [employeeDesignationFilter, setEmployeeDesignationFilter] = useState('All')
  const [balanceForm] = Form.useForm()
  const [balanceOpen, setBalanceOpen] = useState(false)
  const [shiftForm] = Form.useForm()
  const [rosterForm] = Form.useForm()
  const [bulkAssignForm] = Form.useForm()
  const [singleAssignForm] = Form.useForm()
  const [shiftRecords, setShiftRecords] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:shifts`) || '[]') } catch { return [] } })
  const [assignments, setAssignments] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:assignments`) || '[]') } catch { return [] } })
  const [rosters, setRosters] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:rosters`) || '[]') } catch { return [] } })
  const [shiftPolicies, setShiftPolicies] = useState<Record<string, any>>(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:shift-policies`) || '{}') } catch { return {} } })
  const [shiftChangeRequests, setShiftChangeRequests] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:shift-change-requests`) || '[]') } catch { return [] } })
  const [calendarDept, setCalendarDept] = useState('All')
  const [calendarBranch, setCalendarBranch] = useState('All')
  const [selectedRosterIds, setSelectedRosterIds] = useState<string[]>([])
  const [rosterEmployeeSearch, setRosterEmployeeSearch] = useState('')
  const [bulkDept, setBulkDept] = useState('')
  const [bulkUnit, setBulkUnit] = useState('')
  const [bulkBranch, setBulkBranch] = useState('')
  const [bulkFloor, setBulkFloor] = useState('')
  const [bulkLine, setBulkLine] = useState('')
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([])
  const [shiftAssignMode, setShiftAssignMode] = useState<'view'|'single'|'bulk'|'import'|'default'>('view')
  const [workflowGuideOpen, setWorkflowGuideOpen] = useState(false)
  const [shiftAssignSearch, setShiftAssignSearch] = useState('')
  const [shiftAssignShiftFilter, setShiftAssignShiftFilter] = useState('')
  const [defaultEdit, setDefaultEdit] = useState<any|null>(null)
  const [defaultEditShift, setDefaultEditShift] = useState('')
  const [defaultEditFrom, setDefaultEditFrom] = useState('')
  const [defaultHistoryEmployee, setDefaultHistoryEmployee] = useState('')

  const [shiftResultDetailsOpen, setShiftResultDetailsOpen] = useState(false)
  const [shiftAssignResult, setShiftAssignResult] = useState<{type:"success"|"warning"|"error",saved:number,skipped:string[]}|null>(null)
  const [rosterMonth, setRosterMonth] = useState(new Date().toISOString().slice(0,7))
  const [rosterPrefs, setRosterPrefs] = useState(() => { try { return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:roster-prefs`) || '{"employeeFutureVisible":true,"hrDefault":"Next month","employeeDefault":"Next month"}') } catch { return {employeeFutureVisible:true,hrDefault:'Next month',employeeDefault:'Next month'} } })
  const menu = auth?.role === 'superadmin' ? platformMenu : auth?.role === 'company' ? companyMenu : auth?.role === 'manager' ? managerMenu : auth?.role === 'employee' ? employeeMenu : hrMenu
  const company = data.companies.find(c => c.id === auth?.companyId)
  const effectiveConfigCompanyId = auth?.role === 'superadmin' ? (configCompanyId || data.companies[0]?.id || '') : (auth?.companyId || '')
  const activeFieldConfig = fieldConfigs[effectiveConfigCompanyId] || { fields:{}, delegated:{company:false,hr:false} }
  // v0.9.29: resolve the saved company + screen settings without altering stored employee data.
  const employeeFieldSetting = (screen: string, key: string): FieldSetting => {
    const companyConfig = fieldConfigs[auth?.companyId || '']
    const field = ELM_FIELDS.find(f => f.key === key)
    const saved = companyConfig?.fields?.[screen === 'Employee Registration' ? key : `${screen}::${key}`]
      || companyConfig?.fields?.[key]
      || DEFAULT_FIELD
    return field?.protected ? { ...saved, enabled:true, visible:true, required:true, editable:false } : saved
  }
  const showEmployeeField = (screen:string, key:string) => {
    const f = employeeFieldSetting(screen,key)
    return f.enabled && f.visible
  }
  const registrationField = (key:string, label:string, control:ReactNode, baseRequired=false) => {
    if (!showEmployeeField('Employee Registration',key)) return null
    const config = employeeFieldSetting('Employee Registration',key)
    const required = baseRequired || config.required
    return <Col key={key} xs={24} md={8}><Form.Item name={key} label={label} rules={[{required,message:`${label} is required`}] }>
      {isValidElement(control) ? cloneElement(control as React.ReactElement<any>, { disabled: !config.editable && !ELM_FIELDS.find(f=>f.key===key)?.protected }) : control}
    </Form.Item></Col>
  }
  const canConfigureFields = auth?.role === 'superadmin' || (auth?.role === 'company' && activeFieldConfig.delegated.company) || (auth?.role === 'hr' && activeFieldConfig.delegated.hr)
  const saveFieldConfig = (next: FieldConfig) => {
    if (!canConfigureFields || !effectiveConfigCompanyId) { message.error('Configuration access not granted.'); return }
    setFieldConfigs(prev => ({...prev,[effectiveConfigCompanyId]:next}))
    message.success('Prototype field settings saved in this browser.')
  }


  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.data?.type !== 'NEXT_HRMS_LOGIN') return
      const { role, email, companyId, persona } = event.data
      if (!['superadmin','company','hr','manager','employee'].includes(role)) return
      setSelectedRosterIds([])
      setAuth({ role, email, companyId, persona })
      setPage(({superadmin:'overview',company:'companydashboard',hr:'hrhome',manager:'managerhome',employee:'employeehome'} as Record<string,string>)[role] || 'overview')
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [])

  // Persist only synthetic prototype records so testers can switch personas and reload without losing the clean-session work.
  useEffect(() => { localStorage.setItem(TEST_DATA_KEY, JSON.stringify(data)) }, [data])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:lifecycle`, JSON.stringify(lifecycleRequests)) }, [lifecycleRequests])
  useEffect(() => { localStorage.setItem(fieldConfigKey, JSON.stringify(fieldConfigs)) }, [fieldConfigs])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:shifts`, JSON.stringify(shiftRecords)) }, [shiftRecords])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:assignments`, JSON.stringify(assignments)) }, [assignments])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:rosters`, JSON.stringify(rosters)) }, [rosters])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:shift-policies`, JSON.stringify(shiftPolicies)) }, [shiftPolicies])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:shift-change-requests`, JSON.stringify(shiftChangeRequests)) }, [shiftChangeRequests])
  useEffect(() => { localStorage.setItem(`${TEST_DATA_KEY}:roster-prefs`, JSON.stringify(rosterPrefs)) }, [rosterPrefs])

  const loadFullDemo = () => {
    if (!auth?.companyId) { message.error('Please sign in to a company workspace before loading demo data.'); return }
    const companyEmployees = data.employees.filter((e:any) => e.companyId === auth.companyId).slice(0, 6)
    if (companyEmployees.length < 6) { message.error('At least six employee records are required in this company to load the coordinated demo.'); return }
    if (!window.confirm(`Load coordinated synthetic test records into ${company?.name || auth.companyId}? The first six company employees will be used. Existing demo records for this company will be replaced.`)) return
    const bundle = buildFullDemoDataset()
    const idMap = new Map(bundle.data.employees.map((e:any, i:number) => [e.id, companyEmployees[i].id]))
    const mapEmployeeId = (id:string) => idMap.get(id) || id
    const mappedData = {
      employees: [],
      punches: bundle.data.punches.map((r:any)=>({...r,employeeId:mapEmployeeId(r.employeeId),companyId:auth.companyId,recordSource:'Synthetic demo dataset v0.9.22'})),
      leave: bundle.data.leave.map((r:any)=>({...r,employeeId:mapEmployeeId(r.employeeId),employee:companyEmployees.find((e:any)=>e.id===mapEmployeeId(r.employeeId))?.name||r.employee,companyId:auth.companyId,recordSource:'Synthetic demo dataset v0.9.22'})),
      users: bundle.data.users.filter((u:any)=>u.role!=='Platform Superadmin').map((u:any)=>({...u,companyId:auth.companyId})),
      roles: bundle.data.roles,
      policies: bundle.data.policies.map((r:any)=>({...r,companyId:auth.companyId})),
      audit: bundle.data.audit.map((r:any)=>({...r,companyId:auth.companyId})),
      leaveBalances: bundle.data.leaveBalances.map((r:any)=>({...r,employeeId:mapEmployeeId(r.employeeId),employeeName:companyEmployees.find((e:any)=>e.id===mapEmployeeId(r.employeeId))?.name||r.employeeName,companyId:auth.companyId}))
    }
    const shifts = bundle.shifts.map((r:any)=>({...r,companyId:auth.companyId}))
    const assignments = bundle.assignments.map((r:any)=>({...r,employeeId:mapEmployeeId(r.employeeId),employeeName:companyEmployees.find((e:any)=>e.id===mapEmployeeId(r.employeeId))?.name||r.employeeName,companyId:auth.companyId}))
    const rosters = bundle.rosters.map((r:any)=>({...r,employeeId:mapEmployeeId(r.employeeId),employeeName:companyEmployees.find((e:any)=>e.id===mapEmployeeId(r.employeeId))?.name||r.employeeName,companyId:auth.companyId}))
    setData(prev => ({
      ...prev,
      punches:[...prev.punches.filter((r:any)=>r.companyId!==auth.companyId),...mappedData.punches],
      leave:[...prev.leave.filter((r:any)=>r.companyId!==auth.companyId),...mappedData.leave],
      policies:[...prev.policies.filter((r:any)=>r.companyId!==auth.companyId),...mappedData.policies],
      audit:[...prev.audit.filter((r:any)=>r.companyId!==auth.companyId),...mappedData.audit],
      leaveBalances:[...prev.leaveBalances.filter((r:any)=>r.companyId!==auth.companyId),...mappedData.leaveBalances],
      users:[...prev.users.filter((r:any)=>r.companyId!==auth.companyId),...mappedData.users],
      roles:mappedData.roles
    }))
    setShiftRecords(prev=>[...prev.filter((r:any)=>r.companyId!==auth.companyId),...shifts])
    setAssignments(prev=>[...prev.filter((r:any)=>r.companyId!==auth.companyId),...assignments])
    setRosters(prev=>[...prev.filter((r:any)=>r.companyId!==auth.companyId),...rosters])
    setRosterMonth('2026-11')
    setSelectedRosterIds([])
    message.success(`Demo data loaded for ${company?.name || auth.companyId}: ${companyEmployees.length} employees, shifts, assignments, rosters, punches, leave balances and requests.`)
  }

  const resetTestData = () => {
    if (!window.confirm('Reset browser demo data and restore the original v0.9.23 baseline? The full synthetic dataset and local changes will be removed.')) return
    Object.keys(localStorage).filter(key => key.startsWith(TEST_DATA_KEY)).forEach(key => localStorage.removeItem(key))
    setData(structuredClone(initialData) as DemoData); setShiftRecords([]); setAssignments([]); setRosters([]); setSelectedRosterIds([]); setBulkSelectedIds([]); setRosterEmployeeSearch('')
    setRosterPrefs({employeeFutureVisible:true,hrDefault:'Next month',employeeDefault:'Next month'}); setShiftPolicies({}); setShiftChangeRequests([])
    message.success('Browser demo data reset to the original baseline dataset.')
  }

  const scopedEmployees = useMemo(() => auth?.role === 'superadmin'
    ? data.employees
    : data.employees.filter(e => e.companyId === auth?.companyId), [data.employees, auth?.role, auth?.companyId])
  const shiftEmployees = scopedEmployees
  const currentEmployee = useMemo(() => data.employees.find(e => e.companyId === auth?.companyId && (e.email || '').toLowerCase() === (auth?.email || '').toLowerCase()), [data.employees, auth?.companyId, auth?.email])
  const leaveEmployeeOptions = useMemo(() => { const rows = [...scopedEmployees.map(e => ({id:e.id,name:e.name})), ...(data.leave || []).map(l => ({id:l.employeeId || l.employee,name:l.employee}))]; return rows.filter((r,i)=>rows.findIndex(x=>x.id===r.id)===i) }, [scopedEmployees, data.leave])
  const pendingLeaves = (data.leave || []).filter(l => /pending/i.test(l.status || ''))
  const exceptions = data.punches.filter(p => !/accepted/i.test(p.status))

  // Phase 1A: enforce role routes in addition to hiding unavailable menu entries.
  const allowedPages = (role: Role): string[] => role === 'superadmin'
    ? ['overview','superadmin','enrollment','companies','access','audit','fieldconfig','settings','policyhistory','legacyhistory']
    : role === 'employee' ? employeeMenu.map(x=>x.key)
    : role === 'manager' ? managerMenu.map(x=>x.key)
    : role === 'company' ? [...new Set([...companyMenu.map(x=>x.key),'employee-lifecycle','employee-enrollment','employee-import','employee-photos','fieldconfig','employeeprofile'])]
    : [...new Set([...hrMenu.map(x=>x.key),'employee-lifecycle','employee-enrollment','employee-import','employee-photos','fieldconfig','employeeprofile'])]
  const go = (next: string) => {
    if (!auth || !allowedPages(auth.role).includes(next)) { message.error('This page is not available for your login role.'); return }
    setPage(next)
  }
  const addAudit = (action: string, target: string, result = 'Success') => setData(prev => ({ ...prev, audit: [{ time: new Date().toLocaleString(), actor: auth?.persona || 'Demo user', action, target, result }, ...(prev.audit || [])] }))
  const logout = () => { setAuth(null); setPage('overview'); window.location.href = window.location.pathname }
  const createCompany = (values: any) => {
    const code = String(values.code).trim().toUpperCase()
    if (data.companies.some(c => c.code.toUpperCase() === code)) { message.error('Company code already exists.'); return }
    const next = { id: `co-${Date.now()}`, name: values.name, code, industry: values.industry, status: 'Draft', progress: 25, modules: values.modules || ['Employee Lifecycle Management (ELM)', 'Organization'] }
    setData(prev => ({ ...prev, companies: [next, ...prev.companies] }))
    addAudit('Created company enrollment draft', `${values.name} (${code})`)
    setEnrollOpen(false); form.resetFields(); message.success('Company enrollment draft created.')
  }
  const createEmployee = (values: any) => {
    const email = String(values.email || '').trim().toLowerCase()
    if (!auth?.companyId) { message.error('No company workspace is assigned to this login.'); return }
    if (data.employees.some(e => e.companyId === auth.companyId && ((e.employeeCode || '').toLowerCase() === String(values.employeeCode || '').trim().toLowerCase() || (email && (e.email || '').toLowerCase() === email)))) { message.error('Employee ID or email already exists in this company.'); return }
    // Required settings apply even when users bypass the browser's form controls.
    const mandatory = ELM_FIELDS.filter(f => showEmployeeField('Employee Registration',f.key) && employeeFieldSetting('Employee Registration',f.key).required && f.key !== 'companyId')
    const missing = mandatory.filter(f => !String(values[f.key] ?? '').trim())
    if (missing.length) { message.error(`Required ELM field(s) missing: ${missing.slice(0,3).map(f=>f.name).join(', ')}`); return }
    const row = { ...values, id: `EMP-${Date.now()}`, companyId: auth.companyId, employeeCode: String(values.employeeCode).trim(), name: String(values.name).trim(), email, status: 'Active', createdAt: new Date().toISOString() }
    setData(prev => ({ ...prev, employees: [...prev.employees, row] }))
    addAudit('Created employee record', `${row.name} (${row.employeeCode})`)
    employeeForm.resetFields(); setPage('employees'); message.success('Employee record created for this demo session.')
  }

  // v0.9.30: browser-local bulk import. No automatic commit before preview/validation.
  const mandatoryImportKeys = () => ELM_FIELDS.filter(f => showEmployeeField('Employee Registration',f.key) && employeeFieldSetting('Employee Registration',f.key).required && f.key !== 'companyId').map(f=>f.key)
  const normalizeImportRow = (raw:Record<string,any>) => {
    const normalized:Record<string,any> = {}
    const aliases:Record<string,string> = { 'employee id':'employeeCode','employee code':'employeeCode','emp id':'employeeCode','emp id no':'employeeCode','full name':'name','employee name':'name','mobile':'phone','mobile number':'phone','designation':'title','department':'dept','joining date':'joiningDate','employment status':'status','branch / factory':'branch' }
    for (const [heading,value] of Object.entries(raw)) {
      const clean=heading.trim().toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ')
      const found=ELM_FIELDS.find(f=>f.key.toLowerCase()===clean || f.name.toLowerCase()===clean)
      const key=aliases[clean] || found?.key
      if(key) normalized[key]=typeof value==='string'?value.trim():value
    }
    if(!normalized.status)normalized.status='Active'
    return normalized
  }
  const validateImport = (rows:any[]) => {
    const errors:Record<number,string[]> = {}
    const seen=new Set<string>()
    rows.forEach((r,i)=>{
      const issues:string[]=[]
      const id=String(r.employeeCode||'').trim().toLowerCase()
      if(!id)issues.push('Employee ID missing')
      if(!String(r.name||'').trim())issues.push('Full name missing')
      if(id && (seen.has(id) || data.employees.some(e=>e.companyId===auth?.companyId && String(e.employeeCode||'').toLowerCase()===id)))issues.push('Duplicate Employee ID')
      if(id)seen.add(id)
      mandatoryImportKeys().forEach(key=>{if(!String(r[key]??'').trim() && !issues.some(x=>x.includes(key)))issues.push(`${ELM_FIELDS.find(f=>f.key===key)?.name||key} required`)})
      if(r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(r.email)))issues.push('Invalid email')
      if(r.joiningDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(r.joiningDate)))issues.push('Joining date must be YYYY-MM-DD')
      if(issues.length)errors[i]=[...new Set(issues)]
    })
    setImportErrors(errors)
    return errors
  }
  const readEmployeeImport = async(file:File) => {
    if(!/\.(csv|xlsx)$/i.test(file.name)){message.error('Choose CSV or XLSX');return}
    if(file.size>5*1024*1024){message.error('Maximum 5 MB per file in this demo');return}
    try {
      const workbook=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false})
      const raw=XLSX.utils.sheet_to_json<Record<string,any>>(workbook.Sheets[workbook.SheetNames[0]],{defval:''})
      if(!raw.length || raw.length>2000){message.error('Import 1–2,000 rows at a time');return}
      const normalized=raw.map(normalizeImportRow)
      setImportRows(normalized);validateImport(normalized)
      message.info(`${normalized.length} rows loaded for review; nothing imported yet.`)
    } catch {message.error('Could not read the file. Check its format and headings.')}
  }
  const commitEmployeeImport = () => {
    if(!auth?.companyId || !['hr','company'].includes(auth.role))return
    const errors=validateImport(importRows)
    if(Object.keys(errors).length){message.error('Correct validation errors before importing. No rows were imported.');return}
    if(!importRows.length)return
    const now=Date.now()
    const rows=importRows.map((r,i)=>({...r,id:`IMP-${now}-${i}`,companyId:auth.companyId,employeeCode:String(r.employeeCode).trim(),name:String(r.name).trim(),email:String(r.email||'').toLowerCase(),createdAt:new Date().toISOString(),recordSource:'Browser CSV/XLSX import'}))
    setData(prev=>({...prev,employees:[...prev.employees,...rows]}))
    addAudit('Imported employee records',`${rows.length} employees for ${auth.companyId}`)
    setImportRows([]);setImportErrors({});message.success(`${rows.length} employee records imported into the browser demo.`)
  }
  const downloadImportTemplate = () => {
    const fields=ELM_FIELDS.filter(f=>showEmployeeField('Employee Registration',f.key) && f.key!=='companyId')
    const headers=fields.map(f=>f.key)
    const ws=XLSX.utils.aoa_to_sheet([headers,headers.map(k=>({employeeCode:'EMP-0001',name:'Sample Employee',joiningDate:'2026-11-03',status:'Active'} as Record<string,string>)[k]||'')])
    const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Employees');XLSX.writeFile(wb,'ELM_Employee_Import_Template.xlsx')
  }
  const readEmployeePhotos = async(files:FileList|null) => {
    if(!files||!auth?.companyId)return
    setPhotoBusy(true)
    setPhotoProcessed(0)
    const out:{name:string;employeeCode:string;status:string;dataUrl?:string}[]=[]
    const selected = Array.from(files).slice(0,100)
    for(const file of selected){
      const code=file.name.replace(/\.[^.]+$/,'').trim()
      const match=data.employees.find(e=>e.companyId===auth.companyId && String(e.employeeCode||'').toLowerCase()===code.toLowerCase())
      if(!match){out.push({name:file.name,employeeCode:code,status:'Employee ID not found'});continue}
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)){out.push({name:file.name,employeeCode:code,status:'Invalid image type'});continue}
      if(file.size>3*1024*1024){out.push({name:file.name,employeeCode:code,status:'Image exceeds 3 MB'});continue}
      try {
        const dataUrl=await new Promise<string>((resolve,reject)=>{
          const img=new Image();const url=URL.createObjectURL(file)
          img.onload=()=>{URL.revokeObjectURL(url);if(img.width<120||img.height<120){reject(new Error('Image too small'));return}
            const canvas=document.createElement('canvas');canvas.width=300;canvas.height=300
            const ctx=canvas.getContext('2d');if(!ctx){reject(new Error('Canvas unavailable'));return}
            const side=Math.min(img.width,img.height);ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,300,300)
            resolve(canvas.toDataURL('image/jpeg',0.78))
          };img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Invalid image'))};img.src=url
        })
        out.push({name:file.name,employeeCode:code,status:'Ready',dataUrl})
      } catch {out.push({name:file.name,employeeCode:code,status:'Invalid or too-small image'})}
    }
    setPhotoProcessed(selected.length)
    setPhotoRows(out);setPhotoBusy(false)
  }
  const commitEmployeePhotos = () => {
    const ready=photoRows.filter(r=>r.status==='Ready'&&r.dataUrl)
    if(!ready.length)return
    // Avoid browser storage exhaustion: keep photos separate from main employee dataset.
    try {
      const key=`${TEST_DATA_KEY}:employee-photos:${auth?.companyId}`
      const existing=JSON.parse(localStorage.getItem(key)||'{}')
      ready.forEach(r=>{existing[r.employeeCode]=r.dataUrl})
      localStorage.setItem(key,JSON.stringify(existing))
      addAudit('Uploaded employee profile photos',`${ready.length} photos`)
      setPhotoRows([]);setPhotoRevision(v=>v+1);message.success(`${ready.length} resized photos saved for this browser demo.`)
    } catch {message.error('Browser storage limit reached. Use fewer photos; production needs server/object storage.')}
  }
  const enrollmentGroups = ['Identity','Personal & contact','Employment & organization','Compensation & statutory','Attendance & work schedule','Family & emergency','Other & lifecycle']
  const enrollmentGroup = (f:typeof ELM_FIELDS[number]) => {
    if(['employeeCode','name','companyId'].includes(f.key))return 'Identity'
    const g=f.group.toLowerCase()
    if(/personal|contact|identity/.test(g))return 'Personal & contact'
    if(/organization|employment|workplace/.test(g))return 'Employment & organization'
    if(/payroll|salary|statutory|bank|compensation/.test(g))return 'Compensation & statutory'
    if(/attendance|shift|schedule|holiday/.test(g))return 'Attendance & work schedule'
    if(/family|emergency|nominee/.test(g))return 'Family & emergency'
    return 'Other & lifecycle'
  }
  const employeeInput = (key:string) => {
    if(key==='gender')return <Select allowClear options={['Male','Female','Other'].map(v=>({label:v,value:v}))}/>
    if(key==='status')return <Select options={['Active','Inactive'].map(v=>({label:v,value:v}))}/>
    if(key==='employmentType')return <Select options={['Permanent','Probation','Contract','Temporary','Casual'].map(v=>({label:v,value:v}))}/>
    if(key==='dept')return <Select showSearch allowClear options={['Production','Cutting','Sewing','Finishing','Quality','Maintenance','HR & Admin','Accounts'].map(v=>({label:v,value:v}))}/>
    if(/date|birthday|dob/i.test(key))return <Input type="date"/>
    if(key==='email')return <Input type="email"/>
    return <Input/>
  }
  const employeePhoto = (employeeCode:string) => {
    void photoRevision
    try {return JSON.parse(localStorage.getItem(`${TEST_DATA_KEY}:employee-photos:${auth?.companyId}`)||'{}')[employeeCode] as string|undefined} catch {return undefined}
  }
  const employeeEnrollmentPage = () => <>
    <div className="page-heading"><div><Title level={2}>Employee Enrollment</Title><Text type="secondary">ELM · Company-specific registration fields grouped into manageable sections</Text></div><Button onClick={()=>go('employees')}>Back to Employee Directory</Button></div>
    <Card><Form form={employeeForm} layout="vertical" onFinish={createEmployee} initialValues={{status:'Active',employmentType:'Permanent'}}>
      <Tabs activeKey={enrollmentTab} onChange={setEnrollmentTab} items={enrollmentGroups.map(group=>({key:group,label:group,forceRender:true,children:<>
        <Text type="secondary">Only fields enabled and visible for this company appear here. Required fields are validated when saving.</Text>
        <Row gutter={16} style={{marginTop:16}}>{ELM_FIELDS.filter(f=>enrollmentGroup(f)===group && f.key!=='companyId').map(f=>registrationField(f.key,f.name,employeeInput(f.key),['employeeCode','name','joiningDate','status'].includes(f.key)))}</Row>
      </>}))}/>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}><Button onClick={()=>go('employees')}>Cancel</Button><Button type="primary" htmlType="submit">Save Employee</Button></div>
    </Form></Card>
  </>
  const employeeImportPage = () => <>
    <div className="page-heading"><div><Title level={2}>Bulk Employee Import</Title><Text type="secondary">ELM · CSV / XLSX → Preview → Validate → Confirm</Text></div><Button onClick={()=>go('employees')}>Back to Directory</Button></div>
    <Card><Space wrap><Button onClick={downloadImportTemplate}>Download company template (.xlsx)</Button><label className="ant-btn ant-btn-default" style={{cursor:'pointer'}}>Select CSV / XLSX<input type="file" accept=".csv,.xlsx" style={{display:'none'}} onChange={e=>{const file=e.target.files?.[0];if(file)void readEmployeeImport(file);e.target.value=''}}/></label></Space>
    <p><Text type="secondary">Template uses field keys from the selected company's enabled registration fields. Maximum 2,000 rows / 5 MB. No import occurs before confirmation. Dates: YYYY-MM-DD.</Text></p>
    {importRows.length>0&&<><Space><Tag color="blue">{importRows.length} rows</Tag><Tag color={Object.keys(importErrors).length?'red':'green'}>{Object.keys(importErrors).length} rows with errors</Tag></Space>
    <Table style={{marginTop:12}} size="small" rowKey={(_,i)=>String(i)} pagination={{pageSize:10}} scroll={{x:900}} dataSource={importRows.map((r,i)=>({...r,__index:i}))} columns={[{title:'Row',dataIndex:'__index',render:v=>v+2},{title:'Employee ID',dataIndex:'employeeCode'},{title:'Name',dataIndex:'name'},{title:'Department',dataIndex:'dept'},{title:'Joining date',dataIndex:'joiningDate'},{title:'Validation',render:(_,r)=>(importErrors[r.__index]||[]).length?<Tag color="red">{importErrors[r.__index].join('; ')}</Tag>:<Tag color="green">Ready</Tag>}]} />
    <Button type="primary" disabled={!!Object.keys(importErrors).length} onClick={commitEmployeeImport}>Confirm import ({importRows.length})</Button> <Button onClick={()=>{setImportRows([]);setImportErrors({})}}>Clear preview</Button></>}
    </Card>
  </>
  const employeePhotosPage = () => {
    const ready=photoRows.filter(r=>r.status==='Ready')
    const rejected=photoRows.filter(r=>r.status!=='Ready')
    const stage=photoBusy?1:photoRows.length?2:0
    return <>
      <div className="page-heading"><div><Title level={2}>Bulk Profile Photo Upload</Title><Text type="secondary">ELM · Employee photo import wizard</Text></div><Button onClick={()=>go('employees')}>Back to Directory</Button></div>
      <Card>
        <Steps size="small" current={stage} items={[{title:'Select Photos'},{title:'Validate & Match'},{title:'Review'},{title:'Confirm Upload'}]} style={{marginBottom:24}}/>
        <Alert type="info" showIcon message="Prepare your photos" description="Name each photo using its exact Employee ID (e.g. EMP-0001.jpg). JPEG, PNG or WebP; max 3 MB each; minimum 120 × 120 px; up to 100 photos. The demo center-crops images to 300 × 300 px." style={{marginBottom:16}}/>
        <input ref={photoFileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{display:'none'}} onChange={e=>{void readEmployeePhotos(e.target.files);e.target.value=''}} />
        <Space wrap>
          <Button type="primary" icon={<CloudUploadOutlined/>} loading={photoBusy} onClick={()=>photoFileRef.current?.click()}>{photoRows.length?'Select another batch':'Choose Photos'}</Button>
          {!!photoRows.length&&<Button onClick={()=>{setPhotoRows([]);setPhotoProcessed(0)}}>Clear Batch</Button>}
        </Space>
        {photoBusy&&<div style={{marginTop:16}}><Text>Validating and resizing photos…</Text><Progress percent={30} status="active" /></div>}
        {!!photoRows.length&&<>
          <div style={{marginTop:20,marginBottom:12}}><Space wrap><Tag color="blue">{photoProcessed} selected</Tag><Tag color="green">{ready.length} matched and ready</Tag><Tag color={rejected.length?'red':'default'}>{rejected.length} rejected</Tag></Space></div>
          <Table size="small" rowKey={(r)=>r.name+'-'+r.employeeCode} pagination={{pageSize:10}} scroll={{x:650}} dataSource={photoRows} columns={[
            {title:'Preview',width:76,render:(_,r)=>r.dataUrl?<Avatar shape="square" size={48} src={r.dataUrl}/>:<Text type="secondary">—</Text>},
            {title:'Filename',dataIndex:'name'},
            {title:'Employee ID',dataIndex:'employeeCode'},
            {title:'Validation result',dataIndex:'status',render:v=><Tag color={v==='Ready'?'green':'red'}>{v}</Tag>}
          ]}/>
          {rejected.length>0&&<Alert type="warning" showIcon message={`${rejected.length} photo(s) cannot be imported`} description="Correct the filename, employee record, format, size or dimensions and select a new batch. Only matched photos can be saved." style={{marginBottom:16}}/>}
          <Space wrap><Button type="primary" disabled={photoBusy||!ready.length} onClick={commitEmployeePhotos}>Confirm & Save {ready.length} Photos</Button><Text type="secondary">Review the matches before confirming.</Text></Space>
        </>}
        <div style={{marginTop:16}}><details><summary style={{cursor:'pointer'}}>Prototype storage notes</summary><p>Photos are saved in this browser only. Large batches may exceed browser storage. Production requires authenticated server uploads, object storage, virus scanning and audit records.</p></details></div>
      </Card>
    </>
  }
  const updateLeave = (id: string, decision: 'Approved' | 'Rejected') => {
    const request = (data.leave || []).find(l => l.id === id)
    if (!request) return
    if (auth?.role === 'manager') {
      const steps = [{ level: 1, role: 'Reporting Manager', status: decision, actor: auth.persona, at: new Date().toLocaleString() }, { level: 2, role: 'HR Manager', status: decision === 'Approved' ? 'Waiting' : 'Not required' }]
      setData(prev => ({ ...prev, leave: (prev.leave || []).map(l => l.id === id ? { ...l, status: decision === 'Approved' ? 'Pending Level 2 approval' : 'Rejected at Level 1', approvalSteps: steps } : l) }))
      addAudit(`Level 1 leave ${decision.toLowerCase()}`, id)
      message.success(decision === 'Approved' ? 'Level 1 approved. Forwarded to HR Manager.' : 'Leave request rejected at Level 1.')
      return
    }
    const balance = (data.leaveBalances || []).find(b => (b.employeeId === request.employeeId || b.employeeName === request.employee) && b.type === request.type)
    if (decision === 'Approved' && (!balance || Number(balance.remaining) < Number(request.days))) { message.error('Cannot approve: HR must record a sufficient leave balance first.'); return }
    if (decision === 'Approved' && balance) setData(prev => ({ ...prev, leaveBalances: (prev.leaveBalances || []).map(b => b === balance ? { ...b, used: Number(b.used) + Number(request.days), remaining: Number(b.remaining) - Number(request.days) } : b) }))
    setData(prev => ({ ...prev, leave: (prev.leave || []).map(l => l.id === id ? { ...l, status: decision === 'Approved' ? 'Approved' : 'Rejected', approvalSteps: [{ level: 1, role: 'Reporting Manager', status: 'Approved', actor: 'Demo Reporting Manager' }, { level: 2, role: 'HR Manager', status: decision, actor: auth?.persona, at: new Date().toLocaleString() }] } : l) }))
    addAudit(`Level 2 leave ${decision.toLowerCase()}`, id)
    message.success(`Leave request ${decision.toLowerCase()}.`)
  }
  const recordBalance = (values: any) => {
    const employee = data.employees.find(e => e.id === values.employeeId)
    const entitled = Number(values.entitled || 0), used = Number(values.used || 0)
    if (used > entitled) { message.error('Used days cannot exceed entitlement.'); return }
    const existing = (data.leaveBalances || []).some(b => b.employeeId === values.employeeId && b.type === values.type)
    if (existing) { message.error('A balance already exists for this employee and leave type.'); return }
    const row = { ...values, employeeName: employee?.name || values.employeeId, entitled, used, remaining: entitled-used, recordedBy: auth?.persona || 'HR Manager' }
    setData(prev => ({ ...prev, leaveBalances: [...(prev.leaveBalances || []), row] }))
    addAudit('Recorded leave balance', `${row.employeeName} · ${row.type}`)
    setBalanceOpen(false); balanceForm.resetFields(); message.success('Leave balance recorded.')
  }
  const activeShiftPolicy = shiftPolicies[auth?.companyId || ''] || { assignmentMethod: 'hybrid', approvalRequired: false, approvalLevels: 1, level1Role: 'hr', level2Role: 'company', weeklyOffDays: [5], employeeFutureVisible: true, scheduleResolution: 'configured' }
  const saveShiftPolicy = (values:any) => {
    if (!auth?.companyId) return
    setShiftPolicies(prev => ({ ...prev, [auth.companyId]: { ...prev[auth.companyId], ...values, updatedAt: new Date().toISOString(), updatedBy: auth.persona } }))
    addAudit('Updated shift & roster policy', `${values.assignmentMethod} · approval ${values.approvalRequired ? 'required' : 'not required'}`)
    message.success('Company shift & roster policy saved.')
  }
  const requestRosterApproval = (ids:string|string[]) => {
    const selected = Array.isArray(ids) ? ids : [ids]
    const drafts = rosters.filter(r => r.companyId === auth?.companyId && selected.includes(r.id) && r.status === 'Draft')
    if (!drafts.length) { message.warning('Select Draft roster entries to submit.'); return }
    const now = new Date().toISOString()
    setRosters(prev => prev.map(r => drafts.some(d => d.id === r.id) ? { ...r, status: 'Pending Approval', submittedAt: now, submittedBy: auth?.persona, submittedByEmail: auth?.email } : r))
    setSelectedRosterIds([]); addAudit('Submitted roster for approval', `${drafts.length} entries`)
    message.success(`${drafts.length} roster entries submitted for approval.`)
  }
  const approveRoster = (ids:string|string[]) => {
    const selected = Array.isArray(ids) ? ids : [ids]
    const pending = rosters.filter(r => r.companyId === auth?.companyId && selected.includes(r.id) && ['Pending Approval','Pending Level 2'].includes(r.status))
    if (!pending.length) { message.warning('Select Pending Approval entries.'); return }
    // Never mix approval stages in one decision; validate every selected record first.
    if (new Set(pending.map(r => r.status)).size > 1) { message.error('Approve Level 1 and Level 2 roster requests separately.'); return }
    if (pending.some(r => r.submittedByEmail ? String(r.submittedByEmail).toLowerCase() === String(auth?.email || '').toLowerCase() : r.submittedBy === auth?.persona)) { message.error('You cannot approve a roster request you submitted.'); return }
    if (pending.some(r => r.status === 'Pending Level 2' && r.level1ApprovedByEmail && String(r.level1ApprovedByEmail).toLowerCase() === String(auth?.email || '').toLowerCase())) { message.error('Level 2 must be reviewed by a different account.'); return }
    const conflicts = pending.filter(r => rosters.some(o => o.companyId === r.companyId && o.employeeId === r.employeeId && o.date === r.date && o.id !== r.id && o.status === 'Published'))
    const conflictIds = new Set(conflicts.map(r => r.id)), now = new Date().toISOString()
    const twoLevels=Number(activeShiftPolicy.approvalLevels||1)===2; const levelOne=pending.filter(r=>r.status==='Pending Approval'); const levelTwo=pending.filter(r=>r.status==='Pending Level 2');
    if(levelOne.length && (auth?.role!==activeShiftPolicy.level1Role || (activeShiftPolicy.level1ApproverEmail && auth?.email.toLowerCase()!==String(activeShiftPolicy.level1ApproverEmail).toLowerCase()))){message.error('Your account is not authorized for the configured Level 1 roster approval.');return}
    if(levelTwo.length && (auth?.role!==activeShiftPolicy.level2Role || (activeShiftPolicy.level2ApproverEmail && auth?.email.toLowerCase()!==String(activeShiftPolicy.level2ApproverEmail).toLowerCase()))){message.error('Your account is not authorized for the configured Level 2 roster approval.');return} const publishIds=twoLevels?levelTwo.map(r=>r.id):levelOne.map(r=>r.id); const nextLevelIds=twoLevels?levelOne.map(r=>r.id):[]
    setRosters(prev => prev.map(r => { if(nextLevelIds.includes(r.id)) return {...r,status:'Pending Level 2',level1ApprovedAt:now,level1ApprovedBy:auth?.persona,level1ApprovedByEmail:auth?.email}; if(publishIds.includes(r.id)&&!conflictIds.has(r.id)) return {...r,status:'Published',approvedAt:now,approvedBy:auth?.persona,level2ApprovedAt:twoLevels?now:undefined,level2ApprovedBy:twoLevels?auth?.persona:undefined,publishedAt:now,publishedBy:auth?.persona,shiftSnapshot:r.shiftSnapshot||(()=>{const sh=shiftRecords.find(x=>x.id===r.shiftId);return sh?{name:sh.name,start:sh.start,end:sh.end,breakMin:sh.breakMin,lateGrace:sh.lateGrace,earlyGrace:sh.earlyGrace}:null})()}; return r }))
    setSelectedRosterIds([]); addAudit('Reviewed roster approval stage', `${nextLevelIds.length} moved to level 2; ${publishIds.length-conflicts.length} published; ${conflicts.length} conflicts`)
    message.info(`${nextLevelIds.length} sent to Level 2; ${publishIds.length-conflicts.length} published; ${conflicts.length} skipped due to Published conflicts.`)
  }
  const setDefaultEmployeeShift = (employeeId:string, shiftId:string, effectiveFrom:string) => {
    const emp=shiftEmployees.find(e=>e.id===employeeId), sh=shiftRecords.find(x=>x.id===shiftId&&x.companyId===auth?.companyId&&x.status==='Active')
    if(!emp||!sh||!effectiveFrom){message.error('Choose an employee, active shift and effective date.');return}
    const existingDefaults=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===employeeId&&a.isDefault&&a.status==='Active'&&!a.effectiveTo);if(existingDefaults.some(a=>a.effectiveFrom>=effectiveFrom)){message.error('New default effective date must be later than the current default start date.');return}
    const open=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===employeeId&&a.isDefault&&a.status==='Active'&&!a.effectiveTo)
    setAssignments(prev=>prev.map(a=>open.some(x=>x.id===a.id)?{...a,effectiveTo:new Date(new Date(effectiveFrom+'T00:00:00').getTime()-86400000).toISOString().slice(0,10),status:'Superseded'}:a).concat([{id:`DEF-${Date.now()}`,companyId:auth?.companyId,employeeId,employeeName:emp.name,shiftId,effectiveFrom,effectiveTo:'',status:'Active',isDefault:true,createdAt:new Date().toISOString(),createdBy:auth?.persona}]))
    addAudit('Changed employee default shift',`${emp.name} · ${sh.name} from ${effectiveFrom}`); message.success('Default shift saved with effective-date history.')
  }
  const defaultShiftProtected = (employeeId:string, from:string, to?:string) => rosters.some(r=>r.companyId===auth?.companyId&&r.employeeId===employeeId&&r.date>=from&&(!to||r.date<=to)&&['Published','Locked','Approved'].includes(r.status))
  const changeDefaultShift = (row:any, shiftId:string, effectiveFrom:string) => {
    if(!row||row.companyId!==auth?.companyId||row.status!=='Active'||!row.isDefault){message.error('Only active company default shifts can be changed.');return}
    if(!shiftRecords.some(x=>x.id===shiftId&&x.companyId===auth?.companyId&&x.status==='Active')){message.error('Select an active company shift.');return}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)||effectiveFrom<=row.effectiveFrom){message.error('Change date must be later than the current effective-from date.');return}
    if(defaultShiftProtected(row.employeeId,effectiveFrom)){message.error('Published/locked roster exists from this date. Review roster first; default shift was not changed.');return}
    const previousDay=new Date(new Date(effectiveFrom+'T00:00:00').getTime()-86400000).toISOString().slice(0,10)
    setAssignments(prev=>[...prev.map(a=>a.id===row.id?{...a,effectiveTo:previousDay,status:'Superseded'}:a),{...row,id:`DEF-${Date.now()}`,shiftId,effectiveFrom,effectiveTo:'',status:'Active',createdAt:new Date().toISOString(),createdBy:auth?.persona}])
    addAudit('Changed employee default shift',`${row.employeeName}: ${row.shiftId} → ${shiftId}, effective ${effectiveFrom}`)
    setDefaultEdit(null);message.success('New default saved; previous effective period retained.')
  }
  const deactivateDefaultShift = (row:any) => {
    if(row.companyId!==auth?.companyId||row.status!=='Active'||!row.isDefault)return
    const endDate=new Date().toISOString().slice(0,10)
    if(endDate<row.effectiveFrom){message.error('Future-effective defaults cannot be ended today.');return}
    if(defaultShiftProtected(row.employeeId,endDate)){message.error('Published/locked roster exists. Review roster before deactivating.');return}
    Modal.confirm({title:'Deactivate default shift?',content:'This ends the active default today. Historical records remain available. Published rosters will not be changed.',okText:'Deactivate',okButtonProps:{danger:true},onOk:()=>{setAssignments(prev=>prev.map(a=>a.id===row.id?{...a,effectiveTo:endDate,status:'Inactive'}:a));addAudit('Deactivated employee default shift',`${row.employeeName} · ${row.shiftId}`);message.success('Default shift deactivated; history retained.')}})
  }
  const correctDefaultShift = (row:any, shiftId:string, from:string) => {
    if(row.companyId!==auth?.companyId||row.status!=='Active'||!row.isDefault)return
    if(!shiftRecords.some(x=>x.id===shiftId&&x.companyId===auth?.companyId&&x.status==='Active')||!/^\d{4}-\d{2}-\d{2}$/.test(from)){message.error('Select valid shift and date.');return}
    if(defaultShiftProtected(row.employeeId,from)){message.error('Published/locked roster exists. Cannot correct this default until roster is reviewed.');return}
    if(assignments.some(a=>a.id!==row.id&&a.companyId===auth?.companyId&&a.employeeId===row.employeeId&&a.isDefault&&a.effectiveFrom<= (row.effectiveTo||'9999-12-31')&&(!a.effectiveTo||a.effectiveTo>=from))){message.error('Correction overlaps another default period.');return}
    setAssignments(prev=>prev.map(a=>a.id===row.id?{...a,shiftId,effectiveFrom:from,correctedAt:new Date().toISOString(),correctedBy:auth?.persona}:a))
    addAudit('Corrected employee default shift',`${row.employeeName}: ${row.shiftId}/${row.effectiveFrom} → ${shiftId}/${from}`)
    setDefaultEdit(null);message.success('Correction saved; audit entry recorded.')
  }
  const resolveShiftForDate = (employeeId:string,date:string) => {
    const policy=shiftPolicies[auth?.companyId||'']||activeShiftPolicy
    const roster=rosters.find(r=>r.companyId===auth?.companyId&&r.employeeId===employeeId&&r.date===date&&r.status==='Published')
    const assignment=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===employeeId&&a.status!=='Superseded'&&a.effectiveFrom<=date&&(!a.effectiveTo||a.effectiveTo>=date)).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
    const defaultAssignment=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===employeeId&&a.isDefault&&a.effectiveFrom<=date&&(!a.effectiveTo||a.effectiveTo>=date)).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
    const chosen=policy.assignmentMethod==='employee'? (defaultAssignment||assignment) : policy.assignmentMethod==='roster'? roster : (roster||defaultAssignment||assignment)
    if(!chosen)return null
    if(chosen.status==='Off'||chosen.shiftId==='OFF')return {name:'Weekly Off',start:'—',end:'—',source:'Roster'}
    const snapshot=chosen.shiftSnapshot
    const shift=shiftRecords.find(x=>x.id===chosen.shiftId&&x.companyId===auth?.companyId)
    return {...(snapshot||shift),source:chosen===roster?'Published roster':'Employee assignment'}
  }
  const createShiftChangeRequest = (values:any) => {
    const emp=shiftEmployees.find(e=>e.id===values.employeeId), sh=shiftRecords.find(x=>x.id===values.shiftId&&x.companyId===auth?.companyId&&x.status==='Active')
    if(!emp||!sh||!values.effectiveFrom||(values.effectiveTo&&values.effectiveTo<values.effectiveFrom)){message.error('Complete employee, shift and valid effective dates.');return}
    const request={...values,id:`SCR-${Date.now()}`,companyId:auth?.companyId,employeeName:emp.name,shiftName:sh.name,status:'Pending Approval',requestedBy:auth?.persona,requestedAt:new Date().toISOString(),changeType:values.changeType||'Temporary'}
    setShiftChangeRequests(prev=>[request,...prev]);addAudit('Requested shift change',`${emp.name} · ${sh.name}`);message.success('Shift change submitted for approval.')
  }
  const decideShiftChange = (id:string,decision:'Approved'|'Rejected') => {
    const req=shiftChangeRequests.find(x=>x.id===id&&x.companyId===auth?.companyId&&x.status==='Pending Approval'); if(!req)return
    const now=new Date().toISOString()
    setShiftChangeRequests(prev=>prev.map(x=>x.id===id?{...x,status:decision,reviewedBy:auth?.persona,reviewedAt:now}:x))
    if(decision==='Approved'){
      const sh=shiftRecords.find(x=>x.id===req.shiftId&&x.companyId===auth?.companyId)
      if(req.changeType==='Permanent') setDefaultEmployeeShift(req.employeeId,req.shiftId,req.effectiveFrom)
      else setRosters(prev=>{const end=req.effectiveTo||req.effectiveFrom;const rows:any[]=[];for(let d=new Date(`${req.effectiveFrom}T12:00:00`);d<=new Date(`${end}T12:00:00`);d.setDate(d.getDate()+1)){const date=d.toISOString().slice(0,10);if(prev.some(x=>x.companyId===req.companyId&&x.employeeId===req.employeeId&&x.date===date&&x.status==='Published'))continue;rows.push({id:`RO-CHG-${Date.now()}-${date}`,companyId:req.companyId,employeeId:req.employeeId,employeeName:req.employeeName,shiftId:req.shiftId,shiftName:req.shiftName,date,status:'Published',approvedBy:auth?.persona,approvedAt:now,publishedBy:auth?.persona,publishedAt:now,shiftSnapshot:sh?{name:sh.name,start:sh.start,end:sh.end,breakMin:sh.breakMin,lateGrace:sh.lateGrace,earlyGrace:sh.earlyGrace}:null,changeRequestId:id})}return [...prev,...rows]})
    }
    addAudit(`${decision} shift change`,`${req.employeeName} · ${req.shiftName}`);message.success(`Shift change ${decision.toLowerCase()}.`)
  }
  const generateMonthlyRoster = (values:any) => {
    const month=String(values.month||rosterMonth), from=new Date(`${month}-01T12:00:00`), days=new Date(from.getFullYear(),from.getMonth()+1,0).getDate()
    const employees=shiftEmployees.filter(e=>(!values.department||values.department==='All'||(e.dept||e.department)===values.department)&&(!values.branch||values.branch==='All'||e.branch===values.branch))
    if(!employees.length){message.warning('No employees match the selected department/branch.');return}
    let created=0,skipped=0
    const offDays=activeShiftPolicy.weeklyOffDays||[]
    const rows:any[]=[]
    employees.forEach((emp:any)=>{for(let d=1;d<=days;d++){const date=`${month}-${String(d).padStart(2,'0')}`;if(rosters.some(r=>r.companyId===auth?.companyId&&r.employeeId===emp.id&&r.date===date)){skipped++;continue}
      const isOff=offDays.includes(new Date(`${date}T12:00:00`).getDay())||(activeShiftPolicy.holidayDates||[]).includes(date);const def=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===emp.id&&a.isDefault&&a.effectiveFrom<=date&&(!a.effectiveTo||a.effectiveTo>=date)).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
      const first=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===emp.id&&a.effectiveFrom<=date&&(!a.effectiveTo||a.effectiveTo>=date)).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
      const chosen=def||first;const sh=chosen?shiftRecords.find(x=>x.id===chosen.shiftId):null
      if(isOff){rows.push({id:`RO-GEN-${Date.now()}-${emp.id}-${d}`,companyId:auth?.companyId,employeeId:emp.id,employeeName:emp.name,shiftId:'OFF',shiftName:'Weekly Off',date,status:'Draft',shiftSnapshot:{name:'Weekly Off',start:'—',end:'—'},createdAt:new Date().toISOString(),createdBy:auth?.persona});created++;continue}
      if(!sh){skipped++;continue}rows.push({id:`RO-GEN-${Date.now()}-${emp.id}-${d}`,companyId:auth?.companyId,employeeId:emp.id,employeeName:emp.name,shiftId:sh.id,shiftName:sh.name,date,status:'Draft',shiftSnapshot:{name:sh.name,start:sh.start,end:sh.end,breakMin:sh.breakMin,lateGrace:sh.lateGrace,earlyGrace:sh.earlyGrace},createdAt:new Date().toISOString(),createdBy:auth?.persona});created++
    }})
    setRosterMonth(month);setRosters(prev=>[...prev,...rows]);addAudit('Generated monthly roster',`${month}: ${created} created, ${skipped} skipped`);message.info(`${created} Draft roster days created; ${skipped} skipped (existing dates or no assigned shift). Review the saved roster below.`)
  }
  const createShift = (values:any) => {
    const name=String(values.name||'').trim();
    if (shiftRecords.some(s=>s.companyId===auth?.companyId&&s.name.toLowerCase()===name.toLowerCase())) { message.error('A shift with this name already exists.'); return }
    const row={...values,name,id:`${auth?.companyId}-SH-${Date.now()}`,companyId:auth?.companyId,status:'Active',breakMin:Number(values.breakMin||0),lateGrace:Number(values.lateGrace||0),earlyGrace:Number(values.earlyGrace||0)}
    if(row.breakMin<0||row.lateGrace<0||row.earlyGrace<0){message.error('Break and grace values cannot be negative.');return}
    setShiftRecords(prev=>[...prev,row]); addAudit('Created shift',name); shiftForm.resetFields(); message.success('Shift created.')
  }
  const assignmentMonthStatus = (employeeId:string) => {
    const month=rosterMonth, first=month+'-01', last=new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).toISOString().slice(0,10)
    const rows=assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===employeeId&&a.status==='Active'&&a.effectiveFrom<=last&&(!a.effectiveTo||a.effectiveTo>=first))
    if(!rows.length)return {label:'Not assigned',color:'default',detail:'No active assignment for '+month}
    const intervals=rows.map(a=>({from:a.effectiveFrom>first?a.effectiveFrom:first,to:a.effectiveTo&&a.effectiveTo<last?a.effectiveTo:last,shift:shiftRecords.find(sh=>sh.id===a.shiftId)?.name||'Unknown shift'})).sort((a,b)=>a.from.localeCompare(b.from))
    const conflict=intervals.some((a,i)=>i>0&&a.from<=intervals[i-1].to)
    let coveredTo='';for(const r of intervals){if(!coveredTo){if(r.from!==first)break;coveredTo=r.to}else{const next=new Date(coveredTo+'T12:00:00');next.setDate(next.getDate()+1);if(r.from>next.toISOString().slice(0,10))break;if(r.to>coveredTo)coveredTo=r.to}}
    const label=conflict?'Conflict':coveredTo===last?'Assigned':'Partially covered'
    return {label,color:conflict?'red':label==='Assigned'?'green':'orange',detail:intervals.map(r=>r.shift+' ('+r.from+' to '+r.to+')').join('; ')}
  }
  const hasAssignmentConflict = (employeeId:string, from:string, to:string, excludeId?:string) => assignments.some(a=>a.companyId===auth?.companyId&&a.employeeId===employeeId&&a.status==='Active'&&a.id!==excludeId&&(!a.effectiveTo||a.effectiveTo>=from)&&(!to||a.effectiveFrom<=to))
  const assignShift = (values:any) => {
    const emp=shiftEmployees.find(e=>e.id===values.employeeId), sh=shiftRecords.find(x=>x.id===values.shiftId&&x.companyId===auth?.companyId&&x.status==='Active')
    if(!emp||!sh){setShiftAssignResult({type:'error',saved:0,skipped:['Select a valid employee and active shift.']});return}
    const from=String(values.effectiveFrom||''),to=String(values.effectiveTo||'')
    if(!from||(to&&to<from)){setShiftAssignResult({type:'error',saved:0,skipped:['Enter a valid effective date range. End date cannot be before start date.']});return}
    if(hasAssignmentConflict(emp.id,from,to)){setShiftAssignResult({type:'error',saved:0,skipped:[`${emp.name} (${emp.id}): duplicate/overlapping active assignment. Review existing dates before retrying.`]});return}
    setAssignments(prev=>[...prev,{...values,id:`AS-${Date.now()}`,employeeName:emp.name,status:'Active',companyId:auth?.companyId,isDefault:true,createdAt:new Date().toISOString(),createdBy:auth?.persona}]); addAudit('Assigned employee shift',`${emp.name} · ${sh.name}`); singleAssignForm.resetFields(); setShiftAssignResult({type:'success',saved:1,skipped:[]})
  }
  const bulkAssignShift = (values:any) => {
    const ids: string[]=bulkSelectedIds, sh=shiftRecords.find(x=>x.id===values.shiftId&&x.companyId===auth?.companyId&&x.status==='Active')
    const from=String(values.effectiveFrom||''),to=String(values.effectiveTo||'')
    if(!ids.length||!sh||!from||(to&&to<from)){
      setShiftAssignResult({type:'error',saved:0,skipped:['Select employees, an active shift and a valid effective date range.']});return
    }
    let added=0;const skipped:string[]=[];const newRows:any[]=[]
    ids.forEach((id,i)=>{
      const emp=shiftEmployees.find(e=>e.id===id)
      if(!emp){skipped.push(`${id}: employee not found`);return}
      if(hasAssignmentConflict(id,from,to)){skipped.push(`${emp.name} (${id}): duplicate/overlapping active assignment`);return}
      newRows.push({id:`AS-${Date.now()}-${i}`,employeeId:id,employeeName:emp.name,shiftId:sh.id,effectiveFrom:from,effectiveTo:to,status:'Active',companyId:auth?.companyId});added++
    })
    if(newRows.length)setAssignments(prev=>[...prev,...newRows])
    addAudit('Bulk assigned employee shifts',`${added} assigned; ${skipped.length} skipped`)
    setShiftAssignResult({type:skipped.length?(added?'warning':'error'):'success',saved:added,skipped})
    if(added){setBulkSelectedIds([]);bulkAssignForm.resetFields()}
  }
  const createRoster = (values:any) => {
    const emp=shiftEmployees.find(e=>e.id===values.employeeId),sh=shiftRecords.find(x=>x.id===values.shiftId&&x.companyId===auth?.companyId&&x.status==='Active'),date=String(values.date||'')
    if(!emp||!sh||!date){message.error('Select an employee, active shift and work date.');return}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(date+'T12:00:00').getTime())){message.error('Enter a valid roster date.');return}
    if(rosters.some(r=>r.companyId===auth?.companyId&&r.employeeId===emp.id&&r.date===date)){message.error('A roster entry already exists for this employee and date.');return}
    setRosters(prev=>[...prev,{...values,id:`RO-${Date.now()}`,employeeName:emp.name,shiftName:sh.name,status:'Draft',companyId:auth?.companyId,shiftSnapshot:{name:sh.name,start:sh.start,end:sh.end,breakMin:sh.breakMin,lateGrace:sh.lateGrace,earlyGrace:sh.earlyGrace},createdAt:new Date().toISOString(),createdBy:auth?.persona}]); addAudit('Created draft roster',`${emp.name} · ${date}`);rosterForm.resetFields();message.success(`Draft roster saved for ${emp.name} on ${date}. ${activeShiftPolicy.approvalRequired?'Submit for approval.':'Publish the draft to make it available to Attendance.'}`)
  }
  const publishRoster = (ids:string|string[]) => {
    const selected=Array.isArray(ids)?ids:[ids], drafts=rosters.filter(r=>r.companyId===auth?.companyId&&selected.includes(r.id)&&(activeShiftPolicy.approvalRequired?r.status==='Draft':['Draft','Pending Approval','Pending Level 2'].includes(r.status)))
    if(!drafts.length){message.warning('Select Draft or previously pending roster entries to publish.');return}
    if(activeShiftPolicy.approvalRequired){message.error('Company policy requires roster approval. Submit drafts instead.');return}
    if(!['hr','company'].includes(auth?.role||'')){message.error('Only delegated HR Manager / Company Admin can publish directly.');return}
    const conflicts=drafts.filter(r=>rosters.some(o=>o.companyId===r.companyId&&o.employeeId===r.employeeId&&o.date===r.date&&o.id!==r.id&&o.status==='Published'))
    const conflictIds=new Set(conflicts.map(r=>r.id)), now=new Date().toISOString()
    setRosters(prev=>prev.map(r=>drafts.some(d=>d.id===r.id)&&!conflictIds.has(r.id)?{...r,status:'Published',publishedAt:now,publishedBy:auth?.persona,shiftSnapshot:r.shiftSnapshot||(()=>{const sh=shiftRecords.find(x=>x.id===r.shiftId);return sh?{name:sh.name,start:sh.start,end:sh.end,breakMin:sh.breakMin,lateGrace:sh.lateGrace,earlyGrace:sh.earlyGrace}:null})()}:r))
    setSelectedRosterIds([]);addAudit('Published roster entries',`${drafts.length-conflicts.length} published; ${conflicts.length} skipped`)
    message.info(`Published ${drafts.length-conflicts.length}; skipped ${conflicts.length} due to existing Published roster conflicts.`)
  }
  const loadAttendanceUatRoster = (date:string,employeeIds:string[]) => {
    if (!auth?.companyId || !['hr','company'].includes(auth.role)) return
    const companyId=auth.companyId
    const sampleShift={id:'UAT-ATT-DAY',companyId,name:'UAT General Shift',start:'08:00',end:'17:00',breakMin:60,lateGrace:10,earlyGrace:10,status:'Active'}
    setShiftRecords(prev=>prev.some(x=>x.id===sampleShift.id&&x.companyId===companyId)?prev:[...prev,sampleShift])
    const targets=shiftEmployees.filter(e=>employeeIds.includes(e.id)).slice(0,50)
    setRosters(prev=>{
      const existing=new Set(prev.filter(r=>r.companyId===companyId&&r.date===date).map(r=>r.employeeId))
      const added=targets.filter(e=>!existing.has(e.id)).map(e=>({id:`UAT-ATT-${date}-${e.id}`,companyId,employeeId:e.id,employeeName:e.name,shiftId:sampleShift.id,shiftName:sampleShift.name,date,status:'Published',publishedAt:new Date().toISOString(),publishedBy:'UAT sample generator',shiftSnapshot:{name:sampleShift.name,start:sampleShift.start,end:sampleShift.end,lateGrace:sampleShift.lateGrace,earlyGrace:sampleShift.earlyGrace}}))
      return [...prev,...added]
    })
    addAudit('Added UAT attendance roster',`${date}: up to ${targets.length} employees; existing entries preserved`)
  }
  const loadShiftRosterSample = () => {
    const employees = shiftEmployees.slice(0, 8)
    if (employees.length < 2) { message.warning('Load at least two employee records before adding the sample roster.'); return }
    const companyId = auth?.companyId
    const sampleShifts = [
      {id:'SAMPLE-DAY',companyId,name:'General Day Shift',start:'08:00',end:'17:00',breakMin:60,lateGrace:10,earlyGrace:10,status:'Active'},
      {id:'SAMPLE-A',companyId,name:'Production A Shift',start:'07:00',end:'15:00',breakMin:45,lateGrace:5,earlyGrace:5,status:'Active'},
      {id:'SAMPLE-B',companyId,name:'Production B Shift',start:'15:00',end:'23:00',breakMin:45,lateGrace:5,earlyGrace:5,status:'Active'},
      {id:'SAMPLE-NIGHT',companyId,name:'Production Night Shift',start:'23:00',end:'07:00',breakMin:45,lateGrace:5,earlyGrace:5,status:'Active'}
    ]
    const month = rosterMonth || new Date().toISOString().slice(0,7)
    const dates = [1,2,3,4].map(day=>`${month}-${String(day).padStart(2,'0')}`)
    const rows = employees.slice(0,6).flatMap((emp,i)=>dates.slice(0,2).map((date,j)=>{
      const shift = sampleShifts[(i+j)%sampleShifts.length]
      const published = (i+j)%3 !== 0
      return {id:`SAMPLE-RO-${month}-${i}-${j}`,companyId,employeeId:emp.id,employeeName:emp.name,shiftId:shift.id,shiftName:shift.name,date,status:published?'Published':'Draft',...(published?{publishedAt:new Date(`${date}T06:00:00`).toISOString(),publishedBy:'HR Manager (Sample)'}:{})}
    })).filter(row=>!rosters.some(existing=>existing.companyId===companyId&&existing.employeeId===row.employeeId&&existing.date===row.date&&!String(existing.id).startsWith('SAMPLE-')))
    setShiftRecords(prev=>[...prev.filter(s=>s.companyId!==companyId||!String(s.id).startsWith('SAMPLE-')), ...sampleShifts])
    setAssignments(prev=>[...prev.filter(a=>a.companyId!==companyId||!String(a.id).startsWith('SAMPLE-')), ...employees.slice(0,6).map((emp,i)=>({id:`SAMPLE-AS-${i}`,companyId,employeeId:emp.id,employeeName:emp.name,shiftId:sampleShifts[i%sampleShifts.length].id,effectiveFrom:`${month}-01`,effectiveTo:'',status:'Active'}))])
    setRosters(prev=>[...prev.filter(r=>r.companyId!==companyId||!String(r.id).startsWith('SAMPLE-')), ...rows])
    setSelectedRosterIds([])
    message.success(`Sample loaded: ${sampleShifts.length} shifts, ${Math.min(employees.length,6)} assignments and ${rows.length} roster entries for ${month}.`)
  }
  const toggleShiftStatus = (id:string) => {setShiftRecords(prev=>prev.map(s=>s.id===id&&s.companyId===auth?.companyId?{...s,status:s.status==='Active'?'Inactive':'Active'}:s));addAudit('Changed shift status',id);message.success('Shift status updated.')}

  // Apply approved future-dated changes only when the effective date arrives and the company record still exists.
  useEffect(()=>{
    const today=new Date().toISOString().slice(0,10)
    const due=lifecycleRequests.filter(r=>r.status==='Approved — Scheduled'&&r.effectiveDate<=today)
    if(!due.length)return
    setData(prev=>({...prev,employees:prev.employees.map(e=>{
      const matching=due.filter(r=>r.employeeId===e.id&&r.companyId===e.companyId).sort((a,b)=>a.effectiveDate.localeCompare(b.effectiveDate))
      return matching.reduce((acc,r)=>({...acc,...r.changes}),e)
    })}))
    setLifecycleRequests(prev=>prev.map(r=>due.some(d=>d.id===r.id)?{...r,status:'Applied',appliedAt:new Date().toISOString(),audit:[...(r.audit||[]),{event:'Applied',actor:'System (prototype)',at:new Date().toISOString(),remarks:'Effective date reached'}]}:r))
  },[lifecycleRequests])

  if (!auth) return <main className="restored-entry-shell"><iframe title="Next HRMS login" src={legacyPath} className="restored-entry-frame" /><div className="login-version-stamp">Next-HRMS v{APP_VERSION} · Phase 1 prototype</div></main>

  const statCard = (label: string, value: string | number, hint: string, icon: ReactNode, onClick?: () => void) => <Card hoverable onClick={onClick} className={`native-stat ${label === 'Total Employee' ? 'employee-stat-total' : label === 'Active' ? 'employee-stat-active' : label === 'Inactive' ? 'employee-stat-inactive' : label === 'New Joiners' ? 'employee-stat-new' : ''}`}><Space align="start"><Avatar size={42} className="stat-avatar" icon={icon} /><div><Text type="secondary">{label}</Text><Title level={3} style={{ margin: '3px 0' }}>{value}</Title><Text type="secondary" className="small-hint">{hint}</Text></div></Space></Card>
  const table = (rows: any[], columns: TableColumnsType<any>, key = 'id') => <Table rowKey={key} size="middle" columns={columns} dataSource={rows} locale={{ emptyText: <Empty description="No records available."/> }} pagination={rows.length ? { defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10','20','50','100'], showTotal: (total,range) => `${range[0]}–${range[1]} of ${total} records` } : false} scroll={{ x: 680 }} />


  const filteredBulkEmployees = shiftEmployees.filter(e => {
    const q = rosterEmployeeSearch.trim().toLowerCase()
    return (!q || [e.name,e.id,e.dept,e.branch,e.unit,e.floor,e.lineInfo].some(v=>String(v||'').toLowerCase().includes(q)))
      && (!bulkDept || e.dept===bulkDept) && (!bulkUnit || e.unit===bulkUnit)
      && (!bulkBranch || e.branch===bulkBranch) && (!bulkFloor || e.floor===bulkFloor)
      && (!bulkLine || e.lineInfo===bulkLine)
  })
  const uniqueField = (field:string) => [...new Set(shiftEmployees.map(e=>e[field]).filter(Boolean))].sort().map(v=>({label:String(v),value:String(v)}))
  const downloadShiftTemplate = (format:'csv'|'xlsx') => {
    const rows = [
      {employeeId:'VTL-EMP-061357',shiftName:'Production A Shift',effectiveFrom:'2026-11-01',effectiveTo:''},
      {employeeId:'VTL-EMP-062711',shiftName:'Production B Shift',effectiveFrom:'2026-11-01',effectiveTo:''}
    ]
    const ws=XLSX.utils.json_to_sheet(rows)
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Shift Assignments')
    if(format==='csv') XLSX.writeFile(wb,'hrms-shift-assignment-template.csv',{bookType:'csv'})
    else XLSX.writeFile(wb,'hrms-shift-assignment-template.xlsx')
  }
  const importShiftFile = async (file:File) => {
    try {
      const bytes=await file.arrayBuffer()
      const wb=XLSX.read(bytes,{type:'array'})
      const rows:any[]=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''})
      let added=0; const errors:string[]=[]
      rows.forEach((r,i)=>{
        const employeeId=String(r.employeeId||r.EmployeeID||r['Employee ID']||'').trim()
        const shiftName=String(r.shiftName||r['Shift Name']||'').trim()
        const from=String(r.effectiveFrom||r['Effective From']||'').slice(0,10)
        const to=String(r.effectiveTo||r['Effective To']||'').slice(0,10)
        const emp=shiftEmployees.find(e=>e.id===employeeId)
        const sh=shiftRecords.find(x=>x.companyId===auth?.companyId&&x.status==='Active'&&x.name.toLowerCase()===shiftName.toLowerCase())
        if(!emp||!sh||!from|| (to&&to<from) || hasAssignmentConflict(employeeId,from,to||'9999-12-31')) { errors.push(`Row ${i+2}: employee/active shift/date missing or assignment conflict`); return }
        setAssignments(prev=>[...prev,{id:`AS-IMP-${Date.now()}-${i}`,employeeId,employeeName:emp.name,shiftId:sh.id,effectiveFrom:from,effectiveTo:to,status:'Active',companyId:auth?.companyId}]); added++
      })
      setShiftAssignResult({type:errors.length?(added?'warning':'error'):'success',saved:added,skipped:errors}); setShiftResultDetailsOpen(false)
    } catch { setShiftAssignResult({type:'error',saved:0,skipped:['Could not read this file. Use the supplied CSV or XLSX template.']}) }
  }
  const fieldConfigPage = () => {
    const companyName = data.companies.find(c => c.id === effectiveConfigCompanyId)?.name || 'No company selected'
    const screenFieldKey = (fieldKey:string) => configScreen === 'Employee Registration' ? fieldKey : `${configScreen}::${fieldKey}`
    const getScreenField = (fieldKey:string):FieldSetting => activeFieldConfig.fields[screenFieldKey(fieldKey)] || activeFieldConfig.fields[fieldKey] || DEFAULT_FIELD
    return <>
      <div className="page-heading"><div><Text type="secondary">COMPANY SETUP · CONFIGURATION</Text><Title level={2}>Field Configuration</Title><Text type="secondary">Select Company → Module → Screen to configure permitted fields. ELM is the first supported catalogue.</Text></div></div>

      <Row gutter={16} className="section-row">
        {auth?.role === 'superadmin' && <Col xs={24} md={8}><Text strong>Company</Text><Select style={{width:'100%',marginTop:6}} value={effectiveConfigCompanyId || undefined} onChange={setConfigCompanyId} options={data.companies.map(c=>({value:c.id,label:`${c.name} (${c.code})`}))}/></Col>}
        <Col xs={24} md={8}><Text strong>Module</Text><Select style={{width:'100%',marginTop:6}} value={configModule} onChange={m=>{setConfigModule(m);setConfigScreen(FIELD_SCREENS[m][0])}} options={FIELD_MODULES.map(m=>({label:m,value:m}))}/></Col>
        <Col xs={24} md={8}><Text strong>Screen</Text><Select style={{width:'100%',marginTop:6}} value={configScreen} onChange={setConfigScreen} options={FIELD_SCREENS[configModule].map(name=>({label:name,value:name}))}/></Col>
      </Row>
      <Card title={`Delegated authority · ${companyName}`} className="section-row">
        <Space direction="vertical" size="middle"><Space><Switch checked={!!activeFieldConfig.delegated.company} disabled={auth?.role !== 'superadmin'} onChange={v=>saveFieldConfig({...activeFieldConfig,delegated:{...activeFieldConfig.delegated,company:v}})}/><Text>Company Admin may configure permitted fields</Text></Space>
        <Space><Switch checked={!!activeFieldConfig.delegated.hr} disabled={auth?.role !== 'superadmin'} onChange={v=>saveFieldConfig({...activeFieldConfig,delegated:{...activeFieldConfig.delegated,hr:v}})}/><Text>HR Admin may configure permitted fields</Text></Space></Space>
        <Alert style={{marginTop:14}} type="warning" message="Delegation applies to this company only. Super Admin retains protected-field control. This is a UI demonstration, not server-side RBAC."/>
      </Card>
      {configModule !== FIELD_MODULES[0] ? <Card><Empty description="This module/screen is available for selection, but its field catalogue is not implemented yet. No settings are applied to this module."/></Card> : <Card title={`ELM — ${configScreen} field matrix`} extra={<Tag color={canConfigureFields?'green':'orange'}>{canConfigureFields?'Editable within scope':'Read only'}</Tag>}>
        <Table size="small" rowKey="key" pagination={{pageSize:15,showSizeChanger:true,pageSizeOptions:[15,30,50,100]}} scroll={{x:760}} dataSource={[...ELM_FIELDS]} columns={[
          {title:'Field',dataIndex:'name',width:215,render:(v:string,r:any)=><Space direction="vertical" size={0}><Text strong>{v}</Text><Text type="secondary" style={{fontSize:12}}>{r.key}</Text></Space>},
          {title:'Category',dataIndex:'group',width:155,filters:[...new Set(ELM_FIELDS.map(f=>f.group))].map(v=>({text:v,value:v})),onFilter:(v:any,r:any)=>r.group===v},
          ...(['enabled','visible','required','editable'] as const).map(prop=>({title:prop[0].toUpperCase()+prop.slice(1),width:100,render:(_:any,r:(typeof ELM_FIELDS)[number])=>{
            const saved=getScreenField(r.key)
            const value=r.protected ? (prop==='enabled'||prop==='visible'||prop==='required' ? true : false) : saved[prop]
            return <Switch size="small" checked={value} disabled={!canConfigureFields || r.protected} onChange={checked=>saveFieldConfig({...activeFieldConfig,fields:{...activeFieldConfig.fields,[screenFieldKey(r.key)]:{...saved,[prop]:checked}}})}/>
          }}))
        ]}/>
        <details style={{marginTop:12}}>
          <summary style={{cursor:'pointer',fontSize:12,color:'#64748b'}}>Prototype notes · {ELM_FIELDS.length} candidate ELM fields</summary>
          <div style={{marginTop:10}}>
            <Alert type="info" showIcon message="Browser-local configuration" description="No backend authorization, API enforcement, migration, or production audit is implemented. Changes do not remove employee data. Protected fields cannot be disabled here. Supported Employee Registration inputs, Employee Profile details and Employee Directory columns now reflect screen settings; other module forms and unmapped fields remain out of scope." />
            <Alert style={{marginTop:8}} type="warning" message="Production limitations" description="Export controls are intentionally hidden. Sensitive-data permissions, validation dependencies, and actual form behavior require backend implementation before production use." />
          </div>
        </details>
      </Card>}
    </>
  }

  const openLifecycle = (employeeId:string) => {
    const emp=scopedEmployees.find(e=>e.id===employeeId)
    if(!emp || !['company','hr'].includes(auth?.role||'')) return
    setLifecycleEmployeeId(employeeId);setLifecycleType('Confirmation');lifecycleForm.resetFields()
    lifecycleForm.setFieldsValue({action:'Confirmation',effectiveDate:new Date().toISOString().slice(0,10)})
    go('employee-lifecycle')
  }
  const submitLifecycle = (values:any) => {
    const emp=scopedEmployees.find(e=>e.id===lifecycleEmployeeId)
    if(!emp || emp.companyId!==auth?.companyId){message.error('Employee is outside your company scope.');return}
    const action=String(values.action)
    const allowed=['Confirmation','Transfer','Promotion','Separation']
    if(!allowed.includes(action)){message.error('Invalid lifecycle action');return}
    const changes:Record<string,string>={}
    if(action==='Confirmation') changes.confirmationStatus='Confirmed'
    if(action==='Transfer') {for(const k of ['branch','dept','unit','floor','lineInfo']) if(String(values[k]||'').trim())changes[k]=String(values[k]).trim()}
    if(action==='Promotion') {for(const k of ['title','grade']) if(String(values[k]||'').trim())changes[k]=String(values[k]).trim()}
    if(action==='Separation') {changes.status='Inactive';changes.separationReason=String(values.reason||'')}
    if(!Object.keys(changes).length){message.error('Enter at least one proposed change');return}
    if(action==='Confirmation' && (emp.confirmationStatus==='Confirmed' || emp.status==='Inactive')){message.error('This employee is already confirmed or inactive.');return}
    if(action==='Separation' && emp.status==='Inactive'){message.error('This employee is already inactive.');return}
    if(['Transfer','Promotion'].includes(action) && emp.status==='Inactive'){message.error('Inactive employees cannot be transferred or promoted.');return}
    if(action==='Transfer' && !Object.keys(changes).some(k=>String(emp[k]||'')!==String(changes[k]))){message.error('Enter a different assignment value.');return}
    if(action==='Promotion' && !Object.keys(changes).some(k=>String(emp[k]||'')!==String(changes[k]))){message.error('Enter a different designation or grade.');return}
    if(!['hr','company'].includes(auth?.role||'')){message.error('Only authorized HR or Company Admin may submit requests.');return}
    const effectiveDate=String(values.effectiveDate||'')
    const validDate=/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate) && !Number.isNaN(Date.parse(effectiveDate)) && new Date(`${effectiveDate}T00:00:00Z`).toISOString().slice(0,10)===effectiveDate
    if(!validDate){message.error('Select a valid effective date.');return}
    const joined=String(emp.joinDate||emp.joiningDate||emp.dateOfJoining||'')
    if(/^\d{4}-\d{2}-\d{2}$/.test(joined)&&effectiveDate<joined){message.error('Effective date cannot precede joining date.');return}
    if(lifecycleRequests.some(r=>r.companyId===emp.companyId&&r.employeeId===emp.id&&['Pending Approval','Approved — Scheduled'].includes(r.status))){message.error('Resolve the existing pending or scheduled lifecycle request first.');return}
    if(action==='Transfer'&&Object.keys(changes).length===0){message.error('Enter at least one new assignment value.');return}
    if(Object.keys(changes).every(k=>String(emp[k]||'')===String(changes[k]))){message.error('Proposed values are unchanged.');return}
    const request={id:`ELM-${Date.now()}`,companyId:emp.companyId,employeeId:emp.id,employeeCode:emp.employeeCode,employeeName:emp.name,action,effectiveDate:String(values.effectiveDate),reason:String(values.reason||''),changes,before:Object.fromEntries(Object.keys(changes).map(k=>[k,emp[k]||''])),status:'Pending Approval',submittedBy:auth?.email,submittedRole:auth?.role,submittedAt:new Date().toISOString(),approvedBy:'',approvedAt:'',decisionRemarks:'',appliedAt:'',audit:[{event:'Submitted',actor:auth?.email,at:new Date().toISOString(),remarks:String(values.reason||'')}]}
    setLifecycleRequests(prev=>[request,...prev]);lifecycleForm.resetFields();message.success('Lifecycle request submitted for approval.');go('employee-lifecycle')
  }
  const reviewLifecycle = (requestId:string,decision:'Approved'|'Rejected') => {
    if(auth?.role!=='company'){message.error('Only Company Admin can approve lifecycle requests in this demo.');return}
    const req=lifecycleRequests.find(r=>r.id===requestId&&r.companyId===auth.companyId&&r.status==='Pending Approval')
    if(!req){message.error('Request is unavailable or already reviewed.');return}
    if(req.submittedBy===auth.email){message.error('The requester cannot approve their own lifecycle request.');return}
    if(decision==='Approved' && lifecycleRequests.some(r=>r.id!==req.id&&r.companyId===req.companyId&&r.employeeId===req.employeeId&&['Pending Approval','Approved — Scheduled'].includes(r.status))){message.error('Resolve conflicting lifecycle requests before approval.');return}
    const decisionRemarks=window.prompt(`${decision} remarks (optional):`)
    if(decisionRemarks===null)return
    const emp=data.employees.find(e=>e.id===req.employeeId&&e.companyId===req.companyId)
    if(!emp){message.error('Employee record not found.');return}
    if(decision==='Approved' && req.effectiveDate<=new Date().toISOString().slice(0,10)){
      setData(prev=>({...prev,employees:prev.employees.map(e=>e.id===req.employeeId&&e.companyId===req.companyId?{...e,...req.changes}:e)}))
    }
    setLifecycleRequests(prev=>prev.map(r=>r.id===requestId?{...r,status:decision==='Rejected'?'Rejected':req.effectiveDate<=new Date().toISOString().slice(0,10)?'Applied':'Approved — Scheduled',approvedBy:auth.email,approvedAt:new Date().toISOString(),decisionRemarks,audit:[...(r.audit||[]),{event:decision,actor:auth.email,at:new Date().toISOString(),remarks:decisionRemarks}],appliedAt:decision==='Approved'&&req.effectiveDate<=new Date().toISOString().slice(0,10)?new Date().toISOString():''}:r))
    message.success(decision==='Rejected'?'Request rejected':req.effectiveDate<=new Date().toISOString().slice(0,10)?'Approved and applied':'Approved for future effective date')
  }
  // Read-only cross-module impact preview. No downstream records are modified in this release.
  const lifecycleImpactRows = (r:any) => {
    const type=String(r.action||'')
    const impacts:Record<string,string[]> = {
      Confirmation:['Review eligibility rules tied to confirmation','Review leave entitlement policy if confirmation-dependent','No automatic roster change','Review probation-related payroll components'],
      Transfer:['Verify punch-device/site and attendance mapping from effective date','Review leave approver and leave calendar ownership','Review shift assignment and published rosters at destination','Review cost center, payroll location and statutory configuration'],
      Promotion:['No attendance changes expected; verify grade-based rules','Review grade-based leave entitlement if configured','Review grade-specific roster rules if configured','Review salary grade and allowances; salary is NOT automatically revised'],
      Separation:['Review punches and attendance cutoff against approved release date','Review leave balance and encashment policy','Review future published roster assignments','Review final payroll and settlement; no automatic calculation']
    }
    return ['Attendance','Leave','Shift / Roster','Payroll'].map((module,i)=>({module,review:(impacts[type]||[])[i]||'Review manually',state:r.status==='Rejected'?'Not applicable':r.status==='Pending Approval'?'Awaiting approval':r.status==='Approved — Scheduled'?'Scheduled review':'Review required'}))
  }
  const employeeLifecyclePage = () => {
    const selected=scopedEmployees.find(e=>e.id===lifecycleEmployeeId)
    const requests=lifecycleRequests.filter(r=>r.companyId===auth?.companyId)
    return <>
      <div className="page-heading"><div><Title level={2}>Employee Lifecycle Actions</Title><Text type="secondary">ELM · Confirmation, transfer, promotion, separation and employment history</Text></div><Button onClick={()=>go('employees')}>Back to Directory</Button></div>
      <Alert type="info" showIcon message="Functional prototype — approval, effective dates and impact review" description="HR Manager submits a company-scoped request; Company Admin reviews it. Approved changes are applied on or after their effective date. No payroll, attendance, leave or roster recalculation is performed."/>
      <Card title="Create lifecycle request" className="section-row">
        <Form form={lifecycleForm} layout="vertical" onFinish={submitLifecycle}>
          <Row gutter={16}>
            <Col xs={24} md={8}><Form.Item label="Employee"><Select showSearch optionFilterProp="label" value={lifecycleEmployeeId||undefined} placeholder="Select employee" onChange={setLifecycleEmployeeId} options={scopedEmployees.map(e=>({value:e.id,label:`${e.employeeCode||e.id} · ${e.name}`}))}/></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item name="action" label="Lifecycle action" rules={[{required:true}]}><Select onChange={setLifecycleType} options={['Confirmation','Transfer','Promotion','Separation'].map(x=>({value:x,label:x}))}/></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item name="effectiveDate" label="Effective date (YYYY-MM-DD)" rules={[{required:true},{pattern:/^\d{4}-\d{2}-\d{2}$/,message:'Use YYYY-MM-DD'}]}><Input type="date"/></Form.Item></Col>
            {lifecycleType==='Transfer'&&<><Col xs={24} md={8}><Form.Item name="branch" label="New branch / factory"><Input/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="dept" label="New department"><Input/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="unit" label="New unit"><Input/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="floor" label="New floor"><Input/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="lineInfo" label="New line"><Input/></Form.Item></Col></>}
            {lifecycleType==='Promotion'&&<><Col xs={24} md={8}><Form.Item name="title" label="New designation" rules={[{required:true}]}><Input/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="grade" label="New grade"><Input/></Form.Item></Col></>}
            <Col xs={24}><Form.Item name="reason" label="Reason / remarks" rules={[{required:lifecycleType==='Separation',message:'Separation reason is required'}]}><Input.TextArea rows={2}/></Form.Item></Col>
          </Row>
          <Button type="primary" htmlType="submit" disabled={!selected||!['company','hr'].includes(auth?.role||'')}>Submit for Approval</Button>
        </Form>
      </Card>
      <Card title="Requests & approval" className="section-row"><Table rowKey="id" size="small" dataSource={requests} pagination={{pageSize:10}} scroll={{x:1050}} columns={[
        {title:'Employee',render:(_,r:any)=>`${r.employeeCode||r.employeeId} · ${r.employeeName}`},
        {title:'Action',dataIndex:'action'},{title:'Effective',dataIndex:'effectiveDate'},
        {title:'Proposed change',render:(_,r:any)=>Object.entries(r.changes||{}).map(([k,v])=>`${k}: ${v}`).join(' · ')},
        {title:'Status',dataIndex:'status',render:(v:string)=><Tag color={v==='Applied'?'green':v==='Rejected'?'red':'gold'}>{v}</Tag>},
        {title:'Review',render:(_,r:any)=>r.status==='Pending Approval'&&auth?.role==='company'?<Space><Button size="small" type="primary" onClick={()=>reviewLifecycle(r.id,'Approved')}>Approve</Button><Button size="small" danger onClick={()=>reviewLifecycle(r.id,'Rejected')}>Reject</Button></Space>:'—'}
      ]}/></Card>
      <Card title="Cross-module impact review (read-only)" className="section-row">
        <Alert type="warning" showIcon message="Manual review only — no downstream updates" description="This preview highlights what HR should check after approval. It does not recalculate attendance, leave, roster, payroll or historical records. Review applies only to requests within the logged-in company." />
        <div style={{marginTop:12}}><Text type="secondary">Select a request below to see module-specific checks. Rejected requests require no follow-up.</Text></div>
        <Table size="small" rowKey="id" pagination={{pageSize:6}} dataSource={requests} columns={[
          {title:'Employee',render:(_:any,r:any)=>`${r.employeeCode||r.employeeId} · ${r.employeeName}`},
          {title:'Change',dataIndex:'action'},
          {title:'Effective',dataIndex:'effectiveDate'},
          {title:'Status',dataIndex:'status'},
          {title:'Impact checklist',render:(_:any,r:any)=><details><summary style={{cursor:'pointer'}}>View checks</summary><Table style={{marginTop:8}} size="small" pagination={false} rowKey="module" dataSource={lifecycleImpactRows(r)} columns={[{title:'Module',dataIndex:'module'},{title:'Review required',dataIndex:'review'},{title:'State',dataIndex:'state'}]}/></details>}
        ]}/>
      </Card>
      <Card title="Employee lifecycle history" className="section-row"><Text type="secondary">All requests remain visible after approval or rejection. Changes are never silently overwritten in the history.</Text><Table size="small" rowKey="id" dataSource={requests.filter(r=>!lifecycleEmployeeId||r.employeeId===lifecycleEmployeeId)} pagination={{pageSize:10}} columns={[{title:'Employee',dataIndex:'employeeName'},{title:'Action',dataIndex:'action'},{title:'Previous values',render:(_,r:any)=>JSON.stringify(r.before)},{title:'New values',render:(_,r:any)=>JSON.stringify(r.changes)},{title:'Effective',dataIndex:'effectiveDate'},{title:'Status',dataIndex:'status'},{title:'Submitted by',dataIndex:'submittedBy'},{title:'Submitted at',dataIndex:'submittedAt',render:(v:string)=>v?new Date(v).toLocaleString():'—'},{title:'Approved by',dataIndex:'approvedBy'},{title:'Decision remarks',dataIndex:'decisionRemarks',render:(v:string)=>v||'—'},{title:'Audit events',render:(_:any,r:any)=>(r.audit||[]).map((a:any)=>`${a.event} · ${a.actor} · ${a.at}${a.remarks?' · '+a.remarks:''}`).join(' | ')}]}/></Card>
    </>
  }
  const pageContent = () => {
    if (!allowedPages(auth.role).includes(page)) return <Alert type="error" message="Access restricted" description="This page is not available to your current role. Return to your dashboard." action={<Button onClick={()=>go(menu[0]?.key || 'overview')}>Dashboard</Button>}/>
    if (page === 'fieldconfig') return fieldConfigPage()
    if (auth.role === 'superadmin') {
      if (page === 'superadmin') return <><div className="page-heading"><div><Text type="secondary">PLATFORM GOVERNANCE</Text><Title level={2}>Superadmin</Title><Text type="secondary">Platform-level tenant lifecycle, module catalogue and policy template responsibilities.</Text></div><Button type="primary" icon={<PlusOutlined/>} onClick={()=>setEnrollOpen(true)}>Enroll company</Button></div><Row gutter={[16,16]}>{statCard('Tenants',data.companies.length,'Created in this session',<BankOutlined/>,()=>go('companies'))}{statCard('Module catalogue',data.modules.length,'Selectable concepts',<AppstoreOutlined/>,()=>go('access'))}{statCard('Policy templates',data.policies.length,'Require company review',<SettingOutlined/>)}{statCard('Audit events',data.audit.length,'Actions in this session',<AuditOutlined/>,()=>go('audit'))}</Row><Row gutter={[16,16]} className="section-row"><Col xs={24} lg={12}><Card title="Platform responsibilities"><Descriptions column={1} size="small"><Descriptions.Item label="Company lifecycle">Draft, activate, suspend and review tenants.</Descriptions.Item><Descriptions.Item label="Module catalogue">Control which modules a tenant may enable.</Descriptions.Item><Descriptions.Item label="Policy templates">Provide starting points, not universal rules.</Descriptions.Item><Descriptions.Item label="Audit and support">Review platform activity with explicit access boundaries.</Descriptions.Item></Descriptions></Card></Col><Col xs={24} lg={12}><Card title="Open a company workspace"><Text type="secondary">Choose an enrolled company to review its company-level setup readiness. This demo does not grant Superadmin HR-record access.</Text><div className="section-row"><Button onClick={()=>go('companies')}>Review tenant directory</Button></div><Alert className="section-row" type="warning" message="Company workspace transition is not enabled from the platform Superadmin role in this React increment."/></Card></Col></Row></>
      if (page === 'overview') return <>
        <div className="page-heading"><div><Text type="secondary">PLATFORM OPERATIONS</Text><Title level={2}>Platform overview</Title><Text type="secondary">Monitor tenant onboarding, enabled modules and platform activity.</Text></div><Button type="primary" icon={<PlusOutlined />} onClick={() => setEnrollOpen(true)}>Enroll company</Button></div>
        <Row gutter={[16, 16]}>{statCard('Company records', data.companies.length, 'Tenant directory', <BankOutlined />, () => go('companies'))}{statCard('Active companies', data.companies.filter(c => c.status === 'Active').length, 'Workspace available', <CheckCircleOutlined />, () => go('companies'))}{statCard('Module catalogue', data.modules.length, 'Available concepts', <AppstoreOutlined />, () => go('access'))}{statCard('Audit events', data.audit.length, 'Actions in this session', <AuditOutlined />, () => go('audit'))}</Row>
        <Row gutter={[16, 16]} className="section-row"><Col xs={24} lg={14}><Card title="Company onboarding pipeline">{data.companies.length ? data.companies.map(c => <div className="progress-row" key={c.id}><Space><b>{c.name}</b><Tag>{c.status}</Tag></Space><Progress percent={c.progress} size="small" /></div>) : <Empty description="No companies enrolled yet. Create the first company to begin."/>}</Card></Col><Col xs={24} lg={10}><Card title="Platform responsibilities"><Descriptions column={1} size="small"><Descriptions.Item label="Tenant lifecycle">Draft, activate, suspend and review companies</Descriptions.Item><Descriptions.Item label="Module catalogue">Control tenant module availability</Descriptions.Item><Descriptions.Item label="Policy templates">Starting points; company review required</Descriptions.Item><Descriptions.Item label="Audit & support">Platform activity with explicit access boundaries</Descriptions.Item></Descriptions><Alert type="warning" showIcon message="Platform boundary" description="Superadmin manages tenants and platform configuration; company HR records remain within company workspaces." /></Card></Col></Row>
        <Card title="Recent platform activity" className="section-row">{table((data.audit || []).slice(0, 6), [{ title: 'Time', dataIndex: 'time' }, { title: 'Actor', dataIndex: 'actor' }, { title: 'Action', dataIndex: 'action' }, { title: 'Target', dataIndex: 'target' }, { title: 'Result', dataIndex: 'result', render: v => <Tag color="green">{v}</Tag> }])}</Card>
      </>
      if (page === 'enrollment') return <><div className="page-heading"><div><Title level={2}>Company enrollment</Title><Text type="secondary">Create a new tenant setup draft using the legacy enrollment sequence.</Text></div><Button type="primary" icon={<PlusOutlined />} onClick={() => setEnrollOpen(true)}>New enrollment</Button></div><Row gutter={[16,16]}>{['Company profile','Organization setup','Modules & policies','Initial admin & access','Review & activate'].map((s,i)=><Col xs={24} sm={12} lg={8} key={s}><Card><Avatar>{i+1}</Avatar><Title level={5}>{s}</Title><Text type="secondary">{['Legal identity and localization','Branch, department and working-week foundation','Choose tenant capabilities','Set the first administrator','Review dependencies before creating tenant'][i]}</Text></Card></Col>)}</Row><Card className="section-row" title="Enrollment draft form"><Form form={form} layout="vertical" onFinish={createCompany}><Row gutter={16}><Col xs={24} md={12}><Form.Item name="name" label="Legal company name" rules={[{required:true}]}><Input /></Form.Item></Col><Col xs={24} md={12}><Form.Item name="code" label="Company code" rules={[{required:true}]}><Input /></Form.Item></Col><Col xs={24} md={12}><Form.Item name="industry" label="Industry" initialValue="Manufacturing"><Select options={['Manufacturing','Services','Retail','Trading','Healthcare','Education','Other'].map(x=>({label:x,value:x}))}/></Form.Item></Col><Col xs={24} md={12}><Form.Item name="modules" label="Modules" initialValue={['Employee Lifecycle Management (ELM)','Organization']}><Select mode="multiple" options={data.modules.map(m=>({label:m.name,value:m.name}))}/></Form.Item></Col><Col span={24}><Form.Item name="branch" label="Primary branch / office" rules={[{required:true}]}><Input /></Form.Item></Col><Col span={24}><Form.Item name="adminEmail" label="Initial administrator email" rules={[{required:true,type:'email'}]}><Input /></Form.Item></Col></Row><Button type="primary" htmlType="submit">Create enrollment draft</Button></Form></Card></>
      if (page === 'companies') return <><div className="page-heading"><div><Title level={2}>Companies</Title><Text type="secondary">Tenant directory, status and setup readiness.</Text></div><Button type="primary" icon={<PlusOutlined />} onClick={() => setEnrollOpen(true)}>Enroll company</Button></div><Input.Search placeholder="Search company name or code" allowClear onChange={e=>setCompanySearch(e.target.value)} style={{maxWidth:360,marginBottom:16}}/><Card>{table(data.companies.filter(c=>(c.name+c.code).toLowerCase().includes(companySearch.toLowerCase())),[{title:'Company',dataIndex:'name',render:(v,r)=><Space direction="vertical" size={0}><b>{v}</b><Text type="secondary">{r.code}</Text></Space>},{title:'Industry',dataIndex:'industry'},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={v==='Active'?'green':'blue'}>{v}</Tag>},{title:'Setup readiness',dataIndex:'progress',render:v=><Progress percent={v} size="small"/>},{title:'Modules',dataIndex:'modules',render:v=><>{v.length} enabled</>},{title:'Workspace',render:()=> <Button size="small" disabled>Open (company admin flow)</Button>}])}</Card></>
      if (page === 'access') return <><div className="page-heading"><div><Title level={2}>Users & roles</Title><Text type="secondary">Illustrative users, role scopes and permission concepts.</Text></div></div><Alert type="warning" showIcon message="Illustrative role catalogue" description="Role names and permission examples require Product Owner approval before production implementation."/><Row gutter={[16,16]} className="section-row"><Col xs={24} lg={12}><Card title="Role test personas">{table(data.users,[{title:'Name',dataIndex:'name'},{title:'Email',key:'email',dataIndex:'email'},{title:'Persona',dataIndex:'persona'},{title:'Role',dataIndex:'role'}])}</Card></Col><Col xs={24} lg={12}><Card title="Illustrative roles">{table(data.roles,[{title:'Role',dataIndex:'name'},{title:'Scope',dataIndex:'scope'},{title:'Capabilities',dataIndex:'perms',render:v=><Space wrap>{v.map((p:string)=><Tag key={p}>{p}</Tag>)}</Space>}], 'name')}</Card></Col></Row><Card title="Module permission matrix" className="section-row">{table(['Company setup','Employees','Attendance','Leave','Payroll','Audit'].map((name,i)=>({id:name,name,view:i!==5,create:i<4,update:i<4,approve:i===2||i===3,finalize:i===4,export:i===5})),[{title:'Module',dataIndex:'name'},{title:'View',dataIndex:'view',render:v=>v?'✓':'—'},{title:'Create',dataIndex:'create',render:v=>v?'✓':'—'},{title:'Update',dataIndex:'update',render:v=>v?'✓':'—'},{title:'Approve',dataIndex:'approve',render:v=>v?'✓':'—'},{title:'Finalize',dataIndex:'finalize',render:v=>v?'✓':'—'},{title:'Export',dataIndex:'export',render:v=>v?'✓':'—'}])}</Card></>
      if (page === 'audit') return <><div className="page-heading"><div><Title level={2}>Platform audit trail</Title><Text type="secondary">Synthetic activity illustrating attributable, reviewable changes.</Text></div><Button icon={<CloudUploadOutlined />} onClick={()=>message.info('CSV export is not connected in this prototype.')}>Export CSV</Button></div><Card>{table(data.audit,[{title:'Time',dataIndex:'time'},{title:'Actor',dataIndex:'actor'},{title:'Action',dataIndex:'action'},{title:'Target',dataIndex:'target'},{title:'Result',dataIndex:'result',render:v=><Tag>{v}</Tag>}])}</Card></>
    }

    if (page === 'companydashboard') return <><div className="page-heading"><div><Text type="secondary">COMPANY WORKSPACE · {company?.code || 'UNCONFIGURED WORKSPACE'}</Text><Title level={2}>Company Dashboard</Title><Text type="secondary">Company-level administration and operational readiness.</Text></div></div><Row gutter={[16,16]}>{statCard('Employees',scopedEmployees.length,'Company records',<TeamOutlined/>,()=>go('employees'))}{statCard('Attendance exceptions',exceptions.length,'Require review',<ClockCircleOutlined/>,()=>go('attendance'))}{statCard('Pending leave',pendingLeaves.length,'Approval queue',<CheckCircleOutlined/>,()=>go('leave'))}{statCard('Shift patterns',shiftRecords.length,'Configured shifts',<CalendarOutlined/>,()=>go('shifts'))}</Row><Row gutter={[16,16]} className="section-row"><Col xs={24} lg={12}><Card title="Company operations">{companyMenu.filter(x=>!['companydashboard'].includes(x.key)).map(x=><Button key={x.key} block type="text" onClick={()=>go(x.key)} style={{textAlign:'left',height:42}}>{x.label} →</Button>)}</Card></Col><Col xs={24} lg={12}><Card title="Company boundary"><Alert type="info" showIcon message="Company Admin workspace" description="Company-level users and configuration are scoped to the selected company. Platform tenant lifecycle remains with Super Admin."/></Card></Col></Row></>
    if (page === 'managerhome') return <><div className="page-heading"><div><Text type="secondary">TEAM OPERATIONS</Text><Title level={2}>Department Manager Dashboard</Title><Text type="secondary">Review your team attendance and pending requests.</Text></div></div><Row gutter={[16,16]}>{statCard('Team members',scopedEmployees.length,'Assigned team scope',<TeamOutlined/>,()=>go('employees'))}{statCard('Attendance exceptions',exceptions.length,'Team events needing review',<ClockCircleOutlined/>,()=>go('attendance'))}{statCard('Leave requests',pendingLeaves.length,'Awaiting review',<CheckCircleOutlined/>,()=>go('leave'))}</Row><Card title="Manager actions" className="section-row"><Space wrap><Button onClick={()=>go('employees')}>View my team</Button><Button onClick={()=>go('attendance')}>Review attendance</Button><Button type="primary" onClick={()=>go('leave')}>Review leave requests</Button></Space></Card></>
    if (page === 'employeehome') return <><Card className="hr-welcome-native" bordered={false}><Text type="secondary">EMPLOYEE SELF SERVICE · {company?.code || 'UNCONFIGURED WORKSPACE'}</Text><Title level={2}>Welcome{currentEmployee ? `, ${currentEmployee.name}` : ''}</Title><Text>{currentEmployee ? 'Your personal HR workspace at a glance.' : 'Your login is not linked to an employee record yet. Ask HR to create an employee record using this login email.'}</Text><div className="section-row"><Space wrap><Button type="primary" onClick={()=>go('myleave')}>Apply for leave</Button><Button onClick={()=>go('myattendance')}>View attendance</Button><Button onClick={()=>go('myroster')}>View roster</Button></Space></div></Card><Row gutter={[16,16]}>{statCard('Leave balance', (data.leaveBalances||[]).filter(b=>b.employeeId===currentEmployee?.id).reduce((n,b)=>n+Number(b.remaining||0),0),'Recorded balance only',<CheckCircleOutlined/>,()=>go('myleave'))}{statCard('Pending requests',pendingLeaves.length,'Leave and HR requests',<ClockCircleOutlined/>,()=>go('myleave'))}{statCard('Published roster',rosters.filter(r=>r.employeeId===currentEmployee?.id&&r.status==='Published').length,'Visible roster entries',<CalendarOutlined/>,()=>go('myroster'))}</Row><Row gutter={[16,16]} className="section-row"><Col xs={24} lg={14}><Card title="My recent requests">{table((data.leave||[]).filter(l=>l.employeeId===currentEmployee?.id),[{title:'Request',dataIndex:'id'},{title:'Type',dataIndex:'type'},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={/approved/i.test(v)?'green':'orange'}>{v}</Tag>}])}</Card></Col><Col xs={24} lg={10}><Card title="Quick services">{employeeMenu.slice(1).map(x=><Button key={x.key} block type="text" onClick={()=>go(x.key)} style={{textAlign:'left'}}>{x.label} →</Button>)}</Card></Col></Row></>
    if (page === 'employeeprofile') return <><div className="page-heading"><div><Title level={2}>My Profile</Title><Text type="secondary">Personal and employment information linked to your employee record.</Text></div></div>{currentEmployee?<><Card><Descriptions bordered column={{xs:1,sm:2}}>{showEmployeeField('Employee Profile','employeeCode') && <Descriptions.Item label="Employee ID">{currentEmployee.employeeCode}</Descriptions.Item>}{showEmployeeField('Employee Profile','name') && <Descriptions.Item label="Name">{currentEmployee.name}</Descriptions.Item>}{showEmployeeField('Employee Profile','email') && <Descriptions.Item label="Email">{currentEmployee.email}</Descriptions.Item>}{showEmployeeField('Employee Profile','title') && <Descriptions.Item label="Designation">{currentEmployee.title||'—'}</Descriptions.Item>}{showEmployeeField('Employee Profile','dept') && <Descriptions.Item label="Department">{currentEmployee.dept||'—'}</Descriptions.Item>}{showEmployeeField('Employee Profile','branch') && <Descriptions.Item label="Branch">{currentEmployee.branch||'—'}</Descriptions.Item>}{showEmployeeField('Employee Profile','status') && <Descriptions.Item label="Employment status">{currentEmployee.status}</Descriptions.Item>}</Descriptions></Card><Card title="Default shift assignment" className="section-row"><Text type="secondary">HR-managed effective-dated default shift. Employee self-service is read-only.</Text><Form layout="inline" onFinish={v=>setDefaultEmployeeShift(currentEmployee.id,v.shiftId,v.effectiveFrom)}><Form.Item name="shiftId" rules={[{required:true}]}><Select placeholder="Select default shift" style={{minWidth:220}} options={shiftRecords.filter(x=>x.companyId===auth?.companyId&&x.status==='Active').map(x=>({label:x.name,value:x.id}))}/></Form.Item><Form.Item name="effectiveFrom" rules={[{required:true}]}><Input type="date"/></Form.Item><Button type="primary" htmlType="submit" disabled={!['hr','company'].includes(auth.role)}>Save default shift</Button></Form><div className="section-row">{table(assignments.filter(a=>a.companyId===auth?.companyId&&a.employeeId===currentEmployee.id&&a.isDefault),[{title:'Shift',render:(_,r)=>shiftRecords.find(x=>x.id===r.shiftId)?.name||'—'},{title:'Effective from',dataIndex:'effectiveFrom'},{title:'Effective to',dataIndex:'effectiveTo',render:v=>v||'Open-ended'},{title:'Recorded by',dataIndex:'createdBy'}])}</div></Card></>:<Empty description="No employee record is linked to this login. Ask HR to create an employee record using your login email."/>}</>
    if (page === 'myattendance') return <><div className="page-heading"><div><Title level={2}>My Attendance</Title><Text type="secondary">Personal punch history and attendance exceptions.</Text></div></div><Row gutter={[16,16]}>{statCard('Punch events',data.punches.filter(p=>p.employeeId===currentEmployee?.id).length,'Linked employee punch events',<ClockCircleOutlined/>)}{statCard('Exceptions',data.punches.filter(p=>p.employeeId===currentEmployee?.id&&!/accepted/i.test(p.status)).length,'Require correction or mapping',<AuditOutlined/>)}</Row><Card title="My punch records" className="section-row">{table(data.punches.filter(p=>p.employeeId===currentEmployee?.id),[{title:'Event',dataIndex:'id'},{title:'Time',dataIndex:'time'},{title:'Device',dataIndex:'device'},{title:'Status',key:'status',dataIndex:'status'}])}<Alert type="info" message="Attendance correction request workflow is a prototype gap; no correction is submitted from this page yet."/></Card></>
    if (page === 'myleave') return <><div className="page-heading"><div><Title level={2}>My Leave</Title><Text type="secondary">Leave balances and request approval progress.</Text></div></div><Row gutter={[16,16]}>{['Annual Leave','Casual Leave','Sick Leave'].map(t=>{const b=(data.leaveBalances||[]).find(x=>x.employeeId===currentEmployee?.id&&x.type===t);return <Col xs={24} md={8} key={t}><Card title={t}><Title level={2}>{b?b.remaining:'—'} days</Title><Text type="secondary">{b?'Available balance':'HR balance record required'}</Text></Card></Col>})}</Row><Card title="My leave requests" className="section-row">{table((data.leave||[]).filter(l=>l.employeeId===currentEmployee?.id),[{title:'Request',dataIndex:'id'},{title:'Leave type',dataIndex:'type'},{title:'Dates',dataIndex:'dates'},{title:'Reason',dataIndex:'reason'},{title:'Approval progress',dataIndex:'approvalSteps',render:v=><Space wrap>{(v||[]).map((x:any)=><Tag key={x.level} color={x.status==='Approved'?'green':'orange'}>L{x.level}: {x.status}</Tag>)}</Space>},{title:'Status',key:'status',dataIndex:'status'}])}</Card><Alert type="warning" className="section-row" message="Leave submission is blocked until HR records the employee's leave balance for the selected leave type."/></>
    if (page === 'myroster') return <><div className="page-heading"><div><Title level={2}>My Monthly Roster</Title><Text type="secondary">Only published shifts are visible to employees.</Text></div><Input type="month" value={rosterMonth} onChange={e=>setRosterMonth(e.target.value)} style={{width:160}}/></div><Card>{table(rosters.filter(r=>r.companyId===auth?.companyId&&r.employeeId===currentEmployee?.id&&r.status==='Published'&&r.date.startsWith(rosterMonth)&&(rosterPrefs.employeeFutureVisible||r.date<=new Date().toISOString().slice(0,10))),[{title:'Date',dataIndex:'date'},{title:'Weekday',render:(_,r)=>new Date(`${r.date}T12:00:00`).toLocaleDateString(undefined,{weekday:'long'})},{title:'Shift',dataIndex:'shiftName'},{title:'Working time',render:(_,r)=>{const s=r.shiftSnapshot||shiftRecords.find(x=>x.id===r.shiftId);return s?`${s.start} – ${s.end}${s.end<=s.start?' (overnight)':''}`:'—'}},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color="green">{v}</Tag>}])}<Alert type="info" message="Draft roster entries are never shown to employees. Published roster visibility follows company preferences."/></Card></>

    if (page === 'hrhome') return <>
      <Card className="hr-welcome-native" bordered={false}><Text type="secondary">COMPANY OPERATIONS · {company?.code || 'UNCONFIGURED WORKSPACE'}</Text><Title level={2}>Good to see you, HR Manager</Title><Text>Here’s your {company?.name || 'your company'} workspace at a glance. Review pending items and continue your team’s HR operations.</Text><div className="scope-label"><Badge status="success" text="Company-scoped access" /></div></Card>
      <Row gutter={[16,16]} className="section-row">{statCard('Employee records', scopedEmployees.length, 'In assigned company snapshot', <TeamOutlined />, ()=>go('employees'))}{statCard('Pending leave requests', pendingLeaves.length, 'Awaiting review or approval', <CalendarOutlined />, ()=>go('leave'))}{statCard('Punch exceptions', exceptions.length, 'Unmapped or rejected punch events', <ClockCircleOutlined />, ()=>go('attendance'))}{statCard('Shift & roster planning', 'Monthly', 'Plan shifts and publish rosters', <CalendarOutlined />, ()=>go('rosterreport'))}</Row>
      <Row gutter={[16,16]} className="section-row"><Col xs={24} lg={14}><Card title="HR workspaces & quick actions"><div className="quick-grid">{hrMenu.slice(1).map(item=><Button key={item.key} className="quick-action" icon={item.icon} onClick={()=>go(item.key)}>{item.label}<span>Open workspace →</span></Button>)}</div></Card></Col><Col xs={24} lg={10}><Card title="Needs your attention">{pendingLeaves.length?pendingLeaves.slice(0,4).map(l=><div className="attention-row" key={l.id}><div><b>{l.employee}</b><div><Text type="secondary">{l.type} · {l.days} day(s) · {l.id}</Text></div></div><Tag color="gold">{l.status}</Tag></div>):<Empty description="No pending leave requests"/>}{exceptions.length>0&&<Alert className="section-row" type="warning" message={`${exceptions.length} attendance exception(s) need review`} action={<Button size="small" onClick={()=>go('attendance')}>Review</Button>}/>}</Card><Alert className="section-row" type="info" showIcon message="Access boundary" description="HR operations are limited to the assigned company. Platform enrollment and platform-wide settings remain restricted."/></Col></Row>
    </>
    if (page === 'employees') {
      const activeCount = scopedEmployees.filter(e => (e.status || 'Active') === 'Active').length
      const inactiveCount = scopedEmployees.length - activeCount
      const newJoiners = scopedEmployees.filter(e => e.joiningDate && e.joiningDate >= new Date(Date.now()-30*86400000).toISOString().slice(0,10)).length
      const departments = [...new Set(scopedEmployees.map(e=>e.dept).filter(Boolean))]
      const designations = [...new Set(scopedEmployees.map(e=>e.title).filter(Boolean))]
      const filteredEmployees = scopedEmployees.filter(e => {
        const q = employeeSearch.toLowerCase()
        const searchMatch = `${e.name||''} ${e.employeeCode||''} ${e.email||''} ${e.phone||''} ${e.dept||''} ${e.title||''}`.toLowerCase().includes(q)
        return searchMatch && (employeeStatusFilter==='All' || (e.status||'Active')===employeeStatusFilter) && (employeeDeptFilter==='All' || e.dept===employeeDeptFilter) && (employeeDesignationFilter==='All' || e.title===employeeDesignationFilter)
      })
      return <>
        <div className="page-heading">
          <div><Title level={2}>Employee Lifecycle Management</Title><Text type="secondary">ELM · Employee Directory</Text></div>
          <Space wrap>
            <Button onClick={()=>message.info('Grid view is planned; list view is the current prototype view.')}>Grid view</Button>
            <Button onClick={()=>{const rows=filteredEmployees.map(e=>Object.fromEntries(([['employeeCode','EmployeeID',e.employeeCode],['name','Name',e.name],['email','Email',e.email],['phone','Phone',e.phone],['title','Designation',e.title],['dept','Department',e.dept],['branch','Branch',e.branch],['unit','Unit',e.unit],['floor','Floor',e.floor],['lineInfo','Line',e.lineInfo],['joiningDate','JoiningDate',e.joiningDate],['status','Status',e.status]] as any[]).filter(([key])=>showEmployeeField('Employee Directory',key)).map(([,label,value])=>[label,value||''])));const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Employees');XLSX.writeFile(wb,'employee-list.xlsx')}}>Export Excel</Button>
            {['hr','company'].includes(auth.role)&&<><Button onClick={()=>go('employee-import')}>Import CSV / XLSX</Button><Button onClick={()=>go('employee-photos')}>Bulk Photos</Button><Button onClick={()=>{setLifecycleEmployeeId('');setLifecycleType('Confirmation');lifecycleForm.resetFields();lifecycleForm.setFieldsValue({action:'Confirmation',effectiveDate:new Date().toISOString().slice(0,10)});go('employee-lifecycle')}}>Lifecycle Actions</Button><Button type="primary" icon={<PlusOutlined/>} onClick={()=>{employeeForm.resetFields();employeeForm.setFieldsValue({status:'Active',employmentType:'Permanent'});setEnrollmentTab('Identity');go('employee-enrollment')}}>Add Employee</Button></>}
          </Space>
        </div>
        {scopedEmployees.some(e=>e.recordSource)&&<Alert className="section-row" type="info" showIcon message="September 2026 employee register loaded" description="Imported employee master data is for prototype testing. Source branch information is retained; Viyellatex affiliation is a demo-tenant mapping, not independently verified."/>}
        <Row gutter={[20,20]} className="section-row employee-stats-row">
          {statCard('Total Employee',scopedEmployees.length,'Company scope',<TeamOutlined/>)}
          {statCard('Active',activeCount,'Active employee records',<CheckCircleOutlined/>)}
          {statCard('Inactive',inactiveCount,'Inactive employee records',<UserOutlined/>)}
          {statCard('New Joiners',newJoiners,'Joined in last 30 days',<PlusOutlined/>)}
        </Row>
        <Card title="Employee List" className="section-row" extra={<Text type="secondary">{filteredEmployees.length} of {scopedEmployees.length} employees</Text>}>
          <Row gutter={[12,12]} className="section-row">
            <Col xs={24} md={8}><Input.Search allowClear placeholder="Search employee ID, name, email or phone" value={employeeSearch} onChange={e=>setEmployeeSearch(e.target.value)}/></Col>
            <Col xs={12} md={5}><Select style={{width:'100%'}} value={employeeDeptFilter} onChange={setEmployeeDeptFilter} options={[{label:'All departments',value:'All'},...departments.map(x=>({label:x,value:x}))]}/></Col>
            <Col xs={12} md={5}><Select style={{width:'100%'}} value={employeeDesignationFilter} onChange={setEmployeeDesignationFilter} options={[{label:'All designations',value:'All'},...designations.map(x=>({label:x,value:x}))]}/></Col>
            <Col xs={12} md={4}><Select style={{width:'100%'}} value={employeeStatusFilter} onChange={setEmployeeStatusFilter} options={['All','Active','Inactive'].map(x=>({label:x==='All'?'All statuses':x,value:x}))}/></Col>
            <Col xs={12} md={2}><Button block onClick={()=>{setEmployeeSearch('');setEmployeeDeptFilter('All');setEmployeeDesignationFilter('All');setEmployeeStatusFilter('All')}}>Reset</Button></Col>
          </Row>
          {filteredEmployees.length ? <Table rowKey="id" size="middle" dataSource={filteredEmployees} scroll={{x:1100}} pagination={{pageSize:10,showSizeChanger:true,pageSizeOptions:[10,20,50],showTotal:t=>`${t} employees`}} columns={[
            {title:'Emp ID',key:'employeeCode',dataIndex:'employeeCode',width:140, sorter:(a:any,b:any)=>String(a.employeeCode).localeCompare(String(b.employeeCode))},
            {title:'Employee',key:'name',dataIndex:'name',width:220, sorter:(a:any,b:any)=>String(a.name).localeCompare(String(b.name)),render:(v:any,r:any)=><Space><Avatar src={employeePhoto(r.employeeCode)} icon={<UserOutlined/>}/><Space direction="vertical" size={0}><b>{v}</b><Text type="secondary">{r.title||'Designation not set'}</Text></Space></Space>},
            {title:'Email',key:'email',dataIndex:'email',render:(v:any)=>v||'—'},
            {title:'Phone',key:'phone',dataIndex:'phone',render:(v:any)=>v||'—'},
            {title:'Designation',key:'title',dataIndex:'title',render:(v:any)=>v||'—'},
            {title:'Department',key:'dept',dataIndex:'dept',render:(v:any)=>v||'—'},
            {title:'Branch / Unit',key:'branch',render:(_:any,r:any)=><span>{r.branch||'—'}{r.unit?` / ${r.unit}`:''}</span>},
            {title:'Joining Date',key:'joiningDate',dataIndex:'joiningDate',render:(v:any)=>v||'—'},
            {title:'Status',key:'status',dataIndex:'status',render:(v:any)=><Tag color={v==='Inactive'?'red':'green'}>{v||'Active'}</Tag>},
            {title:'Lifecycle',key:'lifecycle',render:(_:any,r:any)=><Button size="small" onClick={()=>openLifecycle(r.id)}>Manage</Button>}
          ].filter((c:any) => showEmployeeField('Employee Directory',String(c.key)))}/> : <Empty description="No employees match these filters. Adjust filters or add an employee."/>}
        </Card>

      </>
    }
    if (page === 'employee-lifecycle') return employeeLifecyclePage()
    if (page === 'employee-enrollment') return employeeEnrollmentPage()
    if (page === 'employee-import') return employeeImportPage()
    if (page === 'employee-photos') return employeePhotosPage()
    // v0.9.35: effective-dated, read-only attendance mapping preview from approved ELM requests.
    // No punch, employee, device, or roster records are mutated by this resolver.
    const attendanceLifecyclePreview = scopedEmployees.flatMap(emp => {
      const relevant = lifecycleRequests.filter(r => r.companyId === auth?.companyId && r.employeeId === emp.id && r.status !== 'Rejected')
      return relevant.filter(r => ['Transfer','Separation'].includes(r.action)).map(r => {
        const today = new Date().toISOString().slice(0,10)
        const approved = ['Applied','Approved — Scheduled'].includes(r.status)
        const effective = approved && r.effectiveDate <= today
        const oldSite = String(r.before?.branch || emp.branch || 'Not assigned')
        const nextSite = r.action === 'Transfer' ? String(r.changes?.branch || oldSite) : 'Not applicable (separated)'
        const state = !approved ? 'Pending approval — no change' : !effective ? 'Scheduled — no change yet' : r.action === 'Separation' ? 'Post-separation punches require review' : 'Effective — verify device/site mapping'
        return {id:r.id, employee:emp.name, action:r.action, oldSite, nextSite, effectiveDate:r.effectiveDate, state}
      })
    })
    if (page === 'attendance') return <AttendanceLab employees={scopedEmployees} companyId={auth?.companyId || ''} role={auth?.role || 'hr'} actorEmail={auth?.email || ''} rosters={rosters.filter(r=>r.companyId===auth?.companyId)} onLoadUatRoster={loadAttendanceUatRoster} />
    if (page === '__attendance_legacy') return <><div className="page-heading"><div><Title level={2}>Attendance management</Title><Text type="secondary">Punch events, mapping exceptions and integration health.</Text></div></div><Row gutter={[16,16]}>{statCard('Punch events',data.punches.length,'Loaded punch records',<DatabaseOutlined/>)}{statCard('Exceptions',exceptions.length,'Require identity or status review',<ClockCircleOutlined/>)}{statCard('Accepted',data.punches.length-exceptions.length,'Accepted events',<CheckCircleOutlined/>)}</Row><Card title="Device punch events" className="section-row">{table(data.punches,[{title:'Event',dataIndex:'id'},{title:'Employee',dataIndex:'employee'},{title:'Punch card',dataIndex:'card'},{title:'Time',dataIndex:'time'},{title:'Device',dataIndex:'device'},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={v==='Accepted'?'green':'orange'}>{v}</Tag>}])}</Card><Card title="ELM → Attendance effective-date review (v0.9.35)" className="section-row"><Alert type="info" showIcon message="Read-only company-scoped mapping review" description="Approved transfers and separations are evaluated against today's date. Pending requests never change attendance interpretation. Device/site mappings and raw punches are not automatically modified."/>{attendanceLifecyclePreview.length ? table(attendanceLifecyclePreview,[{title:'Employee',dataIndex:'employee'},{title:'Action',dataIndex:'action'},{title:'Previous site',dataIndex:'oldSite'},{title:'Proposed site',dataIndex:'nextSite'},{title:'Effective date',dataIndex:'effectiveDate'},{title:'Attendance review status',dataIndex:'state',render:v=><Tag color={v.startsWith('Effective')||v.startsWith('Post-')?'orange':'blue'}>{v}</Tag>}]) : <Text type="secondary">No transfer or separation requests for this company. Create and approve an ELM request to preview attendance implications.</Text>}</Card><Card title="Effective shift resolution preview" className="section-row"><Text type="secondary">Resolved from company policy, effective employee assignments and Published roster snapshots. Draft and Pending Approval rows are ignored.</Text>{table(scopedEmployees.slice(0,50).map(e=>({id:e.id,name:e.name,shift:resolveShiftForDate(e.id,new Date().toISOString().slice(0,10))})),[{title:'Employee',key:'name',dataIndex:'name'},{title:'Effective shift today',render:(_,r)=>r.shift?.name||'No shift resolved'},{title:'Working time',render:(_,r)=>r.shift?`${r.shift.start} – ${r.shift.end}`:'—'},{title:'Source',render:(_,r)=>r.shift?.source||'—'}])}</Card><Alert className="section-row" type="warning" showIcon message="Device integration remains outside this prototype" description="The schedule resolver is demonstrated here, but punch import, device synchronization, attendance calculation and payroll posting still require backend implementation."/></>
    if (page === 'leave') return <><div className="page-heading"><div><Title level={2}>Leave management & approvals</Title><Text type="secondary">Company-scoped requests, balance checks and two-level approval workflow.</Text></div></div><Alert type="info" showIcon message="Approval sequence" description="Level 1: Reporting Manager. Level 2: HR Manager. Final approval deducts recorded balance; Level 1 approval does not deduct leave."/><Card title="Leave requests" className="section-row">{table(data.leave || [],[{title:'Request',dataIndex:'id'},{title:'Employee',dataIndex:'employee'},{title:'Leave type',dataIndex:'type'},{title:'Dates',dataIndex:'dates'},{title:'Days',dataIndex:'days'},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={/approved/i.test(v)?'green':/pending/i.test(v)?'gold':'default'}>{v}</Tag>},{title:'Approval progress',render:(_,r)=><Space direction="vertical" size={0}><Text>Level 1 · {r.approvalSteps?.[0]?.status || (/pending hr/i.test(r.status)?'Approved':'Pending')}</Text><Text>Level 2 · {r.approvalSteps?.[1]?.status || (/pending manager/i.test(r.status)?'Waiting':'Pending')}</Text></Space>},{title:'Review action',render:(_,r)=><Space><Button size="small" type="primary" disabled={auth.role==='manager'?!/pending level 1|pending manager/i.test(r.status):!/pending level 2|pending hr/i.test(r.status)} onClick={()=>updateLeave(r.id,'Approved')}>Approve L{auth.role==='manager'?1:2}</Button><Button size="small" danger disabled={auth.role==='manager'?!/pending level 1|pending manager/i.test(r.status):!/pending level 2|pending hr/i.test(r.status)} onClick={()=>updateLeave(r.id,'Rejected')}>Reject</Button></Space>}])}</Card>{auth.role!=='manager'&&<Card title="Leave balance register" extra={<Button type="primary" onClick={()=>setBalanceOpen(true)}>Record leave balance</Button>} className="section-row">{(data.leaveBalances||[]).length?table(data.leaveBalances||[],[{title:'Employee',dataIndex:'employeeName'},{title:'Leave type',dataIndex:'type'},{title:'Entitled',dataIndex:'entitled'},{title:'Used',dataIndex:'used'},{title:'Available',dataIndex:'remaining'},{title:'Recorded by',dataIndex:'recordedBy'}]):<Alert type="warning" message="No leave balances recorded. Employees cannot submit leave requests until HR records a balance for each employee and leave type."/>}</Card>}</>
    if (['shifts','shiftsetup','shiftassign','rosterplanning','rosterpublish'].includes(page)) return <>
      {page!=='shiftassign'&&<div className="page-heading"><div><Title level={2}>{titleMap[page] || "Shift & Roster"}</Title><Text type="secondary">Use the six dedicated menu screens in sequence; saved company data is shared across screens.</Text></div><Space wrap><Button onClick={loadShiftRosterSample}>Load sample dataset</Button><Button onClick={()=>{setRosters(prev=>prev.filter(r=>!String(r.id).startsWith("SAMPLE-")));setAssignments(prev=>prev.filter(a=>!String(a.id).startsWith("SAMPLE-")));setShiftRecords(prev=>prev.filter(s=>!String(s.id).startsWith("SAMPLE-")));message.success("Sample shift and roster rows removed.")}}>Remove sample rows</Button></Space></div>}
      {page==='shifts'&&<><div className="section-row"><Button size="small" onClick={()=>setWorkflowGuideOpen(v=>!v)} style={{background:workflowGuideOpen?'#e9f7ef':'#fff',borderColor:workflowGuideOpen?'#a5d6b8':'#d9d9d9',color:workflowGuideOpen?'#17603d':'#555',fontWeight:600}}>{workflowGuideOpen?'Hide Workflow Guide':'Show Workflow Guide'}</Button>{workflowGuideOpen&&<Alert style={{marginTop:10}} type="info" showIcon message="Workflow overview" description="Complete setup, assignments, planning, publication, then Attendance. Existing saved data remains unchanged."/>}</div>      <Row gutter={[16,16]}>{statCard('Shift definitions',shiftRecords.length,'Company-specific',<ClockCircleOutlined/>)}{statCard('Active shifts',shiftRecords.filter(s=>s.status==='Active').length,'Available for assignment',<CheckCircleOutlined/>)}{statCard('Employee assignments',assignments.length,'Effective-dated',<TeamOutlined/>)}{statCard('Published roster entries',rosters.filter(r=>r.status==='Published').length,'Locked and employee-visible',<CalendarOutlined/>)}</Row>
      <Card title="Workflow completion & next actions" className="section-row"><Alert showIcon type="info" message="Assignments are not lost when the table shows only the first page" description="This tracker uses saved company records. It counts distinct employees with active effective-dated assignments and the selected month's roster records; check dates, publication and employee coverage before attendance."/><Row gutter={[12,12]} style={{marginTop:12}}><Col xs={12} md={6}><Statistic title="Active assignment records" value={assignments.filter(a=>a.companyId===auth?.companyId&&a.status==='Active').length}/></Col><Col xs={12} md={6}><Statistic title="Assigned employees" value={new Set(assignments.filter(a=>a.companyId===auth?.companyId&&a.status==='Active').map(a=>a.employeeId)).size}/></Col><Col xs={12} md={6}><Statistic title={`Roster days (${rosterMonth})`} value={rosters.filter(r=>r.companyId===auth?.companyId&&r.date.startsWith(rosterMonth)).length}/></Col><Col xs={12} md={6}><Statistic title="Published roster days" value={rosters.filter(r=>r.companyId===auth?.companyId&&r.date.startsWith(rosterMonth)&&r.status==='Published').length}/></Col></Row><Steps direction="vertical" size="small" style={{marginTop:12}} items={[{title:'A. Save employee shift assignments',status:assignments.some(a=>a.companyId===auth?.companyId&&a.status==='Active')?'finish':'wait',description:'Check all saved rows in section 02; the register is paginated.'},{title:'B. Generate date-specific roster',status:rosters.some(r=>r.companyId===auth?.companyId&&r.date.startsWith(rosterMonth))?'finish':'process',description:'Go to section 03 and select the month. Existing employee/date rows are preserved.'},{title:'C. Review and publish roster',status:rosters.some(r=>r.companyId===auth?.companyId&&r.date.startsWith(rosterMonth))&&rosters.filter(r=>r.companyId===auth?.companyId&&r.date.startsWith(rosterMonth)).every(r=>r.status==='Published')?'finish':'wait',description:'Draft records need approval/publication; published records alone are used for attendance.'},{title:'D. Sync punches and resolve exceptions',status:'wait',description:'Attendance → Devices & sync, then Process & finalize.'},{title:'E. Finalize attendance',status:'wait',description:'Finalize each day only when exceptions are resolved.'}]}/><Space wrap><Button onClick={()=>document.getElementById('shift-assignments-workspace')?.scrollIntoView({behavior:'smooth'})}>View all assignments</Button><Button type="primary" onClick={()=>document.getElementById('roster-publication-workspace')?.scrollIntoView({behavior:'smooth'})}>Next: Create / publish roster</Button></Space></Card><div id="shift-assignments-workspace"></div></>}
      {page==='shiftsetup'&&<>      <Card title="00 · Company Shift & Roster Policy" className="section-row">
        <Alert type="info" showIcon message="Configurable per company" description="Choose how the attendance schedule is resolved. Hybrid is recommended for companies with both fixed office schedules and rotating operational rosters." />
        <Form layout="vertical" initialValues={{...activeShiftPolicy,holidayDates:(activeShiftPolicy.holidayDates||[]).join(', ')}} onFinish={saveShiftPolicy}>
          <Row gutter={16}>
            <Col xs={24} md={10}><Form.Item name="assignmentMethod" label="Shift assignment method" rules={[{required:true}]}><Select options={[{label:'Employee-based',value:'employee'},{label:'Roster / Calendar-based',value:'roster'},{label:'Hybrid with approval (recommended)',value:'hybrid'}]}/></Form.Item></Col>
            <Col xs={24} md={7}><Form.Item name="approvalRequired" label="Roster approval required" rules={[{required:true}]}><Select options={[{label:'Yes — submit and approve',value:true},{label:'No — HR may publish directly',value:false}]}/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="approvalLevels" label="Approval levels" initialValue={1}><Select options={[{label:'1 level',value:1},{label:'2 levels',value:2}]}/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="level1Role" label="Level 1 reviewer" initialValue="hr"><Select options={[{label:'HR Manager',value:'hr'},{label:'Company Admin',value:'company'},{label:'Manager',value:'manager'}]}/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="level2Role" label="Level 2 reviewer" initialValue="company"><Select options={[{label:'Company Admin',value:'company'},{label:'HR Manager',value:'hr'},{label:'Manager',value:'manager'}]}/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="level1ApproverEmail" label="Level 1 assigned approver email"><Input type="email" placeholder="Optional — restrict to one account"/></Form.Item></Col><Col xs={24} md={8}><Form.Item name="level2ApproverEmail" label="Level 2 assigned approver email"><Input type="email" placeholder="Optional — restrict to one account"/></Form.Item></Col>
            <Col xs={24} md={7}><Form.Item name="employeeFutureVisible" label="Future published roster visibility"><Select options={[{label:'Visible',value:true},{label:'Current month only',value:false}]}/></Form.Item></Col>
          </Row>
          <Form.Item name="weeklyOffDays" label="Default weekly off days"><Select mode="multiple" options={[{label:'Saturday',value:6},{label:'Sunday',value:0},{label:'Monday',value:1},{label:'Tuesday',value:2},{label:'Wednesday',value:3},{label:'Thursday',value:4},{label:'Friday',value:5}]}/></Form.Item><Form.Item name="holidayDates" label="Company holiday dates (comma-separated YYYY-MM-DD)"><Input placeholder="2026-12-16, 2026-12-25"/></Form.Item>
          <Button type="primary" htmlType="submit">Save company policy</Button>
        </Form>
        <Alert className="section-row" type="warning" message="Prototype boundary" description="Policy settings are browser-local. The roster generator uses configured weekly offs and holiday dates; attendance resolution is a prototype preview, not a production calculation engine." />
      </Card>
      <Card title="01 · Shift Master" className="section-row"><Text type="secondary">End time earlier than or equal to start time represents an overnight shift.</Text>{!shiftEmployees.length&&<Alert className="section-row" type="info" showIcon message="No employee records are loaded" description="Create employee records from the Employee Directory before testing individual/bulk assignments and roster creation." action={<Button size="small" onClick={()=>go('employees')}>Open Employee Directory</Button>}/>}<Alert className="section-row" type="info" showIcon message="Garment industry sample shift patterns" description="Illustrative starting points only. Adjust working hours, breaks and grace periods to the company's approved policy before creating shifts."/>
      <Space wrap className="section-row">
        <Button onClick={()=>shiftForm.setFieldsValue({name:'General Day Shift',start:'08:00',end:'17:00',breakMin:60,lateGrace:10,earlyGrace:10})}>General Day · 08:00–17:00</Button>
        <Button onClick={()=>shiftForm.setFieldsValue({name:'Production A Shift',start:'07:00',end:'15:00',breakMin:45,lateGrace:5,earlyGrace:5})}>Production A · 07:00–15:00</Button>
        <Button onClick={()=>shiftForm.setFieldsValue({name:'Production B Shift',start:'15:00',end:'23:00',breakMin:45,lateGrace:5,earlyGrace:5})}>Production B · 15:00–23:00</Button>
        <Button onClick={()=>shiftForm.setFieldsValue({name:'Production Night Shift',start:'23:00',end:'07:00',breakMin:45,lateGrace:5,earlyGrace:5})}>Night · 23:00–07:00</Button>
      </Space><Form form={shiftForm} layout="vertical" onFinish={createShift}><Row gutter={12}><Col xs={24} md={8}><Form.Item name="name" label="Shift name" rules={[{required:true}]}><Input placeholder="General Day Shift"/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="start" label="Start time" initialValue="09:00" rules={[{required:true}]}><ShiftTimeSelect/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="end" label="End time" initialValue="18:00" rules={[{required:true}]}><ShiftTimeSelect/></Form.Item></Col><Col xs={12} md={3}><Form.Item name="breakMin" label="Break (min)" initialValue={60}><Input type="number" min={0}/></Form.Item></Col><Col xs={12} md={2}><Form.Item name="lateGrace" label="Late grace" initialValue={10}><Input type="number" min={0}/></Form.Item></Col><Col xs={12} md={3}><Form.Item name="earlyGrace" label="Early grace" initialValue={10}><Input type="number" min={0}/></Form.Item></Col></Row><Button type="primary" htmlType="submit">Create shift</Button></Form><div className="section-row">{table(shiftRecords,[{title:'Shift',dataIndex:'name'},{title:'Working time',render:(_,r)=><>{r.start} – {r.end}{r.end<=r.start&&<Tag color="blue">Overnight</Tag>}</>},{title:'Break',dataIndex:'breakMin',render:v=>`${v} min`},{title:'Late / early grace',render:(_,r)=>`${r.lateGrace} / ${r.earlyGrace} min`},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={v==='Active'?'green':'default'}>{v}</Tag>},{title:'Action',render:(_,r)=><Button size="small" onClick={()=>toggleShiftStatus(r.id)}>{r.status==='Active'?'Deactivate':'Activate'}</Button>}])}</div></Card>
</>}
      {page==='shiftassign'&&<>
      <Card className="section-row" title="02 · Employee Shift Assignment" extra={<Space><Button size="small" onClick={()=>Modal.info({title:'Assignment & roster help',width:620,content:<><p><b>Assignment is not publication.</b> A saved shift assignment becomes available to Attendance only after a date-specific roster is created and published.</p><p><b>Conflict rule:</b> Overlapping active assignments for the same employee are rejected. Bulk selection applies to the filtered employee list.</p></>})}>Help</Button></Space>}>
        <Row gutter={[12,12]} align="middle" className="section-row" style={{padding:'12px 0 18px',borderBottom:'1px solid #eef0f4',marginBottom:18}}>
          <Col><Button size="large" style={{background:'#e8f2ff',borderColor:'#91caff',color:'#1456a0',fontWeight:shiftAssignMode==='view'?700:500,boxShadow:shiftAssignMode==='view'?'0 0 0 3px #91caff':'none'}} onClick={()=>setShiftAssignMode('view')}>View Assignments</Button></Col>
          <Col><Select size="large" style={{minWidth:225}} className="shift-assign-action-select" placeholder={<span style={{color:'#17603d'}}>Assign employee shift</span>} value={shiftAssignMode==='single'||shiftAssignMode==='bulk'?shiftAssignMode:undefined} onChange={v=>setShiftAssignMode(v)} options={[{label:'Assign to one employee',value:'single'},{label:'Assign to multiple employees',value:'bulk'}]}/></Col>
          <Col><Button size="large" style={{background:'#fff4e5',borderColor:'#f2cb94',color:'#92520b',fontWeight:shiftAssignMode==='import'?700:500,boxShadow:shiftAssignMode==='import'?'0 0 0 3px #fcd34d':'none'}} onClick={()=>setShiftAssignMode('import')}>Import CSV / Excel</Button></Col>
          <Col><Button size="large" style={{background:'#f2edff',borderColor:'#c8b8f0',color:'#5836a0',fontWeight:shiftAssignMode==='default'?700:500,boxShadow:shiftAssignMode==='default'?'0 0 0 3px #c4b5fd':'none'}} onClick={()=>setShiftAssignMode('default')}>Employee Default Shift Register</Button></Col>
        </Row>
        {(shiftAssignMode==='single'||shiftAssignMode==='bulk')&&<div className="section-row"><Space wrap><Text strong>Check assignment month:</Text><Input type="month" value={rosterMonth} onChange={e=>setRosterMonth(e.target.value)} style={{width:170}}/><Text type="secondary">Status is based on active assignment dates; hover over a status to see shift coverage.</Text></Space></div>}
        {shiftAssignMode==='single'&&<><Form form={singleAssignForm} layout="vertical" onFinish={assignShift}><Title level={5}>Single employee assignment</Title><Row gutter={12}><Col xs={24} md={8}><Form.Item name="employeeId" label="Employee" rules={[{required:true}]}><Select showSearch optionFilterProp="label" options={shiftEmployees.map(e=>({label:`${e.name} · ${e.id} · ${assignmentMonthStatus(e.id).label} (${rosterMonth})`,value:e.id}))}/></Form.Item></Col><Col xs={24} md={6}><Form.Item name="shiftId" label="Active shift" rules={[{required:true}]}><Select options={shiftRecords.filter(s=>s.status==='Active').map(s=>({label:s.name,value:s.id}))}/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="effectiveFrom" label="Effective from" rules={[{required:true}]}><Input type="date"/></Form.Item></Col><Col xs={12} md={4}><Form.Item name="effectiveTo" label="Effective to"><Input type="date"/></Form.Item></Col><Col xs={24} md={2} className="section-row"><Button type="primary" htmlType="submit">Assign</Button></Col></Row></Form></>}
        {shiftAssignMode==='bulk'&&<><Form form={bulkAssignForm} layout="vertical" onFinish={bulkAssignShift}>
        <Title level={5}>Bulk employee assignment</Title>
        <Alert type="info" showIcon message="Select employees from the list" description="Search by employee name, ID or department. Select the employees you need, then choose one shift and effective period for the group."/>
        <Row gutter={12} align="bottom" className="section-row">
          <Col xs={24} md={8}><Input.Search value={rosterEmployeeSearch} onChange={e=>setRosterEmployeeSearch(e.target.value)} allowClear placeholder="Search name, employee ID, department, unit, branch or line"/></Col>
          <Col xs={12} md={4}><Select allowClear placeholder="Department" value={bulkDept||undefined} onChange={setBulkDept} options={uniqueField('dept')} style={{width:'100%'}}/></Col>
          <Col xs={12} md={3}><Select allowClear placeholder="Unit" value={bulkUnit||undefined} onChange={setBulkUnit} options={uniqueField('unit')} style={{width:'100%'}}/></Col>
          <Col xs={12} md={3}><Select allowClear placeholder="Branch" value={bulkBranch||undefined} onChange={setBulkBranch} options={uniqueField('branch')} style={{width:'100%'}}/></Col>
          <Col xs={12} md={3}><Select allowClear placeholder="Floor" value={bulkFloor||undefined} onChange={setBulkFloor} options={uniqueField('floor')} style={{width:'100%'}}/></Col>
          <Col xs={12} md={3}><Select allowClear placeholder="Line" value={bulkLine||undefined} onChange={setBulkLine} options={uniqueField('lineInfo')} style={{width:'100%'}}/></Col>
        </Row>
        <Space wrap className="section-row">
          <Button onClick={()=>{const ids=filteredBulkEmployees.map(e=>e.id);setBulkSelectedIds(prev=>[...new Set([...prev,...ids])]);bulkAssignForm.setFieldsValue({employeeIds:[...new Set([...bulkSelectedIds,...ids])]})}}>Select all {filteredBulkEmployees.length} filtered</Button>
          <Button onClick={()=>{setBulkSelectedIds([]);bulkAssignForm.setFieldsValue({employeeIds:[]})}}>Clear selection</Button>
          <Tag color="blue">{bulkSelectedIds.length} selected</Tag>
        </Space>
        <Form.Item name="employeeIds" hidden rules={[{required:true,message:'Select at least one employee'}]}><Select mode="multiple"/></Form.Item>
        <Table size="small" rowKey="id" dataSource={filteredBulkEmployees} pagination={{pageSize:8,showSizeChanger:true,pageSizeOptions:[8,20,50],showTotal:(total)=>`${total} matching employees`}} rowSelection={{selectedRowKeys:bulkSelectedIds,onChange:(keys)=>{const pageIds=filteredBulkEmployees.map(e=>e.id);const ids=[...bulkSelectedIds.filter(id=>!pageIds.includes(id)),...keys.map(String)];setBulkSelectedIds(ids);setShiftAssignResult(null);bulkAssignForm.setFieldsValue({employeeIds:ids})}}} columns={[{title:'Employee',key:'name',dataIndex:'name'},{title:'Employee ID',dataIndex:'id'},{title:`Assignment · ${rosterMonth}`,key:'assignmentStatus',render:(_:any,e:any)=>{const st=assignmentMonthStatus(e.id);return <span title={st.detail}><Tag color={st.color}>{st.label}</Tag></span>}},{title:'Department',key:'dept',dataIndex:'dept'},{title:'Unit',dataIndex:'unit'},{title:'Branch',dataIndex:'branch'},{title:'Floor',dataIndex:'floor'},{title:'Line',dataIndex:'lineInfo'}]} />
        <Row gutter={12} className="section-row">
          <Col xs={24} md={8}><Form.Item name="shiftId" label="Active shift" rules={[{required:true}]}><Select placeholder="Choose shift" options={shiftRecords.filter(s=>s.status==='Active').map(s=>({label:s.name,value:s.id}))}/></Form.Item></Col>
          <Col xs={12} md={6}><Form.Item name="effectiveFrom" label="Effective from" rules={[{required:true}]}><Input type="date"/></Form.Item></Col>
          <Col xs={12} md={6}><Form.Item name="effectiveTo" label="Effective to"><Input type="date"/></Form.Item></Col>
        </Row>
        <Button type="primary" htmlType="submit" disabled={!bulkSelectedIds.length}>Save assignments for {bulkSelectedIds.length} employee(s)</Button>
        
      </Form></>}
        {shiftAssignMode==='import'&&<><Title level={5}>Import employee shift assignments</Title><Text type="secondary">Download the template, complete employee ID, shift name and effective dates, then import. Existing assignment conflicts are skipped.</Text><div className="section-row"><Space wrap><Button onClick={()=>downloadShiftTemplate('csv')}>Download CSV template</Button><Button onClick={()=>downloadShiftTemplate('xlsx')}>Download Excel template</Button><Button type="primary" icon={<CloudUploadOutlined/>} onClick={()=>document.getElementById('shift-assignment-import')?.click()}>Choose CSV / Excel file</Button><input id="shift-assignment-import" type="file" accept=".csv,.xlsx,.xls" style={{display:'none'}} onChange={e=>{const file=e.target.files?.[0];if(file)void importShiftFile(file);e.currentTarget.value=''}}/></Space></div></>}
{shiftAssignResult&&<Card className="section-row" size="small" title={<Space><CheckCircleOutlined style={{color:shiftAssignResult.skipped.length?'#d48806':'#389e0d'}}/>Shift Assignment Result</Space>} extra={<Button size="small" onClick={()=>setShiftAssignResult(null)}>Close</Button>}>
          <Row gutter={12}><Col span={8}><Statistic title="Processed" value={shiftAssignResult.saved+shiftAssignResult.skipped.length}/></Col><Col span={8}><Statistic title="Saved" value={shiftAssignResult.saved} valueStyle={{color:'#389e0d'}}/></Col><Col span={8}><Statistic title="Skipped" value={shiftAssignResult.skipped.length} valueStyle={{color:shiftAssignResult.skipped.length?'#d48806':undefined}}/></Col></Row>
          {shiftAssignResult.skipped.length>0&&<details open={shiftResultDetailsOpen} onToggle={e=>setShiftResultDetailsOpen(e.currentTarget.open)} style={{marginTop:12}}><summary style={{cursor:'pointer',fontWeight:600}}>Review {shiftAssignResult.skipped.length} skipped / invalid record(s)</summary><div style={{maxHeight:230,overflowY:'auto',marginTop:8}}>{shiftAssignResult.skipped.map((reason,i)=><div key={i} style={{padding:'6px 0',borderBottom:'1px solid #eee'}}>{reason}</div>)}</div><Text type="secondary">Review the listed validation errors or overlapping effective dates before retrying. Skipped records were not saved.</Text></details>}
          <Space wrap style={{marginTop:14}}><Button type="primary" onClick={()=>{setShiftAssignMode('view');setShiftAssignResult(null)}}>View Saved Assignments</Button>{shiftAssignResult.skipped.length>0&&<Button onClick={()=>setShiftResultDetailsOpen(true)}>Review Errors / Duplicates</Button>}</Space>
        </Card>}
        {shiftAssignMode==='view'&&<><Title level={5}>Existing Shift Assignments</Title><Row gutter={[12,12]} className="section-row"><Col xs={24} md={8}><Input.Search allowClear placeholder="Search employee name or ID" value={shiftAssignSearch} onChange={e=>setShiftAssignSearch(e.target.value)}/></Col><Col xs={24} md={6}><Select allowClear style={{width:'100%'}} placeholder="All shifts" value={shiftAssignShiftFilter||undefined} onChange={v=>setShiftAssignShiftFilter(v||'')} options={shiftRecords.filter(x=>x.companyId===auth?.companyId).map(x=>({label:x.name,value:x.id}))}/></Col></Row><Row gutter={12} className="section-row"><Col xs={12} md={8}><Card size="small"><Statistic title="Saved assignment records" value={assignments.filter(a=>a.companyId===auth?.companyId).length}/></Card></Col><Col xs={12} md={8}><Card size="small"><Statistic title="Assigned employees" value={new Set(assignments.filter(a=>a.companyId===auth?.companyId&&a.status==='Active').map(a=>a.employeeId)).size}/></Card></Col><Col xs={24} md={8}><Card size="small"><Statistic title="Active assignments" value={assignments.filter(a=>a.companyId===auth?.companyId&&a.status==='Active').length}/></Card></Col></Row>{table(assignments.filter(a=>a.companyId===auth?.companyId&&(!shiftAssignShiftFilter||a.shiftId===shiftAssignShiftFilter)&&(!shiftAssignSearch||String(a.employeeName||'').toLowerCase().includes(shiftAssignSearch.toLowerCase())||String(a.employeeId||'').toLowerCase().includes(shiftAssignSearch.toLowerCase()))).map(a=>({...a,shiftName:shiftRecords.find(x=>x.id===a.shiftId)?.name||'Shift unavailable'})),[{title:'Employee',dataIndex:'employeeName'},{title:'Employee ID',dataIndex:'employeeId'},{title:'Shift',dataIndex:'shiftName'},{title:'Effective from',dataIndex:'effectiveFrom'},{title:'Effective to',dataIndex:'effectiveTo',render:v=>v||'Open-ended'},{title:'Status',dataIndex:'status',render:v=><Tag color={v==='Active'?'green':'default'}>{v}</Tag>}])}</>}
        {shiftAssignMode==='default'&&<div className="section-row">
          <Title level={5}>Employee Default Shift Register</Title>
          <Text type="secondary">Save a regular shift, change it with an effective date, correct a mistake, or deactivate it. Published/locked rosters are protected. All changes are recorded in the audit log.</Text>
          <Form layout="inline" className="section-row" onFinish={v=>setDefaultEmployeeShift(v.employeeId,v.shiftId,v.effectiveFrom)}>
            <Form.Item name="employeeId" rules={[{required:true}]}><Select showSearch placeholder="Employee" style={{minWidth:210}} options={shiftEmployees.map(e=>({label:`${e.name} · ${e.id}`,value:e.id}))}/></Form.Item>
            <Form.Item name="shiftId" rules={[{required:true}]}><Select placeholder="Default shift" style={{minWidth:180}} options={shiftRecords.filter(x=>x.companyId===auth?.companyId&&x.status==='Active').map(x=>({label:x.name,value:x.id}))}/></Form.Item>
            <Form.Item name="effectiveFrom" rules={[{required:true}]}><Input type="date"/></Form.Item>
            <Button type="primary" htmlType="submit">Save default</Button>
          </Form>
          <div className="section-row"><Input.Search allowClear placeholder="Filter history by employee name or ID" style={{maxWidth:340}} value={defaultHistoryEmployee} onChange={e=>setDefaultHistoryEmployee(e.target.value)}/></div>
          {table(assignments.filter(a=>a.companyId===auth?.companyId&&a.isDefault&&(!defaultHistoryEmployee||String(a.employeeName||'').toLowerCase().includes(defaultHistoryEmployee.toLowerCase())||String(a.employeeId||'').toLowerCase().includes(defaultHistoryEmployee.toLowerCase()))).slice().sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom)),[
            {title:'Employee',dataIndex:'employeeName'},
            {title:'Default shift',render:(_:any,r:any)=>shiftRecords.find(x=>x.id===r.shiftId)?.name||'—'},
            {title:'Effective from',dataIndex:'effectiveFrom'},
            {title:'Effective to',dataIndex:'effectiveTo',render:(v:any)=>v||'Open-ended'},
            {title:'Status',dataIndex:'status',render:(v:any)=><Tag color={v==='Active'?'green':'default'}>{v}</Tag>},
            {title:'Actions',render:(_:any,r:any)=>r.status==='Active'?<Space wrap>
              <Button size="small" onClick={()=>{setDefaultEdit({...r,operation:'change'});setDefaultEditShift(r.shiftId);setDefaultEditFrom('')}}>Change</Button>
              <Button size="small" onClick={()=>{setDefaultEdit({...r,operation:'correct'});setDefaultEditShift(r.shiftId);setDefaultEditFrom(r.effectiveFrom)}}>Edit</Button>
              <Button size="small" danger onClick={()=>deactivateDefaultShift(r)}>Deactivate</Button>
              <Button size="small" onClick={()=>setDefaultHistoryEmployee(r.employeeId)}>History</Button>
            </Space>:<Button size="small" onClick={()=>setDefaultHistoryEmployee(r.employeeId)}>History</Button>}
          ])}
          <Modal title={defaultEdit?.operation==='change'?'Change default shift':'Correct default shift record'} open={!!defaultEdit} onCancel={()=>setDefaultEdit(null)} onOk={()=>{if(defaultEdit?.operation==='change')changeDefaultShift(defaultEdit,defaultEditShift,defaultEditFrom);else if(defaultEdit)correctDefaultShift(defaultEdit,defaultEditShift,defaultEditFrom)}} okText={defaultEdit?.operation==='change'?'Save new effective period':'Save correction'} destroyOnHidden>
            <p>{defaultEdit?.employeeName} — {defaultEdit?.operation==='change'?'Existing period will be closed one day before the new start date.':'Correct the active record; changes are logged.'}</p>
            <Form layout="vertical"><Form.Item label="Default shift" required><Select value={defaultEditShift} onChange={setDefaultEditShift} options={shiftRecords.filter(x=>x.companyId===auth?.companyId&&x.status==='Active').map(x=>({label:x.name,value:x.id}))}/></Form.Item><Form.Item label="Effective from" required><Input type="date" value={defaultEditFrom} onChange={e=>setDefaultEditFrom(e.target.value)}/></Form.Item></Form>
          </Modal>
        </div>}
      </Card>
      </>}
      {page==='rosterplanning'&&<><Card title="04 · Monthly Roster Planning" className="section-row"><Alert type="warning" showIcon message="Lifecycle" description="Every new roster entry starts as Draft. Drafts are HR-only. Published entries are locked. Publishing a roster is schedule publication, not attendance or payroll approval."/><Alert className="section-row" type="info" showIcon message="Garment roster planning" description="Create date-specific assignments by production line or department. Typical examples include sewing, cutting, finishing, quality and maintenance. The generator creates weekly-off and configured holiday rows. Rotating-pattern automation is not included."/><Card size="small" title="Monthly calendar generator" className="section-row"><Form layout="inline" onFinish={generateMonthlyRoster}><Form.Item label="Roster month"><Input type="month" value={rosterMonth} onChange={e=>setRosterMonth(e.target.value)}/></Form.Item><Form.Item name="department" initialValue="All"><Select style={{minWidth:160}} value={calendarDept} onChange={setCalendarDept} options={[{label:'All departments',value:'All'},...Array.from(new Set(shiftEmployees.map(e=>e.dept||e.department).filter(Boolean))).map(x=>({label:String(x),value:String(x)}))]}/></Form.Item><Form.Item name="branch" initialValue="All"><Select style={{minWidth:150}} value={calendarBranch} onChange={setCalendarBranch} options={[{label:'All branches',value:'All'},...Array.from(new Set(shiftEmployees.map(e=>e.branch).filter(Boolean))).map(x=>({label:String(x),value:String(x)}))]}/></Form.Item><Button type="primary" htmlType="submit">Generate month from defaults + weekly offs</Button></Form><Text type="secondary">Creates one date row per matching employee. Existing employee/date rows are never overwritten. The generator uses effective-dated active assignments, including bulk assignments, or employee defaults. Employees without a matching shift are skipped except weekly-off dates.</Text></Card><Card size="small" title={`Saved Monthly Roster · ${rosterMonth}`} className="section-row">
  <Space wrap style={{marginBottom:12}}><Text strong>Roster month</Text><Input type="month" value={rosterMonth} onChange={e=>setRosterMonth(e.target.value)} style={{width:170}}/><Tag color="blue">{rosters.filter(r=>r.companyId===auth?.companyId&&String(r.date||'').startsWith(rosterMonth)).length} saved day(s)</Tag><Button onClick={()=>setPage('rosterpublish')}>Review &amp; Publish</Button></Space>
  {table(rosters.filter(r=>r.companyId===auth?.companyId&&String(r.date||'').startsWith(rosterMonth)).map(r=>({...r,employeeName:r.employeeName||shiftEmployees.find(e=>e.id===r.employeeId)?.name||r.employeeId})),[{title:'Date',dataIndex:'date'},{title:'Employee',dataIndex:'employeeName'},{title:'Employee ID',dataIndex:'employeeId'},{title:'Shift / Day',dataIndex:'shiftName'},{title:'Status',dataIndex:'status',render:(v:string)=><Tag color={v==='Published'?'green':v==='Draft'?'orange':'blue'}>{v}</Tag>}])}
  <Text type="secondary">This register shows saved records for the selected month. Generating again skips existing employee/date records; it does not overwrite them. Review Draft entries before publication.</Text>{!rosters.some(r=>r.companyId===auth?.companyId&&String(r.date||"").startsWith(rosterMonth))&&<Alert style={{marginTop:12}} type="info" showIcon message={`No saved roster for ${rosterMonth}`} description={<Space direction="vertical"><Text>Check the selected company and month. Saved records are browser-local and cannot be loaded from another hostname automatically.</Text><Text>For a fresh UAT session, explicitly load synthetic sample shifts, assignments and roster days for this month. Existing non-sample records will be preserved.</Text><Button type="primary" onClick={loadShiftRosterSample} disabled={shiftEmployees.length<2}>Load demo roster for {rosterMonth}</Button>{shiftEmployees.length<2&&<Text type="danger">At least two employees must exist for this company before sample roster data can be loaded.</Text>}</Space>}/>}
</Card><Card size="small" title="Shift change requests" className="section-row"><Form layout="inline" onFinish={createShiftChangeRequest}><Form.Item name="employeeId" rules={[{required:true}]}><Select placeholder="Employee" style={{minWidth:190}} options={shiftEmployees.map(e=>({label:e.name,value:e.id}))}/></Form.Item><Form.Item name="shiftId" rules={[{required:true}]}><Select placeholder="New shift" style={{minWidth:170}} options={shiftRecords.filter(x=>x.companyId===auth?.companyId&&x.status==='Active').map(x=>({label:x.name,value:x.id}))}/></Form.Item><Form.Item name="effectiveFrom" rules={[{required:true}]}><Input type="date"/></Form.Item><Form.Item name="effectiveTo"><Input type="date" placeholder="End date"/></Form.Item><Form.Item name="changeType" initialValue="Temporary"><Select options={[{label:'Temporary',value:'Temporary'},{label:'Permanent',value:'Permanent'}]}/></Form.Item><Button htmlType="submit" type="primary">Request change</Button></Form>{table(shiftChangeRequests.filter(x=>x.companyId===auth?.companyId),[{title:'Employee',dataIndex:'employeeName'},{title:'Change',dataIndex:'changeType'},{title:'Shift',dataIndex:'shiftName'},{title:'Effective from',dataIndex:'effectiveFrom'},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={v==='Approved'?'green':v==='Rejected'?'red':'blue'}>{v}</Tag>},{title:'Requested by',dataIndex:'requestedBy'},{title:'Reviewed by',dataIndex:'reviewedBy',render:v=>v||'—'},{title:'Actions',render:(_,r)=><Space><Button size="small" type="primary" disabled={r.status!=='Pending Approval'||!['hr','company'].includes(auth.role)} onClick={()=>decideShiftChange(r.id,'Approved')}>Approve</Button><Button size="small" danger disabled={r.status!=='Pending Approval'||!['hr','company'].includes(auth.role)} onClick={()=>decideShiftChange(r.id,'Rejected')}>Reject</Button></Space>}])}</Card>
</Card></>}
      {page==='rosterpublish'&&<><Card title="05 · Roster Review & Publish" className="section-row"><Alert type="info" showIcon message={activeShiftPolicy.approvalRequired?"Roster approval enabled by company policy":"Review and publish draft rosters"} description={activeShiftPolicy.approvalRequired?"Submit drafts for approval; authorized reviewers can approve them. Published rosters become available to Attendance.":"Authorized HR Managers and Company Admins can publish selected Draft entries directly. Published entries are locked and available to Attendance."}/>      <Form form={rosterForm} layout="inline" onFinish={createRoster}><Form.Item name="employeeId" rules={[{required:true}]}><Select showSearch placeholder="Employee" style={{minWidth:220}} options={shiftEmployees.map(e=>({label:`${e.name} · ${e.id}`,value:e.id}))}/></Form.Item><Form.Item name="shiftId" rules={[{required:true}]}><Select placeholder="Active shift" style={{minWidth:190}} options={shiftRecords.filter(s=>s.status==='Active').map(s=>({label:s.name,value:s.id}))}/></Form.Item><Form.Item name="date" rules={[{required:true}]}><Input type="date"/></Form.Item><Button type="primary" htmlType="submit">Add Draft</Button></Form><div className="section-row"><Space wrap><Button type="primary" disabled={!selectedRosterIds.some(id=>rosters.some(r=>r.id===id&&r.companyId===auth?.companyId&&(activeShiftPolicy.approvalRequired?r.status==='Draft':['Draft','Pending Approval','Pending Level 2'].includes(r.status))))} onClick={()=>activeShiftPolicy.approvalRequired?requestRosterApproval(selectedRosterIds):publishRoster(selectedRosterIds)}>{activeShiftPolicy.approvalRequired?'Submit selected for approval':'Publish Selected'} ({selectedRosterIds.length})</Button>{activeShiftPolicy.approvalRequired&&<Button disabled={!selectedRosterIds.length} onClick={()=>approveRoster(selectedRosterIds)}>Approve selected pending</Button>}<Button onClick={()=>setSelectedRosterIds(rosters.filter(r=>['Draft','Pending Approval','Pending Level 2'].includes(r.status)&&r.companyId===auth?.companyId).map(r=>r.id))}>Select All Unpublished</Button><Button onClick={()=>setSelectedRosterIds([])}>Clear selection</Button></Space></div>{table(rosters.filter(r=>r.companyId===auth?.companyId),[{title:'Select',render:(_,r)=><input type="checkbox" disabled={!['Draft','Pending Approval','Pending Level 2'].includes(r.status)} checked={selectedRosterIds.includes(r.id)} onChange={e=>setSelectedRosterIds(prev=>e.target.checked?[...prev,r.id]:prev.filter(id=>id!==r.id))}/>},{title:'Date',dataIndex:'date'},{title:'Employee',dataIndex:'employeeName'},{title:'Shift',dataIndex:'shiftName'},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={v==='Published'?'green':v==='Pending Approval'?'blue':v==='Pending Level 2'?'purple':'gold'}>{v}</Tag>},{title:'Submitted by',dataIndex:'submittedBy',render:v=>v||'—'},{title:'Level 1 reviewer',dataIndex:'level1ApprovedBy',render:v=>v||'—'},{title:'Level 2 / final approver',dataIndex:'approvedBy',render:v=>v||'—'},{title:'Published at',dataIndex:'publishedAt',render:v=>v?new Date(v).toLocaleString():'—'},{title:'Action',render:(_,r)=><Space>{activeShiftPolicy.approvalRequired&&<Button size="small" disabled={r.status!=='Draft'} onClick={()=>requestRosterApproval(r.id)}>Submit</Button>}{activeShiftPolicy.approvalRequired&&<Button size="small" type="primary" disabled={!['Pending Approval','Pending Level 2'].includes(r.status)} onClick={()=>approveRoster(r.id)}>Approve</Button>}<Button size="small" disabled={activeShiftPolicy.approvalRequired||!['Draft','Pending Approval','Pending Level 2'].includes(r.status)||!['hr','company'].includes(auth?.role||'')} onClick={()=>publishRoster(r.id)}>Publish</Button></Space>}])}</Card>
</>}
    </>
    if (page === 'rosterreport') {
      const monthRows = rosters.filter(r=>r.companyId===auth?.companyId&&r.date.startsWith(rosterMonth))
      const publishedRows = monthRows.filter(r=>r.status==='Published')
      const draftRows = monthRows.filter(r=>r.status==='Draft')
      const daysInMonth = new Date(Number(rosterMonth.slice(0,4)),Number(rosterMonth.slice(5,7)),0).getDate()
      const shiftDistribution = shiftRecords.filter(s=>s.companyId===auth?.companyId).map(s=>({id:s.id,name:s.name,published:publishedRows.filter(r=>r.shiftId===s.id).length,draft:draftRows.filter(r=>r.shiftId===s.id).length}))
      const employeeSummary = scopedEmployees.map(e=>({id:e.id,name:e.name,department:e.dept||'—',published:publishedRows.filter(r=>r.employeeId===e.id).length,draft:draftRows.filter(r=>r.employeeId===e.id).length})).filter(r=>r.published+r.draft>0)
      const dailyRows = [...monthRows].sort((a,b)=>a.date.localeCompare(b.date)||String(a.employeeName).localeCompare(String(b.employeeName)))
      return <>
        <div className="page-heading"><div><Title level={2}>Monthly Shift & Roster</Title><Text type="secondary">Company-wide monthly roster publication, shift distribution and daily employee schedule.</Text></div><Space><Button onClick={loadShiftRosterSample}>Load sample dataset</Button><Button onClick={()=>go('shifts')}>Manage shifts & rosters</Button></Space></div>
        <Space className="section-row"><Text>Report month</Text><Input type="month" value={rosterMonth} onChange={e=>setRosterMonth(e.target.value)} style={{width:160}}/><Tag color="blue">{company?.name||'Company scope'}</Tag></Space>
        <Row gutter={[16,16]} className="section-row">{statCard('Employees',scopedEmployees.length,'Company scope',<TeamOutlined/>)}{statCard('Published entries',publishedRows.length,'Published schedule rows',<CheckCircleOutlined/>)}{statCard('Draft entries',draftRows.length,'Not employee-visible',<CalendarOutlined/>)}{statCard('Pending approval',monthRows.filter(r=>['Pending Approval','Pending Level 2'].includes(r.status)).length,'Awaiting authorized review',<ClockCircleOutlined/>)}{statCard('Days in month',daysInMonth,'Calendar period',<CalendarOutlined/>)}</Row>
        <Card title="Shift-wise monthly distribution" className="section-row">
          {shiftDistribution.length?table(shiftDistribution,[{title:'Shift',dataIndex:'name'},{title:'Published entries',dataIndex:'published'},{title:'Draft entries',dataIndex:'draft'},{title:'Total',render:(_,r)=>r.published+r.draft}]):<Empty description="No shift definitions for this company."/>}
          <Text type="secondary">Counts are date-specific roster entries for the selected month; normal employee shift assignments are not included.</Text>
        </Card>
        <Card title="Employee-wise monthly roster" className="section-row">
          {employeeSummary.length?table(employeeSummary,[{title:'Employee',key:'name',dataIndex:'name'},{title:'Department',dataIndex:'department'},{title:'Published',dataIndex:'published'},{title:'Draft',dataIndex:'draft'},{title:'Total',render:(_,r)=>r.published+r.draft}]):<Empty description="No roster entries in this month. Create entries in Shift Management or load the sample dataset."/>}
        </Card>
        <Card title="Monthly employee calendar" className="section-row"><Text type="secondary">Published shift, pending/draft and weekly-off markers for each employee and date.</Text><Table size="small" rowKey="id" dataSource={scopedEmployees.filter(e=>(calendarDept==='All'||(e.dept||e.department)===calendarDept)&&(calendarBranch==='All'||e.branch===calendarBranch)).slice(0,60)} pagination={{pageSize:10}} scroll={{x:true}} columns={[{title:'Employee',key:'name',dataIndex:'name',fixed:'left',width:180},...Array.from({length:daysInMonth},(_,i)=>({title:String(i+1),key:`d${i+1}`,width:54,align:'center' as const,render:(_:any,e:any)=>{const date=`${rosterMonth}-${String(i+1).padStart(2,'0')}`;const r=monthRows.find(x=>x.employeeId===e.id&&x.date===date);if(!r)return <Text type="secondary">·</Text>;return <Tag color={r.shiftId==='OFF'?'default':r.status==='Published'?'green':['Pending Approval','Pending Level 2'].includes(r.status)?'blue':'gold'}>{r.shiftId==='OFF'?'OFF':(r.shiftName||'Shift').split(' ')[0]}</Tag>}}))]} /></Card><Card title="Daily roster entry list" className="section-row" extra={<Text type="secondary">{dailyRows.length} entries</Text>}>
          {dailyRows.length?table(dailyRows,[{title:'Date',dataIndex:'date'},{title:'Weekday',render:(_,r)=>new Date(`${r.date}T12:00:00`).toLocaleDateString(undefined,{weekday:'long'})},{title:'Employee',dataIndex:'employeeName'},{title:'Shift',dataIndex:'shiftName'},{title:'Working time',render:(_,r)=>{const s=r.shiftSnapshot||shiftRecords.find(x=>x.id===r.shiftId);return s?`${s.start} – ${s.end}${s.end<=s.start?' (overnight)':''}`:'Shift details unavailable'}},{title:'Status',key:'status',dataIndex:'status',render:v=><Tag color={v==='Published'?'green':v==='Pending Approval'?'blue':v==='Pending Level 2'?'purple':'gold'}>{v}</Tag>},{title:'Published by',dataIndex:'publishedBy',render:v=>v||'—'},{title:'Published at',dataIndex:'publishedAt',render:v=>v?new Date(v).toLocaleString():'—'}]):<Empty description="No daily roster rows for this month."/>}
        </Card>
        <Card title="Roster visibility preferences" className="section-row">
          <Form layout="inline" initialValues={rosterPrefs} onFinish={v=>{setRosterPrefs(v);localStorage.setItem(`${TEST_DATA_KEY}:roster-prefs`,JSON.stringify(v));message.success('Roster visibility preferences saved for this demo session.')}}>
            <Form.Item name="hrDefault" label="HR default view"><Select options={['Current month','Next month','Current + Next month'].map(x=>({label:x,value:x}))}/></Form.Item>
            <Form.Item name="employeeDefault" label="Employee default view"><Select options={['Current month','Next month','Current + Next month'].map(x=>({label:x,value:x}))}/></Form.Item>
            <Form.Item name="employeeFutureVisible" label="Future published rosters"><Select options={[{label:'Visible',value:true},{label:'Current month only',value:false}]}/></Form.Item>
            <Button type="primary" htmlType="submit">Save preferences</Button>
          </Form>
          <Alert className="section-row" type="info" message="Draft rosters remain HR-only. Employee visibility applies only to Published entries. Preferences are stored in this browser demo only."/>
        </Card>
      </>
    }
    if (page === 'ot') return <LeaveOtUat employees={scopedEmployees} companyId={auth?.companyId || ''} role={auth?.role || 'hr'} actor={auth?.persona || 'HR User'}/> 
     if (page === 'payroll') return <PayrollDemo employees={scopedEmployees} companyId={auth?.companyId || ''} role={auth?.role || 'hr'}/> 
     if (page === 'settings') return <><div className="page-heading"><div><Title level={2}>Company setup</Title><Text type="secondary">Configure organization, shifts, attendance, leave, holidays and payroll rules.</Text></div></div><Alert type="warning" showIcon message="Company policy setup is illustrative" description="The legacy setup wizard has seven configuration sections. This React page provides the setup map; detailed policy field editing is not yet ported."/><Row gutter={[16,16]} className="section-row">{['Organization & calendar','Shift configuration','Attendance policy','Leave policy','Holidays & calendars','Payroll & approvals','Review & complete'].map((x,i)=><Col xs={24} md={12} lg={8} key={x}><Card><Avatar>{i+1}</Avatar><Title level={5}>{x}</Title><Tag color="orange">Review required</Tag></Card></Col>)}</Row></>
    return <Empty description="Page not available" />
  }

  const shiftSubPages=['shifts','shiftsetup','shiftassign','rosterplanning','rosterpublish','rosterreport']
  const menuItems: MenuProps['items'] = menu.some(x=>x.key==='shifts') ? [...menu.filter(x=>!shiftSubPages.includes(x.key)).slice(0,3).map(x=>({key:x.key,icon:x.icon,label:x.label})),{key:'shift-workflow-menu',icon:<ClockCircleOutlined/>,label:'Shift & Roster',children:menu.filter(x=>shiftSubPages.includes(x.key)).map(x=>({key:x.key,icon:x.icon,label:x.label}))},...menu.filter(x=>!shiftSubPages.includes(x.key)).slice(3).map(x=>({key:x.key,icon:x.icon,label:x.label}))] : menu.map(x=>({key:x.key,icon:x.icon,label:x.label}))
  return <Layout className="native-app-shell"><Sider width={248} collapsed={collapsed} className="native-sider"><div className="native-brand"><Avatar shape="square" size={40} icon={<AppstoreOutlined/>}/>{!collapsed&&<div><b>NREE HRMS</b><Text>A product by Pro-Edge</Text></div>}</div><div className="native-workspace-label">{auth.role === 'superadmin' ? 'PLATFORM WORKSPACE' : auth.role === 'employee' ? 'EMPLOYEE SELF SERVICE' : auth.role === 'manager' ? 'MANAGER WORKSPACE' : 'COMPANY WORKSPACE'}</div><Menu theme="dark" mode="inline" selectedKeys={[page]} defaultOpenKeys={['shift-workflow-menu']} items={menuItems} onClick={({key})=>go(key)}/><div className="native-sider-footer">{!collapsed&&<><Text>{auth.persona}</Text><Text type="secondary">{auth.email}</Text></>}<Button type="text" danger icon={<LogoutOutlined/>} onClick={logout}>{collapsed?'':'Sign out'}</Button></div></Sider><Layout><Header className="native-topbar"><Space><Button type="text" icon={collapsed?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>} onClick={()=>setCollapsed(!collapsed)}/><div><Text type="secondary">UNIVERSAL HUMAN RESOURCES MANAGEMENT</Text><div><b>{titleMap[page] || page}</b></div></div></Space><Space wrap><Tag color="blue">Prototype v{APP_VERSION}</Tag><Tag color={company ? "geekblue" : "orange"}>{company ? `${company.name} · ${company.code}` : auth.role === "superadmin" ? "Platform-wide" : `Company not mapped · ${auth.companyId || "No company ID"}`}</Tag><Button size="small" type="primary" onClick={loadFullDemo}>Load full demo</Button><Button size="small" danger onClick={resetTestData}>Reset test data</Button><Avatar icon={<UserOutlined/>}/></Space></Header><Content className="native-page-content">{pageContent()}</Content><footer className="native-footer">v{APP_VERSION} · React-native workspace · Legacy reference records + optional synthetic demo dataset · Browser-local prototype data · No live HRMS/API/database connection</footer></Layout>
    <Modal title="Record employee leave balance" open={balanceOpen} onCancel={()=>setBalanceOpen(false)} footer={null} destroyOnClose><Form form={balanceForm} layout="vertical" onFinish={recordBalance}><Form.Item name="employeeId" label="Employee" rules={[{required:true}]}><Select showSearch options={leaveEmployeeOptions.map(e=>({label:`${e.name} · ${e.id}`,value:e.id}))}/></Form.Item><Form.Item name="type" label="Leave type" rules={[{required:true}]}><Select options={['Annual Leave','Casual Leave','Sick Leave','Maternity Leave','Paternity Leave','Other'].map(x=>({label:x,value:x}))}/></Form.Item><Row gutter={12}><Col span={12}><Form.Item name="entitled" label="Entitled days" rules={[{required:true}]}><Input type="number" min={0}/></Form.Item></Col><Col span={12}><Form.Item name="used" label="Already used" initialValue={0} rules={[{required:true}]}><Input type="number" min={0}/></Form.Item></Col></Row><Form.Item name="reference" label="Reference note"><Input/></Form.Item><Button block type="primary" htmlType="submit">Save leave balance</Button></Form></Modal>
    <Modal title="New company enrollment draft" open={enrollOpen} onCancel={()=>setEnrollOpen(false)} footer={null} destroyOnClose><Form form={form} layout="vertical" onFinish={createCompany}><Form.Item name="name" label="Legal company name" rules={[{required:true}]}><Input placeholder="Example Manufacturing Ltd."/></Form.Item><Form.Item name="code" label="Company code" rules={[{required:true}]}><Input placeholder="EXAMPLE"/></Form.Item><Form.Item name="industry" label="Industry" initialValue="Manufacturing"><Select options={['Manufacturing','Services','Retail','Trading','Healthcare','Education','Other'].map(x=>({label:x,value:x}))}/></Form.Item><Form.Item name="branch" label="Primary branch / office" rules={[{required:true}]}><Input/></Form.Item><Form.Item name="adminEmail" label="Initial administrator email" rules={[{required:true,type:'email'}]}><Input/></Form.Item><Form.Item name="modules" label="Modules" initialValue={['Employee Lifecycle Management (ELM)','Organization']}><Select mode="multiple" options={data.modules.map(m=>({label:m.name,value:m.name}))}/></Form.Item><Button type="primary" htmlType="submit" block>Create draft</Button></Form></Modal>
  </Layout>
}
